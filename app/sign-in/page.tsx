"use client"

import { useState } from 'react'
import { useAuth } from '@/contexts/AuthProvider'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Heart, Mail } from 'lucide-react'

export function SignInPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [isSignUp, setIsSignUp] = useState(false)
  const { signIn, signUp, isAllowedEmail } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage('')

    if (!isAllowedEmail(email)) {
      setMessage('This email is not authorized for this app.')
      setLoading(false)
      return
    }

    if (!password) {
      setMessage('Please enter a password.')
      setLoading(false)
      return
    }

    const { error } = isSignUp 
      ? await signUp(email, password)
      : await signIn(email, password)
    
    if (error) {
      setMessage(error.message)
    } else if (isSignUp) {
      setMessage('Account created! You can now sign in.')
      setIsSignUp(false)
    }
    
    setLoading(false)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-pink-200 via-peach-200 to-purple-200 p-4">
      <Card className="w-full max-w-md bg-white/90 backdrop-blur-sm border-2 border-pink-200 shadow-2xl">
        <CardHeader className="text-center space-y-4">
          <div className="flex justify-center">
            <Heart className="w-12 h-12 text-pink-500" />
          </div>
          <CardTitle className="text-2xl font-serif text-pink-600">
            Welcome to Our Love Story
          </CardTitle>
          <CardDescription className="text-muted-foreground">
            {isSignUp ? 'Create your account' : 'Sign in to access our romantic cloud'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-pink-600 font-medium">
                Email Address
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 bg-white/80 border-pink-200 focus:border-pink-400"
                  required
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="password" className="text-pink-600 font-medium">
                Password
              </Label>
              <Input
                id="password"
                type="password"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="bg-white/80 border-pink-200 focus:border-pink-400"
                required
              />
            </div>
            
            <Button 
              type="submit" 
              className="w-full bg-pink-500 hover:bg-pink-600 text-white"
              disabled={loading}
            >
              {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
            </Button>
            
            {message && (
              <div className={`text-sm text-center p-3 rounded-lg ${
                message.includes('Account created') || message.includes('success')
                  ? 'bg-green-100 text-green-700 border border-green-200' 
                  : 'bg-red-100 text-red-700 border border-red-200'
              }`}>
                {message}
              </div>
            )}
            
            <div className="text-center">
              <button
                type="button"
                onClick={() => setIsSignUp(!isSignUp)}
                className="text-sm text-pink-600 hover:text-pink-700 underline"
              >
                {isSignUp ? 'Already have an account? Sign in' : 'Need an account? Sign up'}
              </button>
            </div>
          </form>
          
          <div className="mt-6 text-xs text-center text-muted-foreground">
            <p>Authorized emails:</p>
            <p className="font-mono">brettchiate@gmail.com, cami@berkeley.edu</p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

export default SignInPage
