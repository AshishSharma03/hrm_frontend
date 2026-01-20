"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Shield } from "lucide-react"
import { MoreVertical } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function SecuritySettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    router.push("/login")
    return null
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Security Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage user roles, permissions, and access control</p>
        </div>

        <Tabs defaultValue="roles" className="space-y-6">
          <TabsList>
            <TabsTrigger value="roles">User Roles</TabsTrigger>
            <TabsTrigger value="permissions">Permissions</TabsTrigger>
            <TabsTrigger value="activity">Activity Log</TabsTrigger>
            <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          </TabsList>

          <TabsContent value="roles" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>User Roles</CardTitle>
                <CardDescription>Manage roles and access levels</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                {[
                  {
                    name: "Admin",
                    description: "Full system access",
                    users: 2,
                    permissions: "All",
                  },
                  {
                    name: "Recruiter",
                    description: "Recruitment and hiring management",
                    users: 5,
                    permissions: "Job Posting, Candidate Management",
                  },
                  {
                    name: "Employee",
                    description: "Employee self-service",
                    users: 45,
                    permissions: "Personal Dashboard, Leave Management",
                  },
                  {
                    name: "Candidate",
                    description: "Job applicants",
                    users: 230,
                    permissions: "Job View, Application",
                  },
                ].map((role) => (
                  <div key={role.name} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <p className="font-medium">{role.name}</p>
                      <p className="text-sm text-muted-foreground mb-2">{role.description}</p>
                      <p className="text-xs text-muted-foreground">
                        {role.users} users • {role.permissions}
                      </p>
                    </div>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem>Edit Role</DropdownMenuItem>
                        <DropdownMenuItem>View Permissions</DropdownMenuItem>
                        <DropdownMenuItem>View Members</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="permissions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Permission Matrix</CardTitle>
                <CardDescription>Configure role-based access control</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium">Feature</th>
                        <th className="text-center py-3 px-4 font-medium">Admin</th>
                        <th className="text-center py-3 px-4 font-medium">Recruiter</th>
                        <th className="text-center py-3 px-4 font-medium">Employee</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { feature: "User Management", admin: true, recruiter: false, employee: false },
                        { feature: "Job Posting", admin: true, recruiter: true, employee: false },
                        { feature: "Candidate Management", admin: true, recruiter: true, employee: false },
                        { feature: "Leave Management", admin: true, recruiter: true, employee: true },
                        { feature: "Salary Management", admin: true, recruiter: false, employee: false },
                        { feature: "Exit Management", admin: true, recruiter: false, employee: true },
                        { feature: "Reports & Analytics", admin: true, recruiter: true, employee: false },
                        { feature: "Document Templates", admin: true, recruiter: false, employee: false },
                      ].map((row) => (
                        <tr key={row.feature} className="border-b hover:bg-muted/50">
                          <td className="py-3 px-4">{row.feature}</td>
                          <td className="text-center py-3 px-4">
                            {row.admin ? (
                              <span className="inline-block w-5 h-5 bg-green-100 text-green-700 rounded text-xs flex items-center justify-center">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-block w-5 h-5 bg-gray-100 rounded text-xs"></span>
                            )}
                          </td>
                          <td className="text-center py-3 px-4">
                            {row.recruiter ? (
                              <span className="inline-block w-5 h-5 bg-green-100 text-green-700 rounded text-xs flex items-center justify-center">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-block w-5 h-5 bg-gray-100 rounded text-xs"></span>
                            )}
                          </td>
                          <td className="text-center py-3 px-4">
                            {row.employee ? (
                              <span className="inline-block w-5 h-5 bg-green-100 text-green-700 rounded text-xs flex items-center justify-center">
                                ✓
                              </span>
                            ) : (
                              <span className="inline-block w-5 h-5 bg-gray-100 rounded text-xs"></span>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="activity" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Activity Log</CardTitle>
                <CardDescription>System activity and security events</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    {
                      action: "Admin logged in",
                      user: "admin@company.com",
                      time: "2 hours ago",
                      type: "login",
                    },
                    {
                      action: "Account config created",
                      user: "admin@company.com",
                      time: "1 hour ago",
                      type: "config",
                    },
                    {
                      action: "Template updated",
                      user: "admin@company.com",
                      time: "30 minutes ago",
                      type: "template",
                    },
                    {
                      action: "User role changed",
                      user: "recruiter@company.com",
                      time: "10 minutes ago",
                      type: "security",
                    },
                  ].map((log, idx) => (
                    <div
                      key={idx}
                      className="flex items-start justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.user}</p>
                      </div>
                      <p className="text-xs text-muted-foreground">{log.time}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sessions" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Sessions</CardTitle>
                <CardDescription>Monitor user sessions and devices</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { user: "Admin User", device: "Chrome on Windows", location: "Office", lastActive: "Now" },
                    { user: "Recruiter User", device: "Safari on MacOS", location: "Home", lastActive: "5 min ago" },
                    {
                      user: "Employee User",
                      device: "Chrome on Android",
                      location: "Mobile",
                      lastActive: "30 min ago",
                    },
                  ].map((session, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-sm">{session.user}</p>
                        <p className="text-xs text-muted-foreground">
                          {session.device} • {session.location}
                        </p>
                      </div>
                      <div className="flex items-center gap-3">
                        <p className="text-xs text-muted-foreground">{session.lastActive}</p>
                        <Button variant="outline" size="sm">
                          Revoke
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
