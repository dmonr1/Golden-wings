import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { en } from '../locales/en.js'
import { es } from '../locales/es.js'

const translations = { en, es }
const STORAGE_KEY = 'golden-wings-language'

const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    if (typeof window === 'undefined') return 'en'
    const stored = window.localStorage.getItem(STORAGE_KEY)
    if (stored === 'es' || stored === 'en') return stored
    const browserLang = navigator.language || navigator.userLanguage || ''
    return browserLang.toLowerCase().startsWith('es') ? 'es' : 'en'
  })

  useEffect(() => {
    document.documentElement.lang = language
    window.localStorage.setItem(STORAGE_KEY, language)
  }, [language])

  const setLanguage = useCallback((newLang) => {
    if (newLang === 'en' || newLang === 'es') {
      setLanguageState(newLang)
    }
  }, [])

  const t = useCallback(
    (keyPath, fallback = '', vars = null) => {
      if (!keyPath) return fallback

      const resolvePath = (obj, path) => {
        const keys = path.split('.')
        let current = obj
        for (const k of keys) {
          if (current && typeof current === 'object' && k in current) {
            current = current[k]
          } else {
            return undefined
          }
        }
        return current
      }

      let value = resolvePath(translations[language], keyPath)

      // Fallback to English if missing in current language
      if (value === undefined && language !== 'en') {
        value = resolvePath(translations.en, keyPath)
      }

      if (value === undefined) {
        value = fallback || keyPath
      }

      // If string and variables provided, interpolate {variable}
      if (typeof value === 'string' && vars && typeof vars === 'object') {
        return Object.entries(vars).reduce((acc, [k, v]) => {
          return acc.replaceAll(`{${k}}`, String(v))
        }, value)
      }

      return value
    },
    [language],
  )

  return (
    <LanguageContext.Provider
      value={{
        language,
        setLanguage,
        t,
        isSpanish: language === 'es',
      }}
    >
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider')
  }
  return context
}
