"use client"

import { useState } from "react"
import { Mail } from "lucide-react"
import type { Letter } from "./letters-section"

interface EnvelopeProps {
  letter: Letter
  onOpen: () => void
}

export function Envelope({ letter, onOpen }: EnvelopeProps) {
  const [isOpening, setIsOpening] = useState(false)

  const handleClick = () => {
    setIsOpening(true)
    setTimeout(() => {
      onOpen()
      setIsOpening(false)
    }, 600)
  }

  return (
    <button onClick={handleClick} className="relative group" style={{ animation: "float 3s ease-in-out infinite" }}>
      <div
        className={`bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg p-8 shadow-xl border-2 border-pink-400 transition-transform duration-500 ${
          isOpening ? "scale-110 rotate-12" : ""
        }`}
      >
        <Mail className="w-24 h-24 text-pink-600 mx-auto" />
        <div className="mt-4 text-center">
          <div className="font-serif text-xl text-pink-700">From {letter.sender}</div>
          <div className="font-sans text-sm text-pink-600 mt-1">Click to open</div>
        </div>
      </div>

      {/* Seal */}
      <div
        className={`absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 bg-red-500 rounded-full flex items-center justify-center shadow-lg transition-all duration-500 ${
          isOpening ? "scale-0 opacity-0" : ""
        }`}
      >
        <span className="text-white text-2xl">💕</span>
      </div>
    </button>
  )
}
