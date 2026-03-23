@AGENTS.md

# currentDate
Today's date is 2026-03-22.

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.

Open issues (7 remaining):
PriorityIssueStatusUrgentK8-301: Auth guards on all API routesDONE (shipped 2026-03-22)UrgentK8-302: Rotate hardcoded secretsDOCS SHIPPED — manual rotation still needed (see SECURITY.md)UrgentK8-303: Zod input validation + CSRFDONE (shipped 2026-03-22)MediumK8-307: Sort controlsBacklogMediumK8-312: Filter controlsBacklogMediumK8-313: Slide-out detail panelBacklogLowK8-314: Clickable TBD/Review countsBacklog

Manual steps still needed:
1. Rotate BETTER_AUTH_SECRET per SECURITY.md
2. Add https://subtrackt.vercel.app/api/auth/callback/google as redirect URI in Google Cloud Console
3. Add RESEND_API_KEY and CRON_SECRET to Vercel env vars

What's left (from the roadmap)
NOW gaps to close:
* Fill missing subscription costs (costsTBD)
* Complete tax categorization for all business subs
* Populate next_renewal_date for all active subs
* Surface unused DB fields (cancel_url, cancel_notes, auto_renew) in the UI
NEXT to build (priority order):
1. ~~Add-subscription UI~~ DONE (shipped 2026-03-22)
2. ~~Email notification system~~ DONE (shipped 2026-03-22) — Resend + Slack webhook, Vercel Cron, notification preferences UI
3. Cancelled sub tracking + "Money Saved" counter
4. Calendar integration
5. Stale review reminders
6. Enhanced tax export (PDF, year filter)
7. Sort controls (K8-307)
8. Filter controls (K8-312)
9. Slide-out detail panel (K8-313)

Continuation Prompt
Copy this into your next session:
Context: subtrackt is a subscription tracker with tax deductibility features. Repo: github.com/k8makrix/subtrackt. Tech: Next.js 16, React 19, Neon Postgres, Better Auth (Google OAuth), Tailwind 4, Resend (email), Vercel Cron.
What's done: Core app built and deployed — subscription CRUD, 3-tab dashboard, urgency-coded renewals, keep/cancel/review decisions, tax categorization, CSV export, notes, search, Lenny Pass section. Security hardening shipped (auth guards, Zod validation, CSRF). Add Subscription UI shipped. Email notification system shipped: pre-renewal alerts (7d/3d/day-of), weekly digest, Slack webhook support, notification preferences modal (bell icon in header), user_id scoping on all API routes, Vercel Cron daily at 2PM UTC, dedup via notification_log table. DB has: subscriptions (with user_id), notification_preferences, notification_log tables. Product strategy docs live in docs/strategy/.
What's next: Top priority is cancelled sub tracking with a "Money Saved" counter. After that: calendar integration, stale review reminders, enhanced tax export. Also: sort/filter controls (K8-307, K8-312) and slide-out detail panel (K8-313).
Manual steps still needed: (1) Rotate BETTER_AUTH_SECRET per SECURITY.md, (2) Add Google OAuth redirect URI for production, (3) Add RESEND_API_KEY and CRON_SECRET to Vercel env vars.
Start with: read docs/strategy/03-roadmap.md, then build cancelled sub tracking + "Money Saved" counter.
