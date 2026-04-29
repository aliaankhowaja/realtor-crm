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
        <div className="p-6 max-w-2xl mx-auto">
            <h1 className="text-3xl font-bold mb-6">Create New Lead</h1>

            {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}

            {score && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    Lead created! Priority: <strong>{score}</strong>. Redirecting...
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white p-6 rounded border border-gray-300">
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium mb-1">
                        Name *
                    </label>
                    <input
                        id="name"
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email *
                    </label>
                    <input
                        id="email"
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium mb-1">
                        Phone *
                    </label>
                    <input
                        id="phone"
                        type="tel"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="propertyInterest" className="block text-sm font-medium mb-1">
                        Property Interest *
                    </label>
                    <select
                        id="propertyInterest"
                        name="propertyInterest"
                        value={formData.propertyInterest}
                        onChange={handleChange}
                        required
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="House">House</option>
                        <option value="Plot">Plot</option>
                        <option value="Apartment">Apartment</option>
                        <option value="Commercial">Commercial</option>
                        <option value="Other">Other</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="budget" className="block text-sm font-medium mb-1">
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
                        className="w-full px-3 py-2 border border-gray-300 rounded"
                    />
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

                <button
                    type="submit"
                    disabled={loading}
                    className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Creating...' : 'Create Lead'}
                </button>
            </form>
        </div>
    )
}
