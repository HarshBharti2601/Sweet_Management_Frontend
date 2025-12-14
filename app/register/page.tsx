import { RegisterForm } from "@/components/auth/register-form"
import { Candy } from "lucide-react"
import Link from "next/link"

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-secondary/20 to-accent/10 p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary text-primary-foreground mb-4">
            <Candy className="w-8 h-8" />
          </div>
          <h1 className="text-3xl font-bold text-balance">Join Sweet Shop</h1>
          <p className="text-muted-foreground mt-2">Create an account to start shopping</p>
        </div>

        <RegisterForm />

        <p className="text-center text-sm text-muted-foreground mt-6">
          Already have an account?{" "}
          <Link href="/login" className="text-primary hover:underline font-medium">
            Sign in here
          </Link>
        </p>
      </div>
    </div>
  )
}
