import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import gsap from 'gsap'
import { Search, X, ArrowUpRight, ArrowRight, Package } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { partsInventory } from '../data/partsInventory.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import videoTwo from '../assets/videos/video2.webm'
import videoThree from '../assets/videos/video3.webm'
import videoFour from '../assets/videos/video 4.mp4'

const fleetShortcuts = [
  { label: 'Boeing 737 / 777', query: 'Boeing' },
  { label: 'Airbus A320 / A330', query: 'Airbus' },
  { label: 'ATR 42 / 72', query: 'ATR' },
  { label: 'Turbines & APU', query: 'Turbine' },
  { label: 'Avionics & Radar', query: 'Avionics' },
  { label: 'Rotables & Wheels', query: 'Rotables' },
]

function HeroSlider() {
  const { t } = useLanguage()

  const slides = useMemo(
    () => [
      {
        kicker: t('hero.slides.0.kicker', '01'),
        title: t('hero.slides.0.title', 'Commercial Aviation Fleet'),
        year: '2026',
        type: t('hero.slides.0.type', 'Aircraft parts'),
        media: videoTwo,
        mediaType: 'video',
        alt: 'Commercial aviation operations video',
        tone: 'dark',
      },
      {
        kicker: t('hero.slides.1.kicker', '02'),
        title: t('hero.slides.1.title', 'Turbine Flow & Power'),
        year: 'MRO',
        type: t('hero.slides.1.type', 'Hot parts'),
        media: videoThree,
        mediaType: 'video',
        alt: 'Aircraft turbine operations video',
        tone: 'white',
      },
      {
        kicker: t('hero.slides.2.kicker', '03'),
        title: t('hero.slides.2.title', 'Mission Ready Rotables'),
        year: 'AOG',
        type: t('hero.slides.2.type', 'Rotables'),
        media: videoFour,
        mediaType: 'video',
        alt: 'Mission-ready aviation video',
        tone: 'dark',
      },
    ],
    [t],
  )

  const [{ active, previous }, setSlideState] = useState({
    active: 0,
    previous: null,
  })
  const [introReleased, setIntroReleased] = useState(false)
  const [isSearchExpanded, setIsSearchExpanded] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)
  const mediaRefs = useRef([])
  const heroRef = useRef(null)
  const searchInputRef = useRef(null)
  const searchContainerRef = useRef(null)
  const timerRef = useRef(null)
  const introPlayedRef = useRef(false)
  const introTimelineRef = useRef(null)
  const navigate = useNavigate()

  const goTo = useCallback(
    (index) => {
      window.clearTimeout(timerRef.current)
      const next = (index + slides.length) % slides.length
      if (next === active) return
      setSlideState({
        active: next,
        previous: active,
      })
    },
    [active],
  )

  useEffect(() => {
    let removeLoaderEndListener = null
    let removeVisibilityListener = null

    const ctx = gsap.context(() => {
      const playIntro = () => {
        if (introPlayedRef.current) return
        introPlayedRef.current = true
        introTimelineRef.current?.kill()

        heroRef.current?.classList.remove('hero-slider--intro-hidden')
        setIntroReleased(true)

        introTimelineRef.current = gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          // 1. Company Name "GOLDEN WINGS"
          .fromTo(
            heroRef.current?.querySelector('.hero-slider__company'),
            { y: 0, opacity: 0, scale: 0.96 },
            { y: 0, opacity: 1, scale: 1, duration: 1.05 },
            0.05,
          )
          // 2. Subtitle "INTERNATIONAL LLC"
          .fromTo(
            heroRef.current?.querySelector('.hero-slider__llc'),
            { y: 0, opacity: 0, letterSpacing: '0.42em' },
            { y: 0, opacity: 1, letterSpacing: '0.28em', duration: 0.95 },
            0.18,
          )
          // 3. Tagline description
          .fromTo(
            heroRef.current?.querySelector('.hero-slider__tagline'),
            { y: 0, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.85 },
            0.3,
          )
          // 4. Search button enters as a round compact button
          .fromTo(
            heroRef.current?.querySelector('.hero-slider__search-wrap'),
            { y: 0, scale: 0.92, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.65, ease: 'back.out(1.8)' },
            0.42,
          )
          // 5. Expands wide into the search bar
          .add(() => {
            setIsSearchExpanded(true)
          }, 0.85)
          // 6. Fleet shortcut tags appear right after search expands
          .fromTo(
            heroRef.current?.querySelectorAll('.hero-fleet-tag'),
            { y: 0, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.6, stagger: 0.05, ease: 'power3.out' },
            1.15,
          )
      }

      const resetIntro = () => {
        introTimelineRef.current?.kill()
        introPlayedRef.current = false
        setIntroReleased(false)
        setIsSearchExpanded(false)
        heroRef.current?.classList.add('hero-slider--intro-hidden')

        gsap.set(heroRef.current?.querySelector('.hero-slider__company'), { y: 0, opacity: 0, scale: 0.96 })
        gsap.set(heroRef.current?.querySelector('.hero-slider__llc'), { y: 0, opacity: 0 })
        gsap.set(heroRef.current?.querySelector('.hero-slider__tagline'), { y: 0, opacity: 0 })
        gsap.set(heroRef.current?.querySelector('.hero-slider__search-wrap'), { y: 0, scale: 0.92, opacity: 0 })
        gsap.set(heroRef.current?.querySelectorAll('.hero-fleet-tag'), { y: 0, opacity: 0 })
      }

      const handleVisibilityChange = () => {
        if (document.visibilityState !== 'visible' || !introPlayedRef.current) return
        if (document.querySelector('.page-loader')) return

        resetIntro()
        requestAnimationFrame(() => playIntro())
      }

      document.addEventListener('visibilitychange', handleVisibilityChange)
      removeVisibilityListener = () => document.removeEventListener('visibilitychange', handleVisibilityChange)

      if (introPlayedRef.current) return

      // Set initial hidden state
      gsap.set(heroRef.current?.querySelector('.hero-slider__company'), { y: 0, opacity: 0, scale: 0.96 })
      gsap.set(heroRef.current?.querySelector('.hero-slider__llc'), { y: 0, opacity: 0 })
      gsap.set(heroRef.current?.querySelector('.hero-slider__tagline'), { y: 0, opacity: 0 })
      gsap.set(heroRef.current?.querySelector('.hero-slider__search-wrap'), { y: 0, scale: 0.92, opacity: 0 })
      gsap.set(heroRef.current?.querySelectorAll('.hero-fleet-tag'), { y: 0, opacity: 0 })

      const waitForLoader = document.querySelector('.page-loader') || document.body.style.position === 'fixed'

      if (waitForLoader) {
        const handleLoaderEnd = () => requestAnimationFrame(() => playIntro())
        window.addEventListener('golden-wings:loader-end', handleLoaderEnd, { once: true })
        const fallbackTimer = setTimeout(() => {
          if (!introPlayedRef.current) playIntro()
        }, 3500)
        removeLoaderEndListener = () => {
          window.removeEventListener('golden-wings:loader-end', handleLoaderEnd)
          clearTimeout(fallbackTimer)
        }
        return
      }

      // Direct route navigation
      playIntro()
    })

    return () => {
      removeLoaderEndListener?.()
      removeVisibilityListener?.()
      introTimelineRef.current?.kill()
      introPlayedRef.current = false
      ctx.revert()
    }
  }, [])

  useEffect(() => {
    mediaRefs.current.forEach((element, index) => {
      if (!element) return
      gsap.killTweensOf(element)
      gsap.set(element, {
        display: index === active || index === previous ? 'block' : 'none',
        zIndex: index === active ? 2 : 1,
        xPercent: 0,
        yPercent: 0,
      })
    })

    const incoming = mediaRefs.current[active]
    const outgoing = previous === null ? null : mediaRefs.current[previous]

    if (outgoing) {
      gsap.fromTo(
        outgoing,
        { xPercent: 0, yPercent: 0, opacity: 1, scale: 1 },
        {
          xPercent: 0,
          yPercent: 0,
          opacity: 0,
          scale: 1,
          duration: 0.9,
          ease: 'power2.out',
        },
      )
    }

    if (incoming) {
      gsap.fromTo(
        incoming,
        {
          xPercent: 0,
          yPercent: 0,
          opacity: 0,
          scale: 1.02,
        },
        {
          xPercent: 0,
          yPercent: 0,
          opacity: 1,
          scale: 1,
          duration: previous === null ? 1.1 : 1.05,
          ease: 'power2.out',
        },
      )
    }
  }, [active, previous])

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      goTo(active + 1)
    }, 10000)

    return () => window.clearTimeout(timerRef.current)
  }, [active, goTo])

  // Filter inventory parts matching query
  const filteredParts = useMemo(() => {
    const raw = searchQuery.trim().toLowerCase()
    if (!raw) return []

    const cleanRaw = raw.replace(/[-\s]/g, '')

    return partsInventory.filter((item) => {
      const pn = (item.partNumber || '').toLowerCase()
      const cleanPn = pn.replace(/[-\s]/g, '')
      const desc = (item.description || '').toLowerCase()
      const fleet = (item.fleet || '').toLowerCase()
      const cat = (item.category || '').toLowerCase()

      return (
        pn.includes(raw) ||
        cleanPn.includes(cleanRaw) ||
        desc.includes(raw) ||
        fleet.includes(raw) ||
        cat.includes(raw)
      )
    })
  }, [searchQuery])

  const handleSearchClick = () => {
    if (!isSearchExpanded) {
      setIsSearchExpanded(true)
      setTimeout(() => searchInputRef.current?.focus(), 150)
    }
  }

  const handleSearchChange = (event) => {
    const val = event.target.value
    setSearchQuery(val)
    setIsDropdownOpen(val.trim().length > 0)
  }

  const handleSearchFocus = () => {
    if (searchQuery.trim().length > 0) {
      setIsDropdownOpen(true)
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false)
    }
  }

  const handleClearSearch = (e) => {
    e.stopPropagation()
    setSearchQuery('')
    setIsDropdownOpen(false)
    searchInputRef.current?.focus()
  }

  const handleSelectProduct = (part) => {
    setIsDropdownOpen(false)
    navigate(`/catalog?search=${encodeURIComponent(part.partNumber)}`)
  }

  const handleViewAllResults = () => {
    setIsDropdownOpen(false)
    const q = searchQuery.trim()
    navigate(`/catalog${q ? `?search=${encodeURIComponent(q)}` : ''}`)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    if (!isSearchExpanded) {
      setIsSearchExpanded(true)
      searchInputRef.current?.focus()
      return
    }
    setIsDropdownOpen(false)
    const q = searchQuery.trim()
    const target = `/catalog${q ? `?search=${encodeURIComponent(q)}` : ''}`
    navigate(target)
  }

  const shouldHideIntro = previous === null && !introReleased

  return (
    <section
      ref={heroRef}
      className={`hero-slider${shouldHideIntro ? ' hero-slider--intro-hidden' : ''}${introReleased ? ' hero-slider--intro-ready' : ''}`}
      aria-label="Golden Wings featured media"
    >
      <div className="hero-slider__grain" aria-hidden="true" />
      <div className="hero-slider__stage" aria-hidden="true">
        {slides.map((item, index) => (
          <div
            className={`hero-slider__media hero-slider__media--${item.mediaType}`}
            key={item.kicker}
            ref={(node) => (mediaRefs.current[index] = node)}
          >
            <video src={item.media} autoPlay muted loop playsInline aria-label={item.alt} />
          </div>
        ))}
      </div>
      <div className="hero-slider__filter" aria-hidden="true" />

      {/* Main Content */}
      <div className="hero-slider__content">
        <div className="hero-slider__title">
          <h1 className="hero-slider__company">GOLDEN WINGS</h1>
          <span className="hero-slider__llc">INTERNATIONAL LLC</span>
          <p className="hero-slider__tagline">
            Aviation spare parts solutions to keep your fleet operational.
          </p>
        </div>

        {/* Search Container with Expandable Bar and Live Dropdown */}
        <div className="hero-slider__search-container" ref={searchContainerRef}>
          <div
            className={`hero-slider__search-wrap ${isSearchExpanded ? 'hero-slider__search-wrap--expanded' : ''}`}
            onClick={handleSearchClick}
          >
            <form
              className="hero-slider__search"
              role="search"
              onSubmit={handleSubmit}
            >
              <input
                ref={searchInputRef}
                type="search"
                name="partSearch"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={handleSearchFocus}
                onKeyDown={handleKeyDown}
                placeholder={t('hero.searchPlaceholder')}
                aria-label={t('hero.searchPlaceholder')}
                tabIndex={isSearchExpanded ? 0 : -1}
                autoComplete="off"
              />
              {searchQuery && (
                <button
                  type="button"
                  className="hero-slider__search-clear"
                  onClick={handleClearSearch}
                  aria-label="Clear search text"
                >
                  <X size={17} aria-hidden="true" />
                </button>
              )}
              <button
                type="submit"
                aria-label={t('hero.searchBtn')}
                className="hero-slider__search-submit"
              >
                <Search size={20} aria-hidden="true" />
                <span className="hero-slider__search-btn-label">{t('hero.searchBtn')}</span>
              </button>
            </form>
          </div>

          {/* Autocomplete Dropdown directly under the input */}
          {isSearchExpanded && isDropdownOpen && searchQuery.trim().length > 0 && (
            <div className="hero-search-dropdown" role="listbox" aria-label="Aviation parts suggestions">
              {filteredParts.length > 0 ? (
                <>
                  <div className="hero-search-dropdown__header">
                    <span className="hero-search-dropdown__count">
                      Found <strong>{filteredParts.length}</strong> matching {filteredParts.length === 1 ? 'part' : 'parts'}:
                    </span>
                    <span className="hero-search-dropdown__hint">Select item to view in Catalog</span>
                  </div>

                  <div className="hero-search-dropdown__list">
                    {filteredParts.slice(0, 3).map((part) => (
                      <div
                        key={part.id || part.partNumber}
                        className="hero-search-dropdown__item"
                        role="option"
                        tabIndex={0}
                        onClick={() => handleSelectProduct(part)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            handleSelectProduct(part)
                          }
                        }}
                      >
                        <div className="hero-search-dropdown__thumb-wrap">
                          {part.image ? (
                            <img
                              src={part.image}
                              alt={part.partNumber}
                              className="hero-search-dropdown__thumb"
                              loading="lazy"
                            />
                          ) : (
                            <div className="hero-search-dropdown__thumb-placeholder">
                              <Package size={22} />
                            </div>
                          )}
                        </div>

                        <div className="hero-search-dropdown__info">
                          <div className="hero-search-dropdown__pn-row">
                            <span className="hero-search-dropdown__pn-title">{t('hero.partNumberLabel')}</span>
                            <span className="hero-search-dropdown__pn">{part.partNumber}</span>
                            {part.category && (
                              <span className="hero-search-dropdown__category">{part.category}</span>
                            )}
                            {part.fleet && (
                              <span className="hero-search-dropdown__fleet">{part.fleet}</span>
                            )}
                          </div>
                          <span className="hero-search-dropdown__name">{part.description}</span>
                          <div className="hero-search-dropdown__meta">
                            {part.conditionLabel && (
                              <span className="hero-search-dropdown__condition">
                                {part.conditionLabel}
                              </span>
                            )}
                            {part.price && (
                              <span className="hero-search-dropdown__price">{part.price}</span>
                            )}
                          </div>
                        </div>

                        <div className="hero-search-dropdown__action">
                          <span className="hero-search-dropdown__action-text">{t('hero.viewResult')}</span>
                          <ArrowUpRight size={17} aria-hidden="true" />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="hero-search-dropdown__footer">
                    <button
                      type="button"
                      className="hero-search-dropdown__footer-btn"
                      onClick={handleViewAllResults}
                    >
                      <span>{t('hero.viewAllResults', '', { count: filteredParts.length, query: searchQuery.trim() })}</span>
                      <ArrowRight size={16} aria-hidden="true" />
                    </button>
                  </div>
                </>
              ) : (
                <div className="hero-search-dropdown__empty">
                  <Package size={32} className="hero-search-dropdown__empty-icon" aria-hidden="true" />
                  <p className="hero-search-dropdown__empty-title">
                    {t('hero.emptyTitle', '', { query: searchQuery.trim() })}
                  </p>
                  <p className="hero-search-dropdown__empty-text">
                    {t('hero.emptyText')}
                  </p>
                  <button
                    type="button"
                    className="hero-search-dropdown__empty-btn"
                    onClick={handleViewAllResults}
                  >
                    <span>{t('hero.emptyBtn')}</span>
                    <ArrowRight size={15} aria-hidden="true" />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Fleet & Systems Quick-Tags (Solid, Clean Style - Not Glass) */}
        <div className="hero-fleet-tags" aria-label="Popular fleet shortcuts">
          <span className="hero-fleet-tags__label">Quick search:</span>
          {fleetShortcuts.map((tag) => (
            <button
              type="button"
              className="hero-fleet-tag"
              key={tag.label}
              onClick={() => {
                navigate(`/catalog?search=${encodeURIComponent(tag.query)}`)
              }}
            >
              {tag.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}

export default HeroSlider
