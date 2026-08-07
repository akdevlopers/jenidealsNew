'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Plane, Calendar, Users, MapPin, Eye, ArrowLeft, Package } from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { useAuth } from '../../src/context/AuthContext'
import { useCountry } from '../../src/context/CountryContext'
import { orderService } from '../../src/services/orderService'

export default function TourBookingsPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  
  const { user, isAuthenticated, loading: authLoading } = useAuth()
  const { country, price: formatPrice } = useCountry()
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

  const fetchTourBookings = async () => {
    if (!user || !user.id) return;
    try {
      setLoading(true)
      const countryId = country?.id ? country.id.toString() : '2'
      const response = await orderService.getBookingList(user.id, countryId)

      let list = []
      if (Array.isArray(response)) {
        list = response
      } else if (response?.data?.bookings?.data && Array.isArray(response.data.bookings.data)) {
        list = response.data.bookings.data
      } else if (response?.Data?.bookings?.data && Array.isArray(response.Data.bookings.data)) {
        list = response.Data.bookings.data
      } else if (response?.data?.data && Array.isArray(response.data.data)) {
        list = response.data.data
      } else if (response?.Data && Array.isArray(response.Data)) {
        list = response.Data
      } else if (response?.data && Array.isArray(response.data)) {
        list = response.data
      }

      const mappedBookings = list.map(item => {
        const title = item.tour_package?.title || item.title || item.tour_title || item.package_title || item.tour_name || item.name || 'Tour Booking'
        const image = item.tour_package?.image || item.tour_package?.thumbnail || item.tour_package?.cover_image || item.image || item.tour_image || item.image_url || ''
        
        let rawDate = item.user_proposal_date || item.created_at || item.travel_date || item.booking_date || item.date || ''
        if (rawDate && rawDate.includes('T')) {
          rawDate = rawDate.split('T')[0]
        }

        const seats = item.seat || item.adult || item.number_of_seats || item.guest_count || item.persons || 1

        let status = 'pending'
        if (item.status === 1 || item.status === '1') {
          status = 'confirmed'
        } else if (item.status === 2 || item.status === '2') {
          status = 'cancelled'
        } else if (typeof item.status === 'string') {
          status = item.status.toLowerCase()
        }

        let paymentStatus = 'pending'
        if (item.pg_status === 'success' || item.pg_status === 'paid' || item.payment_status === 'paid') {
          paymentStatus = 'paid'
        } else if (item.pg_status === 'failed' || item.payment_status === 'failed') {
          paymentStatus = 'failed'
        } else if (item.pg_status) {
          paymentStatus = item.pg_status.toLowerCase()
        }

        return {
          id: item.id || item.booking_id,
          title,
          image,
          date: rawDate || 'N/A',
          seats,
          dayNights: item.reporting_point ? `Point: ${item.reporting_point}` : (item.duration || ''),
          price: parseFloat(item.price || item.transaction_amount || item.total_amount || 0),
          status,
          paymentStatus,
          guestName: item.lead_guest_name || item.user_name || item.name || user?.name || 'Guest',
          guestPhone: item.lead_guest_phone || item.phone || user?.phone || '',
          guestEmail: item.lead_guest_email || item.email || user?.email || '',
          reportingPoint: item.reporting_point || '',
          nationality: item.nationality || ''
        }
      })

      setBookings(mappedBookings)
    } catch (error) {
      setBookings([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (authLoading) return;
    if (!isAuthenticated) {
      router.push('/user/login')
    } else if (user?.id) {
      fetchTourBookings()
    }
  }, [isAuthenticated, user?.id, country?.id, router, authLoading])

  const handleOpenMenu = () => {
    router.push('/categories')
  }

  const getStatusInfo = (status) => {
    const statusMap = {
      pending: { label: 'Pending', class: 'bg-yellow-100 text-yellow-800' },
      confirmed: { label: 'Confirmed', class: 'bg-green-100 text-green-800' },
      cancelled: { label: 'Cancelled', class: 'bg-red-100 text-red-800' },
      completed: { label: 'Completed', class: 'bg-blue-100 text-blue-800' }
    }
    return statusMap[status] || statusMap.pending
  }

  const getPaymentStatusInfo = (status) => {
    const statusMap = {
      paid: { label: 'Paid', class: 'bg-green-100 text-green-800' },
      success: { label: 'Paid', class: 'bg-green-100 text-green-800' },
      failed: { label: 'Payment Failed', class: 'bg-red-100 text-red-800' }
    }
    return statusMap[status] || null
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
      <Plane className="h-20 w-20 text-fg-subtle mb-4" strokeWidth={1.5} />
      <h2 className="text-xl font-semibold text-fg mb-2">No Tour Bookings</h2>
      <p className="text-sm text-fg-muted mb-6">You haven&apos;t booked any tours yet. Explore amazing destinations!</p>
      <button
        onClick={() => window.open(process.env.NEXT_PUBLIC_HOLIDAYS_URL || 'https://jenideals.com/jeniNewVersion/holidays', '_blank')}
        className="rounded-lg bg-orange px-6 py-2.5 text-sm font-medium text-white active:bg-orange-deep"
      >
        Browse Tours
      </button>
    </div>
  )

  const renderBookingCard = (booking, index) => {
    const statusInfo = getStatusInfo(booking.status)
    const paymentStatusInfo = getPaymentStatusInfo(booking.paymentStatus)

    return (
      <div key={index} className="bg-surface rounded-lg border border-line overflow-hidden">
        {/* Tour Image - rendered ONLY if image exists */}
        {booking.image ? (
          <div className="relative h-48 bg-surface-2">
            <img src={booking.image} alt={booking.title} className="w-full h-full object-cover" />
            <div className="absolute top-3 right-3">
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
                {statusInfo.label}
              </div>
            </div>
          </div>
        ) : null}

        {/* Booking Details */}
        <div className="p-4">
          <div className="flex items-start justify-between gap-3 mb-2">
            <h3 className="text-base font-bold text-fg line-clamp-2 text-left flex-1">{booking.title}</h3>
            {!booking.image && (
              <div className={`shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${statusInfo.class}`}>
                {statusInfo.label}
              </div>
            )}
          </div>
          
          <div className="space-y-2 mb-4 text-left">
            <div className="flex items-center gap-2 text-sm text-fg-muted">
              <Calendar className="h-4 w-4 flex-shrink-0" />
              <span>{booking.date}</span>
            </div>
            <div className="flex items-center gap-2 text-sm text-fg-muted">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span>{booking.seats} Seat(s)</span>
            </div>
            {booking.dayNights && (
              <div className="flex items-center gap-2 text-sm text-fg-muted">
                <MapPin className="h-4 w-4 flex-shrink-0" />
                <span>{booking.dayNights}</span>
              </div>
            )}
          </div>

          {/* Price & Payment Status */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-line">
            <div className="text-left">
              <p className="text-xs text-fg-muted mb-1">Total Amount</p>
              <p className="text-lg font-bold text-orange">{formatPrice(booking.price)}</p>
            </div>
            {paymentStatusInfo && (
              <div className={`px-3 py-1 rounded-full text-xs font-semibold ${paymentStatusInfo.class}`}>
                {paymentStatusInfo.label}
              </div>
            )}
          </div>

          {/* Guest Info */}
          <div className="bg-bg rounded-lg p-3 text-left">
            <p className="text-xs font-bold text-fg-subtle uppercase tracking-wider mb-1">Lead Guest</p>
            <p className="text-sm font-semibold text-fg">{booking.guestName}</p>
            {booking.guestPhone && <p className="text-xs text-fg-muted mt-0.5">📞 {booking.guestPhone}</p>}
            {booking.guestEmail && <p className="text-xs text-fg-muted mt-0.5">✉️ {booking.guestEmail}</p>}
            {booking.nationality && <p className="text-xs text-fg-muted mt-1 font-medium text-orange-deep">🌐 Nationality: {booking.nationality}</p>}
          </div>
        </div>
      </div>
    )
  }

  const renderMobileView = () => (
    <div className="flex min-h-screen flex-col bg-bg">
      <MobileHeader onOpenMenu={handleOpenMenu} showSearch={false} />
      <main className="flex-1 px-4 py-6 pb-32">
        <div className="mb-6 flex items-center gap-3">
          <button onClick={() => router.push('/user/dashboard')} className="text-fg">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-xl font-bold text-fg">Tour Bookings</h1>
            {bookings.length > 0 && (
              <p className="text-xs text-fg-muted">{bookings.length} Bookings</p>
            )}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
          </div>
        ) : bookings.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="space-y-4">
            {bookings.map((booking, index) => renderBookingCard(booking, index))}
          </div>
        )}
      </main>
      <BottomNav />
    </div>
  )

  const renderDesktopView = () => (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 container mx-auto px-6 py-8">
        <div className="mb-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button onClick={() => router.push('/user/dashboard')} className="text-fg hover:text-orange">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-2xl font-bold text-fg">Tour Bookings</h1>
              {bookings.length > 0 && (
                <p className="text-sm text-fg-muted">{bookings.length} Bookings</p>
              )}
            </div>
          </div>
          <button
            onClick={() => window.open(process.env.NEXT_PUBLIC_HOLIDAYS_URL || 'https://jenideals.com/jeniNewVersion/holidays', '_blank')}
            className="rounded-lg bg-orange px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-deep"
          >
            Browse Tours
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange"></div>
          </div>
        ) : bookings.length === 0 ? (
          renderEmptyState()
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {bookings.map((booking, index) => renderBookingCard(booking, index))}
          </div>
        )}
      </main>
      <Footer />
    </div>
  )

  return isMobile ? renderMobileView() : renderDesktopView()
}
