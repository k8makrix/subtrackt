# Journey Map: "Subscription Renewal Panic" to "Tax-Time Confidence"

## Persona

**Kate** — Freelancer / solopreneur with 30+ active subscriptions across personal and business use. Files 1099 taxes. Uses multiple payment methods and credit cards. Subscribed to Lenny's Product Pass for bundled tools.

---

## Stage 1: Subscription Chaos (Trigger)

**What happens:** A surprise charge appears on a bank statement. Or tax season arrives and Kate realizes she has no idea which subscriptions are deductible.

| Dimension | Details |
|-----------|---------|
| **Emotions** | Anxiety, frustration, guilt ("How did I let this get so out of control?") |
| **Touchpoints** | Bank statement, credit card bill, email renewal notice, forgotten trial conversion |
| **Pain points** | No single view of all subscriptions; no idea what total annual spend is; forgotten trials silently converting to paid |
| **Opportunities** | Onboarding that captures subscriptions quickly; framing around "get control in 10 minutes" |

---

## Stage 2: Discovery & Inventory (First Use)

**What happens:** Kate signs in with Google OAuth and starts adding her subscriptions to subtrackt.

| Dimension | Details |
|-----------|---------|
| **Emotions** | Overwhelm (so many subs), then relief (finally seeing it all in one place) |
| **Touchpoints** | subtrackt onboarding, subscription entry, dashboard metrics |
| **Pain points** | Manual data entry is tedious; hard to remember every subscription; some costs unknown (TBD) |
| **Opportunities** | Bulk import flow; quick-add UI; "Costs TBD" nudge system (the `costsTBD` metric already exists on the dashboard) |

---

## Stage 3: Triage & Decision-Making (Active Use)

**What happens:** Kate reviews each subscription and decides: keep, cancel, or review later.

| Dimension | Details |
|-----------|---------|
| **Emotions** | Empowerment ("I'm taking control"), occasional regret ("I've been paying for that?!") |
| **Touchpoints** | All Subscriptions tab, keep/cancel/review dropdown, notes, expanded row details |
| **Pain points** | Deciding what to cancel requires knowing usage (no usage data available); "review" status can go stale indefinitely |
| **Opportunities** | Decision prompts before renewal; stale-review reminders; "money saved" counter for cancelled subs |

---

## Stage 4: Renewal Awareness (Ongoing)

**What happens:** Kate checks the dashboard to see what's renewing soon and whether she needs to act.

| Dimension | Details |
|-----------|---------|
| **Emotions** | Confidence (if caught early), panic (if a renewal slipped through) |
| **Touchpoints** | Dashboard urgent renewals panel, color-coded renewal dates (red <7d, amber <30d, yellow <90d) |
| **Pain points** | Must open the app to see alerts — no push or email notifications; urgency thresholds are fixed; no calendar integration |
| **Opportunities** | Email/push notifications; Google Calendar sync; pre-renewal decision prompts ("Figma renews in 7 days — still keeping it?") |

> **This is the critical gap.** The app has excellent renewal tracking and urgency visualization, but it's entirely pull-based. Users must remember to open subtrackt. A push-based notification system would transform the value proposition. See [JTBD Analysis](02-jtbd-analysis.md) for why this is the primary job.

---

## Stage 5: Tax Categorization (Seasonal / Ongoing)

**What happens:** Kate categorizes each subscription by expense type (personal, business sole prop, business W2, mixed) and tax category (business tools, professional dev, software, etc.).

| Dimension | Details |
|-----------|---------|
| **Emotions** | Tedium (per-subscription categorization), then satisfaction (organized and ready) |
| **Touchpoints** | Expanded subscription row (expense type + tax category dropdowns), Tax & Expenses tab summary |
| **Pain points** | Must categorize each sub individually; unclear which tax categories apply; mixed-use percentage not tracked (it's either business or personal, no 60/40 split) |
| **Opportunities** | Smart defaults by subscription category; bulk categorization; mixed-use percentage slider |

---

## Stage 6: Tax-Time Export (Annual)

**What happens:** Tax season arrives. Kate opens the Tax & Expenses tab, reviews the summary, and exports a CSV for her accountant.

| Dimension | Details |
|-----------|---------|
| **Emotions** | Confidence if subscriptions were categorized throughout the year; scramble if not |
| **Touchpoints** | Tax & Expenses summary cards (total deductible, personal spend), CSV export button |
| **Pain points** | CSV is raw data, not accountant-friendly; no year-over-year comparison; no integration with tax software; can't filter by tax year |
| **Opportunities** | Formatted tax reports (PDF); year filter on export; accountant-sharing view; historical year comparison |

---

## Cross-Cutting Opportunities

| Opportunity | Stages Impacted | Priority |
|------------|----------------|----------|
| **Notification system** (email/push) | 3, 4 | Highest — bridges the gap between data-in-app and proactive awareness |
| **Add-subscription UI** | 2 | High — no frontend flow exists for adding subs currently |
| **Smart defaults** for tax categorization | 5 | Medium — reduces categorization effort |
| **Year-over-year data** | 6 | Medium — makes annual export increasingly valuable |
| **Calendar integration** | 4 | Medium — puts renewals where Kate already looks daily |

---

## References

- [JTBD Analysis](02-jtbd-analysis.md) — How these stages map to the three candidate jobs
- [Now/Next/Later Roadmap](03-roadmap.md) — Feature prioritization derived from this journey
- [Metrics Dashboard](04-metrics.md) — How to measure success at each stage
