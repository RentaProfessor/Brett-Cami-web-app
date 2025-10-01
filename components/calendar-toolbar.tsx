"use client"

import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, Plus, Phone, CalendarIcon, List, Columns, Bell } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface CalendarToolbarProps {
  view: "month" | "week" | "list"
  onViewChange: (view: "month" | "week" | "list") => void
  currentDate: Date
  onDateChange: (date: Date) => void
  onAddEvent: () => void
  onRequestCall: () => void
  onOpenRequests: () => void
}

export function CalendarToolbar({
  view,
  onViewChange,
  currentDate,
  onDateChange,
  onAddEvent,
  onRequestCall,
  onOpenRequests,
}: CalendarToolbarProps) {
  const goToPrevious = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() - 1)
    } else {
      newDate.setDate(newDate.getDate() - 7)
    }
    onDateChange(newDate)
  }

  const goToNext = () => {
    const newDate = new Date(currentDate)
    if (view === "month") {
      newDate.setMonth(newDate.getMonth() + 1)
    } else {
      newDate.setDate(newDate.getDate() + 7)
    }
    onDateChange(newDate)
  }

  const goToToday = () => {
    onDateChange(new Date())
  }

  return (
    <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
      <div className="flex items-center gap-2 flex-wrap">
        <Button onClick={onAddEvent} className="bg-pink-500 hover:bg-pink-600">
          <Plus className="w-4 h-4 mr-2" />
          Add Event
        </Button>
        <Button onClick={onRequestCall} variant="outline" className="border-pink-300 bg-transparent">
          <Phone className="w-4 h-4 mr-2" />
          Request Call
        </Button>
        <Button onClick={onOpenRequests} variant="outline" className="border-pink-300 bg-transparent">
          <Bell className="w-4 h-4 mr-2" />
          Requests
        </Button>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <div className="flex items-center gap-1">
          <Button onClick={goToPrevious} variant="outline" size="icon">
            <ChevronLeft className="w-4 h-4" />
          </Button>
          <Button onClick={goToToday} variant="outline">
            Today
          </Button>
          <Button onClick={goToNext} variant="outline" size="icon">
            <ChevronRight className="w-4 h-4" />
          </Button>
        </div>

        <Select value={view} onValueChange={(v) => onViewChange(v as any)}>
          <SelectTrigger className="w-32">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="month">
              <div className="flex items-center gap-2">
                <CalendarIcon className="w-4 h-4" />
                Month
              </div>
            </SelectItem>
            <SelectItem value="week">
              <div className="flex items-center gap-2">
                <Columns className="w-4 h-4" />
                Week
              </div>
            </SelectItem>
            <SelectItem value="list">
              <div className="flex items-center gap-2">
                <List className="w-4 h-4" />
                List
              </div>
            </SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-4 text-sm font-sans">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-purple-400" />
          <span>Cami</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-blue-400" />
          <span>Brett</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-pink-400" />
          <span>Joint</span>
        </div>
      </div>
    </div>
  )
}
