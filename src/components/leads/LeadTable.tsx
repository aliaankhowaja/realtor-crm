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
        return 'bg-red-100 text-red-800 border-red-200'
      case 'Medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'Low':
        return 'bg-green-100 text-green-800 border-green-200'
      default:
        return 'bg-slate-100 text-slate-800 border-slate-200'
    }
  }

  const getRowHighlight = (score: string) => {
    return score === 'High' ? 'bg-red-50/50' : 'bg-white'
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
    <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Name</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Contact</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Interest</th>
              <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Status & Priority</th>
              {isAdmin && <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wider text-slate-500">Assigned To</th>}
              <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wider text-slate-500">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {leads.length === 0 ? (
              <tr>
                <td colSpan={isAdmin ? 6 : 5} className="px-6 py-12 text-center text-sm text-slate-500">
                  No leads found matching your criteria.
                </td>
              </tr>
            ) : (
              leads.map((lead) => (
                <tr key={lead._id?.toString()} className={`hover:bg-slate-50 transition-colors ${getRowHighlight(lead.score)}`}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="font-medium text-slate-900">{lead.name}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{lead.phone}</div>
                    <div className="text-xs text-slate-500">{lead.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-slate-900">{lead.propertyInterest}</div>
                    <div className="text-xs text-slate-500 font-medium">{formatBudget(lead.budget)}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex flex-col items-start gap-2">
                      <span className="inline-flex items-center rounded-full bg-slate-100 px-2.5 py-0.5 text-xs font-medium text-slate-800">
                        {lead.status}
                      </span>
                      <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${getPriorityBadgeClass(lead.score)}`}>
                        {lead.score}
                      </span>
                    </div>
                  </td>
                  {isAdmin && (
                    <td className="px-6 py-4 whitespace-nowrap">
                      {lead.assignedTo ? (
                        <div>
                          <div className="text-sm font-medium text-slate-900">{(lead.assignedTo as any)?.name || 'Unknown'}</div>
                          <div className="text-xs text-slate-500">{(lead.assignedTo as any)?.email}</div>
                        </div>
                      ) : (
                        <span className="text-sm italic text-slate-400">Unassigned</span>
                      )}
                    </td>
                  )}
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm">
                    <div className="flex justify-end gap-3 items-center">
                      <Link
                        href={isAdmin ? `/admin/leads/${lead._id}` : `/agent/leads/${lead._id}`}
                        className="font-medium text-sky-600 hover:text-sky-800 transition"
                      >
                        Edit
                      </Link>
                      <span className="text-slate-300">|</span>
                      <a
                        href={`https://wa.me/92${lead.phone.replace(/^0/, '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-green-600 hover:text-green-800 transition"
                      >
                        WhatsApp
                      </a>
                      {isAdmin && (
                        <>
                          <span className="text-slate-300">|</span>
                          <button
                            onClick={() => handleDelete(lead._id?.toString() || '')}
                            className="font-medium text-red-600 hover:text-red-800 transition"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
