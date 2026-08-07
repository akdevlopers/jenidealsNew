'use client'

import { useState, useEffect } from 'react'
import { Store, Users, Globe, Award, Target, Heart, TrendingUp, Shield, Clock } from 'lucide-react'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer'

export default function AboutPage() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)

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

  const stats = [
    { label: 'Premium Fragrances', value: '500+', icon: Store },
    { label: 'Happy Customers', value: '50K+', icon: Users },
    { label: 'Authentic Brands', value: '100+', icon: Award },
    { label: 'Countries Served', value: '2', icon: Globe }
  ]

  const values = [
    {
      icon: Target,
      title: 'Quality First',
      description: 'Each perfume is crafted and selected with attention to ingredients, performance, and longevity. Quality is never compromised.'
    },
    {
      icon: Heart,
      title: 'Thoughtful Design',
      description: 'From fragrance notes to packaging, every detail is designed to reflect luxury and refinement that speaks to your personality.'
    },
    {
      icon: Shield,
      title: 'Transparency',
      description: 'Clear information, honest descriptions, and reliable service are at the core of our operations. What you see is what you get.'
    },
    {
      icon: Award,
      title: 'Customer-Centric',
      description: 'We listen, learn, and evolve based on customer preferences and feedback to deliver the perfect fragrance experience.'
    }
  ]

  const content = (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:py-8">
      {/* Hero Section */}
      <div className="mb-8 text-center animate-fade-in">
        <span className="text-orange text-[10px] font-extrabold uppercase tracking-widest bg-orange/10 px-2.5 py-1 rounded-full w-fit mb-3 inline-flex items-center gap-1.5">
          <Store className="h-3 w-3" /> About Us
        </span>
        <h1 className="font-display text-3xl lg:text-4xl font-black text-navy tracking-tight mb-3">
          Welcome to Jeni Deals
        </h1>
        <p className="text-base lg:text-lg text-fg-muted max-w-3xl mx-auto leading-relaxed">
          A fragrance-focused brand dedicated to bringing premium perfumes to customers who appreciate quality, elegance, and lasting impressions.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
        {stats.map((stat, idx) => {
          const Icon = stat.icon
          return (
            <div key={idx} className="bg-gradient-to-br from-white to-surface border border-line rounded-2xl p-5 text-center shadow-sm">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-xl bg-orange/10 mb-3">
                <Icon className="h-6 w-6 text-orange" strokeWidth={2} />
              </div>
              <div className="font-display text-2xl lg:text-3xl font-bold text-navy mb-1">{stat.value}</div>
              <div className="text-xs lg:text-sm text-fg-muted font-medium">{stat.label}</div>
            </div>
          )
        })}
      </div>

      {/* Our Story */}
      <div className="rounded-2xl border border-line bg-white/90 backdrop-blur-md p-6 lg:p-8 shadow-sm mb-8">
        <h2 className="text-xl lg:text-2xl font-black text-navy mb-4 flex items-center gap-2">
          <span className="w-1.5 h-6 bg-orange rounded" /> About Jeni Deals
        </h2>
        <div className="space-y-4 text-sm lg:text-base text-fg leading-relaxed">
          <p>
            <strong className="text-navy">Jeni Deals</strong> is a fragrance-focused brand dedicated to bringing premium perfumes 
            to customers who appreciate quality, elegance, and lasting impressions. Inspired by modern luxury and timeless aromas, 
            we curate and deliver perfumes that balance sophistication, intensity, and everyday wearability.
          </p>
          <p>
            Every fragrance at Jeni Deals is carefully selected and crafted to reflect individuality and confidence. From bold and 
            intense notes to warm and subtle blends, our collection is designed for people who want their scent to speak before they do.
          </p>
          <p>
            Rooted in quality and authenticity, <strong className="text-navy">Jeni Deals is more than just perfume—it&apos;s an experience 
            that lingers.</strong> Operating in <strong className="text-navy">India and UAE</strong>, we&apos;re committed to providing 
            a seamless shopping experience with authentic products, fast delivery, and dedicated customer support.
          </p>
        </div>
      </div>

      {/* Values Grid */}
      <div className="mb-8">
        <h2 className="text-xl lg:text-2xl font-black text-navy mb-6 text-center">Our Approach</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-6">
          {values.map((value, idx) => {
            const Icon = value.icon
            return (
              <div key={idx} className="bg-surface border border-line rounded-2xl p-6 hover:border-orange hover:shadow-md transition-all">
                <div className="flex items-start gap-4">
                  <div className="bg-orange/10 rounded-xl p-3 shrink-0">
                    <Icon className="h-6 w-6 text-orange" strokeWidth={2} />
                  </div>
                  <div>
                    <h3 className="text-base lg:text-lg font-bold text-navy mb-2">{value.title}</h3>
                    <p className="text-sm lg:text-base text-fg-muted leading-relaxed">{value.description}</p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Our Promise */}
      <div className="rounded-2xl border border-line bg-gradient-to-br from-navy to-slate-900 p-6 lg:p-8 text-white shadow-lg mb-8">
        <h2 className="text-xl lg:text-2xl font-black mb-6 text-center">Our Promise</h2>
        <p className="text-center text-base text-on-navy-muted mb-6 max-w-2xl mx-auto">
          We promise to deliver fragrances that exceed your expectations, every single time.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 mb-3">
              <Shield className="h-7 w-7 text-orange" strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold mb-2">Authentic Quality</h3>
            <p className="text-sm text-on-navy-muted">100% genuine and high-quality perfumes</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 mb-3">
              <Clock className="h-7 w-7 text-orange" strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold mb-2">Long-Lasting</h3>
            <p className="text-sm text-on-navy-muted">Performance that lasts throughout the day</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 mb-3">
              <Award className="h-7 w-7 text-orange" strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold mb-2">True to Description</h3>
            <p className="text-sm text-on-navy-muted">What we promise is what you experience</p>
          </div>
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white/10 mb-3">
              <Heart className="h-7 w-7 text-orange" strokeWidth={2} />
            </div>
            <h3 className="text-base font-bold mb-2">Value for Money</h3>
            <p className="text-sm text-on-navy-muted">Premium quality at honest prices</p>
          </div>
        </div>
      </div>

      {/* Our Mission */}
      <div className="rounded-2xl border border-line bg-gradient-to-br from-orange/5 to-orange/10 p-6 lg:p-8 mb-8">
        <h2 className="text-xl lg:text-2xl font-black text-navy mb-4 text-center">Our Mission</h2>
        <p className="text-base text-fg text-center max-w-3xl mx-auto leading-relaxed mb-6">
          Our mission is to make high-quality, long-lasting perfumes accessible to everyone without compromising on elegance or authenticity.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white rounded-xl p-4 border border-line">
            <h4 className="text-sm font-bold text-navy mb-2">✓ Offer premium fragrances at honest prices</h4>
            <p className="text-xs text-fg-muted">Quality perfumes shouldn&apos;t break the bank</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-line">
            <h4 className="text-sm font-bold text-navy mb-2">✓ Ensure consistent quality and originality</h4>
            <p className="text-xs text-fg-muted">Every bottle meets our strict standards</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-line">
            <h4 className="text-sm font-bold text-navy mb-2">✓ Create scents that leave a memorable impression</h4>
            <p className="text-xs text-fg-muted">Fragrances that speak before you do</p>
          </div>
          <div className="bg-white rounded-xl p-4 border border-line">
            <h4 className="text-sm font-bold text-navy mb-2">✓ Build long-term trust with our customers</h4>
            <p className="text-xs text-fg-muted">Your satisfaction is our commitment</p>
          </div>
        </div>
      </div>

      {/* Company Info */}
      <div className="mt-8 rounded-2xl border border-line bg-white/90 p-6 lg:p-8 text-center">
        <h3 className="text-base lg:text-lg font-black text-navy mb-2">JENI&apos;S HABIBEE BAZAAR PRIVATE LIMITED</h3>
        <p className="text-sm text-fg-muted mb-3">
          44/1/119A, THANTHAI PERIYAR NAGAR, Aynavaram,<br />
          Perambur Purasawalkam, Chennai - 600023, Tamil Nadu, India
        </p>
        <div className="inline-flex items-center gap-2 text-xs text-fg-muted bg-surface px-3 py-1.5 rounded-full">
          <Globe className="h-3.5 w-3.5" strokeWidth={2} />
          Serving customers in India & UAE
        </div>
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
