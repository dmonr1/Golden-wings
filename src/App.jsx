import { Route, Routes, useLocation } from 'react-router-dom'
import { useEffect, useRef } from 'react'
import Lenis from 'lenis'
import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import Header from './components/Header.jsx'
import Footer from './components/Footer.jsx'
import PageLoader from './components/PageLoader.jsx'
import Home from './pages/Home.jsx'
import Catalog from './pages/Catalog.jsx'
import About from './pages/About.jsx'
import Contact from './pages/Contact.jsx'
import Legal from './pages/Legal.jsx'
import CookieBanner from './components/CookieBanner.jsx'
import BackToTop from './components/BackToTop.jsx'
import ChatFlyout from './components/ChatFlyout.jsx'
import './App.css'

gsap.registerPlugin(ScrollTrigger)

function ScrollToTop() {
  const { pathname } = useLocation()
  const firstRender = useRef(true)

  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false
      return
    }

    if (window.lenis) {
      window.lenis.scrollTo(0, { immediate: true })
    }
    window.scrollTo({ top: 0, behavior: 'instant' })
    requestAnimationFrame(() => {
      ScrollTrigger.refresh()
    })
  }, [pathname])

  return null
}

function App() {
  const { pathname } = useLocation()
  const isLegal = pathname.startsWith('/legal')

  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.62,
      smoothWheel: true,
      wheelMultiplier: 0.72,
      touchMultiplier: 1.16,
      easing: (t) => Math.min(1, 1.001 - 2 ** (-10 * t)),
    })
    window.lenis = lenis

    lenis.on('scroll', ScrollTrigger.update)

    const stopSmoothScroll = () => lenis.stop()
    const startSmoothScroll = () => {
      const currentScroll = window.scrollY
      lenis.scrollTo(currentScroll, { immediate: true, force: true })
      lenis.start()
      requestAnimationFrame(() => {
        lenis.scrollTo(window.scrollY, { immediate: true, force: true })
        lenis.resize?.()
        ScrollTrigger.refresh(true)
        requestAnimationFrame(() => {
          lenis.scrollTo(window.scrollY, { immediate: true, force: true })
          ScrollTrigger.refresh(true)
        })
      })
    }

    const update = (time) => {
      lenis.raf(time * 1000)
    }

    gsap.ticker.add(update)
    gsap.ticker.lagSmoothing(0)

    const refreshScroll = () => {
      requestAnimationFrame(() => ScrollTrigger.refresh())
    }

    window.addEventListener('load', refreshScroll)
    window.addEventListener('resize', refreshScroll)
    window.addEventListener('golden-wings:loader-start', stopSmoothScroll)
    window.addEventListener('golden-wings:loader-end', startSmoothScroll)
    document.fonts?.ready?.then(refreshScroll)
    refreshScroll()

    return () => {
      window.lenis = null
      gsap.ticker.remove(update)
      window.removeEventListener('load', refreshScroll)
      window.removeEventListener('resize', refreshScroll)
      window.removeEventListener('golden-wings:loader-start', stopSmoothScroll)
      window.removeEventListener('golden-wings:loader-end', startSmoothScroll)
      lenis.destroy()
    }
  }, [])

  return (
    <>
      <ScrollToTop />
      {!isLegal && <PageLoader />}
      {!isLegal && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/catalog" element={<Catalog />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/legal" element={<Legal />} />
      </Routes>
      {!isLegal && <Footer />}
      {!isLegal && <BackToTop />}
      {!isLegal && <ChatFlyout />}
      <CookieBanner />
    </>
  )
}

export default App
