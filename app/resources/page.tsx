import ResourcesContent from "@/components/resources-content"
import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer" // Import the Footer component

export default function ResourcesPage() {
  return (
    <main className="bg-white">
      <Header />
      {/* List of resources */}
      <ResourcesContent />
      <Footer /> {/* Add the Footer component here */}
    </main>
  )
}
