"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"

const skeletonKeyframes = `
  @keyframes shimmer {
    0% { background-position: -1000px 0; }
    100% { background-position: 1000px 0; }
  }
  .animate-shimmer {
    animation: shimmer 2s infinite;
    background: linear-gradient(90deg, 
      var(--muted) 25%, 
      var(--muted-foreground) 50%, 
      var(--muted) 75%);
    background-size: 1000px 100%;
    background-position: -1000px 0;
  }
`

export function SkeletonCard() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="h-6 bg-muted rounded-lg w-2/3 animate-pulse" />
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="h-4 bg-muted rounded w-full animate-pulse" />
        <div className="h-4 bg-muted rounded w-5/6 animate-pulse" />
        <div className="h-8 bg-muted rounded w-1/3 mt-4 animate-pulse" />
      </CardContent>
    </Card>
  )
}

export function SkeletonTableRow() {
  return (
    <div className="flex items-center gap-3 py-3 px-4 border-b border-border last:border-0">
      <div className="h-10 w-10 rounded-lg bg-muted animate-pulse" />
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
        <div className="h-3 bg-muted rounded w-1/3 animate-pulse" />
      </div>
      <div className="h-8 w-20 bg-muted rounded animate-pulse" />
      <div className="h-8 w-8 bg-muted rounded animate-pulse" />
    </div>
  )
}

export function SkeletonTable({ rows = 5 }: { rows?: number }) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="h-6 bg-muted rounded-lg w-1/4 animate-pulse" />
      </CardHeader>
      <CardContent>
        <div className="divide-y divide-border">
          {[...Array(rows)].map((_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

export function SkeletonGrid({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(count)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  )
}

export function SkeletonDashboard() {
  return (
    <div className="space-y-6">
      {/* Header skeleton */}
      <div className="space-y-3">
        <div className="h-8 bg-muted rounded-lg w-1/4 animate-pulse" />
        <div className="h-4 bg-muted rounded w-1/3 animate-pulse" />
      </div>

      {/* Stats grid skeleton */}
      <SkeletonGrid count={4} />

      {/* Table skeleton */}
      <SkeletonTable rows={6} />
    </div>
  )
}

export function SkeletonFormField() {
  return (
    <div className="space-y-2">
      <div className="h-4 bg-muted rounded w-1/4 animate-pulse" />
      <div className="h-10 bg-muted rounded-lg animate-pulse" />
    </div>
  )
}

export function SkeletonForm() {
  return (
    <div className="space-y-4">
      {[...Array(4)].map((_, i) => (
        <SkeletonFormField key={i} />
      ))}
      <div className="flex gap-2 pt-4">
        <div className="h-10 bg-muted rounded-lg w-24 animate-pulse" />
        <div className="h-10 bg-muted rounded-lg w-24 animate-pulse" />
      </div>
    </div>
  )
}
