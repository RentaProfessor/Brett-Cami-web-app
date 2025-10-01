"use client"

import { useState } from "react"
import { Envelope } from "./envelope"
import { ComposeLetterModal } from "./compose-letter-modal"
import { LoveCounter } from "./love-counter"
import { RomanticQuotes } from "./romantic-quotes"
import { ArchiveRibbon } from "./archive-ribbon"
import { Button } from "@/components/ui/button"
import { PenLine } from "lucide-react"

export interface Letter {
  id: string
  sender: "Cami" | "Brett"
  recipient: "Cami" | "Brett"
  subject: string
  body: string
  timestamp: Date
  isRead: boolean
}

const mockLetters: Letter[] = [
  {
    id: "1",
    sender: "Cami",
    recipient: "Brett",
    subject: "Missing You",
    body: "My dearest Brett,\n\nEvery moment without you feels like an eternity. I find myself thinking about our last video call and how your smile brightens even the cloudiest London day. Can't wait until we're together again.\n\nAll my love,\nCami 💕",
    timestamp: new Date("2025-01-15T14:30:00"),
    isRead: true,
  },
  {
    id: "2",
    sender: "Brett",
    recipient: "Cami",
    subject: "Good Morning Beautiful",
    body: "Hey love,\n\nJust wanted to send you a quick note before you start your day. I know it's already afternoon there, but I hope you're having an amazing day. Counting down the days until I can hold you again.\n\nLove always,\nBrett ❤️",
    timestamp: new Date("2025-01-20T08:15:00"),
    isRead: true,
  },
]

export function LettersSection() {
  const [letters, setLetters] = useState<Letter[]>(mockLetters)
  const [selectedLetter, setSelectedLetter] = useState<Letter | null>(null)
  const [isComposeOpen, setIsComposeOpen] = useState(false)

  const handleSendLetter = (letter: Omit<Letter, "id" | "timestamp" | "isRead">) => {
    const newLetter: Letter = {
      ...letter,
      id: Date.now().toString(),
      timestamp: new Date(),
      isRead: false,
    }
    setLetters([newLetter, ...letters])
  }

  return (
    <section id="letters" className="min-h-screen flex flex-col items-center justify-center px-4 py-20">
      <div className="max-w-6xl w-full space-y-12">
        <h2 className="font-serif text-4xl md:text-6xl text-center text-pink-600 mb-8">Love Letters</h2>

        <RomanticQuotes />

        <div className="flex flex-col items-center gap-8">
          <LoveCounter count={letters.length} />

          <div className="relative">
            <Envelope letter={letters[0]} onOpen={() => setSelectedLetter(letters[0])} />
          </div>

          <Button
            onClick={() => setIsComposeOpen(true)}
            size="lg"
            className="bg-pink-500 hover:bg-pink-600 text-white font-sans text-lg px-8 py-6 rounded-full shadow-lg"
          >
            <PenLine className="w-5 h-5 mr-2" />
            Write a Letter 💌
          </Button>
        </div>

        <ArchiveRibbon letters={letters} onSelectLetter={setSelectedLetter} />

        <ComposeLetterModal isOpen={isComposeOpen} onClose={() => setIsComposeOpen(false)} onSend={handleSendLetter} />

        {selectedLetter && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div
              className="bg-amber-50 rounded-lg p-8 max-w-2xl w-full shadow-2xl border-4 border-amber-200 max-h-[80vh] overflow-y-auto"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(transparent, transparent 30px, rgba(139, 92, 46, 0.1) 30px, rgba(139, 92, 46, 0.1) 31px)",
                animation: "letter-unfold 0.5s ease-out",
              }}
            >
              <div className="flex items-start justify-between mb-6">
                <div>
                  <div className="inline-block bg-pink-500 text-white px-4 py-1 rounded-full text-sm font-sans mb-2">
                    From: {selectedLetter.sender}
                  </div>
                  <h3 className="font-serif text-3xl text-pink-700">{selectedLetter.subject}</h3>
                </div>
                <button
                  onClick={() => setSelectedLetter(null)}
                  className="text-2xl text-muted-foreground hover:text-foreground"
                >
                  ×
                </button>
              </div>

              <div className="text-sm text-muted-foreground mb-4 font-sans">
                <div>
                  London:{" "}
                  {new Intl.DateTimeFormat("en-GB", {
                    timeZone: "Europe/London",
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(selectedLetter.timestamp)}
                </div>
                <div>
                  Los Angeles:{" "}
                  {new Intl.DateTimeFormat("en-US", {
                    timeZone: "America/Los_Angeles",
                    dateStyle: "medium",
                    timeStyle: "short",
                  }).format(selectedLetter.timestamp)}
                </div>
              </div>

              <div className="font-sans text-base leading-relaxed whitespace-pre-wrap text-foreground">
                {selectedLetter.body}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
