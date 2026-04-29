'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import LeadTable from '@/components/leads/LeadTable'
import LeadFilters from '@/components/leads/LeadFilters'
import { useSocket } from '@/hooks/useSocket'
import { useToastContext } from '@/app/ToastProvider'
import { ILead } from '@/types/index'

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<ILead[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ status: '', priority: '', search: '' })
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

    // Socket event: new lead created
    useSocket('lead:created', useCallback((lead: ILead) => {
        setLeads(prev => [lead, ...prev])
        showToast(`New lead created: ${lead.name}`, 'info')
    }, [showToast]))

    // Socket event: lead updated
    useSocket('lead:updated', useCallback((lead: ILead) => {
        setLeads(prev => prev.map(l => l._id?.toString() === lead._id?.toString() ? lead : l))
    }, []))

    // Socket event: lead assigned
    useSocket('lead:assigned', useCallback(({ agentName }: { leadId: string; agentId: string; agentName: string }) => {
        showToast(`Lead assigned to ${agentName}`, 'success')
    }, [showToast]))

    const handleFilterChange = (newFilters: { status?: string; priority?: string; search?: string }) => {
        setFilters({
            status: newFilters.status || '',
            priority: newFilters.priority || '',
            search: newFilters.search || ''
        })
    }

    const handleDelete = async (id: string) => {
        try {
            const response = await fetch(`/api/leads/${id}`, { method: 'DELETE' })
            if (!response.ok) throw new Error('Failed to delete lead')

            setLeads(leads.filter((lead) => lead._id?.toString() !== id))
        } catch (error) {
            console.error('Error deleting lead:', error)
            alert('Failed to delete lead')
        }
    }

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Leads</h1>
                <Link href="/admin/leads/new" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
                    New Lead
                </Link>
            </div>

            <LeadFilters onFilterChange={handleFilterChange} />

            {loading ? (
                <div className="text-center py-4">Loading...</div>
            ) : (
                <LeadTable leads={leads} isAdmin={true} onDelete={handleDelete} onRefresh={fetchLeads} />
            )}
        </div>
    )
}
