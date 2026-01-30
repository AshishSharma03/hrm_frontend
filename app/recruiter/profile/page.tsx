"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, Calendar, Briefcase, AlertCircle, Building2, User, MapPin, IdCard, Loader2, Users, Target } from "lucide-react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

export default function RecruiterProfilePage() {
    const { user, loading, userRole } = useAuth()
    const router = useRouter()
    const [profile, setProfile] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [stats, setStats] = useState({ totalHires: 0, interviews: 0, openJobs: 0 })

    const fetchData = async () => {
        if (!user) return
        try {
            const token = localStorage.getItem("authToken")
            const headers = { Authorization: `Bearer ${token}` }

            // Fetch recruiter profile
            const recRes = await fetch(`/api/recruiters/${user.id}`, { headers })
            const recData = await recRes.json()

            if (recData.success) {
                setProfile(recData.data)
            }

            // Fetch stats
            const [jobsRes, intRes] = await Promise.all([
                fetch("/api/jobs", { headers }),
                fetch("/api/interviews", { headers }),
            ])

            const jobsData = await jobsRes.json()
            const intData = await intRes.json()

            setStats({
                totalHires: profile?.hireCount || 0,
                interviews: intData.data?.length || 0,
                openJobs: jobsData.data?.filter((j: any) => j.status === 'open')?.length || 0
            })

        } catch (error) {
            console.error("Error fetching profile data", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!loading && (!user || userRole !== "recruiter")) {
            router.push("/login")
        } else if (!loading) {
            fetchData()
        }
    }, [loading, user, userRole, router])

    if (loading || isLoading) {
        return (
            <main className="md:ml-64 pt-24 p-4 md:p-8 min-h-screen bg-background flex items-center justify-center">
                <Loader2 className="animate-spin text-primary" size={40} />
            </main>
        )
    }

    const displayName =
        profile?.name ||
        (profile?.firstName ? `${profile.firstName} ${profile.lastName}` : "") ||
        user?.name ||
        "Recruiter"

    return (
        <main className="md:ml-64 pt-24 p-4 md:p-12 min-h-screen bg-background transition-all duration-700">
            <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-10" />

            {!profile && (
                <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4 text-amber-500 animate-in fade-in slide-in-from-top-4 duration-500">
                    <AlertCircle size={24} className="flex-shrink-0" />
                    <p className="text-sm font-medium">
                        <strong className="block text-base mb-1">Profile Loading</strong>
                        Your recruiter profile is being loaded. If this persists, contact admin.
                    </p>
                </div>
            )}

            <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
                {/* Left Column: Brief Info */}
                <div className="xl:col-span-4 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
                    <Card className="border-white/5 bg-card/60 backdrop-blur-xl overflow-hidden rounded-[2.5rem] shadow-2xl relative group">
                        <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-blue-600/30 to-purple-600/30 group-hover:opacity-60 transition-opacity" />
                        <CardContent className="pt-16 pb-10 text-center relative">
                            <div className="w-32 h-32 bg-gradient-to-br from-blue-600 to-purple-600 rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center text-white font-black text-4xl shadow-2xl ring-8 ring-background/50 group-hover:scale-110 transition-transform duration-500">
                                {displayName[0]}
                            </div>
                            <h2 className="text-3xl font-black mb-1 text-foreground tracking-tight">{displayName}</h2>
                            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-600/10 text-blue-600 text-xs font-black uppercase tracking-widest mb-4 border border-blue-600/20">
                                <Briefcase size={12} /> Recruiter
                            </div>
                            <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/50 mb-4 uppercase">
                                ID: {user?.id}
                            </p>
                            <p className="text-muted-foreground font-medium mb-8 text-sm">{user?.email || profile?.email}</p>

                            <Button variant="outline" className="w-full" onClick={() => router.push("/recruiter/dashboard")}>
                                Go to Dashboard
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card className="border-white/5 bg-card/60 backdrop-blur-xl rounded-[2.5rem]">
                        <CardContent className="p-8">
                            <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Performance Stats</h3>
                            <div className="space-y-4">
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-white/5 group hover:bg-muted/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-green-500/10 text-green-500 rounded-xl flex items-center justify-center"><Users size={18} /></div>
                                        <span className="text-sm font-bold">Total Hires</span>
                                    </div>
                                    <span className="text-xl font-black text-green-500">{stats.totalHires}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-white/5 group hover:bg-muted/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center"><Calendar size={18} /></div>
                                        <span className="text-sm font-bold">Interviews Conducted</span>
                                    </div>
                                    <span className="text-xl font-black text-purple-500">{stats.interviews}</span>
                                </div>
                                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-white/5 group hover:bg-muted/50 transition-all">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center"><Target size={18} /></div>
                                        <span className="text-sm font-bold">Open Positions</span>
                                    </div>
                                    <span className="text-xl font-black text-blue-500">{stats.openJobs}</span>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Detailed Info */}
                <div className="xl:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
                    <Card className="border-white/5 bg-card/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
                        <CardHeader className="p-10 pb-2 border-b border-white/5">
                            <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-blue-600/10 rounded-2xl flex items-center justify-center text-blue-600">
                                    <User size={24} />
                                </div>
                                <div>
                                    <CardTitle className="text-2xl font-black">Recruiter Profile</CardTitle>
                                    <CardDescription className="text-sm font-medium">Your professional details</CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="p-10 space-y-12">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
                                <div className="space-y-8">
                                    <div className="group">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                                            <Mail size={12} className="text-primary" /> Contact Email
                                        </Label>
                                        <p className="text-lg font-bold group-hover:text-primary transition-colors">{user?.email || profile?.email}</p>
                                    </div>
                                    <div className="group">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                                            <Phone size={12} className="text-primary" /> Phone Number
                                        </Label>
                                        <p className="text-lg font-bold group-hover:text-primary transition-colors">{profile?.phone || "Not set"}</p>
                                    </div>
                                    <div className="group">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                                            <IdCard size={12} className="text-primary" /> Recruiter ID
                                        </Label>
                                        <p className="text-xl font-black tracking-widest text-primary/80 group-hover:text-primary transition-colors">
                                            {user?.id}
                                        </p>
                                    </div>
                                </div>

                                <div className="space-y-8">
                                    <div className="group">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                                            <Building2 size={12} className="text-primary" /> Specialization
                                        </Label>
                                        <p className="text-lg font-bold capitalize group-hover:text-primary transition-colors">
                                            {profile?.specialization || "General"}
                                        </p>
                                    </div>
                                    <div className="group">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                                            <Calendar size={12} className="text-primary" /> Experience
                                        </Label>
                                        <p className="text-lg font-bold group-hover:text-primary transition-colors">
                                            {profile?.experience || "N/A"} years
                                        </p>
                                    </div>
                                    <div className="group">
                                        <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                                            <User size={12} className="text-primary" /> Status
                                        </Label>
                                        <span className={`inline-flex px-3 py-1 rounded-full text-xs font-black uppercase ${profile?.status === 'active' ? 'bg-green-500/10 text-green-500' : 'bg-amber-500/10 text-amber-500'}`}>
                                            {profile?.status || profile?.approvalStatus || "Active"}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            {/* Quick Actions */}
                            <div className="pt-10 border-t border-white/10">
                                <h3 className="text-base font-black uppercase tracking-[0.2em] text-primary mb-6">Quick Actions</h3>
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                    <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => router.push("/recruiter/jobs")}>
                                        <Briefcase size={20} />
                                        <span className="text-xs">Manage Jobs</span>
                                    </Button>
                                    <Button variant="outline" className="h-16 flex-col gap-1" onClick={() => router.push("/recruiter/interviews")}>
                                        <Calendar size={20} />
                                        <span className="text-xs">Schedule Interview</span>
                                    </Button>
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </main>
    )
}
