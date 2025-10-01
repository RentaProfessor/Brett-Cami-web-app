"use client"

import type { CalendarEvent } from "./calendar-board"

interface WeekViewProps {
  events: CalendarEvent[]
  currentDate: Date
  onSelectEvent: (event: CalendarEvent) => void
}

export function WeekView({ events, currentDate, onSelectEvent }: WeekViewProps) {
  const startOfWeek = new Date(currentDate)
  startOfWeek.setDate(currentDate.getDate() - currentDate.getDay())

  const days = Array.from({ length: 7 }, (_, i) => {
    const day = new Date(startOfWeek)
    day.setDate(startOfWeek.getDate() + i)
    return day
  })

  const hours = Array.from({ length: 24 }, (_, i) => i)

  return (
    <div className="overflow-x-auto">
      <div className="min-w-[800px]">
        <div className="grid grid-cols-8 gap-2 mb-2">
          <div className="text-sm font-sans font-semibold text-muted-foreground" />
          {days.map((day, index) => {
            const isToday = day.toDateString() === new Date().toDateString()
            return (
              <div key={index} className={`text-center p-2 rounded-lg ${isToday ? "bg-pink-100" : ""}`}>
                <div className="text-sm font-sans font-semibold">
                  {new Intl.DateTimeFormat("en-US", {
                    weekday: "short",
                  }).format(day)}
                </div>
                <div
                  className={`text-lg font-sans ${
                    isToday
                      ? "bg-pink-500 text-white w-8 h-8 rounded-full flex items-center justify-center mx-auto"
                      : ""
                  }`}
                >
                  {day.getDate()}
                </div>
              </div>
            )
          })}
        </div>

        <div className="grid grid-cols-8 gap-2">
          <div className="space-y-16">
            {hours.map((hour) => (
              <div key={hour} className="text-xs font-sans text-muted-foreground text-right pr-2">
                {hour.toString().padStart(2, "0")}:00
              </div>
            ))}
          </div>

          {days.map((day, dayIndex) => (
            <div key={dayIndex} className="space-y-16 relative">
              {hours.map((hour) => (
                <div key={hour} className="border-t border-pink-100 h-16" />
              ))}

              {events
                .filter((event) => {
                  const eventDate = new Date(event.start)
                  return eventDate.toDateString() === day.toDateString()
                })
                .map((event) => {
                  const start = new Date(event.start)
                  const end = new Date(event.end)
                  const startHour = start.getHours() + start.getMinutes() / 60
                  const duration = (end.getTime() - start.getTime()) / (1000 * 60 * 60)

                  return (
                    <button
                      key={event.id}
                      onClick={() => onSelectEvent(event)}
                      className={`absolute left-0 right-0 ${event.color} text-white p-2 rounded text-xs hover:opacity-80`}
                      style={{
                        top: `${startHour * 4}rem`,
                        height: `${duration * 4}rem`,
                      }}
                    >
                      <div className="font-semibold">{event.title}</div>
                      <div className="text-xs opacity-90">
                        {new Intl.DateTimeFormat("en-US", {
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(start)}
                      </div>
                    </button>
                  )
                })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
