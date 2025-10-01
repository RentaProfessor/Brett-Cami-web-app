import { test, expect } from '@playwright/test'

test.describe('Authentication Flow', () => {
  test('should show sign-in page for unauthenticated users', async ({ page }) => {
    await page.goto('/')
    
    // Should redirect to sign-in or show sign-in form
    await expect(page.locator('text=Welcome to Our Love Story')).toBeVisible()
    await expect(page.locator('input[type="email"]')).toBeVisible()
    await expect(page.locator('text=Send Magic Link')).toBeVisible()
  })

  test('should show authorized emails', async ({ page }) => {
    await page.goto('/')
    
    // Should show the authorized emails
    await expect(page.locator('text=brett@example.com')).toBeVisible()
    await expect(page.locator('text=cami@example.com')).toBeVisible()
  })

  test('should validate email format', async ({ page }) => {
    await page.goto('/')
    
    const emailInput = page.locator('input[type="email"]')
    const submitButton = page.locator('text=Send Magic Link')
    
    // Try invalid email
    await emailInput.fill('invalid-email')
    await submitButton.click()
    
    // Should show validation error
    await expect(page.locator('text=This email is not authorized')).toBeVisible()
  })

  test('should reject unauthorized emails', async ({ page }) => {
    await page.goto('/')
    
    const emailInput = page.locator('input[type="email"]')
    const submitButton = page.locator('text=Send Magic Link')
    
    // Try unauthorized email
    await emailInput.fill('unauthorized@example.com')
    await submitButton.click()
    
    // Should show authorization error
    await expect(page.locator('text=This email is not authorized')).toBeVisible()
  })
})

test.describe('Main App (requires authentication)', () => {
  test.beforeEach(async ({ page }) => {
    // Note: In a real test, you'd need to mock the authentication
    // For now, we'll skip these tests as they require actual Supabase setup
    test.skip(true, 'Requires Supabase authentication setup')
  })

  test('should show main app after authentication', async ({ page }) => {
    await page.goto('/')
    
    // Should show the main app components
    await expect(page.locator('text=Time until we see each other again')).toBeVisible()
    await expect(page.locator('text=London Time')).toBeVisible()
    await expect(page.locator('text=Los Angeles Time')).toBeVisible()
  })

  test('should allow sending letters', async ({ page }) => {
    await page.goto('/')
    
    // Find and click compose letter button
    const composeButton = page.locator('text=Compose Letter')
    await composeButton.click()
    
    // Fill out letter form
    await page.locator('input[placeholder*="subject"]').fill('Test Letter')
    await page.locator('textarea').fill('This is a test letter content')
    
    // Send letter
    await page.locator('text=Send Letter').click()
    
    // Should show success message or letter in archive
    await expect(page.locator('text=Letter sent successfully')).toBeVisible()
  })

  test('should show letters in archive', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to archive section
    await page.locator('text=Archive').click()
    
    // Should show letters
    await expect(page.locator('[data-testid="letter-item"]')).toBeVisible()
  })

  test('should allow creating events', async ({ page }) => {
    await page.goto('/')
    
    // Navigate to calendar
    await page.locator('text=Calendar').click()
    
    // Click add event button
    await page.locator('text=Add Event').click()
    
    // Fill out event form
    await page.locator('input[placeholder*="title"]').fill('Test Event')
    await page.locator('textarea').fill('Test event description')
    
    // Set date/time
    await page.locator('input[type="datetime-local"]').fill('2024-12-25T19:00')
    
    // Save event
    await page.locator('text=Save Event').click()
    
    // Should show event in calendar
    await expect(page.locator('text=Test Event')).toBeVisible()
  })
})

