"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Edit2, Key, MoreVertical } from "lucide-react"
import AddEmployeeModal from "@/components/modals/add-employee-modal"

export default function RecruiterEmployeesPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")

  useEffect(() => {
    if (!loading && (!user || userRole !== "recruiter")) {
      router.push("/login")
    }
  }, [loading, user, userRole, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  const employees = [
    {
      id: "E001",
      name: "John Doe",
      email: "john.doe@company.com",
      department: "Engineering",
      designation: "Senior Developer",
      salary: "15,00,000",
      status: "active",
    },
    {
      id: "E002",
      name: "Jane Smith",
      email: "jane.smith@company.com",
      department: "HR",
      designation: "HR Manager",
      salary: "12,00,000",
      status: "active",
    },
  ]

  const filteredEmployees = employees.filter(
    (emp) =>
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <AddEmployeeModal
          onSubmit={(data) => {
            console.log("Employee added:", data)
          }}
        />
      </div>

      <Card className="mb-6">
        <CardContent className="pt-6">
          <div className="flex items-center gap-2 bg-muted rounded-lg px-3">
            <Search size={18} className="text-muted-foreground" />
            <Input
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="border-0 bg-transparent"
            />
          </div>
        </CardContent>
      </Card>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b">
              <th className="text-left py-3 px-4 font-semibold">Name</th>
              <th className="text-left py-3 px-4 font-semibold">Department</th>
              <th className="text-left py-3 px-4 font-semibold">Salary</th>
              <th className="text-left py-3 px-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEmployees.map((emp) => (
              <tr key={emp.id} className="border-b hover:bg-muted/50">
                <td className="py-3 px-4">
                  <p className="font-medium">{emp.name}</p>
                  <p className="text-xs text-muted-foreground">{emp.email}</p>
                </td>
                <td className="py-3 px-4">{emp.department}</td>
                <td className="py-3 px-4 font-semibold">₹{emp.salary}</td>
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
                        const password = prompt("Enter new password for " + emp.name)
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
    </main>
  )
}
