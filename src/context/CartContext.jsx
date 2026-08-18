'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useCountry } from './CountryContext'

const CartContext = createContext()

const CART_STORAGE_KEY = 'shopping_cart'

export function CartProvider({ children }) {
  const [cart, setCart] = useState([])
  const [loading, setLoading] = useState(true)
  const { country, isLoading: countryLoading } = useCountry()
  const [prevCountryId, setPrevCountryId] = useState(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) {
          setCart(parsed.filter(Boolean))
        }
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }, [])

  // Set initial previous country once country is loaded
  useEffect(() => {
    if (!countryLoading && country?.id && prevCountryId === null) {
      setPrevCountryId(country.id)
    }
  }, [country, countryLoading, prevCountryId])

  // Reset cart when country changes (not on initial load)
  useEffect(() => {
    if (!loading && !countryLoading && country?.id && prevCountryId !== null && country.id !== prevCountryId) {
      setCart([])
      setPrevCountryId(country.id)
    }
  }, [country, countryLoading, loading, prevCountryId])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (!loading) {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart || []))
    }
  }, [cart, loading])

  const addToCart = (product, quantity = 1) => {
    if (!product || !product.id) return
    setCart(prevCart => {
      const currentCart = prevCart || []
      
      // Extract proper attribute_id from productAttributeDetails or explicit selection
      const attributes = product.productAttributeDetails || (product.raw && product.raw.productAttributeDetails) || [];
      const firstAttr = attributes[0] || {};
      const targetAttrId = product.attribute_id || product.attributeId || product.product_attribute_id || product.variant_id || firstAttr.id || product.id;
      
      const productWithAttribute = {
        ...product,
        attribute_id: targetAttrId,
        raw: product.raw || product
      }

      // Check if this item with this specific attribute is already in cart
      const existingIndex = currentCart.findIndex(item =>
        item && item.id === product.id && (String(item.attribute_id || '') === String(targetAttrId || ''))
      )
      
      if (existingIndex > -1) {
        // Update quantity if matching item and variant already in cart
        return currentCart.map((item, idx) =>
          idx === existingIndex
            ? { ...item, ...productWithAttribute, quantity: (item.quantity || 0) + quantity }
            : item
        )
      } else {
        // Add new item to cart with attribute_id
        return [...currentCart, { ...productWithAttribute, quantity }]
      }
    })
  }

  const removeFromCart = (productIds, attributeId = null) => {
    if (!productIds) return
    setCart(prevCart => {
      const updated = (prevCart || []).filter(item => {
        if (!item || !item.id) return false
        if (attributeId !== null && attributeId !== undefined) {
          return !(String(item.id) === String(productIds) && String(item.attribute_id) === String(attributeId))
        }
        if (Array.isArray(productIds)) {
          const ids = productIds.map(id => String(id))
          return !ids.includes(String(item.id))
        }
        return String(item.id) !== String(productIds)
      })
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(updated))
        } catch (e) {
        }
      }
      return updated
    })
  }

  const updateQuantity = (productId, quantity, attributeId = null) => {
    if (quantity <= 0) {
      removeFromCart(productId, attributeId)
      return
    }
    
    setCart(prevCart =>
      (prevCart || []).map(item => {
        if (!item || item.id !== productId) return item
        if (attributeId !== null && attributeId !== undefined) {
          return String(item.attribute_id) === String(attributeId) ? { ...item, quantity } : item
        }
        return { ...item, quantity }
      })
    )
  }

  const clearCart = () => {
    setCart([])
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify([]))
      } catch (e) {
      }
    }
  }

  const getCartTotal = () => {
    return (cart || []).reduce((total, item) => {
      if (!item) return total
      const price = parseFloat(item.offer_price || item.price || 0)
      return total + (price * (item.quantity || 1))
    }, 0)
  }

  const getCartCount = () => {
    return (cart || []).reduce((count, item) => count + (item?.quantity || 0), 0)
  }

  const isInCart = (productId, attributeId = null) => {
    return (cart || []).some(item => {
      if (!item || item.id !== productId) return false
      if (attributeId !== null && attributeId !== undefined) {
        return String(item.attribute_id) === String(attributeId)
      }
      return true
    })
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartCount,
        isInCart,
      }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within CartProvider')
  }
  return context
}
