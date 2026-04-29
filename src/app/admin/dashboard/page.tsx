'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'

import AgentPerformanceTable from '@/components/dashboard/AgentPerformanceTable'
import FollowUpAlerts from '@/components/dashboard/FollowUpAlerts'
import PriorityChart from '@/components/dashboard/PriorityChart'
import StatusChart from '@/components/dashboard/StatusChart'
import SummaryCards from '@/components/dashboard/SummaryCards'

type AnalyticsResponse = {
    totalLeads: number
    byStatus: { _id: string; count: number }[]
    byPriority: { _id: string; count: number }[]
    agentPerformance: { agentName: string; totalAssigned: number; closed: number }[]
    highPriorityCount: number
    closedThisMonth: number
}

export default function AdminDashboardPage() {
    const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        let active = true

        const fetchAnalytics = async () => {
            try {
                setLoading(true)
                setError('')

                const response = await fetch('/api/analytics')
                if (!response.ok) {
                    throw new Error('Failed to load analytics')
                }

                const data = (await response.json()) as AnalyticsResponse
                if (active) {
                    setAnalytics(data)
                }
            } catch {
                if (active) {
                    setError('Failed to load analytics dashboard.')
                }
            } finally {
                if (active) {
                    setLoading(false)
                }
            }
        }

        fetchAnalytics()

        return () => {
            active = false
        }
    }, [])

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <FollowUpAlerts leadsHref="/admin/leads" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">Analytics</p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Admin Dashboard</h1>
                        <p className="mt-2 text-slate-600">Track lead volume, pipeline health, and agent performance.</p>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-3 sm:mt-0">
                        <Link href="/admin/leads" className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-900 transition hover:bg-slate-200">
                            View Leads
                        </Link>
                        <Link href="/admin/leads/new" className="inline-flex rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700">
                            New Lead
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
                            Loading analytics...
                        </div>
                    </div>
                ) : error ? (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800 shadow-sm">{error}</div>
                ) : analytics ? (
                    <div className="space-y-6">
                        <SummaryCards
                            totalLeads={analytics.totalLeads}
                            highPriorityCount={analytics.highPriorityCount}
                            closedThisMonth={analytics.closedThisMonth}
                            activeAgents={analytics.agentPerformance.length}
                        />

                        <div className="grid gap-6 lg:grid-cols-2">
                            <StatusChart byStatus={analytics.byStatus} />
                            <PriorityChart byPriority={analytics.byPriority} />
                        </div>

                        <AgentPerformanceTable agents={analytics.agentPerformance} />
                    </div>
                ) : null}
            </div>
        </main>
    )
}