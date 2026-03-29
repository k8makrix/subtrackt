# Step 6: Opportunity Solution Tree

> Recipe step 6 of 15 | Phase: Strategy | Date: 2026-03-29

---

## Outcome

**Primary NSM: Increase Conscious Renewal Rate from ~45% to 65% (Q2), 80% (Q3)**

---

## Opportunity Map

```
Conscious Renewal Rate (NSM)
│
├── O1: Users don't see renewals coming until it's too late
│   ├── S1.1: Pre-renewal decision prompts in email ("Figma renews in 3d, still keeping it?")
│   ├── S1.2: Dashboard "needs attention" section for subs renewing within 7d without recent decision
│   ├── S1.3: Calendar .ics with VALARM reminders (already shipped, increase adoption)
│   └── S1.4: Slack bot that posts daily renewal digest to a channel
│
├── O2: Users add subs but never set a decision (keep/cancel/review)
│   ├── S2.1: Require decision on add (default to "review" with nudge to change)
│   ├── S2.2: Onboarding walkthrough that prompts decisions for first 5 subs
│   ├── S2.3: "Undecided" badge/counter on dashboard (like costsTBD)
│   └── S2.4: Weekly email: "You have X subs without a decision"
│
├── O3: "Review" decisions go stale and never convert to keep/cancel
│   ├── S3.1: Stale review reminders (already shipped, increase visibility)
│   ├── S3.2: Time-decay urgency: review items get progressively more prominent after 14d, 30d, 60d
│   ├── S3.3: "Decide or snooze" modal: force a decision or explicit snooze with a date
│   └── S3.4: Show estimated cost of indecision ("This sub in review is costing you $X/month while you decide")
│
├── O4: Users can't find or access Subtrackt when they need it
│   ├── S4.1: Public landing page with value prop and sign-in CTA
│   ├── S4.2: Mobile-responsive UI (all critical flows work on phone)
│   ├── S4.3: PWA with home screen install prompt
│   └── S4.4: Browser extension that flags subscription charges in bank statement pages
│
├── O5: New users drop off before reaching value (no subs tracked)
│   ├── S5.1: First-time onboarding wizard ("Add your first 5 subscriptions")
│   ├── S5.2: Pre-populated templates (common subs like Netflix, Spotify, Adobe)
│   ├── S5.3: CSV import from bank statement or other tracker
│   └── S5.4: Email-based import (forward subscription confirmation emails)
│
├── O6: Users don't know their total spend or spending trends
│   ├── S6.1: Spend trends chart (month-over-month, year-over-year)
│   ├── S6.2: "Subscription cost changed" alerts (detect price increases at renewal)
│   ├── S6.3: Budget target: set a monthly subscription budget, see progress against it
│   └── S6.4: Shareable "subscription audit report" (total spend, money saved, decisions made)
│
├── O7: Tax categorization is tedious and incomplete
│   ├── S7.1: Smart category suggestions based on service name
│   ├── S7.2: Bulk categorization tool (select multiple subs, set category)
│   ├── S7.3: Mixed-use percentage slider (60% business, 40% personal)
│   └── S7.4: Accountant sharing view (read-only link to tax summary)
│
├── O8: Households can't coordinate subscription decisions
│   ├── S8.1: Shared household view (invite partner, see combined subs)
│   ├── S8.2: "Who uses this?" field per subscription
│   ├── S8.3: Duplicate/overlap detection ("You have 3 streaming services")
│   └── S8.4: Household budget cap with joint tracking
│
└── O9: No visibility when subscriptions are managed across teams
    ├── S9.1: Multi-user workspace with roles (admin, viewer)
    ├── S9.2: Per-seat cost tracking and license count fields
    ├── S9.3: Team-level dashboard and spend reports
    └── S9.4: Approval workflow for new subscription requests
```

---

## Opportunity Prioritization

| # | Opportunity | Job(s) | Persona(s) | Impact on NSM | Evidence strength |
|---|-----------|--------|-----------|---------------|-------------------|
| O1 | Don't see renewals coming | Job 1 | All | **Direct** | Strong: this is the NSM definition |
| O2 | Never set a decision | Job 1 | All | **Direct** | Strong: empty decisions = 0% conscious renewal |
| O3 | Stale reviews | Job 1, 2 | Kate, Marcus | **Direct** | Strong: 15 subs in review, unknown stale count |
| O4 | Can't find/access Subtrackt | All | All | **Indirect** (enabler) | Strong: no landing page = no new users |
| O5 | New users drop off | All | All | **Indirect** (enabler) | Moderate: no analytics, but obvious gap |
| O6 | Don't know spend trends | Job 2 | Marcus, Kate | **Indirect** | Moderate: competitors have it, users expect it |
| O7 | Tax categorization tedious | Job 3 | Kate, Priya | **Indirect** | Moderate: secondary NSM driver |
| O8 | Households can't coordinate | Job 2 | Marcus | **Indirect** | Moderate: Marcus persona need, Monarch has this |
| O9 | No team visibility | Job 4 | Priya | **None** (future) | Low: requires architecture changes |

---

## Solution Scoring (top solutions by opportunity)

### High-Signal Solutions (build in Q2)

| Solution | Opportunity | Effort (days) | Impact | Confidence |
|----------|-----------|---------------|--------|------------|
| S1.1: Pre-renewal decision prompts in email | O1 | 2-3 | High | High |
| S1.2: Dashboard "needs attention" section | O1 | 2-3 | High | High |
| S2.3: "Undecided" badge/counter | O2 | 1 | Medium | High |
| S3.2: Time-decay urgency for reviews | O3 | 2-3 | High | Medium |
| S3.4: Cost of indecision display | O3 | 1-2 | Medium | Medium |
| S4.1: Public landing page | O4 | 3-5 | High | High |
| S4.2: Mobile-responsive UI | O4 | 3-5 | High | High |
| S5.1: Onboarding wizard | O5 | 3-5 | High | Medium |
| S6.1: Spend trends chart | O6 | 3-5 | Medium | High |

### Medium-Signal Solutions (Q3 or later)

| Solution | Opportunity | Effort (days) | Impact | Confidence |
|----------|-----------|---------------|--------|------------|
| S5.2: Pre-populated templates | O5 | 2-3 | Medium | Medium |
| S5.3: CSV import | O5 | 3-5 | Medium | Medium |
| S7.1: Smart category suggestions | O7 | 3-5 | Medium | Low |
| S7.2: Bulk categorization | O7 | 2-3 | Medium | Medium |
| S7.3: Mixed-use % slider | O7 | 2-3 | Low | Medium |
| S8.1: Shared household view | O8 | 5-10 | Medium | Medium |
| S8.3: Overlap detection | O8 | 3-5 | Medium | Low |

### Low-Signal Solutions (Later or never)

| Solution | Why deferred |
|---------|-------------|
| S4.3: PWA | Nice-to-have after responsive works |
| S4.4: Browser extension | High effort, unclear adoption |
| S5.4: Email-based import | Complex parsing, low reliability |
| S6.2: Price change detection | Needs historical price data infrastructure |
| S8.4: Household budget cap | Needs household model first |
| S9.*: All team features | Requires multi-user architecture |

---

## Key Insight

The highest-impact solutions cluster around three themes:

1. **Close the decision loop** (O1-O3): Make it impossible to have a renewal pass without a conscious decision. This directly drives the NSM.
2. **Be findable and usable** (O4-O5): Landing page + responsive + onboarding. Without these, the product can't grow.
3. **Show the value** (O6): Spend trends and shareable reports make the value visible, creating retention and word-of-mouth.

These three themes should form the backbone of the RICE scoring in Step 8 and the roadmap in Step 9.

---

## References

- Opportunities sourced from: persona pain points (Step 1), competitive gaps (Step 3), JTBD remaining gaps (Step 1)
- NSM alignment: Conscious Renewal Rate (Step 4)
- OKR alignment: O1 maps to Objective 1, O4-O5 to Objective 2, O6-O7 to Objective 3
