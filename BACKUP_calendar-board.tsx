"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarToolbar } from "./calendar-toolbar"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { ListView } from "./list-view"
import { EventModal } from "./event-modal"
import { RequestCallModal } from "./request-call-modal"
import { RequestsDrawer } from "./requests-drawer"
import { useAuth } from "@/contexts/AuthProvider"

export interface CalendarEvent {
  id: string
  title: string
  description: string
  location: string
  start: Date
  end: Date
  owner: "Cami" | "Brett" | "Joint"
  visibility: "Shared" | "Private"
  color: string
}

export interface CallRequest {
  id: string
  from: "Cami" | "Brett"
  to: "Cami" | "Brett"
  duration: number
  preferredSlots: { start: Date; end: Date }[]
  status: "Pending" | "Accepted" | "Declined"
  createdAt: Date
}

const mockEvents: CalendarEvent[] = [
  {
    id: "1",
    title: "Video Call Date",
    description: "Our weekly catch-up call",
    location: "Zoom",
    start: new Date("2025-02-01T19:00:00"),
    end: new Date("2025-02-01T21:00:00"),
    owner: "Joint",
    visibility: "Shared",
    color: "bg-pink-400",
  },
  {
    id: "2",
    title: "Cami's Work Presentation",
    description: "Big presentation at work",
    location: "London Office",
    start: new Date("2025-02-05T10:00:00"),
    end: new Date("2025-02-05T11:30:00"),
    owner: "Cami",
    visibility: "Shared",
    color: "bg-purple-400",
  },
]

export function CalendarBoard() {
  const [events, setEvents] = useState<CalendarEvent[]>(mockEvents)
  const [view, setView] = useState<"month" | "week" | "list">("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isCallModalOpen, setIsCallModalOpen] = useState(false)
  const [isRequestsDrawerOpen, setIsRequestsDrawerOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const { user } = useAuth()
  
  // Get current user name
  const currentUserName = user?.user_metadata?.name || "Unknown"

  const handleAddEvent = (event: Omit<CalendarEvent, "id">) => {
    const newEvent: CalendarEvent = {
      ...event,
      id: Date.now().toString(),
    }
    setEvents([...events, newEvent])
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setEvents(events.map((e) => (e.id === event.id ? event : e)))
  }

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id))
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-pink-200">
      <Tabs value="joint" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 bg-pink-100">
          <TabsTrigger value="joint" className="font-sans">
            Joint Events
          </TabsTrigger>
          <TabsTrigger value="partner" className="font-sans">
            {currentUserName}'s Events
          </TabsTrigger>
        </TabsList>

        <CalendarToolbar
          view={view}
          onViewChange={setView}
          currentDate={currentDate}
          onDateChange={setCurrentDate}
          onAddEvent={() => setIsEventModalOpen(true)}
          onRequestCall={() => setIsCallModalOpen(true)}
          onOpenRequests={() => setIsRequestsDrawerOpen(true)}
        />

        <TabsContent value="joint" className="space-y-4">
          {view === "month" && <MonthView events={events} currentDate={currentDate} onSelectEvent={setSelectedEvent} />}
          {view === "week" && <WeekView events={events} currentDate={currentDate} onSelectEvent={setSelectedEvent} />}
          {view === "list" && (
            <ListView
              events={events}
              onSelectEvent={setSelectedEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}
        </TabsContent>

        <TabsContent value="partner" className="space-y-4">
          {view === "month" && (
            <MonthView
              events={events.filter((e) => e.owner === currentUserName)}
              currentDate={currentDate}
              onSelectEvent={setSelectedEvent}
            />
          )}
          {view === "week" && (
            <WeekView
              events={events.filter((e) => e.owner === currentUserName)}
              currentDate={currentDate}
              onSelectEvent={setSelectedEvent}
            />
          )}
          {view === "list" && (
            <ListView
              events={events.filter((e) => e.owner === currentUserName)}
              onSelectEvent={setSelectedEvent}
              onEditEvent={handleEditEvent}
              onDeleteEvent={handleDeleteEvent}
            />
          )}
        </TabsContent>
      </Tabs>

      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false)
          setSelectedEvent(null)
        }}
        onSave={handleAddEvent}
        event={selectedEvent}
      />

      <RequestCallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />

      <RequestsDrawer isOpen={isRequestsDrawerOpen} onClose={() => setIsRequestsDrawerOpen(false)} />
    </div>
  )
}
