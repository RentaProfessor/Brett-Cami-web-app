"use client"

import { CloudBackdrop } from "@/components/cloud-backdrop"
import { StickyNav } from "@/components/sticky-nav"
import { HomeSection } from "@/components/home-section"
import { LettersSection } from "@/components/letters-section"
import { CalendarSection } from "@/components/calendar-section"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <CloudBackdrop />
      <StickyNav />

      <main className="relative z-10">
        <HomeSection />
        <LettersSection />
        <CalendarSection />
      </main>

      <Footer />
    </div>
  )
}
