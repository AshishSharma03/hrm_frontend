"use client"

import type React from "react"

interface PageHeaderProps {
  title: string
  description: string
  icon?: React.ReactNode
}

export default function PageHeader({ title, description, icon }: PageHeaderProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center gap-3 mb-2">
        {icon}
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h1>
      </div>
      <p className="text-sm md:text-base text-muted-foreground">{description}</p>
    </div>
  )
}
