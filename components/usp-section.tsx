import { Button } from "@/components/ui/button"

export function USPSection() {
  return (
    <section className="py-16 px-4 bg-[#BAD6EB] relative overflow-hidden">
      <div className="container mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold text-[#081F5C] mb-6 leading-tight">
              Why Beyond Career is Built Different
            </h2>
           <Button
              variant="outline"
              className="border-white text-[#081F5C] bg-transparent hover:bg-white/10 rounded-lg px-6 py-3"
              asChild
            >
              <a href="/signup">
                Explore →
              </a>
            </Button>
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
              <div className="text-5xl md:text-5xl font-bold text-[#081F5C] mb-4">95%</div>
              <p className="text-[#081F5C] text-sm leading-relaxed">
                Placement success rate across partner colleges through custom prep and industry mentorship
              </p>
            </div>
            <div className="text-center bg-white/20 backdrop-blur-sm rounded-2xl p-8 border border-white/30">
              <div className="text-5xl md:text-5xl font-bold text-[#081F5C] mb-4">10,000+</div>
              <p className="text-[#081F5C] text-sm leading-relaxed">
                Students impacted through resources, mentorship sessions, and community support
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export default USPSection
