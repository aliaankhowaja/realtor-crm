export default function AdminDashboardPage() {
    return (
        <main className="min-h-screen bg-slate-950 px-6 py-16 text-white">
            <div className="mx-auto max-w-4xl rounded-3xl border border-white/10 bg-white/5 p-8">
                <p className="text-sm uppercase tracking-[0.35em] text-sky-300">Admin Dashboard</p>
                <h1 className="mt-4 text-4xl font-semibold tracking-tight">Admin access confirmed</h1>
                <p className="mt-4 max-w-2xl text-slate-300">
                    This is a placeholder dashboard route to verify the authentication redirect flow.
                </p>
            </div>
        </main>
    );
}