"use client"

import { Zap, Gift, Sparkles } from "lucide-react"
import { useLocale } from "@/lib/locale-context"

const reasons = [
  {
    icon: Zap,
    titleKey: "whyReason1Title" as const,
    descKey: "whyReason1Desc" as const,
    gradient: "from-[hsl(265,80%,50%)] to-[hsl(280,85%,55%)]", // Padronizado para roxo
  },
  {
    icon: Gift,
    titleKey: "whyReason2Title" as const,
    descKey: "whyReason2Desc" as const,
    gradient: "from-[hsl(280,85%,55%)] to-[hsl(265,80%,50%)]",
  },
  {
    icon: Sparkles,
    titleKey: "whyReason3Title" as const,
    descKey: "whyReason3Desc" as const,
    gradient: "from-[hsl(265,80%,50%)] to-[hsl(280,85%,65%)]",
  },
]

export function WhySection() {
  const { t } = useLocale()

  return (
    <section className="px-4 py-24 sm:px-6">
      <div className="mx-auto max-w-6xl">
        <h2 className="text-center font-display text-4xl font-bold text-[hsl(0,0%,93%)] sm:text-5xl">
          <span className="text-balance">{t("whyTitle")}</span>
        </h2>

        <div className="mt-16 grid gap-8 md:grid-cols-3">
          {reasons.map((reason) => {
            const Icon = reason.icon
            return (
              <div
                key={reason.titleKey}
                className="group relative overflow-hidden rounded-2xl border border-[hsl(260,20%,18%)] bg-[hsl(260,25%,10%)/0.6] p-8 transition-all hover:border-[hsl(265,80%,50%)/0.3] hover:shadow-lg hover:shadow-[hsl(265,80%,50%)/0.08]"
              >
                {/* Subtle gradient hover effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-[hsl(265,80%,50%)/0.04] to-transparent opacity-0 transition-opacity group-hover:opacity-100" />

                <div className="relative">
                  <div
                    className={`mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br ${reason.gradient} shadow-lg shadow-[hsl(265,80%,50%)/0.2]`}
                  >
                    <Icon className="h-8 w-8 text-[hsl(0,0%,100%)]" />
                  </div>

                  <h3 className="font-display text-xl font-semibold text-[hsl(0,0%,92%)]">{t(reason.titleKey)}</h3>
                  <p className="mt-3 text-base leading-relaxed text-[hsl(260,10%,50%)]">{t(reason.descKey)}</p>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
