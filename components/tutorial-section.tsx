"use client"

import { Link2, ListMusic, Download } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

const steps = [
  { icon: Link2, titleKey: "tutorialStep1Title" as const, descKey: "tutorialStep1Desc" as const, number: "01" },
  { icon: ListMusic, titleKey: "tutorialStep2Title" as const, descKey: "tutorialStep2Desc" as const, number: "02" },
  { icon: Download, titleKey: "tutorialStep3Title" as const, descKey: "tutorialStep3Desc" as const, number: "03" },
]

export function TutorialSection() {
  const { t } = useLocale()

  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-4xl font-bold text-[hsl(0,0%,93%)] sm:text-5xl">
          <span className="text-balance">{t("tutorialTitle")}</span>
        </h2>

        <div className="mt-16 grid gap-10 md:grid-cols-3">
          {steps.map((step) => {
            const Icon = step.icon
            return (
              <div key={step.number} className="group relative text-center">
                {/* Connector line (hidden on mobile and last item) */}
                {step.number !== "03" && (
                  <div className="absolute left-[calc(50%+4rem)] top-12 hidden h-px w-[calc(100%-8rem)] bg-gradient-to-r from-[hsl(265,80%,50%)/0.3] to-transparent md:block" />
                )}

                {/* Step number and icon */}
                <div className="relative mx-auto mb-8 flex h-24 w-24 items-center justify-center">
                  <div className="absolute inset-0 rounded-2xl border border-[hsl(260,20%,18%)] bg-[hsl(260,25%,10%)] transition-all group-hover:border-[hsl(265,80%,50%)/0.3] group-hover:shadow-lg group-hover:shadow-[hsl(265,80%,50%)/0.1]" />
                  <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-[hsl(265,80%,50%)] to-[hsl(280,85%,55%)] text-sm font-bold text-[hsl(0,0%,100%)]">
                    {step.number}
                  </div>
                  <Icon className="relative z-10 h-10 w-10 text-[hsl(265,80%,65%)] transition-colors group-hover:text-[hsl(265,80%,75%)]" />
                </div>

                <h3 className="font-display text-xl font-semibold text-[hsl(0,0%,92%)]">{t(step.titleKey)}</h3>
                <p className="mt-3 text-base leading-relaxed text-[hsl(260,10%,50%)]">{t(step.descKey)}</p>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
