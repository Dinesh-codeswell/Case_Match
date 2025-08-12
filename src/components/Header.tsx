"use client"

import { Button } from "@/components/ui/button"
import { Menu, X, User, LogOut } from "lucide-react"
import { useState, useEffect } from "react"
import Link from "next/link"
import { useAuth } from "@/contexts/auth-context"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import Image from "next/image"

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [logoError, setLogoError] = useState(false)
  const { user, profile, signOut } = useAuth()

  const navItems = [
    { name: "Home", href: "/" },
    { name: "Resources", href: "/resources" },
    { name: "Opportunities", href: "/opportunities" },
    { name: "Events", href: "/events" },
    { name: "Community", href: "/community" },
    { name: "About", href: "/about" },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white/95 backdrop-blur-md shadow-sm" : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center flex-shrink-0">
            <Image
              src="/images/beyond-career-logo.png"
              alt="Beyond Career"
              width={200}
              height={60}
              className={`h-12 md:h-14 w-auto object-contain hover:opacity-90 transition-opacity duration-300 ${logoError ? "hidden" : ""}`}
              priority
              onError={() => setLogoError(true)}
            />
            <span
              className={`text-2xl md:text-3xl font-extrabold text-[#081F5C] logo-fallback ${logoError ? "" : "hidden"}`}
            >
              Beyond Career
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium relative group text-sm xl:text-base"
              >
                {item.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Desktop Auth Section */}
          <div className="hidden lg:flex items-center space-x-3 flex-shrink-0">
            {user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-3 xl:px-4 py-2 bg-transparent text-sm"
                  >
                    <User className="h-4 w-4 mr-2" />
                    <span className="hidden xl:inline">{profile?.first_name || "Profile"}</span>
                    <span className="xl:hidden">Profile</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600">
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <>
                <Link href="/login">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-gray-300 text-gray-700 hover:bg-gray-50 px-3 xl:px-4 py-2 bg-transparent text-sm"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/signup">
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white px-3 xl:px-4 py-2 text-sm">
                    Get Started
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors duration-300 flex-shrink-0"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle navigation menu"
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Navigation */}
        <div
          className={`lg:hidden overflow-hidden transition-all duration-300 ${
            isMenuOpen ? "max-h-96 opacity-100 pb-4" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                className="text-gray-700 hover:text-blue-600 transition-colors duration-300 font-medium py-2 px-2 rounded-lg hover:bg-gray-50"
                onClick={() => setIsMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 pt-4 border-t border-gray-100">
              {user ? (
                <>
                  <Link href="/profile" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent justify-start"
                    >
                      <User className="h-4 w-4 mr-2" />
                      My Profile
                    </Button>
                  </Link>
                  <Button
                    onClick={() => {
                      handleSignOut()
                      setIsMenuOpen(false)
                    }}
                    variant="outline"
                    className="w-full border-red-300 text-red-600 hover:bg-red-50 bg-transparent justify-start"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/login" onClick={() => setIsMenuOpen(false)}>
                    <Button
                      variant="outline"
                      className="w-full border-gray-300 text-gray-700 hover:bg-gray-50 bg-transparent justify-start"
                    >
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/signup" onClick={() => setIsMenuOpen(false)}>
                    <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white justify-start">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export { Header }
export default Header
