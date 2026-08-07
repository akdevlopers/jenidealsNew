'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
  MapPin,
  Plus,
  CreditCard,
  Wallet,
  Banknote,
  CheckCircle2,
  ChevronRight,
  ChevronDown,
  Package,
  Truck,
  ShieldCheck,
  ArrowLeft,
  Edit2,
  Home,
  Briefcase,
  Trash2,
  Star,
  MoreVertical,
  X,
  User,
  Phone
} from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { useAuth } from '../../src/context/AuthContext'
import { useCart } from '../../src/context/CartContext'
import { useCountry } from '../../src/context/CountryContext'
import { addressService } from '../../src/services/addressService'
import { checkoutService } from '../../src/services/checkoutService'
import { authService } from '../../src/services/authService'
import { getProductDetails } from '../../src/services/homeService'

const EMIRATES = ['Abu Dhabi', 'Dubai', 'Sharjah', 'Ajman', 'Umm Al Quwain', 'Ras Al Khaimah', 'Fujairah'];

function ConfirmationModal({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirm", isDangerous = false }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[100000] flex items-center justify-center p-4">
      {/* Backdrop overlay */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
      />
      {/* Modal Box */}
      <div className="relative w-full max-w-sm transform rounded-2xl bg-white p-6 shadow-xl border border-line transition-all duration-300 scale-100 flex flex-col text-left">
        <h3 className="font-display text-lg font-bold text-navy">{title}</h3>
        <p className="mt-2 text-sm text-fg-muted leading-relaxed">
          {message}
        </p>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-line bg-surface px-5 py-2.5 text-xs font-bold text-fg hover:bg-gray-50 transition-colors active:scale-95"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-colors active:scale-95 shadow-md ${isDangerous
                ? 'bg-red-600 hover:bg-red-700 shadow-red-500/10'
                : 'bg-orange hover:bg-orange-deep shadow-orange-500/10'
              }`}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [currentStep, setCurrentStep] = useState(1) // 1: Address, 2: Payment, 3: Review
  const [selectedAddress, setSelectedAddress] = useState(null)
  const [paymentMethod, setPaymentMethod] = useState(null)
  const [paymentMethods, setPaymentMethods] = useState([])
  const [addresses, setAddresses] = useState([])
  const [showAddressModal, setShowAddressModal] = useState(false)
  const [showSelectAddressModal, setShowSelectAddressModal] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [loading, setLoading] = useState(true)
  const [orderPlaced, setOrderPlaced] = useState(false) // Track if order is placed
  const [paymentCharges, setPaymentCharges] = useState({ shippingCharge: 0, tax: 0, codCharge: 0, otherCharges: 0 })
  const [chargesList, setChargesList] = useState([])
  const [isChargesLoading, setIsChargesLoading] = useState(false)

  // Wallet & Coupon
  const [walletBalance, setWalletBalance] = useState(0)
  const [useWallet, setUseWallet] = useState(false)
  const [couponCode, setCouponCode] = useState('')
  const [couponDiscount, setCouponDiscount] = useState(0)
  const [appliedCoupon, setAppliedCoupon] = useState(null)
  const [isCouponApplying, setIsCouponApplying] = useState(false)
  const [showCouponModal, setShowCouponModal] = useState(false)
  const [couponModalType, setCouponModalType] = useState('success') // 'success' or 'error'
  const [couponModalMessage, setCouponModalMessage] = useState('')

  // Popups & Alerts
  const [deleteAddressId, setDeleteAddressId] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'error' })

  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { cart, getCartTotal, clearCart, removeFromCart } = useCart()
  const { price: formatPrice, country } = useCountry()
  const router = useRouter()
  
  // Buy Now state
  const [isBuyNow, setIsBuyNow] = useState(false)
  const [buyNowItem, setBuyNowItem] = useState(null)

  // Helper to remove ordered items from cart page & storage
  const removeOrderedItemsFromCart = () => {
    const items = getCheckoutItems()
    const orderedIds = items.filter(item => item && item.id).map(item => item.id)

    // Store ordered product IDs in sessionStorage for order success/callback sync
    if (typeof window !== 'undefined') {
      try {
        sessionStorage.setItem('last_ordered_product_ids', JSON.stringify(orderedIds))
      } catch (e) {
      }
    }

    // Always remove ordered items from cart
    if (orderedIds.length > 0) {
      removeFromCart(orderedIds)
    }

    if (isBuyNow) {
      sessionStorage.removeItem('buyNowItem')
      localStorage.removeItem('buyNowItem')
    } else {
      clearCart()
    }
  }

  const [newAddress, setNewAddress] = useState({
    type: 'home',
    name: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    pincode: '',
    landmark: ''
  })
  const [editingAddress, setEditingAddress] = useState(null)
  const [showEmiratesDropdown, setShowEmiratesDropdown] = useState(false)

  const resetAddressForm = () => {
    setNewAddress({
      type: 'home',
      name: '',
      phone: '',
      address: '',
      city: '',
      state: '',
      pincode: '',
      landmark: ''
    })
    setEditingAddress(null)
    setShowEmiratesDropdown(false)
  }

  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    
    // Check if this is a Buy Now checkout - do this FIRST before any redirects
    const searchParams = new URLSearchParams(window.location.search)
    if (searchParams.get('buynow') === 'true') {
      setIsBuyNow(true)
      // Try sessionStorage first, fallback to localStorage
      let buyNowData = sessionStorage.getItem('buyNowItem')
      if (!buyNowData) {
        buyNowData = localStorage.getItem('buyNowItem')
      }
      if (buyNowData) {
        const item = JSON.parse(buyNowData)
        setBuyNowItem(item)
        // Store in sessionStorage if it was loaded from localStorage
        if (!sessionStorage.getItem('buyNowItem')) {
          sessionStorage.setItem('buyNowItem', buyNowData)
        }
      }
    }
    
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Helper to get checkout items (either cart or single buy now item)
  const getCheckoutItems = () => {
    if (isBuyNow && buyNowItem) {
      return [buyNowItem].filter(item => item && item.id)
    }
    return (cart || []).filter(item => item && item.id)
  }

  // Helper to get checkout total
  const getCheckoutTotal = () => {
    if (isBuyNow && buyNowItem) {
      const price = parseFloat(buyNowItem.offer_price || buyNowItem.price || 0)
      const quantity = buyNowItem.quantity || buyNowItem.selected_quantity || 1
      return price * quantity
    }
    return getCartTotal()
  }

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: '', type: 'error' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.message])

  useEffect(() => {
    // Wait for auth check to complete before redirecting
    if (authLoading) {
      return
    }
    
    // Check URL for Buy Now mode
    const searchParams = new URLSearchParams(window.location.search)
    const hasBuyNowParam = searchParams.get('buynow') === 'true'
    
    if (!isAuthenticated) {
      // Store return URL for post-login redirect
      const returnUrl = hasBuyNowParam ? '/checkout?buynow=true' : '/checkout'
      sessionStorage.setItem('returnUrl', returnUrl)
      router.push('/user/login')
    } else if (!hasBuyNowParam && cart.length === 0 && !orderPlaced) {
      // Only redirect to cart if not Buy Now mode and cart is empty
      router.push('/cart')
    } else if (hasBuyNowParam && !orderPlaced) {
      // If Buy Now mode but no item in sessionStorage, redirect to home
      const buyNowData = sessionStorage.getItem('buyNowItem') || localStorage.getItem('buyNowItem')
      if (!buyNowData) {
        router.push('/')
      } else if (user) {
        fetchAddresses()
        fetchPaymentMethods()
        fetchWalletBalance()
        fetchPaymentCharges()
      }
    } else if (user) {
      fetchAddresses()
      fetchPaymentMethods()
      fetchWalletBalance()
      fetchPaymentCharges()
    }
  }, [isAuthenticated, authLoading, cart, orderPlaced, router, user])

  useEffect(() => {
    if (paymentMethod && country?.id) {
      fetchPaymentCharges(paymentMethod)
    }
  }, [paymentMethod, country?.id])

  const fetchAddresses = async () => {
    try {
      if (!user?.id || !country?.id) return;
      setLoading(true)
      const response = await addressService.getAddresses(user.id, country.id)

      if (response?.status && response?.Data && response?.Data?.addressList) {
        const addressList = response.Data.addressList
        setAddresses(addressList)
        // Auto-select default address
        const defaultAddr = addressList.find(addr => addr && (addr.make_default == 1 || addr.isDefaultAddress == 1 || addr.is_default_address == 1))
        if (defaultAddr) {
          setSelectedAddress(defaultAddr)
        }
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const fetchPaymentMethods = async () => {
    try {
      if (!country?.id) return;
      const response = await checkoutService.getPaymentOptions(country.id)

      if (response?.status && response?.Data) {
        // Map API payment options to UI format dynamically
        const methods = response.Data.filter(Boolean).map(option => {
          const nameLower = (option.name || '').toLowerCase()
          let icon = CreditCard
          if (nameLower.includes('cod') || nameLower.includes('cash')) {
            icon = Banknote
          } else if (nameLower.includes('tabby') || nameLower.includes('tamara') || nameLower.includes('wallet')) {
            icon = Wallet
          }

          return {
            id: (option.id !== undefined && option.id !== null) ? option.id.toString() : '',
            name: option.name || '',
            icon: icon,
            description: option.description || ''
          }
        })
        setPaymentMethods(methods)
        if (methods.length > 0 && (paymentMethod === undefined || paymentMethod === null || paymentMethod === '')) {
          setPaymentMethod(methods[0].id)
          fetchPaymentCharges(methods[0].id)
        }
      }
    } catch (error) {
      // Fallback to default methods if API fails
      const defaultMethods = [
        {
          id: '1',
          name: 'Online Payment',
          icon: CreditCard,
          description: 'Pay with your card, upi'
        },
        {
          id: '0',
          name: 'Cash on Delivery',
          icon: Banknote,
          description: 'Pay when you receive'
        }
      ]
      setPaymentMethods(defaultMethods)
      if (paymentMethod === undefined || paymentMethod === null || paymentMethod === '') {
        setPaymentMethod(defaultMethods[0].id)
        fetchPaymentCharges(defaultMethods[0].id)
      }
    }
  }

  const fetchWalletBalance = async () => {
    try {
      if (!user?.id || !country?.id) return;
      const response = await authService.viewProfile(user.id, country.id)

      if (response && (response.status || response.Data)) {
        const userDetail = response.Data?.userDetails?.[0] || response.Data || response.data
        const bal = userDetail?.wallet_amount ?? userDetail?.walletAmount ?? response.Data?.wallet_amount ?? response.Data?.walletAmount ?? response.Data?.walletUsage?.value ?? 0
        const balance = parseFloat(bal) || 0
        setWalletBalance(balance)

        // Update user data in localStorage with latest wallet balance
        const currentUser = authService.getUserData()
        if (currentUser) {
          const updatedUser = { ...currentUser, wallet_amount: balance.toString() }
          localStorage.setItem('user', JSON.stringify(updatedUser))
        }
      }
    } catch (error) {
      setWalletBalance(0)
    }
  }

  const getDiscountedSubtotal = () => {
    return Math.max(0, getCheckoutTotal() - couponDiscount)
  }

  const handleSelectPaymentMethod = (methodId) => {
    if (methodId === undefined || methodId === null || methodId === '') return
    const selectedId = methodId.toString()
    setPaymentMethod(selectedId)
    fetchPaymentCharges(selectedId)
  }

  const fetchPaymentCharges = async (overridePaymentMethod, overrideCouponDiscount) => {
    try {
      if (!country?.id) return
      setIsChargesLoading(true)
      
      const currentCouponDisc = overrideCouponDiscount !== undefined ? overrideCouponDiscount : couponDiscount
      const discountedSubtotal = Math.max(0, getCheckoutTotal() - currentCouponDisc)
      const totalAmt = discountedSubtotal.toFixed(2)

      const selectedPayment = (overridePaymentMethod !== undefined && overridePaymentMethod !== null && overridePaymentMethod !== '')
        ? overridePaymentMethod.toString()
        : ((paymentMethod !== undefined && paymentMethod !== null) ? paymentMethod.toString() : '')
      
      const response = await checkoutService.getPaymentCharges(totalAmt, selectedPayment, country.id)

      if (response?.status && response?.Data && Array.isArray(response.Data)) {
        const charges = response.Data
        setChargesList(charges)

        let shippingCharge = 0
        let tax = 0
        let codCharge = 0
        let otherCharges = 0

        charges.forEach(c => {
          if (!c) return
          const val = parseFloat(c.value) || 0
          const nameLower = (c.name || '').toLowerCase()
          if (nameLower.includes('shipping')) {
            shippingCharge += val
          } else if (nameLower.includes('tax')) {
            tax += val
          } else if (nameLower.includes('cod')) {
            codCharge += val
          } else {
            otherCharges += val
          }
        })

        setPaymentCharges({ 
          shippingCharge, 
          tax,
          codCharge,
          otherCharges
        })
      }
    } catch (error) {
    } finally {
      setIsChargesLoading(false)
    }
  }

  const handleApplyCoupon = async () => {
    if (!user?.id || !country?.id) return;
    if (!couponCode.trim()) {
      setCouponModalType('error')
      setCouponModalMessage('Please enter a coupon code')
      setShowCouponModal(true)
      return
    }

    setIsCouponApplying(true)

    try {
      // Format product IDs: "attributeId-qty,attributeId-qty"
      const checkoutItemsList = (getCheckoutItems() || []).filter(item => item && item.id)
      const productIds = checkoutItemsList
        .map(item => {
          const attributeId = item.attribute_id || item.attributeId || 0
          return `${attributeId}-${item.quantity || 1}`
        })
        .join(',')

      const response = await checkoutService.checkCoupon(
        user.id,
        productIds,
        couponCode,
        getCartTotal().toFixed(2),
        country.id
      )

      if (response?.status && response?.Data) {
        const discount = parseFloat(response.Data.discount || response.Data.couponAmount || 0)
        setCouponDiscount(discount)
        setAppliedCoupon(couponCode)
        setCouponModalType('success')
        setCouponModalMessage(response.message || 'Coupon applied successfully!')
        setShowCouponModal(true)
        // Re-fetch payment charges with discounted subtotal
        fetchPaymentCharges(paymentMethod, discount)
      } else {
        setCouponModalType('error')
        setCouponModalMessage(response.message || 'Invalid coupon code')
        setShowCouponModal(true)
        setCouponCode('')
      }
    } catch (error) {
      setCouponModalType('error')
      setCouponModalMessage('Failed to apply coupon. Please try again.')
      setShowCouponModal(true)
    } finally {
      setIsCouponApplying(false)
    }
  }

  const handleRemoveCoupon = () => {
    setCouponCode('')
    setCouponDiscount(0)
    setAppliedCoupon(null)
    // Re-fetch payment charges with original subtotal
    fetchPaymentCharges(paymentMethod, 0)
  }

  const handleOpenMenu = () => {
    router.push('/categories')
  }

  const calculateShipping = () => {
    return paymentCharges.shippingCharge
  }

  const calculateTax = () => {
    return paymentCharges.tax
  }

  const calculateCODCharge = () => {
    return paymentCharges.codCharge
  }

  const isCODPayment = () => {
    if (paymentMethod === undefined || paymentMethod === null || paymentMethod === '') return false
    const strMethod = String(paymentMethod)
    if (strMethod === '0') return true
    const selected = paymentMethods.find(m => String(m.id) === strMethod)
    if (selected) {
      const nameLower = (selected.name || '').toLowerCase()
      return nameLower.includes('cod') || nameLower.includes('cash')
    }
    return false
  }

  const getTotalAmount = () => {
    const discountedSubtotal = Math.max(0, getCheckoutTotal() - couponDiscount)
    let total = discountedSubtotal + calculateShipping() + calculateTax() + calculateCODCharge() + (paymentCharges.otherCharges || 0)

    // Deduct wallet amount if wallet is used
    if (useWallet && walletBalance > 0) {
      const walletDeduction = Math.min(walletBalance, total)
      total = total - walletDeduction
    }

    return Math.max(0, total) // Ensure total is not negative
  }

  const getWalletDeduction = () => {
    if (!useWallet || walletBalance <= 0) return 0

    const discountedSubtotal = Math.max(0, getCheckoutTotal() - couponDiscount)
    let total = discountedSubtotal + calculateShipping() + calculateTax() + calculateCODCharge() + (paymentCharges.otherCharges || 0)
    return Math.min(walletBalance, total)
  }

  const handleAddressSelect = (address) => {
    setSelectedAddress(address)
  }

  const handleAddNewAddress = async (e) => {
    e.preventDefault()

    try {
      if (!user?.id || !country?.id) return;
      setIsProcessing(true)
      const isDefault = addresses.length === 0 ? 1 : 0
      const addressData = {
        userId: user.id.toString(),
        shipping_name: newAddress.name,
        shipping_phone: newAddress.phone,
        shipping_address: newAddress.address,
        city: newAddress.city,
        pincode: newAddress.pincode || '',
        state: newAddress.state || (country.id === '2' ? 'Abu Dhabi' : ''),
        area: newAddress.landmark || newAddress.city || '',
        isDefaultAddress: isDefault,
        shipping_email: user.email || '',
        countryId: country.id.toString(),
        country: country.id.toString()
      }

      const response = await addressService.addAddress(addressData)

      if (response.status) {
        // Refresh addresses
        await fetchAddresses()
        setShowAddressModal(false)
        resetAddressForm()
        setToast({ message: 'Address added successfully.', type: 'success' })
      } else {
        setToast({ message: response.message || 'Failed to add address', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Failed to add address. Please try again.', type: 'error' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleDeleteAddress = (addressId) => {
    setDeleteAddressId(addressId)
  }

  const confirmDeleteAddress = async () => {
    if (!deleteAddressId || !user?.id || !country?.id) return
    try {
      const response = await addressService.deleteAddress(deleteAddressId, user.id, country.id)

      if (response.status) {
        // If deleted address was selected, clear selection
        if (selectedAddress?.id === deleteAddressId) {
          setSelectedAddress(null)
        }
        // Refresh addresses
        await fetchAddresses()
        setToast({ message: 'Address deleted successfully.', type: 'success' })
      } else {
        setToast({ message: response.message || 'Failed to delete address', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Failed to delete address. Please try again.', type: 'error' })
    } finally {
      setDeleteAddressId(null)
    }
  }

  const handleSetAsDefault = async (addressId) => {
    try {
      if (!user?.id || !country?.id) return;
      const response = await addressService.markAsDefault(addressId, user.id, country.id)

      if (response.status) {
        // Refresh addresses
        await fetchAddresses()
        setToast({ message: 'Default address updated.', type: 'success' })
      } else {
        setToast({ message: response.message || 'Failed to set as default', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Failed to set as default. Please try again.', type: 'error' })
    }
  }

  const handleEditAddress = (address) => {
    if (!address) return;
    setShowSelectAddressModal(false) // Close select modal first
    setEditingAddress(address)
    setNewAddress({
      type: address.address_type || 'home',
      name: address.shipping_name || '',
      phone: address.shipping_phone || '',
      address: address.shipping_address || '',
      city: address.city || '',
      state: address.state || (country?.id === '2' ? 'Abu Dhabi' : ''),
      pincode: address.pincode || '',
      landmark: address.area || address.landmark || '',
      country: country?.id?.toString() || '2'
    })
    setTimeout(() => setShowAddressModal(true), 100)
  }

  const handleUpdateAddress = async (e) => {
    e.preventDefault()

    try {
      if (!user?.id || !country?.id || !editingAddress?.id) return;
      setIsProcessing(true)
      const isDefault = editingAddress.make_default == 1 || editingAddress.isDefaultAddress == 1 || editingAddress.is_default_address == 1 ? 1 : 0
      const addressData = {
        addressId: editingAddress.id.toString(),
        userId: user.id.toString(),
        shipping_name: newAddress.name,
        shipping_phone: newAddress.phone,
        shipping_address: newAddress.address,
        city: newAddress.city,
        pincode: newAddress.pincode || '',
        state: newAddress.state || (country?.id === '2' ? 'Abu Dhabi' : ''),
        area: newAddress.landmark || newAddress.city || '',
        isDefaultAddress: isDefault,
        shipping_email: user.email || '',
        countryId: country.id.toString(),
        country: country.id.toString()
      }

      const response = await addressService.updateAddress(addressData)

      if (response.status) {
        // Refresh addresses
        await fetchAddresses()
        setShowAddressModal(false)
        resetAddressForm()
        setToast({ message: 'Address updated successfully.', type: 'success' })
      } else {
        setToast({ message: response.message || 'Failed to update address', type: 'error' })
      }
    } catch (error) {
      setToast({ message: 'Failed to update address. Please try again.', type: 'error' })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleContinueToPayment = () => {
    if (!selectedAddress) {
      setToast({ message: 'Please select a delivery address', type: 'error' })
      return
    }
    setCurrentStep(2)
  }

  const handleContinueToReview = () => {
    if (!paymentMethod) {
      setToast({ message: 'Please select a payment method', type: 'error' })
      return
    }
    setCurrentStep(3)
  }

  const handlePlaceOrder = async () => {
    if (!user?.id || !country?.id) {
      setToast({ message: 'User session expired. Please log in again.', type: 'error' })
      return
    }
    if (!selectedAddress || !selectedAddress.id) {
      setToast({ message: 'Please select a delivery address', type: 'error' })
      return
    }
    if (!paymentMethod) {
      setToast({ message: 'Please select a payment method', type: 'error' })
      return
    }

    setIsProcessing(true)
    setOrderPlaced(true) // Mark order as placed to prevent cart redirect

    try {
      // Asynchronously resolve any fallback/invalid attribute IDs in the checkout items
      const checkoutItems = (getCheckoutItems() || []).filter(item => item && item.id)
      const resolvedCart = await Promise.all(checkoutItems.map(async (item) => {
        if (!item) return item;
        let attributeId = item.attribute_id || item.attributeId || item.product_attribute_id || item.variant_id;

        // If attributeId is missing, or is equal to product ID (fallback), resolve it from details
        if (item.id && (!attributeId || String(attributeId) === String(item.id))) {
          try {
            const details = await getProductDetails(item.id, country.id)
            if (details && details.raw && details.raw.productAttributeDetails) {
              const firstAttr = details.raw.productAttributeDetails[0]
              if (firstAttr && firstAttr.id) {
                return { ...item, attribute_id: firstAttr.id }
              }
            }
          } catch (err) {
          }
        }

        return item
      }))

      // Format product data: "productId_attributeId_qty,productId_attributeId_qty"
      const productIdAttributeIdQty = resolvedCart
        .filter(Boolean)
        .map(item => {
          const productId = item.id

          let attributeId = item.attribute_id ||
            item.attributeId ||
            item.product_attribute_id ||
            item.variant_id

          // Fallback just in case
          if (!attributeId && item.raw && item.raw.productAttributeDetails) {
            const firstAttr = item.raw.productAttributeDetails[0]
            attributeId = firstAttr?.id
          }

          if (!attributeId) {
            attributeId = productId
          }

          const qty = item.quantity || 1
          return `${productId}_${attributeId}_${qty}`
        })
        .join(',')

      const subtotal = Math.max(0, getCheckoutTotal() - couponDiscount) + calculateShipping() + calculateTax() + calculateCODCharge() + (paymentCharges.otherCharges || 0)
      const walletAmountDeducted = useWallet ? getWalletDeduction() : 0

      const orderData = {
        userId: user.id.toString(),
        user_id: user.id.toString(),
        addressId: selectedAddress.id.toString(),
        address_id: selectedAddress.id.toString(),
        couponId: appliedCoupon || '0',
        coupon_id: appliedCoupon || '0',
        productId_attributeId_qty: productIdAttributeIdQty,
        paymentType: paymentMethod, // Selected payment option ID ("0", "1", "2", "3")
        payment_type: paymentMethod,
        totalAmount: Math.max(0, subtotal).toFixed(2), // Total before wallet deduction
        total_amount: Math.max(0, subtotal).toFixed(2),
        couponAmount: couponDiscount.toFixed(2),
        coupon_amount: couponDiscount.toFixed(2),
        
        // Complete Wallet parameters for backend database deduction
        wallet_check: useWallet ? '1' : '0',
        walletCheck: useWallet ? '1' : '0',
        use_wallet: useWallet ? '1' : '0',
        useWallet: useWallet ? '1' : '0',
        is_wallet: useWallet ? '1' : '0',
        wallet_amount: walletAmountDeducted.toFixed(2),
        walletAmount: walletAmountDeducted.toFixed(2),
        used_wallet: walletAmountDeducted.toFixed(2),

        country: country.id.toString(),
        countryId: country.id.toString()
      }

      const response = await checkoutService.placeOrder(orderData)

      if (response.status) {
        // Deduct used wallet amount from user state & localStorage
        if (useWallet && walletBalance > 0) {
          const deduction = getWalletDeduction()
          const newBal = Math.max(0, walletBalance - deduction)
          setWalletBalance(newBal)

          const currentUser = authService.getUserData()
          if (currentUser) {
            const updatedUser = { ...currentUser, wallet_amount: newBal.toString() }
            localStorage.setItem('user', JSON.stringify(updatedUser))
          }
        }

        // Handle Online / Gateway Payment Options (All payment methods except Cash on Delivery)
        if (!isCODPayment()) {
          // UAE / Gateway - Redirect to payment gateway
          if (response.Data && response.Data.redirectUrl) {
            // Save checkout data to sessionStorage
            sessionStorage.setItem('checkout_pending', JSON.stringify({
              orderId: response.Data.orderId || response.Data.order_id || Date.now(),
              amount: orderData.totalAmount,
              timestamp: Date.now()
            }))

            // Clear ordered items from cart & storage
            removeOrderedItemsFromCart()

            // Redirect to payment gateway
            window.location.href = response.Data.redirectUrl
            return
          }

          // India - Open Razorpay (check sdk:1 or razorpayOrderId exists)
          if ((response.Data && response.Data.sdk === 1) || (response.Data && response.Data.razorpayOrderId && response.Data.razorpayKey)) {
            const razorpayData = {
              orderId: response.Data.razorpayOrderId,
              amount: response.Data.amount,
              key: response.Data.razorpayKey
            }

            // Initialize Razorpay
            const options = {
              key: razorpayData.key,
              amount: (parseFloat(razorpayData.amount) * 100).toString(), // Convert rupees to paise
              currency: 'INR',
              name: 'Jeni Deals',
              description: 'Order Payment',
              order_id: razorpayData.orderId,
              handler: function (razorpayResponse) {
                // Payment successful - clear items and redirect to success page
                removeOrderedItemsFromCart()
                router.push(`/order-success?orderId=${response.Data.orderId || response.Data.order_id || ''}`)
              },
              prefill: {
                name: user.name || '',
                email: user.email || '',
                contact: user.phone || ''
              },
              theme: {
                color: '#F59E0B'
              },
              modal: {
                ondismiss: function () {
                  setIsProcessing(false)
                  setToast({ message: 'Payment cancelled. Please try again.', type: 'error' })
                }
              }
            }

            // Load Razorpay script if not already loaded
            const openRazorpay = () => {
              const rzp = new window.Razorpay(options)
              rzp.on('payment.failed', function (response) {
                setToast({ message: 'Payment failed. Please try again.', type: 'error' })
                setIsProcessing(false)
              })
              rzp.open()
            }

            if (!window.Razorpay) {
              const script = document.createElement('script')
              script.src = 'https://checkout.razorpay.com/v1/checkout.js'
              script.onload = () => {
                openRazorpay()
              }
              script.onerror = () => {
                setToast({ message: 'Failed to load Razorpay. Please try again.', type: 'error' })
                setIsProcessing(false)
              }
              document.body.appendChild(script)
            } else {
              openRazorpay()
            }

            return
          }
        }

        // Cash on Delivery - Direct success
        if (isCODPayment()) {
          // COD - Clear items after successful order
          removeOrderedItemsFromCart()
          router.push(`/order-success?orderId=${response.Data.orderId || response.Data.order_id || ''}`)
          return
        }

        // Fallback - clear items and redirect to success
        removeOrderedItemsFromCart()
        router.push(`/order-success?orderId=${response.Data.orderId || response.Data.order_id || ''}`)
      } else {
        setToast({ message: response.message || 'Failed to place order. Please try again.', type: 'error' })
        setIsProcessing(false)
      }
    } catch (error) {
      setToast({ message: 'Failed to place order. Please try again.', type: 'error' })
      setIsProcessing(false)
    }
  }

  if (!isMounted || !isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto mb-4"></div>
          <p className="text-fg-muted">Loading...</p>
        </div>
      </div>
    )
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center flex-1">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 1 ? 'bg-orange text-white' : 'bg-surface-2 text-fg-muted'} font-bold text-sm`}>
          {currentStep > 1 ? <CheckCircle2 className="h-5 w-5" /> : '1'}
        </div>
        <span className="ml-2 text-sm font-medium text-fg hidden sm:inline">Address</span>
      </div>
      <div className={`flex-1 h-1 mx-2 ${currentStep >= 2 ? 'bg-orange' : 'bg-surface-2'}`}></div>
      <div className="flex items-center flex-1">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 2 ? 'bg-orange text-white' : 'bg-surface-2 text-fg-muted'} font-bold text-sm`}>
          {currentStep > 2 ? <CheckCircle2 className="h-5 w-5" /> : '2'}
        </div>
        <span className="ml-2 text-sm font-medium text-fg hidden sm:inline">Payment</span>
      </div>
      <div className={`flex-1 h-1 mx-2 ${currentStep >= 3 ? 'bg-orange' : 'bg-surface-2'}`}></div>
      <div className="flex items-center flex-1">
        <div className={`flex items-center justify-center w-8 h-8 rounded-full ${currentStep >= 3 ? 'bg-orange text-white' : 'bg-surface-2 text-fg-muted'} font-bold text-sm`}>
          3
        </div>
        <span className="ml-2 text-sm font-medium text-fg hidden sm:inline">Review</span>
      </div>
    </div>
  )

  const renderAddressStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-fg">Select Delivery Address</h3>
        <button
          onClick={() => {
            resetAddressForm()
            setShowAddressModal(true)
          }}
          className="text-orange text-sm font-medium flex items-center gap-1"
        >
          <Plus className="h-4 w-4" />
          Add New
        </button>
      </div>

      {addresses.length === 0 ? (
        <div className="bg-surface border border-line rounded-xl p-8 text-center">
          <MapPin className="h-12 w-12 text-fg-subtle mx-auto mb-4" strokeWidth={1.5} />
          <h4 className="text-base font-bold text-fg mb-2">No Saved Addresses</h4>
          <p className="text-sm text-fg-muted mb-4">Add a delivery address to continue</p>
          <button
            onClick={() => {
              resetAddressForm()
              setShowAddressModal(true)
            }}
            className="rounded-lg bg-orange px-6 py-2.5 text-sm font-bold text-white"
          >
            <Plus className="h-4 w-4 inline mr-2" />
            Add Address
          </button>
        </div>
      ) : (
        <>
          {addresses.map((address) => {
            const AddressIcon = address.address_type === 'home' ? Home : Briefcase
            return (
              <div
                key={address.id}
                onClick={() => handleAddressSelect(address)}
                className={`bg-surface border-2 rounded-xl p-4 cursor-pointer transition-all ${selectedAddress?.id === address.id
                    ? 'border-orange bg-orange/5'
                    : 'border-line hover:border-orange/50'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-1">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${selectedAddress?.id === address.id ? 'bg-orange text-white' : 'bg-orange/10 text-orange'
                        }`}>
                        <AddressIcon className="h-5 w-5" strokeWidth={1.5} />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="text-sm font-bold text-fg capitalize">{address.address_type || 'Address'}</h4>
                          {address.make_default == 1 && (
                            <span className="text-xs bg-orange/10 text-orange px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                              <Star className="h-3 w-3 fill-orange" />
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-sm font-medium text-fg">{address.shipping_name}</p>
                        <p className="text-sm text-fg-muted">{address.shipping_phone}</p>
                        <p className="text-sm text-fg-muted mt-2">{address.shipping_address}</p>
                        {address.area && (
                          <p className="text-sm text-fg-muted">{address.area}</p>
                        )}
                        <p className="text-sm text-fg-muted">{address.city || address.area}, {address.state} {address.pincode ? `- ${address.pincode}` : ''}</p>
                      </div>
                      {selectedAddress?.id === address.id && (
                        <CheckCircle2 className="h-5 w-5 text-orange flex-shrink-0" />
                      )}
                    </div>
                  </div>
                </div>
                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-line">
                  {address.make_default != 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSetAsDefault(address.id)
                      }}
                      className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-orange hover:bg-orange/10 rounded-lg transition-colors"
                    >
                      <Star className="h-3.5 w-3.5" strokeWidth={2} />
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditAddress(address)
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" strokeWidth={2} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteAddress(address.id)
                    }}
                    className="flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    Delete
                  </button>
                </div>
              </div>
            )
          })}
        </>
      )}

      {selectedAddress && (
        <button
          onClick={handleContinueToPayment}
          className="w-full rounded-xl bg-orange px-6 py-3 text-sm font-bold text-white flex items-center justify-center gap-2"
        >
          Continue to Payment
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )

  const renderPaymentStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-fg">Select Payment Method</h3>
        <button
          onClick={() => setCurrentStep(1)}
          className="text-orange text-sm font-medium flex items-center gap-1"
        >
          <Edit2 className="h-4 w-4" />
          Change Address
        </button>
      </div>

      {/* Selected Address Summary */}
      {selectedAddress && (
        <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2 mb-2">
            <Truck className="h-5 w-5 text-green-600" />
            <h4 className="text-sm font-bold text-green-800">Delivering to</h4>
          </div>
          <p className="text-sm text-green-700">{selectedAddress.shipping_name}, {selectedAddress.shipping_phone}</p>
          <p className="text-sm text-green-700">{selectedAddress.shipping_address}, {selectedAddress.city || selectedAddress.area}</p>
        </div>
      )}

      {/* Payment Methods */}
      <div className="space-y-3">
        {paymentMethods.map((method) => {
          const Icon = method.icon
          return (
            <div
              key={method.id}
              onClick={() => setPaymentMethod(method.id)}
              className={`bg-surface border-2 rounded-xl p-4 cursor-pointer transition-all ${paymentMethod === method.id
                  ? 'border-orange bg-orange/5'
                  : 'border-line hover:border-orange/50'
                }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0 ${paymentMethod === method.id ? 'bg-orange text-white' : 'bg-orange/10 text-orange'
                  }`}>
                  <Icon className="h-6 w-6" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h4 className="text-sm font-bold text-fg">{method.name}</h4>
                  <p className="text-xs text-fg-muted">{method.description}</p>
                </div>
                {paymentMethod === method.id && (
                  <CheckCircle2 className="h-5 w-5 text-orange flex-shrink-0" />
                )}
              </div>
            </div>
          )
        })}
      </div>

      {paymentMethod && (
        <button
          onClick={handleContinueToReview}
          className="w-full rounded-xl bg-orange px-6 py-3 text-sm font-bold text-white flex items-center justify-center gap-2"
        >
          Continue to Review
          <ChevronRight className="h-5 w-5" />
        </button>
      )}
    </div>
  )

  const renderReviewStep = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-fg">Review Your Order</h3>
      </div>

      {/* Delivery Address */}
      {selectedAddress && (
        <div className="bg-surface border border-line rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-fg">Delivery Address</h4>
            <button
              onClick={() => setCurrentStep(1)}
              className="text-orange text-xs font-medium"
            >
              Change
            </button>
          </div>
          <p className="text-sm text-fg">{selectedAddress.shipping_name}</p>
          <p className="text-sm text-fg-muted">{selectedAddress.shipping_address}</p>
          {selectedAddress.area && (
            <p className="text-sm text-fg-muted">{selectedAddress.area}</p>
          )}
          <p className="text-sm text-fg-muted">{selectedAddress.city || selectedAddress.area}, {selectedAddress.state} {selectedAddress.pincode ? `- ${selectedAddress.pincode}` : ''}</p>
          <p className="text-sm text-fg-muted">{selectedAddress.shipping_phone}</p>
        </div>
      )}

      {/* Payment Method */}
      {paymentMethod && (
        <div className="bg-surface border border-line rounded-xl p-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-fg">Payment Method</h4>
            <button
              onClick={() => setCurrentStep(2)}
              className="text-orange text-xs font-medium"
            >
              Change
            </button>
          </div>
          <p className="text-sm text-fg">
            {paymentMethods.find(m => m.id === paymentMethod)?.name || 'Payment Method'}
          </p>
        </div>
      )}

      {/* Order Items */}
      <div className="bg-surface border border-line rounded-xl p-4">
        <h4 className="text-sm font-bold text-fg mb-3">Order Items ({cart.length})</h4>
        <div className="space-y-3">
          {cart.map((item) => (
            <div key={item.id} className="flex gap-3">
              <div className="w-16 h-16 bg-surface-2 rounded flex-shrink-0 overflow-hidden">
                {item.product_img_url ? (
                  <img src={item.product_img_url} alt={item.product_name} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <Package className="h-6 w-6 text-fg-subtle" />
                  </div>
                )}
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium text-fg line-clamp-2">{item.product_name}</p>
                <p className="text-xs text-fg-muted">Qty: {item.quantity}</p>
                <p className="text-sm font-bold text-orange">{formatPrice(parseFloat(item.offer_price || item.price) * item.quantity)}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Badge */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3">
        <ShieldCheck className="h-8 w-8 text-green-600 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-bold text-green-800">Safe & Secure Payment</h4>
          <p className="text-xs text-green-700">Your payment information is encrypted and secure</p>
        </div>
      </div>

      <button
        onClick={handlePlaceOrder}
        disabled={isProcessing}
        className="w-full rounded-xl bg-orange px-6 py-4 text-base font-bold text-white flex items-center justify-center gap-2 disabled:opacity-50"
      >
        {isProcessing ? (
          <>
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
            Processing...
          </>
        ) : (
          <>
            Place Order - {formatPrice(getTotalAmount())}
          </>
        )}
      </button>
    </div>
  )

  const renderOrderSummary = () => (
    <div className="bg-surface border border-line rounded-xl p-4 sticky top-4">
      <h3 className="text-lg font-bold text-fg mb-4">Order Summary</h3>

      <div className="space-y-3 mb-4">
        <div className="flex justify-between text-sm">
          <span className="text-fg-muted">Subtotal ({cart.length} items)</span>
          <span className="text-fg font-medium">{formatPrice(getCartTotal())}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-fg-muted">Shipping</span>
          <span className="text-fg font-medium">
            {calculateShipping() === 0 ? 'FREE' : formatPrice(calculateShipping())}
          </span>
        </div>
        {isCODPayment() && (
          <div className="flex justify-between text-sm">
            <span className="text-fg-muted">COD Charge</span>
            <span className="text-fg font-medium">{calculateCODCharge() === 0 ? 'FREE' : formatPrice(calculateCODCharge())}</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-fg-muted">Tax</span>
          <span className="text-fg font-medium">{formatPrice(calculateTax())}</span>
        </div>
        {couponDiscount > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-green-600">Coupon Discount</span>
            <span className="text-green-600 font-medium">- {formatPrice(couponDiscount)}</span>
          </div>
        )}
        {/* Wallet Option (Commented out as requested)
        {walletBalance > 0 && (
          <div className="flex justify-between text-sm items-center">
            <div className="flex items-center gap-2">
              <span className="text-fg-muted">Wallet Balance</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useWallet}
                  onChange={(e) => setUseWallet(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange"></div>
              </label>
            </div>
            <span className={useWallet ? "text-blue-600 font-medium" : "text-fg-muted"}>
              {useWallet ? `- ${formatPrice(getWalletDeduction())}` : formatPrice(walletBalance)}
            </span>
          </div>
        )}
        */}
        <div className="border-t border-line pt-3 flex justify-between">
          <span className="text-base font-bold text-fg">Total</span>
          <span className="text-base font-bold text-orange">{formatPrice(getTotalAmount())}</span>
        </div>
      </div>

      {calculateShipping() === 0 && (
        <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
          <p className="text-xs font-medium text-green-800">🎉 You saved shipping charges!</p>
        </div>
      )}
    </div>
  )

  const renderCouponModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${showCouponModal ? '' : 'hidden'}`}>
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setShowCouponModal(false)}
      ></div>
      <div className="relative bg-white rounded-2xl w-full max-w-sm mx-4 p-6 text-center animate-slide-up">
        <div className={`w-16 h-16 rounded-full mx-auto mb-4 flex items-center justify-center ${couponModalType === 'success' ? 'bg-green-100' : 'bg-red-100'
          }`}>
          {couponModalType === 'success' ? (
            <CheckCircle2 className="h-8 w-8 text-green-600" strokeWidth={2} />
          ) : (
            <svg className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          )}
        </div>

        <h3 className={`text-lg font-bold mb-2 ${couponModalType === 'success' ? 'text-green-800' : 'text-red-800'
          }`}>
          {couponModalType === 'success' ? 'Success!' : 'Invalid Coupon'}
        </h3>

        <p className="text-sm text-fg-muted mb-4">{couponModalMessage}</p>

        {couponModalType === 'success' && couponDiscount > 0 && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3 mb-4">
            <p className="text-xs text-green-700 mb-1">You saved</p>
            <p className="text-xl font-bold text-green-600">{formatPrice(couponDiscount)}</p>
          </div>
        )}

        <button
          onClick={() => setShowCouponModal(false)}
          className={`w-full rounded-lg px-6 py-3 text-sm font-bold text-white ${couponModalType === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`}
        >
          OK
        </button>
      </div>
    </div>
  )

  const renderAddressModal = () => (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center ${showAddressModal ? '' : 'hidden'}`}>
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => {
          setShowAddressModal(false)
          resetAddressForm()
        }}
      ></div>
      <div className="relative bg-gradient-to-br from-white to-orange-50 rounded-t-2xl sm:rounded-3xl w-full max-w-md sm:max-w-xl max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-orange-600 to-orange-500 text-white px-6 sm:px-8 py-5 sm:py-6 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-white/20 rounded-2xl flex items-center justify-center">
              <MapPin className="w-5 h-5 sm:w-6 sm:h-6" />
            </div>
            <div>
              <h3 className="text-lg sm:text-xl font-bold">
                {editingAddress ? 'Edit Address' : 'Add New Address'}
              </h3>
              <p className="text-orange-100 text-xs sm:text-sm mt-0.5">
                Fill in your delivery details
              </p>
            </div>
          </div>
          <button
            onClick={() => {
              setShowAddressModal(false)
              resetAddressForm()
            }}
            className="w-9 h-9 sm:w-10 sm:h-10 bg-white/20 hover:bg-white/30 rounded-xl flex items-center justify-center transition-colors"
          >
            <X className="w-5 h-5 sm:w-6 sm:h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={editingAddress ? handleUpdateAddress : handleAddNewAddress} className="p-6 sm:p-8 space-y-5">
          {/* Name & Phone in 2 columns on desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Full Name</label>
              <div className="relative">
                <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  value={newAddress.name}
                  onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  placeholder="Enter your name"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Phone Number</label>
              <div className="relative">
                <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="tel"
                  value={newAddress.phone}
                  onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  placeholder="Enter your phone"
                  required
                />
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-1.5">
            <label className="block text-sm font-semibold text-gray-700">Address</label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-3 w-4.5 h-4.5 text-gray-400" />
              <textarea
                value={newAddress.address}
                onChange={(e) => setNewAddress({ ...newAddress, address: e.target.value })}
                rows="3"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all resize-none"
                placeholder="House number, Street name, Area"
                required
              ></textarea>
            </div>
          </div>

          {/* City & State */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">City</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  value={newAddress.city}
                  onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  placeholder="Your city"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">{country.id === '2' ? 'Emirate' : 'State'}</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400 z-10" />
                {country.id === '2' ? (
                  <div className="relative w-full">
                    <button
                      type="button"
                      onClick={() => setShowEmiratesDropdown(!showEmiratesDropdown)}
                      className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all flex items-center justify-between text-left text-sm font-medium"
                    >
                      <span className={newAddress.state ? "text-gray-900" : "text-gray-400"}>
                        {newAddress.state || 'Choose Emirate'}
                      </span>
                      <ChevronDown className="h-4.5 w-4.5 text-gray-400 shrink-0" />
                    </button>

                    {showEmiratesDropdown && (
                      <>
                        <div className="fixed inset-0 z-20" onClick={() => setShowEmiratesDropdown(false)}></div>
                        <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-gray-100 bg-white shadow-xl z-30 py-1.5">
                          {EMIRATES.map((emirate) => (
                            <button
                              key={emirate}
                              type="button"
                              onClick={() => {
                                setNewAddress(prev => ({ ...prev, state: emirate }));
                                setShowEmiratesDropdown(false);
                              }}
                              className={`w-full text-left px-4 py-2.5 text-sm hover:bg-orange/5 transition-colors ${newAddress.state === emirate ? 'bg-orange/5 text-orange font-bold' : 'text-gray-700'
                                }`}
                            >
                              {emirate}
                            </button>
                          ))}
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <input
                    type="text"
                    value={newAddress.state}
                    onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                    placeholder="Your state"
                    required
                  />
                )}
              </div>
            </div>
          </div>

          {/* Pincode & Landmark */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Pincode</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  value={newAddress.pincode}
                  onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  placeholder="Pincode"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-semibold text-gray-700">Landmark (Optional)</label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4.5 h-4.5 text-gray-400" />
                <input
                  type="text"
                  value={newAddress.landmark}
                  onChange={(e) => setNewAddress({ ...newAddress, landmark: e.target.value })}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all"
                  placeholder="Near a landmark"
                />
              </div>
            </div>
          </div>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4 sm:pt-6">
            <button
              type="button"
              onClick={() => {
                setShowAddressModal(false)
                resetAddressForm()
              }}
              className="flex-1 rounded-xl bg-gray-100 hover:bg-gray-200 px-6 py-3.5 text-sm sm:text-base font-bold text-gray-700 transition-colors"
              disabled={isProcessing}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-gradient-to-r from-orange-600 to-orange-500 hover:from-orange-700 hover:to-orange-600 px-6 py-3.5 text-sm sm:text-base font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2 transition-all shadow-lg shadow-orange-500/30 hover:shadow-orange-500/40"
              disabled={isProcessing}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
                  {editingAddress ? 'Updating...' : 'Adding...'}
                </>
              ) : (
                editingAddress ? 'Update Address' : 'Add Address'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderSelectAddressModal = () => (
    <div className={`fixed inset-0 z-50 flex items-center justify-center ${showSelectAddressModal ? '' : 'hidden'}`}>
      <div
        className="fixed inset-0 bg-black/50"
        onClick={() => setShowSelectAddressModal(false)}
      ></div>
      <div className="relative bg-white rounded-2xl w-full max-w-lg mx-4 p-6 animate-slide-up flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between pb-4 border-b border-line mb-4">
          <h3 className="text-lg font-bold text-fg">Select Delivery Address</h3>
          <button
            onClick={() => setShowSelectAddressModal(false)}
            className="text-fg-muted hover:text-fg transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <button
          onClick={() => {
            setShowSelectAddressModal(false)
            resetAddressForm()
            setTimeout(() => setShowAddressModal(true), 100)
          }}
          className="w-full mb-4 rounded-xl border-2 border-dashed border-orange bg-white p-3 flex items-center justify-center gap-2 text-orange font-bold text-sm hover:bg-orange/5 transition-colors"
        >
          <Plus className="h-5 w-5" />
          Add New Address
        </button>

        <div className="overflow-y-auto space-y-3 pr-1 flex-1">
          {addresses.length === 0 ? (
            <div className="text-center py-8 text-fg-muted">
              No addresses found. Click the button above to add one.
            </div>
          ) : (
            addresses.map((address) => (
              <div
                key={address.id}
                onClick={() => {
                  handleAddressSelect(address)
                  setShowSelectAddressModal(false)
                }}
                className={`bg-white border-2 rounded-xl p-4 cursor-pointer transition-all hover:border-orange/50 text-left ${selectedAddress?.id === address.id
                    ? 'border-orange bg-orange/5'
                    : 'border-line'
                  }`}
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-orange flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h4 className="text-sm font-bold text-fg">{address.shipping_name}</h4>
                      {address.make_default == 1 && (
                        <span className="text-xs bg-orange text-white px-2 py-0.5 rounded font-medium flex items-center gap-1">
                          <Star className="h-3 w-3 fill-white" />
                          Default
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-fg-muted mb-1">{address.shipping_phone}</p>
                    <p className="text-xs text-fg-muted leading-relaxed line-clamp-2">
                      {address.shipping_address}
                      {address.area && `, ${address.area}`}
                    </p>
                    <p className="text-xs text-fg-muted">
                      {address.city || address.area}, {address.state} {address.pincode ? `- ${address.pincode}` : ''}
                    </p>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 mt-3 pt-3 border-t border-line">
                  {address.make_default != 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation()
                        handleSetAsDefault(address.id)
                      }}
                      className="flex items-center gap-1 text-orange text-xs font-medium px-3 py-1.5 rounded-lg bg-orange/10 hover:bg-orange/20 transition-colors"
                    >
                      <Star className="h-3.5 w-3.5" strokeWidth={2} />
                      Set Default
                    </button>
                  )}
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleEditAddress(address)
                    }}
                    className="flex items-center gap-1 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 transition-colors"
                  >
                    <Edit2 className="h-3.5 w-3.5" strokeWidth={2} />
                    Edit
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDeleteAddress(address.id)
                    }}
                    className="flex items-center gap-1 text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50 hover:bg-red-100 transition-colors"
                  >
                    <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  )

  const renderMobileView = () => (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileHeader onOpenMenu={handleOpenMenu} showSearch={false} />
      <main className="flex-1 px-4 py-6 pb-32">
        {/* Delivery Address Section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-fg mb-3">Delivery Address</h2>

          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
            </div>
          ) : selectedAddress ? (
            <div className="bg-surface rounded-lg border border-line p-4">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-full bg-orange/10 flex items-center justify-center flex-shrink-0 mt-1">
                  <MapPin className="h-5 w-5 text-orange" strokeWidth={1.5} />
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-fg mb-1">{selectedAddress.shipping_name}</h3>
                  <p className="text-xs text-fg-muted leading-relaxed">
                    {selectedAddress.shipping_address}
                    {selectedAddress.area && `, ${selectedAddress.area}`}
                  </p>
                  <p className="text-xs text-fg-muted">
                    {selectedAddress.city || selectedAddress.area}, {selectedAddress.state} {selectedAddress.pincode}
                  </p>
                  <p className="text-xs text-fg-muted mt-1">{selectedAddress.shipping_phone}</p>
                </div>
                <button
                  onClick={() => setCurrentStep(1)}
                  className="text-orange text-sm font-medium flex-shrink-0"
                >
                  Change
                </button>
              </div>
            </div>
          ) : (
            <div className="bg-surface border border-line rounded-lg p-6 text-center">
              <MapPin className="h-10 w-10 text-fg-subtle mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-sm text-fg-muted mb-3">No address selected</p>
              <button
                onClick={() => setCurrentStep(1)}
                className="rounded-lg bg-orange px-6 py-2 text-sm font-bold text-white"
              >
                Select Address
              </button>
            </div>
          )}
        </div>

        {/* Order Summary Section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-fg mb-3">Order Summary</h2>
          <div className="space-y-3">
            {getCheckoutItems().map((item) => (
              <div key={item.id} className="bg-surface rounded-lg border border-line p-4">
                <div className="flex gap-3">
                  <div className="w-16 h-16 bg-surface-2 rounded flex-shrink-0 overflow-hidden">
                    {item.product_img_url ? (
                      <img src={item.product_img_url} alt={item.product_name} className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <Package className="h-6 w-6 text-fg-subtle" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-fg line-clamp-2 mb-2">{item.product_name}</p>
                    <div className="flex items-center justify-between">
                      <p className="text-base font-bold text-orange">{formatPrice(parseFloat(item.offer_price || item.price) * item.quantity)}</p>
                      <span className="text-xs bg-surface-2 px-3 py-1 rounded-full font-medium">
                        Qty: {item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Coupon Code Section */}
        <div className="mb-6">
          <div className="flex gap-2">
            <input
              type="text"
              placeholder="Enter coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={appliedCoupon}
              className="flex-1 rounded-lg border border-line bg-surface px-4 py-3 text-sm text-fg placeholder:text-fg-muted focus:border-orange focus:outline-none disabled:bg-surface-2 disabled:text-fg-muted"
            />
            {appliedCoupon ? (
              <button
                onClick={handleRemoveCoupon}
                className="rounded-lg bg-red-50 text-red-600 px-4 py-3 text-sm font-bold"
              >
                Remove
              </button>
            ) : (
              <button
                onClick={handleApplyCoupon}
                disabled={isCouponApplying}
                className="rounded-lg bg-orange px-6 py-3 text-sm font-bold text-white disabled:opacity-50"
              >
                {isCouponApplying ? 'Checking...' : 'Apply'}
              </button>
            )}
          </div>
          {appliedCoupon && (
            <div className="mt-2 flex items-center gap-2 text-xs text-green-600">
              <CheckCircle2 className="h-4 w-4" />
              <span>Coupon &quot;{appliedCoupon}&quot; applied successfully</span>
            </div>
          )}
        </div>

        {/* Payment Method Section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-fg mb-3">Payment Method</h2>
          <div className="space-y-3">
            {paymentMethods.map((method) => {
              const Icon = method.icon
              return (
                <div
                  key={method.id}
                  onClick={() => handleSelectPaymentMethod(method.id)}
                  className={`bg-surface border-2 rounded-lg p-4 cursor-pointer transition-all ${paymentMethod === method.id
                      ? 'border-orange bg-orange/5'
                      : 'border-line'
                    }`}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${paymentMethod === method.id ? 'bg-orange text-white' : 'bg-orange/10 text-orange'
                      }`}>
                      <Icon className="h-5 w-5" strokeWidth={1.5} />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-bold text-fg">{method.name}</h4>
                      <p className="text-xs text-fg-muted">{method.description}</p>
                    </div>
                    <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id
                        ? 'border-orange bg-orange'
                        : 'border-fg-muted'
                      }`}>
                      {paymentMethod === method.id && (
                        <div className="w-2 h-2 rounded-full bg-white"></div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Order Total Section */}
        <div className="mb-6">
          <h2 className="text-base font-bold text-fg mb-3 flex items-center justify-between">
            <span>Payment Summary</span>
            {isChargesLoading && (
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange border-t-transparent"></div>
            )}
          </h2>
          <div className="bg-surface rounded-lg border border-line p-4">
            <div className="space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-fg-muted">Subtotal</span>
                <span className="text-fg font-medium">{formatPrice(getCheckoutTotal())}</span>
              </div>
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Coupon Discount</span>
                  <span className="font-medium">- {formatPrice(couponDiscount)}</span>
                </div>
              )}
              {couponDiscount > 0 && (
                <div className="flex justify-between text-sm font-semibold text-fg border-t border-dashed border-line pt-1">
                  <span>Discounted Subtotal</span>
                  <span>{formatPrice(getDiscountedSubtotal())}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-fg-muted">Shipping</span>
                <span className="text-fg font-medium">
                  {calculateShipping() === 0 ? 'FREE' : formatPrice(calculateShipping())}
                </span>
              </div>
              {isCODPayment() && (
                <div className="flex justify-between text-sm">
                  <span className="text-fg-muted">COD Charge</span>
                  <span className="text-fg font-medium">{calculateCODCharge() === 0 ? 'FREE' : formatPrice(calculateCODCharge())}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-fg-muted">Tax</span>
                <span className="text-fg font-medium">
                  {calculateTax() === 0 ? 'FREE' : formatPrice(calculateTax())}
                </span>
              </div>
              {/* Wallet Option (Commented out as requested)
              {walletBalance > 0 && (
                <div className="flex justify-between text-sm items-center">
                  <div className="flex items-center gap-2">
                    <span className="text-fg-muted">Wallet Balance</span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={useWallet}
                        onChange={(e) => setUseWallet(e.target.checked)}
                        className="sr-only peer"
                      />
                      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange"></div>
                    </label>
                  </div>
                  <span className={useWallet ? "text-blue-600 font-medium" : "text-fg-muted"}>
                    {useWallet ? `- ${formatPrice(getWalletDeduction())}` : formatPrice(walletBalance)}
                  </span>
                </div>
              )}
              */}
              <div className="border-t border-line pt-3 flex justify-between">
                <span className="text-base font-bold text-fg">Total Payable</span>
                <span className="text-base font-bold text-orange">{formatPrice(getTotalAmount())}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Place Order Button */}
        <button
          onClick={handlePlaceOrder}
          disabled={isProcessing || !selectedAddress || (paymentMethod === undefined || paymentMethod === null || paymentMethod === '')}
          className="w-full rounded-lg bg-orange px-6 py-4 text-base font-bold text-white disabled:opacity-50 flex items-center justify-center gap-2"
        >
          {isProcessing ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-2 border-white border-t-transparent"></div>
              Processing...
            </>
          ) : (
            `Place Order - ${formatPrice(getTotalAmount())}`
          )}
        </button>

        {/* Address Selection Bottom Sheet */}
        {currentStep === 1 && (
          <div className="fixed inset-0 z-50 flex items-end">
            <div
              className="fixed inset-0 bg-black/50"
              onClick={() => setCurrentStep(0)}
            ></div>
            <div className="relative bg-white rounded-t-2xl w-full max-h-[85vh] overflow-hidden animate-slide-up">
              <div className="sticky top-0 bg-white border-b border-line px-4 py-4 flex items-center justify-between">
                <h2 className="text-lg font-bold text-fg">Select Delivery Address</h2>
                <button onClick={() => setCurrentStep(0)} className="text-fg-muted">
                  <ArrowLeft className="h-5 w-5" />
                </button>
              </div>

              <div className="overflow-y-auto px-4 py-4 pb-24" style={{ maxHeight: 'calc(85vh - 64px)' }}>
                <button
                  onClick={() => {
                    setShowSelectAddressModal(false)
                    resetAddressForm()
                    setShowAddressModal(true)
                  }}
                  className="w-full mb-3 rounded-xl border-2 border-dashed border-orange bg-white p-3 flex items-center justify-center gap-2 text-orange font-bold text-sm"
                >
                  <Plus className="h-5 w-5" />
                  Add New Address
                </button>

                <div className="space-y-3">
                  {addresses.map((address) => (
                    <div
                      key={address.id}
                      onClick={() => {
                        handleAddressSelect(address)
                        setCurrentStep(0)
                      }}
                      className={`bg-white border-2 rounded-xl p-3 cursor-pointer transition-all ${selectedAddress?.id === address.id
                          ? 'border-orange bg-orange/5'
                          : 'border-line'
                        }`}
                    >
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-lg bg-orange flex items-center justify-center flex-shrink-0">
                          <MapPin className="h-5 w-5 text-white" strokeWidth={2} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-bold text-fg">{address.shipping_name}</h4>
                            {address.make_default == 1 && (
                              <span className="text-xs bg-orange text-white px-2 py-0.5 rounded font-medium flex items-center gap-1">
                                <Star className="h-3 w-3 fill-white" />
                                Default
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-fg-muted mb-1">{address.shipping_phone}</p>
                          <p className="text-xs text-fg-muted leading-relaxed line-clamp-2">
                            {address.shipping_address}
                            {address.area && `, ${address.area}`}
                          </p>
                          <p className="text-xs text-fg-muted">
                            {address.city || address.area}, {address.state} {address.pincode ? `- ${address.pincode}` : ''}
                          </p>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 mt-3 pt-3 border-t border-line">
                        {address.make_default != 1 && (
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              handleSetAsDefault(address.id)
                            }}
                            className="flex items-center gap-1 text-orange text-xs font-medium px-3 py-1.5 rounded-lg bg-orange/10"
                          >
                            <Star className="h-3.5 w-3.5" strokeWidth={2} />
                            Set Default
                          </button>
                        )}
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleEditAddress(address)
                          }}
                          className="flex items-center gap-1 text-blue-600 text-xs font-medium px-3 py-1.5 rounded-lg bg-blue-50"
                        >
                          <Edit2 className="h-3.5 w-3.5" strokeWidth={2} />
                          Edit
                        </button>
                        <button
                          onClick={(e) => {
                            e.stopPropagation()
                            handleDeleteAddress(address.id)
                          }}
                          className="flex items-center gap-1 text-red-600 text-xs font-medium px-3 py-1.5 rounded-lg bg-red-50"
                        >
                          <Trash2 className="h-3.5 w-3.5" strokeWidth={2} />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
      <BottomNav />
      {renderCouponModal()}
      {renderAddressModal()}
    </div>
  )

  const renderDesktopView = () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => router.push('/cart')} className="text-fg hover:text-orange">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <h1 className="text-2xl font-bold text-fg">Checkout</h1>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Column - Address & Order Summary */}
            <div className="space-y-4">
              {/* Delivery Address Section - Show Default Only */}
              <div className="bg-surface rounded-lg border border-line p-4">
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-sm font-bold text-fg">Delivery Address</h2>
                  {addresses.length > 0 && (
                    <button
                      onClick={() => setShowSelectAddressModal(true)}
                      className="text-sm text-orange font-medium hover:text-orange-deep"
                    >
                      Change
                    </button>
                  )}
                </div>

                {addresses.length === 0 ? (
                  <div className="text-center py-6">
                    <MapPin className="h-10 w-10 text-fg-subtle mx-auto mb-2" />
                    <p className="text-sm text-fg-muted mb-3">No addresses found</p>
                    <button
                      onClick={() => {
                        resetAddressForm()
                        setShowAddressModal(true)
                      }}
                      className="rounded-lg bg-orange px-4 py-2 text-sm font-medium text-white hover:bg-orange-deep"
                    >
                      <Plus className="h-4 w-4 inline mr-2" />
                      Add Address
                    </button>
                  </div>
                ) : selectedAddress ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-start gap-3">
                      <div className="w-8 h-8 rounded-lg bg-green-600 text-white flex items-center justify-center flex-shrink-0">
                        {selectedAddress.address_type === 'home' ? (
                          <Home className="h-4 w-4" strokeWidth={2} />
                        ) : (
                          <Briefcase className="h-4 w-4" strokeWidth={2} />
                        )}
                      </div>
                      <div className="flex-1">
                        <h4 className="text-sm font-bold text-green-800 capitalize mb-1">
                          {selectedAddress.address_type || 'Address'}
                        </h4>
                        <p className="text-sm text-green-700">{selectedAddress.shipping_name} • {selectedAddress.shipping_phone}</p>
                        <p className="text-sm text-green-700 mt-1">{selectedAddress.shipping_address}</p>
                        <p className="text-sm text-green-700">
                          {selectedAddress.city || selectedAddress.area}, {selectedAddress.state} {selectedAddress.pincode ? `- ${selectedAddress.pincode}` : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-4">
                    <p className="text-sm text-fg-muted mb-3">Please select an address</p>
                    <button
                      onClick={() => setShowSelectAddressModal(true)}
                      className="text-sm text-orange font-medium hover:text-orange-deep"
                    >
                      Select Address
                    </button>
                  </div>
                )}
              </div>

              {/* Order Summary Section */}
              <div className="bg-surface rounded-lg border border-line p-4">
                <h2 className="text-sm font-bold text-fg mb-3">Order Summary ({getCheckoutItems().length} {getCheckoutItems().length === 1 ? 'item' : 'items'})</h2>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {getCheckoutItems().map((item) => (
                    <div key={item.id} className="flex gap-2 pb-2 border-b border-line last:border-0">
                      <div className="w-12 h-12 bg-surface-2 rounded flex-shrink-0 overflow-hidden">
                        {item.product_img_url && (
                          <img
                            src={item.product_img_url}
                            alt={item.product_name}
                            className="w-full h-full object-cover"
                          />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-medium text-fg line-clamp-1">{item.product_name}</h4>
                        <div className="flex items-center justify-between mt-1">
                          <span className="text-xs text-fg-muted">Qty: {item.quantity}</span>
                          <span className="text-xs font-bold text-fg">
                            {formatPrice(parseFloat(item.offer_price || item.price || 0) * item.quantity)}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Coupon Code Section */}
              <div className="bg-surface rounded-lg border border-line p-4">
                <h2 className="text-sm font-bold text-fg mb-3">Apply Coupon</h2>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={couponCode}
                    onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                    placeholder="Enter code"
                    disabled={!!appliedCoupon}
                    className="flex-1 rounded-lg border border-line bg-white px-3 py-2 text-sm text-fg placeholder:text-fg-muted focus:outline-none focus:ring-2 focus:ring-orange disabled:opacity-50"
                  />
                  {appliedCoupon ? (
                    <button
                      onClick={handleRemoveCoupon}
                      className="rounded-lg border-2 border-red-500 text-red-500 px-4 py-2 text-xs font-bold hover:bg-red-50"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      onClick={handleApplyCoupon}
                      disabled={isCouponApplying}
                      className="rounded-lg bg-orange px-4 py-2 text-xs font-bold text-white disabled:opacity-50 hover:bg-orange-deep"
                    >
                      {isCouponApplying ? 'Checking...' : 'Apply'}
                    </button>
                  )}
                </div>
                {appliedCoupon && (
                  <div className="mt-2 flex items-center gap-1 text-xs text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    <span>Coupon &quot;{appliedCoupon}&quot; applied</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column - Payment & Price Summary */}
            <div className="space-y-4">
              {/* Payment Method Section */}
              <div className="bg-surface rounded-lg border border-line p-4">
                <h2 className="text-sm font-bold text-fg mb-3">Payment Method</h2>
                <div className="space-y-2">
                  {paymentMethods.map((method) => {
                    const Icon = method.icon
                    return (
                      <div
                        key={method.id}
                        onClick={() => handleSelectPaymentMethod(method.id)}
                        className={`bg-white border-2 rounded-lg p-3 cursor-pointer transition-all hover:border-orange/50 ${paymentMethod === method.id
                            ? 'border-orange bg-orange/5'
                            : 'border-line'
                          }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${paymentMethod === method.id ? 'bg-orange text-white' : 'bg-orange/10 text-orange'
                            }`}>
                            <Icon className="h-5 w-5" strokeWidth={1.5} />
                          </div>
                          <div className="flex-1">
                            <h4 className="text-sm font-bold text-fg">{method.name}</h4>
                            <p className="text-xs text-fg-muted">{method.description}</p>
                          </div>
                          <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${paymentMethod === method.id
                            ? 'border-orange bg-orange'
                            : 'border-fg-muted'
                            }`}>
                            {paymentMethod === method.id && (
                              <div className="w-2 h-2 rounded-full bg-white"></div>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>

              {/* Price Summary */}
              <div className="bg-surface rounded-lg border border-line p-4 sticky top-24">
                <h3 className="text-sm font-bold text-fg mb-3 flex items-center justify-between">
                  <span>Price Details</span>
                  {isChargesLoading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-orange border-t-transparent"></div>
                  )}
                </h3>

                <div className="space-y-2 pb-3 border-b border-line">
                  <div className="flex justify-between text-sm">
                    <span className="text-fg-muted">Subtotal</span>
                    <span className="text-fg font-medium">{formatPrice(getCheckoutTotal())}</span>
                  </div>

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Coupon Discount</span>
                      <span className="font-medium">-{formatPrice(couponDiscount)}</span>
                    </div>
                  )}

                  {couponDiscount > 0 && (
                    <div className="flex justify-between text-sm font-semibold text-fg border-t border-dashed border-line pt-1">
                      <span>Discounted Subtotal</span>
                      <span>{formatPrice(getDiscountedSubtotal())}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-fg-muted">Shipping</span>
                    <span className="text-fg font-medium">{calculateShipping() === 0 ? 'FREE' : formatPrice(calculateShipping())}</span>
                  </div>

                  {isCODPayment() && (
                    <div className="flex justify-between text-sm">
                      <span className="text-fg-muted">COD Charge</span>
                      <span className="text-fg font-medium">{calculateCODCharge() === 0 ? 'FREE' : formatPrice(calculateCODCharge())}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-sm">
                    <span className="text-fg-muted">Tax</span>
                    <span className="text-fg font-medium">{calculateTax() === 0 ? 'FREE' : formatPrice(calculateTax())}</span>
                  </div>
                </div>

                <div className="pt-3 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-bold text-fg">Total Amount</span>
                    <span className="text-lg font-bold text-orange">{formatPrice(getTotalAmount())}</span>
                  </div>
                </div>

                <button
                  onClick={handlePlaceOrder}
                  disabled={isProcessing || !selectedAddress || (paymentMethod === undefined || paymentMethod === null || paymentMethod === '')}
                  className="w-full rounded-lg bg-orange px-4 py-3 text-sm font-bold text-white disabled:opacity-50 hover:bg-orange-deep flex items-center justify-center gap-2 transition-colors"
                >
                  {isProcessing ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                      Processing...
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="h-4 w-4" />
                      Place Order
                    </>
                  )}
                </button>

                <div className="mt-3 flex items-center justify-center gap-1 text-xs text-fg-muted">
                  <ShieldCheck className="h-3 w-3" />
                  <span>Safe & Secure Payments</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
      {renderCouponModal()}
      {renderAddressModal()}
      {renderSelectAddressModal()}
    </div>
  )

  return (
    <>
      {isMobile ? renderMobileView() : renderDesktopView()}

      <ConfirmationModal
        isOpen={deleteAddressId !== null}
        onClose={() => setDeleteAddressId(null)}
        onConfirm={confirmDeleteAddress}
        title="Delete Address"
        message="Are you sure you want to delete this shipping address? This action cannot be undone."
        confirmText="Delete Address"
        isDangerous={true}
      />

      {toast.message && (
        <div className="fixed bottom-24 md:bottom-10 right-4 md:right-10 z-[100000] flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3.5 text-xs font-bold text-white shadow-xl animate-fade-in">
          <span className={`h-2 w-2 rounded-full ${toast.type === 'success' ? 'bg-emerald-500' : 'bg-red-500'}`} />
          <span>{toast.message}</span>
        </div>
      )}
    </>
  )
}
