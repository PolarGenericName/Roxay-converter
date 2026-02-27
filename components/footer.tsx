"use client"

import { useLocale } from "@/lib/locale-context"
import Image from "next/image"
import Link from "next/link"

export function Footer() {
  const { t } = useLocale()
  const year = new Date().getFullYear()

  return (
    <footer className="border-t border-[hsl(260,20%,18%)] bg-[hsl(260,30%,6%)/0.9] backdrop-blur-sm">
      <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
        <div className="flex flex-col items-center text-center">
          {/* Logo Centralizada */}
          <Link href="/" className="mb-6 flex items-center gap-3 transition-opacity hover:opacity-80">
            <div className="relative h-12 w-12 overflow-hidden rounded-lg">
              <Image
                src="/logo.png"
                alt="Roxay Converter Logo"
                fill
                className="object-contain"
              />
            </div>
            <span className="font-display text-2xl font-bold text-[hsl(0,0%,90%)]">
              Roxay<span className="text-[hsl(265,80%,60%)]"> Converter</span>
            </span>
          </Link>

          {/* Links Centralizados */}
          <div className="mb-8 flex flex-wrap justify-center items-center gap-x-6 gap-y-2 text-base font-medium">
            <Link 
              href="/privacy" 
              className="text-[hsl(260,10%,60%)] transition-colors hover:text-[hsl(265,80%,65%)]"
            >
              {t("footerPrivacy")}
            </Link>
            <span className="h-1 w-1 rounded-full bg-[hsl(260,20%,30%)]" />
            <Link 
              href="/terms" 
              className="text-[hsl(260,10%,60%)] transition-colors hover:text-[hsl(265,80%,65%)]"
            >
              {t("footerTerms")}
            </Link>
          </div>

          {/* Copyright Centralizado */}
          <p className="text-sm text-[hsl(260,10%,40%)]">
            {"© "}
            {year} Roxay Converter. {t("footerCopyright")}
          </p>
        </div>
      </div>
    </footer>
  )
}
