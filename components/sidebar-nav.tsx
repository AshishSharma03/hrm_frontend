"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useAuth } from "@/lib/auth-context"
import { Button } from "@/components/ui/button"
import { BarChart3, Users, Briefcase, Clock, Award, FileText, LogOut, Home, Menu, X } from "lucide-react"
import { useState } from "react"
import { cn } from "@/lib/utils"

const NAVIGATION = {
  admin: [
    { label: "Dashboard", href: "/admin/dashboard", icon: Home },
    { label: "Recruiters", href: "/admin/recruiters", icon: Users },
    { label: "Employees", href: "/admin/employees", icon: Users },
    { label: "Leave Management", href: "/admin/leave", icon: Clock },
    { label: "Job Postings", href: "/admin/jobs", icon: Briefcase },
    { label: "Interviews", href: "/admin/interviews", icon: FileText },
    { label: "Offers", href: "/admin/offers", icon: Award },
    { label: "Salary", href: "/admin/salary", icon: BarChart3 },
    { label: "Rewards", href: "/admin/rewards", icon: Award },
  ],
  recruiter: [
    { label: "Dashboard", href: "/recruiter/dashboard", icon: Home },
    { label: "Employees", href: "/recruiter/employees", icon: Users },
    { label: "Leave Management", href: "/recruiter/leave", icon: Clock },
    { label: "Job Postings", href: "/recruiter/jobs", icon: Briefcase },
    { label: "Interviews", href: "/recruiter/interviews", icon: FileText },
    { label: "Offers", href: "/recruiter/offers", icon: Award },
    { label: "Rewards", href: "/recruiter/rewards", icon: Award },
    { label: "Exit Management", href: "/recruiter/exit", icon: LogOut },
  ],
  employee: [
    { label: "Dashboard", href: "/employee/dashboard", icon: Home },
    { label: "Profile", href: "/employee/profile", icon: Users },
    { label: "Leave", href: "/employee/leave", icon: Clock },
    { label: "Attendance", href: "/employee/attendance", icon: FileText },
    { label: "Salary", href: "/employee/salary", icon: BarChart3 },
    { label: "Job Postings", href: "/employee/jobs", icon: Briefcase },
    { label: "Rewards", href: "/employee/rewards", icon: Award },
    { label: "Exit", href: "/employee/exit", icon: LogOut },
  ],
}

export default function SidebarNav() {
  const { user, logout, userRole } = useAuth()
  const pathname = usePathname()
  const [isOpen, setIsOpen] = useState(false)

  if (!user || !userRole) return null

  const navItems = NAVIGATION[userRole as keyof typeof NAVIGATION] || []

  return (
    <>
      {/* Mobile menu button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="md:hidden fixed top-20 left-4 z-50 p-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 md:translate-x-0 z-50 md:z-40",
          isOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
        )}
      >
        <div className="p-6 flex flex-col h-full overflow-y-auto">
          {/* Logo */}
          <div className="flex items-center gap-2 mb-8 mt-8 md:mt-0 flex-shrink-0">
            <div className="w-10 h-10 bg-sidebar-primary rounded-lg flex items-center justify-center text-sidebar-primary-foreground font-bold">
              HR
            </div>
            <span className="text-lg font-bold text-sidebar-foreground">HRMS</span>
          </div>

          {/* Navigation */}
          <nav className="flex-1 space-y-1 overflow-y-auto">
            {navItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname.startsWith(item.href)
              return (
                <Link key={item.href} href={item.href}>
                  <button
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      "w-full flex items-center gap-3 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                      isActive
                        ? "bg-sidebar-primary text-sidebar-primary-foreground"
                        : "text-sidebar-foreground hover:bg-sidebar-accent/20",
                    )}
                  >
                    <Icon size={18} />
                    <span>{item.label}</span>
                  </button>
                </Link>
              )
            })}
          </nav>

          {/* Logout */}
          <Button
            onClick={logout}
            variant="outline"
            className="w-full text-sidebar-foreground border-sidebar-border hover:bg-sidebar-accent/20 bg-transparent"
          >
            <LogOut size={18} className="mr-2" />
            Logout
          </Button>
        </div>
      </aside>

      {/* Overlay for mobile */}
      {isOpen && <div className="md:hidden fixed inset-0 bg-black/50 z-30" onClick={() => setIsOpen(false)} />}
    </>
  )
}
