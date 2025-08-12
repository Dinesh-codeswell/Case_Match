import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Building, MapPin, DollarSign } from "lucide-react"

const openings = [
  {
    title: "Senior React Developer",
    company: "TechFlow Inc",
    location: "San Francisco, CA",
    salary: "$120k - $150k",
    type: "Full-time",
    tags: ["React", "TypeScript", "Remote"],
  },
  {
    title: "Product Designer",
    company: "Design Co",
    location: "New York, NY",
    salary: "$90k - $120k",
    type: "Full-time",
    tags: ["Figma", "UI/UX", "Design Systems"],
  },
  {
    title: "Data Scientist",
    company: "Analytics Pro",
    location: "Austin, TX",
    salary: "$100k - $130k",
    type: "Full-time",
    tags: ["Python", "ML", "Statistics"],
  },
]

export function LatestOpeningsSection() {
  return (
    <section className="py-16 px-4 bg-milky-way animate-fade-in bg-slate-100">
      <div className="container mx-auto">
        <div className="flex justify-between items-center mb-12">
          <div>
            <h2 className="text-3xl font-bold text-galaxy mb-4">Latest Openings</h2>
            <p className="text-muted-foreground max-w-2xl">
              Discover the newest job opportunities from top companies in your field.
            </p>
          </div>
          <Button className="bg-planetary hover:bg-universe text-white">View All Jobs</Button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {openings.map((opening, index) => (
            <Card
              key={index}
              className="border bg-glass border-glass backdrop-blur-glass shadow-glass-card hover:shadow-lg transition-all duration-300 rounded-2xl animate-fade-in"
              style={{ animationDelay: `${0.1 * index}s` }}
            >
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-xl font-semibold text-foreground mb-2">{opening.title}</h3>
                    <div className="space-y-2 text-sm text-muted-foreground">
                      <div className="flex items-center gap-2">
                        <Building className="h-4 w-4" />
                        {opening.company}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="h-4 w-4" />
                        {opening.location}
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="h-4 w-4" />
                        {opening.salary}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {opening.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs bg-venus text-galaxy">
                        {tag}
                      </Badge>
                    ))}
                  </div>

                  <Button className="w-full bg-planetary hover:bg-universe">Apply Now</Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}

export default LatestOpeningsSection
