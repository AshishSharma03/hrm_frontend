"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Eye, EyeOff, Save, AlertCircle } from "lucide-react"

interface AccountConfigFormProps {
  platform: string
  onSave: (data: any) => void
}

export function AccountConfigForm({ platform, onSave }: AccountConfigFormProps) {
  const [showSecrets, setShowSecrets] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    username: "",
    apiKey: "",
    clientId: "",
    clientSecret: "",
    webhookUrl: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  const platformConfigs: Record<string, any> = {
    linkedin: {
      title: "LinkedIn Configuration",
      description: "Connect your LinkedIn Recruiter account",
      fields: [
        { name: "name", label: "Configuration Name", type: "text", required: true },
        { name: "clientId", label: "Client ID", type: "password", required: true },
        { name: "clientSecret", label: "Client Secret", type: "password", required: true },
        { name: "webhookUrl", label: "Webhook URL", type: "url", required: false },
      ],
    },
    naukri: {
      title: "Naukri.com Configuration",
      description: "Connect your Naukri account for job posting and recruitment",
      fields: [
        { name: "name", label: "Configuration Name", type: "text", required: true },
        { name: "username", label: "Username", type: "text", required: true },
        { name: "apiKey", label: "API Key", type: "password", required: true },
        { name: "webhookUrl", label: "Webhook URL", type: "url", required: false },
      ],
    },
    indeed: {
      title: "Indeed Configuration",
      description: "Connect your Indeed Employer account",
      fields: [
        { name: "name", label: "Configuration Name", type: "text", required: true },
        { name: "clientId", label: "Client ID", type: "password", required: true },
        { name: "clientSecret", label: "Client Secret", type: "password", required: true },
      ],
    },
    "google-drive": {
      title: "Google Drive Configuration",
      description: "Connect Google Drive for document storage",
      fields: [
        { name: "name", label: "Configuration Name", type: "text", required: true },
        { name: "clientId", label: "Client ID", type: "password", required: true },
        { name: "clientSecret", label: "Client Secret", type: "password", required: true },
      ],
    },
    email: {
      title: "Email Configuration",
      description: "Configure email settings for notifications",
      fields: [
        { name: "name", label: "Configuration Name", type: "text", required: true },
        { name: "username", label: "SMTP Username", type: "text", required: true },
        { name: "apiKey", label: "SMTP Password", type: "password", required: true },
      ],
    },
  }

  const config = platformConfigs[platform]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      await new Promise((resolve) => setTimeout(resolve, 500)) // Mock API call
      onSave(formData)
      setFormData({
        name: "",
        username: "",
        apiKey: "",
        clientId: "",
        clientSecret: "",
        webhookUrl: "",
      })
    } catch (err) {
      setError("Failed to save configuration")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{config.title}</CardTitle>
        <CardDescription>{config.description}</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {config.fields.map((field: any) => (
            <div key={field.name} className="space-y-2">
              <Label htmlFor={field.name}>
                {field.label}
                {field.required && <span className="text-destructive ml-1">*</span>}
              </Label>
              <div className="relative">
                <Input
                  id={field.name}
                  type={field.type === "password" && showSecrets ? "text" : field.type}
                  placeholder={`Enter ${field.label.toLowerCase()}`}
                  value={formData[field.name as keyof typeof formData] || ""}
                  onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                  required={field.required}
                  className="bg-muted/50"
                />
                {field.type === "password" && (
                  <button
                    type="button"
                    onClick={() => setShowSecrets(!showSecrets)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  >
                    {showSecrets ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                )}
              </div>
            </div>
          ))}

          <Button type="submit" className="w-full" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save Configuration"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
