"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"
import dynamic from "next/dynamic"
import { Briefcase, GraduationCap, BookOpen, Target, Map } from "lucide-react"

// Safely import useAuth with error handling
let useAuth: any
try {
  const authModule = require("@/contexts/auth-context")
  useAuth = authModule.useAuth
} catch (error) {
  console.warn("Auth context not available:", error)
  useAuth = () => ({ user: null, loading: false })
}

// Fallback component for when Spline is loading or fails
const HeroFallback = ({ loading = false }: { loading?: boolean }) => (
  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl">
    <div className="text-center p-8">
      <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-[#4ebbf8] to-[#334EAC] rounded-full flex items-center justify-center shadow-2xl">
        <span className="text-white text-4xl font-bold">BC</span>
      </div>
      <h3 className="text-2xl font-bold text-[#081F5C] mb-2">Beyond Career</h3>
      <p className="text-gray-600">{loading ? "Loading 3D Scene..." : "Your Career Journey Starts Here"}</p>
      {loading && (
        <div className="mt-4">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-[#4ebbf8] mx-auto"></div>
        </div>
      )}
    </div>
  </div>
)

// Dynamically import SplineScene component
const DynamicSplineScene = dynamic(() => import("./spline-scene"), {
  ssr: false,
  loading: () => <HeroFallback loading={true} />,
})

const Hero = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [use3D, setUse3D] = useState(false)
  const [user, setUser] = useState(null)
  const [authLoading, setAuthLoading] = useState(true)
  const authContext = useAuth()

  useEffect(() => {
    setIsVisible(true)

    // Handle auth state
    if (authContext) {
      setUser(authContext.user)
      setAuthLoading(authContext.loading || false)
    } else {
      setAuthLoading(false)
    }

    // Only enable 3D on client side and after a delay to prevent build issues
    const timer = setTimeout(() => {
      if (typeof window !== "undefined") {
        setUse3D(true)
      }
    }, 1000)

    // Hide Spline watermark after component loads
    const hideSplineWatermark = () => {
      const interval = setInterval(() => {
        const watermark = document.querySelector("a[href*='spline.design']")
        if (watermark) {
          ;(watermark as HTMLElement).style.display = "none"
          clearInterval(interval)
        }
      }, 500)

      // Clear interval after 10 seconds to prevent memory leaks
      setTimeout(() => clearInterval(interval), 10000)
    }

    hideSplineWatermark()

    return () => clearTimeout(timer)
  }, [authContext])

  if (authLoading) {
    return (
      <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#F7F2EB]/30 to-[#BAD6EB]/20 pt-16 overflow-hidden">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading hero section...</p>
        </div>
      </section>
    )
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-white via-[#F7F2EB]/30 to-[#BAD6EB]/20 pt-16 overflow-hidden">
      {/* Decorative blobs - removed animations */}
      <div className="absolute top-20 left-4 md:left-10 w-32 h-32 md:w-64 md:h-64 bg-gradient-to-r from-[#4ebbf8]/10 to-[#334EAC]/10 rounded-full blur-3xl" />
      <div className="absolute bottom-20 right-4 md:right-10 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-r from-[#BAD6EB]/20 to-[#4ebbf8]/10 rounded-full blur-3xl" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10 grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
        {/* Left column */}
        <div
          className={`text-center lg:text-left transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
        >
          <div className="inline-flex items-center px-4 md:px-6 py-2 md:py-3 glass rounded-full text-sm font-medium text-[#4ebbf8] mb-4 md:mb-6">
            ✨ All About Your Dreams
          </div>

          <h1 className="text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-bold text-[#081F5C] leading-tight mb-4 md:mb-6">
            Built for Students,
            <span className="bg-gradient-to-r from-[#4ebbf8] to-[#334EAC] bg-clip-text text-transparent">
              {" "}
              Who Refuse to Wait.
            </span>
          </h1>

          <p className="text-base md:text-lg lg:text-xl text-black/70 mb-6 md:mb-8 max-w-xl mx-auto lg:mx-0 leading-relaxed">
            Beyond Career is India&apos;s first all-in-one execution ecosystem for consulting, product, data, business
            and strategy roles.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            {user ? (
              <Link href="/">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#334EAC] to-[#4ebbf8] text-white w-full sm:w-auto hover:opacity-90 transition-opacity"
                >
                  Explore Platform
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Link href="/signup">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#334EAC] to-[#4ebbf8] text-white w-full sm:w-auto hover:opacity-90 transition-opacity"
                >
                  Start Your Journey
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Right column with 3D scene or fallback */}
        <div className={`relative transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="relative w-full h-[400px] md:h-[500px] lg:h-[600px] rounded-2xl overflow-hidden">
            {/* Conditional rendering of 3D scene */}
            {use3D ? (
              <div className="absolute inset-0 scale-150 origin-center">
                <DynamicSplineScene sceneUrl="https://prod.spline.design/Gt17pQ-CXEgcTVUl/scene.splinecode" />
              </div>
            ) : (
              <HeroFallback loading={true} />
            )}

            {/* Overlay fix for black line */}
            <div className="absolute bottom-0 right-0 w-full h-6 bg-gradient-to-t from-white to-transparent z-30 pointer-events-none" />

            {/* Floating Badges - removed animations */}
            <div className="absolute top-[15%] right-[20%] bg-white text-red-500 px-3 py-2 rounded-full shadow-lg text-sm font-medium z-10 flex items-center gap-1">
              <Briefcase className="w-4 h-4" />
              Jobs
            </div>
            <div className="absolute top-[20%] left-[15%] bg-white text-blue-500 px-3 py-2 rounded-full shadow-lg text-sm font-medium z-10 flex items-center gap-1">
              <GraduationCap className="w-4 h-4" />
              Internships
            </div>
            <div className="absolute bottom-[25%] left-[20%] bg-white text-yellow-600 px-3 py-2 rounded-full shadow-lg text-sm font-medium z-10 flex items-center gap-1">
              <BookOpen className="w-4 h-4" />
              Resources
            </div>
            <div className="absolute top-[50%] right-[3%] bg-white text-purple-600 px-3 py-2 rounded-full shadow-lg text-sm font-medium z-10 flex items-center gap-1">
              <Target className="w-4 h-4" />
              Placements
            </div>
            <div className="absolute bottom-[10%] right-[20%] bg-white text-green-600 px-3 py-2 rounded-full shadow-lg text-sm font-medium z-10 flex items-center gap-1">
              <Map className="w-4 h-4" />
              Roadmap
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default Hero
export { Hero }
