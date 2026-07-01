'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { questions } from './questions'
import { Answers } from './types'

const times = [
  'Less than a week',
  'A couple of weeks',
  'A couple of months',
  'A year',
  '2 years',
  'More than 5 years',
]

type Step = 'intro' | number | 'done'

const INITIAL_ANSWERS: Answers = {
  name: '',
  age: '',
  diagnosis: [],
  diagnosisLength: {},
  medications: [],
  familyHistory: { hasHistory: null, details: '' },
}

export default function QuestionsPage() {
  const router = useRouter()
  const [step, setStep] = useState<Step>('intro')
  const [med, setMed] = useState('')
  const [answers, setAnswers] = useState<Answers>(INITIAL_ANSWERS)
  const [saveError, setSaveError] = useState<string | null>(null)
  const [isSaving, startSaveTransition] = useTransition()

  const cur = typeof step === 'number' ? questions[step] : null
  const total = questions.length
  const progress = typeof step === 'number' ? ((step + 1) / total) * 100 : 0

  function isValid(): boolean {
    if (!cur) return true
    if (cur.type === 'diagnosisTime') {
      return answers.diagnosis.every(d => !!answers.diagnosisLength[d])
    }
    if (cur.type === 'familyHistory') {
      return answers.familyHistory.hasHistory !== null
    }
    return true
  }

  function goNext() {
    if (step === 'intro') return setStep(0)
    if (typeof step === 'number' && step < total - 1) return setStep(step + 1)

    startSaveTransition(async () => {
      setSaveError(null)
      const supabase = createClient()
      const { data: { user } } = await supabase.auth.getUser()

      if (user) {
        const { error } = await supabase.from('children').insert({
          profile_id: user.id,
          name: answers.name,
          age: answers.age,
          diagnoses: answers.diagnosis,
          diagnosis_lengths: answers.diagnosisLength,
          medications: answers.medications,
          family_history: answers.familyHistory.hasHistory,
          family_history_details: answers.familyHistory.details,
        })

        if (error) {
          setSaveError('Your answers could not be saved. Please try again.')
          return
        }
      }

      setStep('done')
    })
  }

  function goBack() {
    if (step === 'done') return setStep(total - 1)
    if (typeof step === 'number' && step > 0) return setStep(step - 1)
    if (typeof step === 'number') return setStep('intro')
  }

  if (step === 'intro') {
    return (
      <main className="hero-bg flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-serif text-5xl font-bold text-wello-dark-brown">
              Hello!
            </h1>
            <p className="max-w-sm text-lg text-wello-grey-brown">
              Let&apos;s get started by answering a few questions.
            </p>
          </div>
          <button
            onClick={goNext}
            className="rounded-full bg-wello-yellow px-10 py-3 font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2"
          >
            Let&apos;s go
          </button>
        </div>
      </main>
    )
  }

  if (step === 'done') {
    return (
      <main className="hero-bg flex min-h-screen flex-col items-center justify-center px-6 text-center">
        <div className="flex flex-col items-center gap-8">
          <div className="flex flex-col items-center gap-3">
            <h1 className="font-serif text-5xl font-bold text-wello-dark-brown">
              Thank you!
            </h1>
            <p className="max-w-sm text-lg text-wello-grey-brown">
              You&apos;re all set. Welcome to Wello.
            </p>
          </div>
          <button
            onClick={() => router.push('/welcome')}
            className="rounded-full bg-wello-yellow px-10 py-3 font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2"
          >
            Finish
          </button>
        </div>
      </main>
    )
  }

  const valid = isValid()

  return (
    <main className="hero-bg flex min-h-screen items-center justify-center px-6 py-12">
      <div className="w-full max-w-2xl rounded-2xl bg-wello-white px-8 py-10 shadow-sm">
        <p className="mb-2 text-sm text-wello-grey-brown">
          Question {(step as number) + 1} of {total}
        </p>
        <div className="mb-6 h-1.5 rounded-full bg-wello-beige">
          <div
            className="h-1.5 rounded-full bg-wello-yellow transition-all duration-300"
            style={{ width: `${progress}%` }}
          />
        </div>

        <h1 className="font-serif mb-6 text-2xl font-bold text-wello-dark-brown">
          {cur!.title}
        </h1>

        {cur!.type === 'text' && (
          <input
            className="w-full rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-2.5 text-sm text-wello-dark-brown placeholder:text-wello-grey-brown/60 focus:border-wello-yellow focus:outline-none"
            value={answers.name}
            placeholder={cur!.placeholder}
            onChange={e => setAnswers({ ...answers, name: e.target.value })}
          />
        )}

        {cur!.type === 'select' && (
          <select
            className="w-full rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-2.5 text-sm text-wello-dark-brown focus:border-wello-yellow focus:outline-none"
            value={answers.age}
            onChange={e => setAnswers({ ...answers, age: e.target.value })}
          >
            <option value="">Select age</option>
            {cur!.options?.map(o => <option key={o}>{o}</option>)}
          </select>
        )}

        {cur!.type === 'multiChoice' && (
          <div className="grid gap-2">
            {cur!.options?.map(o => {
              const selected = answers.diagnosis.includes(o)
              return (
                <button
                  key={o}
                  onClick={() => setAnswers({
                    ...answers,
                    diagnosis: selected
                      ? answers.diagnosis.filter(x => x !== o)
                      : [...answers.diagnosis, o],
                  })}
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
        )}

        {cur!.type === 'diagnosisTime' && (
          <div className="flex flex-col gap-3">
            {answers.diagnosis.map(d => (
              <div key={d} className="flex items-center justify-between gap-4 rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-3">
                <span className="text-sm font-medium text-wello-dark-brown">{d}</span>
                <select
                  className="rounded-lg border border-wello-grey-brown/30 bg-wello-white px-3 py-1.5 text-sm text-wello-dark-brown focus:border-wello-yellow focus:outline-none"
                  value={answers.diagnosisLength[d] || ''}
                  onChange={e => setAnswers({
                    ...answers,
                    diagnosisLength: { ...answers.diagnosisLength, [d]: e.target.value },
                  })}
                >
                  <option value="">Select...</option>
                  {times.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            ))}
          </div>
        )}

        {cur!.type === 'medications' && (
          <div>
            <div className="flex gap-2">
              <input
                className="flex-1 rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-2.5 text-sm text-wello-dark-brown placeholder:text-wello-grey-brown/60 focus:border-wello-yellow focus:outline-none"
                value={med}
                placeholder="Enter medication name"
                onChange={e => setMed(e.target.value)}
                onKeyDown={e => {
                  if (e.key === 'Enter' && med.trim()) {
                    e.preventDefault()
                    setAnswers({ ...answers, medications: [...answers.medications, med.trim()] })
                    setMed('')
                  }
                }}
              />
              <button
                disabled={!med.trim()}
                onClick={() => {
                  if (med.trim()) {
                    setAnswers({ ...answers, medications: [...answers.medications, med.trim()] })
                    setMed('')
                  }
                }}
                className="rounded-lg bg-wello-yellow px-4 py-2.5 text-sm font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2 disabled:opacity-40"
              >
                Add
              </button>
            </div>
            {answers.medications.length > 0 && (
              <ul className="mt-4 flex flex-wrap gap-2">
                {answers.medications.map(x => (
                  <li key={x} className="flex items-center gap-1.5 rounded-full bg-wello-beige px-3 py-1 text-sm text-wello-dark-brown">
                    {x}
                    <button
                      onClick={() => setAnswers({ ...answers, medications: answers.medications.filter(m => m !== x) })}
                      className="text-wello-grey-brown hover:text-wello-dark-brown"
                    >
                      ×
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}

        {cur!.type === 'familyHistory' && (
          <div className="flex flex-col gap-4">
            <div className="flex gap-3">
              {(['Yes', 'No'] as const).map(opt => {
                const val = opt === 'Yes'
                const selected = answers.familyHistory.hasHistory === val
                return (
                  <button
                    key={opt}
                    onClick={() => setAnswers({
                      ...answers,
                      familyHistory: {
                        hasHistory: val,
                        details: val ? answers.familyHistory.details : '',
                      },
                    })}
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
            {answers.familyHistory.hasHistory === true && (
              <textarea
                className="w-full rounded-lg border border-wello-grey-brown/30 bg-wello-beige px-4 py-3 text-sm text-wello-dark-brown placeholder:text-wello-grey-brown/60 focus:border-wello-yellow focus:outline-none"
                rows={4}
                placeholder="Please describe..."
                value={answers.familyHistory.details}
                onChange={e => setAnswers({ ...answers, familyHistory: { ...answers.familyHistory, details: e.target.value } })}
              />
            )}
          </div>
        )}

        {saveError && (
          <p className="mt-4 rounded-lg bg-red-50 px-4 py-2.5 text-sm text-red-600">
            {saveError}
          </p>
        )}

        <div className="mt-8 flex justify-between">
          <button
            onClick={goBack}
            className="rounded-full px-6 py-2.5 text-sm font-semibold text-wello-grey-brown underline-offset-2 transition-colors hover:text-wello-dark-brown hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2"
          >
            Back
          </button>
          <button
            onClick={goNext}
            disabled={!valid || isSaving}
            className="rounded-full bg-wello-yellow px-8 py-2.5 text-sm font-semibold text-wello-dark-brown transition-colors hover:bg-wello-dark-brown hover:text-wello-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wello-dark-brown focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {isSaving ? 'Saving…' : typeof step === 'number' && step === total - 1 ? 'Finish' : 'Next'}
          </button>
        </div>
      </div>
    </main>
  )
}
