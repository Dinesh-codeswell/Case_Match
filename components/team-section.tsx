"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Linkedin, Instagram, Mail } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

const teamMembers = [
  {
    name: "Mahavir Kumar",
    role: "Founder & CEO",
    bio: "Driving growth and vision with a student-centric mission.",
    image: "/images/mahavir-new.png", // Updated image path
    linkedin: "https://www.linkedin.com/in/mahavir-kumar-1b36001bb/",
    instagram: "https://www.instagram.com/undaunted_m_/",
    email: "mahavirkumar@beyondcareer.online",
  },
  {
    name: "Aanya",
    role: "Tech Lead",
    bio: "Architecting the platform that powers thousands of student journeys.",
    image: "/images/aanya-new.png", // Updated image path
    linkedin: "https://www.linkedin.com/in/aanya-chaudhary/",
    instagram: "https://www.instagram.com/aanya19._/",
    email: "aanyachaudhary024@gmail.com",
  },
  {
    name: "Nitish",
    role: "Chief Product Officer",
    bio: "Designing digital products to make student lives easier and careers stronger.",
    image: "/images/nitish-updated-v5.png", // Updated image path
    linkedin: "https://www.linkedin.com/in/nitish-suyog/",
    instagram: "https://www.instagram.com/infi_ni30/",
    email: "nitish.suyog@gmail.com",
  },
  {
    name: "Dinesh",
    role: "Founding Member",
    bio: "Building strategic partnerships and expanding our reach to help more students succeed.",
    image: "/images/dinesh-team.png",
    linkedin: "https://www.linkedin.com/in/dinesh-kumar/",
    instagram: "https://www.instagram.com/dinesh_official/",
    email: "dineshkatal.work@gmail.com",
  },
]

export function TeamSection() {
  const [isVisible, setIsVisible] = useState(false)

  // Intersection observer for animations
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      { threshold: 0.1 },
    )

    const element = document.getElementById("team-section")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section id="team-section" className="py-16 px-4 bg-white relative overflow-hidden particle-bg">
      {/* Background decoration */}
      <div className="absolute top-10 right-10 w-64 h-64 bg-gradient-to-r from-[#4ebbf8]/5 to-[#334EAC]/5 rounded-full blur-3xl animate-float animate-morph" />
      <div
        className="absolute bottom-10 left-10 w-48 h-48 bg-gradient-to-r from-[#BAD6EB]/10 to-[#4ebbf8]/5 rounded-full blur-3xl animate-float animate-morph"
        style={{ animationDelay: "3s" }}
      />

      <div className="container mx-auto">
        <div
          className={`text-center mb-12 transition-all duration-1000 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
        >
          <div className="inline-flex items-center px-4 py-2 glass rounded-full text-sm font-medium text-[#4ebbf8] mb-4 shadow-lg hover:glass-strong transition-all duration-300">
            Meet Our Team
          </div>
          <h2 className="text-3xl font-bold text-[#081F5C] mb-4">The People Behind Beyond Career</h2>
          <p className="text-gray-600 max-w-2xl mx-auto">A student-first team building career-first solutions.</p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-6xl mx-auto">
          {/* Navigation Buttons */}

          {/* Team Members Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <Card
                key={member.name}
                className="border-0 shadow-lg glass hover:glass-strong rounded-2xl transition-all duration-500 hover-lift group overflow-hidden animate-fade-in"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <CardContent className="p-0">
                  {/* Profile Image */}
                  <div className="relative overflow-hidden rounded-t-2xl">
                    <Image
                      src={member.image || "/placeholder.svg"}
                      alt={member.name}
                      width={300}
                      height={300}
                      className="w-full h-auto object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#081F5C] mb-2 group-hover:text-[#4ebbf8] transition-colors duration-300">
                      {member.name}
                    </h3>
                    <p className="text-[#4ebbf8] font-medium mb-3">{member.role}</p>
                    <p className="text-gray-600 text-sm mb-4 group-hover:text-gray-700 transition-colors duration-300">
                      {member.bio}
                    </p>

                    {/* Social Links */}
                    <div className="flex items-center gap-3">
                      {/* LinkedIn */}
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 glass rounded-full flex items-center justify-center hover:glass-strong transition-all duration-300 hover:scale-110"
                        aria-label={`${member.name} LinkedIn`}
                      >
                        <Linkedin className="h-4 w-4 text-[#4ebbf8]" />
                      </a>

                      {/* Instagram */}
                      <a
                        href={member.instagram}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="w-8 h-8 glass rounded-full flex items-center justify-center hover:glass-strong transition-all duration-300 hover:scale-110"
                        aria-label={`${member.name} Instagram`}
                      >
                        <Instagram className="h-4 w-4 text-[#4ebbf8]" />
                      </a>

                      {/* Email */}
                      <a
                        href={`mailto:${member.email}`}
                        className="w-8 h-8 glass rounded-full flex items-center justify-center hover:glass-strong transition-all duration-300 hover:scale-110"
                        aria-label={`Email ${member.name}`}
                      >
                        <Mail className="h-4 w-4 text-[#4ebbf8]" />
                      </a>
                    </div>
                  </div>

                  {/* Shimmer effect */}
                  <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Dots Indicator */}

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-4"></div>
        </div>
      </div>
    </section>
  )
}
