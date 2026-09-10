import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Home, Search, Compass, ArrowRight } from 'lucide-react'
import eagleLogo from '../assets/laoder/golden-wings-aguila-mundo.svg'
import Airplane404Scene from '../components/Airplane404Scene.jsx'
import { useLanguage } from '../context/LanguageContext.jsx'

function NotFound() {
  const { t } = useLanguage()
  const [query, setQuery] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    window.scrollTo(0, 0)
    document.title = '404 - Part Not Found | Golden Wings International'
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (query.trim()) {
      navigate(`/catalog?search=${encodeURIComponent(query.trim())}`)
    }
  }

  return (
    <main className="not-found-page not-found-page--realistic">
      {/* Background with Animated Stroke-Only Clouds & Centered Realistic Jet */}
      <Airplane404Scene />

      {/* Top Brand Block: Logo with Title Row directly underneath */}
      <header className="not-found__brand-block">
        <Link to="/" className="not-found__logo-link" aria-label={t('notFound.returnHome', 'Return to Home')}>
          <img src={eagleLogo} alt="" className="not-found__logo-img" />
          <div className="not-found__logo-text">
            <span className="not-found__brand-name">GOLDEN WINGS</span>
            <span className="not-found__brand-sub">INTERNATIONAL LLC</span>
          </div>
        </Link>

        {/* Title Row: Giant 404 on the left, headline on the right, directly underneath logo */}
        <div className="not-found__title-row">
          <span className="not-found__giant-code">404</span>
          <div className="not-found__headline-wrap">
            <h1 className="not-found__headline">{t('notFound.headline', 'Part Not Found in Flight Manifest')}</h1>
          </div>
        </div>
      </header>

      {/* Controls Block: Search and CTAs, positioned slightly below vertical center */}
      <section className="not-found__bottom-controls">
        <form className="not-found__search-form" onSubmit={handleSearch}>
          <Search size={16} className="not-found__search-icon" aria-hidden="true" />
          <input
            type="text"
            placeholder={t('notFound.searchPlaceholder', 'Search:  (e.g. 212-040-004-3)')}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label={t('notFound.searchPlaceholder', 'Search aircraft parts inventory')}
          />
          <button type="submit" className="not-found__search-btn" aria-label={t('notFound.findPart', 'Find Part')}>
            <span>{t('notFound.findPart', 'Find Part')}</span>
            <ArrowRight size={14} aria-hidden="true" />
          </button>
        </form>

        <div className="not-found__cta-group">
          <Link to="/" className="not-found__cta not-found__cta--primary">
            <Home size={15} aria-hidden="true" />
            <span>{t('notFound.returnHome', 'Return to Home')}</span>
          </Link>
          <Link to="/catalog" className="not-found__cta not-found__cta--secondary">
            <Compass size={15} aria-hidden="true" />
            <span>{t('notFound.browseCatalog', 'Browse Catalog')}</span>
          </Link>
        </div>
      </section>
    </main>
  )
}

export default NotFound
