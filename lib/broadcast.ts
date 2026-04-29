export async function broadcast(request: Request, event: string, payload: any) {
  try {
    const global_io = (global as any).io
    if (global_io) {
      global_io.emit(event, payload)
      return
    }

    const baseUrl = process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3000'
    const url = new URL(`${baseUrl}/api/socket/broadcast`)
    
    await fetch(url.toString(), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event, payload }),
    }).catch(e => console.error('Broadcast network error:', e))
  } catch (error) {
    console.error('Broadcast initialization failed:', error)
  }
}
