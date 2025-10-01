"use client"

import { useState } from "react"
import { Mail, Filter } from "lucide-react"
import type { Letter } from "./letters-section"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

interface ArchiveRibbonProps {
  letters: Letter[]
  onSelectLetter: (letter: Letter) => void
}

export function ArchiveRibbon({ letters, onSelectLetter }: ArchiveRibbonProps) {
  const [filter, setFilter] = useState<"all" | "Cami" | "Brett">("all")

  const filteredLetters = filter === "all" ? letters : letters.filter((l) => l.sender === filter)

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-serif text-2xl text-pink-600 flex items-center gap-2">
          <Mail className="w-6 h-6" />
          Letter Archive
        </h3>
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-muted-foreground" />
          <Select value={filter} onValueChange={(v) => setFilter(v as any)}>
            <SelectTrigger className="w-32 bg-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              <SelectItem value="Cami">From Cami</SelectItem>
              <SelectItem value="Brett">From Brett</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 scrollbar-hide">
        {filteredLetters.map((letter) => (
          <button key={letter.id} onClick={() => onSelectLetter(letter)} className="flex-shrink-0 group">
            <div className="bg-gradient-to-br from-pink-200 to-pink-300 rounded-lg p-4 shadow-md border-2 border-pink-400 hover:scale-105 transition-transform w-32 h-40 flex flex-col items-center justify-center">
              <Mail className="w-12 h-12 text-pink-600 mb-2" />
              <div className="text-xs font-sans text-pink-700 text-center">
                {letter.subject.slice(0, 20)}
                {letter.subject.length > 20 ? "..." : ""}
              </div>
              <div className="text-xs text-pink-600 mt-1">
                {new Intl.DateTimeFormat("en-US", {
                  month: "short",
                  day: "numeric",
                }).format(letter.timestamp)}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}
