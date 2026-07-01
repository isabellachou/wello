import { createClient } from '@/lib/supabase/server'
import Anthropic from '@anthropic-ai/sdk'

const anthropic = new Anthropic()

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response('Unauthorized', { status: 401 })
  }

  const { data: child } = await supabase
    .from('children')
    .select('id, name, age, diagnoses, medications, family_history, family_history_details, dashboard_content')
    .eq('profile_id', user.id)
    .maybeSingle()

  if (!child) {
    return Response.json({ symptoms: [], tips: [], resources: [] })
  }

  if (child.dashboard_content) {
    return Response.json(child.dashboard_content)
  }

  const profile = [
    `Name: ${child.name}`,
    `Age: ${child.age}`,
    `Diagnoses: ${child.diagnoses?.join(', ') || 'not specified'}`,
    `Medications: ${child.medications?.length ? child.medications.join(', ') : 'none'}`,
    `Family history: ${child.family_history ? `Yes — ${child.family_history_details || 'details not provided'}` : 'No'}`,
  ].join('\n')

  const msg = await anthropic.messages.create({
    model: 'claude-opus-4-8',
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `You are a knowledgeable, compassionate assistant helping caregivers of children with mental or cognitive disabilities.

Based on this child's profile, generate personalized dashboard content:

${profile}

Return a JSON object with exactly these three keys. No markdown, no explanation — raw JSON only.

{
  "symptoms": string[],
  "tips": string[],
  "resources": [{ "label": string, "href": string }]
}

Rules:
- symptoms: 8 specific behaviors or symptoms to watch for given the diagnoses. Short labels (3–6 words).
- tips: 8 practical, actionable caregiving tips tailored to these specific diagnoses and age. Short action phrases (5–8 words).
- resources: 6 real organizations or tools. Use only well-known resources you are confident exist with accurate URLs (e.g. chadd.org, autismspeaks.org, understood.org, cdc.gov/ncbddd).`,
    }],
  })

  const raw = msg.content[0].type === 'text' ? msg.content[0].text : ''
  const cleaned = raw.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim()

  let content: object
  try {
    content = JSON.parse(cleaned)
  } catch {
    console.error('Failed to parse Claude response:', raw)
    return Response.json({ symptoms: [], tips: [], resources: [] })
  }

  await supabase
    .from('children')
    .update({ dashboard_content: content })
    .eq('id', child.id)

  return Response.json(content)
}
