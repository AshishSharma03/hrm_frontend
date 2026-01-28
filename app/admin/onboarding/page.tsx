"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Search, ExternalLink, CheckCircle2, XCircle, UserCheck, Download, Loader2, FileText } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { SkeletonTable } from "@/components/skeleton-loader"

export default function AdminOnboardingPage() {
    const { user, loading, userRole } = useAuth()
    const router = useRouter()
    const [candidates, setCandidates] = useState<any[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [searchTerm, setSearchTerm] = useState("")
    const [selectedCandidate, setSelectedCandidate] = useState<any>(null)
    const [isVerifying, setIsVerifying] = useState(false)
    const [verificationData, setVerificationData] = useState({
        firstName: "",
        lastName: "",
        phone: "",
        department: "",
        designation: "",
        joinDate: "",
        reportsTo: "",
        salary: "",
    })

    const fetchCandidates = async () => {
        try {
            const token = localStorage.getItem("authToken")
            const res = await fetch("/api/candidates", {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                // Filter for candidates who have submitted their details (pending_verification)
                setCandidates(data.data.filter((c: any) => c.status === "pending_verification"))
            }
        } catch (error) {
            console.error("Failed to fetch candidates", error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() => {
        if (!loading && (!user || (userRole !== "admin" && userRole !== "recruiter"))) {
            router.push("/login")
        } else if (!loading) {
            fetchCandidates()
        }
    }, [loading, user, userRole, router])

    const handleVerify = async (e: React.FormEvent) => {
        e.preventDefault()
        setIsVerifying(true)
        try {
            const token = localStorage.getItem("authToken")
            const res = await fetch(`/api/candidates/${selectedCandidate.id}/verify`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    ...verificationData,
                    salary: Number(verificationData.salary)
                })
            })
            const data = await res.json()
            if (data.success) {
                alert("Candidate verified successfully!")
                setSelectedCandidate(null)
                fetchCandidates()
            } else {
                alert(data.message || "Verification failed")
            }
        } catch (error) {
            alert("An error occurred")
        } finally {
            setIsVerifying(false)
        }
    }

    const handleReject = async (candidateId: string) => {
        if (!confirm("Are you sure you want to reject this candidate?")) return
        try {
            const token = localStorage.getItem("authToken")
            const res = await fetch(`/api/candidates/${candidateId}/reject`, {
                method: "DELETE",
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                alert("Candidate rejected")
                fetchCandidates()
            }
        } catch (error) {
            alert("An error occurred")
        }
    }

    const openVerifyModal = (candidate: any) => {
        const nameParts = candidate.name?.split(" ") || ["", ""]
        setSelectedCandidate(candidate)
        setVerificationData({
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            phone: candidate.phone || "",
            department: "",
            designation: "",
            joinDate: new Date().toISOString().split("T")[0],
            reportsTo: "",
            salary: "",
        })
    }

    const filteredCandidates = candidates.filter(c =>
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.email?.toLowerCase().includes(searchTerm.toLowerCase())
    )

    if (loading || isLoading) {
        return (
            <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-2xl font-bold">Candidate Onboarding</h1>
                </div>
                <SkeletonTable />
            </main>
        )
    }

    return (
        <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
            <div className="flex justify-between items-center mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Candidate Onboarding</h1>
                    <p className="text-muted-foreground">Manage and verify new joining candidates</p>
                </div>
                <div className="bg-primary/10 text-primary px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2">
                    <Loader2 size={16} className={candidates.length > 0 ? "animate-spin" : ""} />
                    {candidates.length} Pending Verifications
                </div>
            </div>

            <Card className="mb-6">
                <CardContent className="pt-6">
                    <div className="flex items-center gap-2 bg-muted rounded-lg px-3">
                        <Search size={18} className="text-muted-foreground" />
                        <Input
                            placeholder="Search by name or email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="border-0 bg-transparent focus-visible:ring-0"
                        />
                    </div>
                </CardContent>
            </Card>

            <div className="overflow-x-auto bg-white rounded-xl shadow-sm border">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="border-b bg-muted/30">
                            <th className="text-left py-4 px-6 font-semibold">Candidate</th>
                            <th className="text-left py-4 px-6 font-semibold">Contact</th>
                            <th className="text-left py-4 px-6 font-semibold">Documents</th>
                            <th className="text-left py-4 px-6 font-semibold">Submitted On</th>
                            <th className="text-right py-4 px-6 font-semibold">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredCandidates.length === 0 ? (
                            <tr>
                                <td colSpan={5} className="py-12 text-center text-muted-foreground font-medium">
                                    No pending onboarding requests found.
                                </td>
                            </tr>
                        ) : (
                            filteredCandidates.map((candidate) => (
                                <tr key={candidate.id} className="border-b hover:bg-muted/50 transition-colors">
                                    <td className="py-4 px-6">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                                                {candidate.name?.[0]}
                                            </div>
                                            <div>
                                                <p className="font-bold">{candidate.name}</p>
                                                <p className="text-xs text-muted-foreground">{candidate.email}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 font-mono text-xs">{candidate.phone || 'N/A'}</td>
                                    <td className="py-4 px-6">
                                        <div className="flex gap-2">
                                            {candidate.resumeUrl && (
                                                <a href={candidate.resumeUrl} target="_blank" rel="noreferrer" title="Resume">
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-blue-600 hover:text-blue-700 hover:bg-blue-50">
                                                        <Download size={16} />
                                                    </Button>
                                                </a>
                                            )}
                                            {candidate.offerLetterUrl && (
                                                <a href={candidate.offerLetterUrl} target="_blank" rel="noreferrer" title="Offer Letter">
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-green-600 hover:text-green-700 hover:bg-green-50">
                                                        <CheckCircle2 size={16} />
                                                    </Button>
                                                </a>
                                            )}
                                            {candidate.ndaUrl && (
                                                <a href={candidate.ndaUrl} target="_blank" rel="noreferrer" title="NDA">
                                                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-purple-600 hover:text-purple-700 hover:bg-purple-50">
                                                        <FileText size={16} />
                                                    </Button>
                                                </a>
                                            )}
                                        </div>
                                    </td>
                                    <td className="py-4 px-6 text-xs text-muted-foreground">
                                        {candidate.updatedAt ? new Date(candidate.updatedAt).toLocaleDateString() : 'N/A'}
                                    </td>
                                    <td className="py-4 px-6">
                                        <div className="flex justify-end gap-2">
                                            <Dialog>
                                                <DialogTrigger asChild>
                                                    <Button size="sm" variant="default" className="gap-2" onClick={() => openVerifyModal(candidate)}>
                                                        <UserCheck size={16} />
                                                        Verify & Promote
                                                    </Button>
                                                </DialogTrigger>
                                                <DialogContent className="max-w-xl">
                                                    <DialogHeader>
                                                        <DialogTitle>Complete Onboarding for {candidate.name}</DialogTitle>
                                                        <DialogDescription>Fill in the official employee details to promote this candidate.</DialogDescription>
                                                    </DialogHeader>
                                                    <form onSubmit={handleVerify} className="space-y-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>First Name</Label>
                                                                <Input value={verificationData.firstName} onChange={e => setVerificationData({ ...verificationData, firstName: e.target.value })} required />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Last Name</Label>
                                                                <Input value={verificationData.lastName} onChange={e => setVerificationData({ ...verificationData, lastName: e.target.value })} required />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Department</Label>
                                                                <Select value={verificationData.department} onValueChange={v => setVerificationData({ ...verificationData, department: v })}>
                                                                    <SelectTrigger>
                                                                        <SelectValue placeholder="Select dept" />
                                                                    </SelectTrigger>
                                                                    <SelectContent>
                                                                        <SelectItem value="engineering">Engineering</SelectItem>
                                                                        <SelectItem value="sales">Sales</SelectItem>
                                                                        <SelectItem value="marketing">Marketing</SelectItem>
                                                                        <SelectItem value="hr">HR</SelectItem>
                                                                        <SelectItem value="finance">Finance</SelectItem>
                                                                    </SelectContent>
                                                                </Select>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Designation</Label>
                                                                <Input value={verificationData.designation} onChange={e => setVerificationData({ ...verificationData, designation: e.target.value })} required />
                                                            </div>
                                                        </div>
                                                        <div className="grid grid-cols-3 gap-4">
                                                            <div className="space-y-2">
                                                                <Label>Join Date</Label>
                                                                <Input type="date" value={verificationData.joinDate} onChange={e => setVerificationData({ ...verificationData, joinDate: e.target.value })} required />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Salary (Annual)</Label>
                                                                <Input type="number" value={verificationData.salary} onChange={e => setVerificationData({ ...verificationData, salary: e.target.value })} required />
                                                            </div>
                                                            <div className="space-y-2">
                                                                <Label>Reports To</Label>
                                                                <Input value={verificationData.reportsTo} onChange={e => setVerificationData({ ...verificationData, reportsTo: e.target.value })} required />
                                                            </div>
                                                        </div>
                                                        <div className="pt-4 flex gap-3">
                                                            <Button type="submit" className="flex-1" disabled={isVerifying}>
                                                                {isVerifying ? <Loader2 className="animate-spin mr-2" /> : <UserCheck size={18} className="mr-2" />}
                                                                Approve & Create Employee Record
                                                            </Button>
                                                        </div>
                                                    </form>
                                                </DialogContent>
                                            </Dialog>
                                            <Button size="sm" variant="destructive" className="h-9 w-9 p-0" onClick={() => handleReject(candidate.id)}>
                                                <XCircle size={18} />
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </main>
    )
}
