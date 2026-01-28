"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { useState } from "react"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"

export default function EmployeeRewardsPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [rewards, setRewards] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
      router.push("/login")
    } else if (!loading && user) {
      const fetchRewards = async () => {
        try {
          const token = localStorage.getItem("authToken")
          const res = await fetch(`/api/rewards/${user.id}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await res.json()
          if (data.success) {
            setRewards(data.data)
          }
        } catch (error) {
          console.error("Error fetching rewards", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchRewards()
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Reward Points</p>
            <p className="text-4xl font-bold text-yellow-600">{rewards?.totalPoints || 0}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Activities</p>
            <p className="text-3xl font-bold">{rewards?.history?.length || 0}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Points History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Date</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Reason</th>
                  <th className="text-left py-3 px-4 font-semibold text-muted-foreground">Points</th>
                </tr>
              </thead>
              <tbody>
                {!rewards?.history || rewards.history.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="py-8 text-center text-muted-foreground font-medium">
                      No points history found
                    </td>
                  </tr>
                ) : (
                  rewards.history.map((h: any, i: number) => (
                    <tr key={i} className="border-b hover:bg-muted/50 transition-colors">
                      <td className="py-3 px-4">{new Date(h.timestamp).toLocaleDateString()}</td>
                      <td className="py-3 px-4">{h.reason}</td>
                      <td className="py-3 px-4">
                        <span className="font-bold text-green-600">+{h.points}</span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </main>
  )
}
