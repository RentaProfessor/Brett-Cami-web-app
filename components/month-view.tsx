"use client"

import { Trash2 } from "lucide-react"
import type { CalendarEvent } from "./calendar-board"

interface MonthViewProps {
  events: CalendarEvent[]
  currentDate: Date
  onSelectEvent: (event: CalendarEvent) => void
  onDeleteEvent?: (id: string) => void
}

export function MonthView({ events, currentDate, onSelectEvent, onDeleteEvent }: MonthViewProps) {
  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const startDate = new Date(firstDay)
  startDate.setDate(startDate.getDate() - firstDay.getDay())

  const days = []
  const current = new Date(startDate)

  for (let i = 0; i < 42; i++) {
    days.push(new Date(current))
    current.setDate(current.getDate() + 1)
  }

  const monthName = new Intl.DateTimeFormat("en-US", {
    month: "long",
    year: "numeric",
  }).format(currentDate)

  return (
    <div className="space-y-4">
      <h3 className="font-serif text-2xl text-pink-600 text-center">{monthName}</h3>

      <div className="grid grid-cols-7 gap-2">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <div key={day} className="text-center font-sans text-sm font-semibold text-muted-foreground p-2">
            {day}
          </div>
        ))}

        {days.map((day, index) => {
          const isCurrentMonth = day.getMonth() === month
          const isToday = day.toDateString() === new Date().toDateString()
          const dayEvents = events.filter((event) => {
            const eventDate = new Date(event.start)
            return eventDate.toDateString() === day.toDateString()
          })

          return (
            <div
              key={index}
              className={`min-h-24 p-2 rounded-lg border ${
                isCurrentMonth ? "bg-white border-pink-200" : "bg-gray-50 border-gray-200"
              } ${isToday ? "ring-2 ring-pink-500" : ""}`}
            >
              <div
                className={`text-sm font-sans mb-1 ${
                  isToday
                    ? "bg-pink-500 text-white w-6 h-6 rounded-full flex items-center justify-center"
                    : isCurrentMonth
                      ? "text-foreground"
                      : "text-muted-foreground"
                }`}
              >
                {day.getDate()}
              </div>

              <div className="space-y-1">
                {dayEvents.slice(0, 2).map((event) => (
                  <div key={event.id} className="flex items-center gap-1">
                    <button
                      onClick={() => onSelectEvent(event)}
                      className={`flex-1 text-left text-xs p-1 rounded ${event.color} text-white truncate hover:opacity-80`}
                    >
                      {event.title}
                    </button>
                    {onDeleteEvent && (
                      <button
                        onClick={(e) => {
                          e.stopPropagation()
                          onDeleteEvent(event.id)
                        }}
                        className="text-red-500 hover:text-red-700 p-1"
                        title="Delete event"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    )}
                  </div>
                ))}
                {dayEvents.length > 2 && (
                  <div className="text-xs text-muted-foreground">+{dayEvents.length - 2} more</div>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
