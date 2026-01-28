"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import AddRecruiterModal from "@/components/modals/add-recruiter-modal"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Users, Search, Trash2, Shield, Key, MoreVertical } from "lucide-react"

export default function AdminRecruitersPage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [searchTerm, setSearchTerm] = useState("")
  const [filterStatus, setFilterStatus] = useState("all")
  const [recruiters, setRecruiters] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)

  const fetchRecruiters = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("/api/recruiters", {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        setRecruiters(data.data)
      }
    } catch (error) {
      console.error("Error fetching recruiters", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "admin")) {
      router.push("/login")
    } else if (!loading) {
      fetchRecruiters()
    }
  }, [loading, user, userRole, router])

  const handleDeleteRecruiter = async (id: string) => {
    if (!confirm("Are you sure you want to delete this recruiter?")) return
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`/api/recruiters/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      })
      if (res.ok) {
        setRecruiters(recruiters.filter(rec => rec.id !== id))
      }
    } catch (error) {
      console.error("Delete failed", error)
    }
  }

  const handleToggleStatus = async (id: string, currentStatus: string) => {
    const newStatus = currentStatus === 'approved' ? 'pending' : 'approved'
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch(`/api/recruiters/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ approvalStatus: newStatus })
      })
      if (res.ok) {
        fetchRecruiters()
      }
    } catch (error) {
      console.error("Status toggle failed", error)
    }
  }

  if (loading || isLoading) {
    return (
      <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
        <SkeletonGrid count={4} />
        <SkeletonTable />
      </main>
    )
  }

  const filteredRecruiters = recruiters.filter((rec) => {
    const name = rec.name || `${rec.firstName} ${rec.lastName}`
    const matchesSearch =
      name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rec.id.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesFilter = filterStatus === "all" || rec.approvalStatus === filterStatus
    return matchesSearch && matchesFilter
  })

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="mb-8 flex justify-end">
        <AddRecruiterModal onSubmit={() => fetchRecruiters()} />
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Total Recruiters</p>
            <p className="text-3xl font-bold">{recruiters.length}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Approved</p>
            <p className="text-3xl font-bold text-green-600">
              {recruiters.filter(r => r.approvalStatus === "approved").length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Pending Approval</p>
            <p className="text-3xl font-bold text-yellow-600">
              {recruiters.filter(r => r.approvalStatus === "pending" || !r.approvalStatus).length}
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-6">
            <p className="text-sm text-muted-foreground mb-1">Active (Role)</p>
            <p className="text-3xl font-bold">{recruiters.filter(r => r.role === 'recruiter').length || recruiters.length}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
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
              <TabsTrigger value="approved">Approved</TabsTrigger>
              <TabsTrigger value="pending">Pending</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardContent>
      </Card>

      {/* Recruiters Table */}
      <Card>
        <CardHeader>
          <CardTitle>Recruiters List</CardTitle>
          <CardDescription>Total: {filteredRecruiters.length} recruiters</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-semibold">Recruiter ID</th>
                  <th className="text-left py-3 px-4 font-semibold">Name</th>
                  <th className="text-left py-3 px-4 font-semibold">Email</th>
                  <th className="text-left py-3 px-4 font-semibold">Status</th>
                  <th className="text-left py-3 px-4 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecruiters.map((rec) => (
                  <tr key={rec.id} className="border-b hover:bg-muted/50 transition-colors">
                    <td className="py-3 px-4 font-mono text-xs font-semibold">{rec.id}</td>
                    <td className="py-3 px-4 font-medium">{rec.name || `${rec.firstName} ${rec.lastName}`}</td>
                    <td className="py-3 px-4 text-muted-foreground">{rec.email}</td>
                    <td className="py-3 px-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${rec.approvalStatus === "approved"
                          ? "bg-green-100 text-green-700"
                          : "bg-yellow-100 text-yellow-700"
                          }`}
                      >
                        {(rec.approvalStatus || 'pending').charAt(0).toUpperCase() + (rec.approvalStatus || 'pending').slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <Button size="sm" variant="ghost" title="Reset Password">
                          <Key size={16} />
                        </Button>
                        <Button size="sm" variant="ghost" title="Approve/Suspend" onClick={() => handleToggleStatus(rec.id, rec.approvalStatus)}>
                          <Shield size={16} />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          title="Delete"
                          onClick={() => handleDeleteRecruiter(rec.id)}
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
    </main>
  )
}
