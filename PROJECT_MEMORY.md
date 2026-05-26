# Project Memory & Persistent Rules

This file tracks permanently removed features, user preferences, and implementation status to ensure consistency across chat sessions.

## 🛑 Permanently Removed / Never Add Again
1. **Admin Signup/Login Page**: The owner (User) is the only admin. Do NOT add a public signup flow or a separate login page specifically for the Admin portal that looks like the client one. Access should be restricted but not via a public-facing signup button.
2. **Generic Placeholders**: Never use placeholder images. Always use real assets or generated images.
3. **Complex Admin Onboarding**: Since there is only one admin, skip complex onboarding flows for the admin role.

## ✅ Core Requirements (Must Follow)
1. **Data Isolation**: Every user/client MUST only see their own data. Use strict `userId` filtering in all Prisma/DB queries.
2. **Sheet-Style Lead Dashboard**: 
   - Leads must be grouped and shown like "Google Sheets".
   - Each group/sheet must show the **Upload Date**.
   - Sheets must be expandable/collapsible.
   - Column-based view (like a spreadsheet).
3. **Supabase Integration**: Ensure `prisma` is correctly pushing to Supabase and Auth is correctly creating entries in the `User` table.
4. **SignalWire**: International calling is now enabled. All call logic should prioritize SignalWire with proper International formatting (+prefix).
5. **Passwordless Magic Link Auth**: Use Supabase passwordless auth (Magic Links or OTP via email) for client logins. This eliminates the password trust issue and provides a seamless login experience.
6. **Admin Pre-Setup Workflow**: 
   - Clients submit onboarding answers to the admin (6-7 questions: Goal, FAQ, Voice, Transfer Number, Calendar, Caller ID).
   - Admin manually pre-configures the client's profile in the database linked to their email.
   - Client is given the direct link, logs in via Magic Link, and sees their ready-to-use dashboard.

## 🚀 Phase Status
- **Phase 1: Foundation & Auth**: ✅ COMPLETED (Supabase sync verified, Admin login cleaned)
- **Phase 2: Dashboard & Lead Management**: ✅ COMPLETED (Sheet view implemented, grouping by date active)
- **Phase 3: AI Voice & SignalWire Integration**: 🚧 In Progress (Ready for Testing)
- **Phase 4: SaaS Scaling & Passwordless Magic Links**: 🚧 Next Up (Designing the Onboarding Flow & Magic Link Integration)

## 🛠️ Tech Stack Reminder
- Next.js (App Router)
- Prisma (with Supabase/PostgreSQL)
- Supabase Auth (Passwordless Magic Link)
- Vanilla CSS (Rich/Premium Aesthetics)
- SignalWire (Telephony)
- ElevenLabs (AI Voice)

## 🚨 CRITICAL: Vercel Deployment & Client URLs (NEVER FORGET)
- **Vercel deploys from `lisa/` directory**, NOT from root `/`. All code changes for the live site go in `lisa/`.
- `src/app/` (root app) routes like `/client`, `/api/clients` do NOT exist on Vercel — they return 404.
- **Central Admin Link**: `https://voice-agent-final-hfv9.vercel.app/`
- **Client Portal Link Format**: `https://voice-agent-final-hfv9.vercel.app/{userId}`
  - Example (Riya): `https://voice-agent-final-hfv9.vercel.app/cmplclmxv0000xbavsd7ozeb6`
- The `lisa/src/app/[userId]/page.tsx` dynamic route handles all client dashboards.
- Each client gets a unique `userId` from the DB → append it to the central link → isolated dashboard.
- **NEVER** use `/client?userId=xxx` format — it does NOT work on Vercel.
- **NEVER** add hardcoded Priya fallbacks in API routes — always return 404 if user not found.
