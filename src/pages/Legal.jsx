import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import eagleLogo from '../assets/laoder/golden-wings-aguila-mundo.svg'

const TABS = [
  { id: 'terms', label: 'Terms of Use' },
  { id: 'privacy', label: 'Privacy Statement' },
  { id: 'cookies', label: 'Cookies' },
  { id: 'export', label: 'Export Control (ITAR/EAR)' },
  { id: 'disclaimer', label: 'OEM & Traceability' }
]

function Legal() {
  const [searchParams, setSearchParams] = useSearchParams()
  const activeTab = searchParams.get('tab') || 'cookies'
  const tabsNavRef = useRef(null)
  const tabButtonRefs = useRef({})
  const [indicatorStyle, setIndicatorStyle] = useState({ left: 0, width: 0 })

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [activeTab])

  useLayoutEffect(() => {
    const updateIndicator = () => {
      const nav = tabsNavRef.current
      const activeButton = tabButtonRefs.current[activeTab]
      if (!nav || !activeButton) return

      const navRect = nav.getBoundingClientRect()
      const buttonRect = activeButton.getBoundingClientRect()
      setIndicatorStyle({
        left: buttonRect.left - navRect.left + nav.scrollLeft,
        width: buttonRect.width,
      })
    }

    updateIndicator()
    window.addEventListener('resize', updateIndicator)
    return () => window.removeEventListener('resize', updateIndicator)
  }, [activeTab])

  const setTab = (tabId) => {
    setSearchParams({ tab: tabId })
  }

  return (
    <div className="legal-page">
      <img
        className="legal-page__watermark"
        src={eagleLogo}
        alt=""
        aria-hidden="true"
      />

      {/* Top minimal header bar */}
      <div className="legal-page__topbar">
        <div className="legal-page__topbar-inner">
          <Link to="/" className="legal-page__back-link">
            <ArrowLeft size={16} aria-hidden="true" />
            <span>Back to main site</span>
          </Link>
          <span className="legal-page__company-pill">Golden Wings International LLC</span>
        </div>
      </div>

      <div className="legal-page__wrapper">
        {/* Hero Header */}
        <header className="legal-page__header">
          <h1 className="legal-page__main-title">LEGAL</h1>
          <div className="legal-page__tabs-bar">
            <nav ref={tabsNavRef} className="legal-page__tabs-nav" aria-label="Legal navigation">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  type="button"
                  ref={(node) => {
                    tabButtonRefs.current[tab.id] = node
                  }}
                  className={`legal-page__tab-btn ${activeTab === tab.id ? 'is-active' : ''}`}
                  onClick={() => setTab(tab.id)}
                >
                  {tab.label}
                </button>
              ))}
              <span
                className="legal-page__tab-indicator"
                aria-hidden="true"
                style={{ left: `${indicatorStyle.left}px`, width: `${indicatorStyle.width}px` }}
              />
            </nav>
          </div>
        </header>

        {/* Main Legal Content Container */}
        <main className="legal-page__content">
        {/* TAB: COOKIES */}
        {activeTab === 'cookies' && (
          <article className="legal-page__article">
            <h2 className="legal-page__article-title">
              How Golden Wings International Uses Cookies and Similar Technologies
            </h2>
            <p className="legal-page__lead">
              GOLDEN WINGS INTERNATIONAL LLC, a company organized and existing under the laws of Florida, United States, located at 1782 NW 82nd Ave, Doral, FL 33126 (hereinafter, &quot;Golden Wings&quot;, &quot;we&quot;, &quot;us&quot;, and &quot;our&quot;) uses cookies and similar tracking technologies as explained below in connection with our digital platforms and aerospace parts requisition systems.
            </p>

            <section className="legal-page__section">
              <h3>What are cookies and similar technologies?</h3>
              <p>
                A cookie is a small text file stored by a web server on your computer or mobile device. The contents of a cookie can only be retrieved and read by the server that created it. Cookies are unique to the browser or mobile application you are using, typically containing identifiers, site names, and alphanumeric strings.
              </p>
              <p>
                Similar to cookies, local shared objects (such as HTML5 local storage) store information directly on your device to persist your session settings, search filters, and catalog navigation preferences.
              </p>
              <p>
                We also employ lightweight web beacons and performance tags to verify page rendering latency, assess asset delivery speeds, and ensure seamless logistics communications for commercial operators and repair stations.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>Categories of Cookies We Use</h3>
              <p>
                Below is a summary of the categories of cookies utilized across our digital aerospace portals:
              </p>
              <div className="legal-page__table-wrapper">
                <table className="legal-page__table">
                  <thead>
                    <tr>
                      <th scope="col">Cookie Category</th>
                      <th scope="col">Purpose &amp; Operational Scope</th>
                      <th scope="col">Typical Duration</th>
                      <th scope="col">Type / Provider</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><strong>Strictly Necessary</strong></td>
                      <td>Essential for core platform functionality, secure inventory browsing, RFQ transmission, and protection against unauthorized automated access (CSRF mitigation).</td>
                      <td>Session / 1 Year</td>
                      <td>First-Party (Golden Wings)</td>
                    </tr>
                    <tr>
                      <td><strong>Preferences &amp; Settings</strong></td>
                      <td>Maintains custom user preferences such as preferred language, unit representations, display density, and cookie consent status.</td>
                      <td>6 to 12 Months</td>
                      <td>First-Party (Golden Wings)</td>
                    </tr>
                    <tr>
                      <td><strong>Analytics &amp; Performance</strong></td>
                      <td>Collects aggregated, de-identified telemetry regarding server response times, search queries, and navigation flow to optimize inventory query responsiveness.</td>
                      <td>Up to 24 Months</td>
                      <td>First-Party &amp; Performance Telemetry</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </section>

            <section className="legal-page__section">
              <h3>How to manage and disable cookies</h3>
              <p>
                You may customize or withdraw your cookie preferences at any time using our cookie consent banner, or by configuring your web browser settings (Google Chrome, Apple Safari, Mozilla Firefox, Microsoft Edge). Please note that disabling strictly necessary cookies may restrict catalog filter responsiveness or RFQ submission functionality.
              </p>
            </section>
          </article>
        )}

        {/* TAB: TERMS OF USE */}
        {activeTab === 'terms' && (
          <article className="legal-page__article">
            <h2 className="legal-page__article-title">
              General Terms &amp; Conditions of Sale and Supply
            </h2>
            <p className="legal-page__lead">
              These General Terms and Conditions formally govern all quotations, purchase orders, sales agreements, and deliveries executed by Golden Wings International LLC for commercial and military aircraft piece parts, rotables, avionics, and ground support equipment.
            </p>

            <section className="legal-page__section">
              <h3>1. Quotation &amp; Pricing Validity</h3>
              <p>
                All formal written quotations issued by Golden Wings International LLC (&quot;Seller&quot;) remain valid for thirty (30) calendar days from the date of quotation issuance, unless expressly agreed otherwise in writing. Prices are quoted Ex-Works (EXW) Doral, Florida (Incoterms 2020), exclusive of outbound freight, transit insurance, import tariffs, customs duties, and local taxes.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>2. Purchase Orders &amp; Contract Formation</h3>
              <p>
                Purchase orders submitted by Buyer become binding only upon Seller&apos;s written order acknowledgement or physical dispatch of material. Seller expressly reserves the right to decline or adjust orders resulting from uncommitted inventory variances, manufacturer lead-time revisions, or applicable trade compliance limitations.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>3. Material Inspection &amp; Return Material Authorization (RMA)</h3>
              <p>
                Delivered materials must be inspected by Buyer within thirty (30) calendar days of physical receipt. In the event of documented discrepancy or non-conformance, a formal RMA request must be approved in writing prior to return shipment. Returned components must retain original manufacturer packaging, intact tamper seals, and all associated airworthiness traceability certificates.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>4. Risk of Loss &amp; Title Transfer</h3>
              <p>
                Risk of loss or damage transfers irrevocably to Buyer upon delivery of items to the nominated freight forwarder or common carrier at our Doral, Florida logistics depot. Legal title transfers exclusively upon full and cleared receipt of all invoiced payments.
              </p>
            </section>
          </article>
        )}

        {/* TAB: PRIVACY STATEMENT */}
        {activeTab === 'privacy' && (
          <article className="legal-page__article">
            <h2 className="legal-page__article-title">
              Privacy &amp; Commercial Data Protection Statement
            </h2>
            <p className="legal-page__lead">
              Golden Wings International LLC is committed to maintaining the utmost discretion, confidentiality, and security of corporate, technical, and operational procurement records entrusted to us by airlines, MROs, and aviation operators worldwide.
            </p>

            <section className="legal-page__section">
              <h3>1. Information We Collect</h3>
              <p>
                We collect only the business data necessary to fulfill commercial aviation transactions: corporate identity, procurement officer credentials, delivery destinations, registered aircraft tail numbers, part requisition numbers, and payment details.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>2. RFQ Commercial Confidentiality</h3>
              <p>
                All Requests for Quotation (RFQs), part numbers, engineering tolerances, and commercial pricing structures are treated as strictly proprietary trade secrets. Golden Wings International does not sell, license, or disclose customer requisition data to unauthorized third parties or marketing brokers.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>3. Technical Security Protocols</h3>
              <p>
                Our digital infrastructure employs modern Transport Layer Security (TLS 1.3) cryptographic protocols with high-grade key exchanges, access-controlled databases, and routine audits to safeguard critical supply chain communications.
              </p>
            </section>
          </article>
        )}

        {/* TAB: EXPORT CONTROL */}
        {activeTab === 'export' && (
          <article className="legal-page__article">
            <h2 className="legal-page__article-title">
              Export Control &amp; ITAR / EAR Trade Compliance Policy
            </h2>
            <p className="legal-page__lead">
              Our global supply operations operate in rigorous compliance with the federal statutory export control frameworks established by the United States Department of State and Department of Commerce.
            </p>

            <section className="legal-page__section">
              <h3>1. Adherence to U.S. Federal Export Regulations</h3>
              <p>
                Aerospace parts, rotables, avionics, instruments, and associated technical documentation supplied by Golden Wings International LLC may be subject to the Export Administration Regulations (EAR 15 CFR 730-774) administered by the Bureau of Industry and Security (BIS) or the International Traffic in Arms Regulations (ITAR 22 CFR 120-130) administered by the Directorate of Defense Trade Controls (DDTC).
              </p>
            </section>

            <section className="legal-page__section">
              <h3>2. Destination Due Diligence &amp; Sanctions Screening</h3>
              <p>
                Buyer agrees and covenants that procured items will not be diverted, transshipped, or re-exported to sanctioned destinations, embargoed regimes, entities listed on the U.S. Office of Foreign Assets Control (OFAC) Specially Designated Nationals list, or parties on the Denied Persons List without prior written authorization from the U.S. Government.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>3. Certified End-User Statements (BIS-711 / DSP-83)</h3>
              <p>
                Where mandated by export licensing parameters, Buyer must furnish a certified End-User Statement (Form BIS-711, DSP-83, or certified company declaration) detailing ultimate consignee identity, aircraft tail number, and civilian or defense end-use before material release.
              </p>
            </section>
          </article>
        )}

        {/* TAB: OEM & TRACEABILITY */}
        {activeTab === 'disclaimer' && (
          <article className="legal-page__article">
            <h2 className="legal-page__article-title">
              OEM Non-Affiliation Disclaimer &amp; Quality Traceability
            </h2>
            <p className="legal-page__lead">
              Formal legal statement regarding independent aftermarket status, trademark notices, and regulatory airworthiness traceability standards.
            </p>

            <section className="legal-page__section">
              <h3>1. Independent Aftermarket Distributor Notice</h3>
              <p>
                Golden Wings International LLC is an independent aircraft parts distributor and aftermarket supplier. Unless explicitly stated in writing, Golden Wings International is not an authorized franchisee, direct representative, or affiliate of the aircraft original equipment manufacturers (OEMs) referenced on this platform.
              </p>
              <p>
                All manufacturer names, corporate logos, and model designations (including but not limited to Boeing, Airbus, Bell Textron, Sikorsky, Pratt &amp; Whitney, Honeywell, Collins Aerospace, and GE Aviation) are registered trademarks of their respective owners. Their mention on this website is strictly for identification, reference, and parts compatibility verification.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>2. FAA 8130-3, EASA Form 1 &amp; Certificate of Conformance</h3>
              <p>
                All serialized rotables and piece parts supplied are delivered with regulatory authorized release documentation, which may include FAA Form 8130-3, EASA Form 1, dual-release certificates, OEM Certificates of Conformance (C of C), and certified non-incident statements ensuring uninterrupted chain of custody.
              </p>
            </section>

            <section className="legal-page__section">
              <h3>3. Seven-Year Records Archival</h3>
              <p>
                In compliance with FAA Advisory Circular AC 00-56 and ISO aerospace quality standards, receiving inspection logs, physical records, and airworthiness certificates are maintained on file for a minimum retention window of seven (7) years.
              </p>
            </section>
          </article>
        )}
      </main>
      </div>

      {/* Clean Legal Footer */}
      <footer className="legal-page__footer">
        <div className="legal-page__footer-inner">
          <span>&copy; {new Date().getFullYear()} Golden Wings International LLC. All rights reserved. | Powered by Dmon</span>
          <div className="legal-page__footer-links">
            <button type="button" onClick={() => setTab('terms')}>Terms of Use</button>
            <span>&bull;</span>
            <button type="button" onClick={() => setTab('privacy')}>Privacy</button>
            <span>&bull;</span>
            <button type="button" onClick={() => setTab('cookies')}>Cookies</button>
            <span>&bull;</span>
            <button type="button" onClick={() => setTab('export')}>ITAR/EAR</button>
            <span>&bull;</span>
            <button type="button" onClick={() => setTab('disclaimer')}>OEM Notice</button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Legal
