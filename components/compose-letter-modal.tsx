"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Send } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthProvider"
import type { Letter } from "./letters-section"

interface ComposeLetterModalProps {
  isOpen: boolean
  onClose: () => void
  onSend: (letter: Omit<Letter, "id" | "timestamp" | "isRead">) => void
}

export function ComposeLetterModal({ isOpen, onClose, onSend }: ComposeLetterModalProps) {
  const [subject, setSubject] = useState("")
  const [body, setBody] = useState("")
  const { toast } = useToast()
  const { user } = useAuth()
  
  // Get sender name from authenticated user
  const sender = user?.user_metadata?.name || "Unknown"
  const recipient = sender === "Brett" ? "Cami" : "Brett"

  const maxChars = 1000
  const charsRemaining = maxChars - body.length

  const handleSend = () => {
    console.log('ComposeLetterModal: handleSend called')
    console.log('Form data:', { subject, body, sender, recipient })
    
    if (!subject.trim() || !body.trim()) {
      console.log('ComposeLetterModal: Form validation failed')
      toast({
        title: "Incomplete letter",
        description: "Please fill in both subject and message.",
        variant: "destructive",
      })
      return
    }

    const letterData = {
      sender: sender as "Cami" | "Brett",
      recipient: recipient as "Cami" | "Brett",
      subject,
      body,
    }
    
    console.log('ComposeLetterModal: Calling onSend with:', letterData)
    onSend(letterData)

    toast({
      title: "Sent with love 💕",
      description: "Your letter is on its way!",
    })

    // Reset form
    setSubject("")
    setBody("")
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl bg-pink-50">
        <DialogHeader>
          <DialogTitle className="font-serif text-3xl text-pink-600">Write a Love Letter 💌</DialogTitle>
        </DialogHeader>

        <div
          className="space-y-6 p-6 bg-white rounded-lg border-2 border-pink-200"
          style={{
            backgroundImage:
              "repeating-linear-gradient(transparent, transparent 30px, rgba(249, 179, 209, 0.1) 30px, rgba(249, 179, 209, 0.1) 31px)",
          }}
        >
          <div className="space-y-2">
            <Label htmlFor="sender" className="font-sans">
              From
            </Label>
            <div className="p-3 bg-pink-100 rounded-md border border-pink-200">
              <span className="font-medium text-pink-700">{sender}</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="subject" className="font-sans">
              Subject
            </Label>
            <Input
              id="subject"
              placeholder="What's on your heart?"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="bg-white"
            />
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="body" className="font-sans">
                Message
              </Label>
              <span className={`text-sm ${charsRemaining < 100 ? "text-destructive" : "text-muted-foreground"}`}>
                {charsRemaining} characters remaining
              </span>
            </div>
            <Textarea
              id="body"
              placeholder="Pour your heart out... ✨"
              value={body}
              onChange={(e) => setBody(e.target.value.slice(0, maxChars))}
              className="min-h-[200px] bg-white font-sans resize-none"
            />
          </div>

          <div className="flex gap-3">
            <Button onClick={handleSend} className="flex-1 bg-pink-500 hover:bg-pink-600 text-white">
              <Send className="w-4 h-4 mr-2" />
              Send Letter
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
