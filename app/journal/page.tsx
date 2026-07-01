'use client'

import { useState, useEffect, useTransition } from 'react'
import Link from 'next/link'
import { Plus, X } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const CATEGORIES: Record<string, string[]> = {
  Symptoms: [
    'Sensory overload', 'Difficulty focusing', 'Anxious mood', 'Sleep changes',
    'Social withdrawal', 'Routine disruption', 'Appetite change', 'Meltdown trigger',
  ],
  Behavior: [
    'Aggression', 'Self-harm', 'Repetitive behaviors', 'Non-compliance',
    'Elopement', 'Property destruction', 'Hyperactivity', 'Impulsivity',
  ],
  Mood: [
    'Happy', 'Calm', 'Anxious', 'Sad', 'Angry', 'Irritable', 'Withdrawn', 'Overstimulated',
  ],
  Sleep: [
    'Slept well', 'Trouble falling asleep', 'Woke up early',
    'Nightmares', 'Slept too long', 'Restless sleep',
  ],
  Appetite: [
    'Ate well', 'Ate less than usual', 'Refused food',
    'Overate', 'Tried new food', 'Strong food preferences',
  ],
  Other: [],
}

type Entry = {
  id: string
  date: string
  category: string
  selected_options: string[]
  notes: string
}

type ModalStep = 'category' | 'details'

function formatDate(dateStr: string) {
  const d = new Date(dateStr + 'T00:00:00')
  return {
    month: d.toLocaleDateString('en-US', { month: 'short' }),
    day: d.getDate(),
    year: d.getFullYear(),
  }
}

export default function JournalPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [childId, setChildId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [modalOpen, setModalOpen] = useState(false)
  const [modalStep, setModalStep] = useState<ModalStep>('category')
  const [category, setCategory] = useState('')
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [notes, setNotes] = useState('')
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isPending, startTransition] = useTransition()

  const today = new Date().toISOString().split('T')[0]

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!user) { setLoading(false); return }
      supabase
        .from('children')
        .select('id')
        .eq('profile_id', user.id)
        .maybeSingle()
        .then(({ data: child }) => {
          if (!child) { setLoading(false); return }
          setChildId(child.id)
          supabase
            .from('journal_entries')
            .select('id, date, category, selected_options, notes')
            .eq('child_id', child.id)
            .order('date', { ascending: false })
            .order('created_at', { ascending: false })
            .then(({ data }) => {
              setEntries((data as Entry[]) ?? [])
              setLoading(false)
            })
        })
    })
  }, [])

  function openModal() {
    setModalStep('category')
    setCategory('')
    setSelectedOptions([])
    setNotes('')
    setSaveError(null)
    setModalOpen(true)
  }

  function toggleOption(opt: string) {
    setSelectedOptions(prev =>
      prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]
    )
  }

  function handleSave() {
    if (!childId) return
    startTransition(async () => {
      setSaveError(null)
      const supabase = createClient()
      const { data, error } = await supabase
        .from('journal_entries')
        .insert({ child_id: childId, date: today, category, selected_options: selectedOptions, notes })
        .select('id, date, category, selected_options, notes')
        .single()

      if (error) { setSaveError(error.message); return }
      setEntries(prev => [data as Entry, ...prev])
      setModalOpen(false)
    })
  }

  return (
    <main className="hero-bg min-h-screen px-6 py-10">
      <div className="mx-auto max-w-2xl">
        <div className="mb-8 flex items-center justify-between">
          <h1 className="font-serif text-4xl font-bold text-wello-dark-brown">Journal</h1>
          <button
            onClick={openModal}
            className="flex items-center gap-2 rounded-full bg-wello-yellow px-5 py-2.5 text-sm font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2"
          >
            <Plus className="h-4 w-4" />
            New Entry
          </button>
        </div>

        {loading ? (
          <p className="text-sm text-wello-grey-brown/50">Loading…</p>
        ) : entries.length === 0 ? (
          <div className="rounded-2xl bg-wello-white/60 p-10 text-center backdrop-blur-sm">
            <p className="text-wello-grey-brown">
              No entries yet. Tap <strong>+ New Entry</strong> to start logging.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {entries.map(entry => {
              const { month, day, year } = formatDate(entry.date)
              return (
                <div key={entry.id} className="flex gap-4 rounded-2xl bg-wello-white/60 p-4 backdrop-blur-sm">
                  <div className="flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-wello-yellow/50 py-3 text-center">
                    <span className="text-xs font-medium text-wello-dark-brown/60">{month}</span>
                    <span className="text-2xl font-bold leading-tight text-wello-dark-brown">{day}</span>
                    <span className="text-xs font-medium text-wello-dark-brown/60">{year}</span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2">
                    <span className="self-start rounded-full bg-wello-beige px-3 py-0.5 text-xs font-semibold text-wello-dark-brown">
                      {entry.category}
                    </span>
                    {entry.selected_options?.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {entry.selected_options.map(opt => (
                          <span key={opt} className="rounded-full bg-wello-light-yellow/80 px-2.5 py-0.5 text-xs text-wello-dark-brown">
                            {opt}
                          </span>
                        ))}
                      </div>
                    )}
                    {entry.notes && (
                      <p className="text-sm text-wello-grey-brown">{entry.notes}</p>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}

        <div className="mt-8">
          <Link
            href="/info"
            className="text-sm font-medium text-wello-grey-brown underline-offset-2 hover:text-wello-dark-brown hover:underline"
          >
            ← Back to Dashboard
          </Link>
        </div>
      </div>

      {modalOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-wello-dark-brown/20 px-6 backdrop-blur-sm"
          onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}
        >
          <div className="w-full max-w-md rounded-2xl bg-wello-white p-6 shadow-xl">
            <div className="mb-5 flex items-center justify-between">
              <h2 className="font-serif text-xl font-bold text-wello-dark-brown">
                {modalStep === 'category' ? 'What are you logging?' : category}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="rounded-full p-1 text-wello-grey-brown transition-colors hover:text-wello-dark-brown"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {modalStep === 'category' && (
              <div className="grid grid-cols-2 gap-2">
                {Object.keys(CATEGORIES).map(cat => (
                  <button
                    key={cat}
                    onClick={() => { setCategory(cat); setSelectedOptions([]); setModalStep('details') }}
                    className="rounded-xl border border-wello-grey-brown/20 bg-wello-beige px-4 py-3 text-left text-sm font-medium text-wello-dark-brown transition-colors hover:border-wello-yellow hover:bg-wello-light-yellow/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown"
                  >
                    {cat}
                  </button>
                ))}
              </div>
            )}

            {modalStep === 'details' && (
              <div className="flex flex-col gap-4">
                {CATEGORIES[category].length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {CATEGORIES[category].map(opt => {
                      const selected = selectedOptions.includes(opt)
                      return (
                        <button
                          key={opt}
                          onClick={() => toggleOption(opt)}
                          className={`rounded-full border px-3 py-1.5 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown ${
                            selected
                              ? 'border-wello-yellow bg-wello-yellow text-wello-dark-brown'
                              : 'border-wello-grey-brown/30 bg-wello-beige text-wello-dark-brown hover:border-wello-yellow'
                          }`}
                        >
                          {opt}
                        </button>
                      )
                    })}
                  </div>
                )}

                <textarea
                  className="w-full rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-3 text-sm text-wello-dark-brown placeholder:text-wello-grey-brown/60 focus:border-wello-yellow focus:outline-none"
                  rows={3}
                  placeholder="Add notes…"
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                />

                <p className="text-xs text-wello-grey-brown">
                  Logging for today — {new Date(today + 'T00:00:00').toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </p>

                {saveError && (
                  <p className="rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">{saveError}</p>
                )}

                <div className="flex gap-3">
                  <button
                    onClick={() => setModalStep('category')}
                    className="flex-1 rounded-full border border-wello-grey-brown/30 py-2.5 text-sm font-semibold text-wello-grey-brown transition-colors hover:border-wello-dark-brown hover:text-wello-dark-brown focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown"
                  >
                    Back
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isPending}
                    className="flex-1 rounded-full bg-wello-yellow py-2.5 text-sm font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown disabled:opacity-50"
                  >
                    {isPending ? 'Saving…' : 'Save Entry'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </main>
  )
}
