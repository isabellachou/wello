'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function RegisterPage() {
  const router = useRouter()
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleAction() {
    startTransition(async () => {
      setError(null)

      if (password !== confirm) {
        setError('Passwords do not match.')
        return
      }

      const supabase = createClient()
      const { error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: { data: { full_name: fullName } },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      router.push('/questions')
    })
  }

  return (
    <main className="hero-bg flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl bg-wello-white px-8 py-10 shadow-sm">
        <h1 className="font-serif mb-1 text-3xl font-bold text-wello-dark-brown">
          Create your account
        </h1>
        <p className="mb-8 text-sm text-wello-grey-brown">
          Join Wello and get the support you need.
        </p>

        <form action={handleAction} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label htmlFor="fullName" className="text-sm font-medium text-wello-dark-brown">
              Full name
            </label>
            <input
              id="fullName"
              type="text"
              required
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-2.5 text-sm text-wello-dark-brown placeholder:text-wello-grey-brown/60 focus:border-wello-yellow focus:outline-none"
              placeholder="Jane Smith"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="text-sm font-medium text-wello-dark-brown">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-2.5 text-sm text-wello-dark-brown placeholder:text-wello-grey-brown/60 focus:border-wello-yellow focus:outline-none"
              placeholder="you@example.com"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="text-sm font-medium text-wello-dark-brown">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-2.5 text-sm text-wello-dark-brown placeholder:text-wello-grey-brown/60 focus:border-wello-yellow focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label htmlFor="confirm" className="text-sm font-medium text-wello-dark-brown">
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              autoComplete="new-password"
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-2.5 text-sm text-wello-dark-brown placeholder:text-wello-grey-brown/60 focus:border-wello-yellow focus:outline-none"
              placeholder="••••••••"
            />
          </div>

          {error && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={isPending}
            className="mt-2 rounded-full bg-wello-yellow py-3 font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {isPending ? 'Creating account…' : 'Sign Up'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-wello-grey-brown">
          Already have an account?{' '}
          <Link href="/login" className="font-medium text-wello-dark-brown underline underline-offset-2">
            Log in
          </Link>
        </p>
      </div>
    </main>
  )
}
