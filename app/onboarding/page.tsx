"use client"

import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { FileText, User, Phone, MapPin, CheckCircle2, Loader2, Upload, Sparkles, PhoneCall } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"

export default function OnboardingPage() {
    const { user, loading, userRole } = useAuth()
    const router = useRouter()
    const [step, setStep] = useState(1)
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        address: "",
        pinCode: "",
        bloodGroup: "",
        emergencyContact: "",
    })

    const [files, setFiles] = useState<{ [key: string]: File | null }>({
        resume: null,
        offerLetter: null,
        nda: null,
    })

    useEffect(() => {
        if (!loading && (!user || userRole !== "candidate")) {
            if (userRole === "employee") {
                router.push("/employee/dashboard")
            } else if (userRole === "admin") {
                router.push("/admin/dashboard")
            } else if (userRole === "recruiter") {
                router.push("/recruiter/dashboard")
            } else if (!user) {
                router.push("/login")
            }
        } else if (user) {
            setFormData(prev => ({ ...prev, name: user.name, email: user.email }))
            if ((user as any).status === "pending_verification") {
                setSuccess(true)
            }
        }
    }, [loading, user, userRole, router])

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, fieldName: string) => {
        if (e.target.files && e.target.files[0]) {
            setFiles(prev => ({ ...prev, [fieldName]: e.target.files![0] }))
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setIsSubmitting(true)

        try {
            const token = localStorage.getItem("authToken")
            const data = new FormData()

            data.append("name", formData.name)
            data.append("email", formData.email)
            data.append("phone", formData.phone)
            data.append("address", formData.address)
            data.append("pinCode", formData.pinCode)
            data.append("bloodGroup", formData.bloodGroup)
            data.append("emergencyContact", formData.emergencyContact)

            if (files.resume) data.append("resume", files.resume)
            if (files.offerLetter) data.append("offerLetter", files.offerLetter)
            if (files.nda) data.append("nda", files.nda)

            const response = await fetch("/api/auth/onboard/registration", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: data,
            })

            const result = await response.json()

            if (result.success) {
                setSuccess(true)
                window.scrollTo(0, 0)
            } else {
                setError(result.message || "Failed to submit onboarding details")
            }
        } catch (err) {
            setError("An error occurred during submission. Please try again.")
        } finally {
            setIsSubmitting(false)
        }
    }

    if (loading) return <div className="flex items-center justify-center min-h-screen"><Loader2 className="animate-spin" /></div>

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background/50 p-4">
                <Card className="max-w-md w-full text-center p-8 bg-card shadow-[0_0_50px_rgba(0,0,0,0.5)] border-t-4 border-t-primary animate-in fade-in zoom-in duration-500">
                    <div className="flex justify-center mb-6 text-primary">
                        <div className="p-4 bg-primary/10 rounded-full">
                            <CheckCircle2 size={64} className="animate-pulse" />
                        </div>
                    </div>
                    <CardTitle className="text-3xl font-extrabold mb-4 text-foreground">Welcome Aboard!</CardTitle>
                    <CardDescription className="text-base mb-8 text-muted-foreground leading-relaxed">
                        Your documents have been submitted for review.
                        Once an administrator verifies your profile, you&apos;ll be officially promoted to the employee role.
                        Keep an eye on your status!
                    </CardDescription>
                    <Button onClick={() => window.location.reload()} className="w-full py-6 text-lg font-bold shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all">
                        Refresh Status
                    </Button>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-background md:ml-64 pt-24 pb-12 px-4 sm:px-6 lg:px-8 transition-colors duration-500">
            <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12 animate-in fade-in slide-in-from-top-4 duration-700">
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/10 text-primary text-xs font-bold mb-4 uppercase tracking-widest border border-primary/20">
                        <Sparkles size={12} />
                        Onboarding Phase
                    </div>
                    <h1 className="text-4xl font-black text-foreground tracking-tight sm:text-5xl">
                        Welcome to <span className="text-primary italic">the team.</span>
                    </h1>
                    <p className="mt-4 text-lg text-muted-foreground font-medium">Just a few more steps to finalize your joining.</p>
                </div>

                {/* Multi-step indicator */}
                <div className="flex items-center justify-between mb-12 px-8 max-w-md mx-auto">
                    <div className="flex flex-col items-center gap-2 relative">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all duration-500 ${step >= 1 ? 'bg-primary text-white shadow-xl shadow-primary/30 ring-4 ring-primary/10 scale-110' : 'bg-muted text-muted-foreground opacity-50'}`}>1</div>
                        <span className={`text-[10px] uppercase font-black tracking-tighter ${step >= 1 ? 'text-primary' : 'text-muted-foreground'}`}>Profile</span>
                    </div>
                    <div className="flex-1 h-[2px] bg-muted mx-4 mt-[-20px] relative overflow-hidden">
                        <div className={`absolute inset-0 bg-primary transition-all duration-700 ${step >= 2 ? 'translate-x-0' : '-translate-x-full'}`} />
                    </div>
                    <div className="flex flex-col items-center gap-2 relative">
                        <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black transition-all duration-500 ${step >= 2 ? 'bg-primary text-white shadow-xl shadow-primary/30 ring-4 ring-primary/10 scale-110' : 'bg-muted text-muted-foreground opacity-50'}`}>2</div>
                        <span className={`text-[10px] uppercase font-black tracking-tighter ${step >= 2 ? 'text-primary' : 'text-muted-foreground'}`}>Documents</span>
                    </div>
                </div>

                <Card className="shadow-2xl border-white/5 bg-card/60 backdrop-blur-xl overflow-hidden rounded-[2rem]">
                    <CardContent className="p-10">
                        <form onSubmit={handleSubmit} className="space-y-8">
                            {error && (
                                <Alert variant="destructive" className="bg-red-500/10 border-red-500/20 text-red-500">
                                    <AlertDescription className="font-bold">{error}</AlertDescription>
                                </Alert>
                            )}

                            {step === 1 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label htmlFor="name" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Full Name</Label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
                                                <Input
                                                    id="name"
                                                    value={formData.name}
                                                    className="pl-12 h-14 bg-muted/30 border-white/5 focus:bg-muted/50 transition-all font-bold text-lg pointer-events-none opacity-70"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="email" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Work Email</Label>
                                            <div className="relative group">
                                                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
                                                <Input
                                                    id="email"
                                                    value={formData.email}
                                                    className="pl-12 h-14 bg-muted/30 border-white/5 font-mono text-base pointer-events-none opacity-70"
                                                    readOnly
                                                />
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="phone" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Contact Number</Label>
                                        <div className="relative group">
                                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
                                            <Input
                                                id="phone"
                                                placeholder="+91 98765 43210"
                                                value={formData.phone}
                                                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                                                className="pl-12 h-14 bg-muted/50 border-white/10 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                                        <div className="md:col-span-3 space-y-2">
                                            <Label htmlFor="address" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Permanent Address</Label>
                                            <div className="relative group">
                                                <MapPin className="absolute left-4 top-4 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
                                                <Textarea
                                                    id="address"
                                                    placeholder="Complete residential details..."
                                                    value={formData.address}
                                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                                    className="pl-12 min-h-[120px] bg-muted/50 border-white/10 focus:ring-2 focus:ring-primary/20 transition-all font-medium text-base resize-none"
                                                    required
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="pinCode" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Zip Code</Label>
                                            <Input
                                                id="pinCode"
                                                placeholder="110001"
                                                value={formData.pinCode}
                                                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value })}
                                                className="h-14 bg-muted/50 border-white/10 focus:ring-2 focus:ring-primary/20 transition-all font-black text-center text-xl tracking-[0.2em]"
                                                required
                                            />
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                            <Label htmlFor="bloodGroup" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Blood Group</Label>
                                            <select
                                                id="bloodGroup"
                                                value={formData.bloodGroup}
                                                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
                                                className="w-full h-14 px-4 bg-muted/50 border border-white/10 rounded-xl focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg appearance-none text-foreground"
                                                required
                                            >
                                                <option value="" disabled className="bg-background text-muted-foreground">Select Group</option>
                                                {["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"].map(group => (
                                                    <option key={group} value={group} className="bg-background text-foreground">{group}</option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="space-y-2">
                                            <Label htmlFor="emergencyContact" className="text-xs font-black uppercase tracking-widest text-muted-foreground ml-1">Emergency Contact</Label>
                                            <div className="relative group">
                                                <PhoneCall className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground transition-colors group-focus-within:text-primary" size={18} />
                                                <Input
                                                    id="emergencyContact"
                                                    placeholder="+91 00000 00000"
                                                    value={formData.emergencyContact}
                                                    onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
                                                    className="pl-12 h-14 bg-muted/50 border-white/10 focus:ring-2 focus:ring-primary/20 transition-all font-bold text-lg"
                                                    required
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <div className="pt-10 flex justify-end">
                                        <Button
                                            type="button"
                                            onClick={() => setStep(2)}
                                            className="h-16 px-10 rounded-2xl shadow-2xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all text-xl font-black bg-primary text-white"
                                        >
                                            Next Step: Uploads
                                        </Button>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                                    <div className="grid grid-cols-1 gap-6">
                                        {/* File Upload Component */}
                                        {[
                                            { id: "resume", label: "Official Resume", icon: FileText, color: "text-blue-400", bg: "bg-blue-400/10", desc: "PDF format only, max 5MB", file: files.resume },
                                            { id: "offerLetter", label: "Signed Offer", icon: Upload, color: "text-emerald-400", bg: "bg-emerald-400/10", desc: "The document sent via email", file: files.offerLetter },
                                            { id: "nda", label: "NDA Agreement", icon: CheckCircle2, color: "text-amber-400", bg: "bg-amber-400/10", desc: "Mutual confidence agreement", file: files.nda },
                                        ].map((item) => (
                                            <div key={item.id} className="group transition-all relative">
                                                <div className={`p-6 rounded-[1.5rem] border-2 border-dashed border-white/10 bg-muted/20 group-hover:bg-muted/40 group-hover:border-primary/50 transition-all flex items-center justify-between`}>
                                                    <div className="flex items-center gap-5">
                                                        <div className={`w-14 h-14 ${item.bg} ${item.color} rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110`}>
                                                            <item.icon size={28} />
                                                        </div>
                                                        <div>
                                                            <p className="text-lg font-black text-foreground">{item.label}</p>
                                                            <p className="text-sm text-muted-foreground font-medium">{item.desc}</p>
                                                        </div>
                                                    </div>
                                                    {item.file ? (
                                                        <div className="bg-emerald-500/20 text-emerald-400 px-4 py-2 rounded-xl text-xs font-black uppercase flex items-center gap-2">
                                                            <CheckCircle2 size={14} /> {item.file.name.slice(0, 15)}...
                                                        </div>
                                                    ) : (
                                                        <div className="bg-white/5 border border-white/10 px-4 py-2 rounded-xl text-xs font-black uppercase text-muted-foreground italic">
                                                            Ready for upload
                                                        </div>
                                                    )}
                                                </div>
                                                <Input
                                                    id={item.id}
                                                    type="file"
                                                    onChange={(e) => handleFileChange(e, item.id)}
                                                    className="absolute inset-0 opacity-0 cursor-pointer z-10"
                                                    accept=".pdf"
                                                    required
                                                />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="pt-10 flex gap-4">
                                        <Button
                                            type="button"
                                            variant="outline"
                                            onClick={() => setStep(1)}
                                            className="h-16 px-8 rounded-2xl border-white/10 hover:bg-white/5 text-lg font-bold"
                                        >
                                            Step 1
                                        </Button>
                                        <Button
                                            type="submit"
                                            disabled={isSubmitting}
                                            className="flex-1 h-16 rounded-2xl bg-primary text-white text-xl font-black shadow-[0_20px_40px_-15px_rgba(var(--primary-rgb),0.3)] hover:scale-[1.02] active:scale-95 transition-all"
                                        >
                                            {isSubmitting ? (
                                                <div className="flex items-center gap-3">
                                                    <Loader2 className="animate-spin" size={24} />
                                                    Finalizing Profile...
                                                </div>
                                            ) : (
                                                "Submit All Documents"
                                            )}
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div >
    )
}
