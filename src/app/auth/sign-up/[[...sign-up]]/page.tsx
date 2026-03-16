import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen bg-bg flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-text-primary rounded-[8px] flex items-center justify-center">
            <svg viewBox="0 0 14 14" fill="none" stroke="white" strokeWidth="1.8" strokeLinecap="round" width="14" height="14">
              <path d="M7 1L9.5 5.5H12.5L10 8.5L11 13L7 10.5L3 13L4 8.5L1.5 5.5H4.5L7 1Z"/>
            </svg>
          </div>
          <span className="text-[16px] font-semibold tracking-tight">
            Play<span className="font-serif italic font-normal">book</span>
          </span>
        </div>
        <SignUp />
      </div>
    </div>
  )
}
