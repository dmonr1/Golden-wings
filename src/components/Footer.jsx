import { Link } from 'react-router-dom'
import { Mail, MapPin, Phone, FileText, Shield, Cookie, Scale } from 'lucide-react'
import eagleLogo from '../assets/laoder/golden-wings-aguila-mundo.svg'

function Footer() {
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
                <span>1782 NW 82nd Ave, Doral, FL 33126, USA</span>
              </div>
            </div>
          </div>

          {/* Column 2: Direct Inquiries */}
          <div className="site-footer__col">
            <h4 className="site-footer__heading">Direct Inquiries</h4>
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
            <h4 className="site-footer__heading">Sitemap</h4>
            <nav className="site-footer__nav" aria-label="Footer Navigation">
              <Link to="/" className="site-footer__link">Home</Link>
              <Link to="/catalog" className="site-footer__link">Parts Catalog</Link>
              <Link to="/about" className="site-footer__link">About Us</Link>
              <Link to="/contact" className="site-footer__link">Contact</Link>
            </nav>
          </div>

          {/* Column 4: Legal & Compliance (Opens in new tab) */}
          <div className="site-footer__col">
            <h4 className="site-footer__heading">Legal &amp; Compliance</h4>
            <div className="site-footer__legal-list">
              <a
                href="/legal?tab=terms"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__legal-btn"
              >
                <Scale size={15} className="site-footer__legal-icon" aria-hidden="true" />
                <span>Terms &amp; Conditions</span>
              </a>
              <a
                href="/legal?tab=privacy"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__legal-btn"
              >
                <Shield size={15} className="site-footer__legal-icon" aria-hidden="true" />
                <span>Privacy Statement</span>
              </a>
              <a
                href="/legal?tab=cookies"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__legal-btn"
              >
                <Cookie size={15} className="site-footer__legal-icon" aria-hidden="true" />
                <span>Cookie Policy</span>
              </a>
              <a
                href="/legal?tab=export"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__legal-btn"
              >
                <FileText size={15} className="site-footer__legal-icon" aria-hidden="true" />
                <span>Export Control (ITAR / EAR)</span>
              </a>
              <a
                href="/legal?tab=disclaimer"
                target="_blank"
                rel="noopener noreferrer"
                className="site-footer__legal-btn"
              >
                <FileText size={15} className="site-footer__legal-icon" aria-hidden="true" />
                <span>OEM &amp; Traceability Notice</span>
              </a>
            </div>
          </div>
        </div>

        {/* Clean Bottom Bar with Powered by Dmon without duplicate legal links */}
        <div className="site-footer__bottom">
          <div className="site-footer__copyright">
            <span>&copy; {new Date().getFullYear()} Golden Wings International LLC. All rights reserved.</span>
            <span className="site-footer__powered-by">Powered by Dmon</span>
          </div>
          <div className="site-footer__bottom-meta">
            <span>Doral, Florida &bull; Global Aviation Logistics</span>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
