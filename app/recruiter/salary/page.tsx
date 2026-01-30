"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Download } from "lucide-react"

import { useState } from "react"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"

export default function RecruiterSalaryPage() {
    const { user, loading, userRole } = useAuth()
    const router = useRouter()
    const [slips, setSlips] = useState<any[]>([])
    const [structure, setStructure] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        if (!loading && (!user || userRole !== "recruiter")) {
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
                    // The API endpoint /api/salary/employee/:id fetches slips for that employee ID
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
            <div className="mb-6">
                <h1 className="text-2xl font-bold">My Salary</h1>
                <p className="text-muted-foreground">View your salary structure and history</p>
            </div>

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

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Salary Structure Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div className="p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground">Basic</p>
                            <p className="font-semibold">₹{structure?.basic?.toLocaleString() || 0}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground">HRA</p>
                            <p className="font-semibold">₹{structure?.hra?.toLocaleString() || 0}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground">Allowances</p>
                            <p className="font-semibold">₹{structure?.allowances?.toLocaleString() || 0}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground">PF (Deduction)</p>
                            <p className="font-semibold text-red-600">- ₹{structure?.providentFund?.toLocaleString() || 0}</p>
                        </div>
                        <div className="p-4 border rounded-lg">
                            <p className="text-sm text-muted-foreground">Professional Tax</p>
                            <p className="font-semibold text-red-600">- ₹{structure?.professionalTax?.toLocaleString() || 0}</p>
                        </div>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Salary Slips History</CardTitle>
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
                                    <p className="text-xs text-muted-foreground">Pay Date: {slip.generatedDate ? new Date(slip.generatedDate).toLocaleDateString() : 'N/A'}</p>
                                </div>
                                <div className="flex gap-4 items-center">
                                    <div className="text-right mr-4">
                                        <p className="text-sm font-semibold text-emerald-600">₹{slip.totals?.netSalary?.toLocaleString()}</p>
                                        <p className="text-xs text-muted-foreground">Net Pay</p>
                                    </div>
                                    {/* Placeholder for download - usually needs a PDF generator endpoint */}
                                    <Button size="sm" variant="outline">
                                        <Download size={16} className="mr-2" />
                                        Download
                                    </Button>
                                </div>
                            </div>
                        ))
                    )}
                </CardContent>
            </Card>
        </main>
    )
}
