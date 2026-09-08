import { useEffect, useState } from 'react'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'

function FeedbackModal({ type = 'success', title, message, onClose }) {
  const [visible, setVisible] = useState(false)
  const isError = type === 'error'

  useEffect(() => {
    if (!message) {
      setVisible(false)
      return undefined
    }

    const timer = window.setTimeout(() => setVisible(true), 120)
    return () => window.clearTimeout(timer)
  }, [message])

  useEffect(() => {
    if (!message) return undefined
    const timer = window.setTimeout(() => onClose?.(), 7000)
    return () => window.clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null

  return (
    <div className={`feedback-modal ${visible ? 'feedback-modal--visible' : ''}`} role="alertdialog" aria-modal="true">
      <button type="button" className="feedback-modal__backdrop" onClick={onClose} aria-label="Close notification" />
      <div className={`feedback-modal__card feedback-modal__card--${isError ? 'error' : 'success'}`}>
        <button type="button" className="feedback-modal__close" onClick={onClose} aria-label="Close notification">
          <X size={18} />
        </button>
        <div className="feedback-modal__icon">
          {isError ? <AlertTriangle size={34} /> : <CheckCircle2 size={34} />}
        </div>
        <h3>{title || (isError ? 'Something went wrong' : 'Request sent successfully')}</h3>
        <p>{message}</p>
        <button type="button" className="feedback-modal__confirm" onClick={onClose}>
          {isError ? 'Close' : 'Accept'}
        </button>
      </div>
    </div>
  )
}

export default FeedbackModal
