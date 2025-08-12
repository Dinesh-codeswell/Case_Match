"use client"

import { Card, CardContent, CardTitle } from "@/components/ui/card"
import { Briefcase, FileText, Target, Rocket } from "lucide-react"
import { useEffect, useState } from "react"
import { useAuth } from "@/contexts/auth-context"
import { useRouter } from "next/navigation"

const Opportunities = () => {
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

    const element = document.getElementById("opportunities-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const opportunities = [
    {
      title: "Internships",
      //description: "Curated roles that help you apply your skills in the real world.",
      //action: "Join Our Community",
      link: "https://forms.gle/xJi1bQFXkXn3ruEy8",
      isExternal: true,
      backgroundImage: "/images/mock-case-study-12.png",
    },
    {
      title: "Resume Review",
      //description: "Get personalized feedback and design optimization.",
      //action: "Drop at +91 9907729873",
      link: "https://unstop.com/mentor/book-mentor/253300/225398?refId=72suCoQ",
      isExternal: true,
      backgroundImage: "/images/mock-case-study-10.png",
    },
    {
      title: "Mock Interview",
      // description: "Simulate real interviews with AI and expert insights.",
      // action: "Apply Now",
      link: "https://wize.co.in/interviews",
      isExternal: true,
      backgroundImage: "/images/mock-case-study-11.png",
    },
    {
      title: "Jobs",
      //description: "No clutter. No noise. Just real job openings from our trusted network.",
      //action: "Apply Now",
      link: "https://forms.gle/xJi1bQFXkXn3ruEy8",
      isExternal: true,
      backgroundImage: "/images/jobs-card-bg-new.png",
    },
  ]

  const { user } = useAuth()
  const router = useRouter()

  const handleAction = (link: string, isExternal: boolean) => {
    if (!user) {
      router.push("/signup")
      return
    }
    if (isExternal) {
      window.open(link, "_blank", "noopener,noreferrer")
    } else {
      router.push(link)
    }
  }

  return (
    <section
      id="opportunities-section"
      className="py-20 bg-gradient-to-br from-white via-[#F7F2EB]/20 to-white relative overflow-hidden particle-bg"
    >
      {/* Animated background elements */}
      <div className="absolute top-20 left-10 w-32 h-32 bg-gradient-to-r from-[#4ebbf8]/10 to-[#334EAC]/10 rounded-full blur-3xl animate-float animate-morph" />
      <div
        className="absolute bottom-20 right-20 w-40 h-40 bg-gradient-to-r from-[#BAD6EB]/10 to-[#4ebbf8]/10 rounded-full blur-3xl animate-float animate-morph"
        style={{ animationDelay: "1.5s" }}
      />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Header */}
        <div
          className={`text-center mb-16 transition-all duration-1000 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-[#081F5C] mb-4">Opportunities </h2>
           <div className="w-20 h-1 bg-gradient-to-r from-[#4ebbf8] to-[#334EAC] rounded-full mx-auto mb-4"></div>
          <h3 className="text-xl md:text-2xl font-semibold text-[#081F5C] mb-4">
            Internships, Jobs, Tools—All In One Place
          </h3>
          <p className="text-lg text-gray-600 max-w-3xl mx-auto mb-8">
            Turn learning into outcomes. From building your resume to landing your dream job, we bring every opportunity
            under one roof.
          </p>
         
        </div>

        {/* Opportunities Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12 max-w-6xl mx-auto">
          {/* Left: Internships */}
          <Card
            className={`h-96 border-white/20 transition-all duration-500 relative rounded-2xl group overflow-hidden hover-lift animate-shimmer cursor-pointer ${
              isVisible ? "animate-scale-in" : "opacity-0"
            }`}
            style={{
              backgroundImage: `url(${opportunities[0].backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => handleAction(opportunities[0].link, opportunities[0].isExternal)}
          >
            <CardContent className="p-8 h-full flex flex-col justify-between relative">
              {/* Reduced overlay opacity for better image visibility */}
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl" />

              {/* Background gradient (kept for existing hover effect, but will be less visible) */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#4ebbf8]/10 to-[#334EAC]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon and Title side-by-side, positioned at top-left */}
              <div className="flex items-center z-10 mb-4">
                <div className="p-3 glass-strong rounded-lg shadow-lg group-hover:animate-glow-pulse hover-rotate mr-4">
                  <Briefcase className="w-6 h-6 text-[#4ebbf8] group-hover:text-[#334EAC] transition-colors duration-300" />
                </div>
                <CardTitle
                  className={`text-black text-xl font-semibold group-hover:text-[#334EAC] transition-colors duration-300`}
                >
                  {opportunities[0].title}
                </CardTitle>
              </div>

              <div className="mt-auto">
                <p className={`text-black text-sm leading-relaxed relative z-10 mb-4 group-hover:text-[#334EAC]`}>
                  {opportunities[0].description}
                </p>
              </div>

              {/* Shimmer effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </CardContent>
          </Card>

          {/* Middle column with 2 smaller cards */}
          <div className="space-y-8">
            <Card
              className={`h-44 border-white/20 transition-all duration-500 relative rounded-2xl group overflow-hidden hover-lift animate-shimmer cursor-pointer ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{
                animationDelay: "0.1s",
                backgroundImage: `url(${opportunities[1].backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => handleAction(opportunities[1].link, opportunities[1].isExternal)}
            >
              <CardContent className="p-6 h-full flex flex-col justify-between relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#BAD6EB]/10 to-[#4ebbf8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon and Title side-by-side, positioned at top-left */}
                <div className="flex items-center z-10 mb-4">
                  <div className="p-2 glass-strong rounded-lg shadow-lg group-hover:animate-glow-pulse hover-rotate mr-3">
                    <FileText className="w-5 h-5 text-[#4ebbf8] group-hover:text-[#334EAC] transition-colors duration-300" />
                  </div>
                  <CardTitle
                    className={`text-black text-lg font-semibold group-hover:text-[#334EAC] transition-colors duration-300`}
                  >
                    {opportunities[1].title}
                  </CardTitle>
                </div>

                <div className="mt-auto">
                  <p className={`text-black text-xs leading-relaxed relative z-10 mb-3 group-hover:text-[#334EAC]`}>
                    {opportunities[1].description}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </CardContent>
            </Card>

            <Card
              className={`h-44 border-white/20 transition-all duration-500 relative rounded-2xl group overflow-hidden hover-lift animate-shimmer cursor-pointer ${
                isVisible ? "animate-scale-in" : "opacity-0"
              }`}
              style={{
                animationDelay: "0.2s",
                backgroundImage: `url(${opportunities[2].backgroundImage})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
              onClick={() => handleAction(opportunities[2].link, opportunities[2].isExternal)}
            >
              <CardContent className="p-6 h-full flex flex-col justify-between relative">
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl" />
                <div className="absolute inset-0 bg-gradient-to-br from-[#4ebbf8]/10 to-[#BAD6EB]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                {/* Icon and Title side-by-side, positioned at top-left */}
                <div className="flex items-center z-10 mb-4">
                  <div className="p-2 glass-strong rounded-lg shadow-lg group-hover:animate-glow-pulse hover-rotate mr-3">
                    <Target className="w-5 h-5 text-[#4ebbf8] group-hover:text-[#334EAC] transition-colors duration-300" />
                  </div>
                  <CardTitle
                    className={`text-black text-lg font-semibold group-hover:text-[#334EAC] transition-colors duration-300`}
                  >
                    {opportunities[2].title}
                  </CardTitle>
                </div>

                <div className="mt-auto">
                  <p className={`text-black text-xs leading-relaxed relative z-10 mb-3 group-hover:text-[#334EAC]`}>
                    {opportunities[2].description}
                  </p>
                </div>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
              </CardContent>
            </Card>
          </div>

          {/* Right: Jobs */}
          <Card
            className={`h-96 border-white/20 transition-all duration-500 relative rounded-2xl group overflow-hidden hover-lift animate-shimmer cursor-pointer ${
              isVisible ? "animate-scale-in" : "opacity-0"
            }`}
            style={{
              animationDelay: "0.3s",
              backgroundImage: `url(${opportunities[3].backgroundImage})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
            onClick={() => handleAction(opportunities[3].link, opportunities[3].isExternal)}
          >
            <CardContent className="p-8 h-full flex flex-col justify-between relative">
              <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300 rounded-2xl" />
              <div className="absolute inset-0 bg-gradient-to-br from-[#BAD6EB]/10 to-[#4ebbf8]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

              {/* Icon and Title side-by-side, positioned at top-left */}
              <div className="flex items-center z-10 mb-4">
                <div className="p-3 glass-strong rounded-lg shadow-lg group-hover:animate-glow-pulse hover-rotate mr-4">
                  <Rocket className="w-6 h-6 text-[#4ebbf8] group-hover:text-[#334EAC] transition-colors duration-300" />
                </div>
                <CardTitle
                  className={`text-black text-xl font-semibold group-hover:text-[#334EAC] transition-colors duration-300`}
                >
                  {opportunities[3].title}
                </CardTitle>
              </div>

              <div className="mt-auto">
                <p className={`text-black text-sm leading-relaxed relative z-10 mb-4 group-hover:text-[#334EAC]`}>
                  {opportunities[3].description}
                </p>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  )
}

export default Opportunities
