'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'

interface ToastContextType {
  showToast: (message: string, type: 'info' | 'success') => void
}

const ToastContext = createContext<ToastContextType | undefined>(undefined)

export interface ToastState {
  message: string
  type: 'info' | 'success'
  visible: boolean
}

export function ToastProvider({ children }: { children: ReactNode }) {
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
    setTimeout(() => {
      setToast(prev => ({
        ...prev,
        visible: false
      }))
    }, 4000)
  }, [])

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {toast.visible && (
        <div className={`fixed bottom-4 right-4 px-4 py-3 rounded-lg shadow-lg text-white text-sm font-medium transition-opacity duration-300 ease-in-out ${
          toast.type === 'success' ? 'bg-green-500' : 'bg-blue-500'
        }`}>
          {toast.message}
        </div>
      )}
    </ToastContext.Provider>
  )
}

export function useToastContext() {
  const context = useContext(ToastContext)
  if (!context) {
    throw new Error('useToastContext must be used within ToastProvider')
  }
  return context
}
