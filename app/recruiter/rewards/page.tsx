"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import AwardPointsModal from "@/components/modals/award-points-modal"
import { Award, Star, Users, TrendingUp } from "lucide-react"

interface RewardEntry {
  id: string
  employeeId: string
  points: number
  category: string
  reason: string
  awardedDate: string
}

interface EmployeeRewards {
  employeeId: string
  employeeName: string
  totalPoints: number
  history: RewardEntry[]
}

export default function RecruiterRewardsPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [employeeRewards, setEmployeeRewards] = useState<EmployeeRewards[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [stats, setStats] = useState({ totalPoints: 0, totalReferrals: 0, pending: 0 })

  const fetchRewardsData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      // Fetch employees
      const empRes = await fetch("/api/employees", { headers })
      const empData = await empRes.json()

      if (empData.success && empData.data) {
        // Fetch rewards for each employee
        const rewardsPromises = empData.data.map(async (emp: any) => {
          try {
            const rewardsRes = await fetch(`/api/rewards/${emp.id}`, { headers })
            const rewardsData = await rewardsRes.json()
            if (rewardsData.success) {
              return {
                employeeId: emp.id,
                employeeName: emp.name || `${emp.firstName} ${emp.lastName}`,
                totalPoints: rewardsData.data.totalPoints || 0,
                history: rewardsData.data.history || []
              }
            }
          } catch {
            return null
          }
          return null
        })

        const results = await Promise.all(rewardsPromises)
        const validRewards = results.filter(r => r !== null && r.totalPoints > 0)
        setEmployeeRewards(validRewards)

        // Calculate stats
        const totalPts = validRewards.reduce((sum, r) => sum + r.totalPoints, 0)
        const referrals = validRewards.reduce((sum, r) =>
          sum + r.history.filter((h: RewardEntry) => h.category === 'referral').length, 0
        )

        setStats({
          totalPoints: totalPts,
          totalReferrals: referrals,
          pending: 0
        })
      }
    } catch (error) {
      console.error("Error fetching rewards data", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "recruiter")) {
      router.push("/login")
    } else if (!loading) {
      fetchRewardsData()
    }
  }, [loading, user, userRole, router])

  if (loading || isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <AwardPointsModal
          onSubmit={() => fetchRewardsData()}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-purple-100">
                <Award size={20} className="text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Total Points</p>
                <p className="text-3xl font-bold">{stats.totalPoints.toLocaleString()}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-blue-100">
                <Users size={20} className="text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Referrals</p>
                <p className="text-3xl font-bold">{stats.totalReferrals}</p>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-full bg-green-100">
                <TrendingUp size={20} className="text-green-600" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground mb-1">Active Employees</p>
                <p className="text-3xl font-bold">{employeeRewards.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Leaderboard */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Star size={20} className="text-yellow-500" />
            Rewards Leaderboard
          </CardTitle>
        </CardHeader>
        <CardContent>
          {employeeRewards.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">No rewards data available.</p>
          ) : (
            <div className="space-y-3">
              {employeeRewards
                .sort((a, b) => b.totalPoints - a.totalPoints)
                .map((emp, index) => (
                  <div key={emp.employeeId} className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${index === 0 ? 'bg-yellow-100 text-yellow-700' :
                          index === 1 ? 'bg-gray-200 text-gray-700' :
                            index === 2 ? 'bg-orange-100 text-orange-700' :
                              'bg-muted text-muted-foreground'
                        }`}>
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium">{emp.employeeName}</p>
                        <p className="text-xs text-muted-foreground">{emp.history.length} awards</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={16} className="text-yellow-500" />
                      <span className="font-bold text-lg">{emp.totalPoints.toLocaleString()}</span>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
