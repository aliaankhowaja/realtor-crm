import connectDB from '@/lib/db'
import { getSessionUser } from '@/lib/getSessionUser'
import User from '@/models/User'
import { adminRateLimit } from '@/middleware/rateLimit'

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const user = await getSessionUser(request)

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const allowed = adminRateLimit(ip)
    if (!allowed) {
      return Response.json({ error: 'Too many requests' }, { status: 429 })
    }

    await connectDB()

    const agents = await User.find({ role: 'agent' }, 'name email _id')

    return Response.json(agents, { status: 200 })
  } catch (error) {
    console.error('GET /api/users/agents error:', error)
    return Response.json({ error: 'Failed to fetch agents' }, { status: 500 })
  }
}