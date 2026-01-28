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
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchJobs = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("/api/jobs", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setJobs(data.data)
      }
    } catch (error) {
      console.error("Error fetching jobs", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/login")
    } else if (!loading) {
      fetchJobs()
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

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <AddJobModal onSubmit={() => fetchJobs()} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Job Postings</p>
            <p className="text-3xl font-bold">{jobs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Applications</p>
            <p className="text-3xl font-bold">{jobs.reduce((acc, job) => acc + (job.totalApplications || 0), 0)}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Active Postings</p>
            <p className="text-3xl font-bold text-green-600">{jobs.filter(j => j.status === 'active').length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Closed Postings</p>
            <p className="text-3xl font-bold">{jobs.filter(j => j.status === 'closed').length}</p>
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
                  <h3 className="text-lg font-semibold">{job.jobTitle}</h3>
                  <p className="text-sm text-muted-foreground uppercase">{job.department}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                  {job.status}
                </span>
              </div>

              <div className="grid grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Users size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Applications</p>
                    <p className="font-semibold">{job.totalApplications || 0}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <BarChart3 size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Location</p>
                    <p className="font-semibold">{job.location || 'N/A'}</p>
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
