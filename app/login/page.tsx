import { LoginForm } from "@/components/auth/login-form"
import { Candy } from "lucide-react"
import Link from "next/link"

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
            <Candy className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-balance">Welcome Back</h1>
          <p className="text-muted-foreground mt-2">Sign in to browse our sweet collection</p>
        </div>

        <LoginForm />

        <p className="text-center text-sm text-muted-foreground mt-6">
          {"Don't have an account? "}
          <Link href="/register" className="text-primary hover:underline font-medium">
            Create one here
          </Link>
        </p>
      </div>
    </div>
  )
}
