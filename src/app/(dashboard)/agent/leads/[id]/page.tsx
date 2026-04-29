'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import { ILead } from '@/types/index'
import ActivityTimeline from '@/components/leads/ActivityTimeline'

export default function AgentLeadDetailPage() {
    const params = useParams()
    const leadId = params?.id as string

    const [lead, setLead] = useState<ILead | null>(null)
    const [formData, setFormData] = useState({
        status: 'New' as ILead['status'],
        notes: '',
        followUpDate: ''
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    const fetchLead = useCallback(async () => {
        try {
            setLoading(true)
            const response = await fetch(`/api/leads/${leadId}`)
            if (!response.ok) throw new Error('Lead not found')

            const data = await response.json()
            setLead(data)
            setFormData({
                status: data.status,
                notes: data.notes || '',
                followUpDate: data.followUpDate ? data.followUpDate.split('T')[0] : ''
            })
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to load lead')
        } finally {
            setLoading(false)
        }
    }, [leadId])

    useEffect(() => {
        void Promise.resolve().then(() => fetchLead())
    }, [fetchLead])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setSuccess('')

        try {
            setSaving(true)
            const response = await fetch(`/api/leads/${leadId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || data.errors?.join(', ') || 'Failed to update lead')
            }

            const updatedLead = await response.json()
            setLead(updatedLead)
            setSuccess('Lead updated successfully')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'Failed to update lead')
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="flex min-h-screen items-center justify-center bg-slate-50"><div className="h-8 w-8 animate-spin rounded-full border-4 border-slate-300 border-t-sky-600"></div></div>
    if (!lead) return <div className="flex min-h-screen items-center justify-center bg-slate-50 text-xl font-medium text-slate-500">Lead not found</div>

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-5xl space-y-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <div>
                        <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">Edit Lead</p>
                        <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">{lead.name}</h1>
                    </div>
                    <div className="mt-4 sm:mt-0">
                        <a
                            href={`https://wa.me/92${lead.phone.replace(/^0/, '')}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex rounded-full bg-emerald-100 px-6 py-2 text-sm font-medium text-emerald-700 transition hover:bg-emerald-200"
                        >
                            Message on WhatsApp
                        </a>
                    </div>
                </div>

                {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">{error}</div>}
                {success && <div className="rounded-3xl border border-green-200 bg-green-50 p-4 text-green-800 shadow-sm">{success}</div>}

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
                    <div className="space-y-6">
                        <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm space-y-5">
                            <h2 className="text-xl font-semibold text-slate-900 pb-2 border-b border-slate-100">Update Lead</h2>

                            <div>
                                <label htmlFor="status" className="block text-sm font-medium text-slate-700 mb-2">
                                    Status
                                </label>
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                >
                                    <option value="New">New</option>
                                    <option value="Contacted">Contacted</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Closed">Closed</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="notes" className="block text-sm font-medium text-slate-700 mb-2">
                                    Notes
                                </label>
                                <textarea
                                    id="notes"
                                    name="notes"
                                    value={formData.notes}
                                    onChange={handleChange}
                                    rows={4}
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                />
                            </div>

                            <div>
                                <label htmlFor="followUpDate" className="block text-sm font-medium text-slate-700 mb-2">
                                    Follow-up Date
                                </label>
                                <input
                                    id="followUpDate"
                                    type="date"
                                    name="followUpDate"
                                    value={formData.followUpDate}
                                    onChange={handleChange}
                                    className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                                />
                            </div>

                            <div className="pt-2">
                                <button
                                    type="submit"
                                    disabled={saving}
                                    className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-70"
                                >
                                    {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                            </div>
                        </form>
                    </div>

                    <div className="space-y-6">
                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-900 pb-2 border-b border-slate-100 mb-4">Lead Information</h2>
                            <div className="space-y-3 text-sm">
                                <p className="flex items-center justify-between">
                                    <span className="text-slate-500">Name</span>
                                    <span className="font-medium text-slate-900">{lead.name}</span>
                                </p>
                                <p className="flex items-center justify-between">
                                    <span className="text-slate-500">Email</span>
                                    <span className="font-medium text-slate-900">{lead.email}</span>
                                </p>
                                <p className="flex items-center justify-between">
                                    <span className="text-slate-500">Phone</span>
                                    <span className="font-medium text-slate-900">{lead.phone}</span>
                                </p>
                                <p className="flex items-center justify-between">
                                    <span className="text-slate-500">Interest</span>
                                    <span className="font-medium text-slate-900">{lead.propertyInterest}</span>
                                </p>
                                <p className="flex items-center justify-between">
                                    <span className="text-slate-500">Budget</span>
                                    <span className="font-medium text-slate-900">PKR {lead.budget.toLocaleString('en-PK')}</span>
                                </p>
                                <p className="flex items-center justify-between pt-2 border-t border-slate-100">
                                    <span className="text-slate-500">Priority</span>
                                    <span
                                        className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${lead.score === 'High' ? 'bg-red-100 text-red-800 border-red-200' : lead.score === 'Medium' ? 'bg-yellow-100 text-yellow-800 border-yellow-200' : 'bg-green-100 text-green-800 border-green-200'}`}
                                    >
                                        {lead.score}
                                    </span>
                                </p>
                                <p className="flex items-center justify-between">
                                    <span className="text-slate-500">Created</span>
                                    <span className="font-medium text-slate-900">{new Date(lead.createdAt).toLocaleDateString()}</span>
                                </p>
                                <p className="flex items-center justify-between">
                                    <span className="text-slate-500">Updated</span>
                                    <span className="font-medium text-slate-900">{new Date(lead.updatedAt).toLocaleDateString()}</span>
                                </p>
                            </div>
                        </div>

                        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                            <h2 className="text-xl font-semibold text-slate-900 pb-2 border-b border-slate-100 mb-4">Activity Timeline</h2>
                            <ActivityTimeline leadId={leadId} />
                        </div>
                    </div>
                </div>
            </div>
        </main>
    )
}
