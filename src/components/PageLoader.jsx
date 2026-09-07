import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import loaderOne from '../assets/laoder/loader1.jpg'
import loaderTwo from '../assets/helicoptero.jpg'
import loaderThree from '../assets/laoder/loader3.jpg'
import loaderFour from '../assets/laoder/loader4.jpg'
import eagleLogo from '../assets/laoder/golden-wings-aguila-mundo.svg'

const loaderImages = [
  { src: loaderOne, alt: 'Aircraft detail' },
  { src: loaderTwo, alt: 'Aviation landscape' },
  { src: loaderThree, alt: 'Aircraft parts detail' },
  { src: loaderFour, alt: 'Flight operations' },
]

const BLUE_HOLD = 140
const LOADER_DURATION = 2800
const FIRST_IMAGE_TIMEOUT = 650
const SCROLL_KEYS = new Set([' ', 'ArrowDown', 'ArrowUp', 'PageDown', 'PageUp', 'Home', 'End'])
const SCROLL_STORAGE_PREFIX = 'golden-wings:scroll:'

const getScrollStorageKey = () => `${SCROLL_STORAGE_PREFIX}${window.location.pathname}${window.location.search}`

const readSavedScroll = () => {
  const savedScroll = Number(window.sessionStorage.getItem(getScrollStorageKey()))
  return Number.isFinite(savedScroll) && savedScroll > 0 ? savedScroll : 0
}

function PageLoader() {
  const isLegalRoute = typeof window !== 'undefined' && window.location.pathname.startsWith('/legal')
  if (isLegalRoute) return null

  const [isDone, setIsDone] = useState(false)
  const [isReady, setIsReady] = useState(false)
  const scrollYRef = useRef(0)
  const unlockedRef = useRef(false)

  useLayoutEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual'
    scrollYRef.current = Math.max(window.scrollY, readSavedScroll())
    if (scrollYRef.current > 0) window.scrollTo(0, scrollYRef.current)
  }, [])

  useEffect(() => {
    const saveScroll = () => {
      window.sessionStorage.setItem(getScrollStorageKey(), String(window.scrollY))
    }

    window.addEventListener('scroll', saveScroll, { passive: true })
    window.addEventListener('pagehide', saveScroll)
    window.addEventListener('beforeunload', saveScroll)

    return () => {
      saveScroll()
      window.removeEventListener('scroll', saveScroll)
      window.removeEventListener('pagehide', saveScroll)
      window.removeEventListener('beforeunload', saveScroll)
    }
  }, [])

  useEffect(() => {
    scrollYRef.current = Math.max(scrollYRef.current, window.scrollY, readSavedScroll())
    unlockedRef.current = false
    const previousStyles = {
      htmlScrollBehavior: document.documentElement.style.scrollBehavior,
      htmlOverflowY: document.documentElement.style.overflowY,
      bodyOverflowY: document.body.style.overflowY,
      bodyOverscroll: document.body.style.overscrollBehavior,
    }

    document.documentElement.style.scrollBehavior = 'auto'
    if (scrollYRef.current > 0) window.scrollTo(0, scrollYRef.current)
    document.documentElement.style.overflowY = 'scroll'
    document.body.style.overflowY = 'hidden'
    document.body.style.overscrollBehavior = 'none'
    window.dispatchEvent(new Event('golden-wings:loader-start'))

    const restoreScroll = () => {
      if (window.scrollY !== scrollYRef.current) window.scrollTo(0, scrollYRef.current)
    }

    const blockScroll = (event) => {
      event.preventDefault()
      restoreScroll()
    }

    const blockScrollKeys = (event) => {
      if (!SCROLL_KEYS.has(event.key)) return
      event.preventDefault()
      restoreScroll()
    }

    window.addEventListener('wheel', blockScroll, { passive: false, capture: true })
    window.addEventListener('touchmove', blockScroll, { passive: false, capture: true })
    window.addEventListener('keydown', blockScrollKeys, true)
    window.addEventListener('scroll', restoreScroll, true)
    document.addEventListener('wheel', blockScroll, { passive: false, capture: true })
    document.addEventListener('touchmove', blockScroll, { passive: false, capture: true })

    let finish
    let hold
    const keepPosition = window.setInterval(restoreScroll, 40)

    const removeScrollLock = () => {
      window.removeEventListener('wheel', blockScroll, true)
      window.removeEventListener('touchmove', blockScroll, true)
      window.removeEventListener('keydown', blockScrollKeys, true)
      window.removeEventListener('scroll', restoreScroll, true)
      document.removeEventListener('wheel', blockScroll, true)
      document.removeEventListener('touchmove', blockScroll, true)
      window.clearTimeout(hold)
      window.clearTimeout(finish)
      window.clearInterval(keepPosition)
    }

    const unlock = () => {
      if (unlockedRef.current) return
      unlockedRef.current = true
      removeScrollLock()
      document.documentElement.style.scrollBehavior = previousStyles.htmlScrollBehavior
      document.documentElement.style.overflowY = previousStyles.htmlOverflowY
      document.body.style.overflowY = previousStyles.bodyOverflowY
      document.body.style.overscrollBehavior = previousStyles.bodyOverscroll
      window.scrollTo(0, scrollYRef.current)
      requestAnimationFrame(() => {
        window.scrollTo(0, scrollYRef.current)
        requestAnimationFrame(() => window.scrollTo(0, scrollYRef.current))
      })
    }

    const blueHold = new Promise((resolve) => {
      hold = window.setTimeout(resolve, BLUE_HOLD)
    })
    const preloadImage = (src) =>
      new Promise((resolve) => {
        const image = new Image()
        image.onload = () => {
          if (!image.decode) {
            resolve()
            return
          }
          image.decode().catch(() => {}).finally(resolve)
        }
        image.onerror = resolve
        image.src = src
      })

    loaderImages.slice(1).forEach(({ src }) => preloadImage(src))

    const firstImageReady = Promise.race([
      preloadImage(loaderImages[0].src),
      new Promise((resolve) => window.setTimeout(resolve, FIRST_IMAGE_TIMEOUT)),
    ])

    Promise.all([blueHold, firstImageReady]).then(() => {
      if (unlockedRef.current) return
      setIsReady(true)
      finish = window.setTimeout(() => {
        unlock()
        setIsDone(true)
        requestAnimationFrame(() => {
          requestAnimationFrame(() => window.dispatchEvent(new Event('golden-wings:loader-end')))
        })
      }, LOADER_DURATION)
    })

    return () => {
      unlock()
    }
  }, [])

  if (isDone) return null

  return (
    <div className={`page-loader${isReady ? ' page-loader--ready' : ''}`} aria-label="Loading Golden Wings" role="status">
      <div className="page-loader__stack">
        {loaderImages.map((image, index) => (
          <figure className={`page-loader__card page-loader__card--${index + 1}`} key={image.src}>
            <img
              src={image.src}
              alt={image.alt}
              loading="eager"
              decoding="async"
              fetchPriority={index === 0 ? 'high' : 'low'}
            />
          </figure>
        ))}
      </div>
      <div className="page-loader__phase-two" aria-hidden="true">
        <div
          className="page-loader__logo-mask"
          style={{
            maskImage: `url(${eagleLogo})`,
            WebkitMaskImage: `url(${eagleLogo})`,
          }}
        >
          {loaderImages.map((image, index) => (
            <span
              className={`page-loader__logo-frame page-loader__logo-frame--${index + 1}`}
              key={`logo-${image.src}`}
              style={{ backgroundImage: `url(${image.src})` }}
            />
          ))}
        </div>
        <img className="page-loader__logo-gold" src={eagleLogo} alt="" />
      </div>
    </div>
  )
}

export default PageLoader
