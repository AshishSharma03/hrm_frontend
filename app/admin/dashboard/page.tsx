"use client"

import { Users, Briefcase, Calendar, CheckCircle, FileText } from "lucide-react"
import DashboardCard from "@/components/dashboard-card"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"

export default function AdminDashboard() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/login")
    }
  }, [loading, user, userRole, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          label="Total Employees"
          value="156"
          icon={Users}
          description="Active employees on payroll"
          href="/admin/employees"
          trend={{ value: 8, isPositive: true }}
        />
        <DashboardCard
          label="Recruiters"
          value="12"
          icon={Briefcase}
          description="Active recruitment team"
          href="/admin/recruiters"
          trend={{ value: 3, isPositive: true }}
        />
        <DashboardCard
          label="Present Today"
          value="142"
          icon={CheckCircle}
          description="Employees checked in"
          trend={{ value: 2, isPositive: false }}
        />
        <DashboardCard label="Absent Today" value="8" icon={Calendar} description="On leave or absent" href="/admin/leave" />
        <DashboardCard
          label="Job Postings"
          value="7"
          icon={Briefcase}
          description="Open positions"
          href="/admin/jobs"
          trend={{ value: 12, isPositive: true }}
        />
        <DashboardCard
          label="Interviews Scheduled"
          value="24"
          icon={FileText}
          description="This month"
          href="/admin/interviews"
          trend={{ value: 15, isPositive: true }}
        />
      </div>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>Latest actions in the system</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[
              { action: "New recruiter registered", time: "2 hours ago", status: "pending" },
              { action: "Employee leave approved", time: "4 hours ago", status: "approved" },
              { action: "Offer generated for candidate", time: "1 day ago", status: "completed" },
            ].map((activity, i) => (
              <div key={i} className="flex items-center justify-between pb-4 border-b last:border-0">
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-muted-foreground">{activity.time}</p>
                </div>
                <span
                  className={`px-3 py-1 rounded-full text-xs font-semibold ${
                    activity.status === "pending"
                      ? "bg-yellow-100 text-yellow-700"
                      : activity.status === "approved"
                        ? "bg-green-100 text-green-700"
                        : "bg-blue-100 text-blue-700"
                  }`}
                >
                  {activity.status}
                </span>
              </div>
            ))}
          </div>
        </CardContent>
        </Card>
    </main>
  )
}
