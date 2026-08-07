'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Package, TrendingUp, ArrowRight, X, LayoutGrid } from 'lucide-react'
import { MobileHeader } from '../../../src/components/mobile/MobileHeader'
import { MenuDrawer } from '../../../src/components/mobile/MenuDrawer'
import { BottomNav } from '../../../src/components/mobile/BottomNav'
import { Header } from '../../../src/components/desktop/Header'
import { Footer } from '../../../src/components/desktop/Footer'
import { useCountry } from '../../../src/context/CountryContext'
import { useWishlist } from '../../../src/context/WishlistContext'
import { useCart } from '../../../src/context/CartContext'
import { getCategoryList, getSubcategoryList, getAllProducts } from '../../../src/services/homeService'
import { ProductCard } from '../../../src/components/desktop/ProductCard'
import { MProductCard } from '../../../src/components/mobile/MProductCard'

function DesktopCategoryDetail({ category, subcategories, loading, categoryId, router }) {
  const processedSubcategories = subcategories.map(sub => {
    const children = (sub.childsubcategory || []).filter(
      child => child.name.toLowerCase() !== 'all'
    )
    return {
      ...sub,
      childsubcategory: children,
      hasChildren: children.length > 0
    }
  })

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />

      <main className="mx-auto max-w-shell w-full px-4 md:px-6 pt-2.5 pb-6 flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[11px] text-fg-muted mb-3">
          <Link href="/" className="hover:text-orange transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
          <Link href="/categories" className="hover:text-orange transition-colors">Categories</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
          <span className="font-semibold text-navy">{category?.name || 'Category'}</span>
        </nav>

        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="mb-3 h-8 w-8 animate-spin rounded-full border-3 border-orange border-t-transparent mx-auto" />
              <p className="text-xs text-fg-muted">Loading category...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Compact Category Header */}
            {category && (
              <div className="relative overflow-hidden rounded-lg bg-gradient-to-r from-navy to-navy/90 flex items-center justify-between px-6 py-4 shadow-sm mb-5">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/15 overflow-hidden backdrop-blur-sm border border-white/20 shrink-0">
                    {(category.icon_url || category.icon_image) ? (
                      <img
                        src={category.icon_url || category.icon_image}
                        alt={category.name}
                        className="h-full w-full object-contain p-1.5"
                      />
                    ) : (
                      <Package className="h-5 w-5 text-white" strokeWidth={2} />
                    )}
                  </span>
                  <div>
                    <h1 className="font-display text-xl font-bold tracking-tight text-white">
                      {category.name}
                    </h1>
                    <p className="text-xs text-white/75 mt-0.5">
                      Explore {subcategories.length} subcategories
                    </p>
                  </div>
                </div>
                <Link
                  href={`/products?category=${categoryId}`}
                  className="inline-flex items-center gap-1 rounded-lg bg-orange hover:bg-orange-deep px-4 py-1.5 text-xs font-bold text-white transition-all shadow-sm hover:shadow-md hover:scale-[1.02] active:scale-[0.98]"
                >
                  Shop All <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                </Link>
              </div>
            )}

            {/* Subcategories with Child Categories */}
            {subcategories.length > 0 ? (
              <div className="space-y-6">
                {processedSubcategories.map((sub) => {
                  const children = sub.childsubcategory || []
                  const hasChildren = children.length > 0

                  return (
                    <div key={sub.id} className="rounded-xl border border-line bg-white p-4 md:p-5 shadow-2xs">
                      {/* Subcategory Header */}
                      <div className="flex items-center justify-between border-b border-line/60 pb-3 mb-4">
                        <h2 className="font-display text-base font-bold text-navy flex items-center gap-2">
                          {sub.name}
                        </h2>
                        <button
                          onClick={() => router.push(`/products?category=${categoryId}&subcategory=${sub.id}`)}
                          className="text-xs font-semibold text-orange hover:text-orange-deep flex items-center gap-1 transition-colors group cursor-pointer"
                        >
                          View All <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-0.5 transition-transform" strokeWidth={2.25} />
                        </button>
                      </div>

                      {/* Child Categories Grid */}
                      {hasChildren ? (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                          {children.map((child) => (
                            <button
                              key={child.id}
                              onClick={() => router.push(`/products?category=${categoryId}&subcategory=${sub.id}&childcategoryid=${child.id}`)}
                              className="group flex flex-col items-center text-center cursor-pointer select-none"
                            >
                              <div className="h-20 w-20 rounded-xl bg-surface border border-line-soft overflow-hidden flex items-center justify-center p-2.5 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-orange/30">
                                {(child.image_url || child.subcategory_image || child.icon_image) ? (
                                  <img
                                    src={child.image_url || child.subcategory_image || child.icon_image}
                                    alt={child.name}
                                    className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                  />
                                ) : (
                                  <Package className="h-7 w-7 text-fg-subtle opacity-65" strokeWidth={1.5} />
                                )}
                              </div>
                              <span className="mt-2 text-xs font-medium text-fg group-hover:text-orange-deep leading-tight transition-colors line-clamp-2 px-1">
                                {child.name}
                              </span>
                            </button>
                          ))}
                        </div>
                      ) : (
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 xl:grid-cols-7 gap-4">
                          <button
                            onClick={() => router.push(`/products?category=${categoryId}&subcategory=${sub.id}`)}
                            className="group flex flex-col items-center text-center cursor-pointer select-none"
                          >
                            <div className="h-20 w-20 rounded-xl bg-surface border border-line-soft overflow-hidden flex items-center justify-center p-2.5 transition-all duration-200 group-hover:-translate-y-1 group-hover:shadow-md group-hover:border-orange/30">
                              {(sub.image_url || sub.subcategory_image || sub.icon_image) ? (
                                <img
                                  src={sub.image_url || sub.subcategory_image || sub.icon_image}
                                  alt={sub.name}
                                  className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                                />
                              ) : (
                                <Package className="h-7 w-7 text-fg-subtle opacity-65" strokeWidth={1.5} />
                              )}
                            </div>
                            <span className="mt-2 text-xs font-medium text-fg group-hover:text-orange-deep leading-tight transition-colors line-clamp-2 px-1">
                              {sub.name}
                            </span>
                          </button>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-16 text-center">
                <div className="bg-surface rounded-full p-4 mb-3">
                  <Package className="h-10 w-10 text-fg-subtle" strokeWidth={1.5} />
                </div>
                <h3 className="font-display text-sm font-bold text-navy">No Subcategories</h3>
                <p className="text-xs text-fg-muted mt-1 max-w-xs">There are no subcategories available for this category.</p>
                <Link
                  href={`/products?category=${categoryId}`}
                  className="mt-4 inline-flex items-center gap-1 text-xs font-bold text-orange-deep hover:text-orange transition-colors"
                >
                  Browse all products <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  )
}

function MobileCategoryDetail({ category, subcategories, loading, categoryId, router, menuOpen, setMenuOpen }) {
  const processedSubcategories = subcategories.map(sub => {
    const children = (sub.childsubcategory || []).filter(
      child => child.name.toLowerCase() !== 'all'
    )
    return {
      ...sub,
      childsubcategory: children,
      hasChildren: children.length > 0
    }
  })

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {/* Top bar */}
      <div className="flex shrink-0 items-center gap-2 bg-navy px-3 py-3">
        <button 
          onClick={() => router.back()} 
          className="grid h-9 w-9 place-items-center rounded-lg text-white active:bg-white/10"
          aria-label="Go back"
        >
          <ChevronLeft className="h-6 w-6" strokeWidth={2.25} />
        </button>
        <h2 className="flex-1 font-display text-lg font-bold tracking-tight text-white">
          {category?.name || 'Category'}
        </h2>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto bg-bg p-4">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent mx-auto" />
              <p className="text-sm text-fg-muted">Loading...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Category banner */}
            {category && (
              <div className="relative mb-5 h-32 overflow-hidden rounded-xl bg-navy shadow-sm">
                {(category.image_url || category.category_image) && (
                  <img
                    src={category.image_url || category.category_image}
                    alt={category.name}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                )}
                <div
                  className="absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(15,23,42,0.92) 0%, rgba(15,23,42,0.55) 60%, rgba(15,23,42,0.15) 100%)",
                  }}
                />
                <div className="relative flex h-full flex-col justify-center px-4">
                  <div className="flex items-center gap-2">
                    <span className="grid h-8 w-8 place-items-center rounded-lg bg-white/15 overflow-hidden">
                      {(category.icon_url || category.icon_image) ? (
                        <img
                          src={category.icon_url || category.icon_image}
                          alt={category.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-4 w-4 text-white" strokeWidth={2} />
                      )}
                    </span>
                    <h3 className="font-display text-lg font-bold tracking-tight text-white">
                      {category.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-[12px] text-on-navy">
                    Explore {category.name} products
                  </p>
                  <Link 
                    href={`/products?category=${categoryId}`}
                    className="mt-2 inline-flex w-fit items-center gap-1 rounded-md bg-orange px-3 py-1.5 text-[12px] font-semibold text-white active:bg-orange-deep"
                  >
                    Shop all <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </Link>
                </div>
              </div>
            )}

            {/* Subcategories */}
            {subcategories.length > 0 ? (
              <div className="space-y-3">
                {processedSubcategories.map((sub) => {
                  const children = sub.childsubcategory || [];
                  const hasChildren = children.length > 0;

                  return (
                    <button
                      key={sub.id}
                      onClick={() => {
                        // Navigate directly to products page for this subcategory
                        router.push(`/products?category=${categoryId}&subcategory=${sub.id}`);
                      }}
                      className="flex items-center gap-3 w-full rounded-lg bg-white border border-line p-3 active:bg-surface-2"
                    >
                      <span className="grid h-12 w-12 place-items-center rounded-lg bg-surface overflow-hidden shrink-0">
                        {(sub.image_url || sub.subcategory_image || sub.icon_image) ? (
                          <img
                            src={sub.image_url || sub.subcategory_image || sub.icon_image}
                            alt={sub.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <Package className="h-5 w-5 text-fg-muted" strokeWidth={1.5} />
                        )}
                      </span>
                      <span className="text-left text-[12px] leading-tight text-fg font-medium flex-1">
                        {sub.name}
                      </span>
                      <ChevronRight className="h-4 w-4 text-fg-subtle shrink-0" strokeWidth={2} />
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-fg-subtle mb-3" strokeWidth={1.5} />
                <p className="text-sm text-fg-muted">No subcategories available</p>
              </div>
            )}
          </>
        )}
      </div>

      <BottomNav />
      <MenuDrawer open={menuOpen} onClose={() => setMenuOpen(false)} />
    </div>
  )
}

export default function CategoryDetailClient() {
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState(null)
  const [subcategories, setSubcategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { country, isLoading: isCountryLoading } = useCountry()
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id

  // Detect device type
  useEffect(() => {
    setIsMounted(true)
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch category data
  useEffect(() => {
    if (categoryId && !isCountryLoading && country) {
      fetchCategoryData()
    }
  }, [categoryId, country?.id, isCountryLoading])

  const fetchCategoryData = async () => {
    if (!country) return
    try {
      setLoading(true)
      
      // Fetch all categories to get the current category details
      const cats = await getCategoryList(country.id)
      const currentCategory = cats.find(c => String(c.id) === String(categoryId))
      setCategory(currentCategory)

      // Fetch subcategories
      const subs = await getSubcategoryList(categoryId, country.id)
      setSubcategories(subs || [])
    } catch (error) {
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (isMounted && isMobile && categoryId) {
      router.replace(`/categories?category=${categoryId}`)
    }
  }, [isMounted, isMobile, categoryId, router])

  if (isMobile) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-bg">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent" />
        <p className="mt-4 text-sm text-fg-muted font-medium">Redirecting...</p>
      </div>
    )
  }

  return (
    <DesktopCategoryDetail 
      category={category}
      subcategories={subcategories}
      loading={loading}
      categoryId={categoryId}
      router={router}
    />
  )
}
