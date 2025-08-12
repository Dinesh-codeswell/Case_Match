import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import AboutContent from "@/components/about-content"

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-milky-way text-galaxy">
      <Header />
      <main className="pt-20">
        {" "}
        {/* Added padding-top for distance from header */}
        <AboutContent />
      </main>
      <Footer />
    </div>
  )
}
