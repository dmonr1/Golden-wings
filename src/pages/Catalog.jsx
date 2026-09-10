import { useMemo, useState, useEffect, useLayoutEffect, useRef } from 'react'
import { Search, ArrowUpDown, LayoutGrid, Sparkles, List, Table2, Filter, Trash2, X, ChevronDown, ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'
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

const sortOptions = [
  { value: 'default', label: 'Relevance' },
  { value: 'pn-asc', label: 'Part Number (A - Z)' },
  { value: 'pn-desc', label: 'Part Number (Z - A)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
]

function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams()

  const [searchQuery, setSearchQuery] = useState(() => searchParams.get('search') || '')
  const [selectedCategories, setSelectedCategories] = useState(() => {
    const param = searchParams.get('category')
    if (!param) return []
    return param.split(',').filter((category) => categoryFilters.includes(category) && category !== 'All Parts')
  })
  const [sortBy, setSortBy] = useState('default')
  const [viewMode, setViewMode] = useState('cards')
  const [selectedPartDetail, setSelectedPartDetail] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [isSortMenuOpen, setIsSortMenuOpen] = useState(false)

  const sectionRef = useRef(null)
  const toolbarRef = useRef(null)
  const subbarRef = useRef(null)
  const statusBarRef = useRef(null)
  const gridRef = useRef(null)
  const sortPickerRef = useRef(null)

  useEffect(() => {
    if (!isSortMenuOpen) return undefined

    const closeOnOutsideClick = (event) => {
      const isInsideSort = sortPickerRef.current?.contains(event.target)

      if (!isInsideSort) {
        setIsSortMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeOnOutsideClick)
    return () => document.removeEventListener('pointerdown', closeOnOutsideClick)
  }, [isSortMenuOpen])

  useEffect(() => {
    if (!selectedPartDetail) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.lenis?.stop?.()

    const closeOnEscape = (event) => {
      if (event.key === 'Escape') setSelectedPartDetail(null)
    }

    window.addEventListener('keydown', closeOnEscape)
    return () => {
      document.body.style.overflow = previousOverflow
      window.lenis?.start?.()
      window.removeEventListener('keydown', closeOnEscape)
    }
  }, [selectedPartDetail])

  const selectedSortLabel = sortOptions.find((option) => option.value === sortBy)?.label || sortOptions[0].label

  // Sync state with URL params when navigating back/forward or from Hero search
  useEffect(() => {
    const s = searchParams.get('search')
    const cat = searchParams.get('category')

    if (s !== null) setSearchQuery(s)
    setSelectedCategories(
      cat ? cat.split(',').filter((category) => categoryFilters.includes(category) && category !== 'All Parts') : [],
    )
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
  }, [searchQuery, selectedCategories, sortBy])

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
      const cards = gridRef.current.querySelectorAll('.part-card, .catalog-list-item')
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
  }, [currentPage, selectedCategories, searchQuery, sortBy])

  // Filter items
  const filteredItems = useMemo(() => {
    const query = searchQuery.trim().toLowerCase()
    const cleanQuery = query.replace(/[-\s]/g, '')

    return partsInventory.filter((item) => {
      // Category match
      const matchesCategory =
        selectedCategories.length === 0 ||
        selectedCategories.some((category) => item.category.toLowerCase() === category.toLowerCase())

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
  }, [searchQuery, selectedCategories])

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
    setSelectedCategories([])
    setSortBy('default')
    setCurrentPage(1)
    setSearchParams({})
  }

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedCategories.length > 0 ||
    sortBy !== 'default'

  const toggleCategory = (category) => {
    if (category === 'All Parts') {
      setSelectedCategories([])
      return
    }

    setSelectedCategories((current) => (
      current.includes(category)
        ? current.filter((selected) => selected !== category)
        : [...current, category]
    ))
  }

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

            <div className="catalog-toolbar__secondary" ref={subbarRef}>
              {/* Secondary Filter Row: Category selector & sorting */}
              <div className="catalog-subbar">
                <div className="catalog-subbar__left">
                  <div className="catalog-category-picker">
                    <span className="catalog-filter-label">
                      <Filter size={14} aria-hidden="true" /> Category:
                    </span>
                    <div className="catalog-category-chips" role="group" aria-label="Filter by one or more categories">
                      {categoryFilters.map((category) => {
                        const isAllCategories = category === 'All Parts'
                        const isSelected = isAllCategories ? selectedCategories.length === 0 : selectedCategories.includes(category)

                        return (
                          <button
                            key={category}
                            type="button"
                            className={`catalog-category-chip ${isSelected ? 'is-selected' : ''}`}
                            aria-pressed={isSelected}
                            onClick={() => toggleCategory(category)}
                          >
                            {category}
                          </button>
                        )
                      })}
                    </div>
                  </div>

                </div>
              </div>

              {/* Status & Active Filters Bar */}
              <div className="catalog-status-bar" ref={statusBarRef}>
                <p className="catalog-status-count">
                  Showing <strong>{sortedItems.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1} - {Math.min(currentPage * ITEMS_PER_PAGE, sortedItems.length)}</strong> of {sortedItems.length} parts in stock {totalPages > 1 && `(Page ${currentPage} of ${totalPages})`}
                </p>

                {hasActiveFilters && (
                  <button type="button" onClick={clearFilters} className="catalog-reset-btn">
                    <Trash2 size={14} aria-hidden="true" /> <span>Clear all filters</span>
                  </button>
                )}
              </div>

              <div className="catalog-sort-picker" ref={sortPickerRef}>
                <span className="catalog-sort-label">
                  <ArrowUpDown size={14} aria-hidden="true" /> Sort:
                </span>
                <button
                  type="button"
                  className="catalog-sort-trigger"
                  onClick={() => {
                    setIsSortMenuOpen((isOpen) => !isOpen)
                  }}
                  aria-expanded={isSortMenuOpen}
                  aria-haspopup="menu"
                  aria-label={`Sort: ${selectedSortLabel}`}
                >
                  <span>{selectedSortLabel}</span>
                  <ChevronDown size={15} aria-hidden="true" />
                </button>
                {isSortMenuOpen && (
                  <div className="catalog-sort-menu" role="menu" aria-label="Sort catalog parts">
                    {sortOptions.map((option) => (
                      <button
                        key={option.value}
                        type="button"
                        className={`catalog-sort-option ${sortBy === option.value ? 'is-selected' : ''}`}
                        role="menuitemradio"
                        aria-checked={sortBy === option.value}
                        onClick={() => {
                          setSortBy(option.value)
                          setIsSortMenuOpen(false)
                        }}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={`catalog-view-switcher is-${viewMode}`} aria-label="Catalog view">
                <span className="catalog-view-switcher__indicator" aria-hidden="true" />
                <button
                  type="button"
                  className={`catalog-view-switcher__button ${viewMode === 'cards' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('cards')}
                  aria-pressed={viewMode === 'cards'}
                  aria-label="Card view"
                >
                  <LayoutGrid size={15} aria-hidden="true" />
                  <span>Cards</span>
                </button>
                <button
                  type="button"
                  className={`catalog-view-switcher__button ${viewMode === 'list' ? 'is-active' : ''}`}
                  onClick={() => setViewMode('list')}
                  aria-pressed={viewMode === 'list'}
                  aria-label="List view"
                >
                  <List size={15} aria-hidden="true" />
                  <span>List</span>
                </button>
              </div>
            </div>
          </div>

          {/* Product Cards Grid: 12 per page */}
          {paginatedItems.length > 0 ? (
            <>
              <div className={`catalog-results catalog-results--${viewMode}`} key={viewMode}>
                {viewMode === 'cards' ? (
                  <div className="catalog-grid" id="catalog-grid" ref={gridRef}>
                    {paginatedItems.map((item) => (
                      <PartCard key={item.id} item={item} onImageClick={() => setSelectedPartDetail(item)} />
                    ))}
                  </div>
                ) : (
                  <div className="catalog-list-view" id="catalog-grid" ref={gridRef}>
                    {/* Desktop Table View */}
                    <div className="catalog-table-wrap">
                      <table className="catalog-table">
                        <thead>
                          <tr>
                            <th scope="col">Part</th>
                            <th scope="col">Category</th>
                            <th scope="col">Fleet</th>
                            <th scope="col">Condition</th>
                            <th scope="col">Qty.</th>
                            <th scope="col">Price</th>
                            <th scope="col">RFQ</th>
                          </tr>
                        </thead>
                        <tbody>
                          {paginatedItems.map((item) => (
                            <tr key={item.id}>
                              <td>
                                <div className="catalog-table__part">
                                  <button
                                    type="button"
                                    className="catalog-table__image-button"
                                    onClick={() => setSelectedPartDetail(item)}
                                    aria-label={`View details for ${item.partNumber}`}
                                  >
                                    <img src={item.image} alt="" />
                                  </button>
                                  <div>
                                    <strong>{item.partNumber}</strong>
                                    <span>{item.description}</span>
                                  </div>
                                </div>
                              </td>
                              <td><span className="catalog-table__tag">{item.category}</span></td>
                              <td>{item.fleet}</td>
                              <td><span className="catalog-table__condition">{item.conditionLabel}</span></td>
                              <td>{item.quantity}</td>
                              <td><strong>{item.price}</strong></td>
                              <td>
                                <a
                                  className="catalog-table__rfq"
                                  href={`mailto:sales@goldenwingsinternational.net?subject=RFQ%20${encodeURIComponent(item.partNumber)}`}
                                >
                                  <span> RFQ </span><ArrowRight size={14} aria-hidden="true" />
                                </a>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>

                    {/* Responsive Mobile Horizontal Cards */}
                    <div className="catalog-mobile-list" aria-label="Parts list">
                      {paginatedItems.map((item) => (
                        <article
                          key={item.id}
                          className="catalog-list-item"
                          onClick={() => setSelectedPartDetail(item)}
                          role="button"
                          tabIndex={0}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                              e.preventDefault()
                              setSelectedPartDetail(item)
                            }
                          }}
                          aria-label={`View details for ${item.partNumber}`}
                        >
                          <div className="catalog-list-item__media">
                            <img src={item.image} alt="" loading="lazy" />
                          </div>
                          <div className="catalog-list-item__body">
                            <div className="catalog-list-item__top">
                              <strong className="catalog-list-item__pn">{item.partNumber}</strong>
                              <span className="catalog-list-item__condition">
                                {item.condition !== 'N/D' ? item.condition : 'REQ'}
                              </span>
                            </div>
                            <p className="catalog-list-item__desc">{item.description}</p>
                            <div className="catalog-list-item__bottom">
                              <div className="catalog-list-item__meta">
                                <span className="catalog-list-item__fleet">{item.fleet}</span>
                                <span className="catalog-list-item__dot">•</span>
                                <span className="catalog-list-item__price">{item.price}</span>
                              </div>
                              <a
                                className="catalog-list-item__rfq"
                                href={`mailto:sales@goldenwingsinternational.net?subject=RFQ%20${encodeURIComponent(item.partNumber)}`}
                                onClick={(e) => e.stopPropagation()}
                                aria-label={`Request quote for ${item.partNumber}`}
                              >
                                <span>RFQ</span>
                                <ArrowRight size={11} aria-hidden="true" />
                              </a>
                            </div>
                          </div>
                        </article>
                      ))}
                    </div>
                  </div>
                )}
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
                        <span> {page}</span>
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

          {selectedPartDetail && (
            <div className="part-detail-modal" role="dialog" aria-modal="true" aria-labelledby="part-detail-title">
              <button
                type="button"
                className="part-detail-modal__backdrop"
                onClick={() => setSelectedPartDetail(null)}
                aria-label="Close part details"
              />
              <section className="part-detail-modal__card">
                <button
                  type="button"
                  className="part-detail-modal__close"
                  onClick={() => setSelectedPartDetail(null)}
                  aria-label="Close part details"
                >
                  <X size={20} aria-hidden="true" />
                </button>
                <div className="part-detail-modal__image-wrap">
                  <img src={selectedPartDetail.image} alt={`${selectedPartDetail.description} - ${selectedPartDetail.partNumber}`} />
                </div>
                <div className="part-detail-modal__content">
                  <span className="part-detail-modal__category">{selectedPartDetail.category}</span>
                  <p className="part-detail-modal__label">Part Number</p>
                  <h2 id="part-detail-title">{selectedPartDetail.partNumber}</h2>
                  <p className="part-detail-modal__description">{selectedPartDetail.description}</p>
                  <dl className="part-detail-modal__specs">
                    <div><dt>Fleet</dt><dd>{selectedPartDetail.fleet}</dd></div>
                    <div><dt>Condition</dt><dd>{selectedPartDetail.conditionLabel}</dd></div>
                    <div><dt>Quantity</dt><dd>{selectedPartDetail.quantity}</dd></div>
                    <div><dt>Price</dt><dd>{selectedPartDetail.price}</dd></div>
                  </dl>
                  <a
                    className="part-detail-modal__rfq"
                    href={`mailto:sales@goldenwingsinternational.net?subject=RFQ%20${encodeURIComponent(selectedPartDetail.partNumber)}`}
                  >
                    Request RFQ <ArrowRight size={16} aria-hidden="true" />
                  </a>
                </div>
              </section>
            </div>
          )}
        </div>
      </section>
    </main>
  )
}

export default Catalog
