import { apiRequest } from '../lib/axios'

// In-memory cache for order API responses
const orderCache = new Map()
const CACHE_DURATION = 2 * 60 * 1000 // 2 minutes in ms (shorter for orders since they change)

/**
 * Helper function to get cached data or fetch new
 */
const getCachedOrFetch = async (cacheKey, fetchFn) => {
  const now = Date.now()
  const cached = orderCache.get(cacheKey)

  if (cached && now - cached.timestamp < CACHE_DURATION) {
    return cached.data
  }

  const data = await fetchFn()
  orderCache.set(cacheKey, { data, timestamp: now })
  return data
}

export const orderService = {
  /**
   * Get order list
   * @param {string} userId 
   * @param {number} page - Page number (starts from 1)
   * @param {number} perPage - Items per page
   * @param {string} countryId 
   * @returns {Promise}
   */
  async getOrders(userId, page = 1, perPage = 10, countryId) {
    const cacheKey = `orders-${userId}-${page}-${perPage}-${countryId}`
    return getCachedOrFetch(cacheKey, async () => {
      const response = await apiRequest('/orderList', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId.toString(),
          page: page,
          perPage: perPage,
          country: countryId.toString()
        })
      })
      return response
    })
  },

  /**
   * Get order details
   * @param {string} orderId 
   * @param {string} userId 
   * @param {string} countryId 
   * @returns {Promise}
   */
  async getOrderDetails(orderId, userId, countryId) {
    const cacheKey = `order-details-${orderId}-${userId}-${countryId}`
    return getCachedOrFetch(cacheKey, async () => {
      const response = await apiRequest('/orderView', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId.toString(),
          orderId: orderId.toString(),
          country: countryId ? countryId.toString() : '2'
        })
      })
      return response
    })
  },

  /**
   * Get tour booking list via Next.js internal CORS proxy route for http://jenideals.akprojects.co/holidays/api/booking/list
   * @param {string} userId 
   * @param {string} countryId 
   * @returns {Promise}
   */
  async getBookingList(userId, countryId) {
    const cacheKey = `booking-list-${userId}-${countryId}`
    return getCachedOrFetch(cacheKey, async () => {
      const countryVal = countryId ? countryId.toString() : '2'
      const userVal = userId ? userId.toString() : ''

      try {
        const userToken = typeof window !== 'undefined' ? localStorage.getItem('authToken') : ''
        const headers = {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        }
        if (userToken) {
          headers['Authorization'] = userToken.startsWith('Bearer ') ? userToken : `Bearer ${userToken}`
        }

        const response = await fetch('/api/holidays/booking-list', {
          method: 'POST',
          headers,
          body: JSON.stringify({
            userId: userVal,
            user_id: userVal,
            country: countryVal,
            countryId: countryVal,
            token: userToken || undefined
          })
        })

        if (response.ok) {
          const data = await response.json()
          return data
        }
      } catch (err) {
      }

      return { status: false, message: 'Failed to fetch tour bookings' }
    })
  },

  /**
   * Submit product review
   * @param {Object} params
   * @param {string} params.userId
   * @param {string} params.orderDetailId
   * @param {string} params.orderId
   * @param {number|string} params.rating
   * @param {string} params.review
   * @returns {Promise}
   */
  async reviewProduct({ userId, orderDetailId, orderId, rating, review }) {
    const response = await apiRequest('/reviewProduct', {
      method: 'POST',
      body: JSON.stringify({
        userId: userId.toString(),
        orderDetailId: orderDetailId.toString(),
        orderId: orderId.toString(),
        rating: rating.toString(),
        review: review || ''
      })
    })
    return response
  },

  /**
   * Clear all order cache (useful when user places a new order)
   */
  clearOrderCache() {
    orderCache.clear()
  }
}
