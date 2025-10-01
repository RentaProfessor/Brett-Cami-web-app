"use client"

import { useState, useEffect } from "react"
import { Sun, Moon } from "lucide-react"

interface ClockCloudProps {
  name: string
  timezone: string
}

export function ClockCloud({ name, timezone }: ClockCloudProps) {
  const [time, setTime] = useState(new Date())

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)

    return () => clearInterval(interval)
  }, [])

  const formatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
  })

  const dateFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: timezone,
    weekday: "long",
    month: "long",
    day: "numeric",
  })

  const timeString = formatter.format(time)
  const dateString = dateFormatter.format(time)
  const hour = Number.parseInt(
    new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      hour: "2-digit",
      hour12: false,
    }).format(time),
  )
  const isDaytime = hour >= 6 && hour < 18

  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-6 md:p-8 shadow-xl border-2 border-pink-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-serif text-2xl md:text-3xl text-pink-600">{name} Time</h3>
        {isDaytime ? <Sun className="w-8 h-8 text-yellow-500" /> : <Moon className="w-8 h-8 text-purple-400" />}
      </div>

      <div className="text-center space-y-2">
        <div
          className="font-sans text-4xl md:text-5xl font-bold text-pink-700"
          style={{ textShadow: "0 0 20px rgba(249, 179, 209, 0.5)" }}
        >
          {timeString}
        </div>
        <div className="font-sans text-sm md:text-base text-muted-foreground">{dateString}</div>
        <div className="text-xs text-muted-foreground">{timezone.split("/")[1].replace("_", " ")}</div>
      </div>
    </div>
  )
}
