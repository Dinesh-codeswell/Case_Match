"use client"

import { Button } from "@/components/ui/button"
import { useEffect, useState } from "react"
import Image from "next/image"

export function EventsSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("events-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="events-section"
      className="py-16 px-4 bg-gradient-to-br from-gray-50 via-white to-blue-50 relative overflow-hidden"
    >
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-[#4ebbf8]/5 to-[#334EAC]/5 rounded-full blur-3xl" />
      <div
        className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-[#BAD6EB]/10 to-[#4ebbf8]/5 rounded-full blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      <div className="container mx-auto max-w-6xl">
        <div className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="inline-flex items-center px-4 py-2 bg-[#4ebbf8]/10 rounded-full text-sm font-medium text-[#4ebbf8] mb-4">
            FEATURED EVENT
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-[#081F5C] mb-4">Upcoming Event</h2>
          <div className="w-20 h-1 bg-gradient-to-r from-[#4ebbf8] to-[#334EAC] rounded-full mx-auto mb-4"></div>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
            Don&apos;t miss out on our most anticipated event of the season. Register now to secure your spot!
          </p>
        </div>

        <div
          className={`bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-1 lg:flex max-w-5xl mx-auto min-h-[400px] lg:h-[400px] ${isVisible ? "opacity-100" : "opacity-0"}`}
          style={{ animationDelay: "0.2s" }}
        >
          <div className="lg:w-2/5 w-full h-48 lg:h-full overflow-hidden">
            <Image
              src="https://storage.googleapis.com/a1aa/image/eb00bbf8-07ea-47a5-5335-a0a89f5785ff.jpg?height=300&width=600"
              alt="Consulting Workshop"
              width={600}
              height={300}
              className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
            />
          </div>

          <div className="lg:w-3/5 w-full p-4 md:p-6 flex flex-col justify-between lg:justify-evenly">
            <div>
              <div className="flex items-center mb-3">
                <span className="bg-[#BAD6EB] text-[#334EAC] text-sm font-medium px-3 py-1 rounded-full">
                  Consulting
                </span>
                <span className="ml-3 text-sm text-gray-500 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 mr-1"
                  >
                    <path
                      fillRule="evenodd"
                      d="M11.54 22.351l.07.04.028.016a.76.76 0 00.072 0l.028-.016.07-.04c1.603-.988 2.868-2.345 3.867-3.794A17.202 17.202 0 0021.53 10.5c0-4.64-3.59-8.4-8.05-8.4-4.47 0-8.05 3.76-8.05 8.4 0 2.747 1.186 5.3-3.07 7.607-1.018 1.449-2.283 2.806-3.868 3.794zM12 13.5a3 3 0 100-6 3 3 0 000 6z"
                      clipRule="evenodd"
                    />
                  </svg>
                  Online | Live Session
                </span>
              </div>

              <h3 className="text-xl md:text-2xl font-bold text-[#081F5C] mb-3 hover:text-[#4ebbf8] transition-colors">
                Live Session: How to Crack Consulting Interviews
              </h3>

              <ul className="text-gray-600 mb-4 text-sm leading-relaxed list-disc list-inside">
                <li>Solve guesstimates & case interviews with structure</li>
                <li>Build a consulting-ready resume from scratch</li>
                <li>Convert off-campus roles with a clear strategy</li>
                <li>Avoid common mistakes that cost you offers</li>
              </ul>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
                <div className="flex items-center text-gray-700 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-[#4ebbf8] mr-2"
                  >
                    <path d="M12.75 12.75a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                    <path
                      fillRule="evenodd"
                      d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 9a.75.75 0 00-1.5 0v2.25H9a.75.75 0 000 1.5h2.25V15a.75.75 0 001.5 0v-2.25H15a.75.75 0 000-1.5h-2.25V9z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>9th August 2025</span>
                </div>
                <div className="flex items-center text-gray-700 text-sm">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    fill="currentColor"
                    className="w-4 h-4 text-[#4ebbf8] mr-2"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.751 20.105a8.25 8.25 0 0116.498 0 .75.75 0 01-.437.695A18.683 18.683 0 0112 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 01-.437-.695z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span>7:00 PM IST</span>
                </div>
              </div>

              <div className="flex items-center gap-2 mb-4">
                <div className="flex -space-x-1">
                  <Image
                    src="https://media.licdn.com/dms/image/v2/D5603AQHyFJ0CPpmciQ/profile-displayphoto-shrink_400_400/B56ZcfnbsDHoAg-/0/1748582121233?e=1756339200&v=beta&t=48TkPZdlkuCXPm5Q2pKtTIcjwmDxb63kG1kB8pLDcfE"
                    alt="Mentor"
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                  <Image
                    src="https://media.licdn.com/dms/image/v2/D4D03AQHaNCsRYR76Pw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1719909638152?e=1756339200&v=beta&t=H1xX6DouRQqNOtSM8MJnm-RRSBVV5b2UCzFozDBQIVk"
                    alt="Mentor"
                    width={24}
                    height={24}
                    className="w-6 h-6 rounded-full border-2 border-white"
                  />
                  <div className="w-6 h-6 rounded-full bg-gray-200 flex items-center justify-center text-xs font-medium border-2 border-white">
                    +3
                  </div>
                </div>
                <span className="text-xs text-gray-500">Ex-MBB Consultants</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
              <div className="flex items-center">
                <div className="text-xl font-bold text-[#081F5C]">Free</div>
              </div>
              <Button
                asChild
                className="px-6 py-2 bg-[#334EAC] text-white rounded-full hover:bg-[#4ebbf8] transform hover:scale-105 transition-all flex items-center gap-2 text-sm"
              >
                <a href="https://forms.gle/E9rZqRm5vck3tN5h8" target="_blank" rel="noopener noreferrer">
                  Register Here
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path
                      fillRule="evenodd"
                      d="M3.75 12a.75.75 0 01.75-.75h13.19l-5.47-5.47a.75.75 0 011.06-1.06l6.75 6.75a.75.75 0 010 1.06l-6.75 6.75a.75.75 0 11-1.06-1.06l5.47-5.47H4.5a.75.75 0 01-.75-.75z"
                      clipRule="evenodd"
                    />
                  </svg>
                </a>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default EventsSection
