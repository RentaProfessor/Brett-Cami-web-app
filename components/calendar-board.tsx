"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CalendarToolbar } from "./calendar-toolbar"
import { MonthView } from "./month-view"
import { WeekView } from "./week-view"
import { ListView } from "./list-view"
import { EventModal } from "./event-modal"
import { RequestCallModal } from "./request-call-modal"
import { RequestsDrawer } from "./requests-drawer"
import { useAuth } from "@/contexts/AuthProvider"
import { useEvents, type Event } from "@/hooks/useEvents"

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

// Helper function to convert database Event to CalendarEvent
const convertToCalendarEvent = (event: Event): CalendarEvent => {
  const colorMap = {
    Cami: "bg-purple-400",
    Brett: "bg-blue-400",
    Joint: "bg-pink-400",
  }
  
  // Determine owner based on owner name from the database
  let owner: "Cami" | "Brett" | "Joint" = "Joint"
  
  // Safely check if event.owner exists and has a name
  if (event.owner && event.owner.name) {
    if (event.owner.name === "Cami") {
      owner = "Cami"
    } else if (event.owner.name === "Brett") {
      owner = "Brett"
    }
  }
  
  // If it's shared, it's a joint event regardless of owner
  if (event.is_shared) {
    owner = "Joint"
  }
  
  return {
    id: event.id,
    title: event.title,
    description: event.description || "",
    location: "", // Not stored in database yet
    start: new Date(event.start_time),
    end: new Date(event.end_time),
    owner,
    visibility: event.is_shared ? "Shared" : "Private",
    color: colorMap[owner],
  }
}

export function CalendarBoard() {
  const [view, setView] = useState<"month" | "week" | "list">("month")
  const [currentDate, setCurrentDate] = useState(new Date())
  const [isEventModalOpen, setIsEventModalOpen] = useState(false)
  const [isCallModalOpen, setIsCallModalOpen] = useState(false)
  const [isRequestsDrawerOpen, setIsRequestsDrawerOpen] = useState(false)
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null)
  const [useDatabase, setUseDatabase] = useState(true) // Default to database
  const { user } = useAuth()
  
  // Try to use database, fallback to mock data if it fails
  const { events: dbEvents, createEvent, updateEvent, deleteEvent, loading } = useEvents()
  
  // Get current user name
  const currentUserName = user?.user_metadata?.name || "Unknown"
  
  // Convert database events to calendar events, fallback to mock if database fails
  const events = useDatabase && dbEvents.length >= 0 
    ? dbEvents.map(convertToCalendarEvent)
    : mockEvents

  const handleSaveEvent = async (eventData: Omit<CalendarEvent, "id">) => {
    // Check if user is authenticated before attempting database operations
    if (!user) {
      console.log('User not authenticated, using local storage')
      setUseDatabase(false)
    }

    if (selectedEvent) {
      // Editing existing event
      if (useDatabase && updateEvent && user) {
        const result = await updateEvent(selectedEvent.id, {
          title: eventData.title,
          description: eventData.description,
          start_time: eventData.start.toISOString(),
          end_time: eventData.end.toISOString(),
          is_shared: eventData.visibility === "Shared",
        })
        
        if (result.success) {
          console.log('Event updated in database')
          return
        } else {
          console.error('Database update failed, falling back to local storage:', result.error)
          setUseDatabase(false)
        }
      }
      
      // Fallback to local storage for edit
      const existingEvents = JSON.parse(localStorage.getItem('calendar-events') || '[]')
      const updatedEvents = existingEvents.map((e: CalendarEvent) => 
        e.id === selectedEvent.id ? { ...eventData, id: selectedEvent.id } : e
      )
      localStorage.setItem('calendar-events', JSON.stringify(updatedEvents))
    } else {
      // Creating new event
      if (useDatabase && createEvent && user) {
        const result = await createEvent({
          title: eventData.title,
          description: eventData.description,
          start_time: eventData.start.toISOString(),
          end_time: eventData.end.toISOString(),
          is_shared: eventData.visibility === "Shared",
        })
        
        if (result.success) {
          console.log('Event saved to database')
          return
        } else {
          console.error('Database save failed, falling back to local storage:', result.error)
          setUseDatabase(false)
        }
      }
      
      // Fallback to local storage for create
      const newEvent: CalendarEvent = {
        ...eventData,
        id: Date.now().toString(),
      }
      const existingEvents = JSON.parse(localStorage.getItem('calendar-events') || '[]')
      const updatedEvents = [...existingEvents, newEvent]
      localStorage.setItem('calendar-events', JSON.stringify(updatedEvents))
    }
  }

  const handleEditEvent = (event: CalendarEvent) => {
    setSelectedEvent(event)
    setIsEventModalOpen(true)
  }

  const handleDeleteEvent = async (id: string) => {
    if (useDatabase && deleteEvent && user) {
      const result = await deleteEvent(id)
      if (result.success) {
        console.log('Event deleted from database')
        return
      } else {
        console.error('Database delete failed, falling back to local storage:', result.error)
        setUseDatabase(false)
      }
    }
    
    // Fallback to local storage
    const existingEvents = JSON.parse(localStorage.getItem('calendar-events') || '[]')
    const updatedEvents = existingEvents.filter((e: CalendarEvent) => e.id !== id)
    localStorage.setItem('calendar-events', JSON.stringify(updatedEvents))
  }

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-2xl border-2 border-pink-200">
      {/* Database Toggle Button */}
      <div className="mb-4 flex justify-between items-center">
        {!user && (
          <div className="text-sm text-amber-600 bg-amber-50 px-3 py-2 rounded-lg border border-amber-200">
            ⚠️ Please log in to use database features
          </div>
        )}
        <button
          onClick={() => setUseDatabase(!useDatabase)}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
            useDatabase && user
              ? 'bg-green-100 text-green-700 border border-green-300' 
              : 'bg-gray-100 text-gray-700 border border-gray-300'
          }`}
          disabled={!user}
        >
          {useDatabase && user ? '🗄️ Database Mode' : '💾 Local Storage Mode'}
        </button>
      </div>
      
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
          {view === "month" && <MonthView events={events} currentDate={currentDate} onSelectEvent={setSelectedEvent} onDeleteEvent={handleDeleteEvent} />}
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
              onDeleteEvent={handleDeleteEvent}
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
        onSave={handleSaveEvent}
        onDelete={handleDeleteEvent}
        event={selectedEvent}
      />

      <RequestCallModal isOpen={isCallModalOpen} onClose={() => setIsCallModalOpen(false)} />

      <RequestsDrawer isOpen={isRequestsDrawerOpen} onClose={() => setIsRequestsDrawerOpen(false)} />
    </div>
  )
}