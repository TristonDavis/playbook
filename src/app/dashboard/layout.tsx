import { UserButton } from '@clerk/nextjs'
import Link from 'next/link'
import { LayoutGrid, TrendingUp, Star, FileText, BarChart2 } from 'lucide-react'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar */}
      <aside className="w-[260px] bg-surface border-r border-border flex flex-col flex-shrink-0">
        {/* Logo + new study */}
        <div className="px-4 pt-5 pb-3.5 border-b border-border/60">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-7 h-7 bg-text-primary rounded-[7px] flex items-center justify-center flex-shrink-0">
              <svg viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" width="14" height="14">
                <path d="M7 1L9.5 5.5H12.5L10 8.5L11 13L7 10.5L3 13L4 8.5L1.5 5.5H4.5L7 1Z"/>
              </svg>
            </div>
            <span className="text-[15px] font-semibold tracking-tight">
              Play<span className="font-serif italic font-normal">book</span>
            </span>
          </div>
          <Link
            href="/dashboard/study/new"
            className="btn-primary w-full justify-center text-[13px] py-2"
          >
            <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" width="13" height="13">
              <line x1="8" y1="3" x2="8" y2="13"/><line x1="3" y1="8" x2="13" y2="8"/>
            </svg>
            New Study
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 py-3 space-y-0.5">
          <p className="text-[10px] font-semibold tracking-widest uppercase text-text-tertiary px-2 mb-1 mt-1">Workspace</p>
          <NavItem href="/dashboard" icon={<LayoutGrid size={15}/>} label="All Studies" />
          <NavItem href="/dashboard/tracker" icon={<TrendingUp size={15}/>} label="Prediction Tracker" />
          <NavItem href="/dashboard/pinned" icon={<Star size={15}/>} label="Pinned" />

          <p className="text-[10px] font-semibold tracking-widest uppercase text-text-tertiary px-2 mb-1 mt-4">Study Type</p>
          <NavItem href="/dashboard?type=matchup" icon={<FileText size={15}/>} label="Matchup Analysis" />
          <NavItem href="/dashboard?type=stats" icon={<BarChart2 size={15}/>} label="Stats & Trends" />
          <NavItem href="/dashboard?type=analysis" icon={<FileText size={15}/>} label="Game Notes" />
        </nav>

        {/* User footer */}
        <div className="border-t border-border/60 px-4 py-3 flex items-center gap-2.5">
          <UserButton afterSignOutUrl="/" />
          <div className="text-[12.5px] font-medium text-text-primary">My Account</div>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-hidden flex flex-col">
        {children}
      </main>
    </div>
  )
}

function NavItem({ href, icon, label }: { href: string; icon: React.ReactNode; label: string }) {
  return (
    <Link
      href={href}
      className="flex items-center gap-2 px-2.5 py-1.5 rounded-[6px] text-[13.5px] text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors group"
    >
      <span className="opacity-70 group-hover:opacity-100 transition-opacity">{icon}</span>
      {label}
    </Link>
  )
}
