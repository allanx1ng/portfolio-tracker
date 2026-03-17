import Link from "next/link"
import Badge from "@/components/ui/Badge"
import Section from "@/components/ui/Section"

export default function Home() {
  return (
    <div className="-mx-16 -mt-24 -mb-16">

      {/* ── HERO ─────────────────────────────────────────────── */}
      <section className="relative overflow-hidden bg-gradient-to-br from-white to-emerald-50 px-6 py-24 min-h-screen flex flex-col items-center justify-center">

        {/* Decorative blobs */}
        <div className="absolute -top-32 -right-32 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-80 h-80 bg-teal-200/20 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-4xl mx-auto text-center">

          {/* Emerald stat hint — introduces emerald naturally + shows app value */}
          <div className="inline-flex items-center gap-2.5 bg-white border border-gray-200 rounded-xl shadow-sm px-4 py-2.5 mb-6">
            <div className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-sm text-gray-500 font-normal">Portfolio up</span>
            <span className="text-sm font-bold text-emerald-600">+12.4%</span>
            <span className="text-sm text-gray-400 font-normal">this year</span>
          </div>

          {/* Beta badge */}
          <div className="mb-8">
            <Badge variant="primary" dot>Now in Beta</Badge>
          </div>

          {/* Main headline */}
          <h1 className="text-6xl sm:text-7xl font-bold tracking-tight text-gray-900 leading-tight mb-6">
            All your investments,{" "}
            <span className="bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
              one place
            </span>
          </h1>

          {/* Subtext */}
          <p className="text-lg text-gray-500 font-normal max-w-xl mx-auto mb-10 leading-relaxed">
            Connect every bank and brokerage account. Track holdings, gains, and
            allocation across your entire portfolio — updated in real time.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/signup"
              className="inline-flex items-center justify-center px-7 py-3.5 bg-action-primary text-white font-semibold rounded-lg hover:bg-action-primary/90 transition-colors text-base"
            >
              Get Started Free
            </Link>
            <a
              href="#features"
              className="inline-flex items-center justify-center px-7 py-3.5 border border-gray-300 text-gray-700 font-semibold rounded-lg hover:bg-gray-50 transition-colors text-base"
            >
              See Features
            </a>
          </div>

          {/* Dark dashboard mockup */}
          <div className="w-full rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
            {/* Browser chrome */}
            <div className="bg-slate-800 px-4 py-3 flex items-center gap-2 border-b border-slate-700">
              <div className="w-3 h-3 rounded-full bg-red-500/70" />
              <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
              <div className="w-3 h-3 rounded-full bg-green-500/70" />
              <div className="flex-1 mx-4 bg-slate-700 rounded h-5 max-w-xs" />
            </div>
            {/* Dashboard body */}
            <div className="bg-slate-900 p-6 space-y-4">
              {/* Stat cards row */}
              <div className="grid grid-cols-3 gap-3">
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="h-2.5 w-14 bg-slate-600 rounded mb-3" />
                  <div className="h-6 w-24 bg-emerald-500/40 rounded" />
                </div>
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="h-2.5 w-14 bg-slate-600 rounded mb-3" />
                  <div className="h-6 w-20 bg-emerald-500/40 rounded" />
                </div>
                <div className="bg-slate-800 rounded-xl p-4">
                  <div className="h-2.5 w-14 bg-slate-600 rounded mb-3" />
                  <div className="h-6 w-20 bg-slate-600 rounded" />
                </div>
              </div>
              {/* Bar chart */}
              <div className="bg-slate-800 rounded-xl p-4 h-36 flex items-end gap-1.5 overflow-hidden">
                {[40, 55, 45, 70, 60, 85, 70, 90, 78, 95, 82, 100].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t"
                    style={{
                      height: `${h}%`,
                      background: i % 4 === 0
                        ? "rgba(5,150,105,0.7)"
                        : "rgba(5,150,105,0.25)",
                    }}
                  />
                ))}
              </div>
              {/* Holdings rows */}
              <div className="space-y-2">
                {[1, 2, 3].map(i => (
                  <div key={i} className="bg-slate-800 rounded-lg px-4 py-3 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-7 h-7 rounded-full bg-slate-600" />
                      <div className="h-2.5 w-20 bg-slate-600 rounded" />
                    </div>
                    <div className="h-2.5 w-16 bg-slate-600 rounded" />
                    <div className="h-2.5 w-14 bg-emerald-500/40 rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* ── STATS BAR ─────────────────────────────────────────── */}
      <section className="bg-gray-50 border-y border-gray-200 py-8 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-0 md:divide-x md:divide-gray-200 text-center">
            {[
              { stat: "Any bank",     label: "Connect any institution" },
              { stat: "Plaid",        label: "Powered by Plaid" },
              { stat: "Free",         label: "No cost during beta" },
              { stat: "Real-time",    label: "Live data sync" },
            ].map(({ stat, label }) => (
              <div key={label} className="px-6">
                <p className="text-xl font-bold text-text-primary">{stat}</p>
                <p className="text-sm text-text-secondary mt-1 font-normal">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ─────────────────────────────────────────── */}
      <Section variant="light" id="features">
        {/* Section header */}
        <div className="text-center mb-14">
          <p className="section-label mb-3">Features</p>
          <h2 className="section-heading mb-4">Everything your portfolio needs</h2>
          <p className="body-text max-w-xl mx-auto">
            One dashboard to see the full picture — across every account, every institution, every asset class.
          </p>
        </div>

        {/* Feature cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">

          {/* Connect */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-action-primaryLight rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-action-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Connect Everything</h3>
            <p className="body-text">
              Link your banks, brokerages, and investment accounts through Plaid's secure, read-only connection. No credentials stored.
            </p>
          </div>

          {/* Track — uses teal icon to differentiate from primary emerald */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-teal-50 rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-teal-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Track in Real Time</h3>
            <p className="body-text">
              See live holdings, unrealized gains and losses, cost basis, and current prices across every account you've connected.
            </p>
          </div>

          {/* Understand */}
          <div className="bg-gray-50 rounded-2xl p-8 border border-gray-100 hover:shadow-md transition-shadow">
            <div className="w-12 h-12 bg-action-primaryLight rounded-xl flex items-center justify-center mb-5">
              <svg className="w-6 h-6 text-action-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 3.055A9.001 9.001 0 1020.945 13H11V3.055z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.488 9H15V3.512A9.025 9.025 0 0120.488 9z" />
              </svg>
            </div>
            <h3 className="text-xl font-bold text-text-primary mb-3">Understand Your Portfolio</h3>
            <p className="body-text">
              Allocation charts, breakdowns by institution, and at-a-glance metrics give you a clear picture of where your money is.
            </p>
          </div>

        </div>
      </Section>

      {/* ── HOW IT WORKS ─────────────────────────────────────── */}
      <Section variant="alt">
        <div className="text-center mb-14">
          <p className="section-label mb-3">How It Works</p>
          <h2 className="section-heading">Up and running in minutes</h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {/* Connector line (desktop only) */}
          <div className="hidden md:block absolute top-6 left-[calc(16.67%+24px)] right-[calc(16.67%+24px)] h-px bg-gray-300" />

          {[
            {
              n: "1",
              title: "Connect your accounts",
              body: "Use Plaid's secure flow to link your bank or brokerage account in under two minutes.",
            },
            {
              n: "2",
              title: "We sync your holdings",
              body: "AppName automatically fetches your holdings, prices, and account details — and keeps them current.",
            },
            {
              n: "3",
              title: "Analyze and track",
              body: "See your full portfolio in one place — allocation charts, gains, losses, net worth, and more.",
            },
          ].map(({ n, title, body }) => (
            <div key={n} className="relative flex flex-col items-center text-center">
              <div className="w-12 h-12 rounded-full bg-action-primary text-white flex items-center justify-center text-lg font-bold mb-5 z-10 relative">
                {n}
              </div>
              <h3 className="text-lg font-bold text-text-primary mb-2">{title}</h3>
              <p className="body-sm">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      {/* ── DASHBOARD PREVIEW ─────────────────────────────────── */}
      <Section variant="alt">
        <div className="text-center mb-12">
          <p className="section-label mb-3">The Dashboard</p>
          <h2 className="section-heading mb-4">Powerful insights, simple interface</h2>
          <p className="body-text max-w-xl mx-auto">
            Every metric you need, exactly where you need it. No noise, no clutter — just your portfolio.
          </p>
        </div>

        {/* Larger detailed mockup */}
        <div className="w-full rounded-2xl overflow-hidden border border-gray-200 shadow-2xl">
          {/* Browser chrome */}
          <div className="bg-slate-800 px-5 py-3.5 flex items-center gap-2 border-b border-slate-700">
            <div className="w-3 h-3 rounded-full bg-red-500/70" />
            <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
            <div className="w-3 h-3 rounded-full bg-green-500/70" />
            <div className="flex-1 mx-6 bg-slate-700 rounded-md h-5 max-w-sm" />
          </div>
          {/* Dashboard content */}
          <div className="bg-slate-900 p-8 space-y-6">
            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-5">
              {[
                { accent: "bg-emerald-500/30", w: "w-28" },
                { accent: "bg-teal-500/30", w: "w-20" },
                { accent: "bg-slate-600", w: "w-24" },
              ].map(({ accent, w }, i) => (
                <div key={i} className="bg-slate-800 rounded-xl p-5">
                  <div className="h-2.5 w-20 bg-slate-600 rounded mb-4" />
                  <div className={`h-7 ${w} ${accent} rounded-md`} />
                </div>
              ))}
            </div>
            {/* Chart + allocation */}
            <div className="grid grid-cols-3 gap-5">
              <div className="col-span-2 bg-slate-800 rounded-xl p-5 h-52 flex flex-col justify-between">
                <div className="h-2.5 w-32 bg-slate-600 rounded" />
                <div className="flex items-end gap-1.5 h-36">
                  {[50, 38, 68, 48, 80, 62, 88, 72, 95, 78, 92, 85].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 rounded-t"
                      style={{
                        height: `${h}%`,
                        background: i % 3 === 0
                          ? "rgba(5,150,105,0.65)"
                          : "rgba(5,150,105,0.22)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-slate-800 rounded-xl p-5 space-y-3">
                <div className="h-2.5 w-24 bg-slate-600 rounded mb-2" />
                {[
                  { w: "w-full", color: "bg-emerald-500/50" },
                  { w: "w-4/5",  color: "bg-emerald-500/50" },
                  { w: "w-3/5",  color: "bg-amber-500/50" },
                  { w: "w-2/5",  color: "bg-rose-500/50" },
                ].map(({ w, color }, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <div className="flex-1 h-2 bg-slate-700 rounded-full overflow-hidden">
                      <div className={`${w} h-full ${color} rounded-full`} />
                    </div>
                    <div className="h-2 w-10 bg-slate-600 rounded" />
                  </div>
                ))}
              </div>
            </div>
            {/* Holdings rows */}
            <div className="space-y-2">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-slate-800 rounded-lg px-5 py-3.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-slate-600" />
                    <div className="space-y-1.5">
                      <div className="h-2.5 w-20 bg-slate-500 rounded" />
                      <div className="h-2 w-14 bg-slate-600 rounded" />
                    </div>
                  </div>
                  <div className="h-2.5 w-16 bg-slate-600 rounded" />
                  <div className="h-2.5 w-14 bg-slate-600 rounded" />
                  <div className="h-2.5 w-16 bg-emerald-500/40 rounded" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </Section>

      {/* ── CTA BANNER ───────────────────────────────────────── */}
      <section className="bg-action-primary py-20 px-6">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-4">
            Start tracking your portfolio today
          </h2>
          <p className="text-emerald-100 font-normal mb-10 text-base">
            Free during beta. No credit card required. Connect your first account in minutes.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center justify-center px-8 py-4 bg-white text-action-primary font-bold rounded-lg hover:bg-white/90 transition-colors text-base"
          >
            Get Started Free
          </Link>
        </div>
      </section>

    </div>
  )
}
