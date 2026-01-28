"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Users, Search, Clock, CheckCircle, XCircle, RefreshCw } from "lucide-react"

interface PresentEmployee {
    employeeId: string
    name: string
    status: string
    checkInTime: string
    workedHours: number
    department?: string
}

export default function PresentEmployeesPage() {
    const { user, loading, userRole } = useAuth()
    const router = useRouter()
    const [presentEmployees, setPresentEmployees] = useState<PresentEmployee[]>([])
    const [allEmployees, setAllEmployees] = useState<Record<string, any>>({})
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [lastRefresh, setLastRefresh] = useState<string>("")

    const fetchData = async () => {
        setIsLoading(true)
        try {
            const token = localStorage.getItem("authToken")
            const headers = { Authorization: `Bearer ${token}` }
            const today = new Date().toISOString().split('T')[0]

            // Fetch all employees for name mapping
            const empRes = await fetch("/api/employees", { headers })
            const empData = await empRes.json()
            const empMap: Record<string, any> = {}
            if (empData.success) {
                empData.data.forEach((e: any) => {
                    const fullName = e.firstName && e.lastName ? `${e.firstName} ${e.lastName}` : null
                    const displayName = e.name || fullName || e.email?.split('@')[0] || e.id
                    empMap[e.id] = { name: displayName, department: e.department }
                    if (e.userId) {
                        empMap[e.userId] = { name: displayName, department: e.department }
                    }
                })
                setAllEmployees(empMap)
            }

            // Fetch today's attendance
            const attRes = await fetch(`/api/attendance/report?startDate=${today}`, { headers })
            const attData = await attRes.json()

            if (attData.success && attData.data) {
                const present: PresentEmployee[] = attData.data
                    .filter((att: any) => {
                        // Check if employee has an active shift (checked in, not checked out)
                        const shifts = att.shifts || []
                        const lastShift = shifts[shifts.length - 1]
                        return lastShift && !lastShift.checkOut
                    })
                    .map((att: any) => {
                        const shifts = att.shifts || []
                        const firstShift = shifts[0]
                        const empInfo = empMap[att.employeeId] || { name: att.employeeId, department: 'N/A' }

                        return {
                            employeeId: att.employeeId,
                            name: empInfo.name,
                            department: empInfo.department,
                            status: 'ACTIVE',
                            checkInTime: firstShift?.checkIn || '',
                            workedHours: att.totalWorkedHours || 0
                        }
                    })

                setPresentEmployees(present)
            }

            setLastRefresh(new Date().toLocaleTimeString())
        } catch (error) {
            console.error("Error fetching present employees", error)
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

    // Auto-refresh every 30 seconds
    useEffect(() => {
        const interval = setInterval(() => {
            if (!loading && user && userRole === "admin") {
                fetchData()
            }
        }, 30000)
        return () => clearInterval(interval)
    }, [loading, user, userRole])

    if (loading || isLoading) {
        return (
            <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
                <SkeletonGrid count={3} />
                <SkeletonTable />
            </main>
        )
    }

    const filteredEmployees = presentEmployees.filter(
        (emp) =>
            emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            emp.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (emp.department?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
    )

    const totalEmployees = Object.keys(allEmployees).length / 2 // Divide by 2 because we map both id and userId
    const absentCount = Math.max(0, totalEmployees - presentEmployees.length)

    return (
        <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
            {/* Header with Refresh */}
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Live Attendance</h1>
                    <p className="text-sm text-muted-foreground">
                        Last updated: {lastRefresh}
                    </p>
                </div>
                <Button onClick={fetchData} variant="outline" className="flex items-center gap-2">
                    <RefreshCw size={16} />
                    Refresh
                </Button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-green-100 rounded-full">
                                <CheckCircle className="text-green-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Present Now</p>
                                <p className="text-3xl font-bold text-green-600">{presentEmployees.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-red-100 rounded-full">
                                <XCircle className="text-red-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Not Checked In</p>
                                <p className="text-3xl font-bold text-red-600">{absentCount}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-blue-100 rounded-full">
                                <Users className="text-blue-600" size={24} />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Employees</p>
                                <p className="text-3xl font-bold">{Math.round(totalEmployees)}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Search */}
            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 bg-muted rounded-lg px-3">
                        <Search size={18} className="text-muted-foreground" />
                        <Input
                            placeholder="Search by name, ID, or department..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-0 bg-transparent"
                        />
                    </div>
                </CardContent>
            </Card>

            {/* Present Employees Table */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="text-green-600" size={20} />
                        Currently Present Employees
                    </CardTitle>
                    <CardDescription>
                        Employees who are currently checked in and active
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {filteredEmployees.length === 0 ? (
                        <div className="text-center py-12 text-muted-foreground">
                            <Users size={48} className="mx-auto mb-4 opacity-50" />
                            <p>No employees currently checked in</p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm">
                                <thead>
                                    <tr className="border-b">
                                        <th className="text-left py-3 px-4 font-semibold">Employee</th>
                                        <th className="text-left py-3 px-4 font-semibold">Department</th>
                                        <th className="text-left py-3 px-4 font-semibold">Check In Time</th>
                                        <th className="text-left py-3 px-4 font-semibold">Hours Worked</th>
                                        <th className="text-left py-3 px-4 font-semibold">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredEmployees.map((emp) => (
                                        <tr key={emp.employeeId} className="border-b hover:bg-muted/50 transition-colors">
                                            <td className="py-3 px-4">
                                                <div>
                                                    <p className="font-medium">{emp.name}</p>
                                                    <p className="text-xs text-muted-foreground font-mono">{emp.employeeId}</p>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 capitalize">{emp.department || 'N/A'}</td>
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-2">
                                                    <Clock size={14} className="text-muted-foreground" />
                                                    {emp.checkInTime ? new Date(emp.checkInTime).toLocaleTimeString() : '-'}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="font-semibold">{emp.workedHours.toFixed(2)}h</span>
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 flex items-center gap-1 w-fit">
                                                    <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                                    Active
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </main>
    )
}
