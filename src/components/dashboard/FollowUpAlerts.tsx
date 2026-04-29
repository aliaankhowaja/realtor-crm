'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type FollowUpSummary = {
    overdue: unknown[]
    stale: unknown[]
}

interface FollowUpAlertsProps {
    leadsHref: string
}

export default function FollowUpAlerts({ leadsHref }: FollowUpAlertsProps) {
    const [summary, setSummary] = useState<FollowUpSummary>({ overdue: [], stale: [] })
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        let active = true

        const fetchSummary = async () => {
            try {
                setLoading(true)
                const response = await fetch('/api/leads/overdue')
                if (!response.ok) {
                    throw new Error('Failed to load follow-up alerts')
                }

                const data = await response.json()
                if (active) {
                    setSummary(data)
                }
            } catch {
                if (active) {
                    setSummary({ overdue: [], stale: [] })
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        fetchSummary()

        return () => {
            active = false
        }
    }, [])

    if (loading) {
        return null
    }

    return (
        <div className="space-y-3">
            {summary.overdue.length > 0 && (
                <Link
                    href={`${leadsHref}?overdue=1`}
                    className="block rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-red-800 shadow-sm transition hover:bg-red-100"
                >
                    ⚠ You have {summary.overdue.length} overdue follow-up(s). Click to view.
                </Link>
            )}

            {summary.stale.length > 0 && (
                <Link
                    href={`${leadsHref}?stale=1`}
                    className="block rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-amber-900 shadow-sm transition hover:bg-amber-100"
                >
                    ⚠ {summary.stale.length} lead(s) have had no activity for 7+ days. Click to view.
                </Link>
            )}
        </div>
    )
}