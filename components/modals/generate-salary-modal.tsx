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
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus } from "lucide-react"

export default function GenerateSalaryModal({ onSubmit }: { onSubmit?: () => void }) {
    const [open, setOpen] = useState(false)
    const [employees, setEmployees] = useState<any[]>([])
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        employeeId: "",
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
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
        setLoading(true)
        try {
            const token = localStorage.getItem("authToken")
            const res = await fetch("/api/salary/generate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                alert("Payroll generated successfully")
                onSubmit?.()
                setOpen(false)
            } else {
                alert(data.message || "Failed to generate payroll")
            }
        } catch (error) {
            console.error("Generate payroll failed", error)
            alert("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2">
                    <Plus size={18} />
                    Generate Salary Slip
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Generate Salary Slip</DialogTitle>
                    <DialogDescription>Generate payroll for a specific employee and month</DialogDescription>
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
                            <Label htmlFor="month">Month</Label>
                            <Select
                                value={String(formData.month)}
                                onValueChange={(val) => setFormData({ ...formData, month: Number(val) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select month" />
                                </SelectTrigger>
                                <SelectContent>
                                    {Array.from({ length: 12 }, (_, i) => (
                                        <SelectItem key={i + 1} value={String(i + 1)}>
                                            {new Date(0, i).toLocaleString('default', { month: 'long' })}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="year">Year</Label>
                            <Select
                                value={String(formData.year)}
                                onValueChange={(val) => setFormData({ ...formData, year: Number(val) })}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select year" />
                                </SelectTrigger>
                                <SelectContent>
                                    {[2023, 2024, 2025, 2026].map((y) => (
                                        <SelectItem key={y} value={String(y)}>
                                            {y}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? "Generating..." : "Generate"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
