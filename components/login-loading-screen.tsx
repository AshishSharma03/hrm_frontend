'use client'

import { useEffect, useState } from 'react'

export function LoginLoadingScreen({ isLoading }: { isLoading: boolean }) {
  const [showLoader, setShowLoader] = useState(false)

  useEffect(() => {
    if (isLoading) {
      setShowLoader(true)
    } else {
      const timer = setTimeout(() => setShowLoader(false), 300)
      return () => clearTimeout(timer)
    }
  }, [isLoading])

  if (!showLoader) return null

  return (
    <div className="fixed inset-0 bg-black/20 backdrop-blur-sm flex items-end justify-end z-50 p-4">
      {/* Bottom-right notification popup - minimal and professional */}
      <div className="flex items-center gap-3 bg-white dark:bg-slate-900 rounded-lg shadow-lg p-4 max-w-xs border border-gray-200 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4 duration-300">
        <div className="relative w-8 h-8 flex-shrink-0">
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin" />
        </div>
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">Authenticating</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Please wait...</p>
        </div>
      </div>
    </div>
  )
}
