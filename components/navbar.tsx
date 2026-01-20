"use client"

import { useState } from "react"
import { useAuth } from "@/lib/auth-context"
import { useRouter, usePathname } from "next/navigation"
import { Bell, LogOut, Settings, User, ChevronDown } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ThemeSwitcher } from "./theme-switcher"
import Link from "next/link"

const pageDescriptions: Record<string, { title: string; description: string }> = {
  "/admin/dashboard": {
    title: "Admin Dashboard",
    description: "Welcome back! Here's your HRMS overview.",
  },
  "/admin/employees": {
    title: "Employee Management",
    description: "Manage employee information, profiles, and records.",
  },
  "/admin/recruiters": {
    title: "Recruiter Management",
    description: "Manage recruiters, approvals, and access controls.",
  },
  "/admin/jobs": {
    title: "Job Management",
    description: "Create and manage job postings.",
  },
  "/admin/interviews": {
    title: "Interview Management",
    description: "Schedule and manage interviews.",
  },
  "/admin/offers": {
    title: "Offer Management",
    description: "Generate and send offer letters to candidates.",
  },
  "/admin/leave": {
    title: "Leave Management",
    description: "Approve and track employee leave requests.",
  },
  "/admin/salary": {
    title: "Salary Management",
    description: "Manage payroll and salary processing.",
  },
  "/admin/rewards": {
    title: "Rewards Management",
    description: "Manage employee rewards and recognition.",
  },
  "/recruiter/dashboard": {
    title: "Recruiter Dashboard",
    description: "Manage your recruitment pipeline and activities.",
  },
  "/recruiter/employees": {
    title: "Employee Records",
    description: "View and manage employee information.",
  },
  "/recruiter/jobs": {
    title: "Job Postings",
    description: "Manage active job postings and applications.",
  },
  "/recruiter/interviews": {
    title: "Interviews",
    description: "Schedule and manage candidate interviews.",
  },
  "/recruiter/offers": {
    title: "Offer Management",
    description: "Generate and track candidate offers.",
  },
  "/recruiter/rewards": {
    title: "Employee Rewards",
    description: "View and manage employee reward programs.",
  },
  "/recruiter/exit": {
    title: "Exit Management",
    description: "Process employee exits and offboarding.",
  },
  "/employee/dashboard": {
    title: "Employee Dashboard",
    description: "Your personal workspace and quick access tools.",
  },
  "/employee/profile": {
    title: "My Profile",
    description: "View and update your profile information.",
  },
  "/employee/leave": {
    title: "Leave Management",
    description: "Apply for and track your leave requests.",
  },
  "/employee/attendance": {
    title: "Attendance",
    description: "Check in and track your attendance.",
  },
  "/employee/salary": {
    title: "Salary",
    description: "View your salary slips and payment history.",
  },
  "/employee/jobs": {
    title: "Job Opportunities",
    description: "Explore and apply for internal positions.",
  },
  "/employee/rewards": {
    title: "My Rewards",
    description: "View your earned rewards and recognition.",
  },
  "/profile": {
    title: "My Profile",
    description: "Manage your account and profile settings.",
  },
}

export default function Navbar() {
  const { user, logout } = useAuth()
  const router = useRouter()
  const pathname = usePathname()
  const [announcements, setAnnouncements] = useState([
    {
      id: 1,
      title: "System Maintenance",
      message: "Server maintenance scheduled for Sunday 2:00 AM",
      time: "2 hours ago",
      read: false,
    },
    {
      id: 2,
      title: "New Policy Update",
      message: "Work from home policy has been updated",
      time: "1 day ago",
      read: false,
    },
    {
      id: 3,
      title: "Payroll Processed",
      message: "Monthly payroll has been processed successfully",
      time: "3 days ago",
      read: true,
    },
  ])

  const unreadCount = announcements.filter((a) => !a.read).length

  const handleMarkAsRead = (id: number) => {
    setAnnouncements(announcements.map((a) => (a.id === id ? { ...a, read: true } : a)))
  }

  if (!user) return null

  const pageInfo = pageDescriptions[pathname] || {
    title: "HRMS Portal",
    description: "Welcome to your portal",
  }

  const userInitials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()

  return (
    <nav className="fixed top-0 left-0 right-0 md:left-64 h-auto bg-background border-b border-border flex flex-col md:flex-row md:items-center md:justify-between px-6 py-3 md:py-4 z-40">
      {/* Left: Title and Description - Only shown in navbar, not repeated in pages */}
      <div className="flex-1 mb-3 md:mb-0">
        <h2 className="text-lg md:text-xl font-semibold text-foreground">{pageInfo.title}</h2>
        <p className="hidden md:block text-xs md:text-sm text-muted-foreground mt-1">{pageInfo.description}</p>
      </div>

      {/* Right: Notifications and Account */}
      <div className="flex items-center gap-4 ml-auto">
        {/* Theme Switcher */}
        <ThemeSwitcher />

        {/* Announcements/Notifications */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="relative p-2 hover:bg-muted rounded-lg transition-colors">
              <Bell size={20} className="text-foreground" />
              {unreadCount > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 bg-accent rounded-full flex items-center justify-center text-xs text-accent-foreground font-bold">
                  {unreadCount}
                </span>
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <div className="p-3 border-b">
              <h3 className="font-semibold text-sm">Announcements</h3>
            </div>
            <div className="max-h-96 overflow-y-auto">
              {announcements.length > 0 ? (
                announcements.map((ann) => (
                  <div
                    key={ann.id}
                    className={`p-3 border-b last:border-0 cursor-pointer hover:bg-muted/50 transition-colors ${
                      !ann.read ? "bg-muted/30" : ""
                    }`}
                    onClick={() => handleMarkAsRead(ann.id)}
                  >
                    <div className="flex gap-2">
                      <div
                        className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${ann.read ? "bg-muted" : "bg-accent"}`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-sm">{ann.title}</p>
                        <p className="text-xs text-muted-foreground line-clamp-2 mt-0.5">{ann.message}</p>
                        <p className="text-xs text-muted-foreground mt-1">{ann.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="p-6 text-center text-sm text-muted-foreground">No announcements</div>
              )}
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Account Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 hover:bg-muted rounded-lg transition-colors z-40">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback className="bg-primary text-primary-foreground">{userInitials}</AvatarFallback>
              </Avatar>
              <div className="hidden sm:block text-left">
                <p className="text-sm font-medium text-foreground">{user.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{user.role}</p>
              </div>
              <ChevronDown size={16} className="text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 z-50">
            <DropdownMenuItem asChild>
              <Link href="/profile" className="flex cursor-pointer">
                <User size={16} className="mr-2" />
                <span>My Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/settings" className="flex cursor-pointer">
                <Settings size={16} className="mr-2" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <div className="p-2">
              <p className="text-xs font-semibold text-muted-foreground uppercase mb-2">Display</p>
              <ThemeSwitcher />
            </div>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-600 focus:text-red-600">
              <LogOut size={16} className="mr-2" />
              <span>Logout</span>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  )
}
