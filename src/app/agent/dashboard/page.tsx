'use client'

import Link from 'next/link'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { useSession } from 'next-auth/react'
import { useToastContext } from '@/app/ToastProvider'
import { useSocket } from '@/hooks/useSocket'

import FollowUpAlerts from '@/components/dashboard/FollowUpAlerts'
import SummaryCards from '@/components/dashboard/SummaryCards'

type LeadRecord = {
    _id: string
    name: string
    status: string
    score: string
    createdAt?: string
}

export default function AgentDashboardPage() {
    const [leads, setLeads] = useState<LeadRecord[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    const { data: session } = useSession()
    const { showToast } = useToastContext()

    const fetchLeads = useCallback(async () => {
        try {
            setLoading(true)
            setError('')

            const response = await fetch('/api/leads')
            if (!response.ok) {
                throw new Error('Failed to load leads')
            }

            const data = (await response.json()) as LeadRecord[]
            setLeads(data)
        } catch {
            setError('Failed to load your dashboard.')
        } finally {
            setLoading(false)
        }
    }, [])

    useEffect(() => {
        void fetchLeads()
    }, [fetchLeads])

    useSocket('lead:assigned', useCallback((data: any) => {
        if (data.agentId === session?.user?.id) {
            void fetchLeads()
            showToast('A new lead has been assigned to you', 'info')
        } else if (leads.some(l => l._id === data.leadId)) {
            // It was assigned away from this agent
            void fetchLeads()
        }
    }, [fetchLeads, session?.user?.id, showToast, leads]))

    useSocket('lead:updated', useCallback((lead: any) => {
        setLeads(prev => prev.map(l => l._id === lead._id ? lead : l))
    }, []))

    const metrics = useMemo(() => {
        const totalLeads = leads.length
        const newCount = leads.filter((lead) => lead.status === 'New').length
        const inProgressCount = leads.filter((lead) => lead.status === 'In Progress').length
        const closedCount = leads.filter((lead) => lead.status === 'Closed').length

        return {
            totalLeads,
            newCount,
            inProgressCount,
            closedCount
        }
    }, [leads])

    const recentLeads = [...leads]
        .sort((a, b) => {
            const aDate = a.createdAt ? new Date(a.createdAt).getTime() : 0
            const bDate = b.createdAt ? new Date(b.createdAt).getTime() : 0
            return bDate - aDate
        })
        .slice(0, 5)

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-6 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-7xl space-y-6">
                <FollowUpAlerts leadsHref="/agent/leads" />

                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">My Pipeline</p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Agent Dashboard</h1>
                        <p className="mt-2 text-slate-600">Review your assigned leads and recent activity at a glance.</p>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <Link href="/agent/leads" className="inline-flex rounded-full bg-sky-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-sky-700">
                            View All Leads
                        </Link>
                    </div>
                </div>

                {loading ? (
                    <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
                            Loading your dashboard...
                        </div>
                    </div>
                ) : error ? (
                    <div className="rounded-3xl border border-red-200 bg-red-50 p-6 text-red-800 shadow-sm">{error}</div>
                ) : (
                    <div className="space-y-6">
                        <SummaryCards
                            totalLeads={metrics.totalLeads}
                            highPriorityCount={metrics.newCount}
                            closedThisMonth={metrics.inProgressCount}
                            activeAgents={metrics.closedCount}
                            labels={['My Leads', 'New', 'In Progress', 'Closed']}
                        />

                        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
                            <div className="border-b border-slate-200 px-6 py-5">
                                <h2 className="text-lg font-semibold text-slate-900">Recent Leads</h2>
                                <p className="text-sm text-slate-500">Your 5 most recent leads</p>
                            </div>

                            <div className="overflow-x-auto">
                                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                                        <tr>
                                            <th className="px-6 py-3 font-semibold">Lead</th>
                                            <th className="px-6 py-3 font-semibold">Status</th>
                                            <th className="px-6 py-3 font-semibold">Priority</th>
                                            <th className="px-6 py-3 font-semibold">Action</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 bg-white">
                                        {recentLeads.length > 0 ? (
                                            recentLeads.map((lead) => (
                                                <tr key={lead._id} className="hover:bg-slate-50/80">
                                                    <td className="px-6 py-4 font-medium text-slate-900">{lead.name}</td>
                                                    <td className="px-6 py-4 text-slate-700">{lead.status}</td>
                                                    <td className="px-6 py-4 text-slate-700">{lead.score}</td>
                                                    <td className="px-6 py-4">
                                                        <Link
                                                            href={`/agent/leads/${lead._id}`}
                                                            className="inline-flex items-center rounded-full bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
                                                        >
                                                            View
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td className="px-6 py-8 text-slate-500" colSpan={4}>
                                                    No leads found.
                                                </td>
                                            </tr>
                                        )}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </main>
    )
}