'use client'

import { useEffect, useState } from 'react'

interface AgentOption {
  _id: string
  name: string
  email: string
}

interface AssignLeadPanelProps {
  leadId: string
  currentAgentId: string | null
  onAssigned: () => void
}

export default function AssignLeadPanel({ leadId, currentAgentId, onAssigned }: AssignLeadPanelProps) {
  const [agents, setAgents] = useState<AgentOption[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedAgentId, setSelectedAgentId] = useState(currentAgentId ?? '')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  useEffect(() => {
    setSelectedAgentId(currentAgentId ?? '')
  }, [currentAgentId])

  useEffect(() => {
    const fetchAgents = async () => {
      try {
        setLoading(true)
        const response = await fetch('/api/users/agents')
        if (!response.ok) {
          throw new Error('Failed to load agents')
        }

        const data = await response.json()
        setAgents(data)
      } catch (err: any) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchAgents()
  }, [])

  const handleSave = async () => {
    setError('')
    setSuccess('')

    try {
      setSaving(true)
      const response = await fetch(`/api/leads/${leadId}/assign`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          agentId: selectedAgentId || null
        })
      })

      if (!response.ok) {
        const data = await response.json().catch(() => null)
        throw new Error(data?.error || 'Failed to save assignment')
      }

      setSuccess(selectedAgentId ? 'Lead assigned successfully' : 'Lead unassigned successfully')
      onAssigned()
      setTimeout(() => setSuccess(''), 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white p-6 rounded border border-gray-300 mb-4">
      <h3 className="text-xl font-bold mb-4">Assign Lead</h3>

      {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">{error}</div>}
      {success && <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">{success}</div>}

      <label htmlFor="agentId" className="block text-sm font-medium mb-1">
        Agent
      </label>
      <select
        id="agentId"
        value={selectedAgentId}
        onChange={(e) => setSelectedAgentId(e.target.value)}
        disabled={loading || saving}
        className="w-full px-3 py-2 border border-gray-300 rounded mb-4"
      >
        <option value="">Unassigned</option>
        {agents.map((agent) => (
          <option key={agent._id} value={agent._id}>
            {agent.name} ({agent.email})
          </option>
        ))}
      </select>

      <button
        type="button"
        onClick={handleSave}
        disabled={loading || saving}
        className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
      >
        {saving ? 'Saving...' : 'Save Assignment'}
      </button>
    </div>
  )
}