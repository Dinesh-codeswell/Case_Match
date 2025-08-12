"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, Filter, Eye, FileText, Folder, BarChart3 } from "lucide-react"
import { categories, resources } from "@/data/resources"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/auth-context" // Standard import

const getResourceIcon = (type: string) => {
  switch (type.toLowerCase()) {
    case "guide":
      return FileText
    case "template":
      return FileText
    case "checklist":
      return FileText
    case "toolkit":
      return Folder
    case "course":
      return BarChart3
    default:
      return FileText
  }
}

export default function ResourcesContent() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedType, setSelectedType] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const { user, loading: authLoading } = useAuth() // Destructure user and loading from useAuth
  const [viewsMap, setViewsMap] = useState<{ [id: number]: number }>({})

  // Increment view for each resource ONLY when the resources page is loaded
  useEffect(() => {
    resources.forEach(async (resource) => {
      await fetch(`/api/resources/${resource.id}/views`, { method: "POST" })
    })
  }, [])

  // Fetch view counts for all resources
  useEffect(() => {
    async function fetchViews() {
      const results: { [id: number]: number } = {}
      await Promise.all(
        resources.map(async (resource) => {
          try {
            const res = await fetch(`/api/resources/${resource.id}/views`, { method: "GET" })
            const data = await res.json()
            results[resource.id] = data.viewCount || 2500
          } catch {
            results[resource.id] = 2500
          }
        })
      )
      setViewsMap(results)
    }
    fetchViews()
  }, [])

  const filteredResources = resources.filter((resource) => {
    const matchesCategory = selectedCategory === "all" || resource.category === selectedCategory
    const matchesType = selectedType === "all" || resource.type.toLowerCase() === selectedType.toLowerCase()
    const matchesSearch =
      resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      resource.tags.some((tag) => tag.toLowerCase().includes(searchQuery.toLowerCase()))
    return matchesCategory && matchesType && matchesSearch
  })

  const handleGetNow = (resourceLink: string) => {
    if (!user) {
      // Redirect to signup if not authenticated
      router.push("/signup")
      return
    }
    // Open resource link if authenticated
    window.open(resourceLink, "_blank", "noopener,noreferrer")
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="bg-white py-12 md:py-16 px-4">
        <div className="container mx-auto max-w-4xl text-center">
          <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-gray-900 mb-4 md:mb-6">
            Free Career Resources
          </h1>
          <p className="text-lg md:text-xl text-gray-600 mb-8 md:mb-12 max-w-3xl mx-auto leading-relaxed">
            Access our comprehensive library of career guides, templates, and tools to accelerate your professional
            growth.
          </p>

          {/* Search and Filters */}
          <div className="flex flex-col md:flex-row gap-4 max-w-4xl mx-auto">
            <div className="relative flex-1">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search resources, guides, templates..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-4 py-3 text-base border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-full md:w-48 py-3 border-gray-200 rounded-lg">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                {categories.slice(1).map((category) => (
                  <SelectItem key={category.id} value={category.id}>
                    {category.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-full md:w-48 py-3 border-gray-200 rounded-lg">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="guide">Guide</SelectItem>
                <SelectItem value="template">Template</SelectItem>
                <SelectItem value="checklist">Checklist</SelectItem>
                <SelectItem value="toolkit">Toolkit</SelectItem>
                <SelectItem value="course">Course</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </section>

      {/* Results Section */}
      <section className="py-8 px-4 bg-white border-t border-gray-100">
        <div className="container mx-auto">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-900">
              {filteredResources.length} Resources Found
            </h2>
            <Button
              variant="outline"
              className="flex items-center gap-2 text-blue-600 border-blue-200 hover:bg-blue-50 bg-transparent"
            >
              <Filter className="h-4 w-4" />
              More Filters
            </Button>
          </div>

          {/* Resources Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {filteredResources.map((resource, index) => {
              const IconComponent = getResourceIcon(resource.type)
              return (
                <Card
                  key={resource.id}
                  className="border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300 rounded-xl bg-white flex flex-col"
                >
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <div className="space-y-4 flex-grow">
                      {/* Icon and Featured Badge */}
                      <div className="flex items-start justify-between">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <IconComponent className="h-6 w-6 text-blue-600" />
                        </div>
                        {resource.isFeatured && (
                          <Badge className="bg-yellow-100 text-yellow-800 border-yellow-200 text-xs font-medium">
                            Featured
                          </Badge>
                        )}
                      </div>

                      {/* Title and Description */}
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 line-clamp-2">{resource.title}</h3>
                        <p className="text-sm text-gray-600 line-clamp-3 leading-relaxed">{resource.description}</p>
                      </div>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-2">
                        {resource.tags.slice(0, 3).map((tag) => (
                          <Badge
                            key={tag}
                            variant="secondary"
                            className="text-xs bg-gray-100 text-gray-700 hover:bg-gray-200"
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    {/* Stats */}
                    <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <Eye className="h-4 w-4" />
                        {viewsMap[resource.id] || 2500} Views
                      </div>
                      <Badge variant="outline" className="text-xs ml-auto">
                        {resource.type}
                      </Badge>
                    </div>

                    {/* Get Now Button */}
                    <Button
                      onClick={() => handleGetNow(resource.link)}
                      variant="outline"
                      className="w-full mt-4 text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300 bg-transparent"
                    >
                      <Eye className="h-4 w-4 mr-2" />
                      Get Now
                    </Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      </section>
    </div>
  )
}
