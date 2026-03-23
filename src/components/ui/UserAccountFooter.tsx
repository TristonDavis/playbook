'use client'

import { UserButton } from '@clerk/nextjs'
import { useEffect, useState } from 'react'

export default function UserAccountFooter() {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    return (
      <div className="border-t border-border/60 px-4 py-3 flex items-center gap-2.5">
        <div className="w-7 h-7 rounded-full bg-surface-2" aria-hidden="true" />
        <div className="text-[12.5px] font-medium text-text-primary">My Account</div>
      </div>
    )
  }

  return (
    <div className="border-t border-border/60 px-4 py-3 flex items-center gap-2.5">
      <UserButton afterSignOutUrl="/" />
      <div className="text-[12.5px] font-medium text-text-primary">My Account</div>
    </div>
  )
}