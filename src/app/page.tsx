export default function Home() {
  return (
    <div className="min-h-screen bg-[radial-gradient(circle_at_top,_#dbeafe,_#eff6ff_40%,_#f8fafc)] px-4 py-12 text-slate-900">
      <main className="mx-auto flex min-h-[calc(100vh-6rem)] w-full max-w-5xl items-center justify-center">
        <section className="grid w-full gap-8 rounded-[2rem] border border-white/70 bg-white/85 p-8 shadow-2xl shadow-slate-300/50 backdrop-blur md:grid-cols-[1.3fr_0.7fr] md:p-12">
          <div className="space-y-6">
            <p className="text-sm font-semibold uppercase tracking-[0.35em] text-sky-600">
              Realtor CRM
            </p>
            <h1 className="max-w-xl text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
              Manage leads, owners, and follow-ups from one focused workspace.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Sign in as an admin or agent to continue into the CRM. New users can register as
              agents through the signup flow.
            </p>

            <div className="flex flex-col gap-3 sm:flex-row">
              <a
                href="/login"
                className="inline-flex h-12 items-center justify-center rounded-2xl bg-slate-950 px-6 text-sm font-semibold text-white transition hover:bg-slate-800"
              >
                Login
              </a>
              <a
                href="/signup"
                className="inline-flex h-12 items-center justify-center rounded-2xl border border-slate-200 bg-white px-6 text-sm font-semibold text-slate-900 transition hover:border-slate-300 hover:bg-slate-50"
              >
                Sign up
              </a>
            </div>
          </div>

          <div className="flex items-end">
            <div className="w-full rounded-[1.75rem] border border-slate-200 bg-slate-950 p-6 text-white shadow-xl shadow-slate-400/40">
              <p className="text-sm uppercase tracking-[0.3em] text-sky-300">Session flow</p>
              <div className="mt-6 space-y-4 text-sm text-slate-200">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Sign up as agent
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Login with role-based JWT
                </div>
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                  Redirect to the correct dashboard
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
