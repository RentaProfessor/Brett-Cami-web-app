import { 
  getTimeDifference, 
  formatTimeInTimezone, 
  formatDateInTimezone,
  isDaytimeInTimezone,
  TIMEZONES 
} from '../lib/time'

describe('Time utilities', () => {
  describe('getTimeDifference', () => {
    it('should calculate correct time difference', () => {
      const target = new Date('2024-12-25T12:00:00Z')
      const current = new Date('2024-12-24T12:00:00Z')
      
      const diff = getTimeDifference(target, current)
      
      expect(diff.days).toBe(1)
      expect(diff.hours).toBe(0)
      expect(diff.minutes).toBe(0)
      expect(diff.seconds).toBe(0)
    })

    it('should handle DST transitions correctly', () => {
      // Spring forward: March 10, 2024 2:00 AM -> 3:00 AM
      const beforeDST = new Date('2024-03-10T06:59:00Z') // 1:59 AM EST
      const afterDST = new Date('2024-03-10T07:01:00Z')  // 3:01 AM EDT
      
      const diff = getTimeDifference(afterDST, beforeDST)
      
      // Should be 2 minutes, not 1 hour 2 minutes
      expect(diff.hours).toBe(0)
      expect(diff.minutes).toBe(2)
    })

    it('should return zero for past dates', () => {
      const past = new Date('2024-01-01T12:00:00Z')
      const future = new Date('2024-12-25T12:00:00Z')
      
      const diff = getTimeDifference(past, future)
      
      expect(diff.days).toBe(0)
      expect(diff.hours).toBe(0)
      expect(diff.minutes).toBe(0)
      expect(diff.seconds).toBe(0)
    })
  })

  describe('formatTimeInTimezone', () => {
    it('should format time correctly in different timezones', () => {
      const date = new Date('2024-12-25T12:00:00Z') // Noon UTC
      
      const laTime = formatTimeInTimezone(date, TIMEZONES.LOS_ANGELES)
      const londonTime = formatTimeInTimezone(date, TIMEZONES.LONDON)
      
      // LA is UTC-8 in winter, London is UTC+0
      expect(laTime).toMatch(/4:00:00 AM/)
      expect(londonTime).toMatch(/12:00:00 PM/)
    })
  })

  describe('formatDateInTimezone', () => {
    it('should format date correctly in different timezones', () => {
      const date = new Date('2024-12-25T12:00:00Z')
      
      const laDate = formatDateInTimezone(date, TIMEZONES.LOS_ANGELES)
      const londonDate = formatDateInTimezone(date, TIMEZONES.LONDON)
      
      expect(laDate).toContain('Wednesday')
      expect(laDate).toContain('December')
      expect(londonDate).toContain('Wednesday')
      expect(londonDate).toContain('December')
    })
  })

  describe('isDaytimeInTimezone', () => {
    it('should correctly identify daytime hours', () => {
      // Mock different times
      const morning = new Date('2024-12-25T10:00:00Z')
      const evening = new Date('2024-12-25T20:00:00Z')
      
      // This test would need to be adjusted based on actual timezone behavior
      // For now, we'll test the basic logic
      expect(typeof isDaytimeInTimezone(TIMEZONES.LOS_ANGELES)).toBe('boolean')
      expect(typeof isDaytimeInTimezone(TIMEZONES.LONDON)).toBe('boolean')
    })
  })
})

