"use client"

import { Users, Briefcase, Calendar, CheckCircle, FileText, Award } from "lucide-react"
import DashboardCard from "@/components/dashboard-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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

  useEffect(() => {
    if (!loading && (!user || userRole !== "recruiter")) {
      router.push("/login")
    }
  }, [loading, user, userRole, router])

  useEffect(() => {
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

        // Calculate stats
        const totalEmployees = empData.pagination?.total || 0
        const totalJobs = jobData.pagination?.total || 0
        const totalInterviews = intData.data?.length || 0 // Assuming list returns all or we need pagination

        // Calculate Hired this month (mock logic using employees data if available, or just mock for now as API is limited)
        // We will just use a placeholder from total employees for now or keep mock for complicated logic
        const hiredCount = 0

        setStats({
          employees: totalEmployees,
          jobs: totalJobs,
          interviews: totalInterviews,
          hired: hiredCount
        })

      } catch (error) {
        console.error("Failed to fetch recruiter stats", error)
      }
    }

    if (user && userRole === "recruiter") {
      fetchStats()
    }
  }, [user, userRole])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard label="Employees" value={stats.employees.toString()} icon={Users} description="Total workforce" href="/recruiter/employees" />
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
        <DashboardCard
          label="This Month Hired"
          value={stats.hired.toString()}
          icon={CheckCircle}
          description="New hires onboarded"
          trend={{ value: 12, isPositive: true }}
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
