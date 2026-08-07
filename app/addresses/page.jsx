'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { MapPin, Plus, Edit2, Trash2, Star, ArrowLeft, X, CheckCircle, ChevronDown, Loader2 } from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { useAuth } from '../../src/context/AuthContext'
import { useCountry } from '../../src/context/CountryContext'
import { addressService } from '../../src/services/addressService'

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
            className={`rounded-xl px-5 py-2.5 text-xs font-bold text-white transition-colors active:scale-95 shadow-md ${
              isDangerous 
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

function AddressesContent() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [addresses, setAddresses] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [editingAddress, setEditingAddress] = useState(null)
  const [deleteAddressId, setDeleteAddressId] = useState(null)
  const [toast, setToast] = useState({ message: '', type: 'error' })
  const [formData, setFormData] = useState({
    shipping_name: '',
    shipping_email: '',
    shipping_phone: '',
    shipping_address: '',
    city: '',
    state: '',
    area: '',
    pincode: '',
    make_default: 0
  })
  const [formSubmitting, setFormSubmitting] = useState(false)
  const [showEmiratesDropdown, setShowEmiratesDropdown] = useState(false)
  
  const { isAuthenticated, user, loading: authLoading } = useAuth()
  const { country } = useCountry()
  const router = useRouter()

  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/user/login')
    } else {
      fetchAddresses()
    }
  }, [isAuthenticated, router, user, country, authLoading])

  useEffect(() => {
    if (toast.message) {
      const timer = setTimeout(() => {
        setToast({ message: '', type: 'error' })
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [toast.message])

  const fetchAddresses = async () => {
    try {
      setLoading(true)
      if (user?.id) {
        const response = await addressService.getAddresses(user.id, country.id)
        if (response.status && response.Data?.addressList) {
          setAddresses(response.Data.addressList)
        }
      }
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  const handleOpenMenu = () => {
    router.push('/categories')
  }

  const handleAddAddress = () => {
    setEditingAddress(null)
    setFormData({
      shipping_name: '',
      shipping_email: '',
      shipping_phone: '',
      shipping_address: '',
      city: '',
      state: '',
      area: '',
      pincode: '',
      make_default: addresses.length === 0 ? 1 : 0
    })
    setShowEmiratesDropdown(false)
    setShowModal(true)
  }

  const handleEditAddress = (address) => {
    setEditingAddress(address)
    setFormData({
      shipping_name: address.shipping_name || '',
      shipping_email: address.shipping_email || '',
      shipping_phone: address.shipping_phone || '',
      shipping_address: address.shipping_address || '',
      city: address.city || '',
      state: address.state || '',
      area: address.area || '',
      pincode: address.pincode || '',
      make_default: address.make_default || address.isDefaultAddress || address.is_default_address || 0
    })
    setShowEmiratesDropdown(false)
    setShowModal(true)
  }

  const handleDeleteAddress = (addressId) => {
    setDeleteAddressId(addressId)
  }

  const confirmDeleteAddress = async () => {
    if (!deleteAddressId) return
    try {
      await addressService.deleteAddress(deleteAddressId, user.id, country.id)
      setToast({ message: 'Address deleted successfully.', type: 'success' })
      fetchAddresses()
    } catch (error) {
      setToast({ message: 'Failed to delete address. Please try again.', type: 'error' })
    } finally {
      setDeleteAddressId(null)
    }
  }

  const handleMarkAsDefault = async (addressId) => {
    try {
      await addressService.markAsDefault(addressId, user.id, country.id)
      setToast({ message: 'Default address updated.', type: 'success' })
      fetchAddresses()
    } catch (error) {
      setToast({ message: 'Failed to set default address. Please try again.', type: 'error' })
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setFormSubmitting(true)
      
      const isDefault = formData.make_default ? 1 : 0
      const addressData = {
        userId: user.id.toString(),
        shipping_name: formData.shipping_name,
        shipping_phone: formData.shipping_phone,
        shipping_address: formData.shipping_address,
        city: formData.city || '',
        pincode: formData.pincode || '',
        state: formData.state || (country.id === '2' ? 'Abu Dhabi' : ''),
        area: formData.area || '',
        isDefaultAddress: isDefault,
        make_default: isDefault,
        is_default_address: isDefault,
        shipping_email: formData.shipping_email || '',
        countryId: country.id.toString(),
        country: country.id.toString()
      }
      
      let newAddressId
      if (editingAddress) {
        addressData.addressId = editingAddress.id.toString()
        await addressService.updateAddress(addressData)
        newAddressId = editingAddress.id
        setToast({ message: 'Address updated successfully.', type: 'success' })
      } else {
        const addResponse = await addressService.addAddress(addressData)
        newAddressId = addResponse.Data?.addressId || addResponse.Data?.id
        setToast({ message: 'New address added successfully.', type: 'success' })
      }
      
      if (isDefault && newAddressId) {
        try {
          await addressService.markAsDefault(newAddressId, user.id, country.id, addressData)
        } catch (error) {
          // Don't fail the whole address save if marking as default fails
        }
      }
      
      setShowEmiratesDropdown(false)
      setShowModal(false)
      fetchAddresses()
    } catch (error) {
      setToast({ message: 'Failed to save address. Please try again.', type: 'error' })
    } finally {
      setFormSubmitting(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
    }))
  }

  if (!isMounted || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange mx-auto mb-4"></div>
          <p className="text-fg-muted">Loading...</p>
        </div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  const renderEmptyState = () => (
    <div className="flex flex-col items-center justify-center min-h-[50vh] text-center px-4">
      <MapPin className="h-20 w-20 text-fg-subtle mb-4" strokeWidth={1.5} />
      <h2 className="text-xl font-semibold text-fg mb-2">No Addresses Saved</h2>
      <p className="text-sm text-fg-muted mb-6">Add your delivery addresses to make checkout faster!</p>
      <button
        onClick={handleAddAddress}
        className="rounded-lg bg-orange px-6 py-2.5 text-sm font-medium text-white active:bg-orange-deep flex items-center gap-2"
      >
        <Plus className="h-4 w-4" />
        Add New Address
      </button>
    </div>
  )

  const renderAddressCard = (address) => {
    const isDefault = address.make_default == 1 || address.isDefaultAddress == 1 || address.is_default_address == 1;
    return (
      <div 
        key={address.id} 
        className={`bg-surface rounded-2xl border-2 ${isDefault ? 'border-orange shadow-md shadow-orange-500/5' : 'border-line hover:border-orange/30'} p-5 relative transition-all duration-300 transform hover:-translate-y-0.5 shadow-sm hover:shadow-md flex flex-col justify-between h-full`}
      >
        {isDefault && (
          <div className="absolute top-4 right-4">
            <span className="inline-flex items-center gap-1 bg-orange/10 text-orange text-[10px] sm:text-xs px-2.5 py-1 rounded-full font-bold uppercase tracking-wider animate-pulse">
              <Star className="h-3.5 w-3.5 fill-orange" />
              Default
            </span>
          </div>
        )}

        <div className="flex items-start gap-3.5 mb-4">
          <div className="w-11 h-11 rounded-xl bg-orange/10 flex items-center justify-center flex-shrink-0">
            <MapPin className="h-6 w-6 text-orange" strokeWidth={1.5} />
          </div>
          <div className="flex-1 min-w-0 pr-16 text-left">
            <p className="text-base font-bold text-fg leading-snug truncate">{address.shipping_name}</p>
            <p className="text-xs text-fg-muted font-medium mt-0.5">{address.shipping_phone}</p>
          </div>
        </div>

        <div className="text-sm text-fg-muted leading-relaxed font-medium mb-6 flex-1 text-left">
          <p className="line-clamp-2">{address.shipping_address}</p>
          <p className="mt-1 text-xs font-semibold text-fg/80">
            {address.area && `${address.area}, `}
            {address.city && `${address.city}, `}
            {address.state}
            {address.pincode && ` - ${address.pincode}`}
          </p>
        </div>

        <div className={`grid ${isDefault ? 'grid-cols-2' : 'grid-cols-3'} gap-2 w-full pt-4 border-t border-line/60 mt-auto`}>
          {!isDefault && (
            <button
              onClick={() => handleMarkAsDefault(address.id)}
              className="rounded-xl bg-green-500/10 text-green-600 hover:bg-green-500/20 py-2.5 px-1 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-colors duration-200 whitespace-nowrap"
            >
              <CheckCircle className="h-3.5 w-3.5" />
              Default
            </button>
          )}
          <button
            onClick={() => handleEditAddress(address)}
            className="rounded-xl bg-surface-2 text-fg hover:bg-surface-3 py-2.5 px-1 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 border border-line transition-colors duration-200 whitespace-nowrap"
          >
            <Edit2 className="h-3.5 w-3.5" />
            Edit
          </button>
          <button
            onClick={() => handleDeleteAddress(address.id)}
            className="rounded-xl bg-red-500/10 text-red-600 hover:bg-red-500/20 py-2.5 px-1 text-[11px] sm:text-xs font-bold flex items-center justify-center gap-1 transition-colors duration-200 whitespace-nowrap"
          >
            <Trash2 className="h-3.5 w-3.5" />
            Delete
          </button>
        </div>
      </div>
    )
  }

  const renderModal = () => (
    <div className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center transition-all duration-300 ${showModal ? 'opacity-100 visible' : 'opacity-0 invisible pointer-events-none'}`}>
      <div className="fixed inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowModal(false)}></div>
      <div className={`relative bg-surface rounded-t-2xl sm:rounded-2xl w-full max-w-md max-h-[90vh] overflow-y-auto shadow-2xl transition-all duration-300 transform ${showModal ? 'translate-y-0 scale-100' : 'translate-y-10 scale-95'}`}>
        <div className="sticky top-0 bg-surface border-b border-line px-6 py-5 flex items-center justify-between z-10">
          <div className="text-left">
            <h3 className="text-lg font-bold text-fg">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </h3>
            <p className="text-xs text-fg-muted mt-0.5">Please provide your details below</p>
          </div>
          <button onClick={() => { setShowModal(false); setShowEmiratesDropdown(false); }} className="text-fg-muted hover:text-fg p-1 rounded-lg hover:bg-surface-2 transition-colors">
            <X className="h-5 w-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-left">
          <div>
            <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">Full Name</label>
            <input
              type="text"
              name="shipping_name"
              value={formData.shipping_name}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-orange focus:ring-1 focus:ring-orange/30 outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">Phone Number</label>
            <input
              type="tel"
              name="shipping_phone"
              value={formData.shipping_phone}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-orange focus:ring-1 focus:ring-orange/30 outline-none transition-all duration-200"
              required
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">Email (Optional)</label>
            <input
              type="email"
              name="shipping_email"
              value={formData.shipping_email}
              onChange={handleInputChange}
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-orange focus:ring-1 focus:ring-orange/30 outline-none transition-all duration-200"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">Address</label>
            <textarea
              name="shipping_address"
              value={formData.shipping_address}
              onChange={handleInputChange}
              rows="3"
              className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-orange focus:ring-1 focus:ring-orange/30 outline-none transition-all duration-200"
              required
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">Area</label>
              <input
                type="text"
                name="area"
                value={formData.area}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-orange focus:ring-1 focus:ring-orange/30 outline-none transition-all duration-200"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">City</label>
              <input
                type="text"
                name="city"
                value={formData.city}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-orange focus:ring-1 focus:ring-orange/30 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">{country.id === '2' ? 'Emirate' : 'State'}</label>
              {country.id === '2' ? (
                <div className="relative w-full">
                  <button
                    type="button"
                    onClick={() => setShowEmiratesDropdown(!showEmiratesDropdown)}
                    className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg focus:border-orange focus:ring-1 focus:ring-orange/30 outline-none transition-all flex items-center justify-between text-left font-medium"
                  >
                    <span className={formData.state ? "text-fg" : "text-fg-subtle"}>
                      {formData.state || 'Choose Emirate'}
                    </span>
                    <ChevronDown className="h-4.5 w-4.5 text-fg-subtle shrink-0" />
                  </button>
                  
                  {showEmiratesDropdown && (
                    <>
                      <div className="fixed inset-0 z-20" onClick={() => setShowEmiratesDropdown(false)}></div>
                      <div className="absolute left-0 right-0 mt-1.5 max-h-60 overflow-y-auto rounded-xl border border-line bg-surface shadow-xl z-30 py-1.5">
                        {EMIRATES.map((emirate) => (
                          <button
                            key={emirate}
                            type="button"
                            onClick={() => {
                              setFormData(prev => ({ ...prev, state: emirate }));
                              setShowEmiratesDropdown(false);
                            }}
                            className={`w-full text-left px-4 py-2.5 text-sm hover:bg-orange/5 transition-colors ${
                              formData.state === emirate ? 'bg-orange/5 text-orange font-bold' : 'text-fg'
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
                  name="state"
                  value={formData.state}
                  onChange={handleInputChange}
                  className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-orange focus:ring-1 focus:ring-orange/30 outline-none transition-all duration-200"
                  required
                />
              )}
            </div>

            <div>
              <label className="block text-xs font-bold text-fg-muted uppercase tracking-wider mb-1.5">Pincode</label>
              <input
                type="text"
                name="pincode"
                value={formData.pincode}
                onChange={handleInputChange}
                className="w-full rounded-xl border border-line bg-bg px-4 py-3 text-sm text-fg placeholder:text-fg-subtle focus:border-orange focus:ring-1 focus:ring-orange/30 outline-none transition-all duration-200"
              />
            </div>
          </div>

          <div className="flex items-center gap-2.5 pt-1">
            <input
              type="checkbox"
              name="make_default"
              checked={formData.make_default === 1}
              onChange={handleInputChange}
              className="h-4.5 w-4.5 rounded border-line text-orange focus:ring-orange/30 transition-all duration-200 cursor-pointer"
              id="make_default"
            />
            <label htmlFor="make_default" className="text-sm font-medium text-fg cursor-pointer select-none">Set as default address</label>
          </div>

          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setShowModal(false)
                setShowEmiratesDropdown(false)
              }}
              className="flex-1 rounded-xl bg-surface-2 text-fg hover:bg-surface-3 py-3 text-sm font-bold border border-line transition-colors duration-200"
              disabled={formSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-xl bg-orange hover:bg-orange-deep text-white py-3 text-sm font-bold shadow-md hover:shadow-lg shadow-orange-500/20 hover:shadow-orange-500/30 transition-all duration-200"
              disabled={formSubmitting}
            >
              {formSubmitting ? 'Saving...' : (editingAddress ? 'Update' : 'Add')} Address
            </button>
          </div>
        </form>
      </div>
    </div>
  )

  const renderMobileView = () => (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileHeader onOpenMenu={handleOpenMenu} showSearch={false} />
      <main className="flex-1 px-4 py-6 pb-32">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => router.push('/user/dashboard')} className="p-2 -ml-2 rounded-xl active:bg-surface-2 transition-colors text-fg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1 text-left">
            <h1 className="text-xl font-extrabold text-fg tracking-tight flex items-center gap-2">
              My Addresses
              {addresses.length > 0 && (
                <span className="text-xs bg-orange/15 text-orange px-2 py-0.5 rounded-full font-bold">
                  {addresses.length}
                </span>
              )}
            </h1>
          </div>
          {addresses.length > 0 && (
            <button
              onClick={handleAddAddress}
              className="w-10 h-10 rounded-xl bg-orange text-white flex items-center justify-center shadow-lg shadow-orange-500/20 active:scale-95 transition-all"
            >
              <Plus className="h-5 w-5" />
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
          </div>
        ) : addresses.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-4">
            {addresses.map((address) => renderAddressCard(address))}
          </div>
        )}
      </main>
      <BottomNav />
      {renderModal()}
    </div>
  )

  const renderDesktopView = () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/user/dashboard')} className="p-2.5 rounded-xl hover:bg-surface-2 transition-colors duration-200 text-fg">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="text-left">
              <h1 className="text-2xl font-extrabold text-fg tracking-tight flex items-center gap-2">
                My Addresses
                {addresses.length > 0 && (
                  <span className="text-xs bg-orange/15 text-orange px-2.5 py-0.5 rounded-full font-bold">
                    {addresses.length}
                  </span>
                )}
              </h1>
            </div>
          </div>
          {addresses.length > 0 && (
            <button
              onClick={handleAddAddress}
              className="shadow-lg shadow-orange-500/10 hover:shadow-orange-500/20 transition-all duration-300 transform hover:-translate-y-0.5 rounded-xl bg-orange hover:bg-orange-deep px-6 py-3 text-sm font-bold text-white flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Add New Address
            </button>
          )}
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
          </div>
        ) : addresses.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {addresses.map((address) => renderAddressCard(address))}
          </div>
        )}
      </main>
      <Footer />
      {renderModal()}
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

export default function AddressesPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
      </div>
    }>
      <AddressesContent />
    </Suspense>
  )
}
