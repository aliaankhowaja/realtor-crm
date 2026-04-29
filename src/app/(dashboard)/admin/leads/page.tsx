'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import LeadTable from '@/components/leads/LeadTable'
import LeadFilters from '@/components/leads/LeadFilters'
import { ILead } from '@/types/index'

export default function AdminLeadsPage() {
    const [leads, setLeads] = useState<ILead[]>([])
    const [loading, setLoading] = useState(true)
    const [filters, setFilters] = useState({ status: '', priority: '', search: '' })

    useEffect(() => {
        fetchLeads()
    }, [filters])

    const fetchLeads = async () => {
        try {
            setLoading(true)
            const params = new URLSearchParams()
            if (filters.status) params.append('status', filters.status)
            if (filters.priority) params.append('priority', filters.priority)
            if (filters.search) params.append('search', filters.search)

            const response = await fetch(`/api/leads?${params.toString()}`)
            if (!response.ok) throw new Error('Failed to fetch leads')

            const data = await response.json()
            setLeads(data)
        } catch (error) {
            console.error('Error fetching leads:', error)
            alert('Failed to load leads')
        } finally {
            setLoading(false)
        }
    }

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
