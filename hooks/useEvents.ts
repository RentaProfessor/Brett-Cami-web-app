"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthProvider'

export interface Event {
  id: string
  owner_id: string
  title: string
  description: string | null
  start_time: string
  end_time: string
  is_shared: boolean
  created_at: string
  updated_at: string
  owner?: {
    name: string
    email: string
  }
}

export function useEvents() {
  const [events, setEvents] = useState<Event[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadEvents()
    }
  }, [user])

  const loadEvents = async () => {
    if (!user) return

    try {
      // First, ensure the user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating user profile for:', user.email)
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email.split('@')[0]
          })

        if (insertError) {
          console.error('Error creating profile:', insertError)
        }
      }

      const { data, error } = await supabase
        .from('events')
        .select(`
          *,
          owner:profiles!events_owner_id_fkey(name, email)
        `)
        .or(`owner_id.eq.${user.id},is_shared.eq.true`)
        .order('start_time', { ascending: true })

      if (error) {
        console.error('Error loading events:', error)
        return
      }

      setEvents(data || [])
    } catch (error) {
      console.error('Error loading events:', error)
    } finally {
      setLoading(false)
    }
  }

  const createEvent = async (eventData: {
    title: string
    description?: string
    start_time: string
    end_time: string
    is_shared: boolean
  }) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    console.log('Creating event for user:', user.id, user.email)

    try {
      // First, ensure the user profile exists
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .single()

      if (profileError && profileError.code === 'PGRST116') {
        // Profile doesn't exist, create it
        console.log('Creating user profile for:', user.email)
        const { error: insertError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            email: user.email,
            name: user.user_metadata?.name || user.email.split('@')[0]
          })

        if (insertError) {
          console.error('Error creating profile:', insertError)
          return { success: false, error: 'Failed to create user profile' }
        }
      } else if (profileError) {
        console.error('Error checking profile:', profileError)
        return { success: false, error: 'Failed to verify user profile' }
      }

      // Now create the event
      const { data, error } = await supabase
        .from('events')
        .insert({
          ...eventData,
          owner_id: user.id
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating event:', error)
        return { success: false, error: error.message }
      }

      // Optimistically update local state
      setEvents(prev => [...prev, data].sort((a, b) => 
        new Date(a.start_time).getTime() - new Date(b.start_time).getTime()
      ))

      return { success: true, data }
    } catch (error) {
      console.error('Error creating event:', error)
      return { success: false, error: 'Failed to create event' }
    }
  }

  const updateEvent = async (eventId: string, updates: Partial<Event>) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      const { data, error } = await supabase
        .from('events')
        .update(updates)
        .eq('id', eventId)
        .eq('owner_id', user.id) // Only owner can update
        .select()
        .single()

      if (error) {
        console.error('Error updating event:', error)
        return { success: false, error: error.message }
      }

      // Update local state
      setEvents(prev => 
        prev.map(event => 
          event.id === eventId ? { ...event, ...data } : event
        )
      )

      return { success: true, data }
    } catch (error) {
      console.error('Error updating event:', error)
      return { success: false, error: 'Failed to update event' }
    }
  }

  const deleteEvent = async (eventId: string) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      const { error } = await supabase
        .from('events')
        .delete()
        .eq('id', eventId)
        .eq('owner_id', user.id) // Only owner can delete

      if (error) {
        console.error('Error deleting event:', error)
        return { success: false, error: error.message }
      }

      // Update local state
      setEvents(prev => prev.filter(event => event.id !== eventId))

      return { success: true }
    } catch (error) {
      console.error('Error deleting event:', error)
      return { success: false, error: 'Failed to delete event' }
    }
  }

  const getEventsByDate = (date: Date) => {
    const dateStr = date.toISOString().split('T')[0]
    return events.filter(event => 
      event.start_time.startsWith(dateStr)
    )
  }

  const getEventsByMonth = (year: number, month: number) => {
    return events.filter(event => {
      const eventDate = new Date(event.start_time)
      return eventDate.getFullYear() === year && eventDate.getMonth() === month
    })
  }

  const getJointEvents = () => {
    return events.filter(event => event.is_shared)
  }

  const getPartnerEvents = () => {
    if (!user) return []
    return events.filter(event => 
      event.owner_id !== user.id && event.is_shared
    )
  }

  const getMyEvents = () => {
    if (!user) return []
    return events.filter(event => event.owner_id === user.id)
  }

  return {
    events,
    loading,
    createEvent,
    updateEvent,
    deleteEvent,
    getEventsByDate,
    getEventsByMonth,
    getJointEvents,
    getPartnerEvents,
    getMyEvents,
    refresh: loadEvents
  }
}

