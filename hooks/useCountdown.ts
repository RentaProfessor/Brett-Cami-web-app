"use client"

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { getTimeDifference } from '@/lib/time'

interface CountdownData {
  days: number
  hours: number
  minutes: number
  seconds: number
}

export function useCountdown() {
  const [countdown, setCountdown] = useState<CountdownData>({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  })
  const [targetDate, setTargetDate] = useState<Date | null>(null)
  const [loading, setLoading] = useState(true)

  // Load reunion date from database
  useEffect(() => {
    loadReunionDate()
  }, [])

  // Update countdown every second
  useEffect(() => {
    if (!targetDate) return

    const interval = setInterval(() => {
      const now = new Date()
      const diff = getTimeDifference(targetDate, now)
      setCountdown(diff)
    }, 1000)

    return () => clearInterval(interval)
  }, [targetDate])

  const loadReunionDate = async () => {
    try {
      const { data, error } = await supabase
        .from('app_settings')
        .select('reunion_at')
        .single()

      if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
        console.error('Error loading reunion date:', error)
        return
      }

      if (data?.reunion_at) {
        setTargetDate(new Date(data.reunion_at))
      } else {
        // Set default date 7 days from now if no date exists
        const defaultDate = new Date()
        defaultDate.setDate(defaultDate.getDate() + 7)
        setTargetDate(defaultDate)
        await updateReunionDate(defaultDate)
      }
    } catch (error) {
      console.error('Error loading reunion date:', error)
    } finally {
      setLoading(false)
    }
  }

  const updateReunionDate = async (newDate: Date) => {
    try {
      const { error } = await supabase
        .from('app_settings')
        .upsert({ reunion_at: newDate.toISOString() })

      if (error) {
        console.error('Error updating reunion date:', error)
        return false
      }

      setTargetDate(newDate)
      return true
    } catch (error) {
      console.error('Error updating reunion date:', error)
      return false
    }
  }

  return {
    countdown,
    targetDate,
    loading,
    updateReunionDate
  }
}

