import Link from 'next/link'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AccountMenu from '@/app/components/AccountMenu'

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

  const rawName = profile?.full_name?.trim() || user.user_metadata?.full_name?.trim() || ''
  const firstName = rawName.split(' ')[0] || null

  return (
    <main className="hero-bg relative flex min-h-screen flex-col items-center justify-center px-6 text-center">
      <AccountMenu />
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
              className="rounded-full bg-wello-yellow px-10 py-3 font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2"
            >
              Dashboard
            </Link>
            <Link
              href="/journal"
              className="rounded-full bg-wello-grey-brown px-10 py-3 font-semibold text-wello-white transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2"
            >
              Journal
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
