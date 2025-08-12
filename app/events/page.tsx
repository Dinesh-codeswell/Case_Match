import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ComingSoonGenZ } from "@/components/coming-soon-genz"

export default function EventsPage() {
  return (
    <div className="min-h-screen bg-milky-way text-galaxy">
      <Header />
      <main>
        <ComingSoonGenZ />
      </main>
      <Footer />
    </div>
  )
}
