import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { Search } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import avion from '../assets/avion.jpg'
import helicoptero from '../assets/helicoptero.jpg'
import turbina from '../assets/videos/turbina.webm'
import eagleLogo from '../assets/laoder/golden-wings-aguila-mundo.svg'

const slides = [
  {
    kicker: '01',
    title: 'Global Lift',
    year: '2026',
    type: 'Aircraft parts',
    media: avion,
    mediaType: 'image',
    alt: 'Commercial aircraft flying above clouds',
    tone: 'dark',
  },
  {
    kicker: '02',
    title: 'Engine Flow',
    year: 'MRO',
    type: 'Hot parts',
    media: turbina,
    mediaType: 'video',
    alt: 'Aircraft turbine video',
    tone: 'white',
  },
  {
    kicker: '03',
    title: 'Mission Ready',
    year: 'AOG',
    type: 'Rotables',
    media: helicoptero,
    mediaType: 'image',
    alt: 'Helicopter in flight',
    tone: 'dark',
  },
]

function HeroSlider() {
  const [{ active, previous, direction }, setSlideState] = useState({
    active: 0,
    previous: null,
    direction: 1,
  })
  const [introReleased, setIntroReleased] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const mediaRefs = useRef([])
  const heroRef = useRef(null)
  const timerRef = useRef(null)
  const introPlayedRef = useRef(false)
  const introTimelineRef = useRef(null)
  const navigate = useNavigate()

  const goTo = useCallback(
    (index, forcedDirection) => {
      window.clearTimeout(timerRef.current)
      const next = (index + slides.length) % slides.length
      if (next === active) return
      setSlideState({
        active: next,
        previous: active,
        direction: forcedDirection ?? (next > active ? 1 : -1),
      })
    },
    [active],
  )

  useLayoutEffect(() => {
    let removeLoaderEndListener = null

    const ctx = gsap.context(() => {
      gsap.to(heroRef.current?.querySelector('.hero-slider__stage'), {
        yPercent: -12,
        scale: 1.035,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=95%',
          scrub: 0.45,
        },
      })

      gsap.to(heroRef.current?.querySelector('.hero-slider__content'), {
        yPercent: -28,
        opacity: 0.15,
        ease: 'none',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top',
          end: '+=95%',
          scrub: 0.45,
        },
      })

      const heroElements = [
        heroRef.current?.querySelector('.hero-slider__logo'),
        heroRef.current?.querySelector('.hero-slider__brand'),
        heroRef.current?.querySelector('.hero-slider__title h1'),
        heroRef.current?.querySelector('.hero-slider__search'),
      ].filter(Boolean)

      const playIntro = () => {
        if (introPlayedRef.current) return
        introPlayedRef.current = true
        introTimelineRef.current?.kill()
        gsap.set(heroElements, { opacity: 0 })
        gsap.set(heroRef.current?.querySelector('.hero-slider__title h1'), { yPercent: 110, rotate: 2 })
        heroRef.current?.classList.remove('hero-slider--intro-hidden')
        setIntroReleased(true)
        introTimelineRef.current = gsap
          .timeline({ defaults: { ease: 'power4.out' } })
          .fromTo(
            heroRef.current?.querySelector('.hero-slider__logo'),
            { y: -24, scale: 0.78, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 0.78 },
            0.08,
          )
          .fromTo(
            heroRef.current?.querySelector('.hero-slider__brand'),
            { x: -26, opacity: 0 },
            { x: 0, opacity: 1, duration: 0.9 },
            0.18,
          )
          .fromTo(
            heroRef.current?.querySelector('.hero-slider__title h1'),
            { yPercent: 110, opacity: 0, rotate: 2 },
            { yPercent: 0, opacity: 1, rotate: 0, duration: 1.05 },
            0.26,
          )
          .fromTo(
            heroRef.current?.querySelector('.hero-slider__search'),
            { y: 18, scale: 0.9, opacity: 0 },
            { y: 0, scale: 1, opacity: 1, duration: 1.35 },
            1.02,
          )
          .fromTo(
            heroRef.current?.querySelector('.hero-slider__search-note'),
            { y: 12, opacity: 0 },
            { y: 0, opacity: 0.82, duration: 1.05 },
            1.18,
          )
      }

      if (introPlayedRef.current) return

      gsap.set(heroElements, { opacity: 0 })
      gsap.set(heroRef.current?.querySelector('.hero-slider__title h1'), { yPercent: 110, rotate: 2 })

      const waitForLoader = document.querySelector('.page-loader') || document.body.style.position === 'fixed'

      if (waitForLoader) {
        const handleLoaderEnd = () => requestAnimationFrame(() => playIntro())
        window.addEventListener('golden-wings:loader-end', handleLoaderEnd, { once: true })
        removeLoaderEndListener = () => window.removeEventListener('golden-wings:loader-end', handleLoaderEnd)
        return
      }

      // Direct route navigation: play immediately without delay
      playIntro()
    })

    return () => {
      removeLoaderEndListener?.()
      introTimelineRef.current?.kill()
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
      })
    })

    const incoming = mediaRefs.current[active]
    const outgoing = previous === null ? null : mediaRefs.current[previous]

    if (outgoing) {
      gsap.fromTo(
        outgoing,
        { xPercent: 0, opacity: 1, scale: 1 },
        {
          xPercent: -34 * direction,
          opacity: 1,
          scale: 1.01,
          duration: 1.72,
          ease: 'power2.out',
        },
      )
    }

    if (incoming) {
      gsap.fromTo(
        incoming,
        {
          xPercent: previous === null ? 0 : 100 * direction,
          opacity: previous === null ? 0 : 1,
          scale: previous === null ? 1.06 : 1.02,
        },
        {
          xPercent: 0,
          opacity: 1,
          scale: 1,
          duration: previous === null ? 0.9 : 1.18,
          ease: 'power4.out',
        },
      )
    }
  }, [active, previous, direction])

  useEffect(() => {
    timerRef.current = window.setTimeout(() => {
      goTo(active + 1, 1)
    }, 10000)

    return () => window.clearTimeout(timerRef.current)
  }, [active, goTo])

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
            {item.mediaType === 'video' ? (
              <video src={item.media} autoPlay muted loop playsInline aria-label={item.alt} />
            ) : (
              <img src={item.media} alt={item.alt} />
            )}
          </div>
        ))}
      </div>
      <div className="hero-slider__filter" aria-hidden="true" />
      <div className="hero-slider__content">
        <div className="hero-slider__logo" aria-hidden="true">
          <img src={eagleLogo} alt="" />
        </div>
        <div className="hero-slider__brand">
          <span>Golden Wings</span>
          <small>International LLC</small>
        </div>
        <div className="hero-slider__title">
          <h1>
            <span>KEEPING AIRCRAFT</span>
            <strong>IN THE AIR</strong>
            <small>TRACEABLE PARTS. FAST SOURCING.</small>
          </h1>
        </div>
      <form
        className="hero-slider__search"
        role="search"
        onSubmit={(event) => {
          event.preventDefault()
          const target = `/catalog${searchQuery.trim() ? `?search=${encodeURIComponent(searchQuery.trim())}` : ''}`
          navigate(target)
        }}
      >
        <input
          type="search"
          name="partSearch"
          value={searchQuery}
          onChange={(event) => setSearchQuery(event.target.value)}
          placeholder="Search by part number or keyword"
          aria-label="Search by part number or keyword"
        />
          <button type="submit" aria-label="Search products">
            <Search size={20} aria-hidden="true" />
          </button>
        </form>
      </div>
    </section>
  )
}

export default HeroSlider
