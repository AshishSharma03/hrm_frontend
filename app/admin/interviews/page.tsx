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
        <SkeletonGrid count={3} />
        <SkeletonTable />
      </main>
    )
  }

  const interviews = [
    {
      id: "INT001",
      candidateName: "Alex Johnson",
      position: "Senior Developer",
      date: "2024-01-25",
      time: "10:00 AM",
      status: "scheduled",
    },
    {
      id: "INT002",
      candidateName: "Maria Garcia",
      position: "Product Manager",
      date: "2024-01-25",
      time: "02:00 PM",
      status: "scheduled",
    },
  ]

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
            <p className="text-3xl font-bold">24</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Today</p>
            <p className="text-3xl font-bold">3</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">This Week</p>
            <p className="text-3xl font-bold">8</p>
          </CardContent>
        </Card>
      </div>

      {/* Interview List */}
      <div className="space-y-4">
        {interviews.map((interview) => (
          <Card key={interview.id} className="hover:shadow-lg transition-shadow">
            <CardContent className="pt-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <User size={20} />
                    {interview.candidateName}
                  </h3>
                  <p className="text-sm text-muted-foreground">{interview.position}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
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
                  <span>{interview.time}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <Button size="sm" variant="outline">
                  Send Meeting Link
                </Button>
                <Button size="sm" variant="outline">
                  Reschedule
                </Button>
                <Button size="sm" variant="outline">
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
