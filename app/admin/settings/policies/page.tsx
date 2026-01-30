"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import CreatePolicyModal from "@/components/modals/create-policy-modal"
import AssignPolicyModal from "@/components/modals/assign-policy-modal"
import { Shield, Clock, Calendar, Users, Settings, Trash2 } from "lucide-react"

interface Policy {
    id: string
    name: string
    type: string
    entityId: string
    rules: {
        requiredDailyHours: number
        maxIdleGapMinutes: number
        autoCheckoutAfterHours: number
        timezone: string
        workingDays: string[]
    }
    createdAt: string
}

export default function AdminPoliciesPage() {
    const { user, loading, userRole } = useAuth()
    const router = useRouter()
    const [policies, setPolicies] = useState<Policy[]>([])
    const [isLoading, setIsLoading] = useState(true)

    const fetchPolicies = async () => {
        try {
            const token = localStorage.getItem("authToken")
            const res = await fetch("/api/attendance/policy", {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                setPolicies(data.data || [])
            }
        } catch (error) {
            console.error("Error fetching policies", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!loading && (!user || userRole !== "admin")) {
            router.push("/login")
        } else if (!loading) {
            fetchPolicies()
        }
    }, [loading, user, userRole, router])

    const getTypeColor = (type: string) => {
        switch (type) {
            case 'ORGANIZATION': return 'bg-purple-100 text-purple-700'
            case 'ROLE': return 'bg-blue-100 text-blue-700'
            case 'DEPARTMENT': return 'bg-green-100 text-green-700'
            case 'USER': return 'bg-orange-100 text-orange-700'
            default: return 'bg-gray-100 text-gray-700'
        }
    }

    if (loading || isLoading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

    return (
        <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
            <div className="mb-8 flex justify-between items-center">
                <div className="flex items-center gap-3">
                    <Shield size={28} className="text-primary" />
                    <div>
                        <h1 className="text-2xl font-bold">Attendance Policies</h1>
                        <p className="text-sm text-muted-foreground">Manage attendance rules and compliance</p>
                    </div>
                </div>
                <div className="flex gap-2">
                    <AssignPolicyModal onSubmit={() => fetchPolicies()} />
                    <CreatePolicyModal onSubmit={() => fetchPolicies()} />
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-blue-100">
                                <Shield size={20} className="text-blue-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Total Policies</p>
                                <p className="text-2xl font-bold">{policies.length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-purple-100">
                                <Settings size={20} className="text-purple-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Organization</p>
                                <p className="text-2xl font-bold">{policies.filter(p => p.type === 'ORGANIZATION').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-green-100">
                                <Users size={20} className="text-green-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">Role-based</p>
                                <p className="text-2xl font-bold">{policies.filter(p => p.type === 'ROLE').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="pt-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 rounded-full bg-orange-100">
                                <Users size={20} className="text-orange-600" />
                            </div>
                            <div>
                                <p className="text-sm text-muted-foreground">User-specific</p>
                                <p className="text-2xl font-bold">{policies.filter(p => p.type === 'USER').length}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Policies List */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {policies.length === 0 ? (
                    <Card className="col-span-2">
                        <CardContent className="pt-6">
                            <p className="text-center text-muted-foreground py-8">
                                No policies defined yet. Click "Create Policy" to add one.
                            </p>
                        </CardContent>
                    </Card>
                ) : (
                    policies.map((policy) => (
                        <Card key={policy.id} className="hover:shadow-lg transition-shadow">
                            <CardHeader className="pb-2">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-lg">{policy.name}</CardTitle>
                                        <CardDescription>ID: {policy.id}</CardDescription>
                                    </div>
                                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getTypeColor(policy.type)}`}>
                                        {policy.type}
                                    </span>
                                </div>
                            </CardHeader>
                            <CardContent>
                                <div className="space-y-3">
                                    <div className="text-sm">
                                        <span className="text-muted-foreground">Applied to: </span>
                                        <span className="font-medium">{policy.entityId || 'GLOBAL'}</span>
                                    </div>

                                    <div className="grid grid-cols-2 gap-2 text-sm">
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-muted-foreground" />
                                            <span>{policy.rules?.requiredDailyHours || 9} hrs/day</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Clock size={14} className="text-muted-foreground" />
                                            <span>Auto-checkout: {policy.rules?.autoCheckoutAfterHours || 12}h</span>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2 text-sm">
                                        <Calendar size={14} className="text-muted-foreground" />
                                        <span className="text-muted-foreground">Working days: </span>
                                        <span>{policy.rules?.workingDays?.map(d => d.slice(0, 3)).join(', ') || 'Mon-Fri'}</span>
                                    </div>

                                    <div className="flex gap-2 pt-3 border-t">
                                        <Button size="sm" variant="outline" className="flex-1">
                                            Edit
                                        </Button>
                                        <Button size="sm" variant="destructive" className="flex items-center gap-1">
                                            <Trash2 size={14} />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                )}
            </div>
        </main>
    )
}
