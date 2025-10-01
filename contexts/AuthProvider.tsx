"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabaseClient'

interface AuthContextType {
  user: User | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string) => Promise<{ error: any }>
  signOut: () => Promise<void>
  isAllowedEmail: (email: string) => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Email allowlist - editable for the couple
const ALLOWED_EMAILS = [
  'brettchiate@gmail.com',
  'cami@berkeley.edu'
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }: { data: { session: Session | null } }) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event: string, session: Session | null) => {
      setSession(session)
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    console.log('Sign in attempt:', { email, password, isAllowed: isAllowedEmail(email) })
    
    if (!isAllowedEmail(email)) {
      return { error: { message: 'Email not authorized for this app' } }
    }

    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.toLowerCase().trim(),
        password: password.trim()
      })

      if (error) {
        console.error('Supabase auth error:', error)
        return { error }
      }

      console.log('Authentication successful!', data.user?.email)
      return { error: null }
    } catch (error) {
      console.error('Authentication error:', error)
      return { error: { message: 'Authentication failed' } }
    }
  }

  const signUp = async (email: string, password: string) => {
    if (!isAllowedEmail(email)) {
      return { error: { message: 'Email not authorized for this app' } }
    }

    try {
      const { data, error } = await supabase.auth.signUp({
        email: email.toLowerCase().trim(),
        password: password.trim()
      })

      if (error) {
        console.error('Supabase signup error:', error)
        return { error }
      }

      console.log('Signup successful!', data.user?.email)
      return { error: null }
    } catch (error) {
      console.error('Signup error:', error)
      return { error: { message: 'Signup failed' } }
    }
  }

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('Sign out error:', error)
      }
    } catch (error) {
      console.error('Sign out error:', error)
    }
    setUser(null)
    setSession(null)
  }

  const isAllowedEmail = (email: string) => {
    return ALLOWED_EMAILS.includes(email.toLowerCase())
  }

  const value = {
    user,
    session,
    loading,
    signIn,
    signUp,
    signOut,
    isAllowedEmail,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

