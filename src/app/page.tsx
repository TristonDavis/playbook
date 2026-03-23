import Link from 'next/link'
import { auth } from '@clerk/nextjs/server'

// ─── Logo Mark ───────────────────────────────────────────────
function LogoMark({ size = 28 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
      <rect width="96" height="96" rx="22" fill="#2563EB" />
      <path d="M14 26 Q30 23 48 26 L48 70 Q30 67 14 70 Z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinejoin="round" />
      <path d="M48 26 Q66 23 82 26 L82 70 Q66 67 48 70 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinejoin="round" />
      <line x1="48" y1="26" x2="48" y2="70" stroke="rgba(255,255,255,0.55)" strokeWidth="3" />
      <circle cx="66" cy="56" r="4.5" fill="rgba(255,255,255,0.5)" />
      <circle cx="74" cy="40" r="4.5" fill="#93C5FD" />
      <path d="M66 56 Q66 40 74 42" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
    </svg>
  )
}

function Check({ color = '#4ADE80', bg = 'rgba(34,197,94,0.15)' }) {
  return (
    <svg className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" viewBox="0 0 14 14" fill="none">
      <circle cx="7" cy="7" r="7" fill={bg} />
      <path d="M4 7l2 2 4-4" stroke={color} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

const features = [
  {
    title: 'Prediction tracker',
    desc: 'Log every pick with sport, line, stake, and confidence. Track outcomes automatically.',
    iconColor: '#60A5FA', iconBg: 'rgba(37,99,235,0.12)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12" /></svg>,
  },
  {
    title: 'Performance analytics',
    desc: 'Win rate, ROI, and unit trends broken down by sport, bet type, and confidence level.',
    iconColor: '#4ADE80', iconBg: 'rgba(34,197,94,0.1)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10" /><line x1="12" y1="20" x2="12" y2="4" /><line x1="6" y1="20" x2="6" y2="14" /></svg>,
  },
  {
    title: 'Game studies',
    desc: 'Build a structured research library. Link studies directly to predictions.',
    iconColor: '#FCD34D', iconBg: 'rgba(245,158,11,0.1)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" /><polyline points="14 2 14 8 20 8" /><line x1="16" y1="13" x2="8" y2="13" /><line x1="16" y1="17" x2="8" y2="17" /></svg>,
  },
  {
    title: 'Live data sync',
    desc: 'Scores and results sync automatically so your tracker stays up to date.',
    iconColor: '#93C5FD', iconBg: 'rgba(96,165,250,0.1)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>,
  },
  {
    title: 'Multi-sport support',
    desc: 'NFL, NBA, MLB, and NHL with sport-specific fields and filters.',
    iconColor: '#C4B5FD', iconBg: 'rgba(167,139,250,0.1)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /></svg>,
  },
  {
    title: 'Bankroll protection',
    desc: 'Unit-based staking with streak alerts helps keep your bankroll disciplined.',
    iconColor: '#F87171', iconBg: 'rgba(239,68,68,0.1)',
    icon: <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /></svg>,
  },
]

const tiers = [
  {
    name: 'Free', price: '$0', desc: 'Everything you need to get started tracking your picks.',
    featured: false, cta: 'Get started free', ctaHref: '/auth/sign-up',
    ctaStyle: 'border border-pb-border2 bg-pb-surface2 text-pb-text hover:bg-pb-surface',
    checkColor: '#4ADE80', checkBg: 'rgba(34,197,94,0.15)',
    features: ['Up to 25 predictions / month', 'Basic win/loss tracking', '1 sport', '5 game studies'],
  },
  {
    name: 'Pro', price: '$12', desc: 'For analysts who track seriously across multiple sports.',
    featured: true, popular: true, cta: 'Start Pro free for 14 days', ctaHref: '/auth/sign-up',
    ctaStyle: 'bg-pb-blue text-white hover:bg-blue-700',
    checkColor: '#60A5FA', checkBg: 'rgba(96,165,250,0.15)',
    features: ['Unlimited predictions', 'Full analytics dashboard', 'All 4 sports', 'Unlimited game studies', 'Live data sync'],
  },
  {
    name: 'Elite', price: '$29', desc: 'For power users who want every edge and export capability.',
    featured: false, cta: 'Get Elite', ctaHref: '/auth/sign-up',
    ctaStyle: 'border border-pb-border2 bg-transparent text-pb-muted hover:bg-pb-surface',
    checkColor: '#FCD34D', checkBg: 'rgba(245,158,11,0.12)',
    features: ['Everything in Pro', 'Advanced ROI breakdowns', 'CSV / PDF export', 'Priority support'],
  },
]

// ─── Nav — server component reads auth state ──────────────────
async function Nav() {
  const { userId } = await auth()

  return (
    <nav className="sticky top-0 z-50 bg-pb-bg/95 backdrop-blur border-b border-pb-border h-14 flex items-center justify-between px-8">
      <div className="flex items-center gap-2.5">
        <LogoMark size={26} />
        <span className="text-[15px] font-medium tracking-tight text-pb-text">
          The <span className="text-pb-blue-lt">Playbook</span>
        </span>
      </div>

      <div className="hidden md:flex items-center gap-6">
        <a href="#features" className="text-[13px] text-pb-muted hover:text-pb-text transition-colors">Features</a>
        <a href="#pricing"  className="text-[13px] text-pb-muted hover:text-pb-text transition-colors">Pricing</a>
      </div>

      <div className="flex items-center gap-2">
        {userId ? (
          // ── Logged-in state ──────────────────────────────────
          <>
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-green-500/10 border border-green-500/20">
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
              <span className="text-[12px] font-medium text-green-400">Signed in</span>
            </div>
            <Link
              href="/dashboard"
              className="text-[13px] font-medium text-white px-4 py-1.5 rounded-lg bg-pb-blue hover:bg-blue-700 transition-colors"
            >
              Go to dashboard →
            </Link>
          </>
        ) : (
          // ── Logged-out state ─────────────────────────────────
          <>
            <Link
              href="/auth/sign-in"
              className="text-[13px] font-medium text-pb-muted px-3.5 py-1.5 rounded-lg border border-pb-border2 hover:bg-pb-surface hover:text-pb-text transition-colors"
            >
              Log in
            </Link>
            <Link
              href="/auth/sign-up"
              className="text-[13px] font-medium text-white px-4 py-1.5 rounded-lg bg-pb-blue hover:bg-blue-700 transition-colors"
            >
              Start free
            </Link>
          </>
        )}
      </div>
    </nav>
  )
}

// ─── Page ─────────────────────────────────────────────────────
export default async function LandingPage() {
  return (
    <div className="min-h-screen bg-pb-bg text-pb-text font-sans">

      <Nav />

      {/* ── HERO ── */}
      <section className="flex flex-col items-center text-center gap-5 px-8 pt-20 pb-16 border-b border-pb-border">
        <div className="inline-flex items-center gap-2 bg-blue-500/10 border border-blue-400/20 rounded-full px-4 py-1 text-[11px] font-medium text-pb-blue-lt tracking-wide">
          <span className="w-1.5 h-1.5 rounded-full bg-pb-blue-lt" />
          Free tier available · No credit card required
        </div>
        <h1 className="text-5xl font-medium tracking-[-0.03em] leading-[1.08] max-w-[560px]">
          Your edge,<br />
          <span className="text-pb-blue-lt">every game.</span>
        </h1>
        <p className="text-[16px] text-pb-muted leading-relaxed max-w-[440px]">
          Track predictions, study the tape, and analyze your performance across NFL, NBA, MLB, and more — all in one place.
        </p>
        <div className="flex gap-2.5 flex-wrap justify-center mt-1">
          <Link href="/auth/sign-up" className="text-[15px] font-medium text-white px-7 py-3 rounded-xl bg-pb-blue hover:bg-blue-700 transition-colors">
            Start for free
          </Link>
          <a href="#features" className="text-[15px] font-medium text-pb-muted px-6 py-3 rounded-xl border border-pb-border2 hover:bg-pb-surface hover:text-pb-text transition-colors">
            See how it works
          </a>
        </div>
        <p className="text-[11px] text-pb-hint">Free forever · Upgrade anytime · No credit card needed</p>
      </section>

      {/* ── DASHBOARD PREVIEW ── */}
      <div className="flex justify-center px-6 py-10 border-b border-pb-border bg-pb-bg">
        <div className="w-full max-w-2xl bg-pb-surface border border-pb-border2 rounded-2xl overflow-hidden">
          <div className="bg-[#0D1420] border-b border-pb-border px-4 py-2.5 flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-green-500" />
            <span className="ml-2 text-[11px] text-pb-hint font-mono">app.theplaybook.io/dashboard</span>
          </div>
          <div className="p-4 flex flex-col gap-3">
            <div className="grid grid-cols-4 gap-2">
              {[
                { lbl: 'Win rate', val: '68.4%', green: true,  delta: '+4.2% this month' },
                { lbl: 'ROI',      val: '+12.3u', green: true,  delta: '+2.1u this week' },
                { lbl: 'Record',   val: '34–16',  green: false, delta: '50 predictions' },
                { lbl: 'Streak',   val: 'W5',     green: true,  delta: 'Current run' },
              ].map((s) => (
                <div key={s.lbl} className="bg-pb-surface2 border border-pb-border rounded-lg p-2.5">
                  <div className="text-[9px] font-medium text-pb-hint uppercase tracking-wide">{s.lbl}</div>
                  <div className={`text-lg font-medium tracking-tight mt-0.5 ${s.green ? 'text-green-400' : 'text-pb-text'}`}>{s.val}</div>
                  <div className={`text-[9px] mt-0.5 ${s.green ? 'text-green-400' : 'text-pb-hint'}`}>{s.delta}</div>
                </div>
              ))}
            </div>
            {[
              { sport: 'bg-pb-blue',   title: 'Chiefs -3.5 vs Raiders',   meta: 'NFL · Sun 3:25 PM ET · 2u',       badge: 'Win',     bs: 'bg-green-500/10 text-green-400 border border-green-500/20' },
              { sport: 'bg-amber-400', title: 'Lakers ML vs Clippers',     meta: 'NBA · Tonight 10:00 PM ET · 1u',  badge: 'Pending', bs: 'bg-amber-400/10 text-yellow-300 border border-amber-400/20' },
              { sport: 'bg-green-500', title: 'Yankees O7.5 vs Red Sox',   meta: 'MLB · Sat 1:05 PM ET · 1.5u',    badge: 'Loss',    bs: 'bg-red-500/10 text-red-400 border border-red-500/20' },
            ].map((p) => (
              <div key={p.title} className="bg-pb-surface2 border border-pb-border rounded-lg px-3 py-2.5 flex items-center gap-2.5">
                <span className={`w-2 h-2 rounded-full flex-shrink-0 ${p.sport}`} />
                <div className="flex-1 min-w-0">
                  <div className="text-[12px] font-medium text-pb-text truncate">{p.title}</div>
                  <div className="text-[10px] text-pb-hint mt-0.5">{p.meta}</div>
                </div>
                <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full flex-shrink-0 ${p.bs}`}>{p.badge}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── SOCIAL PROOF ── */}
      <div className="bg-pb-surface border-b border-pb-border py-5 px-8 flex items-center justify-center gap-10 flex-wrap">
        {[
          { num: '4 sports',  lbl: 'NFL, NBA, MLB, NHL' },
          { num: '68.4%',     lbl: 'Avg tracked win rate' },
          { num: 'Free',      lbl: 'To get started' },
          { num: 'No lock-in', lbl: 'Upgrade or cancel anytime' },
        ].map((s, i, arr) => (
          <div key={s.num} className="flex items-center gap-10">
            <div className="text-center">
              <div className="text-xl font-medium text-pb-text tracking-tight">{s.num}</div>
              <div className="text-[11px] text-pb-hint mt-0.5">{s.lbl}</div>
            </div>
            {i < arr.length - 1 && <div className="w-px h-7 bg-pb-border2" />}
          </div>
        ))}
      </div>

      {/* ── FEATURES ── */}
      <section id="features" className="flex flex-col items-center gap-12 px-8 py-20 border-b border-pb-border bg-pb-bg">
        <div className="text-center flex flex-col gap-3">
          <p className="text-[11px] font-medium tracking-widest uppercase text-pb-blue-lt">Everything you need</p>
          <h2 className="text-3xl font-medium tracking-tight max-w-md leading-snug">Built for serious sports analysts</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3 w-full max-w-2xl">
          {features.map((f) => (
            <div key={f.title} className="bg-pb-surface border border-pb-border rounded-xl p-5">
              <div className="w-9 h-9 rounded-lg flex items-center justify-center mb-3" style={{ background: f.iconBg, color: f.iconColor }}>
                {f.icon}
              </div>
              <div className="text-[14px] font-medium text-pb-text mb-1.5">{f.title}</div>
              <div className="text-[12px] text-pb-muted leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" className="flex flex-col items-center gap-12 px-8 py-20 border-b border-pb-border bg-pb-surface">
        <div className="text-center flex flex-col gap-3">
          <p className="text-[11px] font-medium tracking-widest uppercase text-pb-blue-lt">Simple pricing</p>
          <h2 className="text-3xl font-medium tracking-tight leading-snug">Start free. Upgrade when you&apos;re ready.</h2>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 w-full max-w-2xl">
          {tiers.map((t) => (
            <div key={t.name} className={`rounded-2xl p-6 flex flex-col gap-4 ${ t.featured ? 'bg-[#0D1525] border border-blue-400/30' : 'bg-pb-bg border border-pb-border' }`}>
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className={`text-[13px] font-medium uppercase tracking-wider ${ t.featured ? 'text-pb-blue-lt' : 'text-pb-muted' }`}>{t.name}</span>
                  {t.popular && (
                    <span className="text-[10px] font-medium text-pb-blue-lt bg-blue-500/15 border border-blue-400/20 px-2 py-0.5 rounded-full">Most popular</span>
                  )}
                </div>
                <div className="text-[32px] font-medium tracking-tight leading-none">
                  {t.price} <span className="text-sm font-normal text-pb-hint">/ mo</span>
                </div>
                <p className="text-[12px] text-pb-muted mt-2 leading-relaxed">{t.desc}</p>
              </div>
              <div className="h-px bg-pb-border" />
              <ul className="flex flex-col gap-2">
                {t.features.map((f) => (
                  <li key={f} className={`flex items-start gap-2 text-[12px] leading-relaxed ${ t.featured ? 'text-pb-text' : 'text-pb-muted' }`}>
                    <Check color={t.checkColor} bg={t.checkBg} />
                    {f}
                  </li>
                ))}
              </ul>
              <Link href={t.ctaHref} className={`mt-auto w-full text-center py-2.5 rounded-lg text-[13px] font-medium transition-colors ${t.ctaStyle}`}>
                {t.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── FINAL CTA ── */}
      <section className="flex flex-col items-center gap-4 text-center px-8 py-20 bg-pb-bg">
        <p className="text-[11px] font-medium tracking-widest uppercase text-pb-blue-lt">Ready to level up?</p>
        <h2 className="text-[32px] font-medium tracking-tight max-w-xs leading-snug">Start tracking smarter today.</h2>
        <p className="text-[14px] text-pb-muted max-w-sm leading-relaxed">Join analysts using The Playbook to build an edge. Free to start, no credit card required.</p>
        <Link href="/auth/sign-up" className="mt-2 text-[15px] font-medium text-white px-8 py-3 rounded-xl bg-pb-blue hover:bg-blue-700 transition-colors">
          Create your free account
        </Link>
        <p className="text-[11px] text-pb-hint">Takes less than 60 seconds to set up.</p>
      </section>

      {/* ── FOOTER ── */}
      <footer className="bg-pb-surface border-t border-pb-border px-8 py-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <LogoMark size={20} />
          <span className="text-[13px] font-medium text-pb-muted">The <span className="text-pb-blue-lt">Playbook</span></span>
        </div>
        <div className="flex gap-5">
          {['Privacy', 'Terms', 'Contact'].map((l) => (
            <a key={l} href="#" className="text-[12px] text-pb-hint hover:text-pb-muted transition-colors">{l}</a>
          ))}
        </div>
        <p className="text-[11px] text-pb-hint">© 2026 The Playbook. All rights reserved.</p>
      </footer>

    </div>
  )
}
