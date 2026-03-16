'use client'

import { Study } from '@/types'
import { Share2, Check, Loader2 } from 'lucide-react'

interface Props {
  study: Study | null
  saving: boolean
  rpTab: 'info' | 'ai'
  onRpTabChange: (tab: 'info' | 'ai') => void
}

export default function EditorToolbar({ study, saving, rpTab, onRpTabChange }: Props) {
  function execCmd(cmd: string, value?: string) {
    document.execCommand(cmd, false, value)
  }

  return (
    <div className="flex items-center gap-2 px-7 py-2.5 border-b border-border/60 bg-surface">
      {/* Formatting */}
      <div className="flex items-center gap-0.5 pr-2 border-r border-border mr-1">
        {[
          { cmd: 'bold', label: <span className="font-bold text-[13px]">B</span> },
          { cmd: 'italic', label: <span className="italic text-[13px]">I</span> },
          { cmd: 'underline', label: <span className="underline text-[13px]">U</span> },
        ].map(({ cmd, label }) => (
          <button
            key={cmd}
            onMouseDown={e => { e.preventDefault(); execCmd(cmd) }}
            className="w-7 h-7 flex items-center justify-center rounded-[6px] text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors"
          >
            {label}
          </button>
        ))}
      </div>

      {/* Insert blocks */}
      <div className="flex items-center gap-1 pr-2 border-r border-border mr-1">
        <button
          onClick={() => {
            const el = document.querySelector('[contenteditable]')
            if (el) {
              el.innerHTML += `<div class="matchup-card"><div style="font-size:11px;font-weight:600;letter-spacing:0.08em;text-transform:uppercase;color:#a09d98;margin-bottom:12px">Game Matchup</div><div style="display:flex;align-items:center;justify-content:space-between;gap:16px"><div style="text-align:center;flex:1"><div contenteditable="true" style="font-size:18px;font-weight:600">Team A</div><div contenteditable="true" style="font-size:12px;color:#a09d98;margin-top:2px">0-0</div></div><div style="font-size:11px;font-weight:600;color:#a09d98">VS</div><div style="text-align:center;flex:1"><div contenteditable="true" style="font-size:18px;font-weight:600">Team B</div><div contenteditable="true" style="font-size:12px;color:#a09d98;margin-top:2px">0-0</div></div></div></div><p><br></p>`
            }
          }}
          className="flex items-center gap-1.5 px-2.5 h-7 rounded-[6px] text-[12.5px] text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><rect x="2" y="4" width="12" height="8" rx="1.5"/><path d="M6 8h4M8 6v4"/></svg>
          Matchup
        </button>
        <button
          onClick={() => {
            const el = document.querySelector('[contenteditable]')
            if (el) {
              el.innerHTML += `<table class="stats-table" contenteditable="true"><thead><tr><th>Player</th><th>Stat 1</th><th>Stat 2</th><th>Stat 3</th></tr></thead><tbody><tr><td>Player A</td><td>—</td><td>—</td><td>—</td></tr><tr><td>Player B</td><td>—</td><td>—</td><td>—</td></tr></tbody></table><p><br></p>`
            }
          }}
          className="flex items-center gap-1.5 px-2.5 h-7 rounded-[6px] text-[12.5px] text-text-secondary hover:bg-surface-2 hover:text-text-primary transition-colors"
        >
          <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="1.8" width="13" height="13"><rect x="2" y="2" width="12" height="12" rx="1.5"/><path d="M2 6h12M6 2v12"/></svg>
          Stats Table
        </button>
      </div>

      {/* Right panel tabs */}
      <div className="flex items-center gap-1 pr-2 border-r border-border mr-1">
        <button
          onClick={() => onRpTabChange('info')}
          className={`px-3 h-7 rounded-[6px] text-[12.5px] font-medium transition-colors ${rpTab === 'info' ? 'bg-surface-2 text-text-primary' : 'text-text-secondary hover:bg-surface-2'}`}
        >
          Study Info
        </button>
        <button
          onClick={() => onRpTabChange('ai')}
          className={`px-3 h-7 rounded-[6px] text-[12.5px] font-medium transition-colors flex items-center gap-1.5 ${rpTab === 'ai' ? 'bg-purple-light text-purple' : 'text-text-secondary hover:bg-surface-2'}`}
        >
          <span>✦</span> AI Analysis
        </button>
      </div>

      {/* Save status + share */}
      <div className="ml-auto flex items-center gap-2">
        {saving ? (
          <div className="flex items-center gap-1.5 text-[12px] text-text-tertiary">
            <Loader2 size={12} className="animate-spin" /> Saving…
          </div>
        ) : study ? (
          <div className="flex items-center gap-1.5 text-[12px] text-text-tertiary">
            <Check size={12} /> Saved
          </div>
        ) : null}
        <button className="flex items-center gap-1.5 px-3 py-1.5 border border-border rounded-[6px] text-[12.5px] font-medium text-text-secondary hover:bg-surface-2 hover:border-text-tertiary transition-colors">
          <Share2 size={12} /> Share
        </button>
      </div>
    </div>
  )
}
