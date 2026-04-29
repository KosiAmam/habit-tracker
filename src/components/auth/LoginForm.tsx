'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Eye, EyeOff, Leaf } from 'lucide-react'
import { logIn } from '@/lib/auth'
import { validateEmail } from '@/lib/validators'

function BrandPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-1/2 flex-col items-center justify-between
                    bg-surface-bg px-16 py-20 relative overflow-hidden"
    >
      <div className="relative z-10 flex items-center gap-2 self-start">
        <div className="w-9 h-9 rounded-full bg-orange-primary flex items-center justify-center">
          <Leaf size={16} className="text-white" strokeWidth={2} />
        </div>
        <span className="font-display font-bold text-dark-primary text-lg tracking-tight">
          Habitual
        </span>
      </div>

      <div className="flex flex-col items-center justify-center flex-1 gap-8 py-8">
        <img
          src="/auth.svg"
          alt=""
          aria-hidden="true"
          className="w-72 h-auto"
        />

      {/* Bottom — copy */}
      <div className="relative z-10 text-center">
        <h2 className="font-display text-2xl font-bold text-dark-primary mb-2">
          Your habits are waiting.
        </h2>
        <p className="text-text-secondary text-sm leading-relaxed max-w-xs">
          Stay consistent, track your progress,
          <br />
          and keep moving forward.
        </p>
      </div>
      </div>
    </div>
  );
}

export default function LoginForm() {
  const router = useRouter()
  const [email, setEmail]         = useState('')
  const [password, setPassword]   = useState('')
  const [showPass, setShowPass]   = useState(false)
  const [emailErr, setEmailErr]   = useState<string | null>(null)
  const [passErr, setPassErr]     = useState<string | null>(null)
  const [serverErr, setServerErr] = useState<string | null>(null)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setServerErr(null)
    const ev = validateEmail(email)
    setEmailErr(ev.error)
    const noPass = !password
    setPassErr(noPass ? 'Password is required' : null)
    if (!ev.valid || noPass) return
    const result = logIn(ev.value, password)
    if (!result.ok) { setServerErr(result.error); return }
    router.replace('/dashboard')
  }

  return (
    <div className="min-h-screen flex">
      <BrandPanel />

      {/* ── RIGHT — form panel ── */}
      <div className="flex-1 flex flex-col items-center justify-center
                      bg-white px-6 py-12">

        {/* Mobile logo */}
        <div className="flex flex-col items-center mb-8 lg:hidden">
          <div className="w-12 h-12 rounded-full bg-orange-primary flex items-center
                          justify-center mb-2">
            <Leaf size={20} className="text-white" strokeWidth={2} />
          </div>
          <p className="text-xs tracking-widest uppercase text-text-secondary font-semibold">
            Habit Tracker
          </p>
        </div>

        <div className="w-full max-w-sm md:bg-white md:rounded-2xl md:shadow-card md:p-8">

          <div className="text-center mb-8">
            <h1 className="font-display text-3xl font-bold text-dark-primary">
              Welcome back
            </h1>
            <p className="mt-1 text-text-secondary text-sm">
              Your streak is waiting for you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5" noValidate>
            {serverErr && (
              <div className="flex items-center gap-2 bg-red-50 border border-red-200
                              text-red-600 text-sm px-4 py-3 rounded-input" role="alert">
                <span aria-hidden>⚠️</span> {serverErr}
              </div>
            )}

            <div>
              <label htmlFor="login-email" className="form-label">
                Email address
              </label>
              <input
                id="login-email"
                data-testid="auth-login-email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => { setEmail(e.target.value); setEmailErr(null) }}
                className={`form-input ${emailErr ? 'error' : ''}`}
                aria-describedby={emailErr ? 'login-email-error' : undefined}
                aria-invalid={Boolean(emailErr)}
              />
              {emailErr && (
                <p id="login-email-error"
                   className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span aria-hidden>⚠</span> {emailErr}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="login-password" className="form-label">
                Password
              </label>
              <div className="relative">
                <input
                  id="login-password"
                  data-testid="auth-login-password"
                  type={showPass ? 'text' : 'password'}
                  autoComplete="current-password"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setPassErr(null) }}
                  className={`form-input pr-12 ${passErr ? 'error' : ''}`}
                  aria-invalid={Boolean(passErr)}
                />
                <button
                  type="button"
                  onClick={() => setShowPass(v => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary
                             hover:text-text-primary transition-colors"
                >
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {passErr && (
                <p className="text-red-500 text-xs mt-1 flex items-center gap-1">
                  <span aria-hidden>⚠</span> {passErr}
                </p>
              )}
            </div>

            <button
              type="submit"
              data-testid="auth-login-submit"
              className="btn-primary mt-1"
            >
              Sign in →
            </button>
          </form>

          <p className="text-center text-sm text-text-secondary mt-6">
            No account yet?{' '}
            <Link href="/signup"
                  className="text-orange-primary font-semibold hover:underline underline-offset-2">
              Sign up
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}