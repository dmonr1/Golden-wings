import { useCallback, useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react'
import HeroSlider from '../components/HeroSlider.jsx'
import propellerImg from '../assets/propeller.jpg'
import toolingImg from '../assets/tooling.jpg'
import supportingImg from '../assets/supporting.jpg'
import cockpitImg from '../assets/cockpit.jpg'
import avionicsImage from '../assets/avionics.jpg'
import hotPartsImage from '../assets/hot parts.webp'
import lostDealsImage from '../assets/lost deals.jpg'
import atrLogo from '../assets/partners/ATR_logo_2015.svg'
import bellLogo from '../assets/partners/Bell_Textron_logo.png'
import beechcraftLogo from '../assets/partners/beechcraft.png'
import continentalLogo from '../assets/partners/continental_logo_original.png'
import deHavillandLogo from '../assets/partners/de havillan.png'
import embraerLogo from '../assets/partners/Embraer_logo.png'
import fokkerLogo from '../assets/partners/Fokker_official_logo.png'
import gulfstreamLogo from '../assets/partners/Gulfstream_Aerospace_logo.svg'
import planeVector from '../assets/svgs/avion-vector.svg'
import eagleLogo from '../assets/laoder/golden-wings-aguila-mundo.svg'
import { submitContactForm } from '../services/contactForm.js'
import FeedbackModal from '../components/FeedbackModal.jsx'

gsap.registerPlugin(ScrollTrigger)

const highlights = [
  {
    value: 'FAA/EASA',
    label: 'Traceable Components',
    type: 'text',
  },
  {
    value: 25,
    start: 8,
    suffix: '+',
    label: 'Years Experience',
    type: 'number',
  },
  {
    value: 100,
    start: 72,
    suffix: 'k+',
    label: 'Parts Managed',
    type: 'number',
  },
  {
    value: '24/7',
    label: 'AOG Rapid Support',
    type: 'text',
  },
]

const partners = [
  { name: 'Gulfstream Aerospace', brand: 'Gulfstream', color: '#005088', logo: gulfstreamLogo },
  { name: 'Fokker', brand: 'Fokker', color: '#ea580c', logo: fokkerLogo },
  { name: 'Embraer', brand: 'Embraer', color: '#0066b2', logo: embraerLogo },
  { name: 'De Havilland', brand: 'De Havilland', color: '#b91c1c', logo: deHavillandLogo },
  { name: 'Continental', brand: 'Continental', color: '#dc2626', logo: continentalLogo },
  { name: 'Bell Textron', brand: 'Bell', color: '#e11d48', logo: bellLogo },
  { name: 'Beechcraft', brand: 'Beechcraft', color: '#9f1239', logo: beechcraftLogo },
  { name: 'ATR', brand: 'ATR', color: '#f97316', logo: atrLogo },
]

const servicesData = [
  {
    title: 'Inventory Acquisition',
    description:
      'We specialize in locating, evaluating, and acquiring complete aircraft inventories for airlines, operators, and MROs under strict quality and traceability criteria.',
    link: '/contact?subject=Inventory+Acquisition',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M6 38H42M12 38V42M24 38V42M36 38V42" stroke="#18365d" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M9 18L24 9L39 18V34H9V18Z" fill="#eef2f7" stroke="#18365d" strokeWidth="2.8" strokeLinejoin="round" />
        <path d="M24 9V34M9 18L24 26L39 18" stroke="#18365d" strokeWidth="2.2" strokeLinejoin="round" />
        <circle cx="33" cy="27" r="8" fill="#8f6b2d" stroke="#ffffff" strokeWidth="2" />
        <path d="M29.5 27L32 29.5L36.5 24.5" stroke="#ffffff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'Rotables & Expendables',
    description:
      'We offer an extensive pool of aeronautical spare parts, including rotables and expendables, ready for immediate dispatch with complete airworthiness documentation.',
    link: '/catalog?category=Rotables',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="24" cy="24" r="19" stroke="#cbd5e1" strokeWidth="2.2" strokeDasharray="4 3" />
        <circle cx="24" cy="24" r="8" fill="#8f6b2d" stroke="#18365d" strokeWidth="2.8" />
        <circle cx="24" cy="24" r="3" fill="#fef08a" />
        <path d="M24 16V5M24 32V43M16 24H5M32 24H43" stroke="#18365d" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M18.3 18.3L10.5 10.5M29.7 29.7L37.5 37.5M29.7 18.3L37.5 10.5M18.3 29.7L10.5 37.5" stroke="#8f6b2d" strokeWidth="2.8" strokeLinecap="round" />
        <path d="M39 15C42 19 42 22 42 24M6 24C6 20 8 17 10 15" stroke="#0284c7" strokeWidth="2.8" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: 'Tooling & Ground Support',
    description:
      'Precision aircraft maintenance tooling, hydraulic tripod jacks, APU tooling, and heavy ground support equipment engineered for active commercial and corporate fleets.',
    link: '/catalog?category=Tooling',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="28" r="10" fill="#eef2f7" stroke="#64748b" strokeWidth="2.4" />
        <path d="M20 15V18M20 38V41M7 28H10M30 28H33M11 19L13.5 21.5M26.5 34.5L29 37M11 37L13.5 34.5M26.5 21.5L29 19" stroke="#64748b" strokeWidth="2.4" strokeLinecap="round" />
        <circle cx="20" cy="28" r="4.5" fill="#ffffff" stroke="#18365d" strokeWidth="2.2" />
        <path d="M38.5 7.5C40.5 9.5 41 12.5 39.5 15L35 19.5L29.5 14L34 9.5C35.5 8 37.5 7 38.5 7.5Z" fill="#8f6b2d" stroke="#18365d" strokeWidth="2.4" strokeLinejoin="round" />
        <path d="M29.5 14L15.5 28" stroke="#18365d" strokeWidth="4" strokeLinecap="round" />
        <path d="M15.5 28L12 31.5L16.5 36L20 32.5" stroke="#8f6b2d" strokeWidth="2.4" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: 'AOG Critical Logistics',
    description:
      'Urgent 24/7 aircraft-on-ground logistics protocol with immediate quoting, expedited warehouse retrieval, and fast express dispatch worldwide.',
    link: '/contact?subject=AOG+Emergency+Support',
    icon: (
      <svg width="48" height="48" viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M5 17H16M3 24H13M7 31H18" stroke="#cbd5e1" strokeWidth="2.5" strokeLinecap="round" />
        <path d="M15 22L28 17L38 6H44L36 21L45 23L38 26L34 38H29L29 26L19 25L15 31H11L15 22Z" fill="#18365d" stroke="#18365d" strokeWidth="1.6" strokeLinejoin="round" />
        <path d="M29 28L24 37H30L27 44L37 34H30L33 28H29Z" fill="#eab308" stroke="#8f6b2d" strokeWidth="1.6" strokeLinejoin="round" />
      </svg>
    ),
  },
]

const serviceTiles = [
  { title: 'Avionics', brand: 'Avionics', color: '#0284c7', image: avionicsImage, link: '/catalog?category=Avionics' },
  { title: 'Hot Parts', brand: 'Hot Parts', color: '#ea580c', image: hotPartsImage, link: '/catalog?category=Rotables' },
  { title: 'Last Deals', brand: 'Last Deals', color: '#8f6b2d', image: lostDealsImage, link: '/catalog' },
]

const faqs = [
  {
    question: 'How fast can you quote aircraft parts?',
    answer:
      'Share the part number, condition, quantity and traceability requirements. Our team reviews availability and responds with a clear quote as quickly as possible.',
  },
  {
    question: 'Do you support FAA/EASA traceability?',
    answer:
      'Yes. We prioritize traceable components and documentation so every request can move with confidence, compliance and operational reliability.',
  },
  {
    question: 'Can you help with hard-to-find spares?',
    answer:
      'Yes. Our sourcing network helps locate urgent, rare and aftermarket spares when standard inventory channels are limited or time-sensitive.',
  },
  {
    question: 'Where are you located?',
    answer:
      'Golden Wings International operates from Doral, Florida, with access to a global aviation supply network and responsive aftermarket support.',
  },
  {
    question: 'Which aircraft do you support?',
    answer:
      'We support Boeing, Airbus and regional jet operators with aircraft spares, aftermarket solutions and procurement support for active fleets.',
  },
]

function Home() {
  const stripRef = useRef(null)
  const contextSectionRef = useRef(null)
  const contextCardRef = useRef(null)
  const servicesTitleRef = useRef(null)
  const partnersSectionRef = useRef(null)
  const partnerTooltipRef = useRef(null)
  const tooltipPrefixRef = useRef(null)
  const tooltipBrandRef = useRef(null)
  const categoriesSectionRef = useRef(null)
  const partsTitleRef = useRef(null)
  const partsLineRef = useRef(null)
  const quoteBandRef = useRef(null)
  const contactRef = useRef(null)
  const [activeFaq, setActiveFaq] = useState(0)
  const [contactForm, setContactForm] = useState({ name: '', email: '', partNumber: '', request: '' })
  const [contactStatus, setContactStatus] = useState('idle')
  const [contactError, setContactError] = useState('')
  const [contactAlert, setContactAlert] = useState({ type: '', message: '' })

  const handleHomeContactChange = (event) => {
    const { name, value } = event.target
    setContactForm((previous) => ({ ...previous, [name]: value }))
  }

  const handleHomeContactSubmit = async (event) => {
    event.preventDefault()
    setContactStatus('sending')
    setContactError('')

    try {
      await submitContactForm(contactForm)
      setContactStatus('sent')
      setContactAlert({ type: 'success', message: 'Your RFQ request was sent successfully.' })
      setContactForm({ name: '', email: '', partNumber: '', request: '' })
    } catch (error) {
      setContactStatus('error')
      setContactError(error.message)
      setContactAlert({ type: 'error', message: error.message })
    }
  }


  useEffect(() => {
    const ctx = gsap.context(() => {
      gsap.utils.toArray('[data-count]').forEach((node) => {
        const start = Number(node.dataset.start)
        const end = Number(node.dataset.end)
        const suffix = node.dataset.suffix || ''
        const counter = { value: start }

        gsap.fromTo(
          counter,
          { value: start },
          {
            value: end,
            duration: 1.9,
            ease: 'power4.out',
            scrollTrigger: {
              trigger: node,
              start: 'top 82%',
              toggleActions: 'restart none none none',
            },
            onUpdate: () => {
              node.textContent = `${Math.round(counter.value)}${suffix}`
            },
          },
        )
      })

      const indicatorNodes = gsap.utils.toArray('.home-indicator-item')

      gsap.fromTo(
        indicatorNodes,
        { y: 28, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: stripRef.current,
            start: 'top 88%',
            toggleActions: 'play none none none',
          },
        },
      )

      // Indicators animate smoothly via ScrollTrigger fromTo above

      if (contextCardRef.current) {
        const serviceCards = contextCardRef.current.querySelectorAll('.service-feature-card')
        serviceCards.forEach((card, index) => {
          const fromLeft = index % 2 === 0
          gsap.fromTo(
            card,
            {
              x: fromLeft ? -80 : 80,
              opacity: 0,
              scale: 0.94,
            },
            {
              x: 0,
              opacity: 1,
              scale: 1,
              duration: 1.05,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: card,
                start: 'top 88%',
                toggleActions: 'play reverse play reverse',
              },
            },
          )
        })
      }

      if (servicesTitleRef.current) {
        gsap.fromTo(
          servicesTitleRef.current,
          {
            y: 46,
            opacity: 0,
            scale: 0.94,
            letterSpacing: '0.06em',
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            letterSpacing: '-0.02em',
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: servicesTitleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      }

      const marquee = partnersSectionRef.current?.querySelector('.partners-marquee')
      const marqueeTrack = marquee?.querySelector('.partners-marquee__track')
      let marqueeFrame
      let marqueeOffset = 0
      let marqueeVelocity = 0
      let marqueeDragging = false
      let marqueeLastX = 0

      const wrapMarquee = () => {
        const wrapWidth = (marqueeTrack?.scrollWidth || 0) / 2
        if (!wrapWidth) return
        marqueeOffset = ((marqueeOffset % wrapWidth) + wrapWidth) % wrapWidth
      }

      const tickMarquee = () => {
        if (!marqueeDragging) {
          marqueeOffset += -0.82 + marqueeVelocity
          marqueeVelocity *= 0.975
        }
        wrapMarquee()
        if (marqueeTrack) marqueeTrack.style.transform = `translate3d(${-marqueeOffset}px, 0, 0)`
        marqueeFrame = requestAnimationFrame(tickMarquee)
      }

      const handleMarqueeDown = (event) => {
        event.preventDefault()
        marqueeDragging = true
        marqueeVelocity = 0
        marqueeLastX = event.clientX
        marquee?.classList.add('is-dragging')
        marquee?.setPointerCapture?.(event.pointerId)
      }

      const handleMarqueeMove = (event) => {
        if (!marqueeDragging) return
        event.preventDefault()
        const delta = event.clientX - marqueeLastX
        marqueeOffset -= delta
        marqueeVelocity = -delta * 0.58
        marqueeLastX = event.clientX
        wrapMarquee()
        if (marqueeTrack) marqueeTrack.style.transform = `translate3d(${-marqueeOffset}px, 0, 0)`
      }

      const handleMarqueeUp = (event) => {
        marqueeDragging = false
        marquee?.classList.remove('is-dragging')
        marquee?.releasePointerCapture?.(event.pointerId)
      }

      marquee?.addEventListener('pointerdown', handleMarqueeDown)
      marquee?.addEventListener('pointermove', handleMarqueeMove)
      marquee?.addEventListener('pointerup', handleMarqueeUp)
      marquee?.addEventListener('pointercancel', handleMarqueeUp)
      marqueeFrame = requestAnimationFrame(tickMarquee)

      gsap.fromTo(
        partnersSectionRef.current?.querySelectorAll('.partners-marquee, .partner-card') || [],
        { y: 18, opacity: 0.55 },
        {
          y: 0,
          opacity: 1,
          duration: 0.7,
          stagger: 0.055,
          ease: 'power3.out',
          scrollTrigger: { trigger: partnersSectionRef.current, start: 'top 82%', once: true },
        },
      )

      // Unified cursor tooltip with inertia follow (for Partners and Parts Inventory cards)
      const cursorTooltip = partnerTooltipRef.current
      let handleTooltipMouseMove
      let handleTooltipTouchStart
      let handleWindowScroll
      let handleDocLeave
      let touchHideTimer

      if (cursorTooltip) {
        // Centered directly on cursor
        gsap.set(cursorTooltip, {
          xPercent: -50,
          yPercent: -50,
          scale: 0.6,
          opacity: 0,
          pointerEvents: 'none',
        })

        const xTo = gsap.quickTo(cursorTooltip, 'x', { duration: 0.32, ease: 'power3.out' })
        const yTo = gsap.quickTo(cursorTooltip, 'y', { duration: 0.32, ease: 'power3.out' })

        const isTouchLayout = window.matchMedia('(hover: none), (pointer: coarse)').matches
        let isTooltipActive = false
        let currentCard = null
        let lastPointerX = -1000
        let lastPointerY = -1000

        const setTooltipContent = (card) => {
          const prefix = card.getAttribute('data-tooltip-prefix') || 'Explore Fleet'
          const brand = card.getAttribute('data-tooltip-brand') || ''
          const brandColor = card.getAttribute('data-tooltip-color') || '#8f6b2d'

          if (tooltipPrefixRef.current) {
            tooltipPrefixRef.current.textContent = prefix
          }
          if (tooltipBrandRef.current) {
            tooltipBrandRef.current.textContent = brand
            tooltipBrandRef.current.style.color = brandColor
          }
        }

        const hideTooltip = (duration = 0.2) => {
          if (!isTooltipActive) return
          isTooltipActive = false
          currentCard = null
          gsap.to(cursorTooltip, {
            scale: 0.6,
            opacity: 0,
            duration,
            ease: 'power2.in',
            overwrite: 'auto',
          })
        }

        const updateTooltipForPoint = (clientX, clientY) => {
          if (clientX < 0 || clientY < 0) return
          lastPointerX = clientX
          lastPointerY = clientY

          const el = document.elementFromPoint(clientX, clientY)
          const card = el?.closest?.('.partner-card, .service-strip__item')

          if (card) {
            if (currentCard !== card) {
              currentCard = card
              setTooltipContent(card)

              if (!isTooltipActive) {
                isTooltipActive = true
                gsap.set(cursorTooltip, {
                  x: clientX,
                  y: clientY,
                  scale: 0.6,
                  opacity: 0,
                })
                gsap.to(cursorTooltip, {
                  scale: 1,
                  opacity: 1,
                  duration: 0.25,
                  ease: 'back.out(1.6)',
                  overwrite: 'auto',
                })
              }
            }

            const clampX = Math.max(120, Math.min(window.innerWidth - 120, clientX))
            const clampY = Math.max(30, Math.min(window.innerHeight - 30, clientY))
            xTo(clampX)
            yTo(clampY)
          } else {
            hideTooltip()
          }
        }

        handleTooltipMouseMove = (e) => {
          updateTooltipForPoint(e.clientX, e.clientY)
        }

        handleWindowScroll = () => {
          if (lastPointerX > 0 && lastPointerY > 0) {
            updateTooltipForPoint(lastPointerX, lastPointerY)
          }
        }

        handleDocLeave = () => {
          hideTooltip(0.18)
        }

        handleTooltipTouchStart = (e) => {
          if (!isTouchLayout && e.pointerType !== 'touch' && e.pointerType !== 'pen') return

          const card = e.target?.closest?.('.partner-card, .service-strip__item')
          if (!card) return

          setTooltipContent(card)
          currentCard = card
          isTooltipActive = true
          window.clearTimeout(touchHideTimer)

          const rect = card.getBoundingClientRect()
          const tooltipX = Math.max(120, Math.min(window.innerWidth - 120, rect.left + rect.width / 2))
          const tooltipY = Math.max(58, rect.top - 12)

          gsap.set(cursorTooltip, {
            xPercent: -50,
            yPercent: -100,
            x: tooltipX,
            y: tooltipY,
            scale: 0.88,
            opacity: 0,
          })
          gsap.to(cursorTooltip, {
            scale: 1,
            opacity: 1,
            duration: 0.2,
            ease: 'power2.out',
            overwrite: 'auto',
          })

          touchHideTimer = window.setTimeout(() => hideTooltip(0.25), 2200)
        }

        window.addEventListener('pointermove', handleTooltipMouseMove, { passive: true })
        window.addEventListener('pointerdown', handleTooltipTouchStart, { passive: true })
        window.addEventListener('scroll', handleWindowScroll, { passive: true })
        document.addEventListener('mouseleave', handleDocLeave)
      }

      if (partsTitleRef.current) {
        gsap.fromTo(
          partsTitleRef.current,
          {
            y: 46,
            opacity: 0,
            scale: 0.94,
            letterSpacing: '0.06em',
          },
          {
            y: 0,
            opacity: 1,
            scale: 1,
            letterSpacing: '-0.02em',
            duration: 1.1,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: partsTitleRef.current,
              start: 'top 85%',
              toggleActions: 'play none none reverse',
            },
          },
        )
      }

      if (partsLineRef.current && categoriesSectionRef.current) {
        gsap.fromTo(
          partsLineRef.current,
          {
            width: '54px',
          },
          {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: categoriesSectionRef.current,
              start: 'top 85%',
              end: 'top 20%',
              scrub: 0.8,
            },
          },
        )
      }

      gsap.fromTo(
        '.service-strip__item',
        {
          y: 56,
          opacity: 0,
          scale: 0.96,
        },
        {
          y: 0,
          opacity: 1,
          scale: 1,
          duration: 0.85,
          stagger: 0.15,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: '.service-strip',
            start: 'top 85%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      gsap.set('.quote-plane', { x: '-28vw', y: '16vh', rotate: -6, scale: 0.75, opacity: 0 })
      gsap.set('.quote-plane__wind span', { scaleX: 0, opacity: 0 })

      gsap
        .timeline({
          scrollTrigger: {
            trigger: quoteBandRef.current,
            start: 'top bottom',
            end: 'bottom 45%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        .to(
          '.quote-plane',
          { x: '140vw', y: '-70vh', rotate: -2, scale: 1.1, duration: 1, ease: 'none' },
          0,
        )
        .fromTo(
          '.quote-plane',
          { opacity: 0 },
          { opacity: 0.24, duration: 0.2, ease: 'power1.out' },
          0,
        )
        .to(
          '.quote-plane',
          { opacity: 0, duration: 0.2, ease: 'power1.in' },
          0.65,
        )
        .fromTo(
          '.quote-plane__wind span',
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 0.55, stagger: 0.07, duration: 0.28, ease: 'power1.out' },
          0.08,
        )
        .to(
          '.quote-plane__wind span',
          { opacity: 0, stagger: 0.04, duration: 0.18, ease: 'power1.in' },
          0.58,
        )

      gsap.fromTo(
        ['.quote-band__copy', '.quote-band__questions'],
        { y: 32, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          stagger: 0.16,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: quoteBandRef.current,
            start: 'top 82%',
            toggleActions: 'play none none reverse',
          },
        },
      )

      gsap
        .timeline({
          scrollTrigger: {
            trigger: contactRef.current,
            start: 'top 72%',
            end: 'top 28%',
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        })
        .fromTo(
          '.home-contact__seal',
          { yPercent: 10, rotate: -8, opacity: 0.04 },
          { yPercent: -50, rotate: -8, opacity: 0.18, duration: 1, ease: 'power3.out' },
          0,
        )

      return () => {
        marquee?.removeEventListener('pointerdown', handleMarqueeDown)
        marquee?.removeEventListener('pointermove', handleMarqueeMove)
        marquee?.removeEventListener('pointerup', handleMarqueeUp)
        marquee?.removeEventListener('pointercancel', handleMarqueeUp)
        cancelAnimationFrame(marqueeFrame)

        if (handleTooltipMouseMove) {
          window.removeEventListener('pointermove', handleTooltipMouseMove)
        }
        if (handleTooltipTouchStart) {
          window.removeEventListener('pointerdown', handleTooltipTouchStart)
        }
        window.clearTimeout(touchHideTimer)
        if (handleWindowScroll) {
          window.removeEventListener('scroll', handleWindowScroll)
        }
        if (handleDocLeave) {
          document.removeEventListener('mouseleave', handleDocLeave)
        }
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <>
      <FeedbackModal
        type={contactAlert.type}
        title={contactAlert.type === 'error' ? 'Unable to send your request' : 'Request sent successfully'}
        message={contactAlert.message}
        onClose={() => setContactAlert({ type: '', message: '' })}
      />
    <main>
      <div className="hero-slider-wrap">
        <HeroSlider />
      </div>
      <div className="home-content-body">
        <section className="home-indicators-section" ref={stripRef} aria-label="Key company indicators">
          <div className="home-indicators-inner">
            <div className="home-indicators-grid">
              {highlights.map((item) => (
                <div className="home-indicator-item" key={item.label}>
                  <strong
                    className="home-indicator-item__number"
                    {...(item.type === 'number'
                      ? {
                        'data-count': true,
                        'data-start': item.start,
                        'data-end': item.value,
                        'data-suffix': item.suffix,
                      }
                      : {})}
                  >
                    {item.type === 'number' ? `${item.start}${item.suffix}` : item.value}
                  </strong>
                  <span className="home-indicator-item__label">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
        <div className="home-indicators-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
            <path d="M 0,32 C 380,82 820,86 1440,8 L 1440,80 L 0,80 Z" fill="#faf8f3" />
          </svg>
        </div>
        <section
          className="home-context-section"
          ref={contextSectionRef}
          aria-label="Our services and capabilities"
        >
          <div className="home-services-header">
            <h2 className="home-services-heading" ref={servicesTitleRef}>
              OUR SERVICES
            </h2>
          </div>

          {/* Services Grid: 4 Clean Feature Cards matching user reference */}
          <div className="services-grid-wrapper" ref={contextCardRef}>
            <div className="services-feature-grid">
              {servicesData.map((service) => (
                <Link
                  to={service.link}
                  className="service-feature-card"
                  key={service.title}
                >
                  <div className="service-feature-card__icon-wrap" aria-hidden="true">
                    {service.icon}
                  </div>
                  <div className="service-feature-card__body">
                    <h3 className="service-feature-card__title">{service.title}</h3>
                    <p className="service-feature-card__desc">{service.description}</p>
                    <div className="service-feature-card__action">
                      <span className="service-feature-card__btn">
                        <span>View More</span>
                        <ArrowRight size={16} aria-hidden="true" />
                      </span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="partners-section" ref={partnersSectionRef} aria-label="Clients and partners">
          <div className="partners-section__wave" aria-hidden="true">
            <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
              <path
                d="M 0,32 C 380,82 820,86 1440,8 L 1440,80 L 0,80 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
          <div className="partners-section__inner">
            <h2 className="sr-only">Our Clients, Relations and Partnership</h2>
            <div className="partners-marquee" aria-hidden="true">
              <div className="partners-marquee__track">
                {Array.from({ length: 4 }).map((_, index) => (
                  <span key={index}>Our Clients + Relations + Partnership +</span>
                ))}
              </div>
            </div>
            <div className="partners-grid">
              {partners.map((partner, index) => (
                <Link
                  to={`/catalog?search=${encodeURIComponent(partner.name)}`}
                  className="partner-card"
                  key={partner.name}
                  data-tooltip-prefix="Explore Fleet"
                  data-tooltip-brand={partner.brand}
                  data-tooltip-color={partner.color}
                  aria-label={`Explore fleet parts for ${partner.name}`}
                >
                  <span>{String(index + 1).padStart(2, '0')}</span>
                  <img src={partner.logo} alt={partner.name} />
                </Link>
              ))}
            </div>
          </div>
          {/* Bottom wave cutting from white back to paper background */}
          <div className="partners-section__wave partners-section__wave--bottom" aria-hidden="true">
            <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
              <path
                d="M 0,0 C 440,64 1000,64 1440,0 L 1440,80 L 0,80 Z"
                fill="#faf8f3"
              />
            </svg>
          </div>
        </section>
        {/* Featured Parts Inventory Categories */}
        <section
          className="categories-section"
          ref={categoriesSectionRef}
          aria-label="Featured aircraft parts inventory"
        >
          <div className="categories-header">
            <h2 className="categories-header__title" ref={partsTitleRef}>
              PARTS INVENTORY
            </h2>
          </div>
          <div className="service-strip">
            {serviceTiles.map((item) => (
              <Link
                to={item.link}
                className="service-strip__item"
                key={item.title}
                data-tooltip-prefix="Explore Parts"
                data-tooltip-brand={item.brand}
                data-tooltip-color={item.color}
                aria-label={`Explore ${item.title} inventory`}
              >
                <img src={item.image} alt="" aria-hidden="true" />
                <div className="service-strip__overlay" />
                <h2 className="service-strip__title">{item.title}</h2>
              </Link>
            ))}
          </div>
          <div className="categories-cta-wrap">
            <Link
              to="/catalog"
              className="categories-catalog-btn"
            >
              <span>Explore Full Catalog (23 parts in stock)</span>
              <ArrowUpRight size={18} aria-hidden="true" />
            </Link>
          </div>
          {/* Wave cut transitioning from paper to white quote band */}
          <div className="categories-section__wave" aria-hidden="true">
            <svg viewBox="0 0 1440 96" fill="none" preserveAspectRatio="none">
              <path
                d="M 0,32 C 320,78 680,14 1040,58 C 1220,78 1360,48 1440,42 L 1440,96 L 0,96 Z"
                fill="#ffffff"
              />
              <path
                d="M 0,44 C 340,90 710,26 1060,68 C 1230,86 1360,58 1440,50 L 1440,96 L 0,96 Z"
                fill="#ffffff"
              />
            </svg>
          </div>
        </section>
        <section className="quote-band" ref={quoteBandRef} aria-label="Frequently asked quote questions">
          <div className="quote-plane" aria-hidden="true">
            <span className="quote-plane__wind">
              <span />
              <span />
              <span />
            </span>
            <img src={planeVector} alt="" />
          </div>
          <div className="quote-band__copy">

            <div className="quote-band__intro">
              <h2>Everything you need to know</h2>
              <p>We are ready for your questions. Send us your request and we will help you move faster.</p>
            </div>
            <div className="quote-band__commitment">
              <p className="quote-band__statement">
                “Every quote we send is a commitment to performance, safety, and reliability to our customers.”
              </p>
            </div>
          </div>
          <div className="quote-band__questions">
            {faqs.map((item, index) => (
              <button
                className={`quote-question${activeFaq === index ? ' is-open' : ''}`}
                key={item.question}
                type="button"
                onClick={() => setActiveFaq(activeFaq === index ? -1 : index)}
                aria-expanded={activeFaq === index}
              >
                <div>
                  <h3>{item.question}</h3>
                  <p>{item.answer}</p>
                </div>
                <ArrowUpRight size={22} aria-hidden="true" />
              </button>
            ))}
          </div>
        </section>
        <div className="home-contact-wrap">
          <section className="home-contact" ref={contactRef} aria-label="Contact Golden Wings">
            <img className="home-contact__seal" src={eagleLogo} alt="" aria-hidden="true" />
            <div className="home-contact__copy">
              <p>Ready for a faster quote?</p>
              <h2>Send your aircraft parts request.</h2>
              <span>Doral, Florida</span>
            </div>
            <form className="home-contact__form" onSubmit={handleHomeContactSubmit}>
              <label>
                Name
                <input type="text" name="name" autoComplete="name" value={contactForm.name} onChange={handleHomeContactChange} required />
              </label>
              <label>
                Email
                <input type="email" name="email" autoComplete="email" value={contactForm.email} onChange={handleHomeContactChange} required />
              </label>
              <label>
                Part number
                <input type="text" name="partNumber" value={contactForm.partNumber} onChange={handleHomeContactChange} />
              </label>
              <label>
                Request
                <textarea name="request" rows="3" value={contactForm.request} onChange={handleHomeContactChange} required />
              </label>
              <button className="button button--light" type="submit" disabled={contactStatus === 'sending'}>
                {contactStatus === 'sending' ? 'Sending...' : 'Send RFQ'}
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>
          </section>
        </div>
      </div>
      {/* Floating cursor tooltip that follows pointer with inertia over partner and parts cards */}
      <div
        className="floating-cursor-tooltip"
        ref={partnerTooltipRef}
        aria-hidden="true"
      >
        <span className="floating-cursor-tooltip__prefix" ref={tooltipPrefixRef}>
          Explore Fleet
        </span>
        <span className="floating-cursor-tooltip__separator" aria-hidden="true">•</span>
        <span className="floating-cursor-tooltip__brand" ref={tooltipBrandRef} />
        <ArrowUpRight size={16} className="floating-cursor-tooltip__icon" />
      </div>
    </main>
    </>
  )
}

export default Home
