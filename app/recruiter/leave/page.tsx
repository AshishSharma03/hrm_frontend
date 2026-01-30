"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Calendar, Clock, CheckCircle, XCircle, AlertCircle, PieChart } from "lucide-react"
import LeaveRequestModal from "@/components/modals/leave-request-modal"

export default function RecruiterLeavePage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [balance, setBalance] = useState<any>(null)
  const [history, setHistory] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    if (!user) return
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      // 1. Fetch Balance
      const balanceRes = await fetch(`/api/leave/balance/${user.id}`, { headers })
      const balanceData = await balanceRes.json()
      if (balanceData.success) {
        setBalance(balanceData.data)
      }

      // 2. Fetch History
      const histRes = await fetch(`/api/leave/request?employeeId=${user.id}`, { headers })
      const histData = await histRes.json()
      if (histData.success) {
        setHistory(histData.data)
      }
    } catch (error) {
      console.error("Error fetching leave data", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "recruiter")) {
      router.push("/login")
    } else if (!loading) {
      fetchData()
    }
  }, [loading, user, userRole, router])

  if (loading || isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  // Helper for status badge
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved': return <span className="px-2 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold flex items-center gap-1"><CheckCircle size={12} /> Approved</span>
      case 'rejected': return <span className="px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-bold flex items-center gap-1"><XCircle size={12} /> Rejected</span>
      default: return <span className="px-2 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-bold flex items-center gap-1"><Clock size={12} /> Pending</span>
    }
  }

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold">Leave Management</h1>
          <p className="text-muted-foreground">Request and track your leaves</p>
        </div>
        <LeaveRequestModal onSubmit={() => fetchData()} />
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-primary mb-1">Total Available</p>
            <p className="text-3xl font-bold">{balance?.remainingDays || 0}</p>
            <p className="text-xs text-muted-foreground mt-1">Days remaining this year</p>
          </CardContent>
        </Card>

        {balance?.byType && Object.entries(balance.byType).map(([type, stats]: [string, any]) => (
          <Card key={type}>
            <CardContent className="pt-6">
              <p className="text-sm font-medium text-muted-foreground mb-1 capitalize">{type}</p>
              <p className="text-2xl font-bold">{stats.remaining} / {stats.total}</p>
            </CardContent>
          </Card>
        ))}

        <Card>
          <CardContent className="pt-6">
            <p className="text-sm font-medium text-muted-foreground mb-1">Passed Leaves</p>
            <p className="text-2xl font-bold text-muted-foreground">{balance?.usedDays || 0}</p>
          </CardContent>
        </Card>
      </div>

      {/* Leave History */}
      <Card>
        <CardHeader>
          <CardTitle>Leave History</CardTitle>
          <CardDescription>Records of your leave applications</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {history.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">No leave records found.</p>
            ) : (
              history.map((req) => (
                <div key={req.id} className="p-4 border rounded-lg hover:shadow-sm transition-shadow">
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h4 className="font-semibold capitalize text-lg">{req.leaveType} Leave</h4>
                      <p className="text-sm text-muted-foreground">{new Date(req.startDate).toLocaleDateString()} - {new Date(req.endDate).toLocaleDateString()} ({req.totalDays} days)</p>
                    </div>
                    {getStatusBadge(req.status)}
                  </div>
                  {req.reason && (
                    <div className="text-sm bg-muted/50 p-2 rounded mt-2">
                      <span className="font-semibold text-xs text-muted-foreground uppercase">Reason:</span> {req.reason}
                    </div>
                  )}
                  {req.status === 'rejected' && req.rejectReason && (
                    <div className="text-sm bg-red-50 text-red-800 p-2 rounded mt-2 border border-red-100">
                      <span className="font-semibold text-xs uppercase">Rejection Reason:</span> {req.rejectReason}
                    </div>
                  )}
                  {req.status === 'approved' && req.comments && (
                    <div className="text-sm bg-green-50 text-green-800 p-2 rounded mt-2 border border-green-100">
                      <span className="font-semibold text-xs uppercase">Admin Note:</span> {req.comments}
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
