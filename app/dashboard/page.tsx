"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { DashboardContent } from "@/components/dashboard/dashboard-content"
import { DashboardHeader } from "@/components/dashboard/dashboard-header"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const token = document.cookie
      .split("; ")
      .find((row) => row.startsWith("auth-token="))
      ?.split("=")[1]

    console.log("[v0] Checking authentication, token exists:", !!token)

    if (!token) {
      console.log("[v0] No token found, redirecting to login")
      router.push("/login")
      return
    }

    setIsAuthenticated(true)
    setIsLoading(false)
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-background">
      <DashboardHeader />
      <DashboardContent />
    </div>
  )
}
