"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import { InfiniteSlider } from "@/components/ui/infinite-slider"

const companies = [
  { name: "The Times", logo: "/placeholder.svg?height=60&width=120&text=The+Times" },
  { name: "Yahoo!", logo: "/placeholder.svg?height=60&width=120&text=Yahoo!" },
  { name: "Healthline", logo: "/placeholder.svg?height=60&width=120&text=Healthline" },
  { name: "Google", logo: "/placeholder.svg?height=60&width=120&text=Google" },
  { name: "Microsoft", logo: "/placeholder.svg?height=60&width=120&text=Microsoft" },
  { name: "Apple", logo: "/placeholder.svg?height=60&width=120&text=Apple" },
  { name: "Netflix", logo: "/placeholder.svg?height=60&width=120&text=Netflix" },
  { name: "Amazon", logo: "/placeholder.svg?height=60&width=120&text=Amazon" },
  { name: "Meta", logo: "/placeholder.svg?height=60&width=120&text=Meta" },
  { name: "Tesla", logo: "/placeholder.svg?height=60&width=120&text=Tesla" },
  { name: "Spotify", logo: "/placeholder.svg?height=60&width=120&text=Spotify" },
  { name: "Adobe", logo: "/placeholder.svg?height=60&width=120&text=Adobe" },
]

export function CompanyLogosRibbon() {
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

    const element = document.getElementById("company-logos-ribbon")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section
      id="company-logos-ribbon"
      className="py-12 px-4 bg-gradient-to-r from-gray-100 via-gray-50 to-gray-100 relative overflow-hidden"
    >
      <div className="container mx-auto">
        <div className={`text-center mb-8 transition-all duration-1000 ${isVisible ? "animate-fade-in" : "opacity-0"}`}>
          <h3 className="text-2xl font-bold text-[#081F5C] mb-2">Trusted by Leading Companies</h3>
          <p className="text-gray-600">Join professionals from these top organizations</p>
        </div>

        {/* Infinite Slider for Company Logos */}
        <InfiniteSlider gap={48} duration={30} durationOnHover={60} className="py-4">
          {companies.map((company, index) => (
            <div
              key={`${company.name}-${index}`}
              className="flex-shrink-0 w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
            >
              <Image
                src={company.logo || "/placeholder.svg"}
                alt={`${company.name} logo`}
                width={120}
                height={60}
                className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300"
              />
            </div>
          ))}
        </InfiniteSlider>
      </div>
    </section>
  )
}

export default CompanyLogosRibbon
