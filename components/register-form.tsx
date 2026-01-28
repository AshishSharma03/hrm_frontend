"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle, Loader2, ArrowRight } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import Link from "next/link"

export default function RegisterForm() {
    const [formData, setFormData] = useState({
        name: "",
        email: "",
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState("")
    const [success, setSuccess] = useState(false)
    const router = useRouter()

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError("")
        setLoading(true)

        try {
            const response = await fetch("/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: formData.name,
                    email: formData.email,
                    role: "candidate"
                }),
            })

            const data = await response.json()

            if (!response.ok) {
                throw new Error(data.message || "Registration failed")
            }

            setSuccess(true)
            setTimeout(() => {
                router.push("/login")
            }, 3000)

        } catch (err) {
            setError(err instanceof Error ? err.message : "Registration failed")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-secondary/5 p-4">
            <Card className="w-full max-w-md shadow-xl border-t-4 border-t-primary">
                <CardHeader className="text-center pb-2">
                    <div className="flex justify-center mb-4">
                        <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl">
                            HR
                        </div>
                    </div>
                    <CardTitle className="text-2xl font-bold">Join as Candidate</CardTitle>
                    <CardDescription>Create an account to start your onboarding</CardDescription>
                </CardHeader>
                <CardContent>
                    {success ? (
                        <div className="text-center py-8 space-y-4">
                            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center text-green-600 mx-auto">
                                <ArrowRight size={32} />
                            </div>
                            <p className="font-semibold text-green-700">Account created successfully!</p>
                            <p className="text-sm text-muted-foreground italic">Check your email for the password.</p>
                            <p className="text-xs text-muted-foreground pt-4">Redirecting you to login...</p>
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
                                <Label htmlFor="email">Email Address</Label>
                                <Input
                                    id="email"
                                    type="email"
                                    placeholder="name@example.com"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    required
                                    className="bg-muted/50"
                                />
                            </div>

                            <Alert className="bg-blue-50 border-blue-200">
                                <AlertDescription className="text-xs text-blue-700">
                                    Note: A secure password will be generated and sent to your email address upon registration.
                                </AlertDescription>
                            </Alert>

                            <Button type="submit" className="w-full py-6 text-lg" disabled={loading}>
                                {loading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : "Register as Candidate"}
                            </Button>

                            <div className="text-center pt-4 border-t">
                                <p className="text-sm text-muted-foreground">
                                    Already have an account?{" "}
                                    <Link href="/login" className="text-primary font-semibold hover:underline">
                                        Sign In
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
