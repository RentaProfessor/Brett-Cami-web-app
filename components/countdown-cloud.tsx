"use client"

import { useState } from "react"
import { Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useCountdown } from "@/hooks/useCountdown"

export function CountdownCloud() {
  const { countdown, targetDate, loading, updateReunionDate } = useCountdown()
  const [isOpen, setIsOpen] = useState(false)
  const [dateInput, setDateInput] = useState("")
  const [updating, setUpdating] = useState(false)

  const handleDateChange = async () => {
    if (dateInput) {
      setUpdating(true)
      const success = await updateReunionDate(new Date(dateInput))
      if (success) {
        setIsOpen(false)
        setDateInput("")
      }
      setUpdating(false)
    }
  }

  if (loading) {
    return (
      <div className="relative">
        <div className="bg-white/90 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-pink-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-pink-600 font-medium">Loading countdown...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative">
      <div
        className="bg-white/90 backdrop-blur-sm rounded-[3rem] p-8 md:p-12 shadow-2xl border-4 border-pink-200"
        style={{ animation: "pulse-glow 3s ease-in-out infinite" }}
      >
        <h2 className="font-serif text-3xl md:text-5xl text-center text-pink-600 mb-6">
          Time until we see each other again
        </h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-6">
          {[
            { value: countdown.days, label: "Days" },
            { value: countdown.hours, label: "Hours" },
            { value: countdown.minutes, label: "Minutes" },
            { value: countdown.seconds, label: "Seconds" },
          ].map((item, index) => (
            <div key={index} className="bg-gradient-to-br from-pink-100 to-purple-100 rounded-2xl p-4 text-center">
              <div className="font-sans text-4xl md:text-5xl font-bold text-pink-700">
                {item.value.toString().padStart(2, "0")}
              </div>
              <div className="font-sans text-sm md:text-base text-muted-foreground mt-1">{item.label}</div>
            </div>
          ))}
        </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" className="mx-auto flex items-center gap-2 bg-white/80 hover:bg-white">
              <Calendar className="w-4 h-4" />
              Edit date
            </Button>
          </DialogTrigger>
          <DialogContent className="bg-white">
            <DialogHeader>
              <DialogTitle className="font-serif text-2xl text-pink-600">Set Reunion Date</DialogTitle>
            </DialogHeader>
            <div className="space-y-4 py-4">
              <div className="space-y-2">
                <Label htmlFor="date">Choose a date</Label>
                <Input
                  id="date"
                  type="datetime-local"
                  value={dateInput}
                  onChange={(e) => setDateInput(e.target.value)}
                />
              </div>
              <Button 
                onClick={handleDateChange} 
                className="w-full bg-pink-500 hover:bg-pink-600 text-white"
                disabled={updating}
              >
                {updating ? 'Saving...' : 'Save Date'}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
