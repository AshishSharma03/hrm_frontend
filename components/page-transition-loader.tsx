'use client'

import { useEffect, useState, Suspense } from 'react'
import { usePathname } from 'next/navigation'

function PageTransitionLoaderContent() {
  const pathname = usePathname()
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    setIsLoading(true)
    const timer = setTimeout(() => setIsLoading(false), 300)
    return () => clearTimeout(timer)
  }, [pathname])

  if (!isLoading) return null

  return (
    <div className="fixed inset-0 bg-background/40 backdrop-blur-sm z-40 flex items-center justify-center pointer-events-none">
      <div className="flex flex-col items-center gap-3">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-r-primary animate-spin" />
          <div className="absolute inset-1 rounded-full border-2 border-transparent border-b-accent animate-spin-reverse" />
        </div>
        <p className="text-sm text-foreground font-medium">Loading...</p>
      </div>
    </div>
  )
}

export function PageTransitionLoader() {
  return (
    <Suspense fallback={null}>
      <PageTransitionLoaderContent />
    </Suspense>
  )
}
