"use client"

import { User, BarChart3, Target } from "lucide-react"
import type { LucideIcon } from "lucide-react"
import { useEffect, useState } from "react"

const HowItWorksSection = () => {
  const [isVisible, setIsVisible] = useState(false)

  const steps: Array<{
    step: string
    icon: LucideIcon
    title: string
    description: string
  }> = [
    {
      step: "1",
      icon: User,
      title: "Create Account",
      description: "Create your personalized account to unlock all features.",
    },
    {
      step: "2",
      icon: BarChart3,
      title: "Find & Download the Right Resources",
      description: "Discover and download curated resources tailored to your career goals.",
    },
    {
      step: "3",
      icon: Target,
      title: "Apply to Internships, Jobs, and More",
      description: "Apply directly to internships, jobs, and other opportunities.",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("how-it-works-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="how-it-works-section" className="py-20 bg-new-deep-purple relative overflow-hidden bg-indigo-400">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-[#4ebbf8]/10 to-[#334EAC]/10 rounded-full blur-3xl animate-float animate-morph" />
      <div
        className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-[#BAD6EB]/10 to-[#4ebbf8]/10 rounded-full blur-3xl animate-float animate-morph"
        style={{ animationDelay: "3s" }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">How it works</h2>
          <p className="text-lg text-white/80 max-w-2xl mx-auto">
            Start your journey with our simple three-step process
          </p>
        </div>

        {/* Steps Grid - now a flex container for numbers and SVGs */}
        <div className="relative z-10 flex justify-between items-start w-full max-w-7xl mx-auto">
          {/* Numbers */}
          {steps.map((step, index) => (
            <div key={step.step} className="relative z-10 flex flex-col items-center w-1/3 px-4">
              {/* 3D Number */}
              <div
                className={`text-6xl md:text-7xl lg:text-8xl font-extrabold text-new-light-purple mb-4 transition-transform duration-500 ${
                  isVisible ? "animate-scale-in" : "opacity-0"
                }`}
                style={{
                  textShadow:
                    "4px 4px 0px rgba(0,0,0,0.1), 8px 8px 0px rgba(0,0,0,0.05), 12px 12px 0px rgba(0,0,0,0.02)", // Simulating 3D
                  animationDelay: `${index * 0.2}s`,
                }}
              >
                {step.step}
              </div>
              {/* Original Step Content */}
              <h3 className="text-xl font-semibold text-white mb-3 text-center">{step.title}</h3>
              <p className="text-white/80 leading-relaxed text-center">{step.description}</p>
            </div>
          ))}

          {/* Dotted line connectors - positioned absolutely within the flex container */}
          {/* Line 1 -> 2 */}
          <svg
            className="absolute top-[-40px] w-[400px] h-[50px]"
            style={{ left: "calc(33.33% - 200px)", animationDelay: `0.3s` }}
            viewBox="0 0 400 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 45 C 100 5, 300 5, 400 45" // More curved, dips down
              stroke="white"
              strokeWidth="2"
              className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
              style={{ animationDuration: "1.5s" }}
            />
            {/* Arrowhead */}
            <path
              d="M395 40 L400 45 L395 50" // Aligned with new curve endpoint
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
              style={{ animationDelay: `1.8s` }}
            />
          </svg>

          {/* Line 2 -> 3 */}
          <svg
            className="absolute top-[-40px] w-[400px] h-[50px]"
            style={{ left: "calc(66.66% - 200px)", animationDelay: `0.5s` }}
            viewBox="0 0 400 50"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M0 45 C 100 5, 300 5, 400 45" // More curved, dips down
              stroke="white"
              strokeWidth="2"
              className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
              style={{ animationDuration: "1.5s" }}
            />
            {/* Arrowhead */}
            <path
              d="M395 40 L400 45 L395 50" // Aligned with new curve endpoint
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className={`transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}
              style={{ animationDelay: `2.0s` }}
            />
          </svg>
        </div>
      </div>
    </section>
  )
}

export { HowItWorksSection }
export default HowItWorksSection
