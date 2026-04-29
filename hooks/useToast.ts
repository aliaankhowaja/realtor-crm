'use client'
import { useState, useCallback } from 'react'

interface ToastState {
  message: string
  type: 'info' | 'success'
  visible: boolean
}

export function useToast() {
  const [toast, setToast] = useState<ToastState>({
    message: '',
    type: 'info',
    visible: false
  })

  const showToast = useCallback((message: string, type: 'info' | 'success' = 'info') => {
    setToast({
      message,
      type,
      visible: true
    })

    // Auto-dismiss after 4 seconds
    const timer = setTimeout(() => {
      setToast(prev => ({
        ...prev,
        visible: false
      }))
    }, 4000)

    return () => clearTimeout(timer)
  }, [])

  return { toast, showToast }
}
