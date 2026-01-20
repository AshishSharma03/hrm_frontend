"use client"

import type React from "react"
import { useState } from "react"
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

export default function ExitRequestModal({
  employeeId,
  employeeName,
  onSubmit,
}: { employeeId?: string; employeeName?: string; onSubmit?: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const [formData, setFormData] = useState({
    exitDate: "",
    reason: "",
    noticePeriod: "",
    fullAndFinal: "pending",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    try {
      if (!formData.exitDate || !formData.reason || !formData.noticePeriod) {
        throw new Error("Please fill all required fields")
      }

      // Call the onSubmit callback
      if (onSubmit) {
        await Promise.resolve(onSubmit({ ...formData, employeeId }))
      }

      // Reset form
      setFormData({
        exitDate: "",
        reason: "",
        noticePeriod: "",
        fullAndFinal: "pending",
      })
      setOpen(false)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to process exit request")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          View Details
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Exit Request - {employeeName}</DialogTitle>
          <DialogDescription>Process employee exit and offboarding</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="exitDate">Exit Date</Label>
              <Input
                id="exitDate"
                type="date"
                value={formData.exitDate}
                onChange={(e) => setFormData({ ...formData, exitDate: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="noticePeriod">Notice Period</Label>
              <Select
                value={formData.noticePeriod}
                onValueChange={(val) => setFormData({ ...formData, noticePeriod: val })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select notice period" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 Days</SelectItem>
                  <SelectItem value="30">30 Days</SelectItem>
                  <SelectItem value="45">45 Days</SelectItem>
                  <SelectItem value="60">60 Days</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Reason for Exit</Label>
            <Textarea
              id="reason"
              placeholder="Reason for exit..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="min-h-24"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="fullAndFinal">Full and Final Status</Label>
            <Select
              value={formData.fullAndFinal}
              onValueChange={(val) => setFormData({ ...formData, fullAndFinal: val })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="approved">Approved</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Processing..." : "Process Exit"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
