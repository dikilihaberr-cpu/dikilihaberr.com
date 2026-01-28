'use client'

import { useEffect } from 'react'

// Global abort error handler component
// Prevents abort errors from appearing in console
export default function AbortErrorHandler() {
  useEffect(() => {
    // Handle unhandled promise rejections (abort errors)
    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error = event.reason
      const errorMessage = error?.message || error?.toString() || ''
      const errorName = error?.name || ''
      
      // Abort hatalarını sessizce handle et (component unmount normal durum)
      if (
        errorMessage.includes('aborted') || 
        errorMessage.includes('signal') || 
        errorName === 'AbortError' ||
        errorMessage.includes('AbortError') ||
        errorMessage.includes('without reason')
      ) {
        event.preventDefault() // Console'a yazdırma
        return
      }
    }

    // Handle console errors (abort errors) - More aggressive filtering
    const originalError = console.error
    const originalWarn = console.warn
    const originalLog = console.log
    
    console.error = (...args: unknown[]) => {
      const errorMessage = args.map(a => String(a)).join(' ')
      if (
        errorMessage.includes('aborted') || 
        errorMessage.includes('signal') || 
        errorMessage.includes('AbortError') ||
        errorMessage.includes('without reason') ||
        errorMessage.includes('signal is aborted')
      ) {
        // Abort hatalarını sessizce handle et
        return
      }
      originalError.apply(console, args)
    }
    
    console.warn = (...args: unknown[]) => {
      const warnMessage = args.map(a => String(a)).join(' ')
      if (
        warnMessage.includes('aborted') || 
        warnMessage.includes('signal') || 
        warnMessage.includes('AbortError')
      ) {
        return
      }
      originalWarn.apply(console, args)
    }

    window.addEventListener('unhandledrejection', handleUnhandledRejection)
    
    return () => {
      window.removeEventListener('unhandledrejection', handleUnhandledRejection)
      console.error = originalError
      console.warn = originalWarn
      console.log = originalLog
    }
  }, [])

  return null
}
