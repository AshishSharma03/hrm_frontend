"use client"

import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react" // Import Plus component

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"

export default function EmployeeJobsPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
      router.push("/login")
    }
  }, [loading, user, userRole, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  const jobs = [
    { id: "J001", title: "Senior Backend Developer", department: "Engineering", experience: "5+ years" },
    { id: "J002", title: "Product Manager", department: "Product", experience: "3+ years" },
  ]

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <h3 className="text-lg font-semibold mb-2">{job.title}</h3>
              <p className="text-sm text-muted-foreground mb-4">
                {job.department} • {job.experience}
              </p>
              <Button className="flex items-center gap-2">
                <Plus size={16} /> {/* Use Plus component */}
                Refer Candidate
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
