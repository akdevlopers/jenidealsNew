import { apiRequest } from '../lib/axios'

export const checkoutService = {
  // Get available payment options
  async getPaymentOptions(country) {
    try {
      const response = await apiRequest('/paymentOptions', {
        method: 'POST',
        body: JSON.stringify({
          country: country.toString()
        })
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Get payment charges (shipping & tax)
  async getPaymentCharges(totalAmount, paymentType, country) {
    try {
      let payload = {}
      if (typeof totalAmount === 'object' && totalAmount !== null) {
        payload = {
          totalamount: (totalAmount.totalAmount ?? totalAmount.totalamount ?? 0).toString(),
          paymenttype: (totalAmount.paymentType ?? totalAmount.paymenttype ?? totalAmount.paymentOptionId ?? '').toString(),
          country: (totalAmount.country ?? '').toString()
        }
      } else if (paymentType === undefined && country === undefined) {
        // Fallback for legacy single argument call (country)
        payload = {
          totalamount: '0',
          paymenttype: '',
          country: (totalAmount ?? '').toString()
        }
      } else {
        payload = {
          totalamount: (totalAmount ?? 0).toString(),
          paymenttype: (paymentType ?? '').toString(),
          country: (country ?? '').toString()
        }
      }

      const response = await apiRequest('/paymentCharges', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Check coupon validity
  async checkCoupon(userId, productIds, couponId, totalAmount, country) {
    try {
      const response = await apiRequest('/couponCheck', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId.toString(),
          productIds: productIds, // Format: "attributeId-qty,attributeId-qty"
          couponId: couponId,
          totalAmount: totalAmount,
          country: country.toString()
        })
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Place order / checkout
  async placeOrder(orderData) {
    try {
      const response = await apiRequest('/checkOut', {
        method: 'POST',
        body: JSON.stringify(orderData)
      })
      return response
    } catch (error) {
      throw error
    }
  }
}
