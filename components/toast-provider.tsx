'use client'

import { Toaster } from 'sonner'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'

export function ToastProvider() {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <Toaster
      theme={theme as 'light' | 'dark' | 'system'}
      position="top-right"
      richColors
      closeButton
      expand={true}
      pauseWhenPageIsHidden
    />
  )
}
