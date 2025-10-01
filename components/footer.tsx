"use client"

import { useState } from "react"
import { Play, Pause, Music } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Footer() {
  const [isPlaying, setIsPlaying] = useState(false)

  return (
    <footer className="relative z-10 bg-white/80 backdrop-blur-sm border-t border-pink-200 py-6">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3 bg-pink-50 rounded-full px-6 py-3 border-2 border-pink-200">
            <Music className="w-5 h-5 text-pink-500" />
            <span className="font-serif text-pink-600">Our Song</span>
            <Button
              onClick={() => setIsPlaying(!isPlaying)}
              size="icon"
              variant="ghost"
              className="w-8 h-8 rounded-full hover:bg-pink-100"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-pink-600" /> : <Play className="w-4 h-4 text-pink-600" />}
            </Button>
          </div>

          <p className="font-sans text-sm text-muted-foreground text-center">
            Made with love across <span className="text-pink-600 font-semibold">London</span> &{" "}
            <span className="text-pink-600 font-semibold">Los Angeles</span> 💕
          </p>
        </div>
      </div>
    </footer>
  )
}
