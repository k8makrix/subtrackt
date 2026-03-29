# Step 13: Product Requirements Document

> Recipe step 13 of 15 | Phase: Deliver | Date: 2026-03-29
> Scope: NOW roadmap items (Sprints 1-2) + pre-launch security gate

---

## 1. Problem Statement

Subtrackt helps people manage recurring subscriptions intentionally rather than passively. The MVP is shipped and working for a single user, but three problems prevent it from reaching more people:

1. **Invisible product.** No landing page, no public presence. The product requires sign-in to see anything.
2. **Incomplete decision loop.** Users can track subscriptions and set decisions, but there's no proactive system to ensure every renewal gets a conscious decision before the charge hits.
3. **Security gaps.** The server component loads all users' data, and secrets haven't been rotated. These must be fixed before any public launch.

---

## 2. Goals

| Goal | Metric | Target | Timeframe |
|------|--------|--------|-----------|
| Every renewal is a deliberate decision | Conscious Renewal Rate | 65% | End of Q2 |
| New users can discover and understand Subtrackt | Landing page shipped | Live | 5 weeks |
| Security issues resolved before public access | SEC-1 through SEC-5 | All closed | Before landing page goes live |
| Business subscriptions are tax-ready | Tax-Ready % | 90% | End of Q2 |

---

## 3. Non-Goals

- Mobile native app (responsive web covers the immediate need)
- Bank connection / Plaid integration (architectural planning only)
- Multi-user / team features (deferred to Q3+)
- Monetization (open to later, not a Q2 concern)
- AI-powered features beyond basic heuristics (Receipt Scanner is LATER)

---

## 4. User Stories Overview

### Milestone 1: Pre-Launch Security Gate

| ID | Story | Priority |
|----|-------|----------|
| SEC-1 | As a user, my subscription data is only visible to me, even at the server component level | **Must** |
| SEC-2 | As a user, my sessions are secured with a properly rotated secret | **Must** |
| SEC-3 | As the system, API routes are protected against abuse via rate limiting | **Must** |
| SEC-4 | As a user, I can delete my account and all associated data | **Must** |
| SEC-5 | As a visitor, I see proper page titles and descriptions (not "Create Next App") | **Must** |
| UX-1 | As a user, text has sufficient contrast against the dark background (WCAG AA) | **Must** |
| UX-2 | As a new user, I see a helpful empty state when I have no subscriptions | **Must** |

### Milestone 2: Sprint 1 -- Close the Decision Loop

| ID | Story | Priority |
|----|-------|----------|
| DL-1 | As a user, I receive email prompts before renewal that ask me to confirm my decision | **Must** |
| DL-2 | As a user, I see a "Needs Attention" section on the dashboard for subs renewing soon without a recent decision | **Must** |
| DL-3 | As a user, I can see at a glance which subs have decisions and which don't (badge on collapsed row) | **Must** |
| DL-4 | As a user, I see an "Undecided" counter on the dashboard alongside the existing metrics | **Should** |
| DL-5 | As a user, subs in "review" status become progressively more prominent as they age (14d, 30d, 60d) | **Should** |
| DL-6 | As a user, I see how much a sub in "review" is costing me while I decide | **Should** |
| DL-7 | As a user, when I cancel a sub I see what else I could buy with those savings | **Should** |
| DL-8 | As a user, new subscriptions I add default to "review" decision status | **Should** |

### Milestone 3: Sprint 2 -- Landing Page & Foundation

| ID | Story | Priority |
|----|-------|----------|
| LP-1 | As a visitor, I can understand Subtrackt's value proposition without signing in | **Must** |
| LP-2 | As a visitor, I see a hero metric (Subscription Score concept) that communicates the product's purpose | **Should** |
| LP-3 | As a visitor, I can sign in with Google from the landing page | **Must** |
| LP-4 | As a visitor, I see proper Open Graph metadata when the link is shared on social media | **Should** |
| SS-1 | As a user, I have a Subscription Score (0-100) that reflects how well-managed my subscriptions are | **Should** |
| SS-2 | As a user, I can see what factors contribute to my Subscription Score | **Should** |
| TP-1 | As a new user, I can quickly add common subscriptions from pre-populated templates | **Should** |
| TP-2 | As a user, I receive a weekly email highlighting subs without a decision | **Should** |

---

## 5. Constraints

| Constraint | Detail |
|-----------|--------|
| Solo developer | All work done by one person. Scope must be realistic for 5 weeks. |
| No budget | No paid services beyond existing stack (Neon, Vercel, Resend). |
| Dark theme only | All new UI must use bg-gray-950, text-gray-100, amber accent. |
| No ORM | Raw SQL via getDb(). No Drizzle. |
| Auth on every route | requireAuth() + validateOrigin() on all state-changing endpoints. |
| Zod on all inputs | New schemas in validators.ts for new endpoints. |
| Next.js 16 | Read docs in node_modules/next/dist/docs/ before writing code. |

---

## 6. Technical Approach

### Milestone 1: Security Gate

**SEC-1 (page.tsx user filter):**
- Add auth check to page.tsx server component
- Use `requireAuth()` pattern or redirect to sign-in if no session
- Filter subscription query by `user_id = ${session.user.id}`

**SEC-3 (Rate limiting):**
- Add Vercel Edge Middleware or use upstash/ratelimit
- Apply to /api/subscriptions, /api/export, /api/notification-preferences
- Exempt /api/auth/* (Better Auth handles its own rate limiting)

**SEC-4 (Account deletion):**
- New API route: DELETE /api/account
- Cascade delete: subscriptions, subscription_notes, notification_preferences, notification_log
- Better Auth account cleanup
- UI: settings/profile section with "Delete Account" button

### Milestone 2: Decision Loop

**DL-1 (Pre-renewal prompts):**
- Modify existing email templates in email-templates.ts
- Add decision CTA: "Keep it" / "Cancel it" / "Review in app" links
- Links go to app with subscription expanded

**DL-3 (Decision badge on collapsed row):**
- Add colored badge to SubscriptionRow collapsed view
- Green = keep, amber = review, red = cancel, gray = undecided
- Small visual change, high information density improvement

**DL-5 (Time-decay urgency):**
- Calculate days since `decision_changed_at` for review items
- Apply progressive styling: 14d = subtle, 30d = amber, 60d = red
- Reuse existing urgencyColor pattern

### Milestone 3: Landing Page

**LP-1 (Landing page):**
- New route: /landing or modify page.tsx to show landing for unauthenticated visitors
- Hero section: tagline, value prop, screenshot/mockup
- Features section: decision workflow, tax tracking, renewal alerts
- CTA: "Sign in with Google" button
- Approach: Server component checks auth; if no session, render landing; if session, render Dashboard

**SS-1 (Subscription Score):**
- Algorithm: weighted composite of decision fill %, cost fill %, renewal date fill %, review freshness, tax categorization %
- Display: circular gauge or large number on Dashboard tab
- Could also appear on landing page as "See your Subscription Score"

---

## 7. Security Requirements (from Step 12)

All must be closed before landing page goes live:

| ID | Requirement | Acceptance criteria |
|----|------------|-------------------|
| SEC-1 | page.tsx filters by user_id | No subscription data visible to unauthenticated users or other users |
| SEC-2 | BETTER_AUTH_SECRET rotated | New secret deployed, old sessions invalidated |
| SEC-3 | Rate limiting on API routes | 429 response after threshold (e.g., 60 req/min per IP) |
| SEC-4 | Account deletion | User can delete account; all data cascade deleted; confirmation required |
| SEC-5 | Layout metadata updated | Title: "Subtrackt", Description: meaningful value prop |

---

## 8. Success Criteria

| Milestone | Success when... |
|-----------|----------------|
| Security Gate | All SEC-1 through SEC-5 pass manual verification. No data leaks on multi-user test. |
| Sprint 1 | Conscious Renewal Rate measurably improves. Every sub renewing within 7 days has a visible prompt. |
| Sprint 2 | An unauthenticated visitor can understand Subtrackt, sign in, and add a subscription within 5 minutes. |

---

## 9. Open Questions

| # | Question | Decision needed by |
|---|---------|-------------------|
| 1 | Should the landing page be a separate route (/landing) or conditional rendering on page.tsx? | Sprint 2 start |
| 2 | How should Subscription Score be weighted? (equal weight vs. heavier on decisions?) | Sprint 2 start |
| 3 | Should pre-populated templates be hardcoded or community-contributed? | Sprint 2 start |
| 4 | What rate limit thresholds are appropriate? (60/min? 100/min?) | Security gate |

---

## 10. Milestones & Timeline

```
Week 1-2: Security Gate (Milestone 1)
  ├── SEC-1: Fix page.tsx user filter
  ├── SEC-2: Rotate BETTER_AUTH_SECRET
  ├── SEC-3: Add rate limiting
  ├── SEC-4: Account deletion flow
  ├── SEC-5: Update metadata
  ├── UX-1: Fix contrast issues
  └── UX-2: Empty state for new users

Week 2-3: Sprint 1 -- Decision Loop (Milestone 2)
  ├── DL-1: Pre-renewal decision prompts
  ├── DL-2: "Needs Attention" dashboard section
  ├── DL-3: Decision badge on collapsed rows
  ├── DL-4: Undecided counter
  ├── DL-5: Time-decay urgency
  ├── DL-6: Cost of indecision
  ├── DL-7: The $X Experiment
  └── DL-8: Default decision on add

Week 4-5: Sprint 2 -- Landing Page (Milestone 3)
  ├── LP-1: Landing page
  ├── LP-2: Hero metric / Subscription Score teaser
  ├── LP-3: Google sign-in on landing
  ├── LP-4: Open Graph metadata
  ├── SS-1: Subscription Score algorithm
  ├── SS-2: Score breakdown
  ├── TP-1: Pre-populated templates
  └── TP-2: Weekly undecided email
```

---

## References

- Roadmap: Step 9 (NOW sprints 1-2)
- RICE scores: Step 8
- Security requirements: Step 12 (SEC-1 through SEC-5)
- UX issues: Step 10 (issues #2, #5, empty state)
- Pre-mortem risks: Step 11 (T1, U1)
- OKRs: Step 5 (O1, O2, O3)
