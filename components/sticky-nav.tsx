"use client"

import { useState, useEffect } from "react"
import { Menu, X, Heart, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useAuth } from "@/contexts/AuthProvider"

const navItems = [
  { label: "Home", href: "#home" },
  { label: "Letters", href: "#letters" },
  { label: "Calendar", href: "#calendar" },
]

export function StickyNav() {
  const [activeSection, setActiveSection] = useState("home")
  const [isOpen, setIsOpen] = useState(false)
  const { user, signOut } = useAuth()

  useEffect(() => {
    const handleScroll = () => {
      const sections = navItems.map((item) => item.href.slice(1))
      const scrollPosition = window.scrollY + 100

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const { offsetTop, offsetHeight } = element
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const scrollToSection = (href: string) => {
    const element = document.getElementById(href.slice(1))
    if (element) {
      element.scrollIntoView({ behavior: "smooth" })
      setIsOpen(false)
    }
  }

  return (
    <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-pink-200 shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-2">
            <Heart className="w-6 h-6 text-pink-500 fill-pink-500" />
            <h1 className="font-serif text-2xl text-pink-600">Cami & Brett</h1>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-6">
            {navItems.map((item) => (
              <button
                key={item.href}
                onClick={() => scrollToSection(item.href)}
                className={`font-sans text-sm font-medium transition-colors hover:text-pink-600 ${
                  activeSection === item.href.slice(1) ? "text-pink-600 border-b-2 border-pink-600" : "text-foreground"
                }`}
              >
                {item.label}
              </button>
            ))}
            {user && (
              <div className="flex items-center gap-2 ml-4 pl-4 border-l border-pink-200">
                <span className="text-sm text-pink-600">Hi, {user.user_metadata?.name || user.email}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={signOut}
                  className="text-pink-600 hover:text-pink-700 hover:bg-pink-50"
                >
                  <LogOut className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Mobile Navigation */}
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild className="md:hidden">
              <Button variant="ghost" size="icon">
                {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="bg-white/95 backdrop-blur-md">
              <div className="flex flex-col gap-4 mt-8">
                {navItems.map((item) => (
                  <button
                    key={item.href}
                    onClick={() => scrollToSection(item.href)}
                    className={`font-sans text-lg font-medium text-left py-2 px-4 rounded-lg transition-colors ${
                      activeSection === item.href.slice(1)
                        ? "bg-pink-100 text-pink-600"
                        : "text-foreground hover:bg-pink-50"
                    }`}
                  >
                    {item.label}
                  </button>
                ))}
                {user && (
                  <div className="border-t border-pink-200 pt-4 mt-4">
                    <div className="text-sm text-pink-600 px-4 mb-2">
                      Hi, {user.user_metadata?.name || user.email}
                    </div>
                    <button
                      onClick={() => {
                        signOut()
                        setIsOpen(false)
                      }}
                      className="font-sans text-lg font-medium text-left py-2 px-4 rounded-lg transition-colors text-foreground hover:bg-pink-50 flex items-center gap-2"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  )
}
