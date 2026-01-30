"use client"

import { Users, Briefcase, Calendar, CheckCircle, FileText, Award, Clock, LogIn, LogOut, AlertCircle } from "lucide-react"
import DashboardCard from "@/components/dashboard-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"

export default function RecruiterDashboard() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [stats, setStats] = useState({
    employees: 0,
    jobs: 0,
    interviews: 0,
    hired: 0
  })

  // Attendance State
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [hoursWorked, setHoursWorked] = useState("0h 0m")
  const [attendanceId, setAttendanceId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || userRole !== "recruiter")) {
      router.push("/login")
    }
  }, [loading, user, userRole, router])

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch Employees Count
      const empRes = await fetch("/api/employees", { headers })
      const empData = await empRes.json()

      // Fetch Jobs Count
      const jobRes = await fetch("/api/jobs", { headers })
      const jobData = await jobRes.json()

      // Fetch Interviews
      const intRes = await fetch("/api/interviews", { headers })
      const intData = await intRes.json()

      setStats({
        employees: empData.pagination?.total || 0,
        jobs: jobData.pagination?.total || 0,
        interviews: intData.data?.length || 0,
        hired: 0 // Placeholder
      })

      // Fetch Today's Attendance Status
      const attendanceRes = await fetch("/api/attendance/today", { headers })
      const attendanceData = await attendanceRes.json()
      if (attendanceData.success && attendanceData.data) {
        const status = attendanceData.data.status
        setIsCheckedIn(status === "ACTIVE")
        if (attendanceData.data.checkIn) {
          setCheckInTime(new Date(attendanceData.data.checkIn).toLocaleTimeString())
        }
        if (attendanceData.data.workedHours) {
          setHoursWorked(`${attendanceData.data.workedHours}h`)
        }
      }

    } catch (error) {
      console.error("Failed to fetch recruiter stats", error)
    }
  }

  useEffect(() => {
    if (user && userRole === "recruiter") {
      fetchStats()
    }
  }, [user, userRole])

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const now = new Date()
      const locationData = {
        employeeId: user?.id,
        location: "Office (Recruiter)",
        timestamp: now.toISOString(),
        latitude: 0,
        longitude: 0
      }

      const res = await fetch("/api/attendance/checkin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(locationData)
      })

      const data = await res.json()
      if (data.success) {
        setCheckInTime(new Date(data.data.checkIn).toLocaleTimeString())
        setIsCheckedIn(true)
      }
    } catch (error) {
      console.error("Check-in failed", error)
    }
  }

  const handleCheckOut = async () => {
    if (!isCheckedIn) return

    try {
      const token = localStorage.getItem("authToken")
      const now = new Date()
      const locationData = {
        employeeId: user?.id,
        location: "Office (Recruiter)",
        timestamp: now.toISOString(),
        latitude: 0,
        longitude: 0
      }

      const res = await fetch("/api/attendance/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(locationData)
      })

      const data = await res.json()
      if (data.success) {
        setIsCheckedIn(false)
        setHoursWorked(`${data.data.totalWorkedHours}h`)
        setCheckInTime(null)
      }
    } catch (error) {
      console.error("Check-out failed", error)
    }
  }

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      {/* Check In/Out Buttons */}
      <div className="mb-8 flex gap-2 flex-wrap">
        <Button
          onClick={handleCheckIn}
          disabled={isCheckedIn}
          className={`flex items-center gap-2 ${isCheckedIn ? "bg-muted" : "bg-green-600 hover:bg-green-700"}`}
        >
          <LogIn size={18} />
          Check In
        </Button>
        <Button
          onClick={handleCheckOut}
          disabled={!isCheckedIn}
          variant={isCheckedIn ? "default" : "outline"}
          className={`flex items-center gap-2 ${isCheckedIn ? "bg-red-600 hover:bg-red-700" : ""}`}
        >
          <LogOut size={18} />
          Check Out
        </Button>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          label="Check In Time"
          value={checkInTime || "Not checked in"}
          icon={CheckCircle}
          description={isCheckedIn ? "Checked in" : "Pending"}
        />
        <DashboardCard label="Employees" value={stats.employees.toString()} icon={Users} description="Total workforce" />
        <DashboardCard
          label="Open Jobs"
          value={stats.jobs.toString()}
          icon={Briefcase}
          description="Active job postings"
          href="/recruiter/jobs"
          trend={{ value: 5, isPositive: true }}
        />
        <DashboardCard
          label="Job Responses"
          value="124"
          icon={FileText}
          description="Total applications"
          trend={{ value: 18, isPositive: true }}
        />
        <DashboardCard label="Interviews" value={stats.interviews.toString()} icon={Calendar} description="Total Scheduled" href="/recruiter/interviews" />
        <DashboardCard
          label="Pending Approvals"
          value="5"
          icon={Award}
          description="Employee registrations waiting"
        />
      </div>

      {/* Pipeline */}
      <Card>
        <CardHeader>
          <CardTitle>Candidate Pipeline</CardTitle>
          <CardDescription>Current hiring funnel status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { stage: "New", count: 45, color: "bg-blue-100" },
              { stage: "Shortlisted", count: 32, color: "bg-purple-100" },
              { stage: "Interviewed", count: 18, color: "bg-orange-100" },
              { stage: "Offered", count: 8, color: "bg-green-100" },
              { stage: "Hired", count: 8, color: "bg-emerald-100" },
            ].map((stage, i) => (
              <div key={i} className="flex items-center gap-4">
                <div className="w-24 font-medium text-sm">{stage.stage}</div>
                <div className="flex-1 h-8 bg-muted rounded-full overflow-hidden">
                  <div className={`h-full ${stage.color} flex items-center justify-center`}>
                    <span className="text-xs font-semibold">{stage.count}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
