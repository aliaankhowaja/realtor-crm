import mongoose from 'mongoose'

import connectDB from '@/lib/db'
import { getSessionUser } from '@/lib/getSessionUser'
import Lead from '@/models/Lead'
import Activity from '@/models/Activity'
import User from '@/models/User'
import { adminRateLimit } from '@/middleware/rateLimit'
import { sendEmail } from '@/lib/email'
import { leadAssignedTemplate } from '@/lib/emailTemplates'

export async function PUT(request: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params

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

    const body = await request.json()
    const rawAgentId = body?.agentId
    const agentId = rawAgentId === '' ? null : rawAgentId ?? null

    if (agentId !== null && (typeof agentId !== 'string' || !mongoose.Types.ObjectId.isValid(agentId))) {
      return Response.json({ error: 'Agent not found' }, { status: 400 })
    }

    const lead = await Lead.findById(id)
    if (!lead) {
      return Response.json({ error: 'Lead not found' }, { status: 404 })
    }

    let agent = null
    if (agentId !== null) {
      agent = await User.findOne({ _id: agentId, role: 'agent' })
      if (!agent) {
        return Response.json({ error: 'Agent not found' }, { status: 400 })
      }
    }

    const updatedLead = await Lead.findByIdAndUpdate(id, { assignedTo: agentId || null }, { new: true })

    await Activity.create({
      leadId: id,
      action: agentId ? `Lead assigned to ${agent.name}` : 'Lead unassigned',
      performedBy: user.id
    })

    if ((global as any).io) {
      ;(global as any).io.emit('lead:assigned', {
        leadId: id,
        agentId,
        agentName: agent?.name
      })
    }

    // Send assignment email to agent if assigning (not unassigning)
    if (agentId && agent) {
      const { subject, html } = leadAssignedTemplate(updatedLead, agent.name)
      await sendEmail({ to: agent.email, subject, html })
    }

    return Response.json(updatedLead, { status: 200 })
  } catch (error) {
    console.error('PUT /api/leads/[id]/assign error:', error)
    return Response.json({ error: 'Failed to assign lead' }, { status: 500 })
  }
}