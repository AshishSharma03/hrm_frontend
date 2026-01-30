"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import AddEmployeeModal from "@/components/modals/add-employee-modal"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, Trash2, Shield, Key, MoreVertical, X, Mail, Phone, Building, Calendar, User } from "lucide-react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"

export default function AdminEmployeesPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [employees, setEmployees] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [selectedEmployee, setSelectedEmployee] = useState<any>(null)

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("/api/employees?limit=1000", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setEmployees(data.data)
      }
    } catch (error) {
      console.error("Error fetching employees", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/login")
    } else if (!loading) {
      fetchEmployees()
    }
  }, [loading, user, userRole, router])

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm("Are you sure you want to delete this employee?")) return
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`/api/employees/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setEmployees(employees.filter(emp => emp.id !== id))
      }
    } catch (error) {
      console.error("Delete failed", error)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'active' ? 'suspended' : 'active'
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`/api/employees/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: newStatus })
      })
      if (res.ok) {
        fetchEmployees()
      }
    } catch (error) {
      console.error("Status toggle failed", error)
    }
  }

  const handleResetPassword = (id: string) => {
    // Placeholder - would need a backend endpoint for password reset
    alert(`Password reset link sent for employee ${id}`)
  }

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={4} />
        <SkeletonTable />
      </main>
    )
  }

  const filteredEmployees = employees.filter((emp) => {
    const name = emp.name || `${emp.firstName} ${emp.lastName}`
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || emp.status === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <AddEmployeeModal onSubmit={() => fetchEmployees()} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Employees</p>
            <p className="text-3xl font-bold">{employees.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Active</p>
            <p className="text-3xl font-bold text-green-600">
              {employees.filter(e => e.status === "active").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
            <p className="text-3xl font-bold text-yellow-600">
              {employees.filter(e => e.status === "pending").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Suspended</p>
            <p className="text-3xl font-bold text-red-600">
              {employees.filter(e => e.status === "suspended").length}
            </p>
          </CardContent>
        </Card>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Filter & Search</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col md:flex-row gap-4">
          <div className="flex-1 flex items-center gap-2 bg-muted rounded-lg px-3">
            <Search size={18} className="text-muted-foreground" />
            <Input
              placeholder="Search by name, email, or ID..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent"
            />
          </div>
          <Tabs value={filterStatus} onValueChange={setFilterStatus} className="w-full md:w-auto">
            <TabsList>
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="active">Active</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Employees List</CardTitle>
          <CardDescription>Total: {filteredEmployees.length} employees</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Employee ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Department</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.map((emp) => (
                  <tr key={emp.id} className="border-b hover:bg-muted/50 transition-colors cursor-pointer" onClick={() => setSelectedEmployee(emp)}>
                    <td className="py-3 px-4 font-mono text-xs font-semibold">{emp.id}</td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="font-medium">
                          {emp.name || (emp.firstName && emp.lastName ? `${emp.firstName} ${emp.lastName}` : emp.email?.split('@')[0] || 'Unknown')}
                        </p>
                        <p className="text-xs text-muted-foreground">{emp.email}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div>
                        <p className="capitalize">{emp.department}</p>
                        <p className="text-xs text-muted-foreground capitalize">{emp.designation}</p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${emp.status === "active"
                          ? "bg-green-100 text-green-700"
                          : emp.status === "pending"
                            ? "bg-yellow-100 text-yellow-700"
                            : emp.status === "suspended"
                              ? "bg-red-100 text-red-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                      >
                        {emp.status ? emp.status.charAt(0).toUpperCase() + emp.status.slice(1) : 'Unknown'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" title="Reset Password" onClick={() => handleResetPassword(emp.id)}>
                          <Key size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" title="Suspend" onClick={() => handleToggleStatus(emp.id, emp.status)}>
                          <Shield size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Delete"
                          onClick={() => handleDeleteEmployee(emp.id)}
                        >
                          <Trash2 size={16} className="text-red-500" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <MoreVertical size={16} />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Employee Details Modal */}
      <Dialog open={!!selectedEmployee} onOpenChange={(open) => !open && setSelectedEmployee(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white font-bold text-xl">
                {selectedEmployee?.name?.charAt(0) || selectedEmployee?.firstName?.charAt(0) || '?'}
              </div>
              <div>
                <p className="text-xl">
                  {selectedEmployee?.name ||
                    (selectedEmployee?.firstName && selectedEmployee?.lastName
                      ? `${selectedEmployee.firstName} ${selectedEmployee.lastName}`
                      : selectedEmployee?.email?.split('@')[0] || 'Unknown')}
                </p>
                <p className="text-sm font-normal text-muted-foreground capitalize">
                  {selectedEmployee?.designation || 'Employee'}
                </p>
              </div>
            </DialogTitle>
          </DialogHeader>

          {selectedEmployee && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Email</p>
                    <p className="font-medium">{selectedEmployee.email || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Phone</p>
                    <p className="font-medium">{selectedEmployee.phone || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Building size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Department</p>
                    <p className="font-medium capitalize">{selectedEmployee.department || 'N/A'}</p>
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <User size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Employee ID</p>
                    <p className="font-medium font-mono">{selectedEmployee.id}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Calendar size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Join Date</p>
                    <p className="font-medium">{selectedEmployee.joinDate || 'N/A'}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users size={18} className="text-muted-foreground" />
                  <div>
                    <p className="text-xs text-muted-foreground">Reports To</p>
                    <p className="font-medium">{selectedEmployee.reportsTo || 'N/A'}</p>
                  </div>
                </div>
              </div>

              {/* Status */}
              <div className="col-span-full border-t pt-4 flex items-center justify-between">
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Status</p>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-semibold ${selectedEmployee.status === "active"
                      ? "bg-green-100 text-green-700"
                      : selectedEmployee.status === "pending"
                        ? "bg-yellow-100 text-yellow-700"
                        : selectedEmployee.status === "suspended"
                          ? "bg-red-100 text-red-700"
                          : "bg-gray-100 text-gray-700"
                      }`}
                  >
                    {selectedEmployee.status ? selectedEmployee.status.charAt(0).toUpperCase() + selectedEmployee.status.slice(1) : 'Unknown'}
                  </span>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" variant="outline" onClick={() => handleResetPassword(selectedEmployee.id)}>
                    <Key size={14} className="mr-2" />
                    Reset Password
                  </Button>
                  <Button
                    size="sm"
                    variant={selectedEmployee.status === 'active' ? 'destructive' : 'default'}
                    onClick={() => {
                      handleToggleStatus(selectedEmployee.id, selectedEmployee.status)
                      setSelectedEmployee(null)
                    }}
                  >
                    <Shield size={14} className="mr-2" />
                    {selectedEmployee.status === 'active' ? 'Suspend' : 'Activate'}
                  </Button>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  )
}
