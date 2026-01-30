"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Edit2, Key, MoreVertical, Mail, Building } from "lucide-react"
import AddEmployeeModal from "@/components/modals/add-employee-modal"

interface Employee {
  id: string
  name?: string
  firstName?: string
  lastName?: string
  email: string
  department?: string
  designation?: string
  salary?: number | string
  status?: string
  role?: string
}

export default function RecruiterEmployeesPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [employees, setEmployees] = useState<Employee[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchEmployees = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("/api/employees", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setEmployees(data.data || [])
      }
    } catch (error) {
      console.error("Error fetching employees", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "recruiter")) {
      router.push("/login")
    } else if (!loading) {
      fetchEmployees()
    }
  }, [loading, user, userRole, router])

  const getDisplayName = (emp: Employee) => {
    if (emp.name) return emp.name
    if (emp.firstName && emp.lastName) return `${emp.firstName} ${emp.lastName}`
    return emp.email.split('@')[0]
  }

  const filteredEmployees = employees.filter(
    (emp) => {
      const name = getDisplayName(emp).toLowerCase()
      const email = emp.email?.toLowerCase() || ''
      const term = searchTerm.toLowerCase()
      return name.includes(term) || email.includes(term)
    }
  )

  if (loading || isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Users size={24} className="text-primary" />
          <h1 className="text-2xl font-bold">Employees ({employees.length})</h1>
        </div>
        <AddEmployeeModal
          onSubmit={() => fetchEmployees()}
        />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3">
            <Search size={18} className="text-muted-foreground" />
            <Input
              placeholder="Search employees by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent"
            />
          </div>
        </CardContent>
      </Card>

      {filteredEmployees.length === 0 ? (
        <Card>
          <CardContent className="pt-6">
            <p className="text-center text-muted-foreground py-8">
              {employees.length === 0 ? "No employees found." : "No employees match your search."}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50">
                <th className="text-left py-3 px-4 font-semibold">Name</th>
                <th className="text-left py-3 px-4 font-semibold">Department</th>
                <th className="text-left py-3 px-4 font-semibold">Role</th>
                <th className="text-left py-3 px-4 font-semibold">Status</th>
                <th className="text-left py-3 px-4 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.map((emp) => (
                <tr key={emp.id} className="border-b hover:bg-muted/50 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-primary font-semibold">
                          {getDisplayName(emp).charAt(0).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="font-medium">{getDisplayName(emp)}</p>
                        <p className="text-xs text-muted-foreground flex items-center gap-1">
                          <Mail size={12} />
                          {emp.email}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-1">
                      <Building size={14} className="text-muted-foreground" />
                      {emp.department || 'N/A'}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className="capitalize">{emp.role || emp.designation || 'Employee'}</span>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${emp.status === 'active' ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                      }`}>
                      {emp.status || 'Active'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => console.log("Edit employee:", emp.id)}
                        title="Edit employee"
                      >
                        <Edit2 size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          const password = prompt("Enter new password for " + getDisplayName(emp))
                          if (password) {
                            console.log("Password reset for:", emp.id)
                          }
                        }}
                        title="Reset password"
                      >
                        <Key size={16} />
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => console.log("More options for:", emp.id)}
                        title="More options"
                      >
                        <MoreVertical size={16} />
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}
