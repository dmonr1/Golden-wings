import { useMemo, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Search, ArrowUpDown, Sparkles, Filter, X, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
import { Link, useSearchParams } from 'react-router-dom'
import gsap from 'gsap'
import PageIntro from '../components/PageIntro.jsx'
import PartCard from '../components/PartCard.jsx'
import { partsInventory } from '../data/partsInventory.js'

const ITEMS_PER_PAGE = 12

const categoryFilters = [
  'All Parts',
  'Avionics',
  'Rotables',
  'Airframe & Hardware',
  'Electrical',
]

function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '')
  const [selectedCategory, setSelectedCategory] = useState(() => {
    const param = searchParams.get('category')
    if (param && categoryFilters.includes(param)) return param
    return 'All Parts'
  })
  const [sortBy, setSortBy] = useState('default')
  const [currentPage, setCurrentPage] = useState(1)

  const sectionRef = useRef(null)
  const toolbarRef = useRef(null)
  const subbarRef = useRef(null)
  const statusBarRef = useRef(null)
  const gridRef = useRef(null)

  // Sync state with URL params when navigating back/forward or from Hero search
  useEffect(() => {
    const s = searchParams.get('search')
    const cat = searchParams.get('category')

    if (s !== null) {
      setSearchQuery(s)
      if (!cat) {
        setSelectedCategory('All Parts')
      }
    }
    if (cat && categoryFilters.includes(cat)) {
      setSelectedCategory(cat)
    }
  }, [searchParams])

  // Scroll to search toolbar when arriving with a search query
  useEffect(() => {
    const s = searchParams.get('search')
    if (s && toolbarRef.current) {
      const timer = setTimeout(() => {
        const top = toolbarRef.current.getBoundingClientRect().top + window.scrollY - 110
        window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
      }, 140)
      return () => clearTimeout(timer)
    }
  }, [searchParams])

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchQuery, selectedCategory, sortBy])

  // Initial entrance animation for toolbar, filters, and status bar
  useLayoutEffect(() => {
    let removeListener = null

    const ctx = gsap.context(() => {
      // Synchronously set initial hidden state before browser repaints
      if (toolbarRef.current) gsap.set(toolbarRef.current, { opacity: 0, y: -22 })
      if (subbarRef.current) gsap.set(subbarRef.current, { opacity: 0, y: -14 })
      if (statusBarRef.current) gsap.set(statusBarRef.current, { opacity: 0 })

      const playEntrance = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })
        if (toolbarRef.current) {
          tl.to(toolbarRef.current, { opacity: 1, y: 0, duration: 0.75, clearProps: 'all' }, 0.1)
        }
        if (subbarRef.current) {
          tl.to(subbarRef.current, { opacity: 1, y: 0, duration: 0.68, clearProps: 'all' }, 0.22)
        }
        if (statusBarRef.current) {
          tl.to(statusBarRef.current, { opacity: 1, duration: 0.5, clearProps: 'all' }, 0.32)
        }
      }

      const isLoaderActive =
        document.querySelector('.page-loader') || document.body.style.position === 'fixed'

      if (isLoaderActive) {
        const onLoaderEnd = () => requestAnimationFrame(() => playEntrance())
        window.addEventListener('golden-wings:loader-end', onLoaderEnd, { once: true })
        removeListener = () => window.removeEventListener('golden-wings:loader-end', onLoaderEnd)
      } else {
        // Direct route navigation: play immediately without delay
        playEntrance()
      }
    }, sectionRef)

    return () => {
      removeListener?.()
      ctx.revert()
    }
  }, [])

  // Staggered card entrance on mount, page navigation, search, or category switch
  useLayoutEffect(() => {
    let removeListener = null

    const playCards = () => {
      if (!gridRef.current) return
      const cards = gridRef.current.querySelectorAll('.part-card')
      if (cards.length === 0) return

      gsap.fromTo(
        cards,
        { opacity: 0, scale: 0.94, y: 22 },
        {
          opacity: 1,
          scale: 1,
          y: 0,
          duration: 0.6,
          stagger: 0.04,
          ease: 'power2.out',
          clearProps: 'transform,opacity',
        },
      )
    }

    const isLoaderActive =
      document.querySelector('.page-loader') || document.body.style.position === 'fixed'

    if (isLoaderActive) {
      const onLoaderEnd = () => requestAnimationFrame(() => playCards())
      window.addEventListener('golden-wings:loader-end', onLoaderEnd, { once: true })
      removeListener = () => window.removeEventListener('golden-wings:loader-end', onLoaderEnd)
    } else {
      playCards()
    }

    return () => {
      removeListener?.()
    }
  }, [currentPage, selectedCategory, searchQuery, sortBy])

  // Filter items
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const cleanQuery = query.replace(/[-\s]/g, '')

    return partsInventory.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategory === 'All Parts' ||
        item.category.toLowerCase() === selectedCategory.toLowerCase()

      const cleanPn = (item.partNumber || '').toLowerCase().replace(/[-\s]/g, '')

      // Text query match
      const matchesQuery =
        !query ||
        item.partNumber.toLowerCase().includes(query) ||
        cleanPn.includes(cleanQuery) ||
        item.description.toLowerCase().includes(query) ||
        item.fleet.toLowerCase().includes(query) ||
        (item.category || '').toLowerCase().includes(query) ||
        item.company.toLowerCase().includes(query) ||
        item.condition.toLowerCase().includes(query)

      return matchesCategory && matchesQuery
    })
  }, [searchQuery, selectedCategory])

  // Sort items
  const sortedItems = useMemo(() => {
    const list = [...filteredItems]
    if (sortBy === 'pn-asc') {
      return list.sort((a, b) => a.partNumber.localeCompare(b.partNumber))
    }
    if (sortBy === 'pn-desc') {
      return list.sort((a, b) => b.partNumber.localeCompare(a.partNumber))
    }
    if (sortBy === 'price-desc') {
      const getNum = (p) => {
        const cleaned = p.replace(/[^0-9.]/g, '')
        return cleaned ? parseFloat(cleaned) : -1
      }
      return list.sort((a, b) => getNum(b.price) - getNum(a.price))
    }
    return list
  }, [filteredItems, sortBy])

  // Pagination calculation
  const totalPages = Math.ceil(sortedItems.length / ITEMS_PER_PAGE) || 1

  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE
    return sortedItems.slice(start, start + ITEMS_PER_PAGE)
  }, [sortedItems, currentPage])

  const scrollToProducts = () => {
    const targetElement = statusBarRef.current || gridRef.current || sectionRef.current
    if (!targetElement) return

    const isMobile = window.innerWidth <= 768
    // Clear fixed header (pill navigation) with comfortable breathing room
    const headerOffset = isMobile ? 74 : 92

    if (window.lenis && typeof window.lenis.scrollTo === 'function') {
      window.lenis.scrollTo(targetElement, {
        offset: -headerOffset,
        duration: 0.95,
        easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
      })
    } else {
      const elementPosition = targetElement.getBoundingClientRect().top
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset
      window.scrollTo({
        top: Math.max(0, offsetPosition),
        behavior: 'smooth',
      })
    }
  }

  const handlePageChange = (newPage) => {
    setCurrentPage(newPage)
    requestAnimationFrame(() => {
      scrollToProducts()
    })
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('All Parts')
    setSortBy('default')
    setCurrentPage(1)
    setSearchParams({})
  }

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategory !== 'All Parts' ||
    sortBy !== 'default'

  return (
    <main className="catalog-page">
      <PageIntro
        title="Aircraft Parts Catalog"
        text="For pricing, availability, and detailed information, please contact our team directly."
        theme="paper"
        graphic="helicopter"
      >
        <Link
          to="/contact"
          className="page-intro__btn"
        >
          <span>Contact Us</span>
          <ArrowRight size={15} aria-hidden="true" />
        </Link>
      </PageIntro>

      <section className="catalog-section" ref={sectionRef} aria-label="Aircraft Parts Catalog">
        <div className="catalog-container">
          {/* Primary Toolbar: Search Bar with dark Search Button */}
          <div className="catalog-toolbar" ref={toolbarRef}>
            <form
              className="catalog-search-wrap"
              onSubmit={(e) => {
                e.preventDefault()
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev)
                  if (searchQuery.trim()) {
                    next.set('search', searchQuery.trim())
                  } else {
                    next.delete('search')
                  }
                  return next
                })
              }}
            >
              <Search size={20} className="catalog-search-icon" aria-hidden="true" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Part Number, description, aircraft platform..."
                className="catalog-search-input"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('')
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev)
                      next.delete('search')
                      return next
                    })
                  }}
                  className="catalog-search-clear"
                  aria-label="Clear search query"
                >
                  <X size={16} />
                </button>
              )}
              <button
                type="submit"
                className="catalog-search-submit-btn"
                aria-label="Search"
              >
                <Search size={15} aria-hidden="true" />
                <span>Search</span>
              </button>
            </form>
          </div>

          {/* Secondary Filter Row: Categories & Sorting */}
          <div className="catalog-subbar" ref={subbarRef}>
            <div className="catalog-category-chips">
              <span className="catalog-chips-label">
                <Filter size={14} aria-hidden="true" /> Category:
              </span>
              {categoryFilters.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  className={`catalog-chip ${selectedCategory === cat ? 'is-active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="catalog-sort-wrap">
              <span className="catalog-sort-label">
                <ArrowUpDown size={14} aria-hidden="true" /> Sort:
              </span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="catalog-sort-select"
                aria-label="Sort parts results"
              >
                <option value="default">Relevance</option>
                <option value="pn-asc">Part Number (A - Z)</option>
                <option value="pn-desc">Part Number (Z - A)</option>
                <option value="price-desc">Price (High to Low)</option>
              </select>
            </div>
          </div>

          {/* Status & Active Filters Bar */}
          <div className="catalog-status-bar" ref={statusBarRef}>
            <p className="catalog-status-count">
              Showing <strong>{sortedItems.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedItems.length)}</strong> of {sortedItems.length} parts in stock {totalPages > 1 && `(Page ${currentPage} of ${totalPages})`}
            </p>

            {hasActiveFilters && (
              <button type="button" onClick={clearFilters} className="catalog-reset-btn">
                <X size={14} /> Clear all filters
              </button>
            )}
          </div>

          {/* Product Cards Grid: 12 per page */}
          {paginatedItems.length > 0 ? (
            <>
              <div className="catalog-grid" id="catalog-grid" ref={gridRef}>
                {paginatedItems.map((item) => (
                  <PartCard key={item.id} item={item} />
                ))}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <nav className="catalog-pagination" aria-label="Catalog navigation">
                  <button
                    type="button"
                    className="catalog-pagination__btn catalog-pagination__btn--prev"
                    onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                    disabled={currentPage === 1}
                    aria-label="Previous page"
                  >
                    <ChevronLeft size={16} aria-hidden="true" />
                    <span>Previous</span>
                  </button>

                  <div className="catalog-pagination__pages">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                      <button
                        key={page}
                        type="button"
                        className={`catalog-pagination__page-num ${currentPage === page ? 'is-active' : ''}`}
                        onClick={() => handlePageChange(page)}
                        aria-current={currentPage === page ? 'page' : undefined}
                      >
                        {page}
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    className="catalog-pagination__btn catalog-pagination__btn--next"
                    onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                    disabled={currentPage === totalPages}
                    aria-label="Next page"
                  >
                    <span>Next</span>
                    <ChevronRight size={16} aria-hidden="true" />
                  </button>
                </nav>
              )}
            </>
          ) : (
            <div className="catalog-empty-state">
              <div className="catalog-empty-state__icon">
                <Sparkles size={32} />
              </div>
              <h3>No components found matching your search criteria</h3>
              <p>
                If you cannot find the Part Number you need in this list, send us your request and our
                sourcing team will locate it for you immediately.
              </p>
              <div className="catalog-empty-state__actions">
                <button type="button" onClick={clearFilters} className="catalog-empty-btn--secondary">
                  Reset filters
                </button>
                <a
                  href={`mailto:sales@goldenwingsinternational.net?subject=AOG%20Part%20Sourcing%20Request&body=Dear%20Team,%0A%0AI%20require%20an%20urgent%20RFQ%20for%20the%20following%20Part%20Number:%20${encodeURIComponent(
                    searchQuery,
                  )}`}
                  className="catalog-empty-btn--primary"
                >
                  Request Direct Sourcing (RFQ)
                </a>
              </div>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Catalog
