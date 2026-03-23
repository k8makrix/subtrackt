@AGENTS.md

# currentDate
Today's date is 2026-03-22.

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.

Open issues (8 remaining):
PriorityIssueStatusUrgentK8-302: Rotate hardcoded secretsDOCS SHIPPED -- manual rotation still needed (see SECURITY.md)MediumK8-307: Sort controlsBacklogMediumK8-312: Filter controlsBacklogMediumK8-313: Slide-out detail panelBacklogMediumK8-317: Calendar integrationBacklogMediumK8-318: Stale review remindersBacklogLowK8-314: Clickable TBD/Review countsBacklogLowK8-319: Enhanced tax export (PDF, year filter)Backlog

Manual steps still needed:
1. Rotate BETTER_AUTH_SECRET per SECURITY.md
2. Add https://subtrackt.vercel.app/api/auth/callback/google as redirect URI in Google Cloud Console
3. Add RESEND_API_KEY and CRON_SECRET to Vercel env vars

What's shipped (chronological):
1. Core app -- subscription CRUD, 3-tab dashboard, urgency-coded renewals, tax categorization, CSV export, notes, search, Lenny Pass section
2. Security hardening -- auth guards (K8-301), Zod validation + CSRF (K8-303) (shipped 2026-03-22)
3. Add Subscription UI (shipped 2026-03-22)
4. Email notification system -- Resend + Slack webhook, Vercel Cron, notification preferences UI (shipped 2026-03-22)
5. Cancelled sub tracking + Money Saved counter (K8-316) -- auto-cancel on decision change, Money Saved dashboard card, collapsible cancelled section, undo support, CSV export (shipped 2026-03-23)

What's next (priority order from roadmap):
1. K8-317: Calendar integration (.ics export or Google Calendar sync)
2. K8-318: Stale review reminders (30+ day "review" nudges on dashboard + digest)
3. K8-319: Enhanced tax export (PDF, year filter)
4. K8-307: Sort controls
5. K8-312: Filter controls
6. K8-313: Slide-out detail panel
7. K8-314: Clickable TBD/Review counts

NOW gaps to close (data quality):
* Fill missing subscription costs (costsTBD count on dashboard)
* Complete tax categorization for all business subs
* Populate next_renewal_date for all active subs
* Surface unused DB fields (cancel_url, cancel_notes, auto_renew) in the UI

Continuation Prompt
Copy this into your next session:
Context: subtrackt is a subscription tracker with tax deductibility features. Repo: github.com/k8makrix/subtrackt. Tech: Next.js 16, React 19, Neon Postgres, Better Auth (Google OAuth), Tailwind 4, Resend (email), Vercel Cron. Neon project ID: ancient-hall-94484639.
What's done: Core app built and deployed. Subscription CRUD, 3-tab dashboard (overview, all subs, tax & expenses), urgency-coded renewals, keep/cancel/review decisions, tax categorization, CSV export, notes, search, Lenny Pass section. Security hardening (auth guards, Zod validation, CSRF). Add Subscription UI. Email notification system (pre-renewal alerts 7d/3d/day-of, weekly digest, Slack webhook, notification preferences modal, Vercel Cron daily 2PM UTC, dedup via notification_log). Cancelled sub tracking with Money Saved counter (K8-316): auto-cancel on decision change, Money Saved card in 2x2 dashboard grid, collapsible cancelled section in All Subscriptions tab, undo support (revert cancel restores active + clears canceled_at), strikethrough styling, CSV export includes canceled_at. DB tables: subscriptions (with user_id, canceled_at), notification_preferences, notification_log. Product strategy docs in docs/strategy/.
What's next: Top priority is K8-317 calendar integration (.ics export or Google Calendar sync). After that: K8-318 stale review reminders, K8-319 enhanced tax export. Also in backlog: K8-307 sort controls, K8-312 filter controls, K8-313 slide-out detail panel, K8-314 clickable TBD/review counts.
Manual steps still needed: (1) Rotate BETTER_AUTH_SECRET per SECURITY.md, (2) Add Google OAuth redirect URI for production, (3) Add RESEND_API_KEY and CRON_SECRET to Vercel env vars.
Start with: read docs/strategy/03-roadmap.md, then build K8-317 calendar integration.
