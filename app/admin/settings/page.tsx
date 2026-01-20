"use client"

import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Settings, Shield, Mail, Link2, FileText } from "lucide-react"
import Link from "next/link"

export default function AdminSettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    router.push("/login")
    return null
  }

  const settingsSections = [
    {
      id: "account",
      title: "Account Configuration",
      description: "Manage LinkedIn, Naukri, Indeed, Google Drive integrations",
      icon: Link2,
      href: "/admin/settings/account-config",
      color: "bg-blue-50 text-blue-600",
    },
    {
      id: "templates",
      title: "Template Management",
      description: "Create and manage offer letters, certificates, exit letters",
      icon: FileText,
      href: "/admin/settings/templates",
      color: "bg-purple-50 text-purple-600",
    },
    {
      id: "email",
      title: "Email Configuration",
      description: "Configure SMTP and email notification settings",
      icon: Mail,
      href: "/admin/settings/email",
      color: "bg-orange-50 text-orange-600",
    },
    {
      id: "security",
      title: "Security Settings",
      description: "Manage user roles, permissions, and access control",
      icon: Shield,
      href: "/admin/settings/security",
      color: "bg-red-50 text-red-600",
    },
  ]

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Settings className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-foreground">Admin Settings</h1>
          </div>
          <p className="text-muted-foreground">Manage system configurations, integrations, and templates</p>
        </div>

        {/* Settings Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          {settingsSections.map((section) => {
            const Icon = section.icon
            return (
              <Link key={section.id} href={section.href}>
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className={`p-3 rounded-lg ${section.color}`}>
                        <Icon className="h-6 w-6" />
                      </div>
                    </div>
                    <CardTitle className="mt-4">{section.title}</CardTitle>
                    <CardDescription>{section.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button variant="outline" className="w-full bg-transparent" asChild>
                      <span>Configure</span>
                    </Button>
                  </CardContent>
                </Card>
              </Link>
            )
          })}
        </div>

        {/* Quick Overview */}
        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList>
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="integrations">Integrations</TabsTrigger>
            <TabsTrigger value="system">System</TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>System Overview</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Active Integrations</p>
                    <p className="text-2xl font-bold">5</p>
                    <p className="text-xs text-muted-foreground mt-1">LinkedIn, Naukri, Indeed, Google Drive, Email</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">Document Templates</p>
                    <p className="text-2xl font-bold">0</p>
                    <p className="text-xs text-muted-foreground mt-1">Configure templates in Template Management</p>
                  </div>
                  <div className="p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground mb-1">System Status</p>
                    <p className="text-2xl font-bold text-green-600">Active</p>
                    <p className="text-xs text-muted-foreground mt-1">All systems operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integrations">
            <Card>
              <CardHeader>
                <CardTitle>Integration Status</CardTitle>
                <CardDescription>Status of all configured integrations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {[
                    { name: "LinkedIn Recruiter", status: "not_configured", icon: "💼" },
                    { name: "Naukri.com", status: "not_configured", icon: "🔍" },
                    { name: "Indeed", status: "not_configured", icon: "📋" },
                    { name: "Google Drive", status: "not_configured", icon: "☁️" },
                    { name: "SMTP Email", status: "not_configured", icon: "📧" },
                  ].map((integration) => (
                    <div
                      key={integration.name}
                      className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-xl">{integration.icon}</span>
                        <div>
                          <p className="font-medium text-sm">{integration.name}</p>
                          <p className="text-xs text-muted-foreground capitalize">
                            {integration.status.replace("_", " ")}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-xs font-medium ${
                          integration.status === "configured"
                            ? "bg-green-100 text-green-700"
                            : "bg-yellow-100 text-yellow-700"
                        }`}
                      >
                        {integration.status === "configured" ? "Connected" : "Not Set Up"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="system">
            <Card>
              <CardHeader>
                <CardTitle>System Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">System Version</p>
                    <p className="font-medium">1.0.0</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Last Updated</p>
                    <p className="font-medium">{new Date().toLocaleDateString()}</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Database Status</p>
                    <p className="font-medium text-green-600">Connected</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">API Status</p>
                    <p className="font-medium text-green-600">Operational</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
