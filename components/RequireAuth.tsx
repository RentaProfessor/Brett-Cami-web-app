"use client"

import { useAuth } from '@/contexts/AuthProvider'
import { SignInPage } from '@/app/sign-in/page'

interface RequireAuthProps {
  children: React.ReactNode
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-200 via-peach-200 to-purple-200">
        <div className="bg-white/90 backdrop-blur-sm rounded-3xl p-8 shadow-xl border-2 border-pink-200">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-500 mx-auto mb-4"></div>
            <p className="text-pink-600 font-medium">Loading...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return <SignInPage />
  }

  return <>{children}</>
}

