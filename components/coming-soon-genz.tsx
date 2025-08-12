"use client"

import { Button } from "@/components/ui/button"
import { Clock } from "lucide-react"
import { useEffect, useState } from "react"
import Link from "next/link"

// Define a fixed, global target date for the countdown
const GLOBAL_TARGET_DATE = new Date("2025-09-01T00:00:00Z") // September 1, 2025, 00:00:00 UTC

// Helper function to calculate time left
const calculateTimeLeft = (targetDate: Date) => {
  const difference = +targetDate - +new Date()
  let timeLeft = {}

  if (difference > 0) {
    timeLeft = {
      days: Math.floor(difference / (1000 * 60 * 60 * 24)),
      hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
      minutes: Math.floor((difference / 1000 / 60) % 60),
      seconds: Math.floor((difference / 1000) % 60),
    }
  }
  return timeLeft
}

export function ComingSoonGenZ() {
  // The target date is now fixed and global.
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft(GLOBAL_TARGET_DATE))

  useEffect(() => {
    const timer = setTimeout(() => {
      setTimeLeft(calculateTimeLeft(GLOBAL_TARGET_DATE))
    }, 1000)

    return () => clearTimeout(timer)
  })

  const timerComponents = Object.keys(timeLeft).map((interval, index) => {
    if (!timeLeft[interval as keyof typeof timeLeft]) {
      return null
    }
    return (
      <span key={interval} className="text-5xl md:text-7xl font-extrabold text-new-planetary">
        {timeLeft[interval as keyof typeof timeLeft]}
        <span className="block text-sm md:text-base font-medium text-new-galaxy uppercase">{interval}</span>
      </span>
    )
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-white via-blue-50 to-yellow-50 text-new-galaxy flex flex-col items-center justify-center py-20 px-4">
      <div className="container mx-auto max-w-5xl text-center space-y-16">
        {/* Main Headline Section */}
        <div className="space-y-6">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-new-galaxy leading-tight">
            Something Big's Dropping.
            <br />
            <span className="bg-gradient-to-r from-[#4ebbf8] to-[#334EAC] bg-clip-text text-transparent">
              You All Want In
            </span>
          </h1>

          <p className="text-lg md:text-xl lg:text-2xl font-medium text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join <span className="text-yellow-500 font-bold">20,000+ students</span> already leveling up. Your winning
            community awaits.
          </p>
        </div>

        {/* Countdown Timer Section */}
        <div className="flex flex-col items-center space-y-8">
          <div className="flex items-center gap-3 text-lg md:text-xl font-semibold text-new-galaxy">
            <Clock className="h-6 w-6 text-new-planetary" />
            <span>The platform drops in:</span>
          </div>

          <div className="glass rounded-3xl px-8 py-6 shadow-xl">
            <div className="flex items-end justify-center space-x-6 md:space-x-8">
              {timerComponents.length ? (
                timerComponents
              ) : (
                <span className="text-5xl md:text-7xl font-extrabold text-new-planetary">Launching!</span>
              )}
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div>
          <div className="bg-[#334EAC] rounded-3xl p-8 md:p-12 text-center text-white max-w-3xl mx-auto space-y-6">
            <h3 className="text-2xl md:text-3xl lg:text-4xl font-bold">
              JOIN OUR COMMUNITY
              <br />
              UNLOCK YOUR POTENTIAL
            </h3>

            <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
              Create an account to explore job opportunities and connect with employers tailored for you.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Link href="/signup">
                <Button className="bg-[#BAD6EB] text-[#334EAC] hover:bg-white font-semibold px-8 py-3 text-lg transition-colors duration-200">
                  Sign Up
                </Button>
              </Link>
              <Link href="/career-ai">
                <Button
                  variant="outline"
                  className="border-white text-white hover:bg-white/10 bg-transparent px-8 py-3 text-lg transition-colors duration-200"
                >
                  Join Community
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Concluding Statement */}
        <div className="space-y-4">
          <p className="text-lg md:text-xl text-new-galaxy font-medium leading-relaxed">
            You've waited long enough for good career guidance.
            <br />
            <span className="font-bold">Now we flip the game.</span>
          </p>
        </div>
      </div>
    </div>
  )
}

export default ComingSoonGenZ

// Export both named exports for compatibility
export { ComingSoonGenZ as ComingSoon }
