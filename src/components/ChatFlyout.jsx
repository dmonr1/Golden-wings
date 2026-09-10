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

const QUICK_ACTIONS = [
  { icon: Search, label: 'Search P/N (e.g. 212-040)', query: '212-040' },
  { icon: Zap, label: 'Urgent AOG Support', query: 'I have an AOG emergency' },
  { icon: ClipboardList, label: 'Request a Quote (RFQ)', query: 'How do I request an RFQ?' },
  { icon: ShieldCheck, label: 'FAA / EASA Certifications', query: 'What certifications come with the parts?' },
]

function getFormattedTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
}

// Smart assistant matching engine (pure logic outside component)
function generateBotReply(userText) {
  const query = userText.trim().toLowerCase()
  const now = getFormattedTime()
  const idSuffix = `${Date.now()}-${Math.floor(Math.random() * 1000)}`

  // 0. Common conversational intents
  if (/^(hi|hello|hey|good morning|good afternoon|good evening)\b/.test(query)) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: 'Hello! How can I help you today? You can ask me to search for a part, check availability, request an RFQ, or contact our sales team.',
      time: now,
    }
  }

  if (query.includes('thank') || query.includes('thanks')) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: 'You are welcome! Let me know if you need help finding another part or preparing a quotation request.',
      time: now,
    }
  }

  if (query.includes('help') || query.includes('what can you do') || query.includes('how can you help')) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: 'I can search our aircraft parts catalog, provide basic availability and condition details, guide you through an RFQ, explain certifications, and connect you with our sales team.',
      action: {
        type: 'catalog',
        label: 'Explore Catalog',
        link: '/catalog',
      },
      time: now,
    }
  }

  if (/^(bye|goodbye|see you|that is all|that\\'s all)\b/.test(query)) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: 'Thank you for contacting Golden Wings International. We are here whenever you need aviation parts support.',
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
      text: `I found ${matchedParts.length} available component(s) in our inventory. Here are the related options:`,
      parts: matchedParts.slice(0, 3),
      time: now,
    }
  }

  // 2. AOG Emergency detection
  if (query.includes('aog') || query.includes('emergencia') || query.includes('urgente') || query.includes('urgent')) {
    return {
      id: `bot-${idSuffix}`,
      sender: 'bot',
      text: 'Priority AOG support activated. Our aircraft-on-ground response team operates 24/7/365 for immediate dispatch from our logistics centers.',
      action: {
        type: 'contact',
        label: 'Contact the 24/7 AOG Desk',
        link: '/contact',
      },
      time: now,
    }
  }

  // 3. RFQ / Cotización detection
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
      text: 'You can request a formal quotation (RFQ) in just a few seconds. Please provide the part number (P/N), required quantity, and desired condition (NS, OH, SV, or AR).',
      action: {
        type: 'rfq',
        label: 'Open the RFQ form',
        link: '/contact',
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
      text: 'Our components may be supplied with complete aviation documentation, including FAA Form 8130-3, EASA Form 1, and a Certificate of Conformity (CoC), depending on the part and availability.',
      action: {
        type: 'catalog',
        label: 'Explore Catalog',
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
      text: 'You can contact our sales team at sales@goldenwingsinternational.net or complete our online contact form.',
      action: {
        type: 'contact',
        label: 'Go to Contact',
        link: '/contact',
      },
      time: now,
    }
  }

  // 6. Natural fallback response
  return {
    id: `bot-${idSuffix}`,
    sender: 'bot',
    text: 'Understood. If you are looking for a specific part, please provide its P/N or aircraft model, such as Bell 204, Bell 212, PW100, or turbine. I can also help you send a direct request to our sales team.',
    action: {
      type: 'contact',
      label: 'Send a Request to Sales',
      link: '/contact',
    },
    time: now,
  }
}

export default function ChatFlyout() {
  const [isOpen, setIsOpen] = useState(false)
  const [isClosing, setIsClosing] = useState(false)
  const [messages, setMessages] = useState(INITIAL_MESSAGES)
  const [inputValue, setInputValue] = useState('')
  const [isTyping, setIsTyping] = useState(false)

  const flyoutRef = useRef(null)
  const messagesEndRef = useRef(null)
  const inputRef = useRef(null)
  const fabRef = useRef(null)

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
    setMessages(INITIAL_MESSAGES)
    setIsTyping(false)
  }, [])

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
    setIsTyping(true)

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query }),
      })

      if (!response.ok) throw new Error('Chat API unavailable')

      const data = await response.json()
      const botMsg = data.products?.length
        ? {
          id: `bot-${Date.now()}`,
          sender: 'bot',
          text: data.reply,
          parts: data.products,
          time: getFormattedTime(),
        }
        : generateBotReply(query)

      setMessages((prev) => [...prev, botMsg])
    } catch {
      // Keep the current local assistant available during local development.
      setMessages((prev) => [...prev, generateBotReply(query)])
    } finally {
      setIsTyping(false)
    }
  }, [inputValue])

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
              <span>FAA & EASA Certified Aerospace Support</span>
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
                              title="Ver en catálogo"
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
                        <Link
                          to={msg.action.link}
                          className="chat-bubble__action-btn"
                          onClick={handleClose}
                        >
                          <span>{msg.action.label}</span>
                          <ArrowRight size={14} />
                        </Link>
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
            {QUICK_ACTIONS.map((item) => (
              <button
                key={item.label}
                type="button"
                className="chat-quick-chip"
                onClick={() => handleSendMessage(item.query)}
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
              placeholder="Type your inquiry here..."
              aria-label="Type your message or part number"
            />
            <button
              type="submit"
              className={`chat-flyout__send-btn ${inputValue.trim() ? 'chat-flyout__send-btn--active' : ''}`}
              disabled={!inputValue.trim() || isTyping}
              aria-label="Enviar mensaje"
              title="Enviar"
            >
              <Send size={16} />
            </button>
          </form>
        </aside>
      )}
    </>
  )
}
