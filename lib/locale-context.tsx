"use client"

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react"
import { type Locale, type TranslationKey, getTranslation, translations } from "./i18n"

interface LocaleContextType {
  locale: Locale
  setLocale: (locale: Locale) => void
  t: (key: TranslationKey) => string
}

const LocaleContext = createContext<LocaleContextType | undefined>(undefined)

const STORAGE_KEY = "roxay-converter-locale"

export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("pt")
  const [mounted, setMounted] = useState(false)

  // Carregar o idioma salvo ao montar o componente
  useEffect(() => {
    const savedLocale = localStorage.getItem(STORAGE_KEY) as Locale
    if (savedLocale && (translations as any)[savedLocale]) {
      setLocaleState(savedLocale)
    }
    setMounted(true)
  }, [])

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale)
    localStorage.setItem(STORAGE_KEY, newLocale)
  }, [])

  const t = useCallback(
    (key: TranslationKey) => {
      const trans = getTranslation(locale)
      return (trans as Record<string, string>)[key] || (translations.pt as Record<string, string>)[key] || key
    },
    [locale]
  )

  // Evitar problemas de hidratação renderizando um estado consistente inicialmente
  // Se você preferir que o conteúdo apareça imediatamente em PT e depois mude, 
  // remova a verificação de 'mounted' e aceite o flicker, ou use cookies para SSR.
  // Para este projeto client-side, localStorage + useEffect é o padrão.
  return (
    <LocaleContext.Provider value={{ locale, setLocale, t }}>
      {children}
    </LocaleContext.Provider>
  )
}

export function useLocale() {
  const context = useContext(LocaleContext)
  if (!context) {
    throw new Error("useLocale must be used within a LocaleProvider")
  }
  return context
}
