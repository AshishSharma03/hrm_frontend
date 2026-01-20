"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

export default function EmployeeSalaryPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
      router.push("/login")
    }
  }, [loading, user, userRole, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Monthly Salary</p>
            <p className="text-3xl font-bold">₹90,000</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Annual Salary</p>
            <p className="text-3xl font-bold">₹10,80,000</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Salary Slips</CardTitle>
          <CardDescription>Previous month salary slips</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {[
            { month: "December 2024", date: "2024-12-05" },
            { month: "November 2024", date: "2024-11-05" },
            { month: "October 2024", date: "2024-10-05" },
          ].map((slip, i) => (
            <div key={i} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50">
              <div>
                <p className="font-semibold">{slip.month}</p>
                <p className="text-xs text-muted-foreground">{slip.date}</p>
              </div>
              <Button size="sm" variant="outline">
                <Download size={16} className="mr-2" />
                Download
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </main>
  )
}
