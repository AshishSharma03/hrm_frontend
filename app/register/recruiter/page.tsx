"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, CheckCircle2, Briefcase } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function RecruiterRegisterPage() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        confirmPassword: ""
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")

        // Validate passwords match
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords do not match")
            return
        }

        if (formData.password.length < 6) {
            setError("Password must be at least 6 characters")
            return
        }

        setLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    role: "recruiter"
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Registration failed")
            }

            setSuccess(true)
            setTimeout(() => {
                router.push("/login")
            }, 2000)

        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-500/10 via-purple-500/5 to-primary/10 p-4">
            <Card className="w-full max-w-md shadow-2xl border-t-4 border-t-blue-600">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-14 h-14 bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center text-white shadow-lg">
                            <Briefcase size={28} />
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Recruiter Registration</CardTitle>
                    <CardDescription>Create your recruiter account to start hiring</CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                                <CheckCircle2 size={32} />
                            </div>
                            <p className="font-semibold text-green-700">Account created successfully!</p>
                            <p className="text-sm text-muted-foreground">Redirecting to login...</p>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-4">
                            {error && (
                                <Alert variant="destructive">
                                    <AlertCircle className="h-4 w-4" />
                                    <AlertDescription>{error}</AlertDescription>
                                </Alert>
                            )}

                            <div className="space-y-2">
                                <Label htmlFor="name">Full Name</Label>
                                <Input
                                    id="name"
                                    placeholder="John Doe"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    required
                                    className="bg-muted/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="email">Work Email</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="recruiter@company.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="bg-muted/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="password">Password</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.password}
                                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                                    required
                                    className="bg-muted/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirm Password</Label>
                                <Input
                                    id="confirmPassword"
                                    type="password"
                                    placeholder="••••••••"
                                    value={formData.confirmPassword}
                                    onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                                    required
                                    className="bg-muted/50"
                                />
                            </div>

                            <Button type="submit" className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Create Recruiter Account"}
                            </Button>

                            <div className="text-center pt-4 border-t space-y-2">
                                <p className="text-sm text-muted-foreground">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-primary font-semibold hover:underline">
                                        Sign In
                                    </Link>
                                </p>
                                <p className="text-sm text-muted-foreground">
                                    Looking to join as candidate?{" "}
                                    <Link href="/register" className="text-blue-600 font-semibold hover:underline">
                                        Register here
                                    </Link>
                                </p>
                            </div>
                        </form>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
