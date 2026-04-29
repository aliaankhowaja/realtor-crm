'use client'

import { useEffect, useState } from 'react'

type TimelineActivity = {
    _id?: string
    action: string
    createdAt: string
    performedBy?: { name?: string } | string | null
}

interface ActivityTimelineProps {
    leadId: string
}

export default function ActivityTimeline({ leadId }: ActivityTimelineProps) {
    const [activities, setActivities] = useState<TimelineActivity[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const fetchActivities = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await fetch(`/api/leads/${leadId}/activities`)
                if (!response.ok) {
                    throw new Error('Failed to fetch activity timeline')
                }

                const data = await response.json()
                if (active) {
                    setActivities(data)
                }
            } catch (fetchError: unknown) {
                if (active) {
                    setError(fetchError instanceof Error ? fetchError.message : 'Failed to fetch activity timeline')
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        fetchActivities()

        return () => {
            active = false
        }
    }, [leadId])

    if (loading) {
        return <div className="text-sm text-gray-500">Loading activity timeline...</div>
    }

    if (error) {
        return <div className="text-sm text-red-600">{error}</div>
    }

    if (activities.length === 0) {
        return <div className="text-sm text-gray-500">No activity yet</div>
    }

    return (
        <div className="border-l-2 border-gray-200 ml-4 pl-6 space-y-6">
            {activities.map((activity) => {
                const performerName =
                    typeof activity.performedBy === 'string'
                        ? 'Unknown'
                        : activity.performedBy?.name || 'Unknown'

                return (
                    <div key={activity._id || `${activity.action}-${activity.createdAt}`} className="relative">
                        <span className="absolute -left-[1.875rem] top-1 w-3 h-3 bg-blue-500 rounded-full" />
                        <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                        <p className="mt-1 text-sm text-gray-600">by {performerName}</p>
                        <p className="mt-1 text-xs text-gray-500">
                            {new Date(activity.createdAt).toLocaleString('en-US', {
                                month: 'short',
                                day: 'numeric',
                                year: 'numeric',
                                hour: 'numeric',
                                minute: '2-digit'
                            })}
                        </p>
                    </div>
                )
            })}
        </div>
    )
}