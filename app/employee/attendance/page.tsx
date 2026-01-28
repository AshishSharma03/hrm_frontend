"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

import { useState } from "react"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"

export default function EmployeeAttendancePage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [attendance, setAttendance] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
      router.push("/login")
    } else if (!loading && user) {
      const fetchAttendance = async () => {
        try {
          const token = localStorage.getItem("authToken")
          const res = await fetch(`/api/attendance/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await res.json()
          if (data.success) {
            setAttendance(data.data)
          }
        } catch (error) {
          console.error("Error fetching attendance", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchAttendance()
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

  // Calculate stats
  const presentDays = attendance.filter(a => {
    const status = a.status?.toUpperCase()
    return status === 'PRESENT' || status === 'ACTIVE' || status === 'CHECKED_OUT' || status === 'PENDING_APPROVAL'
  }).length
  const totalDays = 30 // Simplified for current month
  const absentDays = Math.max(0, totalDays - presentDays)
  const attendanceRate = Math.round((presentDays / totalDays) * 100)

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Present Days</p>
            <p className="text-3xl font-bold text-green-600">{presentDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Absent Days</p>
            <p className="text-3xl font-bold text-red-600">{absentDays}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Attendance Rate</p>
            <p className="text-3xl font-bold">{attendanceRate}%</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Attendance Records</CardTitle>
          <CardDescription>Your monthly attendance details</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Check In</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Check Out</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Total Hours</th>
                </tr>
              </thead>
              <tbody>
                {attendance.length === 0 && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground font-medium">
                      No attendance records found
                    </td>
                  </tr>
                )}
                {attendance.map((record) => (
                  <tr key={record.date} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-medium">{record.date}</td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded text-xs font-semibold ${record.status === 'PRESENT' ? 'bg-green-100 text-green-700' :
                        record.status === 'ACTIVE' ? 'bg-blue-100 text-blue-700' :
                          'bg-gray-100 text-gray-700'
                        }`}>
                        {record.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">{record.shifts?.[0]?.checkIn ? new Date(record.shifts[0].checkIn).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="py-3 px-4">{record.checkOutTime ? new Date(record.checkOutTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '-'}</td>
                    <td className="py-3 px-4">{record.totalWorkedHours?.toFixed(1) || '0.0'} hrs</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
