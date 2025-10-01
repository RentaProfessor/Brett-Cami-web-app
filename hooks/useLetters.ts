"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthProvider'

export interface Letter {
  id: string
  sender_id: string
  recipient_id: string
  subject: string
  content: string
  opened_at: string | null
  created_at: string
  updated_at: string
  sender?: {
    name: string
    email: string
  }
  recipient?: {
    name: string
    email: string
  }
}

export function useLetters() {
  const [letters, setLetters] = useState<Letter[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadLetters()
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel('letters_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'letters' 
          }, 
          () => {
            loadLetters()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user])

  const loadLetters = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('letters')
        .select(`
          *,
          sender:profiles!letters_sender_id_fkey(name, email),
          recipient:profiles!letters_recipient_id_fkey(name, email)
        `)
        .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading letters:', error)
        return
      }

      setLetters(data || [])
    } catch (error) {
      console.error('Error loading letters:', error)
    } finally {
      setLoading(false)
    }
  }

  const sendLetter = async (recipientEmail: string, subject: string, content: string) => {
    console.log('useLetters: sendLetter called with:', { recipientEmail, subject, content })
    
    if (!user) {
      console.log('useLetters: User not authenticated')
      return { success: false, error: 'Not authenticated' }
    }

    console.log('useLetters: User authenticated:', user.email)

    try {
      // Get recipient profile
      console.log('useLetters: Looking up recipient profile for:', recipientEmail)
      const { data: recipient, error: recipientError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', recipientEmail)
        .single()

      if (recipientError || !recipient) {
        console.error('useLetters: Recipient lookup failed:', recipientError)
        return { success: false, error: 'Recipient not found' }
      }

      console.log('useLetters: Recipient found:', recipient.id)

      // Insert letter
      console.log('useLetters: Inserting letter into database')
      const { data, error } = await supabase
        .from('letters')
        .insert({
          sender_id: user.id,
          recipient_id: recipient.id,
          subject,
          content
        })
        .select()
        .single()

      if (error) {
        console.error('useLetters: Error sending letter:', error)
        return { success: false, error: error.message }
      }

      console.log('useLetters: Letter inserted successfully:', data)

      // Optimistically update local state
      setLetters(prev => [data, ...prev])

      return { success: true, data }
    } catch (error) {
      console.error('useLetters: Exception sending letter:', error)
      return { success: false, error: 'Failed to send letter' }
    }
  }

  const markAsOpened = async (letterId: string) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      const { error } = await supabase
        .from('letters')
        .update({ opened_at: new Date().toISOString() })
        .eq('id', letterId)
        .eq('recipient_id', user.id) // Only recipient can mark as opened

      if (error) {
        console.error('Error marking letter as opened:', error)
        return { success: false, error: error.message }
      }

      // Update local state
      setLetters(prev => 
        prev.map(letter => 
          letter.id === letterId 
            ? { ...letter, opened_at: new Date().toISOString() }
            : letter
        )
      )

      return { success: true }
    } catch (error) {
      console.error('Error marking letter as opened:', error)
      return { success: false, error: 'Failed to mark as opened' }
    }
  }

  const getUnreadCount = () => {
    return letters.filter(letter => 
      letter.recipient_id === user?.id && !letter.opened_at
    ).length
  }

  return {
    letters,
    loading,
    sendLetter,
    markAsOpened,
    getUnreadCount,
    refresh: loadLetters
  }
}

