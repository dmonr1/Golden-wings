import { useState, useLayoutEffect, useRef } from 'react'
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  User,
  Hash,
  FileText,
  CheckCircle2,
  Search,
  ArrowRight,
  ArrowUpRight,
  Briefcase
} from 'lucide-react'
import gsap from 'gsap'
import PageIntro from '../components/PageIntro.jsx'
import { submitContactForm } from '../services/contactForm.js'

function Contact() {
  const layoutRef = useRef(null)
  const entitiesRef = useRef(null)
  const [submitted, setSubmitted] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    partNumber: '',
    request: '',
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)
    setSubmitError('')

    try {
      await submitContactForm(formData)
      setSubmitted(true)
    } catch (error) {
      setSubmitError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  useLayoutEffect(() => {
    let removeListener = null

    const ctx = gsap.context(() => {
      const container = layoutRef.current
      if (!container) return

      const infoCol = container.querySelector('.contact-info-col')
      const formCol = container.querySelector('.contact-form-col')
      const showcaseBoxes = entitiesRef.current ? entitiesRef.current.querySelectorAll('.entity-card-box') : []

      // Initial synchronous hidden state
      if (infoCol) gsap.set(infoCol, { opacity: 0, x: -35 })
      if (formCol) gsap.set(formCol, { opacity: 0, x: 35 })
      if (showcaseBoxes.length > 0) gsap.set(showcaseBoxes, { opacity: 0, y: 35 })

      const playEntrance = () => {
        const tl = gsap.timeline({ defaults: { ease: 'power3.out' } })

        if (infoCol) {
          tl.to(infoCol, { opacity: 1, x: 0, duration: 0.9, clearProps: 'all' }, 0.1)
        }
        if (formCol) {
          tl.to(formCol, { opacity: 1, x: 0, duration: 0.9, clearProps: 'all' }, 0.18)
        }
      }

      const isLoaderActive =
        document.querySelector('.page-loader') || document.body.style.position === 'fixed'

      if (isLoaderActive) {
        const onLoaderEnd = () => requestAnimationFrame(() => playEntrance())
        window.addEventListener('golden-wings:loader-end', onLoaderEnd, { once: true })
        removeListener = () => window.removeEventListener('golden-wings:loader-end', onLoaderEnd)
      } else {
        playEntrance()
      }

      // ScrollTrigger for Entity Card Boxes with replay on scroll
      if (showcaseBoxes.length > 0) {
        showcaseBoxes.forEach((box) => {
          gsap.fromTo(
            box,
            { opacity: 0, y: 45 },
            {
              opacity: 1,
              y: 0,
              duration: 1.15,
              ease: 'power3.out',
              scrollTrigger: {
                trigger: box,
                start: 'top 85%',
                toggleActions: 'play reverse play reverse',
              },
            }
          )
        })
      }
    }, [layoutRef, entitiesRef])

    return () => {
      removeListener?.()
      ctx.revert()
    }
  }, [])

  return (
    <main className="contact-page">
      <PageIntro
        title="Contact Us"
        theme="contact-hero"
        hideWave={true}
      />

      {/* Main 2-Column Contact Section */}
      <section className="contact-main-section" ref={layoutRef}>
        <div className="contact-container">
          <div className="contact-grid">
            {/* LEFT COLUMN: Contact Information */}
            <div className="contact-info-col">
              <h2 className="contact-col-title">Contact information</h2>
              <p className="contact-col-desc">
                We help you find direction, eliminate supply chain friction, and keep your fleet operations moving forward—reliably and compliantly.
              </p>

              <div className="contact-channel-list">
                <a href="tel:+17274725655" className="contact-channel-item">
                  <div className="contact-channel-icon">
                    <Phone size={20} aria-hidden="true" />
                  </div>
                  <span className="contact-channel-text">+1 727 472 5655</span>
                </a>

                <a href="mailto:sales@goldenwingsinternational.net" className="contact-channel-item">
                  <div className="contact-channel-icon">
                    <Mail size={20} aria-hidden="true" />
                  </div>
                  <span className="contact-channel-text">sales@goldenwingsinternational.net</span>
                </a>

                <div className="contact-channel-item">
                  <div className="contact-channel-icon">
                    <MapPin size={20} aria-hidden="true" />
                  </div>
                  <span className="contact-channel-text">1782 NW 82nd Ave, Doral, FL 33126, USA</span>
                </div>

                <div className="contact-channel-item">
                  <div className="contact-channel-icon">
                    <Clock size={20} aria-hidden="true" />
                  </div>
                  <span className="contact-channel-text">Monday – Friday, 8:30 AM – 6:00 PM (EST) • 24/7 AOG Support</span>
                </div>
              </div>

              {/* Interactive Google Map Embed */}
              <div className="contact-map-frame">
                <iframe
                  title="Golden Wings Logistics Hub - Doral, FL"
                  src="https://maps.google.com/maps?q=1782+NW+82nd+Ave,+Doral,+FL+33126&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Map location of Golden Wings in Doral, Florida"
                />
              </div>
            </div>

            {/* RIGHT COLUMN: Send Us a Message */}
            <div className="contact-form-col">
              <div className="contact-form-card">
                <h2 className="contact-col-title">Send Us a Message</h2>
                <p className="contact-col-desc">
                  Fill up the form and our specialized aviation sourcing team will get back to you within 24 hours.
                </p>

                {submitted ? (
                  <div className="contact-form-success">
                    <CheckCircle2 size={42} className="text-emerald-600" />
                    <h3>RFQ Inquiry Sent!</h3>
                    <p>Thank you for reaching out. Our parts specialist has received your requirements and will reply shortly.</p>
                    <button
                      type="button"
                      className="contact-submit-btn contact-submit-btn--reset"
                      onClick={() => {
                        setSubmitted(false)
                        setSubmitError('')
                        setFormData({ name: '', email: '', partNumber: '', request: '' })
                      }}
                    >
                      Send another request
                    </button>
                  </div>
                ) : (
                  <form className="contact-inquiry-form" onSubmit={handleSubmit}>
                    <div className="contact-input-row">
                      <div className="contact-input-field">
                        <label htmlFor="name">Name</label>
                        <div className="contact-input-wrapper">
                          <User size={18} className="contact-field-icon" aria-hidden="true" />
                          <input
                            id="name"
                            name="name"
                            type="text"
                            placeholder="Enter your name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>

                      <div className="contact-input-field">
                        <label htmlFor="email">Email</label>
                        <div className="contact-input-wrapper">
                          <Mail size={18} className="contact-field-icon" aria-hidden="true" />
                          <input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="contact-input-field contact-input-field--full">
                      <label htmlFor="partNumber">Part number</label>
                      <div className="contact-input-wrapper">
                        <Hash size={18} className="contact-field-icon" aria-hidden="true" />
                        <input
                          id="partNumber"
                          name="partNumber"
                          type="text"
                          placeholder="Enter part number (e.g. 204-011-179-003, APT-8-1000)"
                          value={formData.partNumber}
                          onChange={handleChange}
                        />
                      </div>
                    </div>

                    <div className="contact-input-field contact-input-field--full">
                      <label htmlFor="request">Request</label>
                      <textarea
                        id="request"
                        name="request"
                        rows="4"
                        placeholder="Describe your aircraft parts request, target condition (NE, OH, SV), quantity, or fleet requirements . . ."
                        value={formData.request}
                        onChange={handleChange}
                        required
                      />
                    </div>

                    <div className="contact-submit-wrap">
                      {submitError && <p className="contact-form-error" role="alert">{submitError}</p>}
                      <button type="submit" className="contact-submit-btn" disabled={isSubmitting}>
                        <span>{isSubmitting ? 'Sending...' : 'Send RFQ'}</span>
                        <ArrowRight size={18} aria-hidden="true" />
                      </button>
                    </div>
                  </form>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Wave divider transitioning into Regional Locations section */}
        <div className="contact-main-wave" aria-hidden="true">
          <svg viewBox="0 0 1440 60" fill="none" preserveAspectRatio="none">
            <path
              d="M 0,0 C 440,50 1000,50 1440,0 L 1440,60 L 0,60 Z"
              fill="#ffffff"
            />
          </svg>
        </div>
      </section>

      {/* Corporate Entities & Regional Locations Section */}
      <section className="contact-entities-section" ref={entitiesRef} aria-label="Regional Locations">
        {/* Ambient background waves & aerodynamic contours */}
        <div className="entities-bg-waves" aria-hidden="true">
          <svg viewBox="0 0 1440 600" fill="none" preserveAspectRatio="none">
            <path
              d="M-100,200 C320,100 500,380 900,220 C1250,80 1400,350 1600,240"
              stroke="rgba(0, 83, 149, 0.07)"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M-100,280 C360,180 540,460 940,300 C1290,160 1440,430 1640,320"
              stroke="rgba(255, 154, 9, 0.08)"
              strokeWidth="2.5"
              fill="none"
            />
            <path
              d="M-100,360 C400,260 580,540 980,380 C1330,240 1480,510 1680,400"
              stroke="rgba(24, 54, 93, 0.05)"
              strokeWidth="2"
              fill="none"
            />
          </svg>
        </div>

        <div className="contact-container contact-container--wide">
          <div className="entities-header">
            <h2 className="entities-title">Regional Locations</h2>
            <p className="entities-subtitle">
              Authorized commercial subsidiaries and regional corporate offices across Latin America.
            </p>
          </div>

          <div className="entities-showcase-list">
            {/* Entity 1: Golden Wings International Peru S.A.C */}
            <article className="entity-card-box entity-card-box--gw">
              <div className="entity-details-pane">
                <div>
                  <h3 className="entity-showcase-title">Golden Wings International Peru S.A.C</h3>
                  <div className="entity-showcase-meta-group">
                    <div className="entity-info-row">
                      <Briefcase size={16} aria-hidden="true" className="entity-icon" />
                      <span className="entity-address-text">Direct Aviation Sourcing &amp; Customer Support</span>
                    </div>
                    <div className="entity-info-row">
                      <MapPin size={16} aria-hidden="true" className="entity-icon" />
                      <span className="entity-address-text">Mz. K Lt. 21, Grupo 5, Asent. H. Nuevo Progreso, Villa María del Triunfo, Lima, Perú</span>
                    </div>
                    <div className="entity-info-row">
                      <MapPin size={16} aria-hidden="true" className="entity-icon" />
                      <span className="entity-address-text">RUC: 20614040832</span>
                    </div>
                  </div>
                </div>
                <div className="entity-showcase-action">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Villa+Mar%C3%ADa+del+Triunfo+Lima+Peru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="entity-location-btn"
                  >
                    <span>View on Maps</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="entity-map-pane">
                <div className="entity-map-top-bar" aria-hidden="true">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Villa+Mar%C3%ADa+del+Triunfo+Lima+Peru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="entity-map-search-pill"
                    title="Open location in Google Maps"
                  >
                    <Search size={13} className="entity-search-icon" aria-hidden="true" />
                    <span>Villa María del Triunfo, Lima</span>
                    <ArrowUpRight size={12} className="entity-pill-arrow" aria-hidden="true" />
                  </a>
                </div>
                <iframe
                  title="Golden Wings International Peru S.A.C Map Location"
                  src="https://maps.google.com/maps?q=Villa+Mar%C3%ADa+del+Triunfo,+Lima,+Peru&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Map location of Golden Wings Peru in Villa María del Triunfo, Lima"
                />
              </div>
            </article>

            {/* Entity 2: Corporación Alas Doradas EIRL (Inverted) */}
            <article className="entity-card-box entity-card-box--alas entity-card-box--inverted">
              <div className="entity-map-pane">
                <div className="entity-map-top-bar" aria-hidden="true">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Villa+Mar%C3%ADa+del+Triunfo+Lima+Peru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="entity-map-search-pill"
                    title="Open location in Google Maps"
                  >
                    <Search size={13} className="entity-search-icon" aria-hidden="true" />
                    <span>Distrito Villa María del Triunfo, Lima</span>
                    <ArrowUpRight size={12} className="entity-pill-arrow" aria-hidden="true" />
                  </a>
                </div>
                <iframe
                  title="Corporación Alas Doradas EIRL Map Location"
                  src="https://maps.google.com/maps?q=Villa+Mar%C3%ADa+del+Triunfo,+Lima,+Peru&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Map location of Corporación Alas Doradas in Villa María del Triunfo, Lima"
                />
              </div>

              <div className="entity-details-pane">
                <div>
                  <h3 className="entity-showcase-title">Corporación Alas Doradas EIRL</h3>
                  <div className="entity-showcase-meta-group">
                    <div className="entity-info-row">
                      <Briefcase size={16} aria-hidden="true" className="entity-icon" />
                      <span className="entity-address-text">Commercial Representation &amp; Fleet Logistics</span>
                    </div>
                    <div className="entity-info-row">
                      <MapPin size={16} aria-hidden="true" className="entity-icon" />
                      <span className="entity-address-text">Mz. K Lt. 21, Distrito Villa María del Triunfo, Lima, Perú</span>
                    </div>
                    <div className="entity-info-row">
                      <MapPin size={16} aria-hidden="true" className="entity-icon" />
                      <span className="entity-address-text">RUC: 20610972498</span>
                    </div>
                  </div>
                </div>
                <div className="entity-showcase-action">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Villa+Mar%C3%ADa+del+Triunfo+Lima+Peru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="entity-location-btn"
                  >
                    <span>View on Maps</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>
            </article>

            {/* Entity 3: AVIOTERRA EIRL */}
            <article className="entity-card-box entity-card-box--avioterra">
              <div className="entity-details-pane">
                <div>
                  <h3 className="entity-showcase-title">AVIOTERRA EIRL</h3>
                  <div className="entity-showcase-meta-group">
                    <div className="entity-info-row">
                      <Briefcase size={16} aria-hidden="true" className="entity-icon" />
                      <span className="entity-address-text">Technical Services &amp; Sourcing Affiliate</span>
                    </div>
                    <div className="entity-info-row">
                      <MapPin size={16} aria-hidden="true" className="entity-icon" />
                      <span className="entity-address-text">Calle San Martín de Porres 180, Of. 701, San Miguel, Lima, Perú</span>
                    </div>
                    <div className="entity-info-row">
                      <MapPin size={16} aria-hidden="true" className="entity-icon" />
                      <span className="entity-address-text">RUC: 20614032767</span>
                    </div>
                  </div>
                </div>
                <div className="entity-showcase-action">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Calle+San+Martin+de+Porres+180+San+Miguel+Lima+Peru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="entity-location-btn"
                  >
                    <span>View on Maps</span>
                    <ArrowUpRight size={15} aria-hidden="true" />
                  </a>
                </div>
              </div>

              <div className="entity-map-pane">
                <div className="entity-map-top-bar" aria-hidden="true">
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Calle+San+Martin+de+Porres+180+San+Miguel+Lima+Peru"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="entity-map-search-pill"
                    title="Open location in Google Maps"
                  >
                    <Search size={13} className="entity-search-icon" aria-hidden="true" />
                    <span>San Miguel, Lima</span>
                    <ArrowUpRight size={12} className="entity-pill-arrow" aria-hidden="true" />
                  </a>
                </div>
                <iframe
                  title="AVIOTERRA EIRL Map Location"
                  src="https://maps.google.com/maps?q=San+Martin+de+Porres+180,+San+Miguel,+Lima,+Peru&t=&z=14&ie=UTF8&iwloc=&output=embed"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  aria-label="Map location of AVIOTERRA in San Miguel, Lima"
                />
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  )
}

export default Contact
