"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TemplateEditor } from "@/components/template-editor"
import { MoreVertical, Trash2, Edit2, Eye } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

const TEMPLATE_TYPES = [
  { value: "offer_letter", label: "Offer Letter" },
  { value: "certificate", label: "Certificate" },
  { value: "exit_letter", label: "Exit Letter" },
  { value: "job_posting", label: "Job Posting" },
  { value: "appointment", label: "Appointment Letter" },
]

export default function TemplatesPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [templates, setTemplates] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("offer_letter")
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    router.push("/login")
    return null
  }

  const handleSaveTemplate = (template: any) => {
    const newTemplate = {
      id: Math.random().toString(),
      ...template,
      isActive: true,
      createdAt: new Date().toISOString(),
      createdBy: user.id,
    }
    setTemplates([...templates, newTemplate])
  }

  const handleDeleteTemplate = (id: string) => {
    setTemplates(templates.filter((t) => t.id !== id))
  }

  const filteredTemplates = templates.filter((t) => t.type === activeTab)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Template Management</h1>
          <p className="text-muted-foreground mt-2">Create and manage document templates</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2">
            <TemplateEditor onSave={handleSaveTemplate} />
          </div>

          <div className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Templates</CardTitle>
                <CardDescription>Manage your document templates</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs value={activeTab} onValueChange={setActiveTab} orientation="vertical" className="space-y-4">
                  <TabsList className="flex flex-col h-auto">
                    {TEMPLATE_TYPES.map((type) => (
                      <TabsTrigger key={type.value} value={type.value} className="justify-start">
                        {type.label}
                      </TabsTrigger>
                    ))}
                  </TabsList>

                  {TEMPLATE_TYPES.map((type) => (
                    <TabsContent key={type.value} value={type.value} className="space-y-3 mt-4">
                      {filteredTemplates.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No templates yet</p>
                      ) : (
                        filteredTemplates.map((template) => (
                          <div key={template.id} className="p-3 border rounded-lg hover:bg-muted/50 transition-colors">
                            <div className="flex items-start justify-between gap-2">
                              <div className="flex-1">
                                <p className="font-medium text-sm">{template.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {new Date(template.createdAt).toLocaleDateString()}
                                </p>
                              </div>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem onClick={() => setPreviewTemplate(template)}>
                                    <Eye className="h-4 w-4 mr-2" />
                                    Preview
                                  </DropdownMenuItem>
                                  <DropdownMenuItem>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteTemplate(template.id)}
                                  >
                                    <Trash2 className="h-4 w-4 mr-2" />
                                    Delete
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                          </div>
                        ))
                      )}
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>
        </div>

        {previewTemplate && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <Card className="w-full max-w-2xl max-h-96 overflow-y-auto">
              <CardHeader>
                <CardTitle>{previewTemplate.name}</CardTitle>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setPreviewTemplate(null)}
                  className="absolute top-4 right-4"
                >
                  ×
                </Button>
              </CardHeader>
              <CardContent>
                <div className="whitespace-pre-wrap font-mono text-sm bg-muted p-4 rounded">
                  {previewTemplate.content}
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  )
}
