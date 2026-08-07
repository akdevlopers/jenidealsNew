import { apiRequest } from '../lib/axios'

export const addressService = {
  // Get all addresses for a user
  async getAddresses(userId, country) {
    try {
      const response = await apiRequest('/addresslist', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId.toString(),
          country: country.toString()
        })
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Add new address
  async addAddress(addressData) {
    try {
      const response = await apiRequest('/addAddress', {
        method: 'POST',
        body: JSON.stringify(addressData)
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Update address
  async updateAddress(addressData) {
    try {
      const response = await apiRequest('/editAddress', {
        method: 'POST',
        body: JSON.stringify(addressData)
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Delete address
  async deleteAddress(addressId, userId, country) {
    try {
      const response = await apiRequest('/deleteAddress', {
        method: 'POST',
        body: JSON.stringify({
          userId: userId.toString(),
          addressId: addressId.toString(),
          country: country.toString()
        })
      })
      return response
    } catch (error) {
      throw error
    }
  },

  // Mark address as default
  async markAsDefault(addressId, userId, country, addressData = null) {
    try {
      // If addressData is provided, send full address details
      // Otherwise, send minimal data (some APIs need full address to update default)
      const payload = addressData ? {
        addressId: addressId.toString(),
        userId: userId.toString(),
        country: country.toString(),
        name: addressData.shipping_name,
        phone: addressData.shipping_phone,
        address: addressData.shipping_address,
        city: addressData.city || addressData.area || '',
        state: addressData.state,
        pincode: addressData.pincode || '',
        landmark: addressData.area || '',
        address_type: addressData.address_type || 'home'
      } : {
        addressId: addressId.toString(),
        userId: userId.toString(),
        country: country.toString()
      }
      
      const response = await apiRequest('/markAsDefaultAddress', {
        method: 'POST',
        body: JSON.stringify(payload)
      })
      return response
    } catch (error) {
      throw error
    }
  }
}
