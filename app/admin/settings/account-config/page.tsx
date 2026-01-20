"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { AccountConfigForm } from "@/components/account-config-form"
import { MoreVertical, Trash2, Edit2 } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

export default function AccountConfigPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [configs, setConfigs] = useState<any[]>([])
  const [activeTab, setActiveTab] = useState("linkedin")

  if (loading) {
    return <div className="text-center py-12">Loading...</div>
  }

  if (!user || user.role !== "admin") {
    router.push("/login")
    return null
  }

  const handleSaveConfig = (data: any) => {
    const newConfig = {
      id: Math.random().toString(),
      platform: activeTab,
      ...data,
      isActive: true,
      createdAt: new Date().toISOString(),
    }
    setConfigs([...configs, newConfig])
  }

  const handleDeleteConfig = (id: string) => {
    setConfigs(configs.filter((c) => c.id !== id))
  }

  const platformConfigs = configs.filter((c) => c.platform === activeTab)

  return (
    <div className="min-h-screen bg-background p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-foreground">Account Configuration</h1>
          <p className="text-muted-foreground mt-2">Manage integrations with external platforms</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="linkedin">LinkedIn</TabsTrigger>
            <TabsTrigger value="naukri">Naukri</TabsTrigger>
            <TabsTrigger value="indeed">Indeed</TabsTrigger>
            <TabsTrigger value="google-drive">Google Drive</TabsTrigger>
            <TabsTrigger value="email">Email</TabsTrigger>
          </TabsList>

          {["linkedin", "naukri", "indeed", "google-drive", "email"].map((platform) => (
            <TabsContent key={platform} value={platform} className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <AccountConfigForm platform={platform} onSave={handleSaveConfig} />

                <div className="space-y-4">
                  <Card>
                    <CardHeader>
                      <CardTitle>Connected Accounts</CardTitle>
                      <CardDescription>
                        {platformConfigs.length} configuration{platformConfigs.length !== 1 ? "s" : ""}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {platformConfigs.length === 0 ? (
                        <p className="text-sm text-muted-foreground">No configurations yet</p>
                      ) : (
                        platformConfigs.map((config) => (
                          <div
                            key={config.id}
                            className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                          >
                            <div className="flex-1">
                              <p className="font-medium text-sm">{config.name}</p>
                              <p className="text-xs text-muted-foreground">
                                Created {new Date(config.createdAt).toLocaleDateString()}
                              </p>
                            </div>
                            <div className="flex items-center gap-2">
                              <Badge variant="outline" className={config.isActive ? "bg-green-50" : "bg-gray-50"}>
                                {config.isActive ? "Active" : "Inactive"}
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <MoreVertical className="h-4 w-4" />
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="end">
                                  <DropdownMenuItem>
                                    <Edit2 className="h-4 w-4 mr-2" />
                                    Edit
                                  </DropdownMenuItem>
                                  <DropdownMenuItem
                                    className="text-destructive"
                                    onClick={() => handleDeleteConfig(config.id)}
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
                    </CardContent>
                  </Card>
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </div>
  )
}
