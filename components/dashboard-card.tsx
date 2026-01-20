'use client';

import React from "react"

import { Card, CardContent } from "@/components/ui/card"
import type { LucideIcon } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

interface DashboardCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  description?: string
  trend?: {
    value: number
    isPositive: boolean
  }
  href?: string
  onClick?: () => void
}

export default function DashboardCard({ label, value, icon: Icon, description, trend, href, onClick }: DashboardCardProps) {
  const router = useRouter()

  const handleClick = (e: React.MouseEvent) => {
    if (onClick) {
      e.preventDefault()
      onClick()
    } else if (href) {
      e.preventDefault()
      router.push(href)
    }
  }

  const content = (
    <Card className="hover:shadow-lg hover:border-primary/50 transition-all duration-300 cursor-pointer" onClick={handleClick}>
      <CardContent className="pt-6">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold mt-2">{value}</p>
            {description && <p className="text-xs text-muted-foreground mt-1">{description}</p>}
            {trend && (
              <p className={`text-xs font-semibold mt-2 ${trend.isPositive ? "text-green-600" : "text-red-600"}`}>
                {trend.isPositive ? "↑" : "↓"} {trend.value}% from last month
              </p>
            )}
          </div>
          <div className="bg-primary/10 p-3 rounded-lg ml-4">
            <Icon className="text-primary" size={24} />
          </div>
        </div>
      </CardContent>
    </Card>
  )

  if (href && !onClick) {
    return <Link href={href} className="block">{content}</Link>
  }

  return content
}
