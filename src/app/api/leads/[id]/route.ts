import connectDB from '@/lib/db'
import { getSessionUser } from '@/lib/getSessionUser'
import { broadcast } from '@/lib/broadcast'
import Lead from '@/models/Lead'
import Activity from '@/models/Activity'
import { adminRateLimit, agentRateLimit } from '@/middleware/rateLimit'
import { validateBody } from '@/middleware/validate'
import { UpdateLeadSchema } from '@/lib/schemas'
import { describeChanges } from '@/lib/leadHelpers'

export async function GET(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

    const lead = await Lead.findById(id).populate('assignedTo', 'name email')

    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 })
    }

    // If agent, check if lead is assigned to them
    if (user.role === 'agent' && lead.assignedTo?._id.toString() !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    return Response.json(lead, { status: 200 })
  } catch (error) {
    console.error('GET /api/leads/[id] error:', error)
    return Response.json({ error: 'Failed to fetch lead' }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

    const existingLead = await Lead.findById(id)

    if (!existingLead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 })
    }

    // If agent, check if lead is assigned to them
    if (user.role === 'agent' && existingLead.assignedTo?.toString() !== user.id) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    const body = await request.json()
    const validation = validateBody(UpdateLeadSchema, body)

    if (!validation.success) {
      return Response.json({ errors: validation.errors }, { status: 400 })
    }

    let updates = { ...validation.data }

    // If agent, only allow updating status, notes, followUpDate
    if (user.role === 'agent') {
      updates = {
        status: updates.status,
        notes: updates.notes,
        followUpDate: updates.followUpDate
      }
    }

    // Update lead
    const updatedLead = await Lead.findByIdAndUpdate(id, updates, { new: true })

    // Log activity
    const changeDescription = describeChanges(existingLead, validation.data)
    await Activity.create({
      leadId: id,
      action: changeDescription,
      performedBy: user.id
    })

    // Emit socket event
    await broadcast(request, 'lead:updated', updatedLead)

    return Response.json(updatedLead, { status: 200 })
  } catch (error) {
    console.error('PUT /api/leads/[id] error:', error)
    return Response.json({ error: 'Failed to update lead' }, { status: 500 })
  }
}

export async function DELETE(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
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

    // Only admin can delete
    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()

    // Delete lead
    await Lead.findByIdAndDelete(id)

    // Delete all activities associated with this lead
    await Activity.deleteMany({ leadId: id })

    return Response.json({ message: 'Lead deleted' }, { status: 200 })
  } catch (error) {
    console.error('DELETE /api/leads/[id] error:', error)
    return Response.json({ error: 'Failed to delete lead' }, { status: 500 })
  }
}
