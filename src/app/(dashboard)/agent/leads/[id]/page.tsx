'use client'

import { useState, useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { ILead } from '@/types/index'

export default function AgentLeadDetailPage() {
    const router = useRouter()
    const params = useParams()
    const leadId = params.id as string

    const [lead, setLead] = useState<ILead | null>(null)
    const [formData, setFormData] = useState({
        status: 'New' as any,
        notes: '',
        followUpDate: ''
    })
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')

    useEffect(() => {
        fetchLead()
    }, [])

    const fetchLead = async () => {
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
        } catch (err: any) {
            setError(err.message)
        } finally {
            setLoading(false)
        }
    }

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
        } catch (err: any) {
            setError(err.message)
        } finally {
            setSaving(false)
        }
    }

    if (loading) return <div className="p-6">Loading...</div>
    if (!lead) return <div className="p-6 text-red-600">Lead not found</div>

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">{lead.name}</h1>
                <a
                    href={`https://wa.me/92${lead.phone.replace(/^0/, '')}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                >
                    WhatsApp
                </a>
            </div>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
            {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

            <div className="grid grid-cols-2 gap-6">
                <div>
                    <h2 className="text-2xl font-bold mb-4">Update Lead</h2>
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded border border-gray-300">
                        <div className="mb-4">
                            <label htmlFor="status" className="block text-sm font-medium mb-1">
                                Status
                            </label>
                            <select
                                id="status"
                                name="status"
                                value={formData.status}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            >
                                <option value="New">New</option>
                                <option value="Contacted">Contacted</option>
                                <option value="In Progress">In Progress</option>
                                <option value="Closed">Closed</option>
                            </select>
                        </div>

                        <div className="mb-4">
                            <label htmlFor="notes" className="block text-sm font-medium mb-1">
                                Notes
                            </label>
                            <textarea
                                id="notes"
                                name="notes"
                                value={formData.notes}
                                onChange={handleChange}
                                rows={4}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="followUpDate" className="block text-sm font-medium mb-1">
                                Follow-up Date
                            </label>
                            <input
                                id="followUpDate"
                                type="date"
                                name="followUpDate"
                                value={formData.followUpDate}
                                onChange={handleChange}
                                className="w-full px-3 py-2 border border-gray-300 rounded"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={saving}
                            className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </form>
                </div>

                <div>
                    <h2 className="text-2xl font-bold mb-4">Lead Information</h2>
                    <div className="bg-white p-6 rounded border border-gray-300 mb-4">
                        <p className="mb-3">
                            <strong>Name:</strong> {lead.name}
                        </p>
                        <p className="mb-3">
                            <strong>Email:</strong> {lead.email}
                        </p>
                        <p className="mb-3">
                            <strong>Phone:</strong> {lead.phone}
                        </p>
                        <p className="mb-3">
                            <strong>Property Interest:</strong> {lead.propertyInterest}
                        </p>
                        <p className="mb-3">
                            <strong>Budget:</strong> PKR {lead.budget.toLocaleString('en-PK')}
                        </p>
                        <p className="mb-3">
                            <strong>Priority:</strong>{' '}
                            <span
                                className={`px-3 py-1 rounded ${lead.score === 'High' ? 'bg-red-600 text-white' : lead.score === 'Medium' ? 'bg-yellow-500 text-gray-900' : 'bg-green-600 text-white'}`}
                            >
                                {lead.score}
                            </span>
                        </p>
                        <p className="mb-3">
                            <strong>Created:</strong> {new Date(lead.createdAt).toLocaleDateString()}
                        </p>
                        <p className="mb-3">
                            <strong>Updated:</strong> {new Date(lead.updatedAt).toLocaleDateString()}
                        </p>
                    </div>

                    <h3 className="text-xl font-bold mb-4">Activity Timeline</h3>
                    <div className="bg-white p-6 rounded border border-gray-300">
                        <p className="text-gray-500">Activity timeline will be available in Module 8</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
