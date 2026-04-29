'use client'

import { useState } from 'react'

interface LeadFiltersProps {
  onFilterChange: (filters: { status?: string; priority?: string; search?: string }) => void
}

export default function LeadFilters({ onFilterChange }: LeadFiltersProps) {
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState('')
  const [priority, setPriority] = useState('')

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearch(value)
    onFilterChange({ search: value, status, priority })
  }

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setStatus(value)
    onFilterChange({ search, status: value, priority })
  }

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value
    setPriority(value)
    onFilterChange({ search, status, priority: value })
  }

  return (
    <div className="bg-white p-4 rounded border border-gray-300 mb-4">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label htmlFor="search" className="block text-sm font-medium mb-1">
            Search by name
          </label>
          <input
            id="search"
            type="text"
            placeholder="Enter lead name"
            value={search}
            onChange={handleSearchChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          />
        </div>

        <div>
          <label htmlFor="status" className="block text-sm font-medium mb-1">
            Status
          </label>
          <select
            id="status"
            value={status}
            onChange={handleStatusChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="New">New</option>
            <option value="Contacted">Contacted</option>
            <option value="In Progress">In Progress</option>
            <option value="Closed">Closed</option>
          </select>
        </div>

        <div>
          <label htmlFor="priority" className="block text-sm font-medium mb-1">
            Priority
          </label>
          <select
            id="priority"
            value={priority}
            onChange={handlePriorityChange}
            className="w-full px-3 py-2 border border-gray-300 rounded"
          >
            <option value="">All</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
    </div>
  )
}
