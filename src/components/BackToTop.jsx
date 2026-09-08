import { useState, useEffect } from 'react'
import { useLocation } from 'react-router-dom'
import { ArrowUp } from 'lucide-react'

export default function BackToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const location = useLocation()

  // Reset visibility immediately on page change
  useEffect(() => {
    setIsVisible(false)
  }, [location.pathname])

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop || 0
      const scrollHeight = document.documentElement.scrollHeight || document.body.scrollHeight || 0
      const clientHeight = window.innerHeight || document.documentElement.clientHeight || 0
      const maxScroll = Math.max(scrollHeight - clientHeight, 0)

      // Activate much further down the page (past screen 2 into screen 3)
      const baseMin = window.innerWidth <= 768 ? 950 : 1300
      const threshold = Math.min(
        Math.max(clientHeight * 1.65, baseMin),
        maxScroll > 0 ? maxScroll * 0.65 : baseMin
      )

      setIsVisible(scrollY > threshold)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll()

    if (window.lenis) {
      window.lenis.on('scroll', handleScroll)
    }

    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (window.lenis) {
        window.lenis.off('scroll', handleScroll)
      }
    }
  }, [location.pathname])

  const scrollToTop = () => {
    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: false })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  }

  return (
    <button
      type="button"
      className={`floating-back-to-top ${isVisible ? 'floating-back-to-top--visible' : ''}`}
      onClick={scrollToTop}
      aria-label="Scroll back to top"
      title="Back to top"
    >
      <ArrowUp size={22} strokeWidth={2.4} aria-hidden="true" />
    </button>
  )
}
