"use client"

import { CountdownCloud } from "./countdown-cloud"
import { ClockCloud } from "./clock-cloud"

export function HomeSection() {
  return (
    <section id="home" className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-4xl w-full space-y-12">
        <CountdownCloud />

        <div className="grid md:grid-cols-2 gap-8">
          <ClockCloud name="Cami" timezone="Europe/London" />
          <ClockCloud name="Brett" timezone="America/Los_Angeles" />
        </div>

        <p className="text-center font-serif text-3xl md:text-4xl text-pink-700 mt-12">Always under the same sky</p>
      </div>
    </section>
  )
}
