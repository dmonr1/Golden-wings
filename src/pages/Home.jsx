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

gsap.registerPlugin(ScrollTrigger)

const highlights = [
  {
    value: 'FAA/EASA',
    label: 'Traceable components',
    description: 'Documented parts for compliant operations.',
    type: 'text',
  },
  {
    value: 25,
    start: 8,
    suffix: '+',
    label: 'Combined experience',
    description: 'Aftermarket expertise for active fleets.',
    type: 'number',
  },
  {
    value: 100,
    start: 72,
    suffix: 'k+',
    label: 'Product lines managed',
    description: 'Global sourcing for urgent spares.',
    type: 'number',
  },
]

const partners = [
  { name: 'Gulfstream Aerospace', logo: gulfstreamLogo },
  { name: 'Fokker', logo: fokkerLogo },
  { name: 'Embraer', logo: embraerLogo },
  { name: 'De Havilland', logo: deHavillandLogo },
  { name: 'Continental', logo: continentalLogo },
  { name: 'Bell Textron', logo: bellLogo },
  { name: 'Beechcraft', logo: beechcraftLogo },
  { name: 'ATR', logo: atrLogo },
]

const servicesData = [
  {
    number: '01.',
    title: 'Aircraft Spares Support',
    description:
      'We provide aircraft spares support with a focus on Gulfstream, Dassault Falcon, CFM56 material, Sikorsky, Bell helicopter and Airbus helicopter. With our stock located in Florida we are strategically located to attend to your urgent inquiries.',
    caption: 'Detailed view of a classic airplane propeller with visible text under a clear blue sky.',
    image: propellerImg,
    badge: 'Immediate Dispatch • Florida Stock',
    tags: ['Gulfstream', 'Falcon', 'CFM56', 'Sikorsky', 'Bell', 'Airbus'],
    bgTheme: 'spares',
  },
  {
    number: '02.',
    title: 'Tooling',
    description: 'Reliable tooling support for multiple aircraft platforms.',
    items: [
      'Boeing Aircraft Tooling',
      'Airbus Aircraft Tooling',
      'Embraer Aircraft Tooling',
      'Bombardier Aircraft Tooling',
      'Gulfstream Aircraft Tooling',
      'Dassault Falcon Aircraft Tooling',
    ],
    caption: 'Aircraft precision tooling and maintenance in modern aerospace hangar.',
    image: toolingImg,
    badge: 'Multi-Platform Certified',
    tags: ['Boeing Tooling', 'Airbus Tooling', 'Embraer', 'Bombardier', 'Gulfstream'],
    bgTheme: 'tooling',
  },
  {
    number: '03.',
    title: 'Supporting',
    description: 'Ground support equipment and heavy maintenance tooling.',
    items: [
      'APU Tooling',
      'Aircraft Jacks',
      'Landing Gear Tooling',
    ],
    caption: 'Hydraulic aircraft jacks lifting landing gear during heavy maintenance.',
    image: supportingImg,
    badge: 'Ground Support Equipment',
    tags: ['APU Tooling', 'Aircraft Jacks', 'Landing Gear', 'Maintenance GSE'],
    bgTheme: 'supporting',
  },
  {
    number: '04.',
    title: 'Electrical Components',
    description: 'High-grade electrical interconnect and avionics systems for active fleets.',
    items: [
      'Connectors & Accessories',
      'Backshells',
      'Conduit & Wire Protection',
      'Switches',
      'Relays & Contactors',
      'Contacts & Terminals',
      'Cable Assemblies',
      'Harness Components',
      'Circuit Protection',
      'Specialty Electrical Components',
    ],
    caption: 'Inside view of a vintage aircraft cockpit at an airshow, showcasing gauges and controls.',
    image: cockpitImg,
    badge: 'Traceable FAA / EASA Material',
    tags: ['Connectors', 'Backshells', 'Switches', 'Relays', 'Harness'],
    bgTheme: 'electrical',
  },
]

const serviceTiles = [
  { title: 'Avionics', image: avionicsImage, link: '/catalog?category=Avionics' },
  { title: 'Hot Parts', image: hotPartsImage, link: '/catalog?category=Rotables' },
  { title: 'Last Deals', image: lostDealsImage, link: '/catalog' },
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
  const servicesLineRef = useRef(null)
  const partnersSectionRef = useRef(null)
  const categoriesSectionRef = useRef(null)
  const partsTitleRef = useRef(null)
  const partsLineRef = useRef(null)
  const quoteBandRef = useRef(null)
  const contactRef = useRef(null)
  const [activeFaq, setActiveFaq] = useState(0)

  const carouselRef = useRef(null)
  const isDraggingRef = useRef(false)
  const startXRef = useRef(0)
  const scrollLeftRef = useRef(0)

  const handlePointerDown = (e) => {
    if (e.button !== 0) return
    isDraggingRef.current = true
    startXRef.current = e.clientX
    scrollLeftRef.current = carouselRef.current?.scrollLeft || 0
    carouselRef.current?.classList.add('is-dragging')
    carouselRef.current?.setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e) => {
    if (!isDraggingRef.current || !carouselRef.current) return
    const dx = e.clientX - startXRef.current
    carouselRef.current.scrollLeft = scrollLeftRef.current - dx
  }

  const handlePointerUp = (e) => {
    if (!isDraggingRef.current) return
    isDraggingRef.current = false
    carouselRef.current?.classList.remove('is-dragging')
    try {
      carouselRef.current?.releasePointerCapture(e.pointerId)
    } catch {
      // ignore
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

      const indicatorNodes = gsap.utils.toArray('.home-strip > div')
      let canReplayIndicators = true
      let indicatorTween

      indicatorTween = gsap.fromTo(
        indicatorNodes,
        { y: 54, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          stagger: {
            each: 0.12,
            from: 'end',
          },
          ease: 'power3.out',
          paused: true,
        },
      )

      ScrollTrigger.create({
        trigger: stripRef.current,
        start: 'top 78%',
        end: 'bottom top',
        onEnter: () => {
          if (!canReplayIndicators) return
          canReplayIndicators = false
          indicatorTween.restart()
        },
        onEnterBack: () => {
          canReplayIndicators = false
          indicatorTween.progress(1).pause()
        },
        onLeaveBack: () => {
          canReplayIndicators = true
          gsap.set(indicatorNodes, { y: 54, opacity: 0 })
        },
      })

      gsap.set(indicatorNodes, { y: 54, opacity: 0 })

      if (contextCardRef.current && contextSectionRef.current) {
        gsap.fromTo(
          contextCardRef.current,
          {
            y: 50,
            opacity: 0.85,
          },
          {
            y: 0,
            opacity: 1,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: contextSectionRef.current,
              start: 'top 85%',
              end: 'top 35%',
              scrub: 1,
            },
          },
        )
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

      if (servicesLineRef.current && contextSectionRef.current) {
        gsap.fromTo(
          servicesLineRef.current,
          {
            width: '54px',
          },
          {
            width: '100%',
            ease: 'none',
            scrollTrigger: {
              trigger: contextSectionRef.current,
              start: 'top 85%',
              end: 'top 20%',
              scrub: 0.8,
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

      gsap.set('.quote-plane', { x: '-26vw', y: '34vh', rotate: -10, scale: 0.72, opacity: 0 })
      gsap.set('.quote-band__intro', { y: 0 })
      gsap.set('.quote-band__statement', { y: 18, clipPath: 'inset(100% 0 0 0)' })
      const getIntroTopY = () => {
        const intro = quoteBandRef.current?.querySelector('.quote-band__intro')
        if (!intro || !quoteBandRef.current) return -220
        const quoteRect = quoteBandRef.current.getBoundingClientRect()
        const introRect = intro.getBoundingClientRect()
        const quoteStyles = window.getComputedStyle(quoteBandRef.current)
        const topPadding = Number.parseFloat(quoteStyles.paddingTop) || 92
        return -(introRect.top - quoteRect.top - topPadding + 360)
      }

      gsap
        .timeline({
          scrollTrigger: {
            trigger: quoteBandRef.current,
            start: 'top bottom',
            end: 'top top',
            scrub: 0.9,
            invalidateOnRefresh: true,
          },
        })
        .to('.quote-band__intro', { y: () => getIntroTopY() * 0.42, duration: 1, ease: 'none' }, 0)
        .to('.quote-plane', { x: '18vw', y: '2vh', scale: 0.82, opacity: 0.18, duration: 1, ease: 'none' }, 0.14)
        .fromTo(
          '.quote-plane__wind span',
          { scaleX: 0, opacity: 0 },
          { scaleX: 1, opacity: 0.62, stagger: 0.06, duration: 0.44, ease: 'none' },
          0.4,
        )

      gsap
        .timeline({
          scrollTrigger: {
            trigger: quoteBandRef.current,
            start: 'top top',
            end: '+=88%',
            pin: true,
            anticipatePin: 1,
            scrub: 1.1,
            invalidateOnRefresh: true,
          },
        })
        .to('.quote-band__intro', { y: getIntroTopY, duration: 0.78, ease: 'none' }, 0)
        .to('.quote-band__statement', { y: 0, clipPath: 'inset(0% 0 0 0)', duration: 0.32, ease: 'none' }, 0.28)
        .to(
          '.quote-plane',
          { x: '188vw', y: '-172vh', rotate: -10, scale: 1.06, opacity: 0.24, duration: 1, ease: 'none' },
          0,
        )
        .to('.quote-plane', { opacity: 0, duration: 0.1, ease: 'none' }, 0.92)
        .to('.quote-plane__wind span', { opacity: 0, stagger: 0.04, duration: 0.28, ease: 'none' }, 0.62)

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
        indicatorTween?.kill()
      }
    })

    return () => ctx.revert()
  }, [])

  return (
    <main>
      <HeroSlider />
      <div className="home-lift">
        <section className="home-strip" ref={stripRef}>
          {highlights.map((item) => (
            <div className="home-indicator home-indicator--split" key={item.label}>
              <strong
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
              <div className="home-indicator__copy">
                <span>{item.label}</span>
                <p>{item.description}</p>
              </div>
            </div>
          ))}
        </section>
        <section
          className="home-context-section"
          ref={contextSectionRef}
          aria-label="Our services and capabilities"
        >
          <div className="home-services-header">
            <h2 className="home-services-heading" ref={servicesTitleRef}>
              OUR SERVICES
            </h2>
            <div className="home-services-heading__bar" ref={servicesLineRef} aria-hidden="true" />
          </div>

          {/* 4 Separate Draggable Cards Carousel as requested */}
          <div className="services-drag-wrapper" ref={contextCardRef}>

            <div
              className="services-drag-container"
              ref={carouselRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerCancel={handlePointerUp}
            >
              <div className="services-drag-track">
                {servicesData.map((service, index) => (
                  <article className="services-drag-card" key={service.number}>
                    {/* The black card container with title & image design */}
                    <div className="services-card-box">
                      <h3 className="services-card-title">{service.title}</h3>

                      {/* Middle: The Image Design (Alternate between 3D Arc & Scattered Gallery) */}
                      {index % 2 === 0 ? (
                        /* 3D Arched Curved Perspective Gallery */
                        <div className="service-cylinder-stage" aria-hidden="true">
                          <div className="service-cylinder-arc">
                            <div className="cylinder-card cylinder-card--1">
                              <img src={cockpitImg} alt="" />
                            </div>
                            <div className="cylinder-card cylinder-card--2">
                              <img src={propellerImg} alt="" />
                            </div>
                            <div className="cylinder-card cylinder-card--3">
                              <img src={service.image} alt="" />
                            </div>
                            <div className="cylinder-card cylinder-card--4">
                              <img src={supportingImg} alt="" />
                            </div>
                            <div className="cylinder-card cylinder-card--5">
                              <img src={hotPartsImage} alt="" />
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Floating Scattered Photo Gallery with Watermark */
                        <div className="service-scattered-stage" aria-hidden="true">
                          <span className="service-scattered-watermark">
                            {service.title.split(' ')[0].toUpperCase()}
                          </span>
                          <div className="scattered-photo scattered-photo--1">
                            <img src={service.image} alt="" />
                          </div>
                          <div className="scattered-photo scattered-photo--2">
                            <img src={index === 1 ? toolingImg : cockpitImg} alt="" />
                          </div>
                          <div className="scattered-photo scattered-photo--3">
                            <img src={avionicsImage} alt="" />
                          </div>
                          <div className="scattered-photo scattered-photo--4">
                            <img src={lostDealsImage} alt="" />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Outside / below the black card: description and tags (como estaba antes) */}
                    <div className="services-card-info">
                      <p className="services-card-desc">{service.description}</p>
                      {service.tags && (
                        <div className="services-card-tags">
                          {service.tags.map((tag) => (
                            <span key={tag} className="services-card-tag">
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </article>
                ))}
              </div>
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
                  title={`View parts for ${partner.name}`}
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
            <div className="categories-header__bar" ref={partsLineRef} aria-hidden="true" />
          </div>
          <div className="service-strip">
            {serviceTiles.map((item) => (
              <Link
                to={item.link}
                className="service-strip__item"
                key={item.title}
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
            <p className="quote-band__statement">
              Every quote we send is a commitment to performance, safety, and reliability to our customers.
            </p>
            <div className="quote-band__intro">
              <h2>Everything you need to know</h2>
              <p>We are ready for your questions. Send us your request and we will help you move faster.</p>
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
                <ArrowUpRight size={26} aria-hidden="true" />
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
            <form className="home-contact__form" onSubmit={(event) => event.preventDefault()}>
              <label>
                Name
                <input type="text" name="name" autoComplete="name" />
              </label>
              <label>
                Email
                <input type="email" name="email" autoComplete="email" />
              </label>
              <label>
                Part number
                <input type="text" name="partNumber" />
              </label>
              <label>
                Request
                <textarea name="request" rows="3" />
              </label>
              <button className="button button--light" type="submit">
                Send RFQ
                <ArrowRight size={18} aria-hidden="true" />
              </button>
            </form>
          </section>
        </div>
      </div>
    </main>
  )
}

export default Home
