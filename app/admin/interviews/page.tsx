"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ScheduleInterviewModal from "@/components/modals/interview-modal"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Calendar, Clock, User } from "lucide-react"

export default function AdminInterviewsPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [interviews, setInterviews] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("/api/interviews", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setInterviews(data.data)
      }
    } catch (error) {
      console.error("Error fetching interviews", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/login")
    } else if (!loading) {
      fetchInterviews()
    }
  }, [loading, user, userRole, router])

  const handleAction = (id: string, action: string) => {
    // Placeholder for now
    alert(`${action} interview ${id}`)
  }

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={3} />
        <SkeletonTable />
      </main>
    )
  }

  const today = new Date().toISOString().split('T')[0]
  const scheduledToday = interviews.filter(i => i.date === today).length

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <ScheduleInterviewModal />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Scheduled</p>
            <p className="text-3xl font-bold">{interviews.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Today</p>
            <p className="text-3xl font-bold">{scheduledToday}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Upcoming</p>
            <p className="text-3xl font-bold">{interviews.filter(i => i.status === 'scheduled').length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Interview List */}
      <div className="space-y-4">
        {interviews.length === 0 && (
          <p className="text-center text-muted-foreground py-8">No interviews scheduled yet.</p>
        )}
        {interviews.map((interview) => (
          <Card key={interview.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User size={20} />
                    {interview.candidateEmail}
                  </h3>
                  <p className="text-sm text-muted-foreground">Job ID: {interview.jobId}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${interview.status === 'scheduled' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                  {interview.status}
                </span>
              </div>

              <div className="flex items-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <Calendar size={16} className="text-muted-foreground" />
                  <span>{interview.date}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock size={16} className="text-muted-foreground" />
                  <span>{interview.time} ({interview.duration})</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline" onClick={() => handleAction(interview.id, 'Meeting Link')}>
                  Send Meeting Link
                </Button>
                <Button size="sm" variant="outline" onClick={() => handleAction(interview.id, 'Reschedule')}>
                  Reschedule
                </Button>
                <Button size="sm" variant="outline" className="text-red-500 hover:text-red-600" onClick={() => handleAction(interview.id, 'Cancel')}>
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </main>
  )
}
