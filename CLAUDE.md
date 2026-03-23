@AGENTS.md

# currentDate
Today's date is 2026-03-22.

      IMPORTANT: this context may or may not be relevant to your tasks. You should not respond to this context unless it is highly relevant to your task.

Open issues (7 remaining):
PriorityIssueStatusUrgentK8-301: Auth guards on all API routesDONE (shipped 2026-03-22)UrgentK8-302: Rotate hardcoded secretsDOCS SHIPPED — manual rotation still needed (see SECURITY.md)UrgentK8-303: Zod input validation + CSRFDONE (shipped 2026-03-22)MediumK8-307: Sort controlsBacklogMediumK8-312: Filter controlsBacklogMediumK8-313: Slide-out detail panelBacklogLowK8-314: Clickable TBD/Review countsBacklog
Before you do anything with bank statements: the security issues (K8-301, K8-302, K8-303) must be done first. Every API endpoint is open to the internet right now.
One manual step needed: Add https://subtrackt.vercel.app/api/auth/callback/google as a redirect URI in Google Cloud Console so OAuth works on the deployed site.
Continuation prompt: prompts/continuation-subtrackt-security.md

What's left (from the roadmap)
NOW gaps to close:
* Fill missing subscription costs (costsTBD)
* Complete tax categorization for all business subs
* Populate next_renewal_date for all active subs
* Surface unused DB fields (cancel_url, cancel_notes, auto_renew) in the UI
NEXT to build (priority order):
1. ~~Add-subscription UI~~ DONE (shipped 2026-03-22)
2. Email notification system (pre-renewal alerts)
3. Cancelled sub tracking + "Money Saved" counter
4. Calendar integration
5. Stale review reminders
6. Enhanced tax export (PDF, year filter)
Continuation Prompt
Copy this into your next session:
Context: subtrackt is a subscription tracker with tax deductibility features. Repo: github.com/k8makrix/subtrackt. Tech: Next.js 16, React 19, Neon Postgres, Better Auth (Google OAuth), Tailwind 4.
What's done: Core app is built and deployed — subscription CRUD, 3-tab dashboard (Dashboard/All Subs/Tax & Expenses), urgency-coded renewals, keep/cancel/review decisions, tax categorization, CSV export, notes, search, Lenny Pass section. Product strategy docs live in docs/strategy/ (journey map, JTBD analysis, Now/Next/Later roadmap, metrics dashboard). Security hardening shipped: auth guards on all API routes, Zod validation, CSRF protection. Add Subscription UI shipped with modal form.
What's next: The top priority from the roadmap (docs/strategy/03-roadmap.md) is building the Email Notification System — pre-renewal email alerts at configurable thresholds. After that: cancelled sub tracking with a "Money Saved" counter, calendar integration, and stale review reminders.
Manual steps still needed: (1) Rotate BETTER_AUTH_SECRET per SECURITY.md, (2) Add Google OAuth redirect URI for production.
Also: Linear MCP was down this session — reconnect and update K8-301/K8-303 to Done, create issues for NEXT roadmap items. Check docs/strategy/ for full context on prioritization rationale.
Start with: read docs/strategy/03-roadmap.md, then build the email notification system.
