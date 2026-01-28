"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "@/lib/auth-context"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Edit2 } from "lucide-react"

export default function EditProfileModal({
  userEmail = "",
  onSubmit,
}: { userEmail?: string; onSubmit?: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    address: "",
    city: "",
    bloodGroup: "",
    emergencyContact: "",
  })

  const { user } = useAuth()

  useEffect(() => {
    if (open && user?.id) {
      const fetchProfile = async () => {
        try {
          const token = localStorage.getItem("authToken")
          const targetId = (user as any)?.employeeId || user?.id
          const res = await fetch(`/api/employees/${targetId}`, {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await res.json()
          if (data.success && data.data) {
            setFormData({
              firstName: data.data.firstName || "",
              lastName: data.data.lastName || "",
              phone: data.data.phone || "",
              address: data.data.address || "",
              city: data.data.city || "",
              bloodGroup: data.data.bloodGroup || "",
              emergencyContact: data.data.emergencyContact || "",
            })
          } else {
            // If profile is missing, try to pre-populate with name from user context if available
            const nameParts = user?.name?.split(' ') || []
            setFormData(prev => ({
              ...prev,
              firstName: prev.firstName || nameParts[0] || "",
              lastName: prev.lastName || nameParts.slice(1).join(' ') || ""
            }))
          }
        } catch (error) {
          console.error("Failed to fetch profile", error)
        }
      }
      fetchProfile()
    }
  }, [open, user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("authToken")
      const targetId = (user as any)?.employeeId || user?.id
      const res = await fetch(`/api/employees/${targetId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      })
      const data = await res.json()
      if (data.success) {
        onSubmit?.(data.data)
        setOpen(false)
      } else {
        alert(data.message || "Failed to update profile")
      }
    } catch (error) {
      console.error("Profile update failed", error)
      alert("An error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2 w-full bg-transparent" variant="outline">
          <Edit2 size={16} />
          Edit Profile
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Your Profile</DialogTitle>
          <DialogDescription>Update your personal information</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name</Label>
              <Input
                id="firstName"
                placeholder="John"
                value={formData.firstName}
                onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name</Label>
              <Input
                id="lastName"
                placeholder="Doe"
                value={formData.lastName}
                onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="address">Address</Label>
              <Input
                id="address"
                placeholder="Street address"
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="city">City</Label>
              <Input
                id="city"
                placeholder="New York"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="pinCode">Pin Code</Label>
              <Input
                id="pinCode"
                placeholder="110001"
                value={(formData as any).pinCode || ""}
                onChange={(e) => setFormData({ ...formData, pinCode: e.target.value } as any)}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="bloodGroup">Blood Group</Label>
              <Input
                id="bloodGroup"
                placeholder="O+"
                value={formData.bloodGroup}
                onChange={(e) => setFormData({ ...formData, bloodGroup: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="emergencyContact">Emergency Contact</Label>
              <Input
                id="emergencyContact"
                placeholder="+91 98765 43210"
                value={formData.emergencyContact}
                onChange={(e) => setFormData({ ...formData, emergencyContact: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Save Changes
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
