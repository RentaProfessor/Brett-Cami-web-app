"use client"

import { Button } from "@/components/ui/button"
import { Edit, Trash2, MapPin, Clock } from "lucide-react"
import type { CalendarEvent } from "./calendar-board"

interface ListViewProps {
  events: CalendarEvent[]
  onSelectEvent: (event: CalendarEvent) => void
  onEditEvent: (event: CalendarEvent) => void
  onDeleteEvent: (id: string) => void
}

export function ListView({ events, onSelectEvent, onEditEvent, onDeleteEvent }: ListViewProps) {
  const sortedEvents = [...events].sort((a, b) => a.start.getTime() - b.start.getTime())

  return (
    <div className="space-y-4">
      {sortedEvents.map((event) => (
        <div
          key={event.id}
          className="bg-white rounded-lg p-4 border-2 border-pink-200 hover:border-pink-300 transition-colors"
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-2">
                <div className={`w-3 h-3 rounded-full ${event.color}`} />
                <h4 className="font-sans font-semibold text-lg">{event.title}</h4>
                <span className="text-xs bg-pink-100 text-pink-700 px-2 py-1 rounded-full">{event.owner}</span>
              </div>

              {event.description && <p className="text-sm text-muted-foreground mb-2">{event.description}</p>}

              <div className="flex flex-col gap-1 text-sm text-muted-foreground">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  <span>
                    {new Intl.DateTimeFormat("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                    }).format(event.start)}{" "}
                    -{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      timeStyle: "short",
                    }).format(event.end)}
                  </span>
                </div>

                {event.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    <span>{event.location}</span>
                  </div>
                )}

                <div className="text-xs mt-2">
                  <div>
                    London:{" "}
                    {new Intl.DateTimeFormat("en-GB", {
                      timeZone: "Europe/London",
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(event.start)}
                  </div>
                  <div>
                    Los Angeles:{" "}
                    {new Intl.DateTimeFormat("en-US", {
                      timeZone: "America/Los_Angeles",
                      dateStyle: "short",
                      timeStyle: "short",
                    }).format(event.start)}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={() => onSelectEvent(event)} variant="outline" size="icon">
                <Edit className="w-4 h-4" />
              </Button>
              <Button
                onClick={() => onDeleteEvent(event.id)}
                variant="outline"
                size="icon"
                className="text-destructive hover:text-destructive"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      ))}

      {sortedEvents.length === 0 && (
        <div className="text-center py-12 text-muted-foreground">No events scheduled yet. Add your first event!</div>
      )}
    </div>
  )
}
