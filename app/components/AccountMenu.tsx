'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

export default function AccountMenu() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [open])

  function handleSignOut() {
    startTransition(async () => {
      const supabase = createClient()
      await supabase.auth.signOut()
      router.push('/login')
    })
  }

  return (
    <div ref={ref} className="absolute right-4 top-4">
      <button
        onClick={() => setOpen(v => !v)}
        aria-label="Account menu"
        aria-expanded={open}
        className="flex h-10 w-10 flex-col items-center justify-center gap-1.5 rounded-full transition-colors hover:bg-wello-white/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2"
      >
        <span className="h-0.5 w-5 rounded-full bg-wello-dark-brown" />
        <span className="h-0.5 w-5 rounded-full bg-wello-dark-brown" />
        <span className="h-0.5 w-5 rounded-full bg-wello-dark-brown" />
      </button>

      {open && (
        <div className="absolute right-0 top-11 w-36 rounded-xl border border-wello-grey-brown/10 bg-wello-white py-1 shadow-md">
          <button
            onClick={handleSignOut}
            disabled={isPending}
            className="mx-1 w-[calc(100%-0.5rem)] rounded-lg px-3 py-1.5 text-left text-sm text-wello-grey-brown transition-colors hover:bg-wello-beige hover:text-wello-dark-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-wello-dark-brown disabled:opacity-50"
          >
            {isPending ? 'Signing out…' : 'Sign Out'}
          </button>
        </div>
      )}
    </div>
  )
}
