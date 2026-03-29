# Step 14: Story Split + Story Write

> Recipe step 14 of 15 | Phase: Deliver | Date: 2026-03-29
> Stories with Gherkin acceptance criteria, mapped to PRD milestones

---

## Milestone 1: Pre-Launch Security Gate

### SEC-1: Filter subscriptions by authenticated user in server component

**As a** user,
**I want** my subscription data to only be visible to me,
**So that** no other user can see my financial information.

```gherkin
Given I am signed in as user A
When the page loads
Then I only see subscriptions where user_id matches my user ID

Given I am not signed in
When I visit the root URL
Then I am redirected to sign-in (or see the landing page)
And no subscription data is loaded or passed to the client

Given user A and user B both have subscriptions
When user A loads the dashboard
Then user A sees only their own subscriptions
And user B's data is not present in the page props
```

**Files:** `src/app/page.tsx`, `src/lib/auth.ts`
**Effort:** 0.5 day

---

### SEC-2: Rotate BETTER_AUTH_SECRET

**As a** system administrator,
**I want** the session secret to be a strong, randomly generated value,
**So that** sessions cannot be forged.

```gherkin
Given the current BETTER_AUTH_SECRET
When I generate a new secret via `openssl rand -base64 32`
And update .env.local and Vercel environment variables
And redeploy
Then all existing sessions are invalidated
And new sessions use the rotated secret
```

**Files:** `.env.local`, Vercel dashboard
**Effort:** 0.25 day (manual)

---

### SEC-3: Add rate limiting to API routes

**As the** system,
**I want** API routes protected against excessive requests,
**So that** an attacker cannot abuse the API.

```gherkin
Given a client making requests to /api/subscriptions
When the client exceeds 60 requests per minute
Then subsequent requests receive a 429 Too Many Requests response
And the response includes a Retry-After header

Given a client making requests to /api/auth/*
Then Better Auth's own rate limiting applies (no additional limits)
```

**Files:** `src/middleware.ts` (new) or Edge Middleware
**Effort:** 1 day

---

### SEC-4: Account deletion

**As a** user,
**I want** to delete my account and all my data,
**So that** I have control over my personal information.

```gherkin
Given I am signed in
When I click "Delete Account" in settings
Then I see a confirmation dialog warning that all data will be permanently deleted

Given I confirm account deletion
When the deletion completes
Then all my subscriptions, notes, notification preferences, and notification logs are deleted
And my Better Auth user, session, and account records are deleted
And I am signed out and redirected to the landing page

Given I cancel the confirmation dialog
Then nothing is deleted and I remain signed in
```

**Files:** New `src/app/api/account/route.ts`, Dashboard.tsx (settings UI)
**Effort:** 1 day

---

### SEC-5: Update layout metadata

**As a** visitor,
**I want** to see a proper page title and description,
**So that** the app appears professional and search engines index it correctly.

```gherkin
Given I visit subtrackt.vercel.app
Then the page title is "Subtrackt - Subscription Tracker"
And the meta description describes the product's value
And Open Graph tags include title, description, and image
```

**Files:** `src/app/layout.tsx`
**Effort:** 0.25 day

---

### UX-1: Fix text contrast

**As a** user,
**I want** all text to be readable against the dark background,
**So that** I can use the app comfortably.

```gherkin
Given any text rendered in the application
When the text color is gray-500 or lighter on gray-950 background
Then the contrast ratio meets WCAG AA (4.5:1 for normal text, 3:1 for large text)
```

**Files:** All components using `text-gray-500`
**Effort:** 0.5 day

---

### UX-2: Empty state for new users

**As a** new user with no subscriptions,
**I want** to see a helpful prompt instead of a blank dashboard,
**So that** I know what to do next.

```gherkin
Given I am signed in and have zero subscriptions
When I view the Dashboard tab
Then I see an illustration or message: "No subscriptions yet"
And a prominent "Add your first subscription" button
And optional tips: "Start by adding your most expensive subscriptions"

Given I have zero subscriptions
When I view the All Subscriptions tab
Then I see the same helpful empty state (not a blank list)
```

**Files:** `src/components/Dashboard.tsx`
**Effort:** 0.5 day

---

## Milestone 2: Sprint 1 -- Close the Decision Loop

### DL-1: Pre-renewal decision prompts in email

**As a** user receiving a renewal alert,
**I want** the email to include my current decision and a prompt to confirm or change it,
**So that** I can act on renewals without opening the app.

```gherkin
Given I have a subscription renewing in 3 days with decision "review"
When the renewal alert email is sent
Then the email includes: service name, cost, renewal date, current decision ("review")
And action links: "Keep it", "Cancel it", "Review in app"
And the "Review in app" link opens the app with that subscription expanded

Given I have a subscription renewing in 3 days with decision "keep"
When the renewal alert email is sent
Then the email shows "You decided to keep this" with a "Change decision" link
```

**Files:** `src/lib/email-templates.ts`, `src/app/api/cron/renewal-alerts/route.ts`
**Effort:** 1 day

---

### DL-2: Dashboard "Needs Attention" section

**As a** user,
**I want** to see which subscriptions need my attention before they renew,
**So that** I don't miss any renewal decisions.

```gherkin
Given I have 3 subscriptions renewing within 7 days
And 1 of them has no decision set
And 1 of them has decision "review" unchanged for 30+ days
When I view the Dashboard tab
Then I see a "Needs Attention" section above the existing metrics
And it lists the 2 subscriptions that need attention (no decision + stale review)
And each item shows service name, cost, renewal date, and reason for attention
```

**Files:** `src/components/Dashboard.tsx`
**Effort:** 1 day

---

### DL-3: Decision badge on collapsed subscription row

**As a** user viewing the subscription list,
**I want** to see each subscription's decision status at a glance,
**So that** I don't need to expand every row to check.

```gherkin
Given a subscription with decision "keep"
When I view it in the collapsed list
Then I see a green "Keep" badge next to the service name

Given a subscription with decision "cancel"
Then I see a red "Cancel" badge

Given a subscription with decision "review"
Then I see an amber "Review" badge

Given a subscription with no decision set
Then I see a gray "Undecided" badge
```

**Files:** `src/components/SubscriptionRow.tsx`
**Effort:** 0.5 day

---

### DL-4: Undecided counter on dashboard

**As a** user,
**I want** to see how many subscriptions don't have a decision,
**So that** I'm motivated to complete my triage.

```gherkin
Given I have 5 active subscriptions with no keep/cancel/review decision
When I view the Dashboard tab
Then I see an "Undecided: 5" metric card alongside Total Annualized and Money Saved
```

**Files:** `src/components/Dashboard.tsx`
**Effort:** 0.25 day

---

### DL-5: Time-decay urgency for stale reviews

**As a** user,
**I want** subscriptions stuck in "review" to become more visually urgent over time,
**So that** I'm prompted to make a decision.

```gherkin
Given a subscription with decision "review" changed 15 days ago
Then its review badge has subtle amber styling

Given a subscription with decision "review" changed 31 days ago
Then its review badge has prominent amber styling with a "30d stale" indicator

Given a subscription with decision "review" changed 61 days ago
Then its review badge has red styling with a "60d stale" indicator
```

**Files:** `src/components/SubscriptionRow.tsx`
**Effort:** 0.5 day

---

### DL-6: Cost of indecision display

**As a** user viewing a subscription in "review" status,
**I want** to see how much it's costing me while I delay my decision,
**So that** I feel urgency to decide.

```gherkin
Given a subscription costing $20/month in "review" for 45 days
When I view it (expanded or in Needs Attention)
Then I see "Costing $30 while in review" (45 days × $20/30 days)
```

**Files:** `src/components/SubscriptionRow.tsx`, `src/components/Dashboard.tsx`
**Effort:** 0.5 day

---

### DL-7: The $X Experiment (savings visualization)

**As a** user who cancels a subscription,
**I want** to see what I could do with the money I'm saving,
**So that** cancelling feels rewarding.

```gherkin
Given I change a subscription's decision to "cancel" and it costs $300/year
When the cancellation is confirmed
Then I see a message: "You're saving $300/year -- that's 60 lattes, a weekend trip, or 2.5 months of Netflix"
```

**Files:** `src/components/SubscriptionRow.tsx`
**Effort:** 0.5 day

---

### DL-8: Default decision on add

**As a** user adding a new subscription,
**I want** it to default to "review" decision status,
**So that** no subscription enters the system without being queued for a decision.

```gherkin
Given I open the Add Subscription modal
When I submit without setting a decision
Then the subscription is created with keep_cancel_review = "review"
And the decision_changed_at timestamp is set to now
```

**Files:** `src/components/AddSubscriptionModal.tsx`, `src/app/api/subscriptions/route.ts`
**Effort:** 0.25 day

---

## Milestone 3: Sprint 2 -- Landing Page & Foundation

### LP-1: Public landing page

**As a** visitor who is not signed in,
**I want** to understand what Subtrackt does and why I should use it,
**So that** I can decide whether to sign up.

```gherkin
Given I am not signed in
When I visit subtrackt.vercel.app
Then I see a landing page with:
  - Hero: tagline, 1-sentence value prop, screenshot or illustration
  - Features: 3-4 key features with icons (decision workflow, renewal alerts, tax tracking, money saved)
  - CTA: "Sign in with Google" button
  - Footer: link to privacy policy
And no subscription data is visible

Given I am already signed in
When I visit subtrackt.vercel.app
Then I see my Dashboard (not the landing page)
```

**Files:** `src/app/page.tsx` (conditional rendering based on auth state)
**Effort:** 2 days

---

### SS-1: Subscription Score

**As a** user,
**I want** a single score (0-100) that tells me how well I'm managing my subscriptions,
**So that** I have a clear goal to improve.

```gherkin
Given I have subscriptions in the system
When I view the Dashboard
Then I see my Subscription Score (0-100) prominently displayed

Given the score is calculated as a weighted average of:
  - Decision fill rate (30% weight)
  - Cost fill rate (20% weight)
  - Renewal date fill rate (20% weight)
  - Review freshness (15% weight) -- % of reviews less than 30d old
  - Tax categorization rate (15% weight) -- for business subs only
When all fields are complete and all reviews are fresh
Then my score approaches 100

Given I have 50% of subs without decisions
Then my score is significantly penalized
```

**Files:** `src/components/Dashboard.tsx` (new score component)
**Effort:** 1.5 days

---

### TP-1: Pre-populated subscription templates

**As a** new user,
**I want** to quickly add common subscriptions from a list,
**So that** I don't have to type everything manually.

```gherkin
Given I open the Add Subscription modal
When I start typing a service name
Then I see autocomplete suggestions from a template list (Netflix, Spotify, Adobe Creative Cloud, etc.)

Given I select "Netflix" from the template
Then the service name is pre-filled
And the category is pre-filled as "Entertainment"
And the billing cycle defaults to "monthly"
And I only need to enter my cost and renewal date
```

**Files:** `src/components/AddSubscriptionModal.tsx`, new templates data file
**Effort:** 1 day

---

### TP-2: Weekly undecided email

**As a** user with subscriptions that have no decision set,
**I want** a weekly email reminding me to decide,
**So that** I don't forget to complete my triage.

```gherkin
Given I have 5 subscriptions without a decision
When the weekly digest cron runs
Then I receive an email listing the 5 undecided subscriptions
And each shows service name, cost, and a "Decide now" link

Given all my subscriptions have decisions
When the weekly digest cron runs
Then this section is omitted from the digest
```

**Files:** `src/lib/email-templates.ts`, `src/app/api/cron/renewal-alerts/route.ts`
**Effort:** 0.5 day

---

## Story Summary

| Milestone | Stories | Must | Should | Total effort |
|-----------|---------|------|--------|-------------|
| M1: Security Gate | 7 | 7 | 0 | ~4 days |
| M2: Decision Loop | 8 | 2 | 6 | ~4.5 days |
| M3: Landing Page | 5 | 2 | 3 | ~5.5 days |
| **Total** | **20** | **11** | **9** | **~14 days (3 weeks)** |

---

## References

- PRD: Step 13
- RICE scores: Step 8
- Security requirements: Step 12
- UX issues: Step 10
