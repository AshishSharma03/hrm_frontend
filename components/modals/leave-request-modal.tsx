"use client"

import type React from "react"
import { useState } from "react"
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
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, Calendar, FileText } from "lucide-react"

export default function LeaveRequestModal({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const { user } = useAuth()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState({
    leaveType: "",
    startDate: "",
    endDate: "",
    numberOfDays: "",
    reason: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("/api/leave/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          employeeId: user?.id,
          leaveType: formData.leaveType,
          startDate: formData.startDate,
          endDate: formData.endDate,
          reason: formData.reason,
          totalDays: Number(formData.numberOfDays)
        })
      })
      const data = await res.json()
      if (data.success) {
        if (onSubmit) onSubmit(data.data)
        setFormData({
          leaveType: "",
          startDate: "",
          endDate: "",
          numberOfDays: "",
          reason: "",
        })
        setOpen(false)
      } else {
        alert(data.message || "Failed to submit request")
      }
    } catch (error) {
      console.error("Leave request failed", error)
      alert("An error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="flex items-center gap-2 bg-transparent">
          <Plus size={18} />
          Request Leave
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Request Leave</DialogTitle>
          <DialogDescription>Submit your leave request for approval</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="leaveType">Leave Type</Label>
            <Select value={formData.leaveType} onValueChange={(val) => setFormData({ ...formData, leaveType: val })}>
              <SelectTrigger>
                <SelectValue placeholder="Select leave type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="casual">Casual Leave</SelectItem>
                <SelectItem value="sick">Sick Leave</SelectItem>
                <SelectItem value="annual">Annual Leave</SelectItem>
                <SelectItem value="personal">Personal Leave</SelectItem>
                <SelectItem value="unpaid">Unpaid Leave</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="startDate" className="flex items-center gap-2">
                <Calendar size={16} />
                Start Date
              </Label>
              <Input
                id="startDate"
                type="date"
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="endDate" className="flex items-center gap-2">
                <Calendar size={16} />
                End Date
              </Label>
              <Input
                id="endDate"
                type="date"
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="numberOfDays">Number of Days</Label>
            <Input
              id="numberOfDays"
              type="number"
              placeholder="0"
              value={formData.numberOfDays}
              onChange={(e) => setFormData({ ...formData, numberOfDays: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason" className="flex items-center gap-2">
              <FileText size={16} />
              Reason
            </Label>
            <Textarea
              id="reason"
              placeholder="Provide reason for leave (optional)"
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Submit Request
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
