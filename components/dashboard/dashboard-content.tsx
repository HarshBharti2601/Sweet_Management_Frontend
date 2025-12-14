"use client"

import { useState, useEffect } from "react"
import { Input } from "@/components/ui/input"
import { Search } from "lucide-react"
import { SweetCard } from "./sweet-card"
import { CategoryFilter } from "./category-filter"
import { useToast } from "@/hooks/use-toast"

const API_URL = "https://sweet-management-for-harsh.vercel.app"

interface Sweet {
  id: string
  name: string
  category: string
  price: number
  quantity: number
  createdAt: string
}

export function DashboardContent() {
  const [sweets, setSweets] = useState<Sweet[]>([])
  const [filteredSweets, setFilteredSweets] = useState<Sweet[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [isLoading, setIsLoading] = useState(true)
  const [userRole, setUserRole] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    const role = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user-role="))
      ?.split("=")[1]
    setUserRole(role || "")
  }, [])

  const fetchSweets = async () => {
    try {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth-token="))
        ?.split("=")[1]

      if (!token) {
        return
      }

      console.log("[v0] Fetching sweets from API")
      const response = await fetch(`${API_URL}/api/sweets`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error("Failed to fetch sweets")
      }

      const data = await response.json()
      console.log("[v0] Fetched sweets:", data.length)
      setSweets(data)
      setFilteredSweets(data)
    } catch (error) {
      console.log("[v0] Error fetching sweets:", error)
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to load sweets",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchSweets()
  }, [])

  useEffect(() => {
    let filtered = sweets

    if (searchQuery) {
      filtered = filtered.filter(
        (sweet) =>
          sweet.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          sweet.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    if (selectedCategory !== "all") {
      filtered = filtered.filter((sweet) => sweet.category.toLowerCase() === selectedCategory.toLowerCase())
    }

    setFilteredSweets(filtered)
  }, [searchQuery, selectedCategory, sweets])

  const categories = ["all", ...Array.from(new Set(sweets.map((s) => s.category)))]

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h2 className="text-3xl font-bold mb-2 text-balance">Discover Our Sweet Collection</h2>
        <p className="text-muted-foreground">Browse through our delightful selection of treats</p>
      </div>

      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
          <Input
            placeholder="Search sweets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
        <CategoryFilter categories={categories} selected={selectedCategory} onSelect={setSelectedCategory} />
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-80 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : filteredSweets.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">No sweets found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredSweets.map((sweet) => (
            <SweetCard key={sweet.id} sweet={sweet} isAdmin={userRole === "ADMIN"} onUpdate={fetchSweets} />
          ))}
        </div>
      )}
    </div>
  )
}
