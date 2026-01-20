"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download, Mail } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

export default function AdminSalaryPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [salaries] = useState([
    { id: "E001", name: "John Doe", designation: "Senior Developer", salary: 90000, status: "paid" },
    { id: "E002", name: "Jane Smith", designation: "HR Manager", salary: 75000, status: "paid" },
    { id: "E003", name: "Mike Johnson", designation: "Sales Executive", salary: 60000, status: "pending" },
  ])

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
          Generate Salary Slip
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Active Employees</p>
            <p className="text-3xl font-bold">156</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Paid This Month</p>
            <p className="text-3xl font-bold text-green-600">150</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pending</p>
            <p className="text-3xl font-bold text-yellow-600">6</p>
          </CardContent>
        </Card>
      </div>

      {/* Salary List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="paid">Paid</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {salaries.map((salary) => (
            <Card key={salary.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold">{salary.name}</h3>
                    <p className="text-sm text-muted-foreground">{salary.designation}</p>
                  </div>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      salary.status === "paid" ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                    }`}
                  >
                    {salary.status.charAt(0).toUpperCase() + salary.status.slice(1)}
                  </span>
                </div>

                <div className="mb-4">
                  <p className="text-sm text-muted-foreground mb-1">Monthly Salary</p>
                  <p className="text-2xl font-bold">₹{salary.salary.toLocaleString()}</p>
                </div>

                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Download size={16} className="mr-2" />
                    Download Slip
                  </Button>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Mail size={16} className="mr-2" />
                    Send Email
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </TabsContent>
      </Tabs>
    </main>
  )
}
