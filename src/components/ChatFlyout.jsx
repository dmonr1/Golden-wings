import { useState, useRef, useEffect, useCallback } from 'react'
import { Link } from 'react-router-dom'
import {
  MessageCircle,
  ChevronDown,
  Send,
  Plane,
  RotateCcw,
  ArrowRight,
  Search,
  Zap,
  ClipboardList,
  ShieldCheck,
} from 'lucide-react'
import eagleLogo from '../assets/laoder/golden-wings-aguila-mundo.svg'
import { partsInventory } from '../data/partsInventory.js'
import { useLanguage } from '../context/LanguageContext.jsx'
import { submitContactForm } from '../services/contactForm.js'

const INITIAL_MESSAGES = [
  {
    id: 'msg-welcome-1',
    sender: 'bot',
    text: 'Hello! Welcome to Golden Wings International.',
    time: 'Now',
  },
  {
    id: 'msg-welcome-2',
    sender: 'bot',
    text: 'I am your aviation components assistant. How can I help you today? Ask me about part numbers (P/N), availability, AOG support, or quotations.',
    time: 'Now',
  },
]

function getFormattedTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

const isPricingQuestion = (query) => /\b(price|pricing|cost|quote|quotation|rfq|precio|cotiz)/.test(query)

const buildRfqAction = (part, isSpanish = false) => ({
  type: 'rfq',
  label: isSpanish ? `Iniciar RFQ para ${part.partNumber}` : `Start RFQ for ${part.partNumber}`,
})

// Smart assistant matching engine (pure logic outside component)
function generateBotReply(userText, activePart = null, isSpanish = false) {
  const query = userText.trim().toLowerCase()
  const now = getFormattedTime()
  const idSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`

  // 0. Common conversational intents
  if (/^(hi|hello|hey|good morning|good afternoon|good evening|hola|buenos dias|buenas tardes|buenas noches)[!. ,]*$/.test(query)) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: isSpanish
        ? '¡Hola! ¿Como puedo ayudarle hoy? Puede pedirme buscar un repuesto, verificar disponibilidad, solicitar una cotizacion (RFQ) o contactar a ventas.'
        : 'Hello! How can I help you today? You can ask me to search for a part, check availability, request an RFQ, or contact our sales team.',
      time: now,
    }
  }

  if (query.includes('thank') || query.includes('thanks') || query.includes('gracias')) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: isSpanish
        ? '¡Con gusto! Dejeme saber si necesita ayuda buscando otro repuesto o preparando una cotizacion.'
        : 'You are welcome! Let me know if you need help finding another part or preparing a quotation request.',
      time: now,
    }
  }

  if (query.includes('help') || query.includes('what can you do') || query.includes('how can you help') || query.includes('ayuda') || query.includes('que puedes hacer')) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: isSpanish
        ? 'Puedo buscar en nuestro catalogo de piezas, indicarle disponibilidad y condicion, guiarle en una cotizacion RFQ, explicar certificaciones y conectarlo con nuestro equipo de ventas.'
        : 'I can search our aircraft parts catalog, provide basic availability and condition details, guide you through an RFQ, explain certifications, and connect you with our sales team.',
      action: {
        type: 'catalog',
        label: isSpanish ? 'Explorar Catalogo' : 'Explore Catalog',
        link: '/catalog',
      },
      time: now,
    }
  }

  if (/^(bye|goodbye|see you|that is all|that\\'s all|adios|chao|hasta luego)\b/.test(query)) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: isSpanish
        ? 'Gracias por contactar a Golden Wings International. Estamos a su disposicion siempre que requiera soporte aeronautico.'
        : 'Thank you for contacting Golden Wings International. We are here whenever you need aviation parts support.',
      time: now,
    }
  }

  // Continue the conversation about the last part the visitor searched for.
  if (isPricingQuestion(query) && activePart) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: isSpanish
        ? `${activePart.partNumber} — ${activePart.description} esta listado en ${activePart.price}. Condicion disponible: ${activePart.conditionLabel || activePart.condition}. Cantidad mostrada: ${activePart.quantity}.`
        : `${activePart.partNumber} — ${activePart.description} is currently listed at ${activePart.price}. Available condition: ${activePart.conditionLabel || activePart.condition}. Quantity shown: ${activePart.quantity}.`,
      action: buildRfqAction(activePart, isSpanish),
      time: now,
    }
  }

  // 1. Search in local partsInventory
  const matchedParts = partsInventory.filter((item) => {
    const pn = (item.partNumber || '').toLowerCase()
    const desc = (item.description || '').toLowerCase()
    const fleet = (item.fleet || '').toLowerCase()
    const cat = (item.category || '').toLowerCase()
    return (
      pn.includes(query) ||
      desc.includes(query) ||
      fleet.includes(query) ||
      cat.includes(query) ||
      query.includes(pn) ||
      query.split(' ').some((word) => word.length > 2 && (pn.includes(word) || desc.includes(word)))
    )
  })

  if (matchedParts.length > 0) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: isSpanish
        ? `Encontre ${matchedParts.length} componente(s) disponible(s) en nuestro inventario. Aqui tiene las opciones relacionadas:`
        : `I found ${matchedParts.length} available component(s) in our inventory. Here are the related options:`,
      parts: matchedParts.slice(0, 3),
      time: now,
    }
  }

  // 2. AOG Emergency detection
  if (query.includes('aog') || query.includes('emergencia') || query.includes('urgente') || query.includes('urgent')) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: isSpanish
        ? 'Soporte prioritario AOG activado. Nuestro equipo de respuesta para aeronaves en tierra opera 24/7/365 para despacho inmediato desde nuestros centros logisticos.'
        : 'Priority AOG support activated. Our aircraft-on-ground response team operates 24/7/365 for immediate dispatch from our logistics centers.',
      action: {
        type: 'contact',
        label: isSpanish ? 'Contactar Mesa AOG 24/7' : 'Contact the 24/7 AOG Desk',
        link: '/contact',
      },
      time: now,
    }
  }

  // 3. RFQ / Cotizacion detection
  if (
    query.includes('cotiz') ||
    query.includes('rfq') ||
    query.includes('precio') ||
    query.includes('quote') ||
    query.includes('price') ||
    query.includes('costo')
  ) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: isSpanish
        ? 'Puede solicitar una cotizacion formal (RFQ) en pocos segundos. Por favor indique el numero de parte (P/N), cantidad requerida y condicion deseada (NS, OH, SV o AR).'
        : 'You can request a formal quotation (RFQ) in just a few seconds. Please provide the part number (P/N), required quantity, and desired condition (NS, OH, SV, or AR).',
      action: {
        type: 'rfq',
        label: isSpanish ? 'Iniciar RFQ en el chat' : 'Start RFQ in chat',
      },
      time: now,
    }
  }

  // 4. Certifications / Traceability detection
  if (
    query.includes('cert') ||
    query.includes('faa') ||
    query.includes('easa') ||
    query.includes('8130') ||
    query.includes('trazabilidad') ||
    query.includes('form 1')
  ) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: isSpanish
        ? 'Nuestros componentes pueden suministrarse con documentacion aeronautica completa, incluyendo FAA Form 8130-3, EASA Form 1 y Certificado de Conformidad (CoC), segun la pieza y disponibilidad.'
        : 'Our components may be supplied with complete aviation documentation, including FAA Form 8130-3, EASA Form 1, and a Certificate of Conformity (CoC), depending on the part and availability.',
      action: {
        type: 'catalog',
        label: isSpanish ? 'Explorar Catalogo' : 'Explore Catalog',
        link: '/catalog',
      },
      time: now,
    }
  }

  // 5. Contact / Sales detection
  if (query.includes('contacto') || query.includes('correo') || query.includes('telefono') || query.includes('email') || query.includes('phone')) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: isSpanish
        ? 'Puede contactar a nuestro equipo de ventas en sales@goldenwingsinternational.net o completar nuestro formulario de contacto en linea.'
        : 'You can contact our sales team at sales@goldenwingsinternational.net or complete our online contact form.',
      action: {
        type: 'contact',
        label: isSpanish ? 'Ir a Contacto' : 'Go to Contact',
        link: '/contact',
      },
      time: now,
    }
  }

  // 6. Natural fallback response
  return {
    id: `bot-${idSuffix}`,
    sender: 'bot',
    text: isSpanish
      ? 'Entendido. Si busca una pieza especifica, faciliteme su P/N o modelo de aeronave como Bell 204, Bell 212, PW100 o turbinas. Tambien puedo ayudarle a enviar una solicitud directa al equipo de ventas.'
      : 'Understood. If you are looking for a specific part, please provide its P/N or aircraft model, such as Bell 204, Bell 212, PW100, or turbine. I can also help you send a direct request to our sales team.',
    action: {
      type: 'contact',
      label: isSpanish ? 'Enviar Solicitud a Ventas' : 'Send a Request to Sales',
      link: '/contact',
    },
    time: now,
  }
}

export default function ChatFlyout() {
  const { language, isSpanish, t } = useLanguage()
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [activePart, setActivePart] = useState(null)
  const [rfqFlow, setRfqFlow] = useState(null)

  const flyoutRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fabRef = useRef(null)

  useEffect(() => {
    setMessages((prev) => {
      if (prev.length <= 2 && prev.every((m) => m.sender === 'bot')) {
        return [
          {
            id: 'msg-welcome-1',
            sender: 'bot',
            text: t('chat.welcome1'),
            time: 'Now',
          },
          {
            id: 'msg-welcome-2',
            sender: 'bot',
            text: t('chat.welcome2'),
            time: 'Now',
          },
        ]
      }
      return prev
    })
  }, [language, t])

  const quickActions = [
    { icon: Search, label: t('chat.quickActions.search'), query: '212-040' },
    { icon: Zap, label: t('chat.quickActions.aog'), query: isSpanish ? 'Tengo una emergencia AOG' : 'I have an AOG emergency' },
    { icon: ClipboardList, label: t('chat.quickActions.rfq'), rfqFlow: true },
    { icon: ShieldCheck, label: t('chat.quickActions.certs'), query: isSpanish ? '¿Que certificaciones acompañan a las piezas?' : 'What certifications come with the parts?' },
  ]

  const handleOpen = useCallback(() => {
    setIsClosing(false)
    setIsOpen(true)
  }, [])

  const handleClose = useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      setIsOpen(false)
      setIsClosing(false)
    }, 240)
  }, [])

  const toggleChat = useCallback(() => {
    if (isOpen) {
      handleClose()
    } else {
      handleOpen()
    }
  }, [isOpen, handleClose, handleOpen])

  // Auto-scroll to latest message
  const scrollToBottom = useCallback((behavior = 'smooth') => {
    messagesEndRef.current?.scrollIntoView({ behavior })
  }, [])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('auto')
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 150)
      return () => clearTimeout(timer)
    }
  }, [isOpen, scrollToBottom])

  useEffect(() => {
    if (isOpen) {
      scrollToBottom('smooth')
    }
  }, [messages, isTyping, isOpen, scrollToBottom])

  // Close on Escape or click outside
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isClosing) {
        handleClose()
      }
    }

    const handleClickOutside = (e) => {
      if (isClosing) return
      if (
        flyoutRef.current &&
        !flyoutRef.current.contains(e.target) &&
        fabRef.current &&
        !fabRef.current.contains(e.target)
      ) {
        handleClose()
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, isClosing, handleClose])

  const msgIdCounter = useRef(0)

  const handleReset = useCallback(() => {
    setMessages([
      {
        id: 'msg-welcome-1',
        sender: 'bot',
        text: t('chat.welcome1'),
        time: 'Now',
      },
      {
        id: 'msg-welcome-2',
        sender: 'bot',
        text: t('chat.welcome2'),
        time: 'Now',
      },
    ])
    setIsTyping(false)
    setActivePart(null)
    setRfqFlow(null)
  }, [t])

  const appendBotMessage = useCallback((text) => {
    setMessages((previous) => [
      ...previous,
      {
        id: `bot-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
        sender: 'bot',
        text,
        time: getFormattedTime(),
      },
    ])
  }, [])

  const getRfqQuestion = useCallback((step, draft) => {
    const partNote = draft.partNumber
      ? (isSpanish ? ` Ya tengo seleccionada la pieza ${draft.partNumber}.` : ` I already have ${draft.partNumber} selected.`)
      : ''

    const questions = {
      name: isSpanish ? `Perfecto, prepararemos su RFQ dentro del chat.${partNote} Primero, ¿cual es su nombre completo?` : `Great, I will prepare your RFQ right here in the chat.${partNote} First, what is your full name?`,
      email: isSpanish ? 'Gracias. ¿Cual es su correo electronico de contacto?' : 'Thank you. What is your contact email address?',
      partNumber: isSpanish ? '¿Cual es el numero de parte (P/N) que necesita?' : 'What part number (P/N) do you need?',
      quantity: isSpanish ? '¿Que cantidad necesita?' : 'What quantity do you need?',
      condition: isSpanish ? '¿Que condicion requiere? Por ejemplo: NS, OH, SV o AR.' : 'What condition do you require? For example: NS, OH, SV, or AR.',
      request: isSpanish ? 'Por ultimo, indique detalles adicionales: aeronave, urgencia, certificaciones o fecha requerida.' : 'Lastly, share any additional details: aircraft, urgency, certifications, or required date.',
      confirm: isSpanish ? '¿Desea enviar esta RFQ ahora? Responda “yes” o “no”.' : 'Would you like to send this RFQ now? Reply “yes” or “no”.',
    }

    return questions[step]
  }, [isSpanish])

  const startRfqFlow = useCallback(() => {
    if (rfqFlow) return

    const draft = {
      name: '',
      email: '',
      partNumber: activePart?.partNumber || '',
      quantity: '',
      condition: '',
      request: '',
    }
    setRfqFlow({ step: 'name', draft })
    appendBotMessage(getRfqQuestion('name', draft))
  }, [activePart, appendBotMessage, getRfqQuestion, rfqFlow])

  const advanceRfqFlow = useCallback(async (answer) => {
    if (!rfqFlow) return false

    const normalizedAnswer = answer.trim()
    if (/^(cancel|stop|cancelar|salir)$/i.test(normalizedAnswer)) {
      setRfqFlow(null)
      appendBotMessage(isSpanish ? 'RFQ cancelada. Puede iniciarla nuevamente cuando guste.' : 'The RFQ was cancelled. You can start a new one whenever you are ready.')
      return true
    }

    const { step, draft } = rfqFlow
    if (step === 'confirm') {
      if (/^(no|n)$/i.test(normalizedAnswer)) {
        setRfqFlow(null)
        appendBotMessage(isSpanish ? 'No se envio la RFQ. Puede iniciar una nueva cuando guste.' : 'The RFQ was not sent. You can start a new one whenever you are ready.')
        return true
      }
      if (!/^(yes|y|si|sí)$/i.test(normalizedAnswer)) {
        appendBotMessage(isSpanish ? 'Por favor responda “yes” para enviar o “no” para cancelar.' : 'Please reply “yes” to send it or “no” to cancel.')
        return true
      }

      setIsTyping(true)
      try {
        await submitContactForm({
          name: draft.name,
          email: draft.email,
          partNumber: draft.partNumber,
          request: `${draft.request}\n\nRFQ details:\nQuantity: ${draft.quantity}\nRequired condition: ${draft.condition}`,
        })
        appendBotMessage(isSpanish ? 'Su RFQ fue enviada correctamente. Nuestro equipo le respondera por correo.' : 'Your RFQ was sent successfully. Our team will reply by email.')
        setRfqFlow(null)
      } catch {
        appendBotMessage(isSpanish ? 'No pude enviar la RFQ en este momento. Intente de nuevo en unos minutos.' : 'I could not send the RFQ right now. Please try again in a few minutes.')
      } finally {
        setIsTyping(false)
      }
      return true
    }

    if (step === 'email' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedAnswer)) {
      appendBotMessage(isSpanish ? 'Ese correo no parece valido. Por favor escribalo nuevamente.' : 'That email address does not look valid. Please enter it again.')
      return true
    }

    const nextDraft = { ...draft, [step]: normalizedAnswer }
    const nextStep = {
      name: 'email',
      email: draft.partNumber ? 'quantity' : 'partNumber',
      partNumber: 'quantity',
      quantity: 'condition',
      condition: 'request',
      request: 'confirm',
    }[step]

    setRfqFlow({ step: nextStep, draft: nextDraft })
    if (nextStep === 'confirm') {
      const summary = isSpanish
        ? `Resumen RFQ:\nNombre: ${nextDraft.name}\nP/N: ${nextDraft.partNumber}\nCantidad: ${nextDraft.quantity}\nCondicion: ${nextDraft.condition}\n\n${getRfqQuestion('confirm', nextDraft)}`
        : `RFQ summary:\nName: ${nextDraft.name}\nP/N: ${nextDraft.partNumber}\nQuantity: ${nextDraft.quantity}\nCondition: ${nextDraft.condition}\n\n${getRfqQuestion('confirm', nextDraft)}`
      appendBotMessage(summary)
    } else {
      appendBotMessage(getRfqQuestion(nextStep, nextDraft))
    }
    return true
  }, [appendBotMessage, getRfqQuestion, isSpanish, rfqFlow])

  const handleSendMessage = useCallback(async (textToSend) => {
    const query = (textToSend || inputValue).trim()
    if (!query) return

    msgIdCounter.current += 1
    const currentId = msgIdCounter.current
    const now = getFormattedTime()
    const userMsg = {
      id: `user-${currentId}`,
      sender: 'user',
      text: query,
      time: now,
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue('')

    if (rfqFlow) {
      await advanceRfqFlow(query)
      return
    }

    setIsTyping(true)

    try {
      const response = await fetch('/.netlify/functions/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, activePartNumber: activePart?.partNumber || '', language }),
      })

      if (!response.ok) throw new Error('Chat API unavailable')

      const data = await response.json()
      const displayedParts = data.products?.map((part) => ({
        ...part,
        ...(partsInventory.find((inventoryPart) => inventoryPart.partNumber === part.partNumber) || {}),
      }))
      const botMsg = data.handled
        ? {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.reply,
          parts: displayedParts,
          action: data.action,
          time: getFormattedTime(),
        }
        : generateBotReply(query, activePart, isSpanish)

      if (displayedParts?.length) setActivePart(displayedParts[0])

      setMessages((prev) => [...prev, botMsg])
    } catch {
      // Keep the current local assistant available during local development.
      const botMsg = generateBotReply(query, activePart, isSpanish)
      if (botMsg.parts?.length) setActivePart(botMsg.parts[0])
      setMessages((prev) => [...prev, botMsg])
    } finally {
      setIsTyping(false)
    }
  }, [inputValue, activePart, advanceRfqFlow, isSpanish, language, rfqFlow])

  const handleFormSubmit = useCallback((e) => {
    e.preventDefault()
    handleSendMessage()
  }, [handleSendMessage])

  return (
    <>
      {/* Floating Action Button */}
      <button
        ref={fabRef}
        className={`chat-fab ${isOpen ? 'chat-fab--active' : ''}`}
        type="button"
        onClick={toggleChat}
        aria-expanded={isOpen}
        aria-controls="golden-wings-chat-flyout"
        aria-label={isOpen ? 'Close chat' : 'Open Golden Wings chat'}
      >
        <span className="chat-fab__icon-wrapper">
          <MessageCircle
            size={22}
            className={`chat-fab__icon chat-fab__icon--chat ${isOpen ? 'chat-fab__icon--hidden' : ''}`}
            aria-hidden="true"
          />
          <ChevronDown
            size={22}
            className={`chat-fab__icon chat-fab__icon--close ${!isOpen ? 'chat-fab__icon--hidden' : ''}`}
            aria-hidden="true"
          />
        </span>
      </button>

      {/* Modern White Chatbot Flyout */}
      {(isOpen || isClosing) && (
        <aside
          ref={flyoutRef}
          id="golden-wings-chat-flyout"
          className={`chat-flyout ${isClosing ? 'chat-flyout--closing' : 'chat-flyout--opening'}`}
          aria-label="Golden Wings Chatbot"
          role="dialog"
          aria-modal="false"
          onWheel={(event) => event.stopPropagation()}
          onTouchMove={(event) => event.stopPropagation()}
        >
          {/* Header */}
          <div className="chat-flyout__header">
            <div className="chat-flyout__brand">
              <div className="chat-flyout__avatar">
                <img src={eagleLogo} alt="Golden Wings Eagle" className="chat-flyout__avatar-img" />
                <span className="chat-flyout__status-dot" aria-label="Online" />
              </div>
              <div className="chat-flyout__header-text">
                <span className="chat-flyout__company">Golden Wings International</span>
              </div>
            </div>

            <div className="chat-flyout__header-actions">
              <button
                type="button"
                className="chat-flyout__header-btn"
                onClick={handleReset}
                title="Restart conversation"
                aria-label="Restart conversation"
              >
                <RotateCcw size={15} />
              </button>
              <button
                type="button"
                className="chat-flyout__header-btn chat-flyout__header-btn--close"
                onClick={handleClose}
                title="Close window"
                aria-label="Close chat"
              >
                <ChevronDown size={18} strokeWidth={2.4} />
              </button>
            </div>
          </div>

          {/* Messages Area */}
          <div
            className="chat-flyout__messages"
            tabIndex={0}
            aria-live="polite"
            onWheel={(event) => event.stopPropagation()}
            onTouchMove={(event) => event.stopPropagation()}
          >
            <div className="chat-flyout__security-badge">
              <Plane size={13} className="chat-flyout__security-icon" />
              <span>{t('chat.securityBadge')}</span>
            </div>

            {messages.map((msg, index) => {
              const isUser = msg.sender === 'user'
              const prevMsg = messages[index - 1]
              const isSameSender = prevMsg && prevMsg.sender === msg.sender

              return (
                <div
                  key={msg.id}
                  className={`chat-bubble-row ${isUser ? 'chat-bubble-row--user' : 'chat-bubble-row--bot'} ${isSameSender ? 'chat-bubble-row--grouped' : ''
                    }`}
                >
                  <div className={`chat-bubble ${isUser ? 'chat-bubble--user' : 'chat-bubble--bot'}`}>
                    <p className="chat-bubble__text">{msg.text}</p>

                    {/* Matched Parts Cards */}
                    {msg.parts && msg.parts.length > 0 && (
                      <div className="chat-bubble__parts-list">
                        {msg.parts.map((part) => (
                          <div key={part.id} className="chat-part-card">
                            {part.image && (
                              <img
                                src={part.image}
                                alt={part.description}
                                className="chat-part-card__thumb"
                                loading="lazy"
                              />
                            )}
                            <div className="chat-part-card__info">
                              <span className="chat-part-card__pn">{part.partNumber}</span>
                              <span className="chat-part-card__desc">{part.description}</span>
                              <div className="chat-part-card__meta">
                                <span className="chat-part-card__tag">{part.fleet}</span>
                                <span className="chat-part-card__tag chat-part-card__tag--condition">
                                  {part.condition}
                                </span>
                              </div>
                            </div>
                            <Link
                              to={`/catalog?search=${encodeURIComponent(part.partNumber)}`}
                              className="chat-part-card__link"
                              onClick={handleClose}
                              title={t('chat.viewInCatalog', 'View in catalog')}
                            >
                              <ArrowRight size={14} />
                            </Link>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Action button */}
                    {msg.action && (
                      <div className="chat-bubble__action-wrap">
                        {msg.action.type === 'rfq' ? (
                          <button type="button" className="chat-bubble__action-btn" onClick={startRfqFlow}>
                            <span>{msg.action.label}</span>
                            <ArrowRight size={14} />
                          </button>
                        ) : (
                          <Link
                            to={msg.action.link}
                            className="chat-bubble__action-btn"
                            onClick={handleClose}
                          >
                            <span>{msg.action.label}</span>
                            <ArrowRight size={14} />
                          </Link>
                        )}
                      </div>
                    )}

                    <span className="chat-bubble__time">{msg.time}</span>
                  </div>
                </div>
              )
            })}

            {/* Typing indicator */}
            {isTyping && (
              <div className="chat-bubble-row chat-bubble-row--bot">
                <div className="chat-bubble chat-bubble--bot chat-bubble--typing">
                  <div className="chat-typing-dots">
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                    <span className="chat-typing-dot" />
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} style={{ height: 1 }} />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="chat-flyout__quick-actions">
            {quickActions.map((item) => (
              <button
                key={item.label}
                type="button"
                className="chat-quick-chip"
                onClick={() => (item.rfqFlow ? startRfqFlow() : handleSendMessage(item.query))}
              >
                <item.icon size={14} aria-hidden="true" />
                <span>{item.label}</span>
              </button>
            ))}
          </div>

          {/* Bottom Input Bar */}
          <form className="chat-flyout__input-bar" onSubmit={handleFormSubmit}>
            <input
              ref={inputRef}
              type="text"
              className="chat-flyout__input"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('chat.placeholder')}
              aria-label={t('chat.placeholder')}
            />
            <button
              type="submit"
              className={`chat-flyout__send-btn ${inputValue.trim() ? 'chat-flyout__send-btn--active' : ''}`}
              disabled={!inputValue.trim() || isTyping}
              aria-label={t('chat.sendAria')}
              title={t('chat.sendAria')}
            >
              <Send size={16} />
            </button>
          </form>
        </aside>
      )}
    </>
  )
}
