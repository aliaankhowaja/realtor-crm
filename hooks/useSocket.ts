'use client'
import { useEffect } from 'react'
import { getSocket } from '@/lib/socket'

export function useSocket(event: string, callback: (data: any) => void) {
  useEffect(() => {
    const socket = getSocket()
    socket.on(event, callback)
    return () => {
      socket.off(event, callback)
    }
  }, [event, callback])
}
