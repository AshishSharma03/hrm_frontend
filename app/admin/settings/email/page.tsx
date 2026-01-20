"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { AlertCircle, Save, Send } from "lucide-react"

export default function EmailSettingsPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    smtpHost: "",
    smtpPort: "587",
    smtpUser: "",
    smtpPassword: "",
    senderEmail: "",
    senderName: "HRMS Portal",
  })
  const [saved, setSaved] = useState(false)
  const [testing, setTesting] = useState(false)

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    router.push("/login")
    return null
  }

  const handleSave = async () => {
    await new Promise((resolve) => setTimeout(resolve, 500))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
  }

  const handleTestEmail = async () => {
    setTesting(true)
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setTesting(false)
  }

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Email Configuration</h1>
          <p className="text-muted-foreground mt-2">Configure SMTP settings for email notifications</p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>SMTP Settings</CardTitle>
              <CardDescription>Configure your email server for sending notifications</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {saved && (
                <Alert className="bg-green-50 border-green-200">
                  <AlertCircle className="h-4 w-4 text-green-600" />
                  <AlertDescription className="text-green-700">Settings saved successfully</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="smtpHost">SMTP Host</Label>
                  <Input
                    id="smtpHost"
                    placeholder="smtp.gmail.com"
                    value={formData.smtpHost}
                    onChange={(e) => setFormData({ ...formData, smtpHost: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="smtpPort">SMTP Port</Label>
                  <Input
                    id="smtpPort"
                    type="number"
                    placeholder="587"
                    value={formData.smtpPort}
                    onChange={(e) => setFormData({ ...formData, smtpPort: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpUser">SMTP Username</Label>
                <Input
                  id="smtpUser"
                  placeholder="your-email@gmail.com"
                  value={formData.smtpUser}
                  onChange={(e) => setFormData({ ...formData, smtpUser: e.target.value })}
                  className="bg-muted/50"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="smtpPassword">SMTP Password</Label>
                <Input
                  id="smtpPassword"
                  type="password"
                  placeholder="••••••••"
                  value={formData.smtpPassword}
                  onChange={(e) => setFormData({ ...formData, smtpPassword: e.target.value })}
                  className="bg-muted/50"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="senderEmail">Sender Email</Label>
                  <Input
                    id="senderEmail"
                    type="email"
                    placeholder="noreply@company.com"
                    value={formData.senderEmail}
                    onChange={(e) => setFormData({ ...formData, senderEmail: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="senderName">Sender Name</Label>
                  <Input
                    id="senderName"
                    placeholder="HRMS Portal"
                    value={formData.senderName}
                    onChange={(e) => setFormData({ ...formData, senderName: e.target.value })}
                    className="bg-muted/50"
                  />
                </div>
              </div>

              <div className="flex gap-3">
                <Button onClick={handleSave} className="flex-1">
                  <Save className="mr-2 h-4 w-4" />
                  Save Settings
                </Button>
                <Button onClick={handleTestEmail} variant="outline" disabled={testing}>
                  <Send className="mr-2 h-4 w-4" />
                  {testing ? "Sending..." : "Send Test Email"}
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Email Templates</CardTitle>
              <CardDescription>Configure automatic email notifications</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { name: "Welcome Email", trigger: "User Registration", enabled: true },
                  { name: "Job Application Confirmation", trigger: "New Application", enabled: true },
                  { name: "Offer Letter", trigger: "Offer Created", enabled: false },
                  { name: "Interview Scheduled", trigger: "Interview Scheduled", enabled: true },
                  { name: "Exit Letter", trigger: "Exit Initiated", enabled: false },
                ].map((template) => (
                  <div key={template.name} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <p className="font-medium text-sm">{template.name}</p>
                      <p className="text-xs text-muted-foreground">{template.trigger}</p>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        template.enabled ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"
                      }`}
                    >
                      {template.enabled ? "Enabled" : "Disabled"}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
