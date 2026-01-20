"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export default function EmployeeExitPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
      router.push("/login")
    }
  }, [loading, user, userRole, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          Submit Exit Request
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exit Requests</CardTitle>
          <CardDescription>No exit requests submitted</CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Click "Submit Exit Request" to initiate your exit process.</p>
        </CardContent>
        </Card>
    </main>
  )
}
