"use client"

import { Heart } from "lucide-react"

interface LoveCounterProps {
  count: number
}

export function LoveCounter({ count }: LoveCounterProps) {
  return (
    <div className="bg-white/90 backdrop-blur-sm rounded-full px-8 py-4 shadow-lg border-2 border-pink-300 flex items-center gap-3">
      <Heart className="w-6 h-6 text-pink-500 fill-pink-500 animate-pulse" />
      <div className="font-sans">
        <span className="text-3xl font-bold text-pink-600">{count}</span>
        <span className="text-sm text-muted-foreground ml-2">letters exchanged</span>
      </div>
    </div>
  )
}
