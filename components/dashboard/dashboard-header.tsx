"use client"

import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Candy, LogOut, Plus } from "lucide-react"
import { useState, useEffect } from "react"
import { AddSweetDialog } from "./add-sweet-dialog"

export function DashboardHeader() {
  const router = useRouter()
  const [userName, setUserName] = useState("")
  const [userRole, setUserRole] = useState("")

  useEffect(() => {
    const name = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user-name="))
      ?.split("=")[1]
    const role = document.cookie
      .split("; ")
      .find((row) => row.startsWith("user-role="))
      ?.split("=")[1]

    setUserName(name || "")
    setUserRole(role || "")
  }, [])

  const handleLogout = () => {
    document.cookie = "auth-token=; path=/; max-age=0"
    document.cookie = "user-role=; path=/; max-age=0"
    document.cookie = "user-name=; path=/; max-age=0"
    router.push("/login")
    router.refresh()
  }

  return (
    <header className="border-b bg-card/50 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary text-primary-foreground">
              <Candy className="w-5 h-5" />
            </div>
            <div>
              <h1 className="text-xl font-bold">Sweet Shop</h1>
              <p className="text-sm text-muted-foreground">Welcome, {userName}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {userRole === "ADMIN" && (
              <AddSweetDialog>
                <Button size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Add Sweet
                </Button>
              </AddSweetDialog>
            )}
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>
    </header>
  )
}
