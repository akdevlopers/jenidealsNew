'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { ChevronLeft, Bell, Package, Truck, Tag, Gift, Trash2 } from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { Header as DesktopHeader, Footer as DesktopFooter } from '../../src/components/desktop'
import { useAuth } from '../../src/context/AuthContext'
import { 
  getNotifications, 
  markNotificationAsRead, 
  markAllNotificationsAsRead, 
  deleteNotification 
} from '../../src/services/notificationService'

function NotificationsContent() {
  const router = useRouter()
  const { isAuthenticated, user } = useAuth()
  const [menuOpen, setMenuOpen] = useState(false)
  const [notifications, setNotifications] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isAuthenticated && user?.id) {
      fetchNotifications()
    } else {
      setLoading(false)
    }
  }, [isAuthenticated, user])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      const data = await getNotifications(user.id)
      setNotifications(data || [])
    } catch (error) {
      setNotifications([])
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAllRead = async () => {
    if (!user?.id) return
    try {
      await markAllNotificationsAsRead(user.id)
      // Refresh notifications
      fetchNotifications()
    } catch (error) {
    }
  }

  const handleDelete = async (notificationId) => {
    if (!user?.id) return
    try {
      await deleteNotification(notificationId, user.id)
      // Remove from local state
      setNotifications(notifications.filter(n => n.id !== notificationId))
    } catch (error) {
    }
  }

  const handleNotificationClick = async (notification) => {
    if (!user?.id) return
    
    // Mark as read
    if (!notification.is_read && !notification.read) {
      try {
        await markNotificationAsRead(notification.id, user.id)
        // Update local state
        setNotifications(notifications.map(n => 
          n.id === notification.id ? { ...n, is_read: 1, read: true } : n
        ))
      } catch (error) {
      }
    }

    // Navigate based on notification type or link
    if (notification.link || notification.url) {
      router.push(notification.link || notification.url)
    }
  }

  const getIconColor = (type) => {
    const typeStr = (type || '').toLowerCase()
    if (typeStr.includes('order') || typeStr.includes('purchase')) return 'bg-blue-500'
    if (typeStr.includes('ship') || typeStr.includes('deliver')) return 'bg-orange'
    if (typeStr.includes('offer') || typeStr.includes('deal')) return 'bg-green-500'
    if (typeStr.includes('promo') || typeStr.includes('gift')) return 'bg-purple-500'
    return 'bg-gray-500'
  }

  const getIcon = (type) => {
    const typeStr = (type || '').toLowerCase()
    if (typeStr.includes('order') || typeStr.includes('purchase')) return Package
    if (typeStr.includes('ship') || typeStr.includes('deliver')) return Truck
    if (typeStr.includes('offer') || typeStr.includes('deal')) return Tag
    if (typeStr.includes('promo') || typeStr.includes('gift')) return Gift
    return Bell
  }

  const MobileUI = () => (
    <div className="md:hidden flex min-h-screen flex-col bg-bg">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between bg-navy px-3 py-3 text-white shadow-md">
        <button
          onClick={() => router.back()}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full text-white active:bg-navy-soft transition-colors"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
        </button>
        <h1 className="flex-1 font-display text-[15px] font-bold text-white ml-2 text-left">
          Notifications
        </h1>
        {notifications.length > 0 && (
          <button 
            onClick={handleMarkAllRead}
            className="text-white text-sm font-semibold active:opacity-70"
          >
            Mark all read
          </button>
        )}
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent mx-auto mb-3" />
              <p className="text-sm text-fg-muted">Loading notifications...</p>
            </div>
          </div>
        ) : !isAuthenticated ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center px-4">
              <Bell className="h-16 w-16 text-fg-subtle mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-fg font-semibold mb-2">Login to view notifications</p>
              <button
                onClick={() => router.push('/user/login')}
                className="mt-4 px-6 py-2 bg-orange text-white font-semibold rounded-lg active:bg-orange-deep transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Bell className="h-16 w-16 text-fg-subtle mx-auto mb-3" strokeWidth={1.5} />
              <p className="text-fg font-semibold mb-1">No notifications</p>
              <p className="text-sm text-fg-muted">You&apos;re all caught up!</p>
            </div>
          </div>
        ) : (
          <div className="divide-y divide-line">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type || notification.notification_type)
              const isRead = notification.is_read == 1 || notification.read === true
              
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-3 p-4 ${
                    !isRead ? 'bg-orange/5' : 'bg-white'
                  } active:bg-surface-2 transition-colors cursor-pointer`}
                >
                  <div className={`${getIconColor(notification.type || notification.notification_type)} rounded-full p-2 shrink-0`}>
                    <Icon className="h-5 w-5 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2 mb-1">
                      <h3 className="text-fg font-bold text-sm">{notification.title}</h3>
                      {!isRead && (
                        <span className="h-2 w-2 rounded-full bg-orange shrink-0 mt-1" />
                      )}
                    </div>
                    <p className="text-fg-muted text-xs leading-relaxed mb-1">
                      {notification.message || notification.body || notification.description}
                    </p>
                    <p className="text-fg-subtle text-[11px]">
                      {notification.time || notification.created_at || notification.timestamp}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(notification.id)
                    }}
                    className="shrink-0 p-2 text-fg-muted active:text-sale transition-colors"
                  >
                    <Trash2 className="h-4 w-4" strokeWidth={2} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </main>

      <BottomNav />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )

  const DesktopUI = () => (
    <div className="hidden md:block min-h-screen bg-bg">
      <DesktopHeader />

      <div className="mx-auto max-w-[800px] px-6 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-[32px] font-bold text-fg mb-2">Notifications</h1>
            <p className="text-fg-muted text-base">Stay updated with your orders and offers</p>
          </div>
          {notifications.length > 0 && (
            <button 
              onClick={handleMarkAllRead}
              className="text-orange font-semibold text-sm hover:text-orange-deep transition-colors"
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Notifications List */}
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange border-t-transparent mx-auto mb-4" />
              <p className="text-base text-fg-muted">Loading notifications...</p>
            </div>
          </div>
        ) : !isAuthenticated ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Bell className="h-20 w-20 text-fg-subtle mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-lg font-semibold text-fg mb-3">Login to view notifications</p>
              <button
                onClick={() => router.push('/user/login')}
                className="px-8 py-3 bg-orange text-white font-semibold rounded-lg hover:bg-orange-deep transition-colors"
              >
                Login
              </button>
            </div>
          </div>
        ) : notifications.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <Bell className="h-20 w-20 text-fg-subtle mx-auto mb-4" strokeWidth={1.5} />
              <p className="text-lg font-semibold text-fg mb-2">No notifications</p>
              <p className="text-fg-muted">You&apos;re all caught up!</p>
            </div>
          </div>
        ) : (
          <div className="bg-white border border-line rounded-2xl overflow-hidden divide-y divide-line">
            {notifications.map((notification) => {
              const Icon = getIcon(notification.type || notification.notification_type)
              const isRead = notification.is_read == 1 || notification.read === true
              
              return (
                <div
                  key={notification.id}
                  onClick={() => handleNotificationClick(notification)}
                  className={`flex items-start gap-4 p-5 ${
                    !isRead ? 'bg-orange/5' : ''
                  } hover:bg-surface-2 transition-colors cursor-pointer`}
                >
                  <div className={`${getIconColor(notification.type || notification.notification_type)} rounded-xl p-3 shrink-0`}>
                    <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3 mb-1">
                      <h3 className="text-fg font-bold text-base">{notification.title}</h3>
                      {!isRead && (
                        <span className="h-2.5 w-2.5 rounded-full bg-orange shrink-0 mt-1.5" />
                      )}
                    </div>
                    <p className="text-fg-muted text-sm leading-relaxed mb-2">
                      {notification.message || notification.body || notification.description}
                    </p>
                    <p className="text-fg-subtle text-xs">
                      {notification.time || notification.created_at || notification.timestamp}
                    </p>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation()
                      handleDelete(notification.id)
                    }}
                    className="shrink-0 p-2 text-fg-muted hover:text-sale transition-colors"
                  >
                    <Trash2 className="h-5 w-5" strokeWidth={2} />
                  </button>
                </div>
              )
            })}
          </div>
        )}
      </div>

      <DesktopFooter />
    </div>
  )

  return (
    <>
      <MobileUI />
      <DesktopUI />
    </>
  )
}

export default function NotificationsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
      </div>
    }>
      <NotificationsContent />
    </Suspense>
  )
}
