"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import LeaveRequestModal from "@/components/modals/leave-request-modal"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export default function EmployeeLeavePage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [leaveHistory, setLeaveHistory] = useState<any[]>([])
  const [leaveBalance, setLeaveBalance] = useState({ total: 12, used: 0, pending: 0 })
  const [isLoading, setIsLoading] = useState(true)

  const fetchLeaveData = async () => {
    if (!user) return
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      // 1. Fetch Leave Requests
      const res = await fetch(`/api/leave/request`, { headers })
      const data = await res.json()
      if (data.success) {
        setLeaveHistory(data.data)
      }

      // 2. Fetch Leave Balance
      const balRes = await fetch(`/api/leave/balance/${user.id}`, { headers })
      const balData = await balRes.json()
      if (balData.success) {
        const { totalDays, usedDays } = balData.data
        const pending = data.data?.filter((l: any) => l.status === "pending").length || 0
        setLeaveBalance({ total: totalDays, used: usedDays, pending })
      }
    } catch (error) {
      console.error("Error fetching leave data", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
      router.push("/login")
    } else if (!loading) {
      fetchLeaveData()
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

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <LeaveRequestModal onSubmit={() => fetchLeaveData()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Balance</p>
            <p className="text-3xl font-bold">{leaveBalance.total}</p>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Used</p>
            <p className="text-3xl font-bold">{leaveBalance.used}</p>
            <p className="text-xs text-muted-foreground mt-1">days</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Approvals</p>
            <p className="text-3xl font-bold">{leaveBalance.pending}</p>
            <p className="text-xs text-muted-foreground mt-1">requests</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Leave Requests History</CardTitle>
        </CardHeader>
        <CardContent>
          {leaveHistory.length === 0 ? (
            <p className="text-muted-foreground">No leave requests submitted yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4 font-semibold">Type</th>
                    <th className="text-left py-3 px-4 font-semibold">Duration</th>
                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                    <th className="text-left py-3 px-4 font-semibold">Requested On</th>
                  </tr>
                </thead>
                <tbody>
                  {leaveHistory.map((leave) => (
                    <tr key={leave.id} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4 font-medium uppercase">{leave.leaveType}</td>
                      <td className="py-3 px-4">
                        <div>
                          <p className="text-xs">{leave.startDate} to {leave.endDate}</p>
                          <p className="text-muted-foreground text-[10px]">{leave.reason}</p>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-semibold uppercase ${leave.status === "approved"
                            ? "bg-green-100 text-green-700"
                            : leave.status === "pending"
                              ? "bg-yellow-100 text-yellow-700"
                              : "bg-red-100 text-red-700"
                            }`}
                        >
                          {leave.status}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-xs text-muted-foreground">
                        {leave.submittedDate ? new Date(leave.submittedDate).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
