'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Package, X, LayoutGrid, Search } from 'lucide-react'
import { Header } from '../../../../src/components/desktop/Header'
import { Footer } from '../../../../src/components/desktop/Footer'
import { BottomNav } from '../../../../src/components/mobile/BottomNav'
import { MenuDrawer } from '../../../../src/components/mobile/MenuDrawer'
import { useCountry } from '../../../../src/context/CountryContext'
import { getCategoryList, getSubcategoryList } from '../../../../src/services/homeService'

function DesktopSubcategoryDetail({ category, subcategory, childCategories, loading, categoryId, subcategoryId, router }) {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      <Header />

      <main className="mx-auto max-w-shell w-full px-4 md:px-6 pt-3 pb-8 flex-1">
        {/* Breadcrumb */}
        <nav className="flex items-center gap-1.5 text-[12px] text-fg-muted mb-2">
          <Link href="/" className="hover:text-orange transition-colors">Home</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
          <Link href="/categories" className="hover:text-orange transition-colors">Categories</Link>
          <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
          <Link href={`/categories/${categoryId}`} className="hover:text-orange transition-colors">
            {category?.name || 'Category'}
          </Link>
          <ChevronRight className="h-3 w-3" strokeWidth={2.5} />
          <span className="font-semibold text-navy">{subcategory?.name || 'Subcategory'}</span>
        </nav>

        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent mx-auto" />
              <p className="text-sm text-fg-muted">Loading subcategory...</p>
            </div>
          </div>
        ) : (
          <>
            {/* Subcategory Banner */}
            {subcategory && (
              <div className="relative h-40 overflow-hidden rounded-xl bg-[#A9AEB6] flex items-center justify-between px-8 py-6 shadow-sm mb-6">
                <div className="flex flex-col justify-center">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/20 overflow-hidden backdrop-blur-sm">
                      {(subcategory.image_url || subcategory.subcategory_image || subcategory.icon_image) ? (
                        <img
                          src={subcategory.image_url || subcategory.subcategory_image || subcategory.icon_image}
                          alt={subcategory.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-6 w-6 text-white" strokeWidth={2} />
                      )}
                    </span>
                    <h1 className="font-display text-3xl font-bold tracking-tight text-white">
                      {subcategory.name}
                    </h1>
                  </div>
                  <p className="text-sm text-white/90 mb-4">
                    Browse {subcategory.name.toLowerCase()} products
                  </p>
                  <button
                    onClick={() => {
                      // Build URL with all child category IDs
                      const childIds = childCategories.map(c => c.id).join(',')
                      const url = childIds 
                        ? `/products?category=${categoryId}&subcategory=${subcategoryId}&childcategoryids=${childIds}`
                        : `/products?category=${categoryId}&subcategory=${subcategoryId}`
                      router.push(url)
                    }}
                    className="inline-flex w-fit items-center gap-1.5 rounded-lg bg-[#F97316] hover:bg-orange-deep px-5 py-2 text-[13px] font-bold text-white transition-all shadow-md shadow-orange/20 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  >
                    Shop all products <ChevronRight className="h-4 w-4" strokeWidth={2.25} />
                  </button>
                </div>

                <div className="relative h-28 w-28 shrink-0 rounded-full bg-white/25 flex items-center justify-center p-3 border border-white/10 shadow-inner">
                  {(subcategory.image_url || subcategory.subcategory_image || subcategory.icon_image) ? (
                    <img
                      src={subcategory.image_url || subcategory.subcategory_image || subcategory.icon_image}
                      alt={subcategory.name}
                      className="h-full w-full object-contain"
                    />
                  ) : (
                    <Package className="h-14 w-14 text-white" strokeWidth={1.5} />
                  )}
                </div>
              </div>
            )}

            {/* Child Categories Section */}
            {childCategories.length > 0 ? (
              <div className="space-y-6">
                <div className="flex items-center gap-2 mb-4">
                  <LayoutGrid className="h-5 w-5 text-orange" strokeWidth={2} />
                  <h2 className="font-display text-xl font-bold text-navy">Browse Categories</h2>
                </div>

                <div className="grid grid-cols-[repeat(auto-fill,minmax(160px,1fr))] gap-5">
                  {childCategories.map((child) => (
                    <Link
                      key={child.id}
                      href={`/products?category=${categoryId}&subcategory=${subcategoryId}&childcategoryid=${child.id}`}
                      className="group flex flex-col bg-white rounded-xl p-4 border border-line shadow-sm hover:shadow-md transition-all hover:-translate-y-1"
                    >
                      <div className="h-24 w-full rounded-lg bg-[#F8F9FA] border border-line-soft overflow-hidden flex items-center justify-center p-3 mb-3 transition-all duration-200 group-hover:border-orange/30">
                        {(child.image_url || child.subcategory_image || child.icon_image) ? (
                          <img
                            src={child.image_url || child.subcategory_image || child.icon_image}
                            alt={child.name}
                            className="max-h-full max-w-full object-contain transition-transform duration-500 group-hover:scale-110"
                          />
                        ) : (
                          <Package className="h-10 w-10 text-fg-subtle opacity-65" strokeWidth={1.5} />
                        )}
                      </div>
                      <h3 className="text-[13px] font-semibold text-fg group-hover:text-orange-deep leading-tight transition-colors line-clamp-2 text-center">
                        {child.name}
                      </h3>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <Package className="h-14 w-14 text-fg-subtle mb-3" strokeWidth={1.5} />
                <h3 className="font-display text-base font-bold text-navy">No Categories</h3>
                <p className="text-sm text-fg-muted mt-1 mb-4">There are no categories available.</p>
                <Link
                  href={`/products?category=${categoryId}&subcategory=${subcategoryId}`}
                  className="inline-flex items-center gap-1.5 text-sm font-bold text-orange-deep hover:text-orange"
                >
                  Browse all products <ChevronRight className="h-4 w-4" />
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

function MobileSubcategoryDetail({ category, subcategory, childCategories, loading, categoryId, subcategoryId, router, menuOpen, setMenuOpen }) {
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
          {subcategory?.name || 'Subcategory'}
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
            {/* Subcategory banner */}
            {subcategory && (
              <div className="relative mb-5 h-32 overflow-hidden rounded-xl bg-navy shadow-sm">
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
                      {(subcategory.image_url || subcategory.subcategory_image || subcategory.icon_image) ? (
                        <img
                          src={subcategory.image_url || subcategory.subcategory_image || subcategory.icon_image}
                          alt={subcategory.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-4 w-4 text-white" strokeWidth={2} />
                      )}
                    </span>
                    <h3 className="font-display text-lg font-bold tracking-tight text-white">
                      {subcategory.name}
                    </h3>
                  </div>
                  <p className="mt-1 text-[12px] text-on-navy">
                    Browse {subcategory.name} products
                  </p>
                  <button 
                    onClick={() => {
                      // Build URL with all child category IDs
                      const childIds = childCategories.map(c => c.id).join(',')
                      const url = childIds 
                        ? `/products?category=${categoryId}&subcategory=${subcategoryId}&childcategoryids=${childIds}`
                        : `/products?category=${categoryId}&subcategory=${subcategoryId}`
                      router.push(url)
                    }}
                    className="mt-2 inline-flex w-fit items-center gap-1 rounded-md bg-orange px-3 py-1.5 text-[12px] font-semibold text-white active:bg-orange-deep"
                  >
                    Shop all <ChevronRight className="h-3.5 w-3.5" strokeWidth={2.25} />
                  </button>
                </div>
              </div>
            )}

            {/* Child Categories */}
            {childCategories.length > 0 ? (
              <div className="grid grid-cols-3 gap-3">
                {childCategories.map((child) => (
                  <Link
                    key={child.id}
                    href={`/products?category=${categoryId}&subcategory=${subcategoryId}&childcategoryid=${child.id}`}
                    className="flex flex-col items-center gap-1.5 bg-surface rounded-lg p-2.5 border border-line active:opacity-70"
                  >
                    <span className="grid aspect-square w-full place-items-center rounded-lg border border-line bg-white overflow-hidden">
                      {(child.image_url || child.subcategory_image || child.icon_image) ? (
                        <img
                          src={child.image_url || child.subcategory_image || child.icon_image}
                          alt={child.name}
                          className="h-full w-full object-cover"
                        />
                      ) : (
                        <Package className="h-5 w-5 text-fg-muted" strokeWidth={1.5} />
                      )}
                    </span>
                    <span className="text-center text-[10px] leading-tight text-fg line-clamp-2">
                      {child.name}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Package className="h-12 w-12 text-fg-subtle mb-3" strokeWidth={1.5} />
                <p className="text-sm text-fg-muted mb-3">No categories available</p>
                <Link
                  href={`/products?category=${categoryId}&subcategory=${subcategoryId}`}
                  className="text-xs font-bold text-orange-deep"
                >
                  Browse all products
                </Link>
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

export default function CategoryClient() {
  const [isMobile, setIsMobile] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [category, setCategory] = useState(null)
  const [subcategory, setSubcategory] = useState(null)
  const [childCategories, setChildCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const { country, isLoading: isCountryLoading } = useCountry()
  const router = useRouter()
  const params = useParams()
  const categoryId = params.id
  const subcategoryId = params.subId

  // Detect device type
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Fetch data
  useEffect(() => {
    if (categoryId && subcategoryId && !isCountryLoading && country) {
      fetchData()
    }
  }, [categoryId, subcategoryId, country?.id, isCountryLoading])

  const fetchData = async () => {
    if (!country) return
    try {
      setLoading(true)
      
      // Fetch parent category
      const cats = await getCategoryList(country.id)
      const currentCategory = cats.find(c => String(c.id) === String(categoryId))
      
      // If category doesn't exist in this country, redirect to categories page
      if (!currentCategory) {
        router.push('/categories')
        return
      }
      
      setCategory(currentCategory)

      // Fetch subcategories to find the current one
      const subs = await getSubcategoryList(categoryId, country.id)
      
      // First, try to find as direct subcategory
      let currentSubcategory = subs.find(s => String(s.id) === String(subcategoryId))
      
      // If not found, search in childsubcategory arrays
      if (!currentSubcategory) {
        for (const sub of subs) {
          if (sub.childsubcategory && Array.isArray(sub.childsubcategory)) {
            const foundChild = sub.childsubcategory.find(child => String(child.id) === String(subcategoryId))
            if (foundChild) {
              // Redirect directly to products page for child subcategory
              router.push(`/products?category=${categoryId}&subcategory=${sub.id}&childcategoryid=${subcategoryId}`)
              return
            }
          }
        }
      }
      
      // If subcategory doesn't exist, redirect to category page
      if (!currentSubcategory) {
        router.push(`/categories/${categoryId}`)
        return
      }
      
      setSubcategory(currentSubcategory)

      // Get child categories from the subcategory
      const children = currentSubcategory?.childsubcategory || []
      
      // Filter out "All" categories
      const filteredChildren = children.filter(child => child.name.toLowerCase() !== 'all')
      
      // If no child categories, redirect to products page
      if (filteredChildren.length === 0) {
        router.push(`/products?category=${categoryId}&subcategory=${subcategoryId}`)
        return
      }
      
      setChildCategories(filteredChildren)
    } catch (error) {
      // On error, redirect to categories page
      router.push('/categories')
    } finally {
      setLoading(false)
    }
  }

  if (isMobile) {
    return (
      <MobileSubcategoryDetail 
        category={category}
        subcategory={subcategory}
        childCategories={childCategories}
        loading={loading}
        categoryId={categoryId}
        subcategoryId={subcategoryId}
        router={router}
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
      />
    )
  }

  return (
    <DesktopSubcategoryDetail 
      category={category}
      subcategory={subcategory}
      childCategories={childCategories}
      loading={loading}
      categoryId={categoryId}
      subcategoryId={subcategoryId}
      router={router}
    />
  )
}
