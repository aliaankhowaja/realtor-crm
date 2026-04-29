interface SummaryCardsProps {
    totalLeads: number
    highPriorityCount: number
    closedThisMonth: number
    activeAgents: number
    labels?: [string, string, string, string]
}

const cards = [
    {
        label: 'Total Leads',
        key: 'totalLeads',
        icon: '📈',
        gradient: 'from-sky-500 to-cyan-500'
    },
    {
        label: 'High Priority',
        key: 'highPriorityCount',
        icon: '🔥',
        gradient: 'from-rose-500 to-red-500'
    },
    {
        label: 'Closed This Month',
        key: 'closedThisMonth',
        icon: '✅',
        gradient: 'from-emerald-500 to-teal-500'
    },
    {
        label: 'Active Agents',
        key: 'activeAgents',
        icon: '👥',
        gradient: 'from-amber-500 to-orange-500'
    }
] as const

export default function SummaryCards({
    totalLeads,
    highPriorityCount,
    closedThisMonth,
    activeAgents,
    labels
}: SummaryCardsProps) {
    const values = {
        totalLeads,
        highPriorityCount,
        closedThisMonth,
        activeAgents
    }

    return (
        <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
            {cards.map((card, index) => (
                <div
                    key={card.label}
                    className={`rounded-2xl bg-gradient-to-br ${card.gradient} p-5 text-white shadow-lg shadow-slate-200/60`}
                >
                    <div className="flex items-center justify-between">
                        <span className="text-2xl">{card.icon}</span>
                        <span className="rounded-full bg-white/20 px-2 py-1 text-xs font-medium uppercase tracking-wide">
                            Live
                        </span>
                    </div>
                    <div className="mt-6 text-4xl font-semibold tracking-tight">{values[card.key]}</div>
                    <div className="mt-2 text-sm font-medium text-white/90">{labels?.[index] ?? card.label}</div>
                </div>
            ))}
        </div>
    )
}
