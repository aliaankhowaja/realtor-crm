import connectDB from '@/lib/db'
import { getSessionUser } from '@/lib/getSessionUser'
import Lead from '@/models/Lead'

export async function GET(request: Request) {
  try {
    const user = await getSessionUser(request)

    if (!user) {
      return Response.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (user.role !== 'admin') {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }

    await connectDB()

    const currentMonthStart = new Date(new Date().getFullYear(), new Date().getMonth(), 1)

    const [
      totalLeads,
      byStatus,
      byPriority,
      agentPerformance,
      highPriorityCount,
      closedThisMonth
    ] = await Promise.all([
      Lead.countDocuments(),
      Lead.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Lead.aggregate([{ $group: { _id: '$score', count: { $sum: 1 } } }]),
      Lead.aggregate([
        { $match: { assignedTo: { $ne: null } } },
        {
          $group: {
            _id: '$assignedTo',
            totalAssigned: { $sum: 1 },
            closed: { $sum: { $cond: [{ $eq: ['$status', 'Closed'] }, 1, 0] } }
          }
        },
        { $lookup: { from: 'users', localField: '_id', foreignField: '_id', as: 'agent' } },
        { $unwind: '$agent' },
        { $project: { agentName: '$agent.name', totalAssigned: 1, closed: 1 } },
        { $sort: { totalAssigned: -1 } }
      ]),
      Lead.countDocuments({ score: 'High' }),
      Lead.countDocuments({
        status: 'Closed',
        updatedAt: { $gte: currentMonthStart }
      })
    ])

    return Response.json(
      {
        totalLeads,
        byStatus,
        byPriority,
        agentPerformance,
        highPriorityCount,
        closedThisMonth
      },
      { status: 200 }
    )
  } catch (error) {
    console.error('GET /api/analytics error:', error)
    return Response.json({ error: 'Failed to load analytics' }, { status: 500 })
  }
}
