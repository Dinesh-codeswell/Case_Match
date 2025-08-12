"use client"

import { useState, type FormEvent } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Mail, Check } from "lucide-react"

/**
 * Renders the blue “Subscribe to Stay Updated” band that appears
 * above the footer site-wide.
 */
export default function NewsletterSection() {
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!email) return
    // TODO: send `email` to your backend / 3rd-party service here.
    setSubscribed(true)
    setEmail("")
    // Hide the success state after a few seconds (optional UX nicety).
    setTimeout(() => setSubscribed(false), 4000)
  }

  return (
    <section className="bg-blue-600 text-white py-16 px-4">
      <div className="container mx-auto max-w-3xl text-center space-y-8">
        <h2 className="text-2xl md:text-3xl font-bold">Subscribe to Stay Updated</h2>
        <p className="text-white/80">
          Get the latest career insights, job opportunities, and success tips delivered directly to your inbox.
        </p>

        {/* success message */}
        {subscribed && (
          <div className="flex items-center justify-center gap-2 text-green-200">
            <Check className="h-5 w-5" /> Thank you for subscribing!
          </div>
        )}

        {/* form */}
        {!subscribed && (
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/70" />
              <Input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="pl-11 h-12 rounded-full bg-white/10 placeholder:text-white/70 border-white/20 focus:bg-white/20"
              />
            </div>
            <Button
              type="submit"
              className="h-12 px-8 rounded-full bg-yellow-400 text-blue-900 hover:bg-yellow-300 transition-colors"
            >
              Subscribe
            </Button>
          </form>
        )}

        <p className="text-xs text-white/70">No spam, unsubscribe at any time.</p>
      </div>
    </section>
  )
}
