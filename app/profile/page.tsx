"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, Mail, Phone, Briefcase, Calendar } from "lucide-react"

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login")
    }
  }, [loading, user, router])

  if (loading) return <div className="flex items-center justify-center min-h-screen">Loading...</div>
  if (!user) return null

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <main className="md:ml-64 md:mt-24 p-4 md:p-8 mt-32">
      <div className="max-w-4xl">
        {/* Profile Header Card */}
        <Card className="mb-8 border-0 shadow-lg">
          <CardContent className="pt-8 pb-6">
            <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
              <div className="flex flex-col items-center md:items-start gap-4">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center md:text-left">
                  <h1 className="text-2xl font-bold text-foreground">{user.name}</h1>
                  <p className="text-muted-foreground capitalize">{user.role}</p>
                </div>
              </div>
              <div className="flex-1 grid grid-cols-2 gap-4 w-full md:ml-auto">
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Email</p>
                  <p className="text-sm font-medium truncate">{user.email}</p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <p className="text-xs text-muted-foreground mb-1">Role</p>
                  <p className="text-sm font-medium capitalize">{user.role}</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Personal Information */}
        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User size={20} />
              Personal Information
            </CardTitle>
            <CardDescription>View and manage your personal details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>First Name</Label>
                <Input value={user.name.split(" ")[0]} disabled />
              </div>
              <div className="space-y-2">
                <Label>Last Name</Label>
                <Input value={user.name.split(" ").slice(1).join(" ")} disabled />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Mail size={16} />
                  Email Address
                </Label>
                <Input value={user.email} disabled />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Phone size={16} />
                  Phone Number
                </Label>
                <Input placeholder="+1 (555) 000-0000" disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Information */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Briefcase size={20} />
              Professional Information
            </CardTitle>
            <CardDescription>Your role and employment details</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Role</Label>
                <Input value={user.role.charAt(0).toUpperCase() + user.role.slice(1)} disabled />
              </div>
              <div className="space-y-2">
                <Label>Department</Label>
                <Input value="Human Resources" disabled />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Designation</Label>
                <Input value="Administrator" disabled />
              </div>
              <div className="space-y-2">
                <Label className="flex items-center gap-2">
                  <Calendar size={16} />
                  Join Date
                </Label>
                <Input value={new Date().toLocaleDateString()} disabled />
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="mt-8 flex gap-3">
          <Button variant="outline" className="flex-1 bg-transparent">
            Change Password
          </Button>
          <Button className="flex-1">Save Changes</Button>
        </div>
      </div>
    </main>
  )
}
