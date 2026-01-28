"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Mail, Phone, Calendar, Briefcase, AlertCircle, Building2, User, MapPin, Droplets, PhoneCall, IdCard, Loader2 } from "lucide-react"
import { Label } from "@/components/ui/label"
import { SkeletonGrid } from "@/components/skeleton-loader"
import EditProfileModal from "@/components/modals/edit-profile-modal"

export default function EmployeeProfilePage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()
  const [profile, setProfile] = useState<any>(null)
  const [salaryData, setSalaryData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  const fetchData = async () => {
    if (!user) return
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      const targetId = (user as any).employeeId || user.id

      // 1. Try fetching by ID
      const empRes = await fetch(`/api/employees/${targetId}`, { headers })
      const empData = await empRes.json()

      if (empData.success) {
        setProfile(empData.data)

        // Fetch salary using the confirmed ID from profile
        const salRes = await fetch(`/api/salary/${empData.data.id}`, { headers })
        const salData = await salRes.json()
        if (salData.success) setSalaryData(salData.data)
      } else {
        // 2. Fallback: Search by email if ID fetch fails
        console.warn("Profile not found by ID, searching by email...")
        const searchRes = await fetch(`/api/employees?search=${encodeURIComponent(user.email)}`, { headers })
        const searchResult = await searchRes.json()

        if (searchResult.success && searchResult.data && searchResult.data.length > 0) {
          const match = searchResult.data.find((e: any) => e.email.toLowerCase() === user.email.toLowerCase())
          if (match) {
            setProfile(match)
            const salRes = await fetch(`/api/salary/${match.id}`, { headers })
            const salData = await salRes.json()
            if (salData.success) setSalaryData(salData.data)
          }
        }
      }
    } catch (error) {
      console.error("Error fetching profile data", error)
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
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
    (user?.name && user.name !== "John Doe" ? user.name : null) ||
    profile?.name ||
    (profile?.firstName ? `${profile.firstName} ${profile.lastName}` : "") ||
    user?.name ||
    "Employee"

  return (
    <main className="md:ml-64 pt-24 p-4 md:p-12 min-h-screen bg-background transition-all duration-700">
      <div className="absolute inset-0 bg-[url('/grid.svg')] bg-center [mask-image:linear-gradient(180deg,white,rgba(255,255,255,0))] pointer-events-none opacity-10" />

      {!profile && (
        <div className="mb-8 p-6 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-4 text-amber-500 animate-in fade-in slide-in-from-top-4 duration-500">
          <AlertCircle size={24} className="flex-shrink-0" />
          <p className="text-sm font-medium">
            <strong className="block text-base mb-1">Incomplete Profile</strong>
            Your official employee record is still being synchronized. Some details may be missing.
          </p>
        </div>
      )}

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-8 items-start">
        {/* Left Column: Brief Info */}
        <div className="xl:col-span-4 space-y-8 animate-in fade-in slide-in-from-left-4 duration-700">
          <Card className="border-white/5 bg-card/60 backdrop-blur-xl overflow-hidden rounded-[2.5rem] shadow-2xl relative group">
            <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-r from-primary/30 to-secondary/30 group-hover:opacity-60 transition-opacity" />
            <CardContent className="pt-16 pb-10 text-center relative">
              <div className="w-32 h-32 bg-gradient-to-br from-primary to-secondary rounded-[2.5rem] mx-auto mb-6 flex items-center justify-center text-white font-black text-4xl shadow-2xl ring-8 ring-background/50 group-hover:scale-110 transition-transform duration-500">
                {displayName[0]}
              </div>
              <h2 className="text-3xl font-black mb-1 text-foreground tracking-tight">{displayName}</h2>
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 text-primary text-xs font-black uppercase tracking-widest mb-4 border border-primary/20">
                {profile?.designation || "New Joiner"}
              </div>
              <p className="text-[10px] font-black tracking-[0.2em] text-muted-foreground/50 mb-4 uppercase">
                ID: {user?.id}
              </p>
              <p className="text-muted-foreground font-medium mb-8 text-sm">{user?.email || profile?.email}</p>

              <div className="flex justify-center flex-col gap-3 px-6">
                <EditProfileModal userEmail={user?.email} onSubmit={() => fetchData()} />
              </div>
            </CardContent>
          </Card>

          {/* Quick Stats or Documents */}
          <Card className="border-white/5 bg-card/60 backdrop-blur-xl rounded-[2.5rem]">
            <CardContent className="p-8">
              <h3 className="text-sm font-black uppercase tracking-[0.2em] text-muted-foreground mb-6">Internal Records</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-white/5 group hover:bg-muted/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500/10 text-blue-500 rounded-xl flex items-center justify-center"><Briefcase size={18} /></div>
                    <span className="text-sm font-bold">Employment Status</span>
                  </div>
                  <span className={`text-xs font-black uppercase px-3 py-1 rounded-full ${profile?.status === 'active' ? 'text-emerald-500 bg-emerald-500/10' : 'text-amber-500 bg-amber-500/10'}`}>
                    {profile?.status || "Active"}
                  </span>
                </div>
                <div className="flex items-center justify-between p-4 bg-muted/30 rounded-2xl border border-white/5 group hover:bg-muted/50 transition-all cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/10 text-purple-500 rounded-xl flex items-center justify-center"><Calendar size={18} /></div>
                    <span className="text-sm font-bold">Probation Period</span>
                  </div>
                  <span className="text-xs font-black uppercase text-muted-foreground px-3 py-1 rounded-full">3 Months</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column: Detailed Info Tabs */}
        <div className="xl:col-span-8 space-y-8 animate-in fade-in slide-in-from-right-4 duration-700">
          <Card className="border-white/5 bg-card/60 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl">
            <CardHeader className="p-10 pb-2 border-b border-white/5">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                  <User size={24} />
                </div>
                <div>
                  <CardTitle className="text-2xl font-black">Personal Dossier</CardTitle>
                  <CardDescription className="text-sm font-medium">Verify and manage your private identification</CardDescription>
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
                      <Phone size={12} className="text-primary" /> Permanent Line
                    </Label>
                    {profile?.phone || (user as any)?.phone || "PENDING"}
                  </div>
                  <div className="group">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                      <IdCard size={12} className="text-primary" /> Corporate ID
                    </Label>
                    <p className="text-xl font-black tracking-widest text-primary/80 group-hover:text-primary transition-colors">
                      {user?.id}
                    </p>
                    <p className="text-[10px] text-muted-foreground mt-1 font-medium">Official HRM Identification</p>
                  </div>
                </div>

                <div className="space-y-8">
                  <div className="group">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                      <Building2 size={12} className="text-primary" /> Operational Department
                    </Label>
                    <p className="text-lg font-bold capitalize group-hover:text-primary transition-colors">
                      {(user as any)?.department || profile?.department || "PENDING"}
                    </p>
                  </div>
                  <div className="group">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                      <Calendar size={12} className="text-primary" /> Joining Threshold
                    </Label>
                    <p className="text-lg font-bold group-hover:text-primary transition-colors">
                      {(user as any)?.joinDate || profile?.joinDate || "SYNCING"}
                    </p>
                  </div>
                  <div className="group">
                    <Label className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground mb-2 flex items-center gap-2">
                      <User size={12} className="text-primary" /> Reporting Officer
                    </Label>
                    <p className="text-lg font-bold group-hover:text-primary transition-colors">
                      {(user as any)?.reportsTo || profile?.reportsTo || "Admin"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-10 border-t border-white/10 relative">
                <h3 className="text-base font-black uppercase tracking-[0.2em] text-primary mb-8">Vital Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="md:col-span-2 p-6 bg-muted/30 rounded-[1.5rem] border border-white/5 hover:border-primary/30 transition-all">
                    <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground mb-2 flex items-center gap-2"><MapPin size={12} /> Registered Address</Label>
                    <p className="text-sm font-bold leading-relaxed">
                      {profile?.address || "Location not set"}
                      {profile?.pinCode && ` - ${profile.pinCode}`}
                    </p>
                  </div>
                  <div className="p-6 bg-muted/30 rounded-[1.5rem] border border-white/5 hover:border-primary/30 transition-all">
                    <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground mb-2 flex items-center gap-2"><Droplets size={12} className="text-red-500" /> Blood Group</Label>
                    <p className="text-2xl font-black text-red-500">{profile?.bloodGroup && profile.bloodGroup !== "N/A" ? profile.bloodGroup : "—"}</p>
                  </div>
                  <div className="p-6 bg-muted/30 rounded-[1.5rem] border border-white/5 hover:border-primary/30 transition-all">
                    <Label className="text-[10px] font-black uppercase tracking-[0.1em] text-muted-foreground mb-2 flex items-center gap-2"><PhoneCall size={12} /> ICE Contact</Label>
                    <p className="text-sm font-bold">{profile?.emergencyContact && profile.emergencyContact !== "N/A" ? profile.emergencyContact : "None set"}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Salary Card Redesigned */}
          <Card className="border-white/5 bg-gradient-to-br from-card/80 to-muted/80 backdrop-blur-xl rounded-[2.5rem] overflow-hidden shadow-2xl relative">
            <div className="absolute top-0 right-0 p-8 opacity-10"><Briefcase size={120} /></div>
            <CardHeader className="p-10 pb-0">
              <CardTitle className="text-xl font-black uppercase tracking-widest text-muted-foreground">Remuneration Structure</CardTitle>
            </CardHeader>
            <CardContent className="p-10 pt-8">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="p-6 bg-background/50 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">Net Monthly</p>
                  <p className="text-2xl font-black text-primary">₹{salaryData?.structure?.netSalary?.toLocaleString() || '0'}</p>
                </div>
                <div className="p-6 bg-background/50 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">Annual CTC</p>
                  <p className="text-2xl font-bold">₹{(salaryData?.structure?.netSalary * 12)?.toLocaleString() || '0'}</p>
                </div>
                <div className="p-6 bg-background/50 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">Cycle Status</p>
                  <p className="text-lg font-black text-emerald-500 uppercase">{salaryData ? 'Live' : 'Inactive'}</p>
                </div>
                <div className="p-6 bg-background/50 rounded-2xl border border-white/5">
                  <p className="text-[10px] font-black uppercase tracking-wider text-muted-foreground mb-2">Verified On</p>
                  <p className="text-sm font-black text-muted-foreground">{salaryData?.updatedAt ? new Date(salaryData.updatedAt).toLocaleDateString() : 'N/A'}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </main>
  )
}
