import { Server as NetServer } from 'http'
import { NextApiRequest } from 'next'
import { Server as ServerIO } from 'socket.io'

export const config = {
  api: {
    bodyParser: false,
  },
}

export default function ioHandler(req: NextApiRequest, res: any) {
  if (!res.socket.server.io) {
    console.log('*First use, starting socket.io')
    const httpServer: NetServer = res.socket.server as any
    const io = new ServerIO(httpServer, {
      path: '/api/socket/io',
      addTrailingSlash: false,
    })
    res.socket.server.io = io

    // Make available globally so App Router API routes can access it
    ;(global as any).io = io

    io.on('connection', (socket) => {
      console.log('Client connected:', socket.id)
      socket.on('disconnect', () => {
        console.log('Client disconnected:', socket.id)
      })
    })
  } else {
      ;(global as any).io = res.socket.server.io
  }

  res.end()
}
