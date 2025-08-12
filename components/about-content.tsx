"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Brain,
  BookOpen,
  Users,
  PenToolIcon as Tool,
  CheckCircle,
  ArrowRight,
  Linkedin,
  XCircle,
  Lightbulb,
  UserCheck,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"

const teamMembers = [
  {
    name: "Mahavir Kumar",
    role: "Founder, IIT Kharagpur",
    image: "/images/mahavir-new.png",
    linkedin: "https://www.linkedin.com/in/mahavir-kumar-1b36001bb/",
  },
  {
    name: "Nitish Kumar",
    role: "Co-founder, IIT Kharagpur",
    image: "/images/nitish-new.png",
    linkedin: "https://www.linkedin.com/in/nitish-suyog/",
  },
  {
    name: "Aanya Chaudhary",
    role: "Tech Lead, IILM University",
    image: "/images/aanya-new.png",
    linkedin: "https://www.linkedin.com/in/aanya-chaudhary/",
  },
  {
    name: "Dinesh Kumar",
    role: "Founding Member",
    image: "/images/dinesh-team.png",
    linkedin: "https://www.linkedin.com/in/dineshkatal/",
  },
]

export default function AboutContent() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible")
        } else {
          entry.target.classList.remove("visible")
        }
      },
      { threshold: 0.1 },
    )

    const elements = document.querySelectorAll(".animate-on-scroll")
    elements.forEach((el) => observer.observe(el))

    return () => elements.forEach((el) => observer.unobserve(el))
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-milky-way to-sky text-galaxy">
      {/* Hero Section */}
      <section className="py-20 px-4 text-center relative overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-48 h-48 bg-gradient-to-r from-[#BAD6EB]/15 to-[#4ebbf8]/10 rounded-full blur-3xl animate-float-slow" />
        <div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-gradient-to-r from-[#4ebbf8]/15 to-[#334EAC]/10 rounded-full blur-3xl animate-float-slow"
          style={{ animationDelay: "2s" }}
        />
        <div className="container mx-auto max-w-4xl relative z-10 animate-on-scroll animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-galaxy mb-6 leading-tight animate-text-pop-in">
            About{" "}
            <span className="bg-gradient-to-r from-[#4ebbf8] to-[#334EAC] bg-clip-text text-transparent">
              Beyond Career
            </span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            We started with one question: Why do so many students feel lost even after getting into college?
          </p>
        </div>
      </section>

      {/* The Problem Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-white to-sky/10 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="space-y-6 animate-on-scroll animate-slide-in-left">
              <h2 className="text-3xl md:text-4xl font-bold text-galaxy mb-4 animate-text-pop-in">
                The Broken System We&apos;re{" "}
                <span className="bg-gradient-to-r from-[#334EAC] to-[#4ebbf8] bg-clip-text text-transparent">
                  Fixing
                </span>
              </h2>
              <p className="text-lg text-gray-700 leading-relaxed">
                For too long, students have been left to navigate their career paths alone. The education system often
                falls short, leaving bright minds feeling lost and unprepared for the real world.
              </p>
              <ul className="space-y-4 text-gray-700 text-base">
                <li className="flex items-start gap-3">
                  <XCircle className="h-6 w-6 text-red-500 flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-galaxy">Priya:</span> Spent two years chasing grades with no
                    clue what skills actually matter, missing out on crucial experiences.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <Lightbulb className="h-6 w-6 text-warning-yellow flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-galaxy">Neha:</span> Smart, capable, but isolated. No mentors,
                    no exposure, and no clear direction.
                  </div>
                </li>
                <li className="flex items-start gap-3">
                  <UserCheck className="h-6 w-6 text-success-green flex-shrink-0 mt-1" />
                  <div>
                    <span className="font-semibold text-galaxy">Rahul:</span> Graduated top of class but froze in front
                    of real-world problems, lacking practical application skills.
                  </div>
                </li>
              </ul>
              <p className="text-lg text-gray-700 font-semibold mt-6">
                These aren&apos;t isolated cases. They&apos;re the{" "}
                <span className="bg-gradient-to-r from-[#334EAC] to-[#4ebbf8] bg-clip-text text-transparent">norm</span>
                .
              </p>
            </div>
            <div className="grid grid-cols-2 gap-6 animate-on-scroll animate-slide-in-right">
              <Card className="glass-strong text-center p-6 rounded-xl hover-lift">
                <p className="text-5xl font-bold text-blue-600 mb-2">70%</p>
                <p className="text-sm text-galaxy">of students feel directionless.</p>
              </Card>
              <Card className="glass-strong text-center p-6 rounded-xl hover-lift">
                <p className="text-5xl font-bold text-blue-600 mb-2">86%</p>
                <p className="text-sm text-galaxy">don't know what career path to choose.</p>
              </Card>
              <Card className="glass-strong text-center p-6 rounded-xl hover-lift">
                <p className="text-5xl font-bold text-blue-600 mb-2">22%</p>
                <p className="text-sm text-galaxy">feel isolated in college.</p>
              </Card>
              <Card className="glass-strong text-center p-6 rounded-xl hover-lift">
                <p className="text-5xl font-bold text-blue-600 mb-2">65%</p>
                <p className="text-sm text-galaxy">still follow their friends, not their passion.</p>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* What is Beyond Career? Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-milky-way to-sky relative overflow-hidden">
        <div
          className="absolute top-1/3 left-0 w-48 h-48 bg-gradient-to-r from-[#BAD6EB]/10 to-[#4ebbf8]/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "1s" }}
        />
        <div
          className="absolute bottom-1/3 right-0 w-64 h-64 bg-gradient-to-r from-[#4ebbf8]/10 to-[#334EAC]/5 rounded-full blur-3xl animate-float"
          style={{ animationDelay: "3s" }}
        />
        <div className="container mx-auto max-w-6xl text-center relative z-10 animate-on-scroll animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-galaxy mb-4 animate-text-pop-in">
            So, what is Beyond Career?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            It's not just a platform. It's your career command center.
          </p>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card
              className="glass p-6 rounded-xl flex flex-col items-start text-left animate-on-scroll animate-scale-in hover-lift"
              style={{ animationDelay: "0.1s" }}
            >
              <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-full flex items-center justify-center mb-4">
                <Brain className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-galaxy mb-2">AI-generated college-specific roadmaps</h3>
              <p className="text-sm text-gray-600">
                Get a custom step-by-step plan based on your background, course, and goals.
              </p>
            </Card>
            <Card
              className="glass p-6 rounded-xl flex flex-col items-start text-left animate-on-scroll animate-scale-in hover-lift"
              style={{ animationDelay: "0.2s" }}
            >
              <div className="w-16 h-16 bg-success-green/10 text-success-green rounded-full flex items-center justify-center mb-4">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-galaxy mb-2">Resources that actually help</h3>
              <p className="text-sm text-gray-600">
                CV templates, PM & consulting prep kits, HR databases, job boards — everything you need to move.
              </p>
            </Card>
            <Card
              className="glass p-6 rounded-xl flex flex-col items-start text-left animate-on-scroll animate-scale-in hover-lift"
              style={{ animationDelay: "0.3s" }}
            >
              <div className="w-16 h-16 bg-warning-yellow/10 text-warning-yellow rounded-full flex items-center justify-center mb-4">
                <Users className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-galaxy mb-2">Networking made real</h3>
              <p className="text-sm text-gray-600">
                Connect with mentors, peers, communities, and recruiters. No fluff, just access.
              </p>
            </Card>
            <Card
              className="glass p-6 rounded-xl flex flex-col items-start text-left animate-on-scroll animate-scale-in hover-lift"
              style={{ animationDelay: "0.4s" }}
            >
              <div className="w-16 h-16 bg-purple-500/10 text-purple-500 rounded-full flex items-center justify-center mb-4">
                <Tool className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold text-galaxy mb-2">Tools to take action</h3>
              <p className="text-sm text-gray-600">
                Resume builders, skill dashboards, internship portals — and live feedback, not just lists.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Who is this for? Section */}
      <section className="py-16 px-4 bg-gradient-to-tl from-white via-white to-sky/10 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl text-center relative z-10 animate-on-scroll animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-galaxy mb-8 animate-text-pop-in">Who is this for?</h2>
          <div className="grid md:grid-cols-2 gap-8">
            <Card className="glass-strong p-6 rounded-xl text-left animate-on-scroll animate-slide-in-left hover-lift">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Confused Undergrads</h3>
              <p className="text-gray-700">Who want direction and a clear path to their career goals.</p>
            </Card>
            <Card className="glass-strong p-6 rounded-xl text-left animate-on-scroll animate-slide-in-right hover-lift">
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Job Aspirants</h3>
              <p className="text-gray-700">Hungry for practical skills and real-world experience.</p>
            </Card>
            <Card
              className="glass-strong p-6 rounded-xl text-left animate-on-scroll animate-slide-in-left hover-lift"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Graduates</h3>
              <p className="text-gray-700">Stuck between more study or diving into real work.</p>
            </Card>
            <Card
              className="glass-strong p-6 rounded-xl text-left animate-on-scroll animate-slide-in-right hover-lift"
              style={{ animationDelay: "0.2s" }}
            >
              <h3 className="text-xl font-semibold text-blue-600 mb-3">Ambitious Students</h3>
              <p className="text-gray-700">
                Who want more than just marks — they want clarity, confidence, and real-world wins.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Why Now? Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-milky-way to-sky relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-48 h-48 bg-gradient-to-r from-[#4ebbf8]/10 to-[#334EAC]/5 rounded-full blur-3xl animate-float-slow" />
        <div
          className="absolute bottom-1/4 left-1/4 w-64 h-64 bg-gradient-to-r from-[#BAD6EB]/10 to-[#4ebbf8]/5 rounded-full blur-3xl animate-float-slow"
          style={{ animationDelay: "2.5s" }}
        />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="animate-on-scroll animate-slide-in-left">
              <h2 className="text-3xl md:text-4xl font-bold text-galaxy mb-6">Why now?</h2>
              <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                The Indian EdTech and Career Guidance market is exploding — but most platforms are either too generic,
                too outdated, or too corporate.
              </p>
              <p className="text-xl font-semibold text-galaxy mb-8">
                We're building something different — for students, by students. Backed by real journeys and real
                outcomes.
              </p>
              <Link href="/signup">
                <Button size="lg" className="bg-gradient-to-r from-[#334EAC] to-[#4ebbf8] text-white">
                  Join Beyond Career <ArrowRight className="ml-2 h-5 w-5 animate-bounce-gentle" />
                </Button>
              </Link>
            </div>
            <div className="space-y-4 animate-on-scroll animate-slide-in-right">
              <div className="flex items-center gap-3 glass p-4 rounded-lg shadow-sm hover-lift">
                <CheckCircle className="h-6 w-6 text-success-green flex-shrink-0" />
                <span className="text-lg text-galaxy font-medium">20,000+ students already using our resources</span>
              </div>
              <div className="flex items-center gap-3 glass p-4 rounded-lg shadow-sm hover-lift">
                <CheckCircle className="h-6 w-6 text-success-green flex-shrink-0" />
                <span className="text-lg text-galaxy font-medium">5000+ onboarded into our community</span>
              </div>
              <div className="flex items-center gap-3 glass p-4 rounded-lg shadow-sm hover-lift">
                <CheckCircle className="h-6 w-6 text-success-green flex-shrink-0" />
                <span className="text-lg text-galaxy font-medium">2000+ students personally mentored</span>
              </div>
              <div className="flex items-center gap-3 glass p-4 rounded-lg shadow-sm hover-lift">
                <CheckCircle className="h-6 w-6 text-success-green flex-shrink-0" />
                <span className="text-lg text-galaxy font-medium">Live partnerships with colleges</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Meet the Team Section */}
      <section className="py-16 px-4 bg-gradient-to-br from-white via-white to-sky/10 relative overflow-hidden">
        <div className="container mx-auto max-w-6xl text-center relative z-10 animate-on-scroll animate-fade-in">
          <h2 className="text-3xl md:text-4xl font-bold text-galaxy mb-4">Meet the Team</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-12">
            The passionate minds building Beyond Career for you.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 justify-items-center">
            {teamMembers.map((member, index) => (
              <Card
                key={member.name}
                className="glass p-6 rounded-xl flex flex-col items-center text-center animate-on-scroll animate-scale-in hover-lift w-full max-w-xs"
                style={{ animationDelay: `${0.1 * index}s` }}
              >
                <div className="relative w-32 h-32 rounded-full overflow-hidden mb-4 border-4 border-planetary/20 shadow-md">
                  <Image
                    src={member.image || "/placeholder.svg"}
                    alt={member.name}
                    width={128}
                    height={128}
                    className="object-cover w-full h-full"
                  />
                </div>
                <h3 className="text-xl font-semibold text-galaxy mb-1">{member.name}</h3>
                <p className="text-gray-600 font-medium text-sm mb-4">{member.role}</p>
                <Link href={member.linkedin} target="_blank" rel="noopener noreferrer">
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-blue-500 text-blue-500 hover:bg-blue-500/10 bg-transparent"
                  >
                    <Linkedin className="h-4 w-4 mr-2" /> Connect
                  </Button>
                </Link>
              </Card>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
