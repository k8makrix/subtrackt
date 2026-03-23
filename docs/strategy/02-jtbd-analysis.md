# Jobs-To-Be-Done Analysis

## Three Candidate Jobs

### Job A: "Help me not get surprised"
*Renewal awareness and charge alerts*

| Dimension | Details |
|-----------|---------|
| **Functional** | Alert me before charges hit; show me what renews when; let me act before it's too late |
| **Emotional** | Feel in control, not blindsided by my own subscriptions |
| **Social** | Not the person who "forgot to cancel that free trial" |
| **Frequency** | Daily/weekly — renewals happen constantly |

### Job B: "Help me do my taxes"
*Deduction tracking, categorization, and export*

| Dimension | Details |
|-----------|---------|
| **Functional** | Categorize expenses by deductibility; track business vs personal; export clean data for filing |
| **Emotional** | Feel prepared and organized at tax time, not scrambling |
| **Social** | Appear competent to my accountant; maximize legitimate deductions |
| **Frequency** | Seasonal — primarily Jan-Apr, with occasional mid-year check-ins |

### Job C: "Help me save money"
*Cancel unused subscriptions, optimize spend*

| Dimension | Details |
|-----------|---------|
| **Functional** | Identify unused/redundant subscriptions; track total spend; make informed cancel decisions |
| **Emotional** | Feel financially responsible and intentional |
| **Social** | Not wasting money on things I don't use |
| **Frequency** | Periodic — triggered by bill shock or financial reviews |

---

## Analysis: Which Job is Primary?

### Recommendation: Job A is the primary job. B and C are supporting jobs.

**1. Frequency drives habit formation.**
Renewal awareness is a daily/weekly need. Tax work is seasonal. Savings optimization is periodic. The job with the highest frequency creates the engagement loop that makes the app sticky. An app opened weekly retains; an app opened twice a year doesn't.

**2. The codebase reveals existing priorities.**
The Dashboard tab (the default landing view) leads with urgency-coded renewals and annualized spend. The `urgentRenewals` section gets dedicated red-alert styling and appears above everything else. The app already knows this is where the visceral value lives.

**3. Job A is the gateway to Jobs B and C.**
Users who track renewals (Job A) naturally accumulate the subscription inventory needed for taxes (Job B) and savings decisions (Job C). The reverse is not true — a user who only opens the app at tax time will have stale, incomplete data. Job A creates the data foundation.

**4. Job A is the differentiation angle.**
Many apps track expenses. Few do subscription-specific renewal awareness with decision management (keep/cancel/review) baked in. The urgency color-coding + decision workflow is subtrackt's distinctive feature set.

---

## Job Hierarchy

```
PRIMARY: "Help me not get surprised" (Job A)
  │
  ├── SUPPORTING: "Help me save money" (Job C)
  │   Builds on renewal awareness — once I see what's coming,
  │   I can decide whether to keep or cancel.
  │   Activation path: Job A → "Do I still need this?" → Job C
  │
  └── SUPPORTING: "Help me do my taxes" (Job B)
      Builds on the subscription inventory — once everything
      is tracked and maintained, categorization adds tax-time value.
      Activation path: Job A data → categorize → Job B payoff
```

---

## Implications for Feature Prioritization

### Double down on Job A (Renewal Awareness)

| Feature | Impact | Current State |
|---------|--------|---------------|
| Email notifications for upcoming renewals | Transforms app from "pull" to "push" | Not built — biggest gap |
| Pre-renewal decision prompts | Drives action before charges hit | Not built |
| Calendar integration (.ics / Google Calendar) | Puts renewals where users already look | Not built |
| Historical charge tracking | "Was this price the same last year?" | Not built |

### Strengthen the Job A → Job C pipeline (Awareness to Savings)

| Feature | Impact | Current State |
|---------|--------|---------------|
| "Money Saved" counter for cancelled subs | Positive feedback loop — every cancel feels like a win | Not built |
| Stale review reminders | Prevents "review" from becoming permanent non-decision | Not built |
| Spend trend over time | "Are my total costs going up?" | Not built |
| Surface "review" items more prominently on dashboard | Drives triage completion | Partially built (needsReview count shown) |

### Enrich Job B as a retention superpower (Tax Value)

| Feature | Impact | Current State |
|---------|--------|---------------|
| Smart tax category suggestions | Reduces categorization tedium | Not built |
| Formatted year-end tax report | Makes tax time genuinely easy | Not built (CSV only) |
| Mixed-use percentage tracking | Handles partially deductible subs | Not built |
| Year filter on export | Enables multi-year tax history | Not built |

> **Why tax is the retention superpower:** Once a user has categorized 30+ subscriptions with expense types and tax categories, the switching cost to another tool is enormous. Tax data is the moat. But it's a retention feature, not an acquisition feature — users don't discover subtrackt because of taxes. They stay because of taxes.

---

## Competitive Positioning

```
                    Renewal-Focused ←————————→ Expense-Focused
                         │                          │
  subtrackt              ■                          │
  (subscription-specific,│                          │
   decision-driven)      │                          │
                         │                          │
  Truebill/Rocket Money  │          ■               │
  (bill negotiation,     │                          │
   broader spending)     │                          │
                         │                          │
  Mint / YNAB            │                          ■
  (full budgeting,       │                          │
   not sub-specific)     │                          │
```

Subtrackt wins by being narrow and deep on subscription lifecycle management, not broad on personal finance.

---

## References

- [Journey Map](01-journey-map.md) — Stages 3-4 are the core Job A moments
- [Now/Next/Later Roadmap](03-roadmap.md) — Implementation sequencing based on this analysis
- [Metrics Dashboard](04-metrics.md) — How to measure job fulfillment
