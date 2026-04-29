'use client'

import { useState, useEffect, useCallback, Suspense } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import LeadTable from '@/components/leads/LeadTable'
import LeadFilters from '@/components/leads/LeadFilters'
import { useSocket } from '@/hooks/useSocket'
import { useToastContext } from '@/app/ToastProvider'
import { ILead } from '@/types/index'

function AgentLeadsContent() {
    const [leads, setLeads] = useState<ILead[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ status: '', priority: '', search: '' })
    const { data: session } = useSession()
    const { showToast } = useToastContext()
    const searchParams = useSearchParams()
    const alertQuery = searchParams?.toString() ?? ''

    const fetchLeads = useCallback(async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams(alertQuery)
            if (filters.status) params.append('status', filters.status)
            if (filters.priority) params.append('priority', filters.priority)
            if (filters.search) params.append('search', filters.search)

            const response = await fetch(`/api/leads?${params.toString()}`)
            if (!response.ok) throw new Error('Failed to fetch leads')

            const data = await response.json()
            setLeads(data)
        } catch (error: unknown) {
            console.error('Error fetching leads:', error)
            alert('Failed to load leads')
        } finally {
            setLoading(false)
        }
    }, [alertQuery, filters.priority, filters.search, filters.status])

    useEffect(() => {
        void Promise.resolve().then(() => fetchLeads())
    }, [fetchLeads])

    // Socket event: lead assigned to this agent
    useSocket('lead:assigned', useCallback((data: { leadId: string; agentId: string; agentName: string }) => {
        if (data.agentId === session?.user?.id) {
            void fetchLeads()
            showToast('A new lead has been assigned to you', 'info')
        } else if (leads.some(l => l._id?.toString() === data.leadId)) {
            void fetchLeads()
        }
    }, [fetchLeads, session?.user?.id, showToast, leads]))

    // Socket event: lead updated
    useSocket('lead:updated', useCallback((lead: ILead) => {
        setLeads(prev => prev.map(l => l._id?.toString() === lead._id?.toString() ? lead : l))
    }, []))

    const handleFilterChange = (newFilters: { status?: string; priority?: string; search?: string }) => {
        setFilters({
            status: newFilters.status || '',
            priority: newFilters.priority || '',
            search: newFilters.search || ''
        })
    }

    return (
        <div className="mx-auto max-w-7xl space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">My Pipeline</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Manage Leads</h1>
                    <p className="mt-2 text-slate-600">Search, filter, and update your assigned leads.</p>
                </div>
            </div>

            <LeadFilters onFilterChange={handleFilterChange} />

            {loading ? (
                <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
                    <div className="flex items-center gap-3 text-slate-600">
                        <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
                        Loading leads...
                    </div>
                </div>
            ) : (
                <LeadTable leads={leads} isAdmin={false} onRefresh={fetchLeads} />
            )}
        </div>
    )
}

export default function AgentLeadsPage() {
    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
            <Suspense fallback={
                <div className="mx-auto max-w-7xl space-y-6">
                    <div className="flex min-h-[320px] items-center justify-center rounded-3xl border border-slate-200 bg-white shadow-sm">
                        <div className="flex items-center gap-3 text-slate-600">
                            <div className="h-5 w-5 animate-spin rounded-full border-2 border-slate-300 border-t-sky-600" />
                            Loading...
                        </div>
                    </div>
                </div>
            }>
                <AgentLeadsContent />
            </Suspense>
        </main>
    )
}
