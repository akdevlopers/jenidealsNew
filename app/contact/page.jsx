'use client'

import { useState, useEffect } from 'react'
import { Mail, Phone, MapPin, Clock, MessageCircle, Send, User, FileText } from 'lucide-react'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer'

export default function ContactPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    setIsMounted(true)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  if (!isMounted) return null

  const whatsappNumber = '918939691995'
  const phoneNumber = '+91 8939691995'
  const emailAddress = 'support@jenideals.com'

  const handleWhatsApp = () => {
    const message = encodeURIComponent('Hi, I would like to get in touch with Jenideals.')
    window.open(`https://wa.me/${whatsappNumber}?text=${message}`, '_blank')
  }

  const handleCall = () => {
    window.location.href = `tel:${phoneNumber}`
  }

  const handleEmail = () => {
    window.location.href = `mailto:${emailAddress}`
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    // Simulate form submission
    setTimeout(() => {
      alert('Thank you for contacting us! We will get back to you shortly.')
      setFormData({ name: '', email: '', subject: '', message: '' })
      setIsSubmitting(false)
    }, 1500)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const contactMethods = [
    {
      icon: MessageCircle,
      title: 'WhatsApp Support',
      value: whatsappNumber,
      description: 'Quick response via WhatsApp',
      action: 'Chat Now',
      color: 'bg-[#25D366]',
      textColor: 'text-[#25D366]',
      onClick: handleWhatsApp
    },
    {
      icon: Phone,
      title: 'Call Us',
      value: phoneNumber,
      description: 'Mon-Sat: 9 AM - 6 PM',
      action: 'Call Now',
      color: 'bg-blue-500',
      textColor: 'text-blue-500',
      onClick: handleCall
    },
    {
      icon: Mail,
      title: 'Email Support',
      value: emailAddress,
      description: 'We reply within 24 hours',
      action: 'Send Email',
      color: 'bg-orange',
      textColor: 'text-orange',
      onClick: handleEmail
    }
  ]

  const offices = [
    {
      country: 'India',
      address: '44/1/119A, Aynavaram, Chennai - 600023',
      phone: '+91 8939691995',
      email: 'support@jenideals.com'
    },
    {
      country: 'UAE',
      address: 'BC-890375, 26th Floor, Amber Gem Tower, Ajman',
      phone: '+971 54 532 0252',
      email: 'support@jenideals.com'
    }
  ]

  const content = (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:py-8">
      {/* Hero Section */}
      <div className="mb-8 text-center animate-fade-in">
        <span className="text-orange text-[10px] font-extrabold uppercase tracking-widest bg-orange/10 px-2.5 py-1 rounded-full w-fit mb-3 inline-flex items-center gap-1.5">
          <MessageCircle className="h-3 w-3" /> Get In Touch
        </span>
        <h1 className="font-display text-3xl lg:text-4xl font-black text-navy tracking-tight mb-3">
          Contact Us
        </h1>
        <p className="text-base lg:text-lg text-fg-muted max-w-2xl mx-auto leading-relaxed">
          Have questions? We&apos;d love to hear from you. Send us a message and we&apos;ll respond as soon as possible.
        </p>
      </div>

      {/* Contact Methods */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
        {contactMethods.map((method, idx) => {
          const Icon = method.icon
          return (
            <button
              key={idx}
              onClick={method.onClick}
              className="bg-white border-2 border-line rounded-2xl p-6 hover:border-orange hover:shadow-md transition-all text-center active:scale-[0.98]"
            >
              <div className={`${method.color} rounded-xl p-3 w-fit mx-auto mb-3`}>
                <Icon className="h-6 w-6 text-white" strokeWidth={2} />
              </div>
              <h3 className="text-base font-bold text-navy mb-1">{method.title}</h3>
              <p className="text-sm text-fg-muted mb-2">{method.description}</p>
              <p className={`text-xs font-semibold ${method.textColor} mb-3`}>{method.value}</p>
              <span className={`text-sm font-semibold ${method.textColor}`}>
                {method.action} →
              </span>
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-10">
        {/* Contact Form */}
        <div className="bg-white border border-line rounded-2xl p-6 lg:p-8 shadow-sm">
          <h2 className="text-xl lg:text-2xl font-black text-navy mb-2">Send Us a Message</h2>
          <p className="text-sm text-fg-muted mb-6">Fill out the form below and we&apos;ll get back to you soon</p>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-semibold text-fg mb-2">
                Full Name *
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-subtle" strokeWidth={2} />
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-sm"
                  placeholder="Enter your full name"
                />
              </div>
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-semibold text-fg mb-2">
                Email Address *
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-subtle" strokeWidth={2} />
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-sm"
                  placeholder="your.email@example.com"
                />
              </div>
            </div>

            <div>
              <label htmlFor="subject" className="block text-sm font-semibold text-fg mb-2">
                Subject *
              </label>
              <div className="relative">
                <FileText className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-fg-subtle" strokeWidth={2} />
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={handleInputChange}
                  required
                  className="w-full pl-10 pr-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-sm"
                  placeholder="What is this regarding?"
                />
              </div>
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-semibold text-fg mb-2">
                Message *
              </label>
              <textarea
                id="message"
                name="message"
                value={formData.message}
                onChange={handleInputChange}
                required
                rows={5}
                className="w-full px-4 py-3 border border-line rounded-xl focus:outline-none focus:ring-2 focus:ring-orange focus:border-transparent text-sm resize-none"
                placeholder="Tell us more about your inquiry..."
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-orange text-white font-semibold py-3.5 rounded-xl hover:bg-orange-deep transition-colors shadow-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  Sending...
                </>
              ) : (
                <>
                  <Send className="h-5 w-5" strokeWidth={2} />
                  Send Message
                </>
              )}
            </button>
          </form>
        </div>

        {/* Office Locations & Info */}
        <div className="space-y-6">
          {/* Business Hours */}
          <div className="bg-gradient-to-br from-orange/5 to-orange/10 border border-orange/20 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-4">
              <div className="bg-orange/10 rounded-xl p-2.5">
                <Clock className="h-6 w-6 text-orange" strokeWidth={2} />
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy mb-1">Business Hours</h3>
                <p className="text-sm text-fg-muted">We&apos;re here to help</p>
              </div>
            </div>
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-sm">
                <span className="text-fg-muted font-medium">Monday - Saturday</span>
                <span className="text-fg font-semibold">9:00 AM - 6:00 PM</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-fg-muted font-medium">Sunday</span>
                <span className="text-sale font-semibold">Closed</span>
              </div>
              <div className="pt-2 border-t border-orange/20">
                <p className="text-xs text-fg-muted">All times in local timezone</p>
              </div>
            </div>
          </div>

          {/* Office Locations */}
          <div className="space-y-4">
            {offices.map((office, idx) => (
              <div key={idx} className="bg-white border border-line rounded-2xl p-6">
                <div className="flex items-start gap-3 mb-3">
                  <div className="bg-navy/10 rounded-xl p-2.5 shrink-0">
                    <MapPin className="h-5 w-5 text-navy" strokeWidth={2} />
                  </div>
                  <div className="flex-1">
                    <h4 className="text-base font-bold text-navy mb-1">{office.country} Office</h4>
                    <p className="text-sm text-fg-muted leading-relaxed mb-3">{office.address}</p>
                    <div className="space-y-1.5">
                      <a href={`tel:${office.phone}`} className="flex items-center gap-2 text-xs text-fg-muted hover:text-orange transition-colors">
                        <Phone className="h-3.5 w-3.5" strokeWidth={2} />
                        {office.phone}
                      </a>
                      <a href={`mailto:${office.email}`} className="flex items-center gap-2 text-xs text-fg-muted hover:text-orange transition-colors">
                        <Mail className="h-3.5 w-3.5" strokeWidth={2} />
                        {office.email}
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Quick Contact CTA */}
          <div className="bg-[#25D366]/10 border-2 border-[#25D366]/20 rounded-2xl p-6 text-center">
            <MessageCircle className="h-10 w-10 text-[#25D366] mx-auto mb-3" strokeWidth={2} />
            <h4 className="text-base font-bold text-navy mb-2">Need Immediate Help?</h4>
            <p className="text-sm text-fg-muted mb-4">Chat with us on WhatsApp for instant support</p>
            <button
              onClick={handleWhatsApp}
              className="w-full bg-[#25D366] text-white font-semibold py-3 rounded-xl shadow-md hover:bg-[#20BA5A] transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" strokeWidth={2} />
              Open WhatsApp
            </button>
          </div>
        </div>
      </div>

      {/* Company Info Footer */}
      <div className="bg-white border border-line rounded-2xl p-6 text-center">
        <h3 className="text-base font-bold text-navy mb-2">JENI&apos;S HABIBEE BAZAAR PRIVATE LIMITED</h3>
        <p className="text-sm text-fg-muted">
          Registered office: 44/1/119A, Aynavaram, Chennai - 600023, Tamil Nadu, India
        </p>
      </div>
    </div>
  )

  return (
    <div className="flex min-h-screen flex-col bg-bg relative overflow-hidden">
      {/* Decorative background gradients */}
      <div className="absolute top-10 -left-24 w-80 h-80 bg-orange opacity-[0.02] rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-16 -right-24 w-80 h-80 bg-orange-deep opacity-[0.02] rounded-full blur-3xl pointer-events-none" />

      {isMobile ? (
        <>
          <MobileHeader onOpenMenu={() => setMenuOpen(true)} showSearch={false} />
          <main className="flex-1 pb-20 z-10">
            {content}
          </main>
          <BottomNav />
          <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
        </>
      ) : (
        <>
          <Header />
          <main className="flex-1 z-10 bg-gradient-to-br from-orange-50/5 via-bg to-orange-50/5">
            {content}
          </main>
          <Footer />
        </>
      )}
    </div>
  )
}
