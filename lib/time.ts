import { DateTime } from 'luxon'

// Timezone constants
export const TIMEZONES = {
  LOS_ANGELES: 'America/Los_Angeles',
  LONDON: 'Europe/London',
  UTC: 'UTC'
} as const

// Format time for display in different timezones
export function formatTimeInTimezone(date: Date, timezone: string): string {
  return DateTime.fromJSDate(date, { zone: timezone }).toFormat('h:mm:ss a')
}

// Format date for display in different timezones
export function formatDateInTimezone(date: Date, timezone: string): string {
  return DateTime.fromJSDate(date, { zone: timezone }).toFormat('cccc, MMMM d')
}

// Get current time in a specific timezone
export function getCurrentTimeInTimezone(timezone: string): DateTime {
  return DateTime.now().setZone(timezone)
}

// Convert UTC time to local timezone for display
export function utcToTimezone(utcDate: Date, timezone: string): DateTime {
  return DateTime.fromJSDate(utcDate, { zone: 'utc' }).setZone(timezone)
}

// Convert local timezone to UTC for storage
export function timezoneToUtc(localDate: Date, timezone: string): DateTime {
  return DateTime.fromJSDate(localDate, { zone: timezone }).toUTC()
}

// Check if it's daytime in a timezone (6 AM to 6 PM)
export function isDaytimeInTimezone(timezone: string): boolean {
  const now = getCurrentTimeInTimezone(timezone)
  const hour = now.hour
  return hour >= 6 && hour < 18
}

// Get timezone display name
export function getTimezoneDisplayName(timezone: string): string {
  const parts = timezone.split('/')
  return parts[1]?.replace('_', ' ') || timezone
}

// Calculate time difference between two dates
export function getTimeDifference(targetDate: Date, currentDate: Date = new Date()) {
  const diff = targetDate.getTime() - currentDate.getTime()
  
  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60))
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
  const seconds = Math.floor((diff % (1000 * 60)) / 1000)

  return { days, hours, minutes, seconds }
}

// Format duration for countdown display
export function formatCountdown(days: number, hours: number, minutes: number, seconds: number): string {
  return `${days.toString().padStart(2, '0')}:${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

// Get timezone offset in hours
export function getTimezoneOffset(timezone: string): number {
  return DateTime.now().setZone(timezone).offset / 60
}

// Check if DST is active in a timezone
export function isDSTActive(timezone: string): boolean {
  const now = DateTime.now().setZone(timezone)
  const january = now.set({ month: 1, day: 1 })
  const july = now.set({ month: 7, day: 1 })
  
  return now.offset !== january.offset || now.offset !== july.offset
}

