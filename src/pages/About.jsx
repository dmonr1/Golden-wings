import { useLayoutEffect, useRef } from 'react'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import pavelAliagaImg from '../assets/principals/pavel-aliaga.jpg'
import bislaviaNoriegaImg from '../assets/principals/bislavia-noriega.jpg'
import cockpitImg from '../assets/cockpit.jpg'
import propellerImg from '../assets/propeller.jpg'
import avionicsImg from '../assets/avionics.jpg'
import hotPartsImg from '../assets/hot parts.webp'
import toolingImg from '../assets/tooling.jpg'
import supportingImg from '../assets/supporting.jpg'
import { useLanguage } from '../context/LanguageContext.jsx'

gsap.registerPlugin(ScrollTrigger)

function About() {
  const { t } = useLanguage()
  const pageRef = useRef(null)
  const heroRef = useRef(null)
  const missionRef = useRef(null)
  const principalsRef = useRef(null)

  useLayoutEffect(() => {
    let removeLoaderListener = null

    const ctx = gsap.context(() => {
      // 1. Bespoke Editorial Entrance Animation for Top Hero Section (ABOUT US)
      const aboutWord = heroRef.current?.querySelector('.about-hero__word--about')
      const usWord = heroRef.current?.querySelector('.about-hero__word--us')
      const heroMeta = heroRef.current?.querySelectorAll('.about-hero__kicker, .about-hero__lead')
      const heroImages = heroRef.current?.querySelectorAll('.about-hero__img-card')
      const innerImgs = heroRef.current?.querySelectorAll('.about-hero__img-card img')
      const philBlock = heroRef.current?.querySelector('.about-hero__phil-block')

      // Synchronously set initial hidden state before browser repaints (prevents any FOUC flash)
      if (aboutWord) gsap.set(aboutWord, { opacity: 0, y: -42, scale: 1.05, letterSpacing: '0.01em' })
      if (usWord) gsap.set(usWord, { opacity: 0, x: -48 })
      if (heroMeta && heroMeta.length) gsap.set(heroMeta, { opacity: 0, y: 22 })
      if (heroImages && heroImages.length) {
        gsap.set(heroImages, { opacity: 0, clipPath: 'inset(100% 0% 0% 0%)', scale: 1.05 })
      }
      if (innerImgs && innerImgs.length) gsap.set(innerImgs, { scale: 1.15 })
      if (philBlock) gsap.set(philBlock, { opacity: 0, y: 24 })

      const playEntrance = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        // "ABOUT": Grand editorial masthead stamping from above
        if (aboutWord) {
          tl.to(
            aboutWord,
            { opacity: 1, y: 0, scale: 1, letterSpacing: '-0.035em', duration: 1.0, ease: 'expo.out', clearProps: 'all' },
            0,
          )
        }

        // "US": Precision slide-in from left column margin
        if (usWord) {
          tl.to(
            usWord,
            { opacity: 1, x: 0, duration: 0.85, ease: 'power4.out', clearProps: 'all' },
            0.12,
          )
        }

        // Editorial metadata & description
        if (heroMeta && heroMeta.length) {
          tl.to(
            heroMeta,
            { opacity: 1, y: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out', clearProps: 'all' },
            0.22,
          )
        }

        // Photo Cards: Luxury architectural aperture / clip-path shutter unfold
        if (heroImages && heroImages.length) {
          tl.to(
            heroImages,
            {
              opacity: 1,
              clipPath: 'inset(0% 0% 0% 0%)',
              scale: 1,
              duration: 1.1,
              stagger: 0.16,
              ease: 'power4.inOut',
              clearProps: 'clipPath,transform,opacity',
            },
            0.2,
          )
        }

        if (innerImgs && innerImgs.length) {
          tl.to(
            innerImgs,
            { scale: 1, duration: 1.25, stagger: 0.16, ease: 'power3.out', clearProps: 'transform' },
            0.2,
          )
        }

        // Philosophy block
        if (philBlock) {
          tl.to(
            philBlock,
            { opacity: 1, y: 0, duration: 0.85, ease: 'power3.out', clearProps: 'all' },
            0.45,
          )
        }
      }

      let ran = false
      const safePlay = () => {
        if (ran) return
        ran = true
        playEntrance()
      }

      // Check for page loader
      const isLoaderActive =
        document.querySelector('.page-loader') || document.body.style.position === 'fixed'

      if (isLoaderActive) {
        window.addEventListener('golden-wings:loader-end', safePlay, { once: true })
        const fallbackTimer = setTimeout(safePlay, 3200)
        removeLoaderListener = () => {
          window.removeEventListener('golden-wings:loader-end', safePlay)
          clearTimeout(fallbackTimer)
        }
      } else {
        // Direct route navigation: play immediately without delay
        safePlay()
      }

      // 2. ScrollTrigger for Mission & Vision Split Rows and Values Showcase
      const splitRows = pageRef.current.querySelectorAll('.mv-split-row')
      const valuesCards = pageRef.current.querySelectorAll('.values-card')
      const centerMedia = pageRef.current.querySelector('.values-center-media')

      splitRows.forEach((row) => {
        gsap.fromTo(
          row,
          { opacity: 0, y: 45 },
          {
            opacity: 1,
            y: 0,
            duration: 1.2,
            ease: 'power3.out',
            scrollTrigger: {
              trigger: row,
              start: 'top 85%',
              toggleActions: 'play reverse play reverse',
            },
          }
        )
      })

      if (valuesCards.length > 0 && centerMedia) {
        const vtl = gsap.timeline({
          scrollTrigger: {
            trigger: '.values-stage',
            start: 'top 82%',
            toggleActions: 'play reverse play reverse',
          },
          defaults: { ease: 'power3.out' },
        })

        vtl
          .fromTo(
            centerMedia,
            { opacity: 0, scale: 0.92 },
            { opacity: 1, scale: 1, duration: 1.25 },
            0
          )
          .fromTo(
            valuesCards,
            { opacity: 0, y: 35 },
            { opacity: 1, y: 0, duration: 1.0, stagger: 0.16 },
            0.15
          )
      }

      // 3. ScrollTrigger for MEET THE PRINCIPALS Section
      if (principalsRef.current) {
        const cardEl = principalsRef.current.querySelector('.principals-card')
        const leftPerson = principalsRef.current.querySelector('.principal-col--left')
        const rightPerson = principalsRef.current.querySelector('.principal-col--right')
        const centerCard = principalsRef.current.querySelector('.principals-center')
        const capsules = principalsRef.current.querySelectorAll('.principals-capsule')
        const captions = principalsRef.current.querySelectorAll('.principal-caption')

        const ptl = gsap.timeline({
          scrollTrigger: {
            trigger: principalsRef.current,
            start: 'top 78%',
            toggleActions: 'play reverse play reverse',
          },
          defaults: { ease: 'power3.out' },
        })

        if (cardEl) {
          ptl.fromTo(
            cardEl,
            { opacity: 0, y: 40 },
            { opacity: 1, y: 0, duration: 1.1 },
            0
          )
        }

        if (leftPerson) {
          ptl.fromTo(
            leftPerson,
            { opacity: 0, x: -30 },
            { opacity: 1, x: 0, duration: 0.85 },
            0.15
          )
        }

        if (rightPerson) {
          ptl.fromTo(
            rightPerson,
            { opacity: 0, x: 30 },
            { opacity: 1, x: 0, duration: 0.85 },
            0.15
          )
        }

        if (centerCard) {
          ptl.fromTo(
            centerCard,
            { opacity: 0, y: 20 },
            { opacity: 1, y: 0, duration: 0.8 },
            0.2
          )
        }

        if (capsules && capsules.length > 0) {
          ptl.fromTo(
            capsules,
            { scale: 0.85, opacity: 0 },
            { scale: 1, opacity: 1, duration: 0.55, stagger: 0.08 },
            0.3
          )
        }

        if (captions && captions.length > 0) {
          ptl.fromTo(
            captions,
            { opacity: 0, y: 15 },
            { opacity: 1, y: 0, duration: 0.7, stagger: 0.1 },
            0.35
          )
        }
      }
    }, pageRef)

    return () => {
      removeLoaderListener?.()
      ctx.revert()
    }
  }, [])

  return (
    <main className="about-page" ref={pageRef}>
      {/* =========================================================================
          SECTION 1: HERO HEADER (Matching user reference layout)
          ========================================================================= */}
      <section className="about-hero" ref={heroRef} aria-label="About Golden Wings">
        <div className="about-hero__container">
          {/* Top Row: ABOUT headline spanning naturally */}
          <div className="about-hero__header">
            <h1 className="about-hero__word about-hero__word--about">{t('about.heroAbout', 'ABOUT')}</h1>
          </div>

          {/* 3-Column Grid below ABOUT: Left (US + Info), Center (Main Photo), Right (Secondary Photo + Philosophy) */}
          <div className="about-hero__grid">
            {/* Column 1: Left */}
            <div className="about-hero__col about-hero__col--left">
              <span className="about-hero__word about-hero__word--us">{t('about.heroUs', 'US')}</span>

              <div className="about-hero__meta">
                <span className="about-hero__kicker">{t('about.heroKicker', 'Aviation Aftermarket & Fleet Sourcing')}</span>
                <p className="about-hero__lead">
                  {t('about.heroLead', 'Modern Excellence: Delivering traceable components, rapid AOG logistics, and trusted procurement partnerships for airlines, MROs, and utility operators worldwide.')}
                </p>
              </div>
            </div>

            {/* Column 2: Center (Large Main Image) */}
            <div className="about-hero__col about-hero__col--center">
              <figure className="about-hero__img-card about-hero__img-card--main">
                <img
                  src={cockpitImg}
                  alt="Modern commercial aircraft cockpit flight deck"
                  loading="eager"
                />
              </figure>
            </div>

            {/* Column 3: Right (Secondary Image + Our Philosophy) */}
            <div className="about-hero__col about-hero__col--right">
              <figure className="about-hero__img-card about-hero__img-card--secondary">
                <img
                  src={avionicsImg}
                  alt="Precision avionics and aircraft systems maintenance"
                  loading="eager"
                />
              </figure>

              <div className="about-hero__phil-block">
                <h2 className="about-hero__phil-title">{t('about.philosophyTitle', 'Our Philosophy')}</h2>
                <p className="about-hero__phil-text">
                  {t('about.philosophyText', 'At Golden Wings International, we believe in providing rapid, fully documented aerospace solutions that keep aircraft flying safely and efficiently. Integrity, traceability, and relentless speed are the foundation of everything we do.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2A: OUR MISSION (Paper background, Left Title, Right Content)
          ========================================================================= */}
      <section className="about-mission-section page-section" ref={missionRef} aria-label="Our Mission">
        <div className="about-container">
          <article className="mv-split-row mv-split-row--mission">
            <div className="mv-split-col mv-split-col--title">
              <h2 className="mv-split-heading">{t('about.missionTitle', 'Our Mission')}</h2>
              <p className="mv-split-lead">{t('about.missionLead', 'Precision aerospace sourcing without operational downtime.')}</p>
            </div>
            <div className="mv-split-col mv-split-col--content">
              <p>
                {t('about.missionP1', 'Golden Wings International was founded on a simple but powerful principle: commercial and regional fleet operators should never have to compromise between rapid turnaround speed and absolute technical airworthiness.')}
              </p>
              <p>
                {t('about.missionP2', 'We eliminate supply chain bottlenecks by pairing rigorous FAA 8130-3 and EASA Form 1 traceability with immediate 24/7 AOG dispatch from our strategic Florida logistics facility. Every piece part, rotable, and specialized tooling package we provide is thoroughly verified to keep your aircraft flying safely and efficiently.')}
              </p>
            </div>
          </article>
        </div>
      </section>

      {/* Separator between Mission & Vision Cards */}
      <div className="about-mv-separator" aria-hidden="true">
        <span className="about-mv-separator__line" />
        <span className="about-mv-separator__badge">
          <span className="about-mv-separator__dot" />
        </span>
        <span className="about-mv-separator__line" />
      </div>

      {/* =========================================================================
          SECTION 2B: OUR VISION (Pure White Background, Inverted: Left Content, Right Title)
          ========================================================================= */}
      <section className="about-vision-section page-section" aria-label="Our Vision">
        <div className="about-container">
          <article className="mv-split-row mv-split-row--vision mv-split-row--inverted">
            <div className="mv-split-col mv-split-col--content">
              <p>
                {t('about.visionP1', 'As global aviation infrastructure expands and fleet demands become increasingly dynamic, Golden Wings International is engineering a more connected, responsive aftermarket logistics model.')}
              </p>
              <p>
                {t('about.visionP2', 'We envision an international supply ecosystem where airlines, cargo carriers, and MRO centers access fully documented aviation inventory on-demand—supported by transparent technical pricing, proactive component pooling, and enduring customer alliances built on unwavering trust.')}
              </p>
            </div>
            <div className="mv-split-col mv-split-col--title">
              <h2 className="mv-split-heading">{t('about.visionTitle', 'Our Vision')}</h2>
              <p className="mv-split-lead">{t('about.visionLead', 'The global benchmark in trusted aftermarket aviation logistics.')}</p>
            </div>
          </article>
        </div>
      </section>

      {/* =========================================================================
          SECTION 2C: CORE VALUES (3-Column Showcase with Center Photo)
          ========================================================================= */}
      <section className="about-values-section page-section" aria-label="Our Core Values">
        <div className="about-container">
          <div className="values-showcase">
            <div className="values-header">
              <h2 className="values-heading">{t('about.valuesTitle', 'Our Core Values')}</h2>
              <p className="values-subtitle">
                {t('about.valuesSubtitle', 'The standard of technical excellence and integrity that governs every quotation, parts inspection, and client relationship.')}
              </p>
            </div>

            <div className="values-stage">
              {/* Card 01: Top Left */}
              <div className="values-card values-card--01">
                <span className="values-card__num">01</span>
                <h3 className="values-card__title">{t('about.values.0.title', 'Traceability & Compliance')}</h3>
                <p className="values-card__text">
                  {t('about.values.0.text', 'Every component is delivered with authentic FAA 8130-3 or EASA Form 1 certification, complete non-incident verification, and unbroken chain of custody.')}
                </p>
              </div>

              {/* Card 03: Bottom Left */}
              <div className="values-card values-card--03">
                <span className="values-card__num">03</span>
                <h3 className="values-card__title">{t('about.values.2.title', 'Technical Integrity')}</h3>
                <p className="values-card__text">
                  {t('about.values.2.text', 'Transparent market pricing, certified quality standards, and dependable fulfillment across commercial, regional, and corporate platforms.')}
                </p>
              </div>

              {/* Center Column: Tall Rounded Aircraft Technician / Hangar Image */}
              <div className="values-center-media">
                <img
                  src={supportingImg}
                  alt="Aviation maintenance engineers and technicians servicing commercial aircraft landing gear in hangar"
                  loading="lazy"
                />
              </div>

              {/* Card 02: Top Right */}
              <div className="values-card values-card--02">
                <span className="values-card__num">02</span>
                <h3 className="values-card__title">{t('about.values.1.title', 'AOG Velocity')}</h3>
                <p className="values-card__text">
                  {t('about.values.1.text', 'Urgent aircraft-on-ground response protocol with immediate quoting, rapid warehouse retrieval, and prompt worldwide express dispatch.')}
                </p>
              </div>

              {/* Card 04: Bottom Right */}
              <div className="values-card values-card--04">
                <span className="values-card__num">04</span>
                <h3 className="values-card__title">{t('about.values.3.title', 'Global Sourcing Reach')}</h3>
                <p className="values-card__text">
                  {t('about.values.3.text', 'Direct access to an established international aftermarket network, reliably procuring hard-to-find rotables, avionics, and specialized tooling.')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Separator between Core Values & Meet The Principals */}
      <div className="about-mv-separator" aria-hidden="true">
        <span className="about-mv-separator__line" />
        <span className="about-mv-separator__badge">
          <span className="about-mv-separator__dot" />
        </span>
        <span className="about-mv-separator__line" />
      </div>

      {/* =========================================================================
          SECTION 3: MEET THE PRINCIPALS (Directly matching reference image design)
          ========================================================================= */}
      <section className="principals-section" aria-label="Meet The Principals">
        <div className="about-container">
          <div className="principals-wrapper" ref={principalsRef}>
            {/* The Main Beige Card containing only the portraits and center box */}
            <div className="principals-card">
              {/* Left Principal Photo: Pavel Aliaga */}
              <div className="principal-col principal-col--left">
                <div className="principal-photo-wrap">
                  <img
                    src={pavelAliagaImg}
                    alt="Pavel Aliaga, Founder and CEO of Golden Wings International"
                    className="principal-photo"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Center Area: Title Header, Capsule Details, and Shared Statement */}
              <div className="principals-center">
                <div className="principals-header-box">
                  <h2 className="principals-title">
                    <span>{t('about.principals.meet', 'MEET THE')}</span>
                    <strong>{t('about.principals.title', 'PRINCIPALS')}</strong>
                  </h2>

                  {/* 3 Horizontal Pill / Capsule Detail Photos */}
                  <div className="principals-capsules-wrap">
                    <div className="principals-capsule">
                      <img src={hotPartsImg} alt="Aircraft turbine detail" />
                    </div>
                    <div className="principals-capsule">
                      <img src={propellerImg} alt="Aircraft propeller maintenance" />
                    </div>
                    <div className="principals-capsule">
                      <img src={toolingImg} alt="Aviation tooling calibration" />
                    </div>
                  </div>

                  <p className="principals-statement">
                    {t('about.principals.statement', "As principals and co-owners of Golden Wings International LLC, Pavel Aliaga and Bislavia Noriega Perez lead the company's daily operations, strategic inventory acquisition, and worldwide fleet support, fostering lasting partnerships based on trust, compliance, and excellence.")}
                  </p>
                </div>
              </div>

              {/* Right Principal Photo: Bislavia Noriega Perez */}
              <div className="principal-col principal-col--right">
                <div className="principal-photo-wrap">
                  <img
                    src={bislaviaNoriegaImg}
                    alt="Bislavia Noriega Perez, Co-Owner & Executive Director of Golden Wings International"
                    className="principal-photo"
                    loading="lazy"
                  />
                </div>
              </div>
            </div>

            {/* Captions Underneath the Image/Card on the White Background */}
            <div className="principals-footer">
              <div className="principal-caption principal-caption--left">
                <h3 className="principal-name">Pavel Aliaga</h3>
                <span className="principal-role">{t('about.principals.pavelRole', 'FOUNDER AND CEO')}</span>
              </div>
              <div className="principal-caption principal-caption--right">
                <h3 className="principal-name">Bislavia Noriega Perez</h3>
                <span className="principal-role">{t('about.principals.bislaviaRole', 'CO-OWNER AND EXECUTIVE DIRECTOR')}</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}

export default About
