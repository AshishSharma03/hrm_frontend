"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Zap, Gift, Users } from "lucide-react"
import { SkeletonGrid } from "@/components/skeleton-loader"
import AwardPointsModal from "@/components/modals/award-points-modal"

export default function AdminRewardsPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [employees, setEmployees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [totalPointsAwarded, setTotalPointsAwarded] = useState(0)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch all employees
      const empRes = await fetch("/api/employees", { headers })
      const empData = await empRes.json()
      if (empData.success) {
        setEmployees(empData.data)

        // Fetch rewards for each employee and sum total points
        let total = 0
        await Promise.all(empData.data.map(async (emp: any) => {
          try {
            const rwdRes = await fetch(`/api/rewards/${emp.id}`, { headers })
            const rwdData = await rwdRes.json()
            if (rwdData.success) {
              total += rwdData.data?.totalPoints || 0
            }
          } catch (e) {
            // Ignore individual failures
          }
        }))
        setTotalPointsAwarded(total)
      }
    } catch (error) {
      console.error("Error fetching rewards data", error)
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

  const handleAwardPoints = async (employeeId: string, points: number, category: string, reason: string) => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("/api/rewards/award", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          employeeId,
          points,
          category,
          reason,
          awardedBy: user?.id
        })
      })
      const data = await res.json()
      if (data.success) {
        alert(`${points} points awarded successfully!`)
        fetchData()
      } else {
        alert(data.message || "Failed to award points")
      }
    } catch (error) {
      console.error("Award points error", error)
      alert("An error occurred while awarding points")
    }
  }

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={3} />
      </main>
    )
  }

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <AwardPointsModal onSubmit={() => fetchData()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Points Awarded</p>
            <p className="text-3xl font-bold">{totalPointsAwarded.toLocaleString()}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Employees</p>
            <p className="text-3xl font-bold text-green-600">{employees.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Avg Points/Employee</p>
            <p className="text-3xl font-bold text-blue-600">
              {employees.length > 0 ? Math.round(totalPointsAwarded / employees.length) : 0}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward Categories</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "Employee Referral (Successful)", points: 500, icon: "🎯", category: "referral" },
            { name: "Performance Bonus", points: 250, icon: "⭐", category: "performance" },
            { name: "Attendance Reward", points: 100, icon: "✓", category: "attendance" },
          ].map((reward, i) => (
            <div key={i} className="p-4 border rounded-lg flex justify-between items-center hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{reward.icon}</span>
                <div>
                  <p className="font-semibold">{reward.name}</p>
                  <p className="text-sm text-muted-foreground">{reward.points} points</p>
                </div>
              </div>
              <Button size="sm" variant="outline" onClick={() => {
                const empId = prompt("Enter Employee ID to award:")
                if (empId) {
                  handleAwardPoints(empId, reward.points, reward.category, reward.name)
                }
              }}>
                <Zap size={16} className="mr-2" />
                Award
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}
