import type React from "react"
import type { Metadata } from "next"
import { GeistSans, GeistMono } from "geist/font"
import { AuthProvider } from "@/contexts/AuthProvider"
import { RequireAuth } from "@/components/RequireAuth"
import "./globals.css"

export const metadata: Metadata = {
  title: "Cami & Brett Long Distance",
  description: "A romantic pink cloud web app for our long-distance love",
  generator: 'v0.app'
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className={`${GeistSans.variable} ${GeistMono.variable} antialiased`}>
      <body className={`${GeistSans.className} ${GeistMono.className}`}>
        <AuthProvider>
          <RequireAuth>
            {children}
          </RequireAuth>
        </AuthProvider>
      </body>
    </html>
  )
}
