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
import { Plus } from "lucide-react"
import { Checkbox } from "@/components/ui/checkbox"

const WORKING_DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

export default function CreatePolicyModal({ onSubmit }: { onSubmit?: () => void }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        name: "",
        type: "ROLE",
        entityId: "",
        rules: {
            requiredDailyHours: 9,
            maxIdleGapMinutes: 30,
            autoCheckoutAfterHours: 12,
            timezone: "Asia/Kolkata",
            workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
        }
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem("authToken")
            const res = await fetch("/api/attendance/policy", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                alert("Policy created successfully")
                onSubmit?.()
                setOpen(false)
                // Reset form
                setFormData({
                    name: "",
                    type: "ROLE",
                    entityId: "",
                    rules: {
                        requiredDailyHours: 9,
                        maxIdleGapMinutes: 30,
                        autoCheckoutAfterHours: 12,
                        timezone: "Asia/Kolkata",
                        workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday']
                    }
                })
            } else {
                alert(data.message || "Failed to create policy")
            }
        } catch (error) {
            console.error("Create policy failed", error)
            alert("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const toggleWorkingDay = (day: string) => {
        const currentDays = formData.rules.workingDays
        const newDays = currentDays.includes(day)
            ? currentDays.filter(d => d !== day)
            : [...currentDays, day]
        setFormData({
            ...formData,
            rules: { ...formData.rules, workingDays: newDays }
        })
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus size={18} />
                    Create Policy
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Attendance Policy</DialogTitle>
                    <DialogDescription>Define rules for attendance tracking</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Policy Name</Label>
                        <Input
                            id="name"
                            placeholder="e.g., Standard Employee Policy"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Policy Type</Label>
                            <Select
                                value={formData.type}
                                onValueChange={(val) => setFormData({ ...formData, type: val })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="ORGANIZATION">Organization</SelectItem>
                                    <SelectItem value="ROLE">Role</SelectItem>
                                    <SelectItem value="DEPARTMENT">Department</SelectItem>
                                    <SelectItem value="USER">User</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="entityId">Entity ID</Label>
                            <Input
                                id="entityId"
                                placeholder={formData.type === 'ROLE' ? 'e.g., employee' : 'Entity ID'}
                                value={formData.entityId}
                                onChange={(e) => setFormData({ ...formData, entityId: e.target.value })}
                            />
                        </div>
                    </div>

                    <div className="border-t pt-4">
                        <h4 className="font-semibold mb-3">Policy Rules</h4>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <Label htmlFor="reqHours">Required Daily Hours</Label>
                                <Input
                                    id="reqHours"
                                    type="number"
                                    min="1"
                                    max="24"
                                    value={formData.rules.requiredDailyHours}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        rules: { ...formData.rules, requiredDailyHours: Number(e.target.value) }
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="idleGap">Max Idle Gap (minutes)</Label>
                                <Input
                                    id="idleGap"
                                    type="number"
                                    min="5"
                                    max="120"
                                    value={formData.rules.maxIdleGapMinutes}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        rules: { ...formData.rules, maxIdleGapMinutes: Number(e.target.value) }
                                    })}
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 mb-4">
                            <div className="space-y-2">
                                <Label htmlFor="autoCheckout">Auto Checkout After (hours)</Label>
                                <Input
                                    id="autoCheckout"
                                    type="number"
                                    min="1"
                                    max="24"
                                    value={formData.rules.autoCheckoutAfterHours}
                                    onChange={(e) => setFormData({
                                        ...formData,
                                        rules: { ...formData.rules, autoCheckoutAfterHours: Number(e.target.value) }
                                    })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="timezone">Timezone</Label>
                                <Select
                                    value={formData.rules.timezone}
                                    onValueChange={(val) => setFormData({
                                        ...formData,
                                        rules: { ...formData.rules, timezone: val }
                                    })}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select timezone" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="Asia/Kolkata">Asia/Kolkata (IST)</SelectItem>
                                        <SelectItem value="America/New_York">America/New_York (EST)</SelectItem>
                                        <SelectItem value="Europe/London">Europe/London (GMT)</SelectItem>
                                        <SelectItem value="Asia/Singapore">Asia/Singapore (SGT)</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Working Days</Label>
                            <div className="flex flex-wrap gap-2">
                                {WORKING_DAYS.map((day) => (
                                    <div key={day} className="flex items-center space-x-2">
                                        <Checkbox
                                            id={day}
                                            checked={formData.rules.workingDays.includes(day)}
                                            onCheckedChange={() => toggleWorkingDay(day)}
                                        />
                                        <label htmlFor={day} className="text-sm cursor-pointer">
                                            {day.slice(0, 3)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? "Creating..." : "Create Policy"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
