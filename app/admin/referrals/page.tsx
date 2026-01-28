"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { SkeletonGrid, SkeletonTable } from "@/components/skeleton-loader"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, UserPlus } from "lucide-react"
import { Input } from "@/components/ui/input"

export default function AdminReferralsPage() {
    const { user, loading, userRole } = useAuth()
    const router = useRouter()
    const [referrals, setReferrals] = useState<any[]>([])
    const [searchTerm, setSearchTerm] = useState("")
    const [isLoading, setIsLoading] = useState(true)

    const fetchReferrals = async () => {
        try {
            const token = localStorage.getItem("authToken")
            const res = await fetch("/api/referrals/list", {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                setReferrals(data.data)
            }
        } catch (error) {
            console.error("Error fetching referrals", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!loading && (!user || userRole !== "admin")) {
            router.push("/login")
        } else if (!loading) {
            fetchReferrals()
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

    const filteredReferrals = referrals.filter(
        (ref) =>
            ref.candidateName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            ref.referredBy?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    return (
        <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Employee Referrals</h1>
                <p className="text-muted-foreground">Manage and track candidate referrals from employees</p>
            </div>

            <Card className="mb-8">
                <CardHeader>
                    <CardTitle>Total Referrals</CardTitle>
                    <CardDescription>Overview of referral activity</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="text-4xl font-bold">{referrals.length}</div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <div>
                            <CardTitle>Referral List</CardTitle>
                            <CardDescription>Search and filter referral records</CardDescription>
                        </div>
                        <div className="flex items-center gap-2 bg-muted rounded-lg px-3 py-1 w-64">
                            <Search size={18} className="text-muted-foreground" />
                            <Input
                                placeholder="Search candidates..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="border-0 bg-transparent h-8"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm">
                            <thead>
                                <tr className="border-b">
                                    <th className="text-left py-3 px-4 font-semibold">Candidate</th>
                                    <th className="text-left py-3 px-4 font-semibold">Job ID</th>
                                    <th className="text-left py-3 px-4 font-semibold">Referred By</th>
                                    <th className="text-left py-3 px-4 font-semibold">Status</th>
                                    <th className="text-left py-3 px-4 font-semibold">Date</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredReferrals.length === 0 && (
                                    <tr>
                                        <td colSpan={5} className="py-8 text-center text-muted-foreground font-medium">
                                            No referrals found
                                        </td>
                                    </tr>
                                )}
                                {filteredReferrals.map((ref) => (
                                    <tr key={ref.id} className="border-b hover:bg-muted/50 transition-colors">
                                        <td className="py-3 px-4 font-medium">{ref.candidateName}</td>
                                        <td className="py-3 px-4 font-mono text-xs">{ref.jobId}</td>
                                        <td className="py-3 px-4">{ref.referredBy}</td>
                                        <td className="py-3 px-4">
                                            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                                                {ref.status || 'Received'}
                                            </span>
                                        </td>
                                        <td className="py-3 px-4 text-muted-foreground">
                                            {ref.timestamp ? new Date(ref.timestamp).toLocaleDateString() : '-'}
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
