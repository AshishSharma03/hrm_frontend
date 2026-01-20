"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2 } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { LoginLoadingScreen } from "@/components/login-loading-screen"

export default function LoginForm() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      // Direct API call without context dependency
      const loginResponse = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      })

      if (!loginResponse.ok) {
        const errorData = await loginResponse.json()
        throw new Error(errorData.message || "Login failed")
      }

      const loginData = await loginResponse.json()
      
      if (!loginData.token || !loginData.user) {
        throw new Error("Invalid response from server")
      }
      
      localStorage.setItem("authToken", loginData.token)
      localStorage.setItem("userRole", loginData.user.role)

      const redirectPath =
        {
          admin: "/admin/dashboard",
          recruiter: "/recruiter/dashboard",
          employee: "/employee/dashboard",
        }[loginData.user.role] || "/"

      // Reload to ensure auth state is updated
      setTimeout(() => {
        window.location.href = redirectPath
      }, 300)
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Login failed"
      setError(errorMessage)
      setLoading(false)
    }
  }

  return (
    <>
      <LoginLoadingScreen isLoading={loading} />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center text-white font-bold">
                HR
              </div>
              <span className="text-xl font-bold text-primary">HRMS Portal</span>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-2">
              {error && (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              <div className="space-y-2">
                <Label htmlFor="email">Email Address</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-muted/50"
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
                  className="bg-muted/50"
                />
              </div>

              <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {loading ? "Signing in..." : "Sign In"}
              </Button>
            </form>


          </CardContent>
        </Card>
      </div>
    </>
  )
}
