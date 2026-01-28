"use client"

import type React from "react"
import { useState, useEffect } from "react"
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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Plus } from "lucide-react"

export default function AwardPointsModal({ onSubmit }: { onSubmit?: () => void }) {
  const [open, setOpen] = useState(false)
  const [employees, setEmployees] = useState<any[]>([])
  const [formData, setFormData] = useState({
    employeeId: "",
    points: 0,
    category: "Performance Bonus",
    reason: "",
  })

  useEffect(() => {
    if (open) {
      const fetchEmployees = async () => {
        try {
          const token = localStorage.getItem("authToken")
          const res = await fetch("/api/employees", {
            headers: { Authorization: `Bearer ${token}` }
          })
          const data = await res.json()
          if (data.success) {
            setEmployees(data.data)
          }
        } catch (error) {
          console.error("Failed to fetch employees", error)
        }
      }
      fetchEmployees()
    }
  }, [open])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const token = localStorage.getItem("authToken")
      const res = await fetch("/api/rewards/award", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          ...formData,
          awardedBy: "ADMIN"
        })
      })
      const data = await res.json()
      if (data.success) {
        onSubmit?.()
        setFormData({
          employeeId: "",
          points: 0,
          category: "Performance Bonus",
          reason: "",
        })
        setOpen(false)
      } else {
        alert(data.message || "Failed to award points")
      }
    } catch (error) {
      console.error("Award points failed", error)
      alert("An error occurred")
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          Award Points
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Award Reward Points</DialogTitle>
          <DialogDescription>Select an employee and award points</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="employee">Select Employee</Label>
            <Select
              value={formData.employeeId}
              onValueChange={(val) => setFormData({ ...formData, employeeId: val })}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Select employee" />
              </SelectTrigger>
              <SelectContent>
                {employees.map((emp) => (
                  <SelectItem key={emp.id} value={emp.id}>
                    {emp.name || `${emp.firstName} ${emp.lastName}`} ({emp.id})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select
                value={formData.category}
                onValueChange={(val) => setFormData({ ...formData, category: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Performance Bonus">Performance Bonus</SelectItem>
                  <SelectItem value="Attendance Reward">Attendance Reward</SelectItem>
                  <SelectItem value="Employee Referral">Employee Referral</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="points">Points</Label>
              <Input
                id="points"
                type="number"
                placeholder="100"
                value={formData.points}
                onChange={(e) => setFormData({ ...formData, points: Number(e.target.value) })}
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason</Label>
            <Textarea
              id="reason"
              placeholder="Reason for awarding points..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              required
            />
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" className="flex-1">
              Award
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
