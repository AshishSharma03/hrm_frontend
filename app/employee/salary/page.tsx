"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

import { useState } from "react"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"

export default function EmployeeSalaryPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [slips, setSlips] = useState<any[]>([])
  const [structure, setStructure] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
      router.push("/login")
    } else if (!loading && user) {
      const fetchData = async () => {
        try {
          const token = localStorage.getItem("authToken")
          const headers = { Authorization: `Bearer ${token}` }

          // Salary Structure
          const sRes = await fetch(`/api/salary/${user.id}`, { headers })
          const sData = await sRes.json()
          if (sData.success) {
            setStructure(sData.data.structure)
          }

          // Salary Slips
          const slipsRes = await fetch(`/api/salary/employee/${user.id}`, { headers })
          const slipsData = await slipsRes.json()
          if (slipsData.success) {
            setSlips(slipsData.data)
          }
        } catch (error) {
          console.error("Error fetching salary data", error)
        } finally {
          setIsLoading(false)
        }
      }
      fetchData()
    }
  }, [loading, user, userRole, router])

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={2} />
        <SkeletonTable />
      </main>
    )
  }

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Monthly Net Salary</p>
            <p className="text-3xl font-bold">₹{structure?.netSalary?.toLocaleString() || '0'}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Annual Net Salary</p>
            <p className="text-3xl font-bold">₹{(structure?.netSalary * 12)?.toLocaleString() || '0'}</p>
          </CardContent>
        </Card>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>Salary Slips</CardTitle>
          <CardDescription>Previous month salary slips</CardDescription>
        </CardHeader>
        <CardContent className="space-y-3">
          {slips.length === 0 ? (
            <p className="text-muted-foreground">No salary slips found yet.</p>
          ) : (
            slips.map((slip, i) => (
              <div key={i} className="flex justify-between items-center p-3 border rounded-lg hover:bg-muted/50">
                <div>
                  <p className="font-semibold">{slip.month} {slip.year}</p>
                  <p className="text-xs text-muted-foreground">Pay Date: {slip.payDate || 'N/A'}</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download size={16} className="mr-2" />
                  Download
                </Button>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </main>
  )
}
