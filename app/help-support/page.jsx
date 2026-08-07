'use client'

export const dynamic = 'force-dynamic'

import { useState, Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { 
  ChevronLeft, 
  MessageCircle, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  HelpCircle,
  Package,
  CreditCard,
  Truck,
  RotateCcw,
  Shield,
  ChevronRight,
  Send,
  User,
  FileText
} from 'lucide-react'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { Header as DesktopHeader, Footer as DesktopFooter } from '../../src/components/desktop'

function HelpSupportContent() {
  const router = useRouter()
  const [menuOpen, setMenuOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [expandedFAQ, setExpandedFAQ] = useState(null)

  const whatsappNumber = '971545320252' // WhatsApp number
  const phoneNumber = '+971545320252' // Phone number
  const emailAddress = 'customersupport@jenideals.com'

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi, I need help with my order.')
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`
  }

  const handleEmail = () => {
    window.location.href = `mailto:${emailAddress}`
  }

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp Support',
      description: 'Quick response via WhatsApp',
      action: 'Chat on WhatsApp',
      color: 'bg-[#25D366]',
      lightColor: 'bg-[#25D366]/10',
      textColor: 'text-[#25D366]',
      onClick: handleWhatsApp
    },
    {
      icon: Phone,
      title: 'Call Us',
      description: phoneNumber,
      action: 'Call Now',
      color: 'bg-blue-500',
      lightColor: 'bg-blue-50',
      textColor: 'text-blue-500',
      onClick: handleCall
    },
    {
      icon: Mail,
      title: 'Email Support',
      description: emailAddress,
      action: 'Send Email',
      color: 'bg-orange',
      lightColor: 'bg-orange/10',
      textColor: 'text-orange',
      onClick: handleEmail
    }
  ]

  const helpCategories = [
    {
      icon: Package,
      title: 'Orders & Delivery',
      description: 'Track orders, delivery info',
      items: [
        { name: 'Track my order', link: '/orders' },
        { name: 'Delivery time', link: '/shipping-policy' },
        { name: 'Order status', link: '/orders' }
      ]
    },
    {
      icon: CreditCard,
      title: 'Payments & Refunds',
      description: 'Payment methods, refund status',
      items: [
        { name: 'Payment options', link: '/help-support' },
        { name: 'Refund policy', link: '/refund-policy' },
        { name: 'Payment failed', link: '/help-support' }
      ]
    },
    {
      icon: RotateCcw,
      title: 'Returns & Exchange',
      description: 'Return policy, process',
      items: [
        { name: 'Return process', link: '/refund-policy' },
        { name: 'Exchange item', link: '/refund-policy' },
        { name: 'Refund timeline', link: '/refund-policy' }
      ]
    },
    {
      icon: User,
      title: 'Account & Profile',
      description: 'Login, password, profile',
      items: [
        { name: 'Reset password', link: '/user/forgot-password' },
        { name: 'Update profile', link: '/user/profile' },
        { name: 'Delete account', link: '/help-support' }
      ]
    }
  ]

  const faqs = [
    {
      question: 'How do I track my order?',
      answer: 'You can track your order by logging into your account and visiting the "My Orders" section. Click on the specific order to see real-time tracking information.'
    },
    {
      question: 'What is your return policy?',
      answer: 'We offer a 15-day return policy for most items. Products must be in original condition with tags attached. Some items like undergarments and cosmetics are non-returnable.'
    },
    {
      question: 'How long does delivery take?',
      answer: 'Standard delivery typically takes 5-7 business days. Express delivery is available for select locations and takes 2-3 business days.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept credit/debit cards, UPI, net banking, digital wallets, and cash on delivery for eligible orders.'
    },
    {
      question: 'How do I cancel my order?',
      answer: 'Orders can be cancelled within 24 hours of placement. Go to "My Orders", select the order, and click "Cancel Order". Refunds will be processed within 5-7 business days.'
    }
  ]

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
          Help & Support
        </h1>
        <div className="w-9" />
      </header>

      {/* Main Content */}
      <main className="flex-1 pb-24 bg-bg">
        {/* Hero Section */}
        <div className="bg-white border-b border-line px-4 pt-6 pb-6">
          <div className="text-center mb-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange/10 mb-3">
              <HelpCircle className="h-8 w-8 text-orange" strokeWidth={2} />
            </div>
            <h2 className="text-fg font-bold text-xl mb-2">How can we help you?</h2>
            <p className="text-fg-muted text-sm">Choose your preferred way to reach us</p>
          </div>

          {/* Contact Methods - Improved Cards */}
          <div className="space-y-3">
            {contactMethods.map((method, idx) => {
              const Icon = method.icon
              return (
                <button
                  key={idx}
                  onClick={method.onClick}
                  className="w-full flex items-center gap-4 bg-surface border-2 border-line rounded-2xl p-4 shadow-sm active:scale-[0.98] active:border-orange transition-all"
                >
                  <div className={`${method.color} rounded-xl p-3 shadow-md`}>
                    <Icon className="h-6 w-6 text-white" strokeWidth={2} />
                  </div>
                  <div className="flex-1 text-left">
                    <p className="text-fg font-bold text-base mb-0.5">{method.title}</p>
                    <p className="text-fg-muted text-xs">{method.description}</p>
                  </div>
                  <ChevronRight className="h-5 w-5 text-fg-muted" strokeWidth={2.5} />
                </button>
              )
            })}
          </div>
        </div>

        {/* FAQs Section */}
        <div className="px-4 py-6 bg-surface">
          <div className="flex items-center gap-2 mb-4">
            <div className="bg-orange/10 rounded-lg p-1.5">
              <HelpCircle className="h-5 w-5 text-orange" strokeWidth={2.5} />
            </div>
            <h3 className="text-fg font-bold text-lg">Common Questions</h3>
          </div>
          <div className="space-y-2.5">
            {faqs.map((faq, idx) => (
              <div key={idx} className="bg-white border border-line rounded-2xl overflow-hidden shadow-sm">
                <button
                  onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                  className="w-full flex items-start justify-between gap-3 p-4 text-left active:bg-surface-2 transition-colors"
                >
                  <span className="text-fg font-semibold text-sm flex-1 leading-snug">{faq.question}</span>
                  <ChevronRight 
                    className={`h-5 w-5 text-fg-muted transition-transform shrink-0 mt-0.5 ${expandedFAQ === idx ? 'rotate-90' : ''}`} 
                    strokeWidth={2.5} 
                  />
                </button>
                {expandedFAQ === idx && (
                  <div className="px-4 pb-4 pt-0 border-t border-line/30">
                    <p className="text-fg-muted text-sm leading-relaxed pt-3">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Help Categories */}
        <div className="px-4 py-6 bg-white border-y border-line">
          <h3 className="text-fg font-bold text-lg mb-4">Browse Topics</h3>
          <div className="grid grid-cols-2 gap-3">
            {helpCategories.map((category, idx) => {
              const Icon = category.icon
              return (
                <div key={idx} className="flex flex-col gap-2">
                  <div className="flex flex-col items-center gap-3 bg-surface border-2 border-line rounded-2xl p-4">
                    <div className="bg-orange/10 rounded-xl p-3">
                      <Icon className="h-6 w-6 text-orange" strokeWidth={2} />
                    </div>
                    <div className="text-center">
                      <p className="text-fg font-bold text-xs leading-tight">{category.title}</p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    {category.items.map((item, i) => (
                      <button
                        key={i}
                        onClick={() => router.push(item.link)}
                        className="text-orange text-[10px] flex items-center gap-0.5 hover:text-orange-deep transition-colors px-2"
                      >
                        <ChevronRight className="h-2.5 w-2.5" strokeWidth={2.5} />
                        {item.name}
                      </button>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Business Info */}
        <div className="px-4 py-6 space-y-3">
          {/* Business Hours */}
          <div className="bg-gradient-to-br from-orange/5 to-orange/10 border border-orange/20 rounded-2xl p-4">
            <div className="flex items-start gap-3">
              <div className="bg-orange rounded-xl p-2.5 shadow-md">
                <Clock className="h-5 w-5 text-white" strokeWidth={2} />
              </div>
              <div className="flex-1">
                <h4 className="text-fg font-bold text-sm mb-2">Business Hours</h4>
                <div className="space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-fg-muted text-xs">Mon - Sat</span>
                    <span className="text-fg font-semibold text-xs">9:00 AM - 6:00 PM</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-fg-muted text-xs">Sunday</span>
                    <span className="text-sale font-semibold text-xs">Closed</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          {/* Removed - Address section hidden */}
        </div>

        {/* Quick Actions */}
        <div className="px-4 pb-6">
          <div className="bg-[#25D366]/10 border-2 border-[#25D366]/20 rounded-2xl p-5 text-center">
            <MessageCircle className="h-10 w-10 text-[#25D366] mx-auto mb-3" strokeWidth={2} />
            <p className="text-fg font-semibold text-base mb-2">Need Quick Help?</p>
            <p className="text-fg-muted text-sm mb-4">Chat with us instantly on WhatsApp</p>
            <button
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] text-white font-bold text-sm py-3.5 rounded-xl shadow-lg active:scale-[0.98] transition-all flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2.5} />
              Open WhatsApp Chat
            </button>
          </div>
        </div>
      </main>

      <BottomNav />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )

  const DesktopUI = () => (
    <div className="hidden md:block min-h-screen bg-bg">
      <DesktopHeader />

      <div className="mx-auto max-w-[1200px] px-6 py-8">
        {/* Header */}
        <div className="mb-8 text-center">
          <h1 className="text-[32px] font-bold text-fg mb-2">Help & Support Center</h1>
          <p className="text-fg-muted text-base">We&apos;re here to help you with any questions or concerns</p>
        </div>

        {/* Contact Methods */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          {contactMethods.map((method, idx) => {
            const Icon = method.icon
            return (
              <button
                key={idx}
                onClick={method.onClick}
                className="flex flex-col items-center gap-3 bg-white border-2 border-line rounded-2xl p-6 hover:border-orange hover:shadow-lg transition-all cursor-pointer"
              >
                <div className={`${method.lightColor} rounded-xl p-4`}>
                  <Icon className={`h-8 w-8 ${method.textColor}`} strokeWidth={2} />
                </div>
                <div className="text-center">
                  <p className="text-fg font-bold text-base mb-1">{method.title}</p>
                  <p className="text-fg-muted text-sm mb-3">{method.description}</p>
                  <span className={`${method.textColor} font-semibold text-sm`}>{method.action} →</span>
                </div>
              </button>
            )
          })}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Help Categories */}
          <div className="lg:col-span-2">
            <div className="bg-white border border-line rounded-2xl p-6 mb-6">
              <h3 className="text-fg font-bold text-xl mb-4">Browse Help Topics</h3>
              <div className="grid grid-cols-2 gap-4">
                {helpCategories.map((category, idx) => {
                  const Icon = category.icon
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-3 bg-surface border border-line rounded-xl p-4 hover:border-orange hover:shadow-md transition-all"
                    >
                      <div className="bg-orange/10 rounded-lg p-2.5">
                        <Icon className="h-6 w-6 text-orange" strokeWidth={2} />
                      </div>
                      <div className="flex-1">
                        <p className="text-fg font-bold text-sm mb-1">{category.title}</p>
                        <p className="text-fg-muted text-xs mb-2">{category.description}</p>
                        <ul className="space-y-1">
                          {category.items.map((item, i) => (
                            <li key={i}>
                              <button
                                onClick={() => router.push(item.link)}
                                className="text-orange text-xs flex items-center gap-1 hover:text-orange-deep hover:underline transition-colors cursor-pointer"
                              >
                                <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
                                {item.name}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* FAQs */}
            <div className="bg-white border border-line rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-4">
                <HelpCircle className="h-6 w-6 text-orange" strokeWidth={2} />
                <h3 className="text-fg font-bold text-xl">Frequently Asked Questions</h3>
              </div>
              <div className="space-y-3">
                {faqs.map((faq, idx) => (
                  <div key={idx} className="border border-line rounded-xl overflow-hidden">
                    <button
                      onClick={() => setExpandedFAQ(expandedFAQ === idx ? null : idx)}
                      className="w-full flex items-center justify-between gap-3 p-4 text-left hover:bg-surface-2 transition-colors"
                    >
                      <span className="text-fg font-semibold text-sm flex-1">{faq.question}</span>
                      <ChevronRight 
                        className={`h-5 w-5 text-fg-muted transition-transform ${expandedFAQ === idx ? 'rotate-90' : ''}`} 
                        strokeWidth={2.5} 
                      />
                    </button>
                    {expandedFAQ === idx && (
                      <div className="px-4 pb-4 pt-0">
                        <p className="text-fg-muted text-sm leading-relaxed">{faq.answer}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column - Contact Info */}
          <div className="space-y-6">
            {/* Business Hours */}
            <div className="bg-gradient-to-br from-orange/5 to-orange/10 border border-orange/20 rounded-2xl p-6">
              <div className="flex items-start gap-3 mb-4">
                <div className="bg-orange/10 rounded-lg p-2.5">
                  <Clock className="h-6 w-6 text-orange" strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <h4 className="text-fg font-bold text-base mb-1">Business Hours</h4>
                </div>
              </div>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-fg-muted">Monday - Saturday</span>
                  <span className="text-fg font-semibold">9:00 AM - 6:00 PM</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-fg-muted">Sunday</span>
                  <span className="text-fg font-semibold">Closed</span>
                </div>
              </div>
            </div>

            {/* Address */}
            {/* Removed - Address section hidden */}

            {/* Quick Links */}
            <div className="bg-white border border-line rounded-2xl p-6">
              <h4 className="text-fg font-bold text-base mb-3">Quick Links</h4>
              <div className="space-y-2">
                {[
                  { icon: FileText, text: 'Terms & Conditions', link: '/terms' },
                  { icon: Shield, text: 'Privacy Policy', link: '/privacy-policy' },
                  { icon: RotateCcw, text: 'Return Policy', link: '/refund-policy' },
                  { icon: Truck, text: 'Shipping Policy', link: '/shipping-policy' }
                ].map((item, idx) => {
                  const Icon = item.icon
                  return (
                    <button
                      key={idx}
                      onClick={() => router.push(item.link)}
                      className="w-full flex items-center gap-2 p-2 rounded-lg hover:bg-surface-2 transition-colors text-left"
                    >
                      <Icon className="h-4 w-4 text-fg-muted" strokeWidth={2} />
                      <span className="text-fg text-sm flex-1">{item.text}</span>
                      <ChevronRight className="h-4 w-4 text-fg-muted" strokeWidth={2} />
                    </button>
                  )
                })}
              </div>
            </div>
          </div>
        </div>
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

export default function HelpSupportPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
      </div>
    }>
      <HelpSupportContent />
    </Suspense>
  )
}
