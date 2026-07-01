'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { LayoutGrid, NotebookText, UserRound } from 'lucide-react'

type DashboardContent = {
  symptoms: string[]
  tips: string[]
  resources: { label: string; href: string }[]
}

const NAV_ITEMS = [
  { icon: LayoutGrid, label: 'Dashboard', href: '/info' },
  { icon: UserRound, label: 'Child Profile', href: '/profile' },
  { icon: NotebookText, label: 'Journal', href: '/journal' },
]

function Column({
  index,
  title,
  loading,
  children,
}: {
  index: string
  title: string
  loading: boolean
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-0 flex-1 flex-col rounded-2xl bg-wello-white/60 p-5 backdrop-blur-sm">
      <p className="text-xs tracking-widest text-wello-grey-brown">{index}</p>
      <h2 className="mb-4 text-2xl font-semibold text-wello-dark-brown">{title}</h2>
      <div className="min-h-0 flex-1 overflow-y-auto pr-1">
        {loading ? (
          <p className="text-sm text-wello-grey-brown/50">Loading…</p>
        ) : (
          <div className="flex flex-col gap-2">{children}</div>
        )}
      </div>
    </div>
  )
}

export default function InfoPage() {
  const [content, setContent] = useState<DashboardContent>({ symptoms: [], tips: [], resources: [] })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setLoading(true)
    fetch('/api/dashboard/content')
      .then(r => r.json())
      .then((data: DashboardContent) => setContent(data))
      .catch(() => {})
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="hero-bg flex h-screen">
      <main className="flex flex-1 flex-col overflow-hidden px-10 py-10">
        <h1 className="mb-8 shrink-0 font-serif text-4xl font-semibold text-wello-dark-brown">
          Dashboard
        </h1>

        <div className="flex min-h-0 flex-1 flex-col gap-6 lg:flex-row">
          <Column index="01" title="Symptoms" loading={loading}>
            {content.symptoms.map(label => (
              <div
                key={label}
                className="rounded-full bg-wello-beige px-4 py-3 text-sm font-medium text-wello-dark-brown"
              >
                {label}
              </div>
            ))}
          </Column>

          <Column index="02" title="Tips" loading={loading}>
            {content.tips.map(label => (
              <div
                key={label}
                className="rounded-full bg-wello-beige px-4 py-3 text-sm font-medium text-wello-dark-brown"
              >
                {label}
              </div>
            ))}
          </Column>

          <Column index="03" title="Resources" loading={loading}>
            {content.resources.map(resource => (
              <Link
                key={resource.label}
                href={resource.href}
                className="block rounded-full bg-wello-beige px-4 py-3 text-sm font-medium text-wello-dark-brown transition-colors hover:bg-wello-light-yellow"
              >
                {resource.label}
              </Link>
            ))}
          </Column>
        </div>
      </main>

      <aside className="flex w-60 shrink-0 flex-col gap-6 overflow-y-auto border-l border-wello-grey-brown/10 bg-wello-beige/60 px-6 py-10">
        <Link
          href="/welcome"
          className="w-full rounded-full bg-wello-yellow px-4 py-2.5 text-center text-sm font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2"
        >
          Home
        </Link>
        <nav className="flex w-full flex-col gap-1">
          {NAV_ITEMS.map((item, i) => (
            <Link
              key={item.label}
              href={item.href}
              className={`flex items-center gap-3 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors ${
                i === 0
                  ? 'bg-wello-yellow/60 text-wello-dark-brown'
                  : 'text-wello-dark-brown/80 hover:bg-wello-yellow/30'
              }`}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </div>
  )
}
