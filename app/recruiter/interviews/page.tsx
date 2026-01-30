"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Calendar, Clock, MapPin, User, Video, Phone } from "lucide-react"
import ScheduleInterviewModal from "@/components/modals/interview-modal"

interface Interview {
  id: string
  candidateId: string
  candidateEmail: string
  date: string
  time: string
  duration: string
  type: string
  location: string
  status: string
  jobId: string
}

export default function RecruiterInterviewsPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [interviews, setInterviews] = useState<Interview[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, today: 0, thisWeek: 0 })

  const fetchInterviews = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("/api/interviews", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setInterviews(data.data || [])
        calculateStats(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching interviews", error)
    } finally {
      setIsLoading(false)
    }
  }

  const calculateStats = (interviewList: Interview[]) => {
    const today = new Date().toISOString().split('T')[0]
    const weekStart = new Date()
    weekStart.setDate(weekStart.getDate() - weekStart.getDay())
    const weekEnd = new Date(weekStart)
    weekEnd.setDate(weekEnd.getDate() + 6)

    const todayCount = interviewList.filter(i => i.date === today).length
    const weekCount = interviewList.filter(i => {
      const interviewDate = new Date(i.date)
      return interviewDate >= weekStart && interviewDate <= weekEnd
    }).length

    setStats({
      total: interviewList.length,
      today: todayCount,
      thisWeek: weekCount
    })
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "recruiter")) {
      router.push("/login")
    } else if (!loading) {
      fetchInterviews()
    }
  }, [loading, user, userRole, router])

  const getTypeIcon = (type: string) => {
    switch (type?.toLowerCase()) {
      case 'video': return <Video size={16} className="text-blue-500" />
      case 'phone': return <Phone size={16} className="text-green-500" />
      default: return <User size={16} className="text-purple-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'scheduled': return 'bg-blue-100 text-blue-700'
      case 'completed': return 'bg-green-100 text-green-700'
      case 'cancelled': return 'bg-red-100 text-red-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading || isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <div className="mb-8 flex justify-end">
          <ScheduleInterviewModal onSubmit={() => fetchInterviews()} />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total</p>
            <p className="text-3xl font-bold">{stats.total}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Today</p>
            <p className="text-3xl font-bold text-blue-600">{stats.today}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">This Week</p>
            <p className="text-3xl font-bold text-purple-600">{stats.thisWeek}</p>
          </CardContent>
        </Card>
      </div>

      {/* Interview List */}
      <Card>
        <CardHeader>
          <CardTitle>Scheduled Interviews</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {interviews.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No interviews scheduled yet.</p>
          ) : (
            interviews.map((interview) => (
              <div key={interview.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold text-lg">{interview.candidateEmail}</p>
                    <p className="text-sm text-muted-foreground">Candidate ID: {interview.candidateId}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(interview.status)}`}>
                    {interview.status?.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} className="text-muted-foreground" />
                    <span>{interview.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock size={16} className="text-muted-foreground" />
                    <span>{interview.time} ({interview.duration})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    {getTypeIcon(interview.type)}
                    <span className="capitalize">{interview.type}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin size={16} className="text-muted-foreground" />
                    <span>{interview.location}</span>
                  </div>
                </div>

                <div className="flex gap-2 mt-4 pt-3 border-t">
                  <Button size="sm" variant="outline">View Details</Button>
                  <Button size="sm" variant="outline">Reschedule</Button>
                  {interview.status === 'scheduled' && (
                    <Button size="sm" className="bg-green-600 hover:bg-green-700">Mark Complete</Button>
                  )}
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}
