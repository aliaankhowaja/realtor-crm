import connectDB from '@/lib/db'
import { getSessionUser } from '@/lib/getSessionUser'
import Lead from '@/models/Lead'
import Activity from '@/models/Activity'
import { adminRateLimit, agentRateLimit } from '@/middleware/rateLimit'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

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

    const lead = await Lead.findById(id)
    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 })
    }

    if (user.role === 'agent' && lead.assignedTo?.toString() !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const activities = await Activity.find({ leadId: id })
      .populate('performedBy', 'name')
      .sort({ createdAt: -1 })

    return Response.json(activities, { status: 200 })
  } catch (error) {
    console.error('GET /api/leads/[id]/activities error:', error)
    return Response.json({ error: 'Failed to fetch activities' }, { status: 500 })
  }
}