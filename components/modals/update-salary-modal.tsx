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
import { Edit2 } from "lucide-react"

interface SalaryStructure {
    basic?: number
    hra?: number
    allowances?: number
    transportAllowance?: number
    specialAllowance?: number
    providentFund?: number
    professionalTax?: number
    incomeTax?: number
}

interface UpdateSalaryModalProps {
    employeeId: string
    employeeName: string
    currentStructure?: SalaryStructure
    onSubmit?: () => void
}

export default function UpdateSalaryModal({ employeeId, employeeName, currentStructure, onSubmit }: UpdateSalaryModalProps) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState<SalaryStructure>({
        basic: currentStructure?.basic || 0,
        hra: currentStructure?.hra || 0,
        allowances: currentStructure?.allowances || 0,
        transportAllowance: currentStructure?.transportAllowance || 0,
        specialAllowance: currentStructure?.specialAllowance || 0,
        providentFund: currentStructure?.providentFund || 0,
        professionalTax: currentStructure?.professionalTax || 0,
        incomeTax: currentStructure?.incomeTax || 0
    })

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        try {
            const token = localStorage.getItem("authToken")
            const res = await fetch(`/api/salary/structure/${employeeId}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                alert("Salary structure updated successfully")
                onSubmit?.()
                setOpen(false)
            } else {
                alert(data.message || "Failed to update salary structure")
            }
        } catch (error) {
            console.error("Update salary failed", error)
            alert("An error occurred")
        } finally {
            setLoading(false)
        }
    }

    const totalEarnings = (formData.basic || 0) + (formData.hra || 0) + (formData.allowances || 0) +
        (formData.transportAllowance || 0) + (formData.specialAllowance || 0)
    const totalDeductions = (formData.providentFund || 0) + (formData.professionalTax || 0) + (formData.incomeTax || 0)
    const netSalary = totalEarnings - totalDeductions

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="flex items-center gap-1">
                    <Edit2 size={14} />
                    Update Structure
                </Button>
            </DialogTrigger>
            <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Update Salary Structure</DialogTitle>
                    <DialogDescription>Configure salary components for {employeeName}</DialogDescription>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Earnings Section */}
                    <div className="space-y-3">
                        <h4 className="font-semibold text-green-700 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-green-500"></span>
                            Earnings
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="basic" className="text-sm">Basic Salary</Label>
                                <Input
                                    id="basic"
                                    type="number"
                                    min="0"
                                    value={formData.basic}
                                    onChange={(e) => setFormData({ ...formData, basic: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="hra" className="text-sm">HRA</Label>
                                <Input
                                    id="hra"
                                    type="number"
                                    min="0"
                                    value={formData.hra}
                                    onChange={(e) => setFormData({ ...formData, hra: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="allowances" className="text-sm">Allowances</Label>
                                <Input
                                    id="allowances"
                                    type="number"
                                    min="0"
                                    value={formData.allowances}
                                    onChange={(e) => setFormData({ ...formData, allowances: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="transport" className="text-sm">Transport Allowance</Label>
                                <Input
                                    id="transport"
                                    type="number"
                                    min="0"
                                    value={formData.transportAllowance}
                                    onChange={(e) => setFormData({ ...formData, transportAllowance: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1 col-span-2">
                                <Label htmlFor="special" className="text-sm">Special Allowance</Label>
                                <Input
                                    id="special"
                                    type="number"
                                    min="0"
                                    value={formData.specialAllowance}
                                    onChange={(e) => setFormData({ ...formData, specialAllowance: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="text-right text-sm font-medium text-green-700">
                            Total Earnings: ₹{totalEarnings.toLocaleString()}
                        </div>
                    </div>

                    {/* Deductions Section */}
                    <div className="space-y-3 pt-2 border-t">
                        <h4 className="font-semibold text-red-700 flex items-center gap-2">
                            <span className="w-3 h-3 rounded-full bg-red-500"></span>
                            Deductions
                        </h4>
                        <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-1">
                                <Label htmlFor="pf" className="text-sm">Provident Fund</Label>
                                <Input
                                    id="pf"
                                    type="number"
                                    min="0"
                                    value={formData.providentFund}
                                    onChange={(e) => setFormData({ ...formData, providentFund: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1">
                                <Label htmlFor="pt" className="text-sm">Professional Tax</Label>
                                <Input
                                    id="pt"
                                    type="number"
                                    min="0"
                                    value={formData.professionalTax}
                                    onChange={(e) => setFormData({ ...formData, professionalTax: Number(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-1 col-span-2">
                                <Label htmlFor="tax" className="text-sm">Income Tax (TDS)</Label>
                                <Input
                                    id="tax"
                                    type="number"
                                    min="0"
                                    value={formData.incomeTax}
                                    onChange={(e) => setFormData({ ...formData, incomeTax: Number(e.target.value) })}
                                />
                            </div>
                        </div>
                        <div className="text-right text-sm font-medium text-red-700">
                            Total Deductions: ₹{totalDeductions.toLocaleString()}
                        </div>
                    </div>

                    {/* Net Salary */}
                    <div className="bg-muted p-4 rounded-lg">
                        <div className="flex justify-between items-center">
                            <span className="font-semibold">Net Monthly Salary</span>
                            <span className="text-2xl font-bold text-primary">₹{netSalary.toLocaleString()}</span>
                        </div>
                    </div>

                    <div className="flex gap-3 pt-4 border-t">
                        <Button type="button" variant="outline" onClick={() => setOpen(false)} className="flex-1" disabled={loading}>
                            Cancel
                        </Button>
                        <Button type="submit" className="flex-1" disabled={loading}>
                            {loading ? "Updating..." : "Update Structure"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    )
}
