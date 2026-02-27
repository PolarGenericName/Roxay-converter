"use client"

import { LocaleProvider, useLocale } from "@/lib/locale-context"
import { BackgroundEffects } from "@/components/background-effects"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

function PrivacyContent() {
  const { t } = useLocale()

  return (
    <div className="relative min-h-screen">
      <BackgroundEffects />
      <div className="relative z-10 flex min-h-screen flex-col">
        <Header />
        <main className="flex-grow">
          <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 lg:py-24">
            <div className="rounded-2xl border border-[hsl(260,20%,18%)] bg-[hsl(260,25%,10%)/0.5] p-8 backdrop-blur-sm sm:p-12">
              <h1 className="mb-8 font-display text-4xl font-bold tracking-tight text-[hsl(0,0%,95%)] sm:text-5xl">
                {t("privacyTitle")}
              </h1>
              
              <div className="space-y-10 text-[hsl(260,10%,70%)] leading-relaxed">
                <p className="text-lg text-[hsl(0,0%,85%)]">
                  {t("privacyIntro")}
                </p>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-[hsl(265,80%,70%)]">
                    {t("privacySection1Title")}
                  </h2>
                  <p>{t("privacySection1Content")}</p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-[hsl(265,80%,70%)]">
                    {t("privacySection2Title")}
                  </h2>
                  <p>{t("privacySection2Content")}</p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-[hsl(265,80%,70%)]">
                    {t("privacySection3Title")}
                  </h2>
                  <p>{t("privacySection3Content")}</p>
                </section>

                <section className="space-y-4">
                  <h2 className="text-2xl font-bold text-[hsl(265,80%,70%)]">
                    {t("privacySection4Title")}
                  </h2>
                  <p>{t("privacySection4Content")}</p>
                </section>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    </div>
  )
}

export default function PrivacyPage() {
  return (
    <LocaleProvider>
      <PrivacyContent />
    </LocaleProvider>
  )
}
