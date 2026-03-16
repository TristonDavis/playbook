import Link from 'next/link'
import { SignedIn, SignedOut } from '@clerk/nextjs'

export default function HomePage() {
  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* Nav */}
      <nav className="border-b border-border bg-surface px-8 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-text-primary rounded-[7px] flex items-center justify-center">
            <svg viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" width="14" height="14">
              <path d="M7 1L9.5 5.5H12.5L10 8.5L11 13L7 10.5L3 13L4 8.5L1.5 5.5H4.5L7 1Z"/>
            </svg>
          </div>
          <span className="text-[15px] font-semibold tracking-tight">
            Play<span className="font-serif italic font-normal">book</span>
          </span>
        </div>
        <div className="flex items-center gap-3">
          <SignedOut>
            <Link href="/auth/sign-in" className="btn-secondary text-sm py-1.5">Sign in</Link>
            <Link href="/auth/sign-up" className="btn-primary text-sm py-1.5">Get started free</Link>
          </SignedOut>
          <SignedIn>
            <Link href="/dashboard" className="btn-primary text-sm py-1.5">Go to dashboard →</Link>
          </SignedIn>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-accent-light text-accent text-xs font-semibold tracking-wider uppercase mb-8">
          Sports Analysis Workspace
        </div>

        <h1 className="font-serif text-5xl md:text-6xl tracking-tight text-text-primary mb-6 max-w-3xl leading-[1.1]">
          Your research,<br />
          <span className="italic">organized for game day.</span>
        </h1>

        <p className="text-text-secondary text-lg max-w-xl leading-relaxed mb-10">
          Playbook is a structured workspace for sports analysts, enthusiasts, and researchers.
          Build matchup studies, track your analysis accuracy, and get AI-powered insights — all in one place.
        </p>

        <div className="flex items-center gap-3">
          <Link href="/auth/sign-up" className="btn-primary px-6 py-3 text-base">
            Start for free
          </Link>
          <Link href="/auth/sign-in" className="btn-secondary px-6 py-3 text-base">
            Sign in
          </Link>
        </div>

        <p className="text-text-tertiary text-xs mt-6">No credit card required · Free to get started</p>
      </main>

      {/* Features */}
      <section className="border-t border-border bg-surface px-8 py-16">
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              icon: '📋',
              title: 'Study builder',
              desc: 'Rich note-taking with matchup cards, stats tables, tagging, and structured sport-specific metadata.',
            },
            {
              icon: '📊',
              title: 'Prediction tracker',
              desc: 'Log your analysis outcomes over time. Confidence calibration charts show you where your research is strongest.',
            },
            {
              icon: '✦',
              title: 'AI analysis',
              desc: 'Ask Claude to critique your study, identify blind spots, or surface historical patterns — right inside your notes.',
            },
          ].map(f => (
            <div key={f.title} className="flex flex-col gap-3">
              <div className="text-2xl">{f.icon}</div>
              <div className="font-semibold text-text-primary">{f.title}</div>
              <div className="text-text-secondary text-sm leading-relaxed">{f.desc}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="border-t border-border px-8 py-6 text-center text-text-tertiary text-xs">
        © {new Date().getFullYear()} Playbook. Built for sports analysis and research.
      </footer>
    </div>
  )
}
