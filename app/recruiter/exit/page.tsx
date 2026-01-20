"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import ExitRequestModal from "@/components/modals/exit-request-modal"

export default function RecruiterExitPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || userRole !== "recruiter")) {
      router.push("/login")
    }
  }, [loading, user, userRole, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  const exitRequests = [
    {
      id: 1,
      name: "John Doe",
      email: "john.doe@company.com",
      exitDate: "2024-02-15",
      reason: "New opportunity",
      status: "Pending",
    },
  ]

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Exits</p>
            <p className="text-3xl font-bold">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
            <p className="text-3xl font-bold text-yellow-600">2</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">6</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Exit Requests</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {exitRequests.map((request) => (
            <div key={request.id} className="p-4 border rounded-lg">
              <div className="flex justify-between items-start mb-3">
                <div>
                  <p className="font-semibold">{request.name}</p>
                  <p className="text-sm text-muted-foreground">Reason: {request.reason}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                  {request.status}
                </span>
              </div>
              <div className="flex gap-2">
                <ExitRequestModal
                  employeeId={request.id.toString()}
                  employeeName={request.name}
                  onSubmit={(data) => {
                    console.log("Exit processed:", data)
                  }}
                />
              </div>
            </div>
          ))}
        </CardContent>
        </Card>
    </main>
  )
}
