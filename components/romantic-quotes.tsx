"use client"

import { useEffect, useState } from "react"

const quotes = [
  "Distance means so little when someone means so much.",
  "I carry your heart with me (I carry it in my heart).",
  "In all the world, there is no heart for me like yours.",
  "Love knows not distance; it hath no continent.",
  "The best and most beautiful things cannot be seen or touched, they must be felt with the heart.",
]

export function RomanticQuotes() {
  const [currentQuote, setCurrentQuote] = useState(0)

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentQuote((prev) => (prev + 1) % quotes.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="text-center px-4">
      <p
        className="font-serif text-xl md:text-2xl text-pink-600 italic transition-opacity duration-1000"
        key={currentQuote}
      >
        "{quotes[currentQuote]}"
      </p>
    </div>
  )
}
