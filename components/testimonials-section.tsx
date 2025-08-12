"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Star, ChevronLeft, ChevronRight } from "lucide-react"
import { useEffect, useState } from "react"

const testimonials = [
  {
    name: "Mansi Agarwal",
    College: "IIM Indore (IPM)",
    content:
      "Today's session with Beyond Career brought instant clarity to concepts I'd been struggling with for days. Their intuitive, practical style made even complex ideas feel simple. The roadmap they shared gave me a step-by-step approach for my specific goals. Easily the best 30 minutes I've spent on upskilling.",
    rating: 5,
    initials: "MA",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQHyFJ0CPpmciQ/profile-displayphoto-shrink_400_400/B56ZcfnbsDHoAg-/0/1748582121233?e=1756339200&v=beta&t=48TkPZdlkuCXPm5Q2pKtTIcjwmDxb63kG1kB8pLDcfE",
  },
  {
    name: "Priyanshi Pranami",
    College: "IMED, Pune",
    content:
      "Beyond Career's resource library is a goldmine. Every deck is action-oriented and easy to apply. I've already used two of them to update my CV and pitch myself to recruiters. Thank you!",
    rating: 5,
    initials: "PP",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQHaNCsRYR76Pw/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1719909638152?e=1756339200&v=beta&t=H1xX6DouRQqNOtSM8MJnm-RRSBVV5b2UCzFozDBQIVk",
  },
  {
    name: "Vanshika Dua",
    College: "CGC Landran",
    content:
      "The interview was structured and professional. The mentor from Beyond Career was polite, clear, and explained the expectations in detail. I left feeling more confident and aligned with the role.",
    rating: 5,
    initials: "VD",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQGFFJKly1pjlA/profile-displayphoto-scale_400_400/B56Zd_cAQVH8Ag-/0/1750189739176?e=1756339200&v=beta&t=NTBY2iQLO_6cn1Ir2T3EcvQV620Rk4jsRC3FuxqjPYg",
  },
  {
    name: "Isha Mehla",
    College: "UPES, Dehradun",
    content:
      "Beyond Career's mentor provided precise and effective solutions that helped guide me exactly where I needed to go. I now have clarity, confidence, and direction.",
    rating: 5,
    initials: "IM",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQGHegwK-7ZmTw/profile-displayphoto-scale_400_400/B56Zf47Z5XGoAk-/0/1752228014309?e=1756339200&v=beta&t=8jHUHTDSM0ikVqQhWEzifho6r5W4W-o8GOy2sBEzECk",
  },
  {
    name: "Sagar",
    College: "DTU, Delhi",
    content:
      "Amazing 😍. It felt like the mentor truly understood the modern job market and offered tailored, useful insights through Beyond Career.",
    rating: 5,
    initials: "S",
    image:
      "https://media.licdn.com/dms/image/v2/D4D35AQF5Fnv0lQxJQQ/profile-framedphoto-shrink_400_400/B4DZUzp5feHIAc-/0/1740328376612?e=1754146800&v=beta&t=Q4FOfUOEQpj498EaXEqdgbkIKO4WMzMBdMHpCyLEV8g",
  },
  {
    name: "Anshika Chawla",
    College: "MAIMS, Delhi",
    content:
      "They're clearly very experienced. Answered all my doubts with patience, and the session was filled with practical wisdom. Would love to attend another Beyond Career session.",
    rating: 5,
    initials: "AC",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQEogInuZ_mRgg/profile-displayphoto-shrink_400_400/B4DZRzUDCDHIAg-/0/1737101424176?e=1756339200&v=beta&t=gg6sNpdaBtBU7zsUAPittngjX17gzVPoodfzWtJMhsQ",
  },
  {
    name: "Rohit Sinha",
    College: "IIT Delhi",
    content:
      "Beyond Career doesn't just teach—they mentor. Their deep involvement and real-world advice made a huge difference in my journey.",
    rating: 5,
    initials: "RS",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQHZgV2LRfQHaA/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1719303495113?e=1756339200&v=beta&t=qHVva8RPIGIe-fpAQ__iyy8FSfdrqSP1NK_iIBp-_VE",
  },
  {
    name: "Priyanshi Bansal",
    College: "LSR",
    content:
      "The CV review and personalized feedback I received from Beyond Career was a game changer. It made my profile stand out like never before.",
    rating: 5,
    initials: "PB",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQHCm5Obo1Q9ow/profile-displayphoto-shrink_400_400/B56ZRLbJDEHoAg-/0/1736432195892?e=1756339200&v=beta&t=UkEF75qYmn75-5avtEVzz_wA6BNRhFxVLQzc_x2y2a0",
  },
  {
    name: "Aditya Rao",
    College: "IIT Bombay",
    content:
      "The Beyond Career ecosystem connected me with alumni mentors who gave raw, real insights. That's unmatched value for any student.",
    rating: 5,
    initials: "AR",
    image:
      "https://media.licdn.com/dms/image/v2/D4D03AQHKkex9x3szRg/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1730989414594?e=1756339200&v=beta&t=DDRODyPqZAvHgG0Dvu-xPBHC_A0eNKbFs4upo_G7Y_c",
  },
  {
    name: "Gargi Narayan",
    College: "Ramjas College, DU",
    content:
      "They explained exactly what recruiters are looking for in CVs. The insights were clear, actionable, and highly valuable. Beyond Career is worth it.",
    rating: 5,
    initials: "GN",
    image:
      "https://media.licdn.com/dms/image/v2/D5603AQE5e1Sl39C5DQ/profile-displayphoto-shrink_400_400/profile-displayphoto-shrink_400_400/0/1719590970701?e=1756339200&v=beta&t=N_4jDkBVF-g7Keq9___uVkemhEBpjIwe5MGyWRwYUFI",
  },
  {
    name: "Vikash Krishna Agrawal",
    College: "BJB Autonomous College",
    content:
      "Best advice from the most down-to-earth mentor. Beyond Career didn't just point out my mistakes — they helped me solve them.",
    rating: 5,
    initials: "VKA",
    image:
      "https://media.licdn.com/dms/image/v2/D5635AQEF0_Cwrc8Twg/profile-framedphoto-shrink_400_400/B56ZeoJ4yVGoAc-/0/1750872854060?e=1754146800&v=beta&t=dk-591nz7ixaa8R76hmJiEgGSlrOksegTeWa_a-ZDBs",
  },
]

export function TestimonialsSection() {
  const [isVisible, setIsVisible] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  useEffect(() => {
    if (!isAutoPlaying) return
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % testimonials.length)
    }, 4000)
    return () => clearInterval(interval)
  }, [isAutoPlaying])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true)
      },
      { threshold: 0.1 },
    )
    const element = document.getElementById("testimonials-section")
    if (element) observer.observe(element)
    return () => observer.disconnect()
  }, [])

  const goToSlide = (index: number) => {
    setCurrentIndex(index)
    setIsAutoPlaying(false)
    setTimeout(() => setIsAutoPlaying(true), 10000)
  }

  const goToPrevious = () => {
    const newIndex = currentIndex === 0 ? testimonials.length - 1 : currentIndex - 1
    goToSlide(newIndex)
  }

  const goToNext = () => {
    const newIndex = (currentIndex + 1) % testimonials.length
    goToSlide(newIndex)
  }

  const getVisibleTestimonials = () => {
    const result = []
    for (let i = 0; i < 3; i++) {
      const index = (currentIndex + i) % testimonials.length
      result.push(testimonials[index])
    }
    return result
  }

  return (
    <section
      id="testimonials-section"
      className="py-16 px-4 bg-gradient-to-br from-[#BAD6EB]/20 via-white to-[#F7F2EB]/30 relative overflow-hidden"
      onMouseEnter={() => setIsAutoPlaying(false)}
      onMouseLeave={() => setIsAutoPlaying(true)}
    >
      {/* Background decoration - removed animations */}
      <div className="absolute top-10 left-10 w-64 h-64 bg-gradient-to-r from-[#4ebbf8]/5 to-[#334EAC]/5 rounded-full blur-3xl" />
      <div className="absolute bottom-10 right-10 w-48 h-48 bg-gradient-to-r from-[#BAD6EB]/10 to-[#4ebbf8]/5 rounded-full blur-3xl" />

      <div className="container mx-auto">
        <div className={`text-center mb-12 transition-opacity duration-500 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <div className="inline-flex items-center px-4 py-2 glass rounded-full text-sm font-medium text-[#4ebbf8] mb-4 shadow-lg hover:glass-strong transition-all duration-300">
            TESTIMONIALS
          </div>
          <h2 className="text-3xl font-bold text-[#081F5C] mb-4">Backed by 20,000+ Students Across India</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            Students from top colleges have trusted Beyond Career to guide their journeys. See how we helped them land
            interviews, internships, and career clarity.
          </p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          <Button
            variant="outline"
            size="icon"
            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 glass border-white/30 bg-white/80 hover:bg-white shadow-lg hover:scale-105 transition-all duration-200 -ml-4"
            onClick={goToPrevious}
            aria-label="Previous testimonial"
          >
            <ChevronLeft className="h-5 w-5 text-[#334EAC]" />
          </Button>

          <Button
            variant="outline"
            size="icon"
            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 glass border-white/30 bg-white/80 hover:bg-white shadow-lg hover:scale-105 transition-all duration-200 -mr-4"
            onClick={goToNext}
            aria-label="Next testimonial"
          >
            <ChevronRight className="h-5 w-5 text-[#334EAC]" />
          </Button>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {getVisibleTestimonials().map((testimonial, index) => (
              <Card
                key={`${testimonial.name}-${currentIndex}-${index}`}
                className="border-0 shadow-lg glass hover:glass-strong rounded-2xl transition-all duration-300 hover:shadow-xl group overflow-hidden min-h-[300px]"
              >
                <CardContent className="p-6 relative h-full flex flex-col">
                  <div className="absolute inset-0 bg-gradient-to-br from-[#4ebbf8]/5 to-[#334EAC]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-2xl" />

                  <div className="flex items-center mb-4 relative z-10">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-5 w-5 text-yellow-300 fill-current" />
                    ))}
                  </div>

                  <p className="text-gray-600 mb-6 italic relative z-10 group-hover:text-gray-700 transition-colors duration-300 flex-grow">
                    "{testimonial.content}"
                  </p>

                  <div className="flex items-center gap-3 relative z-10 mt-auto">
                    {testimonial.image ? (
                      <img
                        src={testimonial.image || "/placeholder.svg"}
                        alt={testimonial.name}
                        className="w-10 h-10 rounded-full object-cover shadow-lg hover:scale-105 transition-transform duration-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gradient-to-r from-[#4ebbf8] to-[#334EAC] text-white rounded-full flex items-center justify-center font-semibold shadow-lg hover:scale-105 transition-transform duration-200">
                        {testimonial.initials}
                      </div>
                    )}
                    <div>
                      <p className="font-semibold text-[#081F5C] group-hover:text-[#4ebbf8] transition-colors duration-300">
                        {testimonial.name}
                      </p>
                      <p className="text-sm text-gray-500 group-hover:text-gray-600 transition-colors duration-300">
                        {testimonial.College}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="flex justify-center mt-8 space-x-2">
            {testimonials.map((_, index) => (
              <button
                key={index}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentIndex ? "bg-[#4ebbf8] scale-125 shadow-lg" : "bg-gray-300 hover:bg-gray-400"
                }`}
                onClick={() => goToSlide(index)}
                aria-label={`Go to testimonial ${index + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection
