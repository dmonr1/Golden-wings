import { useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { useLanguage } from '../context/LanguageContext.jsx'

function PartCard({ item, onImageClick }) {
  const { t, isSpanish } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopyPart = (e) => {
    e.preventDefault()
    e.stopPropagation()
    navigator.clipboard?.writeText(item.partNumber)
    setCopied(true)
    setTimeout(() => setCopied(false), 1800)
  }

  const isGoldenWings = item.company === 'Golden Wings'
  const isConsultar =
    item.price.toLowerCase().includes('consultar') ||
    item.price.toLowerCase().includes('inquire') ||
    item.price.toLowerCase().includes('tba')

  const quoteSubject = encodeURIComponent(`RFQ: Part Number ${item.partNumber} - ${item.description}`)
  const quoteBody = encodeURIComponent(
    `Dear ${item.company} Sales Team,\n\n` +
      `I would like to request an official RFQ and current availability for the following component:\n` +
      `• Part Number: ${item.partNumber}\n` +
      `• Description: ${item.description}\n` +
      `• Fleet / Application: ${item.fleet}\n` +
      `• Condition: ${item.condition}\n` +
      `• Quantity: ${item.quantity !== 'N/D' && item.quantity !== 'In Stock' ? item.quantity : '1'}\n\n` +
      `Please provide lead time, pricing, and FAA 8130-3 / EASA Form 1 documentation details.\n\n` +
      `Best regards,\n`,
  )

  const emailTarget = isGoldenWings
    ? 'sales@goldenwingsinternational.net'
    : 'parts@crossborderaviation.com'

  return (
    <article className="part-card" id={`part-${item.partNumber.replace(/[^a-zA-Z0-9]/g, '-')}`}>
      {/* Left Media: Dedicated photo container with full component visibility */}
      <div className="part-card__media">
        <button
          type="button"
          className="part-card__image-button"
          onClick={() => onImageClick?.()}
          aria-label={`${t('partCard.viewDetails')} - ${item.partNumber}`}
        >
          <img
            src={item.image}
            alt={`${item.description} - ${item.partNumber}`}
            loading="lazy"
            className="part-card__img"
          />
        </button>

        {/* Floating Condition Badge */}
        <div className="part-card__badges">
          <span className="part-card__badge-condition">
            {item.condition !== 'N/D' ? item.condition : t('common.certOnRequest')}
          </span>
        </div>
      </div>

      {/* Right Specifications & Actions */}
      <div className="part-card__body">
        {/* Part Number & One-Click Copy */}
        <div className="part-card__pn-row">
          <div className="part-card__pn-block">
            <span className="part-card__pn-label">{t('partCard.pnLabel')}</span>
            <span className="part-card__pn-code">{item.partNumber}</span>
          </div>
          <button
            type="button"
            className={`part-card__copy-btn ${copied ? 'is-copied' : ''}`}
            onClick={handleCopyPart}
            title={copied ? t('partCard.copied') : t('partCard.copy')}
            aria-label={`${t('partCard.copy')} ${item.partNumber}`}
          >
            {copied ? <Check size={13} aria-hidden="true" /> : <Copy size={13} aria-hidden="true" />}
            <span>{copied ? t('partCard.copied') : t('partCard.copy')}</span>
          </button>
        </div>

        {/* Title Description */}
        <h3 className="part-card__title" title={item.description}>
          {item.description}
        </h3>

        {/* Specifications: Clean list directly in card body without enclosing box */}
        <div className="part-card__specs-list">
          <div className="part-card__spec-row">
            <span className="part-card__spec-label">{t('partCard.fleetLabel')}</span>
            <span className="part-card__spec-value" title={item.fleet}>
              {item.fleet}
            </span>
          </div>

          <div className="part-card__spec-row">
            <span className="part-card__spec-label">{t('partCard.conditionLabel')}</span>
            <span className="part-card__spec-value" title={item.conditionLabel || item.condition}>
              {item.conditionLabel || item.condition}
            </span>
          </div>

          <div className="part-card__spec-row">
            <span className="part-card__spec-label">{t('partCard.qtyLabel')}</span>
            <span className="part-card__spec-value">
              {item.quantity !== 'N/D'
                ? item.quantity === 'In Stock'
                  ? t('common.inStock')
                  : `${item.quantity} ${item.quantity === '1' ? (isSpanish ? 'unidad' : 'unit') : (isSpanish ? 'unidades' : 'units')}`
                : isSpanish ? 'Confirmar a Solicitud' : 'Confirm on Request'}
            </span>
          </div>

          <div className="part-card__spec-row part-card__spec-row--price">
            <span className="part-card__spec-label">{t('partCard.priceLabel')}</span>
            <span className={`part-card__price ${isConsultar ? 'is-consult' : 'is-fixed'}`}>
              {isConsultar ? t('common.inquirePrice') : item.price}
            </span>
          </div>
        </div>

        {/* Action Button */}
        <div className="part-card__actions">
          <a
            href={`mailto:${emailTarget}?subject=${quoteSubject}&body=${quoteBody}`}
            className="part-card__cta"
          >
            <span>{t('partCard.rfqBtn')}</span>
            <ArrowUpRight size={16} aria-hidden="true" />
          </a>
        </div>
      </div>
    </article>
  )
}

export default PartCard
