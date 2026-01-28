"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import CreateJobModal from "@/components/modals/create-job-modal"
import { Briefcase, MapPin, Clock, Users, Calendar } from "lucide-react"

export default function RecruiterJobsPage() {
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
    if (!loading && (!user || userRole !== "recruiter")) {
      router.push("/login")
    } else if (!loading) {
      fetchJobs()
    }
  }, [loading, user, userRole, router])

  if (loading || isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <CreateJobModal onSubmit={() => fetchJobs()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Total Jobs</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{jobs.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Active Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-green-600">
              {jobs.filter(j => j.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground uppercase">Closed Postings</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-muted-foreground">
              {jobs.filter(j => j.status === "closed").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <h2 className="text-xl font-bold mb-2">Job Listings</h2>
        {jobs.length === 0 ? (
          <p className="text-muted-foreground">No jobs posted yet.</p>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-primary">{job.jobTitle}</h3>
                    <p className="text-sm text-muted-foreground capitalize">{job.department}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${job.status === "active" ? "bg-green-100 text-green-700" : "bg-muted text-muted-foreground"
                    }`}>
                    {job.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4 text-sm">
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span>{job.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span className="capitalize">{job.jobType}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Briefcase size={16} className="text-muted-foreground" />
                    <span>{job.experience} yrs</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} className="text-muted-foreground" />
                    <span>{job.totalApplications || 0} applications</span>
                  </div>
                </div>

                <div className="flex justify-between items-center pt-4 border-t">
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={14} />
                    Posted on {new Date(job.createdDate).toLocaleDateString()}
                  </div>
                  <p className="font-semibold text-primary">₹{job.salary}</p>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
