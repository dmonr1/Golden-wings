import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, FileText, Shield, Cookie, Scale } from 'lucide-react'
import eagleLogo from '../assets/laoder/golden-wings-aguila-mundo.svg'
import { useLanguage } from '../context/LanguageContext.jsx'

function Footer() {
  const { t } = useLanguage()

  return (
    <footer className="site-footer" aria-label="Global site footer">
      <div className="site-footer__inner">
        {/* Columns Grid: 4 Balanced Columns */}
        <div className="site-footer__grid">
          {/* Column 1: Brand */}
          <div className="site-footer__col site-footer__col--brand">
            <img src={eagleLogo} alt="Golden Wings International Logo" className="site-footer__logo" />
            <div className="site-footer__brand-details">
              <strong className="site-footer__company">Golden Wings International LLC</strong>
              <div className="site-footer__location-chip">
                <MapPin size={14} aria-hidden="true" />
                <span>{t('footer.address')}</span>
              </div>
            </div>
          </div>

          {/* Column 2: Direct Inquiries */}
          <div className="site-footer__col">
            <h4 className="site-footer__heading">{t('footer.inquiriesTitle')}</h4>
            <div className="site-footer__links-list">
              <a href="mailto:rfq@goldenwings.aero" className="site-footer__link">
                <Mail size={15} aria-hidden="true" />
                <span>rfq@goldenwings.aero</span>
              </a>
              <a href="mailto:sales@goldenwingsinternational.net" className="site-footer__link">
                <Mail size={15} aria-hidden="true" />
                <span>sales@goldenwingsinternational.net</span>
              </a>
              <a href="tel:+17274725655" className="site-footer__link">
                <Phone size={15} aria-hidden="true" />
                <span>+1 (727) 472-5655</span>
              </a>
            </div>
          </div>

          {/* Column 3: Sitemap Navigation */}
          <div className="site-footer__col">
            <h4 className="site-footer__heading">{t('footer.sitemapTitle')}</h4>
            <nav className="site-footer__nav" aria-label="Footer Navigation">
              <Link to="/" className="site-footer__link">{t('footer.links.home')}</Link>
              <Link to="/catalog" className="site-footer__link">{t('footer.links.catalog')}</Link>
              <Link to="/about" className="site-footer__link">{t('footer.links.about')}</Link>
              <Link to="/contact" className="site-footer__link">{t('footer.links.contact')}</Link>
            </nav>
          </div>

          {/* Column 4: Legal & Compliance (Opens in new tab) */}
          <div className="site-footer__col">
            <h4 className="site-footer__heading">{t('footer.legalTitle')}</h4>
            <div className="site-footer__legal-list">
              <a
                href="/legal?tab=terms"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__legal-btn"
              >
                <Scale size={15} className="site-footer__legal-icon" aria-hidden="true" />
                <span>{t('footer.legal.terms')}</span>
              </a>
              <a
                href="/legal?tab=privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__legal-btn"
              >
                <Shield size={15} className="site-footer__legal-icon" aria-hidden="true" />
                <span>{t('footer.legal.privacy')}</span>
              </a>
              <a
                href="/legal?tab=cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__legal-btn"
              >
                <Cookie size={15} className="site-footer__legal-icon" aria-hidden="true" />
                <span>{t('footer.legal.cookies')}</span>
              </a>
              <a
                href="/legal?tab=export"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__legal-btn"
              >
                <FileText size={15} className="site-footer__legal-icon" aria-hidden="true" />
                <span>{t('footer.legal.export')}</span>
              </a>
              <a
                href="/legal?tab=disclaimer"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__legal-btn"
              >
                <FileText size={15} className="site-footer__legal-icon" aria-hidden="true" />
                <span>{t('footer.legal.disclaimer')}</span>
              </a>
            </div>
          </div>
        </div>

        {/* Clean Bottom Bar with Powered by Dmon without duplicate legal links */}
        <div className="site-footer__bottom">
          <div className="site-footer__copyright">
            <span>&copy; {new Date().getFullYear()} Golden Wings International LLC. {t('footer.rights')}</span>
            <span className="site-footer__powered-by">{t('footer.poweredBy')}</span>
          </div>
          <div className="site-footer__bottom-meta">
            <span>{t('footer.metaSub')}</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
