"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SkeletonGrid } from "@/components/skeleton-loader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { LogOut, Search } from "lucide-react"

export default function AdminExitPage() {
    const { user, loading, userRole } = useAuth()
    const router = useRouter()
    const [employees, setEmployees] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)
    const [formData, setFormData] = useState({
        employeeId: "",
        exitDate: new Date().toISOString().split('T')[0],
        reason: "",
        noticePeriod: "30",
        fullAndFinal: "pending",
    })

    useEffect(() => {
        if (!loading && (!user || userRole !== "admin")) {
            router.push("/login")
        } else if (!loading) {
            const fetchData = async () => {
                try {
                    const token = localStorage.getItem("authToken")
                    const res = await fetch("/api/employees", {
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
            fetchData()
        }
    }, [loading, user, userRole, router])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        try {
            const token = localStorage.getItem("authToken")
            const res = await fetch("/api/exit/process", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...formData,
                    processedBy: user?.name || "ADMIN"
                })
            })
            const data = await res.json()
            if (data.success) {
                alert("Exit request processed successfully")
                setFormData({
                    employeeId: "",
                    exitDate: new Date().toISOString().split('T')[0],
                    reason: "",
                    noticePeriod: "30",
                    fullAndFinal: "pending",
                })
            } else {
                alert(data.message || "Failed to process exit")
            }
        } catch (error) {
            console.error("Exit processing failed", error)
            alert("An error occurred")
        }
    }

    if (loading || isLoading) {
        return (
            <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
                <SkeletonGrid count={2} />
            </main>
        )
    }

    return (
        <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
            <div className="mb-8 font-bold">
                <h1 className="text-3xl font-bold">Exit Management</h1>
                <p className="text-muted-foreground">Process employee retirement, resignation or termination</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <CardTitle>Process New Exit</CardTitle>
                        <CardDescription>Enter details to initiate the exit process</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="employee">Select Employee</Label>
                                <Select
                                    value={formData.employeeId}
                                    onValueChange={(val) => setFormData({ ...formData, employeeId: val })}
                                    required
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select employee" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {employees.map((emp) => (
                                            <SelectItem key={emp.id} value={emp.id}>
                                                {emp.name || `${emp.firstName} ${emp.lastName}`} ({emp.id})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="exitDate">Exit Date</Label>
                                    <Input
                                        id="exitDate"
                                        type="date"
                                        value={formData.exitDate}
                                        onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="noticePeriod">Notice Period (Days)</Label>
                                    <Input
                                        id="noticePeriod"
                                        type="number"
                                        value={formData.noticePeriod}
                                        onChange={(e) => setFormData({ ...formData, noticePeriod: e.target.value })}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="reason">Reason for Exit</Label>
                                <Textarea
                                    id="reason"
                                    placeholder="e.g., Personal reasons, New opportunity, Retirement..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                    required
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="ff">Full & Final Settlement Status</Label>
                                <Select
                                    value={formData.fullAndFinal}
                                    onValueChange={(val) => setFormData({ ...formData, fullAndFinal: val })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Status" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="pending">Pending</SelectItem>
                                        <SelectItem value="in-progress">In Progress</SelectItem>
                                        <SelectItem value="completed">Completed</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>

                            <Button type="submit" className="w-full bg-red-600 hover:bg-red-700">
                                <LogOut size={18} className="mr-2" />
                                Process Exit
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Exit Check</CardTitle>
                        <CardDescription>View status of an existing exit record</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center gap-2 bg-muted rounded-lg px-3">
                            <Search size={18} className="text-muted-foreground" />
                            <Input
                                placeholder="Enter Employee ID..."
                                className="border-0 bg-transparent"
                                onKeyDown={async (e) => {
                                    if (e.key === 'Enter') {
                                        const empId = (e.currentTarget as HTMLInputElement).value;
                                        try {
                                            const token = localStorage.getItem("authToken");
                                            const res = await fetch(`/api/exit/${empId}`, {
                                                headers: { Authorization: `Bearer ${token}` }
                                            });
                                            const data = await res.json();
                                            if (data.success) {
                                                alert(`Exit Record Found: Status - ${data.data.status}, Exit Date - ${data.data.exitDate}`);
                                            } else {
                                                alert("No exit record found for this employee");
                                            }
                                        } catch (err) {
                                            console.error(err);
                                        }
                                    }
                                }}
                            />
                        </div>
                        <p className="text-xs text-muted-foreground italic">Press Enter to search for an employee's exit history</p>
                    </CardContent>
                </Card>
            </div>
        </main>
    )
}
