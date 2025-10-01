"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Phone } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthProvider"

interface RequestCallModalProps {
  isOpen: boolean
  onClose: () => void
}

export function RequestCallModal({ isOpen, onClose }: RequestCallModalProps) {
  const [duration, setDuration] = useState("60")
  const [preferredDate, setPreferredDate] = useState("")
  const [preferredTime, setPreferredTime] = useState("")
  const { toast } = useToast()
  const { user } = useAuth()
  
  // Get requester name from authenticated user
  const from = user?.user_metadata?.name || "Unknown"

  const handleSend = () => {
    if (!preferredDate || !preferredTime) {
      toast({
        title: "Missing information",
        description: "Please select a preferred date and time.",
        variant: "destructive",
      })
      return
    }

    toast({
      title: "Call request sent! 📞",
      description: "Your partner will be notified.",
    })

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl text-pink-600 flex items-center gap-2">
            <Phone className="w-6 h-6" />
            Request a Call
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="from">From</Label>
            <div className="p-3 bg-pink-100 rounded-md border border-pink-200">
              <span className="font-medium text-pink-700">{from}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="duration">Duration (minutes)</Label>
            <Select value={duration} onValueChange={setDuration}>
              <SelectTrigger id="duration">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="30">30 minutes</SelectItem>
                <SelectItem value="60">1 hour</SelectItem>
                <SelectItem value="90">1.5 hours</SelectItem>
                <SelectItem value="120">2 hours</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="date">Preferred Date</Label>
            <Input id="date" type="date" value={preferredDate} onChange={(e) => setPreferredDate(e.target.value)} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="time">Preferred Time (Your timezone)</Label>
            <Input id="time" type="time" value={preferredTime} onChange={(e) => setPreferredTime(e.target.value)} />
          </div>

          {preferredDate && preferredTime && (
            <div className="bg-pink-50 rounded-lg p-4 space-y-1 text-sm">
              <div className="font-semibold text-pink-700">Time in both zones:</div>
              <div>
                London:{" "}
                {new Intl.DateTimeFormat("en-GB", {
                  timeZone: "Europe/London",
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(`${preferredDate}T${preferredTime}`))}
              </div>
              <div>
                Los Angeles:{" "}
                {new Intl.DateTimeFormat("en-US", {
                  timeZone: "America/Los_Angeles",
                  dateStyle: "medium",
                  timeStyle: "short",
                }).format(new Date(`${preferredDate}T${preferredTime}`))}
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={handleSend} className="flex-1 bg-pink-500 hover:bg-pink-600">
              Send Request
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
