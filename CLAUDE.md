@AGENTS.md

# currentDate
Today's date is 2026-03-23.

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.

Open issues (5 remaining):
PriorityIssueStatusUrgentK8-302: Rotate hardcoded secretsDOCS SHIPPED -- manual rotation still needed (see SECURITY.md)MediumK8-307: Sort controlsBacklogMediumK8-312: Filter controlsBacklogMediumK8-313: Slide-out detail panelBacklogLowK8-314: Clickable TBD/Review countsBacklog

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
6. Calendar integration .ics export (K8-317) -- RFC 5545 compliant, all-day events with VALARM reminders, Export to Calendar buttons on Dashboard + All Subscriptions tabs (shipped 2026-03-23)
7. Stale review reminders (K8-318) -- decision_changed_at tracking, 30+ day stale detection in cron (weekly per-sub dedup), stale review email/Slack templates, stale section in weekly digest, dashboard stale count + badges, notification preference toggle (shipped 2026-03-23)
8. Enhanced tax export (K8-319) -- PDF generation (jspdf + jspdf-autotable), year filter dropdown (2025/2026/All Time), year-filtered CSV + PDF export endpoints, client-side year filtering on Tax tab summary cards + detail table (shipped 2026-03-23)

What's next (priority order from roadmap):
1. K8-307: Sort controls
4. K8-312: Filter controls
5. K8-313: Slide-out detail panel
6. K8-314: Clickable TBD/Review counts

Data audit status (2026-03-23):
69 subscription records in DB. Major audit completed with Kate:
* 23 active/keep ($11,431/yr), 15 active/review ($4,347/yr), 3 active/cancel ($1,356/yr)
* 8 canceled ($2,974/yr saved), 21 lenny-pass ($0)
* Immediate action: Cancel Magic Patterns Paid ($100/mo), Zeroqode ($10/mo dark pattern UI), verify 7 "believed canceled" subs
* Overpay issues: Lovable Labs $200/mo (free Pass version exists), Claude Max $200/mo (Artium has work account)
* Wins: INFLACT canceled, Canva consolidated, Getty/PicMonkey/Superhuman/LinkedIn/Loom canceled

Remaining data gaps:
* Verify 7 "believed canceled" subs (Notion, Slack, Zoom, Calendly, NYT, Hulu, Caleb Hammer)
* Cancel Magic Patterns Paid + Zeroqode (need UI help for Zeroqode dark pattern)
* Contact Lovable about merging accounts / refund
* Consolidate Toby orgs (paying $144.18/yr across 2 orgs, could save $108)
* Miro renewal review before May 29 ($384/yr, removed Nina, downgrade?)
* Kaiser Permanente + Rocket Money still missing costs
* Fill remaining email_account, payment_source fields
