"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Facebook, Twitter, Linkedin, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { useEffect, useState } from "react"
import Image from "next/image"

const companies = [
  { name: "The Times", logo: "/placeholder.svg?height=60&width=120&text=The+Times" },
  { name: "Yahoo!", logo: "/placeholder.svg?height=60&width=120&text=Yahoo!" },
  { name: "Healthline", logo: "/placeholder.svg?height=60&width=120&text=Healthline" },
  { name: "Yahoo!", logo: "/placeholder.svg?height=60&width=120&text=Yahoo!" },
  { name: "Yahoo!", logo: "/placeholder.svg?height=60&width=120&text=Yahoo!" },
  { name: "Amen", logo: "/placeholder.svg?height=60&width=120&text=Amen" },
  { name: "Yahoo!", logo: "/placeholder.svg?height=60&width=120&text=Yahoo!" },
  { name: "Google", logo: "/placeholder.svg?height=60&width=120&text=Google" },
  { name: "Microsoft", logo: "/placeholder.svg?height=60&width=120&text=Microsoft" },
  { name: "Apple", logo: "/placeholder.svg?height=60&width=120&text=Apple" },
  { name: "Netflix", logo: "/placeholder.svg?height=60&width=120&text=Netflix" },
  { name: "Amazon", logo: "/placeholder.svg?height=60&width=120&text=Amazon" },
]

const Footer = () => {
  const footerLinks = {
    Services: [
      "Career Strategy",
      "Mentorship Program",
      "Skill Development",
      "Job Placement",
      "Leadership Training",
      "Interview Coaching",
    ],
    Company: ["About Us", "Our Team", "Success Stories", "Partner Companies", "Press & Media", "Careers"],
    Resources: [
      "Career Blog",
      "Industry Reports",
      "Salary Guides",
      "Resume Templates",
      "Interview Tips",
      "Career Assessment",
    ],
    Support: ["Help Center", "Contact Support", "Documentation", "Community Forum", "Live Chat", "Video Tutorials"],
  }

  const socialLinks = [
    { icon: Facebook, href: "#", label: "Facebook" },
    { icon: Twitter, href: "#", label: "Twitter" },
    { icon: Linkedin, href: "#", label: "LinkedIn" },
    { icon: Instagram, href: "#", label: "Instagram" },
  ]

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

    const element = document.getElementById("footer-logos")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  const duplicatedCompanies = [...companies, ...companies]

  return (
    <footer className="bg-[#334EAC] text-white relative overflow-hidden">
      {/* Company Logos Ribbon */}
      <div
        id="footer-logos"
        className="bg-[#334EAC]/90 relative overflow-hidden border-b border-white/10 px-px py-px bg-blue-300 text-blue-300"
      >
        <div className="container mx-auto px-4 lg:px-8">
          <div
            className={`text-center mb-8 transition-all duration-1000 ${isVisible ? "animate-fade-in" : "opacity-0"}`}
          ></div>

          {/* Scrolling Logos Container */}
          <div className="relative overflow-hidden">
            <div className="flex animate-scroll-left space-x-12 items-center">
              {duplicatedCompanies.map((company, index) => (
                <div
                  key={`${company.name}-${index}`}
                  className="flex-shrink-0 w-32 h-16 flex items-center justify-center grayscale hover:grayscale-0 transition-all duration-300 hover:scale-110"
                >
                  <Image
                    src={company.logo || "/placeholder.svg"}
                    alt={`${company.name} logo`}
                    width={120}
                    height={60}
                    className="max-w-full max-h-full object-contain opacity-60 hover:opacity-100 transition-opacity duration-300 filter brightness-0 invert"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Gradient overlays for smooth edges */}
          <div className="absolute left-0 top-0 bottom-0 w-20 bg-gradient-to-r from-[#334EAC] to-transparent pointer-events-none" />
          <div className="absolute right-0 top-0 bottom-0 w-20 bg-gradient-to-l from-[#334EAC] to-transparent pointer-events-none" />
        </div>

        <style jsx>{`
          @keyframes scroll-left {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll-left {
            animation: scroll-left 30s linear infinite;
          }
          .animate-scroll-left:hover {
            animation-play-state: paused;
          }
        `}</style>
      </div>

      {/* Newsletter Section */}
      <div className="border-b border-white/10 relative z-10">
        <div className="container mx-auto px-4 lg:px-8 py-12">
          <div className="text-center mb-8">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">
              Subscribe to Your Newsletter To Stay
              <br />
              Updated About Our Offers
            </h3>
          </div>

          <div className="max-w-md mx-auto">
            <div className="flex gap-2">
              <Input
                type="email"
                placeholder="Your Email"
                className="bg-white/10 border-white/20 text-white placeholder:text-white/60 rounded-full backdrop-blur-sm"
              />
              <Button className="shrink-0 rounded-full bg-[#BAD6EB] text-[#334EAC] hover:bg-white">Subscribe</Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 lg:px-8 py-16 relative z-10">
        <div className="grid lg:grid-cols-6 gap-8">
          {/* Brand Column */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold mb-4">Beyond Career</h2>
            <p className="text-white/80 mb-6 leading-relaxed">
              Empowering professionals worldwide to achieve their career aspirations through personalized guidance,
              expert mentorship, and exclusive opportunities.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              <div className="flex items-center">
                <Mail className="h-4 w-4 mr-3" />
                <span className="text-sm">hello@beyondcareer.com</span>
              </div>
              <div className="flex items-center">
                <Phone className="h-4 w-4 mr-3" />
                <span className="text-sm">+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center">
                <MapPin className="h-4 w-4 mr-3" />
                <span className="text-sm">San Francisco, CA 94102</span>
              </div>
            </div>
          </div>

          {/* Link Columns */}
          {Object.entries(footerLinks).map(([title, links]) => (
            <div key={title}>
              <h3 className="font-semibold mb-4">{title}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-white/80 hover:text-white transition-colors text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Section */}
      <div className="border-t border-white/10 relative z-10">
        <div className="container mx-auto px-4 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            {/* Copyright */}
            <div className="text-sm text-white/80">© 2024 Beyond Career. All rights reserved.</div>

            {/* Social Links */}
            <div className="flex items-center space-x-4">
              {socialLinks.map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  className="w-8 h-8 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 transition-all duration-300"
                  aria-label={social.label}
                >
                  <social.icon className="h-4 w-4" />
                </a>
              ))}
            </div>

            {/* Legal Links */}
            <div className="flex items-center space-x-6 text-sm">
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Privacy Policy
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Terms of Service
              </a>
              <a href="#" className="text-white/80 hover:text-white transition-colors">
                Cookie Policy
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

export { Footer }
export default Footer
