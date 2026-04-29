'use client'

import { Bar, BarChart, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'

interface PriorityChartProps {
    byPriority: { _id: string; count: number }[]
}

const priorityColors: Record<string, string> = {
    High: '#EF4444',
    Medium: '#EAB308',
    Low: '#22C55E'
}

export default function PriorityChart({ byPriority }: PriorityChartProps) {
    const data = byPriority.map((item) => ({
        name: item._id || 'Unknown',
        count: item.count
    }))

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Leads by Priority</h2>
                <p className="text-sm text-slate-500">Priority score breakdown</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" radius={[8, 8, 0, 0]}>
                        {data.map((entry) => (
                            <Cell key={entry.name} fill={priorityColors[entry.name] ?? '#64748B'} />
                        ))}
                    </Bar>
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
