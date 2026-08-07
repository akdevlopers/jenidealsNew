'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, Suspense } from 'react'
import { Briefcase, Users, Heart, TrendingUp, Coffee, Zap, Globe, Award, Mail, Send } from 'lucide-react'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { MobileHeader } from '../../src/components/mobile/MobileHeader'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { MenuDrawer } from '../../src/components/mobile/MenuDrawer'

function CareersContent() {
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

  const benefits = [
    {
      icon: Heart,
      title: 'Health & Wellness',
      description: 'Comprehensive health insurance and wellness programs for you and your family'
    },
    {
      icon: TrendingUp,
      title: 'Career Growth',
      description: 'Clear career progression paths with regular training and skill development opportunities'
    },
    {
      icon: Coffee,
      title: 'Work-Life Balance',
      description: 'Flexible working hours and remote work options to maintain healthy work-life balance'
    },
    {
      icon: Zap,
      title: 'Innovation Culture',
      description: 'Freedom to experiment, innovate, and bring creative ideas to life'
    },
    {
      icon: Users,
      title: 'Great Team',
      description: 'Work with passionate, talented people who love what they do'
    },
    {
      icon: Award,
      title: 'Competitive Pay',
      description: 'Industry-leading compensation packages with performance bonuses'
    }
  ]

  const openPositions = []

  const values = [
    {
      icon: Globe,
      title: 'Think Global',
      description: 'We operate across borders and think beyond boundaries'
    },
    {
      icon: Users,
      title: 'Customer Obsessed',
      description: 'Every decision we make starts with the customer in mind'
    },
    {
      icon: Zap,
      title: 'Move Fast',
      description: 'We experiment, learn quickly, and iterate constantly'
    },
    {
      icon: Heart,
      title: 'Care Deeply',
      description: 'We genuinely care about our team, customers, and sellers'
    }
  ]

  const content = (
    <div className="mx-auto max-w-6xl px-4 py-6 lg:py-8">
      {/* Hero Section */}
      <div className="mb-10 text-center animate-fade-in">
        <span className="text-orange text-[10px] font-extrabold uppercase tracking-widest bg-orange/10 px-2.5 py-1 rounded-full w-fit mb-3 inline-flex items-center gap-1.5">
          <Briefcase className="h-3 w-3" /> Careers
        </span>
        <h1 className="font-display text-3xl lg:text-5xl font-black text-navy tracking-tight mb-4">
          Join Our Team
        </h1>
        <p className="text-base lg:text-xl text-fg-muted max-w-3xl mx-auto leading-relaxed">
          Help us build the future of online shopping. Join a team that&apos;s passionate about 
          connecting sellers with customers worldwide.
        </p>
      </div>

      {/* Culture Video/Image Placeholder */}
      <div className="rounded-2xl overflow-hidden mb-10 bg-gradient-to-br from-navy to-slate-900 h-64 lg:h-80 flex items-center justify-center relative">
        <div className="absolute inset-0 bg-[url('/api/placeholder/1200/400')] bg-cover bg-center opacity-20" />
        <div className="relative z-10 text-center text-white p-6">
          <Briefcase className="h-16 w-16 mx-auto mb-4 text-orange" strokeWidth={1.5} />
          <h2 className="text-2xl lg:text-3xl font-bold mb-2">Life at Jenideals</h2>
          <p className="text-sm lg:text-base text-on-navy-muted max-w-lg mx-auto">
            A workplace where innovation meets passion, and every day brings new opportunities to make an impact
          </p>
        </div>
      </div>

      {/* Why Join Us */}
      <div className="mb-10">
        <h2 className="text-2xl lg:text-3xl font-black text-navy mb-6 text-center">Why Work With Us?</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 lg:gap-6">
          {benefits.map((benefit, idx) => {
            const Icon = benefit.icon
            return (
              <div key={idx} className="bg-white border border-line rounded-2xl p-6 hover:border-orange hover:shadow-md transition-all">
                <div className="bg-orange/10 rounded-xl p-3 w-fit mb-4">
                  <Icon className="h-6 w-6 text-orange" strokeWidth={2} />
                </div>
                <h3 className="text-base lg:text-lg font-bold text-navy mb-2">{benefit.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">{benefit.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Our Values */}
      <div className="rounded-2xl border border-line bg-gradient-to-br from-orange/5 to-orange/10 p-6 lg:p-8 mb-10">
        <h2 className="text-2xl lg:text-3xl font-black text-navy mb-6 text-center">Our Values</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6">
          {values.map((value, idx) => {
            const Icon = value.icon
            return (
              <div key={idx} className="text-center">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-white shadow-sm mb-3">
                  <Icon className="h-7 w-7 text-orange" strokeWidth={2} />
                </div>
                <h3 className="text-base font-bold text-navy mb-2">{value.title}</h3>
                <p className="text-sm text-fg-muted leading-relaxed">{value.description}</p>
              </div>
            )
          })}
        </div>
      </div>

      {/* Open Positions */}
      <div className="mb-10">
        <h2 className="text-2xl lg:text-3xl font-black text-navy mb-2 text-center">Open Positions</h2>
        <p className="text-base text-fg-muted text-center mb-6">
          No openings at the moment
        </p>
        
        {/* No positions message */}
        <div className="bg-white border-2 border-line rounded-2xl p-8 lg:p-12 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-orange/10 mb-4">
            <Briefcase className="h-8 w-8 text-orange" strokeWidth={2} />
          </div>
          <h3 className="text-xl font-bold text-navy mb-3">No Current Openings</h3>
          <p className="text-base text-fg-muted max-w-lg mx-auto mb-6">
            We don&apos;t have any open positions at the moment, but we&apos;re always looking for talented individuals to join our team.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
            <a
              href="mailto:careers@jenideals.com"
              className="inline-flex items-center gap-2 bg-orange text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-deep transition-colors shadow-md"
            >
              <Mail className="h-5 w-5" strokeWidth={2} />
              Send Your Resume
            </a>
            <button
              onClick={() => window.location.href = '/contact'}
              className="inline-flex items-center gap-2 bg-surface border-2 border-line text-navy font-semibold px-6 py-3 rounded-xl hover:border-orange transition-colors"
            >
              Contact Us
            </button>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl border border-line bg-navy p-6 lg:p-10 text-center text-white">
        <Mail className="h-12 w-12 mx-auto mb-4 text-orange" strokeWidth={1.5} />
        <h2 className="text-2xl lg:text-3xl font-black mb-3">Don&apos;t See a Perfect Match?</h2>
        <p className="text-base text-on-navy-muted mb-6 max-w-2xl mx-auto">
          We&apos;re always looking for talented individuals. Send us your resume and tell us how you can contribute to our mission.
        </p>
        <a
          href="mailto:careers@jenideals.com"
          className="inline-flex items-center gap-2 bg-orange text-white font-semibold px-6 py-3 rounded-xl hover:bg-orange-deep transition-colors shadow-lg"
        >
          <Mail className="h-5 w-5" strokeWidth={2} />
          Send Your Resume
        </a>
        <p className="text-sm text-on-navy-muted mt-4">
          Email us at <strong className="text-white">careers@jenideals.com</strong>
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

export default function CareersPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
      </div>
    }>
      <CareersContent />
    </Suspense>
  )
}
