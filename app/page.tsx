"use client"

import { LocaleProvider } from "@/lib/locale-context"
import { BackgroundEffects } from "@/components/background-effects"
import { Header } from "@/components/header"
import { ConverterSection } from "@/components/converter-section"
import { TutorialSection } from "@/components/tutorial-section"
import { WhySection } from "@/components/why-section"
import { FaqSection } from "@/components/faq-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <LocaleProvider>
      <div className="relative min-h-screen">
        <BackgroundEffects />
        <div className="relative z-10">
          <Header />
          <main>
            <ConverterSection />
            {/* Divider */}
            <div className="mx-auto max-w-xs">
              <div className="h-px bg-gradient-to-r from-transparent via-[hsl(265,80%,50%)/0.3] to-transparent" />
            </div>
            <TutorialSection />
            <div className="mx-auto max-w-xs">
              <div className="h-px bg-gradient-to-r from-transparent via-[hsl(265,80%,50%)/0.3] to-transparent" />
            </div>
            <WhySection />
            <div className="mx-auto max-w-xs">
              <div className="h-px bg-gradient-to-r from-transparent via-[hsl(265,80%,50%)/0.3] to-transparent" />
            </div>
            <FaqSection />
          </main>
          <Footer />
        </div>
      </div>
    </LocaleProvider>
  )
}
