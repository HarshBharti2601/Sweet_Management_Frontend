"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Loader2 } from "lucide-react"
import { Notification } from "@/components/ui/notification"

const API_URL = "https://sweet-management-for-harsh.vercel.app"

export function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [notification, setNotification] = useState<{
    title: string
    description: string
    variant: "default" | "destructive" | "success"
  } | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      const data = await response.json()

      if (!response.ok) {
        setNotification({
          title: "Invalid Credentials",
          description: "The email or password you entered is incorrect.",
          variant: "destructive",
        })

        // Redirect to register page after 2 seconds
        setTimeout(() => {
          window.location.href = "/register"
        }, 2000)

        setIsLoading(false)
        return
      }

      // Store token in cookie
      document.cookie = `auth-token=${data.token}; path=/; max-age=604800`
      document.cookie = `user-role=${data.user.role}; path=/; max-age=604800`
      document.cookie = `user-name=${data.user.name}; path=/; max-age=604800`

      setNotification({
        title: "Welcome back!",
        description: `Logged in as ${data.user.name}`,
        variant: "success",
      })

      // Redirect after a short delay to show the notification
      setTimeout(() => {
        window.location.href = "/dashboard"
      }, 1000)
    } catch (error) {
      setNotification({
        title: "Connection Error",
        description: "Unable to connect to the server. Please check your connection.",
        variant: "destructive",
      })
      setIsLoading(false)
    }
  }

  return (
    <>
      {notification && (
        <Notification
          title={notification.title}
          description={notification.description}
          variant={notification.variant}
          onClose={() => setNotification(null)}
        />
      )}

      <Card>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 pt-6">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Sign In
            </Button>
          </CardFooter>
        </form>
      </Card>
    </>
  )
}
