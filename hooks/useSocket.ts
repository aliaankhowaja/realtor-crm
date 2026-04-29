'use client'
import { useEffect, useRef } from 'react'
import { initSocket } from '@/lib/socket'

export function useSocket(event: string, callback: (data: any) => void) {
  const cbRef = useRef(callback)
  
  useEffect(() => {
    cbRef.current = callback
  }, [callback])

  useEffect(() => {
    let isActive = true
    
    // Wrapper to ensure we only call the latest callback
    const handleEvent = (data: any) => {
      if (isActive) cbRef.current(data)
    }

    initSocket().then((socket) => {
      if (isActive) {
        socket.on(event, handleEvent)
      }
    }).catch(console.error)

    return () => {
      isActive = false
      initSocket().then((socket) => {
        socket.off(event, handleEvent)
      }).catch(console.error)
    }
  }, [event])
}
