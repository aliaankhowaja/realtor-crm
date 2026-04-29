import connectDB from '@/lib/db'
import { getSessionUser } from '@/lib/getSessionUser'
import Lead from '@/models/Lead'
import { adminRateLimit, agentRateLimit } from '@/middleware/rateLimit'

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const user = await getSessionUser(request)

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const allowed = user.role === 'admin' ? adminRateLimit(ip) : agentRateLimit(ip)
    if (!allowed) {
      return Response.json({ error: 'Too many requests' }, { status: 429 })
    }

    await connectDB()

    const baseFilter: Record<string, unknown> = { status: { $ne: 'Closed' } }
    if (user.role === 'agent') {
      baseFilter.assignedTo = user.id
    }

    const overdue = await Lead.find({
      ...baseFilter,
      followUpDate: { $lt: new Date(), $ne: null }
    })
      .populate('assignedTo', 'name email')
      .sort({ updatedAt: -1 })

    const stale = await Lead.find({
      ...baseFilter,
      updatedAt: { $lt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) }
    })
      .populate('assignedTo', 'name email')
      .sort({ updatedAt: -1 })

    return Response.json({ overdue, stale }, { status: 200 })
  } catch (error) {
    console.error('GET /api/leads/overdue error:', error)
    return Response.json({ error: 'Failed to fetch follow-up alerts' }, { status: 500 })
  }
}