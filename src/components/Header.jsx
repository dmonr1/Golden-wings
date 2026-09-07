import { NavLink, useLocation } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { MessageCircle, X } from 'lucide-react'

const links = [
  ['Home', '/'],
  ['Catalog', '/catalog'],
  ['About us', '/about'],
  ['Contact', '/contact'],
]

function Header() {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [isVisible, setIsVisible] = useState(true)
  const location = useLocation()
  const lastScrollYRef = useRef(0)

  // Reset to visible whenever the user navigates between pages
  useEffect(() => {
    setIsVisible(true)
    lastScrollYRef.current = window.scrollY
  }, [location.pathname])

  useEffect(() => {
    lastScrollYRef.current = window.scrollY

    const handleScroll = () => {
      const currentScrollY = window.scrollY

      // Always keep header visible near the top of the page
      if (currentScrollY <= 20) {
        setIsVisible(true)
        lastScrollYRef.current = currentScrollY
        return
      }

      const delta = currentScrollY - lastScrollYRef.current

      // Small threshold to avoid triggering on subpixel/micro-jitters
      if (Math.abs(delta) < 6) {
        return
      }

      if (delta > 0) {
        // Scrolled down -> hide header
        setIsVisible(false)
      } else {
        // Scrolled up -> show header
        setIsVisible(true)
      }

      lastScrollYRef.current = currentScrollY
    }

    const handleWheel = (event) => {
      // If user spins wheel down and we are already below top threshold, hide immediately
      if (event.deltaY > 6 && window.scrollY > 20) {
        setIsVisible(false)
      } else if (event.deltaY < -6) {
        // If user spins wheel up, show immediately
        setIsVisible(true)
      }
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    window.addEventListener('wheel', handleWheel, { passive: true })

    return () => {
      window.removeEventListener('scroll', handleScroll)
      window.removeEventListener('wheel', handleWheel)
    }
  }, [])

  return (
    <>
      <header
        className={`site-header ${!isVisible ? 'site-header--hidden' : ''}`}
        aria-label="Main navigation"
      >
        <nav className="pill-nav">
          {links.map(([label, to]) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) => (isActive ? 'is-active' : undefined)}
            >
              <span className="pill-nav__text">{label}</span>
            </NavLink>
          ))}
        </nav>
      </header>

      <button
        className="chat-fab"
        type="button"
        onClick={() => setIsChatOpen((isOpen) => !isOpen)}
        aria-expanded={isChatOpen}
        aria-controls="golden-wings-chat"
        aria-label={isChatOpen ? 'Close chat' : 'Open chat'}
      >
        {isChatOpen ? <X size={21} aria-hidden="true" /> : <MessageCircle size={21} aria-hidden="true" />}
      </button>
      {isChatOpen && (
        <aside className="chat-flyout" id="golden-wings-chat" aria-label="Golden Wings chat">
          <span>Golden Wings International</span>
          <strong>How can we help?</strong>
          <p>Tell us the part number or sourcing request and our team will reply quickly.</p>
          <a href="mailto:sales@goldenwingsinternational.net?subject=Aircraft%20parts%20request">Start a conversation</a>
        </aside>
      )}
    </>
  )
}

export default Header
