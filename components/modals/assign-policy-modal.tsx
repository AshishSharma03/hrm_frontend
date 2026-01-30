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
import { UserPlus } from "lucide-react"

interface Policy {
    id: string
    name: string
}

interface Employee {
    id: string
    name?: string
    firstName?: string
    lastName?: string
    email: string
}

export default function AssignPolicyModal({ onSubmit }: { onSubmit?: () => void }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [policies, setPolicies] = useState<Policy[]>([])
    const [employees, setEmployees] = useState<Employee[]>([])
    const [formData, setFormData] = useState({
        policyId: "",
        entityId: "",
        type: "USER"
    })

    useEffect(() => {
        if (open) {
            fetchData()
        }
    }, [open])

    const fetchData = async () => {
        try {
            const token = localStorage.getItem("authToken")
            const headers = { Authorization: `Bearer ${token}` }

            // Fetch policies
            const polRes = await fetch("/api/attendance/policy", { headers })
            const polData = await polRes.json()
            if (polData.success) {
                setPolicies(polData.data || [])
            }

            // Fetch employees
            const empRes = await fetch("/api/employees", { headers })
            const empData = await empRes.json()
            if (empData.success) {
                setEmployees(empData.data || [])
            }
        } catch (error) {
            console.error("Failed to fetch data", error)
        }
    }

    const getEmployeeName = (emp: Employee) => {
        if (emp.name) return emp.name
        if (emp.firstName && emp.lastName) return `${emp.firstName} ${emp.lastName}`
        return emp.email
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem("authToken")
            const res = await fetch("/api/attendance/policy/assign", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                alert("Policy assigned successfully")
                onSubmit?.()
                setOpen(false)
                setFormData({ policyId: "", entityId: "", type: "USER" })
            } else {
                alert(data.message || "Failed to assign policy")
            }
        } catch (error) {
            console.error("Assign policy failed", error)
            alert("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                    <UserPlus size={18} />
                    Assign Policy
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle>Assign Policy to Employee</DialogTitle>
                    <DialogDescription>Link an attendance policy to an employee</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label>Select Employee</Label>
                        <Select
                            value={formData.entityId}
                            onValueChange={(val) => setFormData({ ...formData, entityId: val })}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select employee" />
                            </SelectTrigger>
                            <SelectContent>
                                {employees.map((emp) => (
                                    <SelectItem key={emp.id} value={emp.id}>
                                        {getEmployeeName(emp)} ({emp.id})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="space-y-2">
                        <Label>Select Policy</Label>
                        <Select
                            value={formData.policyId}
                            onValueChange={(val) => setFormData({ ...formData, policyId: val })}
                            required
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select policy" />
                            </SelectTrigger>
                            <SelectContent>
                                {policies.map((pol) => (
                                    <SelectItem key={pol.id} value={pol.id}>
                                        {pol.name} ({pol.id})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? "Assigning..." : "Assign Policy"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
