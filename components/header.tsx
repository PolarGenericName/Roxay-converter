"use client"

import { useState, useRef, useEffect } from "react"
import { ChevronDown, ArrowLeft } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import { locales } from "@/lib/i18n"
import Image from "next/image"
import Link from "next/link"
import { usePathname } from "next/navigation"

export function Header() {
  const { locale, setLocale } = useLocale()
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const pathname = usePathname()
  const isSecondaryPage = pathname === "/terms" || pathname === "/privacy"

  const currentLocale = locales.find((l) => l.code === locale) || locales[0]

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  return (
    <header className="sticky top-0 z-50 border-b border-[hsl(260,20%,18%)] bg-[hsl(260,30%,6%)/0.8] backdrop-blur-xl">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
        {/* Logo and Back Button */}
        <div className="flex items-center gap-3">
          {isSecondaryPage && (
            <Link
              href="/"
              className="mr-2 flex h-9 w-9 items-center justify-center rounded-lg border border-[hsl(260,20%,18%)] bg-[hsl(260,25%,10%)] text-[hsl(0,0%,85%)] transition-all hover:border-[hsl(265,80%,50%)/0.5] hover:bg-[hsl(260,20%,14%)]"
              aria-label="Voltar para a página principal"
            >
              <ArrowLeft className="h-5 w-5" />
            </Link>
          )}
          <Link href="/" className="flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="relative h-11 w-11 overflow-hidden rounded-lg">
              <Image
                src="/logo.png"
                alt="Roxay Converter Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display text-2xl font-bold tracking-tight text-[hsl(0,0%,95%)]">
              Roxay<span className="bg-gradient-to-r from-[hsl(265,80%,50%)] to-[hsl(280,85%,55%)] bg-clip-text text-transparent"> Converter</span>
            </span>
          </Link>
        </div>

        {/* Language Selector */}
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="flex items-center gap-2 rounded-lg border border-[hsl(260,20%,18%)] bg-[hsl(260,25%,10%)] px-3 py-2 text-sm text-[hsl(0,0%,85%)] transition-all hover:border-[hsl(265,80%,50%)/0.5] hover:bg-[hsl(260,20%,14%)]"
            aria-label="Select language"
            aria-expanded={isOpen}
          >
            <span className="text-lg" role="img" aria-label={currentLocale.name}>
              {currentLocale.flag}
            </span>
            <ChevronDown className={`h-4 w-4 transition-transform ${isOpen ? "rotate-180" : ""}`} />
          </button>

          {isOpen && (
            <div className="absolute right-0 top-full mt-2 w-52 overflow-hidden rounded-xl border border-[hsl(260,20%,18%)] bg-[hsl(260,25%,10%)] shadow-xl shadow-[hsl(265,80%,50%)/0.1]">
              {locales.map((loc) => (
                <button
                  key={loc.code}
                  onClick={() => {
                    setLocale(loc.code)
                    setIsOpen(false)
                  }}
                  className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-sm transition-colors hover:bg-[hsl(265,80%,50%)/0.15] ${
                    locale === loc.code ? "bg-[hsl(265,80%,50%)/0.1] text-[hsl(265,80%,70%)]" : "text-[hsl(0,0%,80%)]"
                  }`}
                >
                  <span className="text-lg" role="img" aria-label={loc.name}>
                    {loc.flag}
                  </span>
                  <span>{loc.nativeName}</span>
                  {locale === loc.code && (
                    <svg className="ml-auto h-4 w-4 text-[hsl(265,80%,50%)]" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </header>
  )
}
