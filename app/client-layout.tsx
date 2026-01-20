"use client"

import type React from "react"
import { usePathname } from "next/navigation"
import Navbar from "@/components/navbar"
import SidebarNav from "@/components/sidebar-nav"
import { PageTransitionLoader } from "@/components/page-transition-loader"
import { ThemeProvider } from "@/components/theme-provider"
import { useEffect, useState } from "react"

function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const isLoginPage = pathname === "/login"
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem storageKey="hrms-theme">
      <div className="flex min-h-screen bg-background">
        <PageTransitionLoader />
        {!isLoginPage && <SidebarNav />}
        <div className="flex-1 flex flex-col">
          {!isLoginPage && <Navbar />}
          <main className="flex-1 overflow-y-auto">
            {children}
          </main>
        </div>
      </div>
    </ThemeProvider>
  )
}

export default ClientLayout
