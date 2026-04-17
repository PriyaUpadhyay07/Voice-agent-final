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

## 🚀 Phase Status
- **Phase 1: Foundation & Auth**: ✅ COMPLETED (Supabase sync verified, Admin login cleaned)
- **Phase 2: Dashboard & Lead Management**: ✅ COMPLETED (Sheet view implemented, grouping by date active)
- **Phase 3: AI Voice & SignalWire Integration**: 🚧 In Progress (Ready for Testing)
- **Phase 4: SaaS Subscription & Scaling**: ⏳ Pending

## 🛠️ Tech Stack Reminder
- Next.js (App Router)
- Prisma (with Supabase/PostgreSQL)
- NextAuth / Auth.js
- Vanilla CSS (Rich/Premium Aesthetics)
- SignalWire (Telephony)
- ElevenLabs (AI Voice)
