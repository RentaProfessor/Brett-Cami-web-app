"use client"

import { CalendarBoard } from "./calendar-board"

export function CalendarSection() {
  return (
    <section id="calendar" className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-7xl w-full">
        <h2 className="font-serif text-4xl md:text-6xl text-center text-pink-600 mb-12">Our Calendar</h2>
        <CalendarBoard />
      </div>
    </section>
  )
}
