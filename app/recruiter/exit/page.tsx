"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ExitRequestModal from "@/components/modals/exit-request-modal"
import { LogOut, Clock, CheckCircle, AlertCircle } from "lucide-react"

interface ExitRequest {
  id: string
  employeeId: string
  employeeName?: string
  exitDate: string
  reason: string
  status: string
  noticePeriod?: string
  createdDate?: string
}

export default function RecruiterExitPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [exitRequests, setExitRequests] = useState<ExitRequest[]>([])
  const [employees, setEmployees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, approved: 0 })

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch employees to get their exit statuses
      const empRes = await fetch("/api/employees", { headers })
      const empData = await empRes.json()

      if (empData.success && empData.data) {
        setEmployees(empData.data)

        // Try to fetch exit details for each employee
        const exitPromises = empData.data.map(async (emp: any) => {
          try {
            const exitRes = await fetch(`/api/exit/${emp.id}`, { headers })
            const exitData = await exitRes.json()
            if (exitData.success) {
              return { ...exitData.data, employeeName: emp.name || `${emp.firstName} ${emp.lastName}` }
            }
          } catch {
            return null
          }
          return null
        })

        const exitResults = await Promise.all(exitPromises)
        const validExits = exitResults.filter(e => e !== null)
        setExitRequests(validExits)

        // Calculate stats
        const pending = validExits.filter(e => e.status === 'pending').length
        const approved = validExits.filter(e => e.status === 'approved' || e.status === 'completed').length
        setStats({
          total: validExits.length,
          pending,
          approved
        })
      }
    } catch (error) {
      console.error("Error fetching exit data", error)
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

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock size={16} className="text-yellow-500" />
      case 'approved':
      case 'completed': return <CheckCircle size={16} className="text-green-500" />
      default: return <AlertCircle size={16} className="text-gray-500" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-700'
      case 'approved':
      case 'completed': return 'bg-green-100 text-green-700'
      default: return 'bg-gray-100 text-gray-700'
    }
  }

  if (loading || isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <LogOut size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Exits</p>
                <p className="text-3xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-yellow-100">
                <Clock size={20} className="text-yellow-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
                <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <CheckCircle size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Approved</p>
                <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exit Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {exitRequests.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No exit requests found.</p>
          ) : (
            exitRequests.map((request) => (
              <div key={request.id} className="p-4 border rounded-lg hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <p className="font-semibold">{request.employeeName || request.employeeId}</p>
                    <p className="text-sm text-muted-foreground">Reason: {request.reason}</p>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-1 ${getStatusColor(request.status)}`}>
                    {getStatusIcon(request.status)}
                    {request.status?.toUpperCase()}
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm text-muted-foreground mb-3">
                  <p>Exit Date: {request.exitDate}</p>
                  <p>Notice Period: {request.noticePeriod || 'N/A'}</p>
                </div>
                <div className="flex gap-2">
                  <ExitRequestModal
                    employeeId={request.employeeId}
                    employeeName={request.employeeName || request.employeeId}
                    onSubmit={() => fetchData()}
                  />
                </div>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}
