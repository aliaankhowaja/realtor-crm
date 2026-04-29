'use client'

import { useState, useEffect, useCallback } from 'react'
import { useSession } from 'next-auth/react'
import { useSearchParams } from 'next/navigation'
import LeadTable from '@/components/leads/LeadTable'
import LeadFilters from '@/components/leads/LeadFilters'
import { useSocket } from '@/hooks/useSocket'
import { useToastContext } from '@/app/ToastProvider'
import { ILead } from '@/types/index'

export default function AgentLeadsPage() {
    const [leads, setLeads] = useState<ILead[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ status: '', priority: '', search: '' })
    const { data: session } = useSession()
    const { showToast } = useToastContext()
    const searchParams = useSearchParams()
    const alertQuery = searchParams.toString()

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
    useSocket('lead:assigned', useCallback(({ agentId }: { leadId: string; agentId: string; agentName: string }) => {
        if (agentId === session?.user?.id) {
            void fetchLeads()
            showToast('A new lead has been assigned to you', 'info')
        }
    }, [fetchLeads, session?.user?.id, showToast]))

    const handleFilterChange = (newFilters: { status?: string; priority?: string; search?: string }) => {
        setFilters({
            status: newFilters.status || '',
            priority: newFilters.priority || '',
            search: newFilters.search || ''
        })
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">My Leads</h1>

            <LeadFilters onFilterChange={handleFilterChange} />

            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <LeadTable leads={leads} isAdmin={false} onRefresh={fetchLeads} />
            )}
        </div>
    )
}
