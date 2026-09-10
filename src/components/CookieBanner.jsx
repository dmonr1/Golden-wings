import { useState, useEffect } from 'react'
import { X } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext.jsx'

const STORAGE_KEY = 'gw_cookie_consent'

function CookieBanner() {
  const { t } = useLanguage()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const consent = localStorage.getItem(STORAGE_KEY)
    if (!consent) {
      const timer = setTimeout(() => {
        setIsVisible(true)
      }, 700)
      return () => clearTimeout(timer)
    }
  }, [])

  const handleAccept = () => {
    localStorage.setItem(STORAGE_KEY, 'accepted')
    setIsVisible(false)
  }

  const handleDismiss = () => {
    localStorage.setItem(STORAGE_KEY, 'dismissed')
    setIsVisible(false)
  }

  if (!isVisible) return null

  return (
    <aside className="cookie-banner" aria-label="Cookie Consent Notice">
      <div className="cookie-banner__inner">
        <p className="cookie-banner__text">
          {t('cookieBanner.text')}{' '}
          <a
            href="/legal?tab=cookies"
            target="_blank"
            rel="noopener noreferrer"
            className="cookie-banner__link"
          >
            {t('cookieBanner.policyLink')}
          </a>
          .
        </p>
        <div className="cookie-banner__actions">
          <button
            type="button"
            className="cookie-banner__btn"
            onClick={handleAccept}
          >
            {t('cookieBanner.accept')}
          </button>
          <button
            type="button"
            className="cookie-banner__close"
            onClick={handleDismiss}
            aria-label={t('cookieBanner.dismissAria')}
          >
            <X size={18} aria-hidden="true" />
          </button>
        </div>
      </div>
    </aside>
  )
}

export default CookieBanner
