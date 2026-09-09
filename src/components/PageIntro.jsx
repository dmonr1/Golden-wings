import { useLayoutEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'
import gsap from 'gsap'
import HelicopterAnimation from './HelicopterAnimation.jsx'
import lostDeals from '../assets/lost deals.jpg'

function PageIntro({
  eyebrow,
  title,
  text,
  children,
  graphic,
  theme = 'clouds',
  hideWave = false,
  animationType,
}) {
  const containerRef = useRef(null)
  const eyebrowRef = useRef(null)
  const titleRef = useRef(null)
  const textRef = useRef(null)
  const actionsRef = useRef(null)
  const location = useLocation()

  useLayoutEffect(() => {
    let removeListener = null

    const ctx = gsap.context(() => {
      // Determine distinct animation style per page
      const animMode = animationType || (theme === 'paper' ? 'radar' : theme === 'clean' ? 'dispatch' : 'default')

      // Set initial hidden state synchronously BEFORE browser repaints (prevents any flash of text)
      if (animMode === 'radar') {
        // Catalog style: Aeronautical radar sweep / HUD coordinate lock-in
        if (titleRef.current) {
          gsap.set(titleRef.current, { opacity: 0, x: -48, filter: 'blur(6px)', letterSpacing: '0.05em' })
        }
        if (textRef.current) {
          gsap.set(textRef.current, { opacity: 0, x: -26 })
        }
        if (actionsRef.current) {
          gsap.set(actionsRef.current, { opacity: 0, scale: 0.82 })
        }
        if (eyebrowRef.current) {
          gsap.set(eyebrowRef.current, { opacity: 0, x: -20 })
        }
      } else if (animMode === 'dispatch') {
        // Contact style: Tactical comms uplink connection sequence
        if (eyebrowRef.current) {
          gsap.set(eyebrowRef.current, { opacity: 0, scale: 0.65, x: -14 })
        }
        if (titleRef.current) {
          gsap.set(titleRef.current, { opacity: 0, y: -18, filter: 'blur(5px)' })
        }
        if (textRef.current) {
          gsap.set(textRef.current, { opacity: 0, y: 16 })
        }
        if (actionsRef.current) {
          gsap.set(actionsRef.current, { opacity: 0, y: 16 })
        }
      } else {
        const animElements = [
          eyebrowRef.current,
          titleRef.current,
          textRef.current,
          actionsRef.current,
        ].filter(Boolean)
        if (animElements.length > 0) {
          gsap.set(animElements, { opacity: 0, y: 24 })
        }
      }

      const playAnimation = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        if (animMode === 'radar') {
          // Catalog: Smooth horizontal flight sweep
          if (titleRef.current) {
            tl.to(
              titleRef.current,
              {
                opacity: 1,
                x: 0,
                filter: 'blur(0px)',
                letterSpacing: '-0.025em',
                duration: 0.95,
                ease: 'power4.out',
                clearProps: 'transform,opacity,filter,letterSpacing',
              },
              0,
            )
          }
          if (textRef.current) {
            tl.to(
              textRef.current,
              {
                opacity: 1,
                x: 0,
                duration: 0.8,
                ease: 'power3.out',
                clearProps: 'transform,opacity',
              },
              0.14,
            )
          }
          if (actionsRef.current) {
            tl.to(
              actionsRef.current,
              {
                opacity: 1,
                scale: 1,
                duration: 0.65,
                ease: 'back.out(1.8)',
                clearProps: 'transform,opacity',
              },
              0.26,
            )
          }
        } else if (animMode === 'dispatch') {
          // Contact: Precision tactical uplink
          if (eyebrowRef.current) {
            tl.to(
              eyebrowRef.current,
              {
                opacity: 1,
                scale: 1,
                x: 0,
                duration: 0.55,
                ease: 'back.out(2.2)',
                clearProps: 'all',
              },
              0,
            )
          }
          if (titleRef.current) {
            tl.to(
              titleRef.current,
              {
                opacity: 1,
                y: 0,
                filter: 'blur(0px)',
                duration: 0.72,
                ease: 'power3.out',
                clearProps: 'all',
              },
              0.08,
            )
          }
          if (textRef.current) {
            tl.to(
              textRef.current,
              {
                opacity: 1,
                y: 0,
                duration: 0.65,
                ease: 'power2.out',
                clearProps: 'all',
              },
              0.2,
            )
          }
        } else {
          const animElements = [
            eyebrowRef.current,
            titleRef.current,
            textRef.current,
            actionsRef.current,
          ].filter(Boolean)
          tl.to(animElements, {
            opacity: 1,
            y: 0,
            duration: 0.85,
            stagger: 0.1,
            clearProps: 'transform,opacity',
          })
        }
      }

      // Check if site-wide initial page loader is currently active
      const isLoaderActive =
        document.querySelector('.page-loader') || document.body.style.position === 'fixed'

      if (isLoaderActive) {
        const handleLoaderEnd = () => {
          requestAnimationFrame(() => playAnimation())
        }
        window.addEventListener('golden-wings:loader-end', handleLoaderEnd, { once: true })
        removeListener = () => window.removeEventListener('golden-wings:loader-end', handleLoaderEnd)
      } else {
        // Direct route navigation: play immediately without delay
        playAnimation()
      }

      // Contact Hero Parallax effect (image rises smoothly as user scrolls down)
      if (theme === 'contact-hero') {
        const bgImg = containerRef.current?.querySelector('.page-intro__parallax-img')
        if (bgImg) {
          gsap.to(bgImg, {
            yPercent: -20,
            scale: 1.04,
            ease: 'none',
            scrollTrigger: {
              trigger: containerRef.current,
              start: 'top top',
              end: 'bottom top',
              scrub: 0.35,
            },
          })
        }
      }
    }, containerRef)

    return () => {
      removeListener?.()
      ctx.revert()
    }
  }, [location.pathname, title, animationType, theme])

  return (
    <section className={`page-intro page-intro--${theme}`} ref={containerRef}>
      {/* Contact page background image */}
      {theme === 'contact-hero' && (
        <div className="page-intro__parallax-bg" aria-hidden="true">
          <img src={lostDeals} alt="" className="page-intro__parallax-img" />
        </div>
      )}

      <div className="page-intro__inner">
        <div className="page-intro__content">
          {eyebrow && (
            <p className="eyebrow" ref={eyebrowRef}>
              {eyebrow}
            </p>
          )}
          <h1 ref={titleRef}>{title}</h1>
          {text ? (
            <p className="page-intro__text" ref={textRef}>
              {text}
            </p>
          ) : null}
          {children ? (
            <div className="page-intro__actions" ref={actionsRef}>
              {children}
            </div>
          ) : null}
        </div>

        {graphic === 'helicopter' && (
          <div className="page-intro__graphic-wrap">
            <HelicopterAnimation />
          </div>
        )}
      </div>
      {!hideWave && (
        <div className="page-intro__wave" aria-hidden="true">
          <svg viewBox="0 0 1440 80" fill="none" preserveAspectRatio="none">
            <path
              d="M 0,0 C 440,64 1000,64 1440,0 L 1440,80 L 0,80 Z"
              fill={theme === 'paper' ? 'var(--paper)' : '#ffffff'}
            />
          </svg>
        </div>
      )}
    </section>
  )
}

export default PageIntro
