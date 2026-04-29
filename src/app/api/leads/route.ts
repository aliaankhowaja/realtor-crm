import connectDB from '@/lib/db'
import { getSessionUser } from '@/lib/getSessionUser'
import Lead from '@/models/Lead'
import Activity from '@/models/Activity'
import { adminRateLimit, agentRateLimit } from '@/middleware/rateLimit'
import { validateBody } from '@/middleware/validate'
import { CreateLeadSchema } from '@/lib/schemas'

export async function GET(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const user = await getSessionUser(request)

    // Check authentication
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const allowed = user.role === 'admin' ? adminRateLimit(ip) : agentRateLimit(ip)
    if (!allowed) {
      return Response.json({ error: 'Too many requests' }, { status: 429 })
    }

    await connectDB()

    // Build filter object
    const filter: any = {}

    // If agent, only show assigned leads
    if (user.role === 'agent') {
      filter.assignedTo = user.id
    }

    // Parse query parameters
    const url = new URL(request.url)
    const status = url.searchParams.get('status')
    const priority = url.searchParams.get('priority')
    const search = url.searchParams.get('search')

    // Apply filters
    if (status) {
      filter.status = status
    }

    if (priority) {
      filter.score = priority
    }

    if (search) {
      filter.name = { $regex: search, $options: 'i' }
    }

    // Fetch leads
    const leads = await Lead.find(filter)
      .populate('assignedTo', 'name email')
      .sort({ createdAt: -1 })

    return Response.json(leads, { status: 200 })
  } catch (error) {
    console.error('GET /api/leads error:', error)
    return Response.json({ error: 'Failed to fetch leads' }, { status: 500 })
  }
}

export async function POST(request: Request) {
  try {
    const ip = request.headers.get('x-forwarded-for') ?? 'unknown'
    const user = await getSessionUser(request)

    // Check authentication
    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Rate limiting
    const allowed = user.role === 'admin' ? adminRateLimit(ip) : agentRateLimit(ip)
    if (!allowed) {
      return Response.json({ error: 'Too many requests' }, { status: 429 })
    }

    // Only admin can create leads
    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validation = validateBody(CreateLeadSchema, body)

    if (!validation.success) {
      return Response.json({ errors: validation.errors }, { status: 400 })
    }

    await connectDB()

    // Create lead - score will be auto-calculated by the model pre-save hook
    const lead = await Lead.create(validation.data)

    // Create activity log
    await Activity.create({
      leadId: lead._id,
      action: 'Lead created',
      performedBy: user.id
    })

    // Emit socket event if available
    if ((global as any).io) {
      (global as any).io.emit('lead:created', lead)
    }

    // TODO: Send email notification when Module 7 is implemented
    // await sendLeadNotification(lead)

    return Response.json(lead, { status: 201 })
  } catch (error) {
    console.error('POST /api/leads error:', error)
    return Response.json({ error: 'Failed to create lead' }, { status: 500 })
  }
}
