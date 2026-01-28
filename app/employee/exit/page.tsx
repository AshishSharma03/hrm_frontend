"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

import { useState } from "react"
import { SkeletonGrid } from "@/components/skeleton-loader"

export default function EmployeeExitPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [exitData, setExitData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
      router.push("/login")
    } else if (!loading && user) {
      const fetchExit = async () => {
        try {
          const token = localStorage.getItem("authToken")
          const res = await fetch(`/api/exit/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await res.json()
          if (data.success) {
            setExitData(data.data)
          }
        } catch (error) {
          console.error("Error fetching exit data", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchExit()
    }
  }, [loading, user, userRole, router])

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={2} />
      </main>
    )
  }

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      {!exitData ? (
        <>
          <div className="mb-8 flex justify-end">
            <Button className="flex items-center gap-2" onClick={() => alert("Please contact HR to initiate exit process")}>
              <Plus size={18} />
              Submit Exit Request
            </Button>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Exit Requests</CardTitle>
              <CardDescription>No exit requests submitted</CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">Click "Submit Exit Request" to initiate your exit process.</p>
            </CardContent>
          </Card>
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Your Exit Request Status</CardTitle>
            <CardDescription>Details of your exit process</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Status</p>
                <span className={`px-3 py-1 rounded-full text-xs font-semibold ${exitData.status === 'pending' ? 'bg-yellow-100 text-yellow-700' : 'bg-green-100 text-green-700'
                  }`}>
                  {exitData.status?.toUpperCase()}
                </span>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Exit Date</p>
                <p className="font-medium">{exitData.exitDate}</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Notice Period</p>
                <p className="font-medium">{exitData.noticePeriod} Days</p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Full & Final Settlement</p>
                <p className={`font-medium ${exitData.fullAndFinal === 'pending' ? 'text-yellow-600' : 'text-green-600'}`}>
                  {exitData.fullAndFinal?.toUpperCase()}
                </p>
              </div>
            </div>

            <div className="pt-4 border-t">
              <p className="text-xs text-muted-foreground uppercase font-bold mb-1">Reason for Exit</p>
              <p className="text-sm italic">"{exitData.reason}"</p>
            </div>

            <div className="bg-muted p-4 rounded-lg">
              <p className="text-sm font-semibold mb-2">Checklist Status</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span>System Access Removal</span>
                  <span className={exitData.checklist?.systemAccess ? 'text-green-600 font-bold' : 'text-muted-foreground'}>
                    {exitData.checklist?.systemAccess ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Equipment Return</span>
                  <span className={exitData.checklist?.equipmentReturn ? 'text-green-600 font-bold' : 'text-muted-foreground'}>
                    {exitData.checklist?.equipmentReturn ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
                <div className="flex justify-between items-center text-xs">
                  <span>Exit Documentation</span>
                  <span className={exitData.checklist?.documentation ? 'text-green-600 font-bold' : 'text-muted-foreground'}>
                    {exitData.checklist?.documentation ? 'COMPLETED' : 'PENDING'}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </main>
  )
}
