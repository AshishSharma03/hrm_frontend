"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle, Search, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AdminLeavePage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [attendance, setAttendance] = useState<any[]>([])
  const [regularizationRequests, setRegularizationRequests] = useState<any[]>([])
  const [leaveRequests, setLeaveRequests] = useState<any[]>([])
  const [employees, setEmployees] = useState<Record<string, string>>({})
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }
      const today = new Date().toISOString().split('T')[0]

      // Fetch Employees for name mapping
      const empRes = await fetch("/api/employees", { headers })
      const empData = await empRes.json()
      if (empData.success) {
        const map: Record<string, string> = {}
        empData.data.forEach((e: any) => {
          const fullName = e.firstName && e.lastName ? `${e.firstName} ${e.lastName}` : null
          const displayName = e.name || fullName || e.email?.split('@')[0] || e.id
          // Map by employee ID
          map[e.id] = displayName
          // Also map by userId (for attendance records that use user ID)
          if (e.userId) {
            map[e.userId] = displayName
          }
        })
        setEmployees(map)
      }

      // Fetch Attendance Report
      const attRes = await fetch(`/api/attendance/report?startDate=${today}`, { headers })
      const attData = await attRes.json()
      if (attData.success) {
        setAttendance(attData.data)
      }

      // Fetch Pending Regularization
      const regRes = await fetch("/api/attendance/regularization/pending", { headers })
      const regData = await regRes.json()
      if (regData.success) {
        setRegularizationRequests(regData.data)
      }

      // Fetch Leave Requests
      const leaveRes = await fetch("/api/leave/request", { headers })
      const leaveData = await leaveRes.json()
      if (leaveData.success) {
        setLeaveRequests(leaveData.data.filter((l: any) => l.status === 'pending'))
      }

    } catch (error) {
      console.error("Error fetching leave/attendance data", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/login")
    } else if (!loading) {
      fetchData()
    }
  }, [loading, user, userRole, router])

  const handleRegularization = async (id: string, decision: 'APPROVED' | 'REJECTED') => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`/api/attendance/regularization/${id}/decision`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ decision })
      })
      const data = await res.json()
      if (data.success) {
        setRegularizationRequests(prev => prev.filter(r => r.id !== id))
        fetchData()
      } else {
        alert(data.message || "Failed to process request")
      }
    } catch (error) {
      console.error("Regularization error", error)
    }
  }

  const handleLeaveDecision = async (requestId: string, decision: 'approve' | 'reject') => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`/api/leave/request/${requestId}/${decision}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          approverId: user?.id,
          approvingManagerName: user?.name,
          rejectedBy: user?.name,
          rejectReason: 'Rejected by admin'
        })
      })
      const data = await res.json()
      if (data.success) {
        setLeaveRequests(prev => prev.filter(r => r.id !== requestId))
        fetchData()
      } else {
        alert(data.message || "Failed to process leave request")
      }
    } catch (error) {
      console.error("Leave decision error", error)
    }
  }

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={4} />
        <SkeletonTable />
      </main>
    )
  }

  const filteredAttendance = attendance.filter(
    (a) =>
      (a.name || a.employeeId).toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Employees</p>
            <p className="text-3xl font-bold">{Object.keys(employees).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Checked In Today</p>
            <p className="text-3xl font-bold text-green-600">{attendance.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Leave Requests</p>
            <p className="text-3xl font-bold text-yellow-600">{leaveRequests.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Regularization</p>
            <p className="text-3xl font-bold text-orange-600">{regularizationRequests.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="leave" className="space-y-6">
        <TabsList>
          <TabsTrigger value="leave">Leave Requests</TabsTrigger>
          <TabsTrigger value="attendance">Attendance Records</TabsTrigger>
          <TabsTrigger value="regularization">Regularization</TabsTrigger>
        </TabsList>

        {/* Leave Requests Tab */}
        <TabsContent value="leave">
          <Card>
            <CardHeader>
              <CardTitle>Leave Requests</CardTitle>
              <CardDescription>Approve or reject employee leave applications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaveRequests.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No pending leave requests.</p>
                )}
                {leaveRequests.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">{employees[item.employeeId] || item.employeeId}</p>
                        <p className="text-sm text-muted-foreground flex items-center gap-2">
                          <Calendar size={14} />
                          {item.startDate} - {item.endDate} ({item.totalDays} days)
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">Type: {item.leaveType}</p>
                        <p className="text-xs text-muted-foreground">Reason: {item.reason}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleLeaveDecision(item.id, 'approve')}
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        className="text-red-500"
                        onClick={() => handleLeaveDecision(item.id, 'reject')}
                      >
                        <XCircle size={16} className="mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Attendance Tab */}
        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>Employee check-in and check-out times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3">
                <Search size={18} className="text-muted-foreground" />
                <Input
                  placeholder="Search by name or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Employee ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Check In</th>
                      <th className="text-left py-3 px-4 font-semibold">Check Out</th>
                      <th className="text-left py-3 px-4 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((att) => (
                      <tr key={att.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{employees[att.employeeId] || att.employeeId}</td>
                        <td className="py-3 px-4 font-mono text-xs">{att.employeeId}</td>
                        <td className="py-3 px-4">{att.shifts?.[0]?.checkIn ? new Date(att.shifts[0].checkIn).toLocaleTimeString() : '-'}</td>
                        <td className="py-3 px-4">
                          {att.shifts?.[att.shifts.length - 1]?.checkOut
                            ? new Date(att.shifts[att.shifts.length - 1].checkOut).toLocaleTimeString()
                            : '-'}
                        </td>
                        <td className="py-3 px-4">
                          <span className="font-semibold">{att.totalWorkedHours?.toFixed(2)}h</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Regularization Tab */}
        <TabsContent value="regularization">
          <Card>
            <CardHeader>
              <CardTitle>Regularization Requests</CardTitle>
              <CardDescription>Employees with less than 9 hours duration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {regularizationRequests.length === 0 && (
                  <p className="text-muted-foreground text-center py-8">No pending regularization requests.</p>
                )}
                {regularizationRequests.map((item) => (
                  <div key={item.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex justify-between items-start mb-3">
                      <div>
                        <p className="font-semibold">{employees[item.employeeId] || item.employeeId}</p>
                        <p className="text-sm text-muted-foreground">
                          {item.date} • {item.proposedChanges?.checkIn} - {item.proposedChanges?.checkOut}
                        </p>
                        <p className="text-xs text-muted-foreground">Reason: {item.reason}</p>
                      </div>
                      <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                        Pending
                      </span>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                        onClick={() => handleRegularization(item.id, 'APPROVED')}
                      >
                        <CheckCircle size={16} className="mr-2" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleRegularization(item.id, 'REJECTED')}
                      >
                        <XCircle size={16} className="mr-2" />
                        Reject
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
