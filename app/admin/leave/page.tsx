"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Clock, CheckCircle, XCircle, Search } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AdminLeavePage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/login")
    } else if (!loading) {
      setTimeout(() => setIsLoading(false), 1000)
    }
  }, [loading, user, userRole, router])

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={4} />
        <SkeletonTable />
      </main>
    )
  }

  // Mock attendance data
  const attendanceData = [
    {
      id: "A001",
      name: "John Doe",
      employeeId: "E001",
      mobile: "+91 98765 43210",
      checkIn: "09:00 AM",
      checkOut: "05:30 PM",
      duration: "8h 30m",
      status: "present",
    },
    {
      id: "A002",
      name: "Jane Smith",
      employeeId: "E002",
      mobile: "+91 98765 43211",
      checkIn: "09:15 AM",
      checkOut: "05:45 PM",
      duration: "8h 30m",
      status: "present",
    },
    {
      id: "A003",
      name: "Mike Johnson",
      employeeId: "E003",
      mobile: "+91 98765 43212",
      checkIn: "10:30 AM",
      checkOut: "04:00 PM",
      duration: "5h 30m",
      status: "regularization",
    },
  ]

  const filteredAttendance = attendanceData.filter(
    (a) =>
      a.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      a.employeeId.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Employees</p>
            <p className="text-3xl font-bold">156</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Present Today</p>
            <p className="text-3xl font-bold text-green-600">142</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Absent</p>
            <p className="text-3xl font-bold text-red-600">8</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Leave Regularization</p>
            <p className="text-3xl font-bold text-yellow-600">6</p>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="attendance" className="space-y-6">
        <TabsList>
          <TabsTrigger value="attendance">Attendance Records</TabsTrigger>
          <TabsTrigger value="regularization">Leave Regularization</TabsTrigger>
        </TabsList>

        <TabsContent value="attendance">
          <Card>
            <CardHeader>
              <CardTitle>Attendance Records</CardTitle>
              <CardDescription>Employee check-in and check-out times</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 bg-muted rounded-lg px-3">
                <Search size={18} className="text-muted-foreground" />
                <Input
                  placeholder="Search by name or employee ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="border-0 bg-transparent"
                />
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-3 px-4 font-semibold">Name</th>
                      <th className="text-left py-3 px-4 font-semibold">Employee ID</th>
                      <th className="text-left py-3 px-4 font-semibold">Mobile</th>
                      <th className="text-left py-3 px-4 font-semibold">Check In</th>
                      <th className="text-left py-3 px-4 font-semibold">Check Out</th>
                      <th className="text-left py-3 px-4 font-semibold">Duration</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredAttendance.map((att) => (
                      <tr key={att.id} className="border-b hover:bg-muted/50">
                        <td className="py-3 px-4 font-medium">{att.name}</td>
                        <td className="py-3 px-4 font-mono text-xs">{att.employeeId}</td>
                        <td className="py-3 px-4 text-muted-foreground">{att.mobile}</td>
                        <td className="py-3 px-4">{att.checkIn}</td>
                        <td className="py-3 px-4">{att.checkOut}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold">{att.duration}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="regularization">
          <Card>
            <CardHeader>
              <CardTitle>Leave Regularization Requests</CardTitle>
              <CardDescription>Employees with less than 9 hours duration</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredAttendance
                  .filter((a) => a.status === "regularization")
                  .map((item) => (
                    <div key={item.id} className="p-4 border rounded-lg hover:bg-muted/50 transition-colors">
                      <div className="flex justify-between items-start mb-3">
                        <div>
                          <p className="font-semibold">{item.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {item.employeeId} • {item.checkIn} - {item.checkOut} ({item.duration})
                          </p>
                        </div>
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">
                          Pending
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" className="bg-green-600 hover:bg-green-700">
                          <CheckCircle size={16} className="mr-2" />
                          Approve
                        </Button>
                        <Button size="sm" variant="outline">
                          <XCircle size={16} className="mr-2" />
                          Reject
                        </Button>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  )
}
