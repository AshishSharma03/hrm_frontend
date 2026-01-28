"use client"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { SkeletonGrid } from "@/components/skeleton-loader"
import ReferCandidateModal from "@/components/modals/refer-candidate-modal"

export default function EmployeeJobsPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [jobs, setJobs] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
      router.push("/login")
    } else if (!loading) {
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
      fetchJobs()
    }
  }, [loading, user, userRole, router])

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={3} />
      </main>
    )
  }

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="space-y-4">
        {jobs.length === 0 ? (
          <p className="text-muted-foreground text-center py-8">No open positions at the moment.</p>
        ) : (
          jobs.map((job) => (
            <Card key={job.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold mb-1">{job.jobTitle}</h3>
                    <p className="text-sm text-muted-foreground">
                      {job.department} • {job.experience || 'Not specified'}
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-primary/10 text-primary text-xs font-bold rounded-full capitalize">
                    {job.jobType || 'Full Time'}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{job.description}</p>
                <div className="flex gap-2">
                  <ReferCandidateModal onSubmit={() => { }} />
                  <Button variant="outline" size="sm" onClick={() => router.push(`/employee/jobs/${job.id}`)}>
                    View Details
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </main>
  )
}
