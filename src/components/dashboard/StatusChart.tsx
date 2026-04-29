'use client'

import {
    Bar,
    BarChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis
} from 'recharts'

interface StatusChartProps {
    byStatus: { _id: string; count: number }[]
}

export default function StatusChart({ byStatus }: StatusChartProps) {
    const data = byStatus.map((item) => ({
        name: item._id || 'Unknown',
        count: item.count
    }))

    return (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4">
                <h2 className="text-lg font-semibold text-slate-900">Leads by Status</h2>
                <p className="text-sm text-slate-500">Current distribution across lead stages</p>
            </div>
            <ResponsiveContainer width="100%" height={300}>
                <BarChart data={data}>
                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                    <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#0EA5E9" radius={[8, 8, 0, 0]} />
                </BarChart>
            </ResponsiveContainer>
        </div>
    )
}
