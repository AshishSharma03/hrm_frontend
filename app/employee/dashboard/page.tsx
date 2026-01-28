"use client"

import { Clock, FileText, Award, CheckCircle, AlertCircle, Briefcase, LogIn, LogOut } from "lucide-react"
import DashboardCard from "@/components/dashboard-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import EditProfileModal from "@/components/modals/edit-profile-modal"
import ReferCandidateModal from "@/components/modals/refer-candidate-modal"

export default function EmployeeDashboard() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [isCheckedIn, setIsCheckedIn] = useState(false)
  const [checkInTime, setCheckInTime] = useState<string | null>(null)
  const [leaveBalance, setLeaveBalance] = useState(0)
  const [rewardsPoints, setRewardsPoints] = useState(0)
  const [hoursWorked, setHoursWorked] = useState("0h 0m")
  const [attendanceId, setAttendanceId] = useState<string | null>(null)

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
      router.push("/login")
    }
  }, [loading, user, userRole, router])

  const fetchData = async () => {
    if (!user) return
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch Leave Balance
      const leaveRes = await fetch(`/api/leave/balance/${user.id}`, { headers })
      const leaveData = await leaveRes.json()
      if (leaveData.success) {
        setLeaveBalance(leaveData.data.remainingDays)
      }

      // Fetch Rewards
      const rewardRes = await fetch(`/api/rewards/${user.id}`, { headers })
      const rewardData = await rewardRes.json()
      if (rewardData.success) {
        setRewardsPoints(rewardData.data.totalPoints || 0)
      }

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
      console.error("Error fetching employee data", error)
    }
  }

  // Fetch initial data
  useEffect(() => {
    fetchData()
  }, [user])

  const handleCheckIn = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const now = new Date()

      // Simple location mock
      const locationData = {
        employeeId: user?.id,
        location: "Office",
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
        // Backend returns { success: true, data: { checkIn: "..." } }
        setCheckInTime(new Date(data.data.checkIn).toLocaleTimeString())
        setIsCheckedIn(true)
      }
    } catch (error) {
      console.error("Check-in failed", error)
    }
  }

  const handleCheckOut = async () => {
    if (!attendanceId && !isCheckedIn) return // Simplified check

    try {
      const token = localStorage.getItem("authToken")
      const now = new Date()

      const locationData = {
        employeeId: user?.id,
        location: "Office",
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
        // Backend returns { success: true, data: { totalWorkedHours: ... } }
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

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <DashboardCard
          label="Check In Time"
          value={checkInTime || "Not checked in"}
          icon={CheckCircle}
          description={isCheckedIn ? "Checked in" : "Pending"}
        />
        <DashboardCard label="Hours Worked" value={hoursWorked} icon={Clock} description="Current day" />
        <DashboardCard
          label="Leave Balance"
          value={leaveBalance.toString()}
          icon={FileText}
          description="Days remaining"
          trend={{ value: 2, isPositive: false }}
        />
        <DashboardCard
          label="Reward Points"
          value={rewardsPoints.toString()}
          icon={Award}
          description="Total earned"
          trend={{ value: 25, isPositive: true }}
        />
      </div>

      {/* Announcements & Quick Links */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Announcements</CardTitle>
            <CardDescription>Important updates from management</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { title: "Company Holiday Schedule", date: "2 days ago", priority: "high" },
              { title: "New Wellness Program Launched", date: "1 week ago", priority: "medium" },
              { title: "Q4 Performance Review Schedule", date: "2 weeks ago", priority: "high" },
            ].map((announcement, i) => (
              <div key={i} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <AlertCircle
                  className={`flex-shrink-0 ${announcement.priority === "high" ? "text-red-500" : "text-blue-500"}`}
                  size={20}
                />
                <div className="flex-1">
                  <p className="font-medium">{announcement.title}</p>
                  <p className="text-sm text-muted-foreground">{announcement.date}</p>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Frequently accessed</CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <EditProfileModal
              userEmail={user?.email}
              onSubmit={() => {
                fetchData()
              }}
            />
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => router.push("/employee/salary")}>
              <FileText size={16} className="mr-2" />
              Download Salary Slip
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => router.push("/employee/leave")}>
              <Clock size={16} className="mr-2" />
              Apply for Leave
            </Button>
            <Button variant="outline" className="w-full justify-start bg-transparent" onClick={() => router.push("/employee/jobs")}>
              <Briefcase size={16} className="mr-2" />
              View Job Postings
            </Button>
            <ReferCandidateModal
              onSubmit={() => {
                fetchData()
              }}
            />
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
