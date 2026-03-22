import { SignIn } from '@clerk/nextjs'
import Link from 'next/link'

function LogoMark() {
  return (
    <svg width="32" height="32" viewBox="0 0 96 96" xmlns="http://www.w3.org/2000/svg">
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

export default function SignInPage() {
  return (
    <div className="min-h-screen bg-pb-bg flex flex-col items-center justify-center px-4 py-12">

      {/* Logo */}
      <div className="flex flex-col items-center gap-3 mb-8">
        <LogoMark />
        <span className="text-[18px] font-medium tracking-tight text-pb-text">
          The <span className="text-pb-blue-lt">Playbook</span>
        </span>
        <p className="text-[13px] text-pb-muted">Sign in to your account</p>
      </div>

      {/* Clerk component — appearance matches dark theme */}
      <SignIn
        appearance={{
          variables: {
            colorBackground:        '#111827',
            colorInputBackground:   '#1A2235',
            colorInputText:         '#F1F5F9',
            colorText:              '#F1F5F9',
            colorTextSecondary:     '#94A3B8',
            colorPrimary:           '#2563EB',
            colorDanger:            '#EF4444',
            borderRadius:           '0.625rem',
            fontFamily:             'var(--font-inter), system-ui, sans-serif',
            fontSize:               '14px',
          },
          elements: {
            card:                   'bg-pb-surface border border-pb-border shadow-none',
            headerTitle:            'text-pb-text font-medium text-base',
            headerSubtitle:         'text-pb-muted text-sm',
            socialButtonsBlockButton: 'border border-pb-border2 bg-pb-surface2 text-pb-text hover:bg-pb-surface transition-colors',
            dividerLine:            'bg-pb-border',
            dividerText:            'text-pb-hint',
            formFieldLabel:         'text-pb-muted text-[11px] font-medium uppercase tracking-wide',
            formFieldInput:         'bg-pb-surface2 border border-pb-border2 text-pb-text focus:border-pb-blue',
            formButtonPrimary:      'bg-pb-blue hover:bg-blue-700 text-white font-medium transition-colors',
            footerActionText:       'text-pb-hint text-[13px]',
            footerActionLink:       'text-pb-blue-lt hover:text-blue-300 transition-colors',
            identityPreviewText:    'text-pb-text',
            identityPreviewEditButton: 'text-pb-blue-lt',
          },
        }}
        redirectUrl="/dashboard"
        signUpUrl="/auth/sign-up"
      />

      {/* Back to home */}
      <Link href="/" className="mt-6 text-[12px] text-pb-hint hover:text-pb-muted transition-colors">
        ← Back to home
      </Link>
    </div>
  )
}
