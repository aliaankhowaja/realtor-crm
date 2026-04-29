interface AgentPerformanceTableProps {
    agents: {
        agentName: string
        totalAssigned: number
        closed: number
    }[]
}

export default function AgentPerformanceTable({ agents }: AgentPerformanceTableProps) {
    return (
        <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 px-6 py-5">
                <h2 className="text-lg font-semibold text-slate-900">Agent Performance</h2>
                <p className="text-sm text-slate-500">Closed leads and conversion rate by agent</p>
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
                    <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                        <tr>
                            <th className="px-6 py-3 font-semibold">Agent Name</th>
                            <th className="px-6 py-3 font-semibold">Total Assigned</th>
                            <th className="px-6 py-3 font-semibold">Closed</th>
                            <th className="px-6 py-3 font-semibold">Conversion Rate</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-200 bg-white">
                        {agents.length > 0 ? (
                            agents.map((agent) => {
                                const conversionRate =
                                    agent.totalAssigned > 0 ? `${((agent.closed / agent.totalAssigned) * 100).toFixed(1)}%` : '0%'

                                return (
                                    <tr key={agent.agentName} className="hover:bg-slate-50/80">
                                        <td className="px-6 py-4 font-medium text-slate-900">{agent.agentName}</td>
                                        <td className="px-6 py-4 text-slate-700">{agent.totalAssigned}</td>
                                        <td className="px-6 py-4 text-slate-700">{agent.closed}</td>
                                        <td className="px-6 py-4 text-slate-700">{conversionRate}</td>
                                    </tr>
                                )
                            })
                        ) : (
                            <tr>
                                <td className="px-6 py-8 text-slate-500" colSpan={4}>
                                    No agent performance data available.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}
