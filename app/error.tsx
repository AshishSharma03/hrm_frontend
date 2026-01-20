'use client'

import { useEffect } from 'react'
import { AlertCircle, RefreshCw, Home } from 'lucide-react'
import Link from 'next/link'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[Error Boundary]', error)
  }, [error])

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-800">
      <div className="w-full max-w-md rounded-lg bg-white dark:bg-slate-900 p-8 shadow-lg">
        <div className="flex items-center justify-center rounded-full bg-red-100 dark:bg-red-900 p-4 mb-4 mx-auto w-fit">
          <AlertCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
        </div>
        
        <h1 className="text-center text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Oops! Something went wrong
        </h1>
        <p className="text-center text-gray-600 dark:text-gray-300 mb-6">
          An unexpected error has occurred. Please try again or return to home.
        </p>

        <div className="space-y-3">
          <button
            onClick={() => reset()}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
          >
            <RefreshCw className="h-4 w-4" />
            Try Again
          </button>
          
          <button
            onClick={() => window.location.href = "/"}
            className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-900 dark:text-white rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
          >
            <Home className="h-4 w-4" />
            Go Home
          </button>
        </div>

        {error.message && (
          <div className="mt-6 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
            <p className="text-sm text-red-700 dark:text-red-300 font-mono break-words">
              {error.message}
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
