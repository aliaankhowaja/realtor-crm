import { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: any) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }
  
  const io = res.socket?.server?.io || (global as any).io
  if (io) {
    const { event, payload } = req.body
    io.emit(event, payload)
    return res.status(200).json({ success: true })
  }

  return res.status(503).json({ error: 'Socket not initialized' })
}
