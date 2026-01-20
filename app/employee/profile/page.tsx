"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Mail, Phone, Calendar, Briefcase } from "lucide-react"

export default function EmployeeProfilePage() {
  const { user, loading, userRole } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && (!user || userRole !== "employee")) {
      router.push("/login")
    }
  }, [loading, user, userRole, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Card */}
        <Card className="lg:col-span-1">
          <CardContent className="pt-6 text-center">
            <div className="w-20 h-20 bg-gradient-to-br from-primary to-secondary rounded-full mx-auto mb-4 flex items-center justify-center text-white font-bold text-2xl">
              JD
            </div>
            <h2 className="text-xl font-bold mb-1">{user?.name}</h2>
            <p className="text-muted-foreground mb-4">{user?.email}</p>
            <Button className="w-full">Edit Profile</Button>
          </CardContent>
        </Card>

        {/* Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Personal Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Mail size={16} />
                  Email
                </p>
                <p className="font-semibold">{user?.email}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Phone size={16} />
                  Phone
                </p>
                <p className="font-semibold">+91 98765 43210</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Briefcase size={16} />
                  Designation
                </p>
                <p className="font-semibold">Senior Developer</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm text-muted-foreground flex items-center gap-2">
                  <Calendar size={16} />
                  Date of Joining
                </p>
                <p className="font-semibold">2022-01-15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Salary Information */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Salary Information</CardTitle>
            <CardDescription>Read-only information</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Monthly Salary</p>
                <p className="text-2xl font-bold">₹90,000</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Annual Salary</p>
                <p className="text-2xl font-bold">₹10,80,000</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Bank Name</p>
                <p className="text-lg font-semibold">HDFC Bank</p>
              </div>
              <div className="p-4 bg-muted rounded-lg">
                <p className="text-xs text-muted-foreground mb-1">Account Status</p>
                <p className="text-lg font-semibold text-green-600">Active</p>
              </div>
            </div>
          </CardContent>
        </Card>
        </div>
    </main>
  )
}
