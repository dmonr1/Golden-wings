import { useEffect } from 'react'
import { AlertTriangle, CheckCircle2, X } from 'lucide-react'

function AlertToast({ type = 'success', message, onClose }) {
  useEffect(() => {
    if (!message) return undefined
    const timer = window.setTimeout(() => onClose?.(), 5000)
    return () => window.clearTimeout(timer)
  }, [message, onClose])

  if (!message) return null
  const isError = type === 'error'

  return (
    <div className={`alert-toast alert-toast--${isError ? 'error' : 'success'}`} role="alert">
      <span className="alert-toast__icon" aria-hidden="true">
        {isError ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
      </span>
      <span className="alert-toast__message">{message}</span>
      <button type="button" className="alert-toast__close" onClick={onClose} aria-label="Close notification">
        <X size={17} />
      </button>
    </div>
  )
}

export default AlertToast
