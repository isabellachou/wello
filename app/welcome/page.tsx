import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export default async function WelcomePage() {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  const { data: profile } = await supabase
    .from('profiles')
    .select('full_name')
    .eq('id', user.id)
    .maybeSingle()

  const firstName = profile?.full_name?.trim().split(' ')[0] || null

  return (
    <main className="hero-bg flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <div className="-translate-y-16 flex flex-col items-center gap-12">
        <div className="flex flex-col items-center gap-3">
          <h1 className="font-serif text-6xl font-bold text-wello-dark-brown sm:text-7xl">
            Wello,
          </h1>
          {firstName && (
            <p className="font-serif text-4xl font-light text-wello-grey-brown">
              {firstName}
            </p>
          )}
        </div>

        <div className="flex flex-col items-center gap-2">
          <p className="text-wello-grey-brown">
            We&apos;re glad you&apos;re here.
          </p>
          <div className="flex flex-col gap-3 sm:flex-row">
            <Link
              href="/info"
              className="rounded-full bg-wello-yellow px-10 py-3 font-semibold text-wello-dark-brown transition-opacity hover:opacity-90"
            >
              Dashboard
            </Link>
            <Link
              href="/chat"
              className="rounded-full bg-wello-grey-brown px-10 py-3 font-semibold text-wello-white transition-opacity hover:opacity-90"
            >
              Chat
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
