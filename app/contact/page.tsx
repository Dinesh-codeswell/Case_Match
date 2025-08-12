import { Header } from "@/components/Header"
import { Footer } from "@/components/Footer"
import { ComingSoon } from "@/components/coming-soon-genz"

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-milky-way text-galaxy">
      <Header />
      <main>
        <ComingSoon
          title="Contact & Support"
          description="Get in touch with our team for support, partnerships, or general inquiries. Our comprehensive contact system will provide multiple ways to reach us and get the help you need."
          features={[
            "Contact form with categories",
            "Live chat support",
            "FAQ and help center",
            "Support ticket system",
            "Partnership inquiries",
            "Media and press contacts",
          ]}
        />
      </main>
      <Footer />
    </div>
  )
}
