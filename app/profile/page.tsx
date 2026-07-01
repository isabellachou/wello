'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'

const DIAGNOSIS_OPTIONS = [
  'Autism', 'ADHD', 'Down Syndrome', 'Cerebral Palsy',
  'Dyslexia', 'Intellectual Disability', 'Undiagnosed', 'Other',
]

const AGE_OPTIONS = [
  ...Array.from({ length: 100 }, (_, i) => String(i + 1)),
  '100+',
]

const TIME_OPTIONS = [
  'Less than a week', 'A couple of weeks', 'A couple of months',
  'A year', '2 years', 'More than 5 years',
]

type ChildRow = {
  id: string
  name: string
  age: string
  diagnoses: string[]
  diagnosis_lengths: Record<string, string>
  medications: string[]
  family_history: boolean | null
  family_history_details: string
}

function inputClass() {
  return 'w-full rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-2.5 text-sm text-wello-dark-brown placeholder:text-wello-grey-brown/60 focus:border-wello-yellow focus:outline-none'
}

export default function ProfilePage() {
  const [child, setChild] = useState<ChildRow | null>(null)
  const [loading, setLoading] = useState(true)
  const [med, setMed] = useState('')
  const [loadError, setLoadError] = useState<string | null>(null)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [saved, setSaved] = useState(false)
  const [isPending, startTransition] = useTransition()

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      supabase
        .from('children')
        .select('*')
        .eq('profile_id', user.id)
        .maybeSingle()
        .then(({ data, error }) => {
          if (error) setLoadError('Could not load profile.')
          else if (data) setChild(data as ChildRow)
          setLoading(false)
        })
    })
  }, [])

  function set<K extends keyof ChildRow>(key: K, value: ChildRow[K]) {
    setChild(prev => prev ? { ...prev, [key]: value } : prev)
    setSaved(false)
  }

  function handleSave() {
    if (!child) return
    startTransition(async () => {
      setSaveError(null)
      setSaved(false)
      const supabase = createClient()
      const { error } = await supabase
        .from('children')
        .update({
          name: child.name,
          age: child.age,
          diagnoses: child.diagnoses,
          diagnosis_lengths: child.diagnosis_lengths,
          medications: child.medications,
          family_history: child.family_history,
          family_history_details: child.family_history_details,
          dashboard_content: null,
        })
        .eq('id', child.id)

      if (error) { setSaveError('Failed to save changes.'); return }
      setSaved(true)
    })
  }

  if (loadError) {
    return (
      <main className="hero-bg flex min-h-screen items-center justify-center">
        <p className="text-sm text-red-600">{loadError}</p>
      </main>
    )
  }

  if (loading) {
    return (
      <main className="hero-bg flex min-h-screen items-center justify-center">
        <p className="text-sm text-wello-grey-brown/50">Loading…</p>
      </main>
    )
  }

  if (!child) {
    return (
      <main className="hero-bg flex min-h-screen items-center justify-center">
        <p className="text-sm text-wello-grey-brown/50">No profile found. Complete the onboarding questions first.</p>
      </main>
    )
  }

  return (
    <main className="hero-bg min-h-screen px-6 py-12">
      <div className="mx-auto w-full max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-4xl font-bold text-wello-dark-brown">
            Child Profile
          </h1>
          <Link
            href="/info"
            className="rounded-full bg-wello-yellow px-5 py-2 text-sm font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2"
          >
            Dashboard
          </Link>
        </div>

        <div className="flex flex-col gap-6">
          {/* Name */}
          <section className="rounded-2xl bg-wello-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-wello-grey-brown">
              Name
            </h2>
            <input
              className={inputClass()}
              value={child.name}
              placeholder="Enter name"
              onChange={e => set('name', e.target.value)}
            />
          </section>

          {/* Age */}
          <section className="rounded-2xl bg-wello-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-wello-grey-brown">
              Age
            </h2>
            <select
              className={inputClass()}
              value={child.age}
              onChange={e => set('age', e.target.value)}
            >
              <option value="">Select age</option>
              {AGE_OPTIONS.map(o => <option key={o}>{o}</option>)}
            </select>
          </section>

          {/* Diagnoses */}
          <section className="rounded-2xl bg-wello-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-wello-grey-brown">
              Diagnoses
            </h2>
            <div className="grid gap-2">
              {DIAGNOSIS_OPTIONS.map(o => {
                const selected = child.diagnoses?.includes(o)
                return (
                  <button
                    key={o}
                    onClick={() => {
                      const next = selected
                        ? child.diagnoses.filter(x => x !== o)
                        : [...(child.diagnoses ?? []), o]
                      const nextLengths = { ...child.diagnosis_lengths }
                      if (!next.includes(o)) delete nextLengths[o]
                      set('diagnoses', next)
                      set('diagnosis_lengths', nextLengths)
                    }}
                    className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition-colors ${
                      selected
                        ? 'border-wello-yellow bg-wello-yellow text-wello-dark-brown'
                        : 'border-wello-grey-brown/30 bg-wello-beige text-wello-dark-brown hover:border-wello-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2'
                    }`}
                  >
                    {o}
                  </button>
                )
              })}
            </div>
          </section>

          {/* Diagnosis length */}
          {child.diagnoses?.length > 0 && (
            <section className="rounded-2xl bg-wello-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-wello-grey-brown">
                Time since diagnosis
              </h2>
              <div className="flex flex-col gap-3">
                {child.diagnoses.map(d => (
                  <div key={d} className="flex items-center justify-between gap-4 rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-3">
                    <span className="text-sm font-medium text-wello-dark-brown">{d}</span>
                    <select
                      className="rounded-lg border border-wello-grey-brown/30 bg-wello-white px-3 py-1.5 text-sm text-wello-dark-brown focus:border-wello-yellow focus:outline-none"
                      value={child.diagnosis_lengths?.[d] ?? ''}
                      onChange={e => set('diagnosis_lengths', { ...child.diagnosis_lengths, [d]: e.target.value })}
                    >
                      <option value="">Select…</option>
                      {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
                    </select>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Medications */}
          <section className="rounded-2xl bg-wello-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-wello-grey-brown">
              Medications
            </h2>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-2.5 text-sm text-wello-dark-brown placeholder:text-wello-grey-brown/60 focus:border-wello-yellow focus:outline-none"
                value={med}
                placeholder="Enter medication name"
                onChange={e => setMed(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && med.trim()) {
                    e.preventDefault()
                    set('medications', [...(child.medications ?? []), med.trim()])
                    setMed('')
                  }
                }}
              />
              <button
                disabled={!med.trim()}
                onClick={() => {
                  if (med.trim()) {
                    set('medications', [...(child.medications ?? []), med.trim()])
                    setMed('')
                  }
                }}
                className="rounded-lg bg-wello-yellow px-4 py-2.5 text-sm font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2 disabled:opacity-40"
              >
                Add
              </button>
            </div>
            {child.medications?.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {child.medications.map(x => (
                  <li key={x} className="flex items-center gap-1.5 rounded-full bg-wello-beige px-3 py-1 text-sm text-wello-dark-brown">
                    {x}
                    <button
                      onClick={() => set('medications', child.medications.filter(m => m !== x))}
                      className="text-wello-grey-brown hover:text-wello-dark-brown"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </section>

          {/* Family history */}
          <section className="rounded-2xl bg-wello-white p-6 shadow-sm">
            <h2 className="mb-4 text-sm font-semibold uppercase tracking-widest text-wello-grey-brown">
              Family history
            </h2>
            <div className="flex gap-3">
              {(['Yes', 'No'] as const).map(opt => {
                const val = opt === 'Yes'
                const selected = child.family_history === val
                return (
                  <button
                    key={opt}
                    onClick={() => set('family_history', val)}
                    className={`flex-1 rounded-lg border px-6 py-3 font-semibold transition-colors ${
                      selected
                        ? 'border-wello-yellow bg-wello-yellow text-wello-dark-brown'
                        : 'border-wello-grey-brown/30 bg-wello-beige text-wello-dark-brown hover:border-wello-yellow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2'
                    }`}
                  >
                    {opt}
                  </button>
                )
              })}
            </div>
            {child.family_history === true && (
              <textarea
                className="mt-4 w-full rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-3 text-sm text-wello-dark-brown placeholder:text-wello-grey-brown/60 focus:border-wello-yellow focus:outline-none"
                rows={4}
                placeholder="Please describe…"
                value={child.family_history_details ?? ''}
                onChange={e => set('family_history_details', e.target.value)}
              />
            )}
          </section>

          {saveError && (
            <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{saveError}</p>
          )}
          {saved && (
            <p className="rounded-lg bg-green-50 px-4 py-2.5 text-sm text-green-700">Changes saved.</p>
          )}

          <button
            onClick={handleSave}
            disabled={isPending}
            className="rounded-full bg-wello-yellow py-3 font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2 disabled:opacity-50"
          >
            {isPending ? 'Saving…' : 'Save changes'}
          </button>
        </div>
      </div>
    </main>
  )
}
