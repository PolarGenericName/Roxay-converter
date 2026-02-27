"use client"

import { useState } from "react"
import { ChevronDown } from "lucide-react"
import { useLocale } from "@/lib/locale-context"
import type { TranslationKey } from "@/lib/i18n"

const faqItems: { qKey: TranslationKey; aKey: TranslationKey }[] = [
  { qKey: "faq1Q", aKey: "faq1A" },
  { qKey: "faq2Q", aKey: "faq2A" },
  { qKey: "faq3Q", aKey: "faq3A" },
  { qKey: "faq4Q", aKey: "faq4A" },
  { qKey: "faq5Q", aKey: "faq5A" },
]

export function FaqSection() {
  const { t } = useLocale()
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-display text-4xl font-bold text-[hsl(0,0%,93%)] sm:text-5xl">
          <span className="text-balance">{t("faqTitle")}</span>
        </h2>

        <div className="mt-16 flex flex-col gap-4">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index
            return (
              <div
                key={item.qKey}
                className={`overflow-hidden rounded-2xl border transition-all ${
                  isOpen
                    ? "border-[hsl(265,80%,50%)/0.3] bg-[hsl(260,25%,10%)/0.8] shadow-lg shadow-[hsl(265,80%,50%)/0.05]"
                    : "border-[hsl(260,20%,18%)] bg-[hsl(260,25%,10%)/0.4]"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  className="flex w-full items-center justify-between px-6 py-5 text-left transition-colors hover:bg-[hsl(265,80%,50%)/0.05]"
                  aria-expanded={isOpen}
                >
                  <span className="pr-4 text-lg font-medium text-[hsl(0,0%,90%)]">{t(item.qKey)}</span>
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-[hsl(260,10%,45%)] transition-transform ${isOpen ? "rotate-180 text-[hsl(265,80%,60%)]" : ""}`}
                  />
                </button>
                <div
                  className="grid transition-all duration-300"
                  style={{
                    gridTemplateRows: isOpen ? "1fr" : "0fr",
                  }}
                >
                  <div className="overflow-hidden">
                    <div className="px-6 pb-6 pt-0 text-base leading-relaxed text-[hsl(260,10%,50%)]">{t(item.aKey)}</div>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
