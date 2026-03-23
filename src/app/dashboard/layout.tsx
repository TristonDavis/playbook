import Link from 'next/link'
import { LayoutGrid, TrendingUp, Star, FileText, BarChart2 } from 'lucide-react'
import UserAccountFooter from '@/components/ui/UserAccountFooter'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden bg-bg">
      {/* Sidebar */}
      <aside className="w-[260px] bg-surface border-r border-border flex flex-col flex-shrink-0">
        {/* Logo + new study */}
        <div className="px-4 pt-5 pb-3.5 border-b border-border/60">
          <div className="flex items-center gap-2.5 mb-4">
            <svg width="26" height="26" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
              <rect width="96" height="96" rx="22" fill="#2563EB" />
              <path d="M14 26 Q30 23 48 26 L48 70 Q30 67 14 70 Z" fill="rgba(255,255,255,0.07)" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinejoin="round" />
              <path d="M48 26 Q66 23 82 26 L82 70 Q66 67 48 70 Z" fill="rgba(255,255,255,0.12)" stroke="rgba(255,255,255,0.4)" strokeWidth="2.5" strokeLinejoin="round" />
              <line x1="48" y1="26" x2="48" y2="70" stroke="rgba(255,255,255,0.55)" strokeWidth="3" />
              <circle cx="66" cy="56" r="4.5" fill="rgba(255,255,255,0.5)" />
              <circle cx="74" cy="40" r="4.5" fill="#93C5FD" />
              <path d="M66 56 Q66 40 74 42" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
            <span className="text-[15px] font-medium tracking-tight text-text-primary">
              The <span className="text-blue">Playbook</span>
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
        <UserAccountFooter />
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
