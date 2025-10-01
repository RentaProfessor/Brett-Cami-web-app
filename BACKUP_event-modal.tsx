"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { useAuth } from "@/contexts/AuthProvider"
import type { CalendarEvent } from "./calendar-board"

interface EventModalProps {
  isOpen: boolean
  onClose: () => void
  onSave: (event: Omit<CalendarEvent, "id">) => void
  event?: CalendarEvent | null
}

export function EventModal({ isOpen, onClose, onSave, event }: EventModalProps) {
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [location, setLocation] = useState("")
  const [start, setStart] = useState("")
  const [end, setEnd] = useState("")
  const [owner, setOwner] = useState<"Cami" | "Brett" | "Joint">("Joint")
  const [visibility, setVisibility] = useState<"Shared" | "Private">("Shared")
  const [showBothTimezones, setShowBothTimezones] = useState(true)
  const { user } = useAuth()
  
  // Get current user name
  const currentUserName = user?.user_metadata?.name || "Unknown"

  useEffect(() => {
    if (event) {
      setTitle(event.title)
      setDescription(event.description)
      setLocation(event.location)
      setStart(new Date(event.start).toISOString().slice(0, 16))
      setEnd(new Date(event.end).toISOString().slice(0, 16))
      setOwner(event.owner)
      setVisibility(event.visibility)
    } else {
      setTitle("")
      setDescription("")
      setLocation("")
      setStart("")
      setEnd("")
      // Set owner to current user by default for new events
      setOwner(currentUserName as "Cami" | "Brett" | "Joint" || "Joint")
      setVisibility("Shared")
    }
  }, [event, isOpen, currentUserName])

  const handleSave = () => {
    if (!title || !start || !end) return

    const colorMap = {
      Cami: "bg-purple-400",
      Brett: "bg-blue-400",
      Joint: "bg-pink-400",
    }

    onSave({
      title,
      description,
      location,
      start: new Date(start),
      end: new Date(end),
      owner,
      visibility,
      color: colorMap[owner],
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-white">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-pink-600">
            {event ? "Edit Event" : "Add New Event"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="title">Title *</Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Event title" />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Event description"
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">Location</Label>
            <Input
              id="location"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              placeholder="Event location"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="start">Start *</Label>
              <Input id="start" type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>

            <div className="space-y-2">
              <Label htmlFor="end">End *</Label>
              <Input id="end" type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="owner">Owner</Label>
              <Select value={owner} onValueChange={(v) => setOwner(v as any)}>
                <SelectTrigger id="owner">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value={currentUserName}>{currentUserName}</SelectItem>
                  <SelectItem value="Joint">Joint</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="visibility">Visibility</Label>
              <Select value={visibility} onValueChange={(v) => setVisibility(v as any)}>
                <SelectTrigger id="visibility">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Shared">Shared</SelectItem>
                  <SelectItem value="Private">Private</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex items-center justify-between">
            <Label htmlFor="timezones">Show in both time zones</Label>
            <Switch id="timezones" checked={showBothTimezones} onCheckedChange={setShowBothTimezones} />
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSave} className="flex-1 bg-pink-500 hover:bg-pink-600">
              {event ? "Update Event" : "Add Event"}
            </Button>
            <Button onClick={onClose} variant="outline" className="flex-1 bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
