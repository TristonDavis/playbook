# Playbook — Sports Analysis Workspace

A structured workspace for sports analysts, enthusiasts, and researchers. Build matchup studies, track your analysis accuracy over time, and get AI-powered insights.

---

## Tech Stack

| Layer | Tool |
|-------|------|
| Framework | Next.js 14 (App Router) |
| Styling | Tailwind CSS |
| Auth | Clerk |
| Database | Supabase (Postgres + RLS) |
| AI | Anthropic Claude API |
| Hosting | Vercel |
| Language | TypeScript |

---

## Local Setup (Step by Step)

### 1. Clone and install

```bash
git clone https://github.com/YOUR_USERNAME/playbook.git
cd playbook
npm install
```

### 2. Create your `.env.local`

```bash
cp .env.local.example .env.local
```

Then fill in each value — see the sections below.

---

### 3. Set up Clerk (Auth)

1. Go to [clerk.com](https://clerk.com) and create a free account
2. Create a new application — name it "Playbook"
3. Enable **Email** and **Google** sign-in methods
4. Copy your keys from the **API Keys** page:
   - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`
   - `CLERK_SECRET_KEY`

---

### 4. Set up Supabase (Database)

1. Go to [supabase.com](https://supabase.com) and open your project
2. Navigate to **SQL Editor → New Query**
3. Paste the entire contents of `supabase/schema.sql` and click **Run**
4. Go to **Settings → API** and copy:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY` (keep this secret — server only)

#### Connect Clerk to Supabase (JWT)

So that Supabase RLS can verify Clerk user IDs:

1. In Clerk Dashboard → **JWT Templates** → **New template** → choose **Supabase**
2. Copy the generated JWT secret
3. In Supabase → **Settings → Auth → JWT Settings** → paste the secret

---

### 5. Set up Anthropic API

1. Go to [console.anthropic.com](https://console.anthropic.com)
2. Create an API key
3. Add it to `.env.local` as `ANTHROPIC_API_KEY`

---

### 6. Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

---

## Deploy to Vercel

```bash
# Install Vercel CLI if you haven't
npm i -g vercel

# Deploy
vercel
```

Then in the Vercel dashboard:
- Go to your project → **Settings → Environment Variables**
- Add all variables from your `.env.local`

Every push to `main` will auto-deploy.

---

## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── analyze/route.ts      # Claude AI proxy
│   │   ├── studies/route.ts      # Studies CRUD
│   │   └── predictions/route.ts  # Predictions CRUD
│   ├── auth/
│   │   ├── sign-in/              # Clerk sign-in
│   │   └── sign-up/              # Clerk sign-up
│   ├── dashboard/
│   │   ├── layout.tsx            # Sidebar layout
│   │   ├── page.tsx              # Studies list
│   │   ├── study/[id]/page.tsx   # Study editor
│   │   └── tracker/page.tsx      # Prediction tracker
│   ├── layout.tsx                # Root layout (Clerk provider)
│   └── page.tsx                  # Landing page
├── components/
│   ├── editor/
│   │   ├── StudyEditor.tsx       # Rich text editor
│   │   ├── StudyListSidebar.tsx  # Left study list
│   │   ├── EditorToolbar.tsx     # Formatting toolbar
│   │   └── RightPanel.tsx        # Info + AI tabs
│   └── tracker/
│       ├── CalibrationChart.tsx  # Canvas calibration chart
│       ├── DonutChart.tsx        # Canvas donut chart
│       └── LogPredictionModal.tsx # Log prediction form
├── lib/
│   ├── supabase/
│   │   ├── client.ts             # Browser Supabase client
│   │   └── server.ts             # Server Supabase client
│   └── utils.ts                  # Helpers + analytics
├── middleware.ts                  # Clerk route protection
└── types/index.ts                # All TypeScript types
supabase/
└── schema.sql                    # Full DB schema + RLS
```

---

## V1 Feature Checklist

- [x] User auth (sign up, sign in, sign out)
- [x] Create / edit / delete studies
- [x] Study types: matchup, stats & trends, game notes
- [x] Tags and sport filtering
- [x] Autosave while typing
- [x] AI analysis panel (Claude)
- [x] Prediction tracker
- [x] Confidence calibration chart
- [x] Outcome donut chart
- [x] Per-user data isolation (RLS)
- [x] Deploy to Vercel

## Roadmap (Post V1)

- [ ] Live sports data integration
- [ ] Study sharing + public links
- [ ] Free / Pro plan gating
- [ ] React Native iOS app
- [ ] Push notifications
- [ ] Study templates

---

## iOS Path

Because Playbook is built with React (Next.js), the iOS migration path is straightforward:

1. Create an **Expo + React Native** project
2. Move shared business logic, Supabase queries, and API calls into a `/packages/core` shared package
3. Rebuild UI components in React Native using the same design tokens
4. Reuse all API routes from the Next.js backend

The data layer (Supabase), auth (Clerk), and AI (Anthropic) are all platform-agnostic and require zero changes.
