"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AddJobModal from "@/components/modals/add-job-modal"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Briefcase, Share2, BarChart3, Users } from "lucide-react"

export default function AdminJobsPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/login")
    } else if (!loading) {
      setTimeout(() => setIsLoading(false), 1000)
    }
  }, [loading, user, userRole, router])

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={4} />
        <SkeletonTable />
      </main>
    )
  }

  // Mock job postings data
  const jobs = [
    {
      id: "J001",
      title: "Senior Software Engineer",
      department: "Engineering",
      applicants: 24,
      interviews: 5,
      status: "active",
    },
    {
      id: "J002",
      title: "Product Manager",
      department: "Product",
      applicants: 18,
      interviews: 3,
      status: "active",
    },
    {
      id: "J003",
      title: "UX Designer",
      department: "Design",
      applicants: 12,
      interviews: 2,
      status: "active",
    },
  ]

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <AddJobModal />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Job Postings</p>
            <p className="text-3xl font-bold">7</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Applications</p>
            <p className="text-3xl font-bold">124</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">High-Score CVs (75%+)</p>
            <p className="text-3xl font-bold text-green-600">34</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Interviews Scheduled</p>
            <p className="text-3xl font-bold">12</p>
          </CardContent>
        </Card>
      </div>

      {/* Job Listings */}
      <div className="space-y-4">
        {jobs.map((job) => (
          <Card key={job.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold">{job.title}</h3>
                  <p className="text-sm text-muted-foreground">{job.department}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">
                  Active
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Applications</p>
                    <p className="font-semibold">{job.applicants}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Interviews</p>
                    <p className="font-semibold">{job.interviews}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Status</p>
                    <p className="font-semibold capitalize">{job.status}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
