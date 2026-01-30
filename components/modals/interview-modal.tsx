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
import { Plus, Calendar, Clock, MapPin, Video, Phone, User } from "lucide-react"

export default function ScheduleInterviewModal({ onSubmit }: { onSubmit?: (data: any) => void }) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")

  // Data for selects
  const [jobs, setJobs] = useState<any[]>([])
  const [employees, setEmployees] = useState<any[]>([])

  const [formData, setFormData] = useState({
    candidateEmail: "",
    candidateId: "",
    jobId: "",
    interviewerId: "", // Handles single selection, will convert to array for backend
    date: "",
    time: "",
    duration: "30",
    type: "video",
    location: "",
  })

  useEffect(() => {
    if (open) {
      fetchOptions()
    }
  }, [open])

  const fetchOptions = async () => {
    try {
      const token = localStorage.getItem("authToken")
      const headers = { Authorization: `Bearer ${token}` }

      const [jobsRes, empRes] = await Promise.all([
        fetch("/api/jobs?status=active", { headers }),
        fetch("/api/employees", { headers })
      ])

      const jobsData = await jobsRes.json()
      const empData = await empRes.json()

      if (jobsData.success) setJobs(jobsData.data)
      if (empData.success) setEmployees(empData.data)

    } catch (err) {
      console.error("Failed to fetch options", err)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError("")
    setLoading(true)

    // Basic Validation
    if (!formData.candidateEmail || !formData.candidateId || !formData.jobId || !formData.interviewerId || !formData.date || !formData.time || !formData.location) {
      setError("Please fill all required fields")
      setLoading(false)
      return
    }

    try {
      const token = localStorage.getItem("authToken")
      const payload = {
        candidateId: formData.candidateId,
        candidateEmail: formData.candidateEmail,
        interviewerIds: [formData.interviewerId], // Backend expects array
        date: formData.date,
        time: formData.time,
        duration: `${formData.duration} mins`,
        type: formData.type,
        location: formData.location,
        jobId: formData.jobId
      }

      const res = await fetch("/api/interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      })

      const data = await res.json()

      if (data.success) {
        if (onSubmit) onSubmit(data.data)
        setOpen(false)
        setFormData({
          candidateEmail: "",
          candidateId: "",
          jobId: "",
          interviewerId: "",
          date: "",
          time: "",
          duration: "30",
          type: "video",
          location: "",
        })
      } else {
        setError(data.message || "Failed to schedule interview")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to schedule interview")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex items-center gap-2">
          <Plus size={18} />
          Schedule Interview
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Schedule Interview</DialogTitle>
          <DialogDescription>Schedule a new interview with a candidate</DialogDescription>
        </DialogHeader>

        {error && (
          <div className="bg-red-50 dark:bg-red-950 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 p-3 rounded-md text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="candidateEmail">Candidate Email</Label>
              <Input
                id="candidateEmail"
                type="email"
                placeholder="candidate@example.com"
                value={formData.candidateEmail}
                onChange={(e) => setFormData({ ...formData, candidateEmail: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="candidateId">Candidate ID / Ref</Label>
              <Input
                id="candidateId"
                placeholder="C-12345"
                value={formData.candidateId}
                onChange={(e) => setFormData({ ...formData, candidateId: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="jobId">Job Position</Label>
              <Select value={formData.jobId} onValueChange={(val) => setFormData({ ...formData, jobId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Job" />
                </SelectTrigger>
                <SelectContent>
                  {jobs.map(job => (
                    <SelectItem key={job.id} value={job.id}>{job.jobTitle}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="interviewerId">Interviewer</Label>
              <Select value={formData.interviewerId} onValueChange={(val) => setFormData({ ...formData, interviewerId: val })}>
                <SelectTrigger>
                  <SelectValue placeholder="Select Interviewer" />
                </SelectTrigger>
                <SelectContent>
                  {employees.map(emp => (
                    <SelectItem key={emp.id} value={emp.id}>{emp.name || `${emp.firstName} ${emp.lastName}`}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="date" className="flex items-center gap-2">
                <Calendar size={16} /> Date
              </Label>
              <Input
                id="date"
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="time" className="flex items-center gap-2">
                <Clock size={16} /> Time
              </Label>
              <Input
                id="time"
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Duration</Label>
              <Select value={formData.duration} onValueChange={(val) => setFormData({ ...formData, duration: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 mins</SelectItem>
                  <SelectItem value="30">30 mins</SelectItem>
                  <SelectItem value="45">45 mins</SelectItem>
                  <SelectItem value="60">1 Hour</SelectItem>
                  <SelectItem value="90">1.5 Hours</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={formData.type} onValueChange={(val) => setFormData({ ...formData, type: val })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="video">Video Call</SelectItem>
                  <SelectItem value="phone">Phone Call</SelectItem>
                  <SelectItem value="in-person">In Person</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Location / Link</Label>
              <Input
                placeholder={formData.type === 'video' ? "Meet Link" : "Office Address/Room"}
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
              Cancel
            </Button>
            <Button type="submit" className="flex-1" disabled={loading}>
              {loading ? "Scheduling..." : "Schedule"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
