"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Zap } from "lucide-react"

export default function AdminRewardsPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/login")
    }
  }, [loading, user, userRole, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          Award Points
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Points Awarded</p>
            <p className="text-3xl font-bold">4,250</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Referrals (3mo+)</p>
            <p className="text-3xl font-bold text-green-600">12</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Approvals</p>
            <p className="text-3xl font-bold text-yellow-600">3</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Reward Types</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { name: "Employee Referral (Successful)", points: 500, icon: "🎯" },
            { name: "Performance Bonus", points: 250, icon: "⭐" },
            { name: "Attendance Reward", points: 100, icon: "✓" },
          ].map((reward, i) => (
            <div key={i} className="p-4 border rounded-lg flex justify-between items-center hover:bg-muted/50">
              <div className="flex items-center gap-3">
                <span className="text-2xl">{reward.icon}</span>
                <div>
                  <p className="font-semibold">{reward.name}</p>
                  <p className="text-sm text-muted-foreground">{reward.points} points</p>
                </div>
              </div>
              <Button size="sm" variant="outline">
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
