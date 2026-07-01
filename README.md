# Wello

<img src="public/wello-logo.png" alt="Wello" width="120" />

**A warm companion for caregivers of children with mental and cognitive disabilities.**

Wello is a web application that gives caregivers personalized, AI-generated guidance based on their child's specific diagnosis, age, medications, and family history. It combines a structured onboarding flow, a Claude-powered dashboard, and a daily journal so caregivers always have the context and support they need close at hand.

---

## The Problem

Parents and caregivers of children with conditions like Autism, ADHD, Down Syndrome, or Cerebral Palsy often navigate a fragmented support system. Generic resources do not account for the nuances of each child's situation, and caregivers frequently feel alone in figuring out what symptoms to watch for, what strategies actually help, and where to find trustworthy information.

## The Solution

Wello personalizes everything to the child. After a short onboarding questionnaire, the app uses the Claude API to generate a dashboard tailored to that specific child: relevant symptoms to monitor, practical caregiving tips, and curated resources. Caregivers can also log daily observations in a structured journal, building a record of behaviors and moods over time.

---

## Features

### Onboarding
- Account creation with full name, email, and password
- A guided 6-question flow covering the child's name, age, diagnoses, time since diagnosis, current medications, and family history
- All answers are stored securely in Supabase and tied to the caregiver's account

### AI-Powered Dashboard
- On first visit, Wello calls the Claude API with the child's full profile
- Claude returns a personalized set of symptoms to watch for, caregiving tips, and real external resources
- The result is cached in the database so subsequent visits are instant
- When the child's profile is updated, the cache clears and Claude regenerates on the next dashboard visit

### Journal
- Caregivers can log daily observations with a two-step flow: select a category (Symptoms, Behavior, Mood, Sleep, Appetite, Other), then choose specific options and add free-form notes
- Each entry is timestamped to today's date automatically
- All entries are displayed in reverse chronological order with date, category, selected observations, and notes

### Child Profile
- Caregivers can view and update all of their answers from the onboarding flow at any time
- Saving changes clears the dashboard cache so the AI content stays current with the child's situation

### Account Management
- Secure sign-in and sign-out via Supabase Auth
- Session persistence handled server-side with cookie-based auth

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS v4 |
| Database and Auth | Supabase (PostgreSQL + Row Level Security) |
| AI | Anthropic Claude API (claude-opus-4-8) |
| Font | Lora (Google Fonts) |
| Icons | Lucide React |

---

## How the AI Integration Works

When a caregiver visits the dashboard for the first time, Wello's `/api/dashboard/content` route:

1. Authenticates the user via Supabase
2. Fetches the child's profile from the database
3. Builds a structured prompt with the child's diagnoses, age, medications, and family history
4. Calls the Claude API and asks it to return a JSON object with three fields: symptoms, tips, and resources
5. Saves the response to the `dashboard_content` column on the child's row
6. Returns the cached content on all future visits until the profile is changed

This approach keeps API costs minimal while ensuring every caregiver sees content that reflects their child's actual situation.

---

## Database Schema

**profiles** -- user's display name, linked to Supabase Auth

**children** -- the child's full profile including diagnoses, medications, family history, and cached dashboard content

**journal_entries** -- daily log entries with category, selected observations, notes, and date

---

## Live Demo

[https://wello-chi.vercel.app](https://wello-chi.vercel.app)

---

## Project Structure

```
app/
  page.tsx              # Landing page
  register/page.tsx     # Sign up
  login/page.tsx        # Log in
  questions/page.tsx    # Onboarding questionnaire
  welcome/page.tsx      # Home screen after login
  info/page.tsx         # AI-powered dashboard
  journal/page.tsx      # Daily journal
  profile/page.tsx      # Child profile editor
  api/
    dashboard/content/  # Claude API route
    account/delete/     # Account deletion route
  components/
    AccountMenu.tsx     # Hamburger menu with sign out
```

---

---

## Team

**Sour Hack Kids**

Isabella Chou, Sarah Park, Tulsi Patel, Nyan Huynh, Justin Greenberg

---

Built with care for the families who need it most.
