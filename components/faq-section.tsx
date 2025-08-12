"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronDown, ChevronUp } from "lucide-react"
import Link from "next/link"

const faqs = [
  {
    question: "What is Beyond Career and how does it help students and job seekers?",
    answer:
     " Beyond Career is a leading career development platform designed to help students, graduates, and job seekers access free learning resources, explore the latest internships and jobs opportunities, register for career-boosting events, and join a dynamic professional community, all in one place. Our mission is to make career success accessible to everyone, from students to early professionals, with an intuitive and powerful online experience.",
  },
  {
    question: "Are all learning resources on Beyond Career free?",
    answer:
      "Yes, every learning resource on Beyond Career is free. You can browse resources across multiple domains such as engineering, business, and technology, making it the best free resource portal for students and upskilling professionals.",
  },
  {
    question: "How do I search and apply for the latest internships and jobs?",
    answer:
      "Discover the latest internships and job openings by joining Beyond Career’s exclusive Job & Internship Community—your gateway to real-time career opportunities, direct HR contacts, and curated placement resources in every industry. Instantly connect with recruiters, explore new job alerts, and access expert tips for applications—all for free.",
  },
  {
    question: "How can I register for upcoming career events and webinars?",
    answer:
      "Our Events page features upcoming webinars, workshops, and career fairs designed to boost your skills and employability. Sign up or log in to your Beyond Career account, fill in the registration form for any event, and you’ll receive instant email confirmation and reminders, making career event registration seamless and hassle-free.",
  },
  {
    question: "Is Beyond Career mobile-friendly and accessible for all users?",
    answer:
      "Absolutely! Beyond Career is fully optimized for mobile, tablet, and desktop use. We ensure accessibility for all users, with features such as responsive design, keyboard navigation, and screen reader compatibility, delivering the best online career platform experience everywhere and for everyone.",
  },
  {
    question: " How does Beyond Career protect my data and privacy?",
    answer:
      "Your privacy and data security are our top priorities. Beyond Career uses encrypted connections (HTTPS), follows strict privacy policies, and never shares your personal details with third parties. You can confidently use our platform for job applications, downloads, and networking, knowing your data is always safe.",
  },
]

export function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(null)

  const toggleFAQ = (index: number) => {
    setOpenIndex(openIndex === index ? null : index)
  }

  return (
    <>
      {/* FAQ Section */}
      <section className="py-16 px-4 bg-new-sky">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-12">
            <div className="inline-flex items-center px-4 py-2 bg-[#4ebbf8]/10 rounded-full text-sm font-medium text-[#4ebbf8] mb-4">
              Frequently Asked Questions
            </div>
            <h2 className="text-3xl font-bold text-[#081F5C] mb-4">Got Questions? We Have Answers</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Everything you need to know about Beyond Career and how we can transform your professional journey.
            </p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-gray-50 rounded-lg border border-gray-200">
                <button
                  className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-100 transition-colors rounded-lg"
                  onClick={() => toggleFAQ(index)}
                >
                  <span className="font-medium text-[#081F5C]">{faq.question}</span>
                  {openIndex === index ? (
                    <ChevronUp className="h-5 w-5 text-gray-500" />
                  ) : (
                    <ChevronDown className="h-5 w-5 text-gray-500" />
                  )}
                </button>
                {openIndex === index && (
                  <div className="px-6 pb-4">
                    <p className="text-gray-600">{faq.answer}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto max-w-4xl">
          <div className="bg-[#334EAC] rounded-2xl p-8 md:p-12 text-center text-white">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">JOIN OUR COMMUNITY  UNLOCK YOUR POTENTIAL   </h3>
            <p className="text-white/80 mb-6 max-w-2xl mx-auto">
              Create an account to explore job opportunities and connect with employers tailored for you.     
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
  asChild
  className="bg-[#BAD6EB] text-[#334EAC] hover:bg-white font-semibold"
>
  <Link href="/signup">Sign Up</Link>
</Button>

<Button
  asChild
  variant="outline"
  className="border-white text-black hover:bg-white/10 bg-transparent"
>
  <a className="bg-white text-black font-bold rounded-md px-0"
    href="https://forms.gle/E9rZqRm5vck3tN5h8"
    target="_blank"
    rel="noopener noreferrer"
  >
    Join Community
  </a>
</Button>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}

export default FAQSection
