'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function NewLeadPage() {
    const router = useRouter()
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        propertyInterest: 'House',
        budget: '',
        notes: ''
    })
    const [loading, setLoading] = useState(false)
    const [score, setScore] = useState<string | null>(null)
    const [error, setError] = useState('')

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value } = e.target
        setFormData((prev) => ({ ...prev, [name]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setScore(null)

        try {
            setLoading(true)
            const response = await fetch('/api/leads', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    budget: parseFloat(formData.budget)
                })
            })

            if (!response.ok) {
                const data = await response.json()
                throw new Error(data.error || data.errors?.join(', ') || 'Failed to create lead')
            }

            const lead = await response.json()
            setScore(lead.score)

            setTimeout(() => {
                router.push('/admin/leads')
            }, 2000)
        } catch (err: any) {
            setError(err.message || 'Failed to create lead')
        } finally {
            setLoading(false)
        }
    }

    return (
        <main className="min-h-screen bg-slate-50 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-2xl space-y-6">
                <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
                    <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">Lead Pipeline</p>
                    <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-900">Create New Lead</h1>
                    <p className="mt-2 text-slate-600">Enter the contact information and property requirements for the new lead.</p>
                </div>

                {error && <div className="rounded-3xl border border-red-200 bg-red-50 p-4 text-red-800 shadow-sm">{error}</div>}

                {score && (
                    <div className="rounded-3xl border border-green-200 bg-green-50 p-4 text-green-800 shadow-sm">
                        Lead created! Priority: <strong>{score}</strong>. Redirecting...
                    </div>
                )}

                <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 md:p-8 shadow-sm space-y-5">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-2">
                            Name *
                        </label>
                        <input
                            id="name"
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                            Email *
                        </label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="phone" className="block text-sm font-medium text-slate-700 mb-2">
                            Phone *
                        </label>
                        <input
                            id="phone"
                            type="tel"
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="propertyInterest" className="block text-sm font-medium text-slate-700 mb-2">
                            Property Interest *
                        </label>
                        <select
                            id="propertyInterest"
                            name="propertyInterest"
                            value={formData.propertyInterest}
                            onChange={handleChange}
                            required
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        >
                            <option value="House">House</option>
                            <option value="Plot">Plot</option>
                            <option value="Apartment">Apartment</option>
                            <option value="Commercial">Commercial</option>
                            <option value="Other">Other</option>
                        </select>
                    </div>

                    <div>
                        <label htmlFor="budget" className="block text-sm font-medium text-slate-700 mb-2">
                            Budget (PKR) *
                        </label>
                        <input
                            id="budget"
                            type="number"
                            name="budget"
                            value={formData.budget}
                            onChange={handleChange}
                            required
                            min="0"
                            className="w-full rounded-xl border border-slate-300 bg-slate-50 px-4 py-2.5 text-sm text-slate-900 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500"
                        />
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

                    <div className="pt-2">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full rounded-xl bg-sky-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-sky-700 disabled:opacity-70"
                        >
                            {loading ? 'Creating...' : 'Create Lead'}
                        </button>
                    </div>
                </form>
            </div>
        </main>
    )
}
