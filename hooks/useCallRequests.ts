"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { useAuth } from '@/contexts/AuthProvider'

export interface CallRequest {
  id: string
  requester_id: string
  recipient_id: string
  message: string | null
  status: 'pending' | 'accepted' | 'declined' | 'proposed'
  proposed_times: string[] | null
  selected_slot: string | null
  created_at: string
  updated_at: string
  requester?: {
    name: string
    email: string
  }
  recipient?: {
    name: string
    email: string
  }
}

export function useCallRequests() {
  const [callRequests, setCallRequests] = useState<CallRequest[]>([])
  const [loading, setLoading] = useState(true)
  const { user } = useAuth()

  useEffect(() => {
    if (user) {
      loadCallRequests()
      
      // Subscribe to real-time updates
      const subscription = supabase
        .channel('call_requests_changes')
        .on('postgres_changes', 
          { 
            event: '*', 
            schema: 'public', 
            table: 'call_requests' 
          }, 
          () => {
            loadCallRequests()
          }
        )
        .subscribe()

      return () => {
        subscription.unsubscribe()
      }
    }
  }, [user])

  const loadCallRequests = async () => {
    if (!user) return

    try {
      const { data, error } = await supabase
        .from('call_requests')
        .select(`
          *,
          requester:profiles!call_requests_requester_id_fkey(name, email),
          recipient:profiles!call_requests_recipient_id_fkey(name, email)
        `)
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error loading call requests:', error)
        return
      }

      setCallRequests(data || [])
    } catch (error) {
      console.error('Error loading call requests:', error)
    } finally {
      setLoading(false)
    }
  }

  const createCallRequest = async (recipientEmail: string, message?: string) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      // Get recipient profile
      const { data: recipient, error: recipientError } = await supabase
        .from('profiles')
        .select('id')
        .eq('email', recipientEmail)
        .single()

      if (recipientError || !recipient) {
        return { success: false, error: 'Recipient not found' }
      }

      // Generate proposed time slots (3-5 overlapping windows)
      const proposedTimes = generateProposedTimes()

      const { data, error } = await supabase
        .from('call_requests')
        .insert({
          requester_id: user.id,
          recipient_id: recipient.id,
          message,
          proposed_times: proposedTimes
        })
        .select()
        .single()

      if (error) {
        console.error('Error creating call request:', error)
        return { success: false, error: error.message }
      }

      // Optimistically update local state
      setCallRequests(prev => [data, ...prev])

      return { success: true, data }
    } catch (error) {
      console.error('Error creating call request:', error)
      return { success: false, error: 'Failed to create call request' }
    }
  }

  const acceptCallRequest = async (requestId: string, selectedSlot: string) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      const { data, error } = await supabase
        .from('call_requests')
        .update({ 
          status: 'accepted',
          selected_slot: selectedSlot
        })
        .eq('id', requestId)
        .eq('recipient_id', user.id) // Only recipient can accept
        .select()
        .single()

      if (error) {
        console.error('Error accepting call request:', error)
        return { success: false, error: error.message }
      }

      // Update local state
      setCallRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: 'accepted', selected_slot: selectedSlot }
            : request
        )
      )

      // Create a joint event for the accepted call
      await createCallEvent(data)

      return { success: true, data }
    } catch (error) {
      console.error('Error accepting call request:', error)
      return { success: false, error: 'Failed to accept call request' }
    }
  }

  const declineCallRequest = async (requestId: string) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      const { error } = await supabase
        .from('call_requests')
        .update({ status: 'declined' })
        .eq('id', requestId)
        .eq('recipient_id', user.id) // Only recipient can decline
        .select()
        .single()

      if (error) {
        console.error('Error declining call request:', error)
        return { success: false, error: error.message }
      }

      // Update local state
      setCallRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: 'declined' }
            : request
        )
      )

      return { success: true }
    } catch (error) {
      console.error('Error declining call request:', error)
      return { success: false, error: 'Failed to decline call request' }
    }
  }

  const proposeNewTimes = async (requestId: string, newTimes: string[]) => {
    if (!user) return { success: false, error: 'Not authenticated' }

    try {
      const { data, error } = await supabase
        .from('call_requests')
        .update({ 
          status: 'proposed',
          proposed_times: newTimes
        })
        .eq('id', requestId)
        .or(`requester_id.eq.${user.id},recipient_id.eq.${user.id}`)
        .select()
        .single()

      if (error) {
        console.error('Error proposing new times:', error)
        return { success: false, error: error.message }
      }

      // Update local state
      setCallRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status: 'proposed', proposed_times: newTimes }
            : request
        )
      )

      return { success: true, data }
    } catch (error) {
      console.error('Error proposing new times:', error)
      return { success: false, error: 'Failed to propose new times' }
    }
  }

  const generateProposedTimes = (): string[] => {
    const now = new Date()
    const times: string[] = []
    
    // Generate 3-5 time slots starting from tomorrow
    for (let i = 1; i <= 5; i++) {
      const date = new Date(now)
      date.setDate(date.getDate() + i)
      date.setHours(19, 0, 0, 0) // 7 PM
      
      times.push(date.toISOString())
    }
    
    return times
  }

  const createCallEvent = async (callRequest: CallRequest) => {
    if (!callRequest.selected_slot) return

    try {
      const startTime = new Date(callRequest.selected_slot)
      const endTime = new Date(startTime.getTime() + 60 * 60 * 1000) // 1 hour duration

      await supabase
        .from('events')
        .insert({
          owner_id: callRequest.requester_id,
          title: 'Video Call',
          description: callRequest.message || 'Scheduled video call',
          start_time: startTime.toISOString(),
          end_time: endTime.toISOString(),
          is_shared: true
        })
    } catch (error) {
      console.error('Error creating call event:', error)
    }
  }

  const getPendingRequests = () => {
    return callRequests.filter(request => request.status === 'pending')
  }

  const getMyRequests = () => {
    if (!user) return []
    return callRequests.filter(request => request.requester_id === user.id)
  }

  const getIncomingRequests = () => {
    if (!user) return []
    return callRequests.filter(request => request.recipient_id === user.id)
  }

  return {
    callRequests,
    loading,
    createCallRequest,
    acceptCallRequest,
    declineCallRequest,
    proposeNewTimes,
    getPendingRequests,
    getMyRequests,
    getIncomingRequests,
    refresh: loadCallRequests
  }
}

