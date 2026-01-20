"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Save, AlertCircle } from "lucide-react"

interface TemplateEditorProps {
  templateId?: string
  onSave: (template: any) => void
}

const TEMPLATE_TYPES = [
  { value: "offer_letter", label: "Offer Letter" },
  { value: "certificate", label: "Certificate" },
  { value: "exit_letter", label: "Exit Letter" },
  { value: "job_posting", label: "Job Posting" },
  { value: "appointment", label: "Appointment Letter" },
]

const AVAILABLE_VARIABLES: Record<string, string[]> = {
  offer_letter: ["{{candidateName}}", "{{position}}", "{{salary}}", "{{startDate}}", "{{company}}"],
  certificate: ["{{employeeName}}", "{{department}}", "{{endDate}}", "{{duration}}"],
  exit_letter: ["{{employeeName}}", "{{lastDay}}", "{{department}}", "{{designation}}"],
  job_posting: ["{{jobTitle}}", "{{department}}", "{{salary}}", "{{experience}}", "{{deadline}}"],
  appointment: ["{{employeeName}}", "{{designation}}", "{{startDate}}", "{{department}}"],
}

export function TemplateEditor({ templateId, onSave }: TemplateEditorProps) {
  const [formData, setFormData] = useState({
    name: "",
    type: "",
    content: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [preview, setPreview] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.name || !formData.type || !formData.content) {
        throw new Error("All fields are required")
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
      onSave(formData)
      setFormData({ name: "", type: "", content: "" })
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to save template")
    } finally {
      setLoading(false)
    }
  }

  const currentVariables = AVAILABLE_VARIABLES[formData.type as keyof typeof AVAILABLE_VARIABLES] || []

  return (
    <Card>
      <CardHeader>
        <CardTitle>Template Editor</CardTitle>
        <CardDescription>Create and manage document templates with variable placeholders</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Template Name</Label>
              <Input
                id="name"
                placeholder="e.g., Standard Offer Letter"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-muted/50"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Template Type</Label>
              <Select value={formData.type} onValueChange={(value) => setFormData({ ...formData, type: value })}>
                <SelectTrigger className="bg-muted/50">
                  <SelectValue placeholder="Select type" />
                </SelectTrigger>
                <SelectContent>
                  {TEMPLATE_TYPES.map((type) => (
                    <SelectItem key={type.value} value={type.value}>
                      {type.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="content">Template Content</Label>
              <Button type="button" variant="outline" size="sm" onClick={() => setPreview(!preview)}>
                {preview ? "Edit" : "Preview"}
              </Button>
            </div>
            <Textarea
              id="content"
              placeholder="Write your template content here. Use variables like {{variableName}}"
              value={formData.content}
              onChange={(e) => setFormData({ ...formData, content: e.target.value })}
              rows={10}
              className="bg-muted/50 font-mono"
            />
          </div>

          {formData.type && currentVariables.length > 0 && (
            <div className="p-3 bg-muted rounded-lg">
              <p className="text-sm font-semibold mb-2">Available Variables:</p>
              <div className="flex flex-wrap gap-2">
                {currentVariables.map((variable) => (
                  <button
                    key={variable}
                    type="button"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        content: formData.content + variable,
                      })
                    }}
                    className="px-2 py-1 bg-primary/10 text-primary text-xs rounded hover:bg-primary/20 transition-colors"
                  >
                    {variable}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Button type="submit" className="w-full" disabled={loading}>
            <Save className="mr-2 h-4 w-4" />
            {loading ? "Saving..." : "Save Template"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
