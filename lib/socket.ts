import { io, Socket } from 'socket.io-client'

let socket: Socket | null = null

export function getSocket(): Socket {
  if (!socket) {
    socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || '', {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })
  }
  return socket
}

// Client-side initialization to wake up the Next.js API route
export async function initSocket() {
  if (!socket) {
    await fetch('/api/socket/io')
    socket = getSocket()
  }
  return socket
}
