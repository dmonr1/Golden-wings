import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { X, ChevronDown, Menu } from 'lucide-react'
import eagleLogo from '../assets/laoder/golden-wings-aguila-mundo.svg'

const links = [
  ['Home', '/'],
  ['Catalog', '/catalog'],
  ['About us', '/about'],
  ['Contact', '/contact'],
]

function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const [isLoaderFinished, setIsLoaderFinished] = useState(() => {
    if (typeof document === 'undefined') return true
    return !document.querySelector('.page-loader') && document.body.style.position !== 'fixed'
  })
  const location = useLocation()
  const lastScrollYRef = useRef(0)

  useEffect(() => {
    if (isLoaderFinished) return

    const handleLoaderEnd = () => setIsLoaderFinished(true)
    window.addEventListener('golden-wings:loader-end', handleLoaderEnd, { once: true })
    const timeout = setTimeout(handleLoaderEnd, 4500)

    return () => {
      window.removeEventListener('golden-wings:loader-end', handleLoaderEnd)
      clearTimeout(timeout)
    }
  }, [isLoaderFinished])

  // Reset to visible whenever the user navigates
  useEffect(() => {
    setIsVisible(true)
    setIsMobileMenuOpen(false)
    lastScrollYRef.current = window.scrollY
  }, [location.pathname])

  useEffect(() => {
    lastScrollYRef.current = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Always keep header visible near the top of the page
      if (currentScrollY <= 40) {
        setIsVisible(true)
        lastScrollYRef.current = currentScrollY
        return
      }

      const delta = currentScrollY - lastScrollYRef.current

      if (Math.abs(delta) < 8) return

      if (delta > 0) {
        // Scrolled down -> hide header
        setIsVisible(false)
        setIsMobileMenuOpen(false)
      } else {
        // Scrolled up -> show header
        setIsVisible(true)
      }

      lastScrollYRef.current = currentScrollY
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    if (!isMobileMenuOpen) return undefined

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    window.lenis?.stop?.()

    return () => {
      document.body.style.overflow = previousOverflow
      window.lenis?.start?.()
    }
  }, [isMobileMenuOpen])

  return (
    <>
      <div className={`site-header-wrapper ${!isVisible ? 'site-header-wrapper--hidden' : ''}`}>
        {/* TOP UTILITY BAR (Matching reference image 2) */}
        <div className="site-topbar">
          <div className="site-topbar__inner">
            <div className="site-topbar__filler" />
            <div className="site-topbar__promo">
              <span>WE HAVE THE PART YOU ARE LOOKING FOR</span>
            </div>
            <div className="site-topbar__actions">
              <div className="site-topbar__socials" aria-label="Social links">
                <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c5.05-.5 9-4.76 9-9.95z"/></svg>
                </a>
                <a href="https://twitter.com" target="_blank" rel="noreferrer" aria-label="X">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
                </a>
                <a href="https://pinterest.com" target="_blank" rel="noreferrer" aria-label="Pinterest">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12c0 4.24 2.65 7.86 6.44 9.29-.09-.79-.17-2 .03-2.87.19-.79 1.22-5.18 1.22-5.18s-.31-.62-.31-1.54c0-1.45.84-2.53 1.88-2.53.89 0 1.32.67 1.32 1.47 0 .9-.57 2.24-.87 3.49-.25 1.04.52 1.89 1.54 1.89 1.85 0 3.28-1.95 3.28-4.76 0-2.49-1.79-4.23-4.35-4.23-2.96 0-4.7 2.22-4.7 4.51 0 .89.34 1.85.77 2.37.08.1.1.19.07.3-.08.33-.26 1.05-.29 1.19-.05.21-.17.26-.38.16-1.42-.66-2.31-2.72-2.31-4.38 0-3.56 2.59-6.84 7.47-6.84 3.92 0 6.97 2.8 6.97 6.54 0 3.9-2.46 7.04-5.87 7.04-1.15 0-2.23-.6-2.6-1.3l-.71 2.7c-.26 1-.96 2.25-1.43 3.01 1.08.33 2.23.51 3.42.51 5.52 0 10-4.48 10-10S17.52 2 12 2z"/></svg>
                </a>
                <a href="https://linkedin.com" target="_blank" rel="noreferrer" aria-label="LinkedIn">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z"/></svg>
                </a>
                <a href="https://t.me" target="_blank" rel="noreferrer" aria-label="Telegram">
                  <svg viewBox="0 0 24 24" width="13" height="13" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.64 6.8c-.15 1.58-.8 5.42-1.13 7.19-.14.75-.42 1-.68 1.03-.58.05-1.02-.38-1.58-.75-.88-.58-1.38-.94-2.23-1.5-.99-.65-.35-1.01.22-1.59.15-.15 2.71-2.48 2.76-2.69.01-.03.01-.14-.07-.19-.08-.05-.19-.02-.27 0-.12.03-1.99 1.27-5.61 3.72-.53.36-1.01.54-1.44.53-.47-.01-1.38-.27-2.06-.49-.83-.27-1.49-.42-1.43-.88.03-.24.37-.49 1.02-.75 3.99-1.74 6.66-2.88 7.99-3.44 3.81-1.58 4.6-1.86 5.12-1.87.11 0 .37.03.54.17.14.12.18.28.2.45-.02.07-.02.13-.04.22z"/></svg>
                </a>
              </div>
              <div className="site-topbar__sep" />
              <div className="site-topbar__lang" title="Language selection">
                <svg viewBox="0 0 640 480" width="16" height="12" className="site-topbar__flag" aria-hidden="true">
                  <path fill="#aa151b" d="M0 0h640v480H0z"/>
                  <path fill="#f1bf00" d="M0 120h640v240H0z"/>
                </svg>
                <ChevronDown size={13} aria-hidden="true" />
              </div>
            </div>
          </div>
        </div>

        {/* MAIN WHITE HEADER (Matching reference image 1) */}
        <header className="site-header" aria-label="Main navigation">
          <div className="site-header__container">
            {/* LEFT: Logo */}
            <NavLink to="/" className="site-header__logo" aria-label="Golden Wings Home">
              <img src={eagleLogo} alt="" className="site-header__logo-img" />
              <div className="site-header__logo-text">
                <span className="site-header__brand-name">GOLDEN WINGS</span>
                <span className="site-header__brand-sub">INTERNATIONAL LLC</span>
              </div>
            </NavLink>

            {/* CENTER: Navigation Links (Active is solid black box as in reference image) */}
            <nav className="site-header__nav" aria-label="Desktop navigation">
              {links.map(([label, to]) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `site-header__link ${isActive ? 'is-active' : ''}`
                  }
                >
                  <span className="site-header__link-text">{label}</span>
                </NavLink>
              ))}
            </nav>

            {/* RIGHT: Quick Action CTA & Mobile Hamburger */}
            <div className="site-header__right">
              <NavLink to="/contact" className="site-header__quote-btn">
                <span>Request RFQ</span>
              </NavLink>

              <button
                className="site-header__mobile-toggle"
                type="button"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                aria-expanded={isMobileMenuOpen}
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>

          {/* Mobile Navigation Drawer */}
          {isMobileMenuOpen && (
            <div className="site-header__mobile-drawer">
              <button
                type="button"
                className="site-header__mobile-drawer-close"
                onClick={() => setIsMobileMenuOpen(false)}
                aria-label="Close navigation menu"
              >
                <X size={25} />
              </button>
              {links.map(([label, to]) => (
                <NavLink
                  key={to}
                  to={to}
                  className={({ isActive }) =>
                    `site-header__mobile-link ${isActive ? 'is-active' : ''}`
                  }
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {label}
                </NavLink>
              ))}
              <NavLink
                to="/contact"
                className="site-header__mobile-rfq"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Request RFQ
              </NavLink>
            </div>
          )}
        </header>
      </div>
    </>
  )
}

export default Header
