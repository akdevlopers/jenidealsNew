'use client'

export const dynamic = 'force-dynamic'

import { useState, useEffect, useMemo, useRef, Suspense } from 'react'
import { useRouter, useParams, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  ChevronLeft,
  ChevronRight,
  SlidersHorizontal,
  ChevronDown,
  Package,
  Search,
  X,
  LayoutGrid,
  List as ListIcon,
  Star,
  Heart,
  Plus,
  Check,
  BadgeCheck,
  Truck,
  Zap
} from 'lucide-react'
import { BottomNav } from '../../src/components/mobile/BottomNav'
import { MProductCard } from '../../src/components/mobile/MProductCard'
import { ProductCard } from '../../src/components/desktop/ProductCard'
import { Header } from '../../src/components/desktop/Header'
import { Footer } from '../../src/components/desktop/Footer'
import { FilterSidebar, emptyFilters } from '../../src/components/FilterSidebar'
import { priceBrackets } from '../../src/catalogWebCategory'
import { useCountry } from '../../src/context/CountryContext'
import { useCart } from '../../src/context/CartContext'
import { useWishlist } from '../../src/context/WishlistContext'
import { getAllProducts, getCategoriesWithSubAndChild, getBrandList } from '../../src/services/homeService';

const sortOptions = [
  { value: '', label: 'Recommended' },
  { value: 'low_to_high', label: 'Price: Low to High' },
  { value: 'high_to_low', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top rated' },
  { value: 'discount', label: 'Biggest discount' },
  { value: 'new', label: 'Newest first' },
]

function ProductsContent() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [showSort, setShowSort] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [showAllBrands, setShowAllBrands] = useState(false)
  const [showMoreFilters, setShowMoreFilters] = useState(false)
  const [categories, setCategories] = useState([])
  const [brands, setBrands] = useState([])
  const [selectedBrandName, setSelectedBrandName] = useState('')
  const [selectedCategoryName, setSelectedCategoryName] = useState('')
  const [filters, setFilters] = useState(emptyFilters)
  const [sortValue, setSortValue] = useState('')
  const [view, setView] = useState('grid')
  const [isMobile, setIsMobile] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [pagination, setPagination] = useState({
    current_page: 1,
    last_page: 1,
    per_page: 12,
    total: 0,
    from: 0,
    to: 0
  })
  
  // AbortController ref for cancelling pending requests
  const abortControllerRef = useRef(null)
  // Ref to prevent duplicate infinite scroll requests
  const isFetchingRef = useRef(false)
  // Sentinel ref for IntersectionObserver
  const sentinelRef = useRef(null)
  // Track last URL page param for desktop back/forward scroll detection
  const lastDesktopPageRef = useRef(null)

  const { country, isLoading: isCountryLoading } = useCountry()
  const { addToCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()
  const router = useRouter()
  const searchParams = useSearchParams()

  // Detect device type
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 1024)
    }
    setIsMounted(true)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
    }
  }, [])

  // Initialize filters from URL params and validate against current country
  // Clear products when category/subcategory/childcategory changes
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const subcategoryParam = searchParams.get('subcategory')
    const childcategoryParam = searchParams.get('childcategoryid') || searchParams.get('childcategory')

    if (categoryParam || subcategoryParam || childcategoryParam) {
      setFilters(prev => {
        const newFilters = { ...prev }
        if (categoryParam) {
          newFilters.selectedCategoryId = categoryParam
          newFilters.categories = [categoryParam]
        }
        if (subcategoryParam && !subcategoryParam.includes(',')) {
          newFilters.selectedSubcategoryId = subcategoryParam
          newFilters.subcategories = [subcategoryParam]
        }
        if (childcategoryParam && !childcategoryParam.includes(',')) {
          newFilters.selectedChildCategoryId = childcategoryParam
        }
        return newFilters
      })
      
      // Clear products immediately when category changes to prevent stale data
      setProducts([])
      setLoading(true)
      // Reset pagination to page 1 when filters change
      setPagination({
        current_page: 1,
        last_page: 1,
        per_page: 12,
        total: 0,
        from: 0,
        to: 0
      })
    }
  }, [searchParams])

  // Clear filters when country changes if category doesn't exist
  useEffect(() => {
    const validateAndClearFilters = async () => {
      if (!country) return
      const categoryParam = searchParams.get('category')

      if (categoryParam && categories.length > 0) {
        const categoryExists = categories.some(c => String(c.id) === String(categoryParam))

        if (!categoryExists) {
          setFilters(emptyFilters)
          setProducts([])
        }
      }
    }

    if (categories.length > 0 && country) {
      validateAndClearFilters()
    }
  }, [country?.id, categories])

  // Fetch initial data when component mounts or country changes
  useEffect(() => {
    if (!isCountryLoading && country) {
      fetchInitialData()
    }
  }, [country?.id, isCountryLoading])

  // Update category and brand names when data loads
  useEffect(() => {
    const categoryParam = searchParams.get('category')
    const subcategoryParam = searchParams.get('subcategory')
    const childcategoryParam = searchParams.get('childcategoryid') || searchParams.get('childcategory')
    const brandParam = searchParams.get('brand')

    if ((categoryParam || subcategoryParam || childcategoryParam) && categories.length > 0) {
      let name = ''

      // 1. Try childcategory first
      if (childcategoryParam) {
        for (const cat of categories) {
          const subs = cat.subcategory || cat.subcategories || cat.sub_categories || []
          for (const sub of subs) {
            const children = sub.childsubcategory || sub.child_subcategory || sub.child || sub.children || []
            const foundChild = children.find(ch => String(ch.id) === String(childcategoryParam))
            if (foundChild) {
              name = foundChild.name
              break
            }
          }
          if (name) break
        }
      }

      // 2. Try subcategory next
      if (!name && subcategoryParam) {
        for (const cat of categories) {
          const subs = cat.subcategory || cat.subcategories || cat.sub_categories || []
          const foundSub = subs.find(s => String(s.id) === String(subcategoryParam))
          if (foundSub) {
            name = foundSub.name
            break
          }
        }
      }

      // 3. Try category
      if (!name && categoryParam) {
        const foundCat = categories.find(c => String(c.id) === String(categoryParam))
        if (foundCat) {
          name = foundCat.name
        }
      }

      setSelectedCategoryName(name || '')
    } else {
      setSelectedCategoryName('')
    }

    if (brandParam) {
      const foundBrand = brands.find(b => {
        const brandId = String(b.id || b.brand_id || b.brandid || b.brandId || b.seller_id || b.vendor_id || '')
        const bName = String(b.brand_name || b.name || b.brandName || b.seller || '')
        return brandId === String(brandParam) || bName.toLowerCase() === String(brandParam).toLowerCase()
      })
      const resolvedName = foundBrand?.brand_name || foundBrand?.name || foundBrand?.brandName || foundBrand?.seller || (isNaN(Number(brandParam)) ? brandParam : '')
      setSelectedBrandName(resolvedName)
    } else {
      setSelectedBrandName('')
    }
  }, [categories, brands, searchParams])

  const categoryParam = searchParams.get('category') || filters.selectedCategoryId || ''
  const subcategoryParam = searchParams.get('subcategory') || filters.selectedSubcategoryId || ''
  const childcategoryParam = searchParams.get('childcategoryid') || searchParams.get('childcategory') || filters.selectedChildCategoryId || ''

  // Fetch brands dynamically based on selected category OR brand parameter
  useEffect(() => {
    const fetchBrands = async () => {
      if (!country) return
      try {
        const brandList = await getBrandList(categoryParam, country.id, subcategoryParam, childcategoryParam)
        setBrands(brandList || [])
      } catch (err) {
      }
    }

    if (isMounted && !isCountryLoading && country) {
      fetchBrands()
    }
  }, [country?.id, categoryParam, subcategoryParam, childcategoryParam, isMounted, isCountryLoading])

  // Fetch products when search parameters, country, or sortValue change (NOT on every filter state change)
  const searchParamsString = searchParams.toString()

  useEffect(() => {
    if (!isCountryLoading && country && isMounted) {
      fetchProducts()
    }
  }, [country?.id, searchParamsString, sortValue, isCountryLoading, isMobile, isMounted])

  // Desktop-only: smooth scroll to top when URL ?page= changes via browser back/forward
  useEffect(() => {
    if (isMobile || !isMounted) return

    const currentPage = searchParams.get('page') || '1'
    const lastPage = lastDesktopPageRef.current

    // Only scroll on back/forward page transitions, not on initial mount or filter/category changes
    if (lastPage !== null && lastPage !== currentPage && typeof window !== 'undefined') {
      // Wait a tick so the new products begin rendering before we scroll,
      // and use smooth behavior for consistent UX across desktop browsers
      requestAnimationFrame(() => {
        window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      })
    }

    lastDesktopPageRef.current = currentPage
  }, [searchParams, isMobile, isMounted])

  // Infinite scroll - IntersectionObserver for mobile only
  useEffect(() => {
    if (!isMobile || !isMounted) return

    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        const [entry] = entries
        if (entry.isIntersecting && !loading && !loadingMore) {
          fetchMoreProducts()
        }
      },
      {
        root: null,
        rootMargin: '200px',
        threshold: 0.1
      }
    )

    observer.observe(sentinel)

    return () => {
      observer.disconnect()
    }
  }, [isMobile, isMounted, loading, loadingMore, pagination.current_page, pagination.last_page])

  const fetchInitialData = async () => {
    if (!country) return
    try {
      // Fetch categories for filter based on current country
      const cats = await getCategoriesWithSubAndChild(country.id)
      setCategories(cats)
    } catch (err) {
    }
  }

  const fetchProducts = async () => {
    if (!country) return
    
    // Reset infinite scroll fetching guard
    isFetchingRef.current = false
    
    // Cancel any pending request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    
    // Create new AbortController for this request
    abortControllerRef.current = new AbortController()
    const signal = abortControllerRef.current.signal
    
    try {
      setLoading(true)
      
      const categoryVal = searchParams.get('category') || filters.selectedCategoryId
      const subcategoryVal = searchParams.get('subcategory') || filters.selectedSubcategoryId
      const childsubcategoryVal = searchParams.get('childcategoryid') || searchParams.get('childcategory') || filters.selectedChildCategoryId
      const brandParam = searchParams.get('brand')
      const countryParam = searchParams.get('country') || country?.id || ''
      // Mobile always starts at page 1 for infinite scroll; desktop uses URL page param
      const pageParam = isMobile ? '1' : (searchParams.get('page') || '1')

      const params = countryParam ? { country: String(countryParam) } : {}
      if (categoryVal) params.category = String(categoryVal)
      if (subcategoryVal && !String(subcategoryVal).includes(',')) params.subcategory = String(subcategoryVal)
      if (childsubcategoryVal && !String(childsubcategoryVal).includes(',')) {
        params.childcategoryid = String(childsubcategoryVal)
        params.childCategoryId = String(childsubcategoryVal)
        params.childsubcategory = String(childsubcategoryVal)
      }
      if (sortValue) params.sort_val = sortValue
      if (brandParam) {
        params.brand = String(brandParam)
      }
      if (pageParam) {
        params.page = String(pageParam)
      }

      const result = await getAllProducts(params)

      if (signal.aborted) return

      const mergedProducts = Array.isArray(result) ? result : result.products || []

      // Deduplicate
      const uniqueProducts = []
      const seenIds = new Set()
      mergedProducts.forEach(p => {
        if (p && p.id && !seenIds.has(p.id)) {
          seenIds.add(p.id)
          uniqueProducts.push(p)
        }
      })

      setProducts(uniqueProducts)

      // Update pagination state if available
      if (result.pagination) {
        setPagination(result.pagination)
      }
    } catch (err) {
    } finally {
      if (!signal.aborted) {
        setLoading(false)
      }
    }
  }

  const fetchMoreProducts = async () => {
    if (!country || isFetchingRef.current) return
    if (pagination.current_page >= pagination.last_page) return

    isFetchingRef.current = true
    setLoadingMore(true)

    try {
      const categoryVal = searchParams.get('category') || filters.selectedCategoryId
      const subcategoryVal = searchParams.get('subcategory') || filters.selectedSubcategoryId
      const childsubcategoryVal = searchParams.get('childcategoryid') || searchParams.get('childcategory') || filters.selectedChildCategoryId
      const brandParam = searchParams.get('brand')
      const countryParam = searchParams.get('country') || country?.id || ''
      const nextPage = pagination.current_page + 1

      const params = countryParam ? { country: String(countryParam) } : {}
      if (categoryVal) params.category = String(categoryVal)
      if (subcategoryVal && !String(subcategoryVal).includes(',')) params.subcategory = String(subcategoryVal)
      if (childsubcategoryVal && !String(childsubcategoryVal).includes(',')) {
        params.childcategoryid = String(childsubcategoryVal)
        params.childCategoryId = String(childsubcategoryVal)
        params.childsubcategory = String(childsubcategoryVal)
      }
      if (sortValue) params.sort_val = sortValue
      if (brandParam) {
        params.brand = String(brandParam)
      }
      params.page = String(nextPage)

      const result = await getAllProducts(params)
      const newProducts = Array.isArray(result) ? result : result.products || []

      setProducts(prevProducts => {
        const seenIds = new Set(prevProducts.map(p => p.id))
        const uniqueNew = newProducts.filter(p => p && p.id && !seenIds.has(p.id))
        return [...prevProducts, ...uniqueNew]
      })

      if (result.pagination) {
        setPagination(result.pagination)
      }
    } catch (err) {
    } finally {
      setLoadingMore(false)
      isFetchingRef.current = false
    }
  }

  const filteredProducts = useMemo(() => {
    const brandParam = searchParams.get('brand')
    let targetBrandObj = null
    if (brandParam && brands.length > 0) {
      targetBrandObj = brands.find(b => {
        const bId = String(b.id || b.brand_id || '')
        const bName = String(b.brand_name || b.name || '')
        return bId === String(brandParam) || bName.toLowerCase() === String(brandParam).toLowerCase()
      })
    }
    const targetBrandId = String(brandParam || '').trim()
    const targetBrandName = (targetBrandObj?.brand_name || targetBrandObj?.name || selectedBrandName || (isNaN(Number(brandParam)) ? brandParam : '')).trim().toLowerCase()

    return products.filter((p) => {
      // 0. Brand Filter check (if brand param is present)
      if (targetBrandId) {
        const pBrandId = String(p.brand_id || p.brandId || p.brandid || p.vendor_id || p.vendorId || p.seller_id || p.sellerId || p.raw?.brand_id || p.raw?.brandId || p.raw?.vendor_id || '').trim()
        const pBrandName = String(p.brand || p.brand_name || p.brandName || p.seller || p.raw?.brand || p.raw?.brand_name || p.raw?.seller || '').trim().toLowerCase()

        const matchesId = pBrandId && (pBrandId === targetBrandId)
        const matchesName = targetBrandName && pBrandName && (pBrandName === targetBrandName || pBrandName.includes(targetBrandName) || targetBrandName.includes(pBrandName))
        const matchesIdInBrandField = pBrandName && (pBrandName === targetBrandId)

        if (!matchesId && !matchesName && !matchesIdInBrandField) {
          return false;
        }
      }

      // 0.5. Subcategory Filter check (Only when a subcategory is explicitly selected)
      const targetSubId = filters.selectedSubcategoryId
      if (targetSubId && !String(targetSubId).includes(',')) {
        const pSubId = String(p.subcategory || p.sub_category_id || p.subcategory_id || p.subcategoryId || p.raw?.subcategory || p.raw?.sub_category_id || '').trim()
        const pSubName = String(p.subcategory_name || p.subCategoryName || p.raw?.subcategory_name || '').trim().toLowerCase()
        const targetSubName = String(targetSubId).trim().toLowerCase()

        const matchesSubId = pSubId && (pSubId === String(targetSubId))
        const matchesSubName = targetSubName && (
          (pSubName && (pSubName === targetSubName || pSubName.includes(targetSubName))) ||
          (p.product_name && p.product_name.toLowerCase().includes(targetSubName)) ||
          (p.name && p.name.toLowerCase().includes(targetSubName))
        )

        if (pSubId && !matchesSubId && !matchesSubName) {
          return false;
        }
      }

      // 1. Price bounds slider filter
      const priceVal = parseFloat(p.offer_price || p.price || 0);
      if (priceVal > filters.maxPrice) return false;

      // 2. Price brackets selection filter
      if (filters.priceRanges.length) {
        const inRange = filters.priceRanges.some((id) => {
          const b = priceBrackets.find((x) => x.id === id);
          return b && priceVal >= b.min && priceVal < b.max;
        });
        if (!inRange) return false;
      }

      // 3. Availability and shipping filters
      if (filters.inStock) {
        const inStockVal = p.inStock !== undefined ? p.inStock : (p.in_stock !== undefined ? p.in_stock : true);
        if (!inStockVal) return false;
      }
      if (filters.freeShipping) {
        const freeShippingVal = p.freeShipping || p.free_shipping || false;
        if (!freeShippingVal) return false;
      }
      if (filters.express) {
        const expressVal = p.express || p.express_delivery || false;
        if (!expressVal) return false;
      }

      return true;
    });
  }, [products, filters, searchParams, brands, selectedBrandName]);

  const clearFilters = () => {
    setFilters(emptyFilters)
    setSortValue('')
    setShowFilters(false)
  }

  const applySort = (value) => {
    setSortValue(value)
    setShowSort(false)
  }

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > pagination.last_page) return
    
    // Update URL with new page parameter
    const currentParams = new URLSearchParams(searchParams.toString())
    currentParams.set('page', String(newPage))
    
    // Reset to page 1 if it's the same page (for consistency)
    if (newPage === 1) {
      currentParams.delete('page')
    }
    
    router.push(`/products?${currentParams.toString()}`, { scroll: false })

    // Desktop-only: smooth scroll to top of the product listing area
    if (!isMobile && typeof window !== 'undefined') {
      // Scroll to top of page smoothly; works reliably across all desktop browsers
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
    }
  }

  const getSelectedCategoryName = () => {
    const categoryParam = searchParams.get('category')
    const subcategoryParam = searchParams.get('subcategory')
    const childcategoryParam = searchParams.get('childcategoryid') || searchParams.get('childcategory')

    if (categoryParam && categories.length > 0) {
      const category = categories.find(c => String(c.id) === String(categoryParam))
      if (category) {
        let name = category.name
        const subs = category.subcategory || category.subcategories || category.sub_categories || []

        if (subcategoryParam && subs.length > 0) {
          const sub = subs.find(s => String(s.id) === String(subcategoryParam))
          if (sub) {
            name = sub.name
            const children = sub.childsubcategory || sub.child_subcategory || sub.child || sub.children || []

            if (childcategoryParam && children.length > 0) {
              const child = children.find(ch => String(ch.id) === String(childcategoryParam))
              if (child) {
                name = child.name
              }
            }
          }
        }
        return name
      }
    }

    return selectedCategoryName || 'Products'
  }

  const getSelectedBrandName = () => {
    const brandParam = searchParams.get('brand')
    if (!brandParam) return null

    // 1. Check in loaded brands list
    if (brands.length > 0) {
      const brand = brands.find(b => {
        const brandId = String(b.id || b.brand_id || b.brandid || b.brandId || b.seller_id || b.vendor_id || '')
        const bName = String(b.brand_name || b.name || b.brandName || b.seller || '')
        return brandId === String(brandParam) || bName.toLowerCase() === String(brandParam).toLowerCase()
      })
      if (brand) {
        return brand.brand_name || brand.name || brand.brandName || brand.seller || ''
      }
    }

    // 2. Check in products list
    if (products.length > 0) {
      const pMatch = products.find(p => {
        const pBrandId = String(p.brand_id || p.brandId || p.brandid || p.vendor_id || p.vendorId || p.seller_id || p.sellerId || '')
        return pBrandId === String(brandParam)
      })
      if (pMatch) {
        const nameInProduct = pMatch.brand || pMatch.brand_name || pMatch.brandName || pMatch.seller || pMatch.vendor_name || pMatch.store_name || pMatch.category_details?.name
        if (nameInProduct) return nameInProduct
      }
    }

    // 3. Check in categories / subcategories list
    if (categories.length > 0) {
      for (const cat of categories) {
        if (String(cat.id) === String(brandParam)) return cat.name
        const subs = cat.subcategory || cat.subcategories || cat.sub_categories || []
        for (const sub of subs) {
          if (String(sub.id) === String(brandParam)) return sub.name
          const children = sub.childsubcategory || sub.child_subcategory || sub.child || sub.children || []
          for (const child of children) {
            if (String(child.id) === String(brandParam)) return child.name
          }
        }
      }
    }

    // 4. If selectedBrandName state has a non-numeric string, use it
    if (selectedBrandName && isNaN(Number(selectedBrandName))) {
      return selectedBrandName
    }

    // 5. If brandParam itself is non-numeric, it is the brand name (e.g. "Puma")
    if (isNaN(Number(brandParam))) {
      return brandParam
    }

    // 6. Fallback to clean title instead of showing raw ID number
    return 'Brand Products'
  }

  if (!isMounted) {
    return null
  }

  if (!isMobile) {
    return (
      <div className="min-h-screen bg-bg">
        <Header />
        <main className="mx-auto max-w-shell px-4 py-6 md:px-6">
          {/* Breadcrumb */}
          <nav className="flex items-center gap-1.5 text-[12.5px] text-fg-muted mb-6">
            <Link href="/" className="hover:text-orange-deep">Home</Link>
            <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
            {searchParams.get('brand') ? (
              <>
                <span className="font-medium text-navy">{getSelectedBrandName()}</span>
              </>
            ) : searchParams.get('category') ? (
              <>
                <Link href="/categories" className="hover:text-orange-deep">Categories</Link>
                <ChevronRight className="h-3.5 w-3.5" strokeWidth={2} />
                <span className="font-medium text-navy">{getSelectedCategoryName()}</span>
              </>
            ) : (
              <span className="font-medium text-navy">All Products</span>
            )}
          </nav>

          {/* Title Section */}
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-line pb-5 mb-6">
            <div>
              <h1 className="font-display text-3xl font-bold tracking-tight text-navy">
                {getSelectedBrandName()
                  ? `${getSelectedBrandName()} Products`
                  : (getSelectedCategoryName() || 'All Products')}
              </h1>
              <p className="mt-1 text-[13.5px] text-fg-muted">
                <span className="font-semibold text-navy">{pagination.total || filteredProducts.length}</span> products found
                {pagination.last_page > 1 && (
                  <span className="ml-2 text-fg-subtle">
                    (Page {pagination.current_page} of {pagination.last_page})
                  </span>
                )}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="relative">
                <select
                  value={sortValue}
                  onChange={(e) => setSortValue(e.target.value)}
                  className="h-10 cursor-pointer appearance-none rounded-lg border border-line-strong bg-surface pl-4 pr-10 text-[13px] font-semibold text-navy focus:border-orange focus:outline-none"
                >
                  {sortOptions.map((o) => (
                    <option key={o.value} value={o.value}>
                      {o.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-muted" strokeWidth={2.25} />
              </div>

              <div className="flex items-center rounded-lg border border-line-strong p-0.5">
                <button
                  onClick={() => setView('grid')}
                  className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${view === 'grid' ? 'bg-navy text-white' : 'text-fg-muted hover:text-navy'}`}
                >
                  <LayoutGrid className="h-4 w-4" strokeWidth={2} />
                </button>
                <button
                  onClick={() => setView('list')}
                  className={`grid h-8 w-8 place-items-center rounded-md transition-colors ${view === 'list' ? 'bg-navy text-white' : 'text-fg-muted hover:text-navy'}`}
                >
                  <ListIcon className="h-4 w-4" strokeWidth={2} />
                </button>
              </div>
            </div>
          </div>

          <div className="mt-6 grid gap-8 lg:grid-cols-[264px_1fr]">
            {/* Sidebar - Desktop */}
            <aside className="hidden lg:block">
              <div className="sticky top-[136px]">
                <div className="max-h-[calc(100vh-160px)] overflow-y-auto pr-2">
                  <FilterSidebar
                    filters={filters}
                    setFilters={setFilters}
                    resultCount={pagination.total || filteredProducts.length}
                  />
                  {Object.values(filters).some(v =>
                    Array.isArray(v) ? v.length > 0 :
                      typeof v === 'number' ? v > 0 && v < 9999 :
                        typeof v === 'boolean' ? v : false
                  ) && (
                      <button
                        onClick={clearFilters}
                        className="mt-4 w-full rounded-lg border border-line py-2.5 text-[13px] font-semibold text-fg-muted transition-colors hover:border-sale hover:text-sale"
                      >
                        Clear all filters
                      </button>
                    )}
                </div>
              </div>
            </aside>

            {/* Content */}
            <section className="min-w-0">
              {/* Loading State */}
              {loading ? (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="h-12 w-12 animate-spin rounded-full border-4 border-orange border-t-transparent mx-auto" />
                  <p className="mt-4 text-sm text-fg-muted">Loading products...</p>
                </div>
              ) : filteredProducts.length > 0 ? (
                view === 'grid' ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {filteredProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col gap-3">
                    {filteredProducts.map((product) => (
                      <ProductListCard key={product.id} product={product} />
                    ))}
                  </div>
                )
              ) : (
                <div className="mt-16 flex flex-col items-center justify-center rounded-xl border border-dashed border-line-strong py-20 text-center">
                  <div className="grid h-14 w-14 place-items-center rounded-full bg-surface-2">
                    <SlidersHorizontal className="h-6 w-6 text-fg-subtle" strokeWidth={1.75} />
                  </div>
                  <h3 className="mt-4 font-display text-xl font-bold text-navy">No products found</h3>
                  <p className="mt-1 max-w-sm text-[13.5px] text-fg-muted">
                    Try adjusting your filters or check back later!
                  </p>
                  <button
                    onClick={clearFilters}
                    className="mt-5 rounded-lg bg-navy px-5 py-2.5 text-[13px] font-semibold text-white transition-colors hover:bg-orange-deep"
                  >
                    Clear all filters
                  </button>
                </div>
              )}

              {/* Pagination - Desktop */}
              {filteredProducts.length > 0 && pagination.last_page > 1 && (
                <div className="mt-10 flex items-center justify-center gap-3">
                  <button
                    onClick={() => handlePageChange(pagination.current_page - 1)}
                    disabled={pagination.current_page === 1}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-line-strong bg-white text-navy font-semibold text-sm transition-all hover:border-orange hover:bg-orange hover:text-white disabled:border-line disabled:bg-surface disabled:text-fg-muted disabled:cursor-not-allowed disabled:hover:border-line disabled:hover:bg-surface disabled:hover:text-fg-muted"
                  >
                    <ChevronLeft className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                  
                  <div className="flex items-center gap-2">
                    {Array.from({ length: Math.min(5, pagination.last_page) }, (_, i) => {
                      let pageNum
                      if (pagination.last_page <= 5) {
                        pageNum = i + 1
                      } else if (pagination.current_page <= 3) {
                        pageNum = i + 1
                      } else if (pagination.current_page >= pagination.last_page - 2) {
                        pageNum = pagination.last_page - 4 + i
                      } else {
                        pageNum = pagination.current_page - 2 + i
                      }
                      
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`h-11 w-11 rounded-xl font-semibold text-sm transition-all ${
                            pagination.current_page === pageNum
                              ? 'bg-orange text-white shadow-lg shadow-orange/30'
                              : 'bg-white text-navy border-2 border-line-strong hover:border-orange hover:bg-orange/5'
                          }`}
                        >
                          {pageNum}
                        </button>
                      )
                    })}
                  </div>
                  
                  <button
                    onClick={() => handlePageChange(pagination.current_page + 1)}
                    disabled={pagination.current_page === pagination.last_page}
                    className="flex h-11 w-11 items-center justify-center rounded-xl border-2 border-line-strong bg-white text-navy font-semibold text-sm transition-all hover:border-orange hover:bg-orange hover:text-white disabled:border-line disabled:bg-surface disabled:text-fg-muted disabled:cursor-not-allowed disabled:hover:border-line disabled:hover:bg-surface disabled:hover:text-fg-muted"
                  >
                    <ChevronRight className="h-5 w-5" strokeWidth={2.5} />
                  </button>
                </div>
              )}
            </section>
          </div>
        </main>
        <Footer />
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-bg">
      {/* Dark Navy Header Banner */}
      <header className="sticky top-0 z-30 bg-[#1E293B] px-4 py-3.5 shadow-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="grid h-9 w-9 shrink-0 place-items-center rounded-lg text-white active:bg-white/10"
            aria-label="Go back"
          >
            <ChevronLeft className="h-6 w-6" strokeWidth={2.5} />
          </button>
          <div className="flex-1 text-left">
            <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight">
              {getSelectedBrandName() || getSelectedCategoryName() || 'Products'}
            </h1>
            <p className="text-xs text-slate-300 font-medium mt-0.5">
              {pagination.total || filteredProducts.length} results from verified sellers
            </p>
          </div>
        </div>
      </header>

      {/* Sort & Filter Bar */}
      <div className="bg-white border-b border-line sticky top-[60px] z-20 shadow-2xs">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setShowSort(true)}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-[#0F172A]"
          >
            <ChevronDown className="h-4 w-4 text-gray-600" strokeWidth={2.25} />
            <span>
              {sortOptions.find(o => o.value === sortValue)?.label || 'Recommended'}
            </span>
          </button>
          <div className="h-4 w-px bg-line shrink-0 mx-2" />
          <button
            onClick={() => setShowFilters(true)}
            className="flex-1 flex items-center justify-center gap-1.5 text-sm font-bold text-[#0F172A]"
          >
            <SlidersHorizontal className="h-4 w-4 text-gray-600" strokeWidth={2} />
            <span>Filters</span>
          </button>
        </div>
      </div>

      {/* Products Grid */}
      <main className="flex-1 pb-20">
        {loading ? (
          <div className="flex items-center justify-center py-20">
            <div className="text-center">
              <div className="mb-3 h-10 w-10 animate-spin rounded-full border-4 border-orange border-t-transparent mx-auto" />
              <p className="text-sm text-fg-muted">Loading products...</p>
            </div>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-2 gap-3 p-4">
            {filteredProducts.map((product) => (
              <MProductCard key={product.id} product={product} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center py-20">
            <Package className="h-16 w-16 text-fg-subtle mb-3" strokeWidth={1.25} />
            <p className="text-sm font-medium text-fg mb-1">No products found</p>
            <p className="text-xs text-fg-muted">Try adjusting your filters</p>
          </div>
        )}

        {/* Infinite scroll sentinel + loading indicator for mobile */}
        {filteredProducts.length > 0 && (
          <div ref={sentinelRef} className="py-6 flex flex-col items-center justify-center">
            {loadingMore && (
              <div className="flex flex-col items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-3 border-orange border-t-transparent mx-auto" />
                <p className="mt-2 text-xs text-fg-muted">Loading more products...</p>
              </div>
            )}
            {!loadingMore && pagination.current_page >= pagination.last_page && pagination.total > 0 && (
              <p className="text-xs text-fg-subtle font-medium">
                You've reached the end
              </p>
            )}
          </div>
        )}
      </main>

      <BottomNav />

      {/* Sort Bottom Sheet */}
      {showSort && (
        <div className="fixed inset-0 z-50 flex items-end bg-navy/50" onClick={() => setShowSort(false)}>
          <div className="w-full rounded-t-2xl bg-surface pb-safe" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="text-lg font-bold text-fg">Sort by</h3>
              <button onClick={() => setShowSort(false)} className="grid h-8 w-8 place-items-center rounded-full bg-surface-2">
                <X className="h-4 w-4 text-fg" strokeWidth={2} />
              </button>
            </div>
            <div className="max-h-96 overflow-y-auto pb-4">
              {sortOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => applySort(option.value)}
                  className={`w-full flex items-center justify-between px-5 py-3.5 active:bg-surface-2 ${sortValue === option.value ? 'bg-orange-tint' : ''}`}
                >
                  <span className={`text-base ${sortValue === option.value ? 'font-bold text-orange-deep' : 'text-fg'}`}>
                    {option.label}
                  </span>
                  {sortValue === option.value && (
                    <div className="h-6 w-6 rounded-full bg-orange grid place-items-center">
                      <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Filters Bottom Sheet */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex items-end bg-navy/50" onClick={() => setShowFilters(false)}>
          <div className="w-full rounded-t-2xl bg-surface pb-safe" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between border-b border-line px-5 py-4">
              <h3 className="text-xl font-bold text-fg">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="grid h-8 w-8 place-items-center rounded-full bg-surface-2">
                <X className="h-4 w-4 text-fg" strokeWidth={2} />
              </button>
            </div>
            <div className="max-h-[60vh] overflow-y-auto px-5 py-2">
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                resultCount={pagination.total || filteredProducts.length}
              />
            </div>

            {/* Filter Actions */}
            <div className="flex gap-2 px-5 py-4 border-t border-line">
              <button
                onClick={clearFilters}
                className="flex-1 rounded-xl border border-orange px-4 py-2 text-[11.5px] font-bold text-orange whitespace-nowrap"
              >
                Clear all
              </button>
              <button
                onClick={() => setShowFilters(false)}
                className="flex-1 rounded-xl bg-navy px-4 py-2 text-[11.5px] font-bold text-white whitespace-nowrap"
              >
                Show {pagination.total || filteredProducts.length}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-orange"></div>
      </div>
    }>
      <ProductsContent />
    </Suspense>
  )
}

// Helper component for desktop list view
function ProductListCard({ product }) {
  const { price: formatPrice } = useCountry()
  const router = useRouter()
  const { addToCart, isInCart } = useCart()
  const { toggleWishlist, isInWishlist } = useWishlist()

  const name = product.product_name || product.name || ''
  const mrpVal = parseFloat(product.orginal_rate || product.mrp || 0)
  const priceVal = parseFloat(product.offer_price || product.price || 0)
  const ratingVal = parseFloat(product.rating || product.average_rating || 0)
  const reviewsCount = product.reviews || product.review_count || 0
  const sellerName = product.brand || product.seller || 'Jeni Deals'
  const imgUrl = product.product_img_url || product.product_img
  const isLiked = isInWishlist(product.id)

  const off = mrpVal > priceVal ? Math.round(((mrpVal - priceVal) / mrpVal) * 100) : 0

  return (
    <div
      onClick={() => router.push(`/product/${product.id}`)}
      className="group flex gap-4 rounded-lg border border-line bg-surface p-3 transition-all hover:border-line-strong cursor-pointer"
      style={{ boxShadow: 'var(--shadow-xs)' }}
    >
      <div className="relative grid h-32 w-32 shrink-0 place-items-center overflow-hidden rounded-md bg-[#FAF5FF]" style={{ background: product.tint }}>
        {imgUrl ? (
          <img src={imgUrl} alt={name} className="h-full w-full object-contain transition-transform group-hover:scale-105" />
        ) : (
          <Package className="h-10 w-10 text-fg-subtle" strokeWidth={1.25} />
        )}
        {off > 0 && <span className="absolute left-2 top-2 rounded-md bg-sale px-1.5 py-0.5 text-[10px] font-bold text-white">-{off}%</span>}
      </div>
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex items-center gap-2 text-[12px] text-fg-muted">
          <BadgeCheck className="h-3.5 w-3.5 text-success" strokeWidth={2} /> {sellerName}
        </div>
        <h3 className="mt-1 line-clamp-2 text-[15px] font-semibold leading-snug text-fg">{name}</h3>
        {ratingVal > 0 && (
          <div className="mt-1.5 flex items-center gap-2">
            <span className="inline-flex items-center gap-1 rounded bg-success-tint px-1.5 py-0.5 text-[12px] font-semibold text-success">
              <Star className="h-3 w-3 fill-success" strokeWidth={0} /> {ratingVal.toFixed(1)}
            </span>
            <span className="text-[12px] text-fg-muted">({reviewsCount.toLocaleString()})</span>
          </div>
        )}
        <div className="mt-1.5 flex flex-wrap gap-2 text-[11.5px]">
          {product.freeShipping && <span className="inline-flex items-center gap-1 text-success"><Truck className="h-3.5 w-3.5" strokeWidth={2} /> Free shipping</span>}
          {product.express && <span className="inline-flex items-center gap-1 text-orange-deep"><Zap className="h-3.5 w-3.5" strokeWidth={2} /> Express</span>}
          {!product.inStock && <span className="text-sale">Out of stock</span>}
        </div>
        <div className="mt-auto flex items-end justify-between pt-2">
          <div className="flex items-baseline gap-2">
            <span className="font-display text-xl font-bold text-fg">{formatPrice(priceVal)}</span>
            {mrpVal > priceVal && (
              <span className="text-[13px] text-fg-muted line-through">{formatPrice(mrpVal)}</span>
            )}
          </div>
          <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
            <button
              onClick={() => toggleWishlist(product)}
              className="grid h-9 w-9 place-items-center rounded-lg border border-line text-fg-muted transition-colors hover:border-sale hover:text-sale"
            >
              <Heart className={`h-4 w-4 ${isLiked ? 'fill-sale text-sale' : ''}`} strokeWidth={isLiked ? 2 : 1.75} />
            </button>
            <button
              onClick={() => {
                if (isInCart(product.id)) {
                  router.push('/cart')
                } else {
                  addToCart(product, 1)
                }
              }}
              className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-[13px] font-semibold text-white transition-colors whitespace-nowrap ${isInCart(product.id)
                  ? 'bg-emerald-600 hover:bg-emerald-700'
                  : 'bg-navy hover:bg-orange-deep'
                }`}
            >
              {isInCart(product.id) ? (
                <>
                  <Check className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                  <span className="whitespace-nowrap">Added to Cart</span>
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4 shrink-0" strokeWidth={2.25} />
                  <span className="whitespace-nowrap">Add to Cart</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
