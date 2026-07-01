'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  function handleAction() {
    startTransition(async () => {
      setError(null)

      const supabase = createClient()
      const { data, error: signInError } = await supabase.auth.signInWithPassword({ email, password })

      if (signInError) {
        setError(signInError.message)
        return
      }

      const user = data.user
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (!profile) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert({
            id: user.id,
            full_name: user.user_metadata?.full_name ?? '',
          })

        if (profileError) {
          setError('Logged in, but your profile could not be set up. Please contact support.')
          return
        }
      }

      router.push('/welcome')
    })
  }

  return (
    <main className="hero-bg flex min-h-screen items-center justify-center px-6">
      <div className="w-full max-w-sm rounded-2xl bg-wello-white px-8 py-10 shadow-sm">
        <h1 className="font-serif mb-1 text-3xl font-bold text-wello-dark-brown">
          Welcome back
        </h1>
        <p className="mb-8 text-sm text-wello-grey-brown">
          Log in to your Wello account.
        </p>

        <form action={handleAction} className="flex flex-col gap-4">
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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
            className="mt-2 rounded-full bg-wello-yellow py-3 font-semibold text-wello-dark-brown transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isPending ? 'Logging in…' : 'Log In'}
          </button>
        </form>

        <p className="mt-6 text-center text-sm text-wello-grey-brown">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="font-medium text-wello-dark-brown underline underline-offset-2">
            Sign up
          </Link>
        </p>
      </div>
    </main>
  )
}
