'use client'

import { ILead } from '@/types/index'
import Link from 'next/link'

interface LeadTableProps {
  leads: ILead[]
  isAdmin: boolean
  onDelete?: (id: string) => void
  onRefresh: () => void
}

export default function LeadTable({ leads, isAdmin, onDelete, onRefresh }: LeadTableProps) {
  const getPriorityBadgeClass = (score: string) => {
    switch (score) {
      case 'High':
        return 'bg-red-600 text-white'
      case 'Medium':
        return 'bg-yellow-500 text-gray-900'
      case 'Low':
        return 'bg-green-600 text-white'
      default:
        return 'bg-gray-400 text-white'
    }
  }

  const getRowHighlight = (score: string) => {
    return score === 'High' ? 'bg-red-50' : 'bg-white'
  }

  const handleDelete = (id: string) => {
    if (window.confirm('Are you sure you want to delete this lead?')) {
      onDelete?.(id)
    }
  }

  const formatBudget = (budget: number) => {
    return `PKR ${budget.toLocaleString('en-PK')}`
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="border border-gray-300 px-4 py-2 text-left">Name</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Email</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Phone</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Property Interest</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Budget</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Status</th>
            <th className="border border-gray-300 px-4 py-2 text-left">Priority</th>
            {isAdmin && <th className="border border-gray-300 px-4 py-2 text-left">Assigned To</th>}
            <th className="border border-gray-300 px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {leads.length === 0 ? (
            <tr>
              <td colSpan={isAdmin ? 9 : 8} className="border border-gray-300 px-4 py-2 text-center">
                No leads found
              </td>
            </tr>
          ) : (
            leads.map((lead) => (
              <tr key={lead._id?.toString()} className={getRowHighlight(lead.score)}>
                <td className="border border-gray-300 px-4 py-2">{lead.name}</td>
                <td className="border border-gray-300 px-4 py-2">{lead.email}</td>
                <td className="border border-gray-300 px-4 py-2">{lead.phone}</td>
                <td className="border border-gray-300 px-4 py-2">{lead.propertyInterest}</td>
                <td className="border border-gray-300 px-4 py-2">{formatBudget(lead.budget)}</td>
                <td className="border border-gray-300 px-4 py-2">{lead.status}</td>
                <td className="border border-gray-300 px-4 py-2">
                  <span className={`px-3 py-1 rounded ${getPriorityBadgeClass(lead.score)}`}>
                    {lead.score}
                  </span>
                </td>
                {isAdmin && (
                  <td className="border border-gray-300 px-4 py-2">
                    {lead.assignedTo ? (
                      <div>
                        <div className="font-medium">{(lead.assignedTo as any)?.name || 'Unknown'}</div>
                        <div className="text-sm text-gray-600">{(lead.assignedTo as any)?.email}</div>
                      </div>
                    ) : (
                      <span className="text-gray-500">Unassigned</span>
                    )}
                  </td>
                )}
                <td className="border border-gray-300 px-4 py-2">
                  <div className="flex gap-2 flex-wrap items-center">
                    <Link
                      href={isAdmin ? `/admin/leads/${lead._id}` : `/agent/leads/${lead._id}`}
                      className="text-blue-600 hover:underline text-sm"
                    >
                      View/Edit
                    </Link>
                    {isAdmin && (
                      <button
                        onClick={() => handleDelete(lead._id?.toString() || '')}
                        className="text-red-600 hover:underline text-sm"
                      >
                        Delete
                      </button>
                    )}
                    <a
                      href={`https://wa.me/92${lead.phone.replace(/^0/, '')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-green-600 hover:underline text-sm"
                    >
                      WhatsApp
                    </a>
                  </div>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  )
}
