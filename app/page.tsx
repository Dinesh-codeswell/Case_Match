import { Header } from "@/components/Header"
import Hero from "@/components/Hero"
import Resources from "@/components/resources"
import Opportunities from "@/components/opportunities"
import { EventsSection } from "@/components/events-section"
import { USPSection } from "@/components/usp-section"
import { TestimonialsSection } from "@/components/testimonials-section"
import { TeamSection } from "@/components/team-section"
import { HowItWorksSection } from "@/components/how-it-works-section"
import { FAQSection } from "@/components/faq-section"
import { Footer } from "@/components/Footer"

export default function HomePage() {
  return (
    <div className="min-h-screen bg-milky-way text-galaxy">
      <Header />
      <main>
        <Hero />
        <Resources />
        <Opportunities />
        <EventsSection />
        <USPSection />
        <TestimonialsSection />
        <TeamSection />
        <HowItWorksSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  )
}
