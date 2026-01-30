"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Download, Mail } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

import GenerateSalaryModal from "@/components/modals/generate-salary-modal"
import UpdateSalaryModal from "@/components/modals/update-salary-modal"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"

export default function AdminSalaryPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [employees, setEmployees] = useState<any[]>([])
  const [salariesMap, setSalariesMap] = useState<Record<string, any>>({})
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }


      // Fetch Employees and Recruiters (with high limit to get all)
      const [empRes, recRes] = await Promise.all([
        fetch("/api/employees?limit=1000", { headers }),
        fetch("/api/recruiters?limit=1000", { headers })
      ])

      const empData = await empRes.json()
      const recData = await recRes.json()

      let allStaff: any[] = []

      if (empData.success) {
        allStaff = [...allStaff, ...empData.data.map((e: any) => ({ ...e, role: 'Employee' }))]
      }
      if (recData.success) {
        allStaff = [...allStaff, ...recData.data.map((r: any) => ({ ...r, role: 'Recruiter', name: r.name || `${r.firstName} ${r.lastName}` }))]
      }

      setEmployees(allStaff)

      // Fetch Salary Structure for each staff member
      const salariesResp: Record<string, any> = {}
      await Promise.all(allStaff.map(async (p: any) => {
        try {
          const sRes = await fetch(`/api/salary/${p.id}`, { headers })
          const sData = await sRes.json()
          if (sData.success) {
            salariesResp[p.id] = sData.data
          }
        } catch (e) {
          console.error(`Error fetching salary for ${p.id}`, e)
        }
      }))
      setSalariesMap(salariesResp)

    } catch (error) {
      console.error("Error fetching salary data", error)
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

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={3} />
        <SkeletonTable />
      </main>
    )
  }

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <GenerateSalaryModal onSubmit={() => fetchData()} />
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Active Employees</p>
            <p className="text-3xl font-bold">{employees.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Configured</p>
            <p className="text-3xl font-bold text-green-600">{Object.keys(salariesMap).length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Missing Config</p>
            <p className="text-3xl font-bold text-yellow-600">{Math.max(0, employees.length - Object.keys(salariesMap).length)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Salary List */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="configured">Configured</TabsTrigger>
          <TabsTrigger value="missing">Missing Config</TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-4">
          {employees.map((emp) => {
            const structure = salariesMap[emp.id]?.structure
            return (
              <Card key={emp.id} className="hover:shadow-lg transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-lg font-semibold">{emp.name || `${emp.firstName} ${emp.lastName}`}</h3>
                      <div className="flex gap-2 items-center">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${emp.role === 'Recruiter' ? 'bg-purple-100 text-purple-700' : 'bg-blue-100 text-blue-700'}`}>
                          {emp.role}
                        </span>
                        <p className="text-sm text-muted-foreground">{emp.designation || emp.department}</p>
                      </div>
                    </div>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${structure ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"
                        }`}
                    >
                      {structure ? 'Configured' : 'Missing Config'}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-sm text-muted-foreground mb-1">Monthly Net Salary</p>
                    <p className="text-2xl font-bold">₹{structure?.netSalary?.toLocaleString() || '0'}</p>
                  </div>

                  <div className="flex gap-2">
                    <UpdateSalaryModal
                      employeeId={emp.id}
                      employeeName={emp.name || `${emp.firstName} ${emp.lastName}`}
                      currentStructure={structure}
                      onSubmit={() => fetchData()}
                    />
                    <Button size="sm" variant="outline" onClick={() => router.push(`/admin/salary/${emp.id}`)}>
                      <Download size={16} className="mr-2" />
                      View Structure
                    </Button>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                      <Mail size={16} className="mr-2" />
                      Send Details
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </TabsContent>
      </Tabs>
    </main>
  )
}
