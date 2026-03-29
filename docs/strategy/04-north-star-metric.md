# Step 4: North Star Metric

> Recipe step 4 of 15 | Phase: Strategy | Date: 2026-03-29

---

## V1 North Stars (evaluation)

V1 defined two North Star candidates:

| V1 Metric | Job served | Still valid? |
|-----------|-----------|-------------|
| "Zero surprise charges" | Job 1 (primary) | **Partially.** Aspirational but not measurable as a metric. "Zero" is a binary target, not a trackable trend. Also doesn't capture value for Marcus (households) or Jobs 2-5. |
| "Tax time takes 5 minutes" | Job 3 (supporting) | **Narrow.** Only serves Kate and Priya. Seasonal. Not a metric that drives daily/weekly engagement. |

**V1 verdict:** Both are good *taglines* but neither works as a North Star *Metric*. A NSM needs to be measurable, movable, and connected to the full value proposition.

---

## North Star Metric Candidates

### Candidate A: "Conscious Renewals"

**Definition:** The percentage of upcoming renewals where the user has an active decision (keep or cancel) recorded before the charge date.

```
Conscious Renewal Rate = (Renewals with decision made before charge date) / (Total renewals in period) × 100
```

| Criterion | Score | Rationale |
|-----------|-------|-----------|
| Captures value delivery | Strong | The core promise: every renewal is intentional, not accidental |
| Measurable | Strong | Decision timestamp vs. renewal date, already tracked in DB |
| Movable by the team | Strong | Notifications, reminders, UX improvements all drive this up |
| Leading indicator of retention | Strong | Users with high conscious renewal rates are engaged |
| Covers multiple personas | Strong | Kate (don't get surprised), Marcus (know what we're paying), Priya (plan renewals) |
| Covers multiple jobs | Moderate | Primarily Job 1, indirectly Job 2. Doesn't capture Job 3 (tax) directly. |
| Not a vanity metric | Strong | Can't game it without genuine user engagement |

### Candidate B: "Subscriptions Under Management"

**Definition:** Total active subscriptions tracked per user, weighted by data completeness (cost, renewal date, decision, and category all populated).

```
Subscriptions Under Management = COUNT(active subs where cost AND renewal_date AND decision are non-null)
```

| Criterion | Score | Rationale |
|-----------|-------|-----------|
| Captures value delivery | Moderate | More subs tracked = more value, but doesn't measure *action* taken |
| Measurable | Strong | Simple query against existing schema |
| Movable by the team | Strong | Onboarding, import, bulk-add features drive this |
| Leading indicator of retention | Strong | Users with 15+ subs are highly retained (switching cost) |
| Covers multiple personas | Strong | All personas track subscriptions |
| Covers multiple jobs | Moderate | Primarily Job 1-2. Tax value is implicit (more subs = more to categorize). |
| Not a vanity metric | Moderate | Could be gamed by adding dummy subs; quality weighting helps |

### Candidate C: "Monthly Decisions Made"

**Definition:** Number of keep/cancel/review decisions changed or confirmed per user per month.

| Criterion | Score | Rationale |
|-----------|-------|-----------|
| Captures value delivery | Moderate | Decisions are valuable, but "review" decisions don't resolve anything |
| Measurable | Strong | `decision_changed_at` already tracked |
| Movable by the team | Strong | Stale reminders, pre-renewal prompts drive this |
| Leading indicator of retention | Moderate | Active decision-making = engaged, but could plateau |
| Covers multiple personas | Moderate | Primarily Kate and Marcus. Priya needs team-level decisions. |
| Covers multiple jobs | Weak | Only Job 1-2. Doesn't touch tax or team management. |
| Not a vanity metric | Moderate | Could encourage unnecessary decision churn |

---

## Recommendation

### Primary North Star: **Conscious Renewal Rate**

> "What percentage of renewals this month were deliberate decisions, not passive auto-charges?"

**Why this wins:**
1. It captures the *essence* of Subtrackt's value: turning passive subscription spending into active, intentional decisions
2. It applies to all three personas: Kate wants no surprises, Marcus wants household control, Priya wants planned renewals
3. It's measurable today with existing data (`decision_changed_at` vs. `next_renewal_date`)
4. Every product improvement can be evaluated against it: "Does this feature increase conscious renewal rate?"
5. It creates a natural engagement loop: users must return before each renewal to maintain a high rate

**Target trajectory:**
- Current (estimated): ~40-50% (many subs lack decisions or have stale reviews)
- 3 months: 65%
- 6 months: 80%
- Aspirational: 95%+ ("Zero surprise charges" as an asymptotic goal)

### Secondary North Star: **Tax-Ready Percentage**

> "What percentage of business subscriptions are fully categorized and export-ready?"

**Definition:** Percentage of subscriptions with `expense_type` != personal that have `tax_category` set, `cost` populated, and `billing_cycle` defined.

```
Tax-Ready % = (Biz subs with tax_category AND cost AND billing_cycle) / (Total biz subs) × 100
```

**Why secondary:**
- Captures Job 3 value ("tax time takes 5 minutes") as a measurable metric
- Serves Kate (primary) and Priya but not Marcus (personal subs, no tax need)
- Seasonal by nature, so it doesn't drive daily engagement the way Conscious Renewal Rate does
- Acts as a retention metric: high tax-ready % = high switching cost

---

## Input Metric Tree

```
                    Conscious Renewal Rate (Primary NSM)
                    ┌───────────┼───────────────┐
                    │           │               │
            Breadth         Depth          Timeliness
    "How many subs     "How complete     "How early do
     are tracked?"      is the data?"     users decide?"
         │                  │                  │
  ┌──────┴──────┐    ┌─────┴──────┐     ┌─────┴──────┐
  │             │    │            │     │            │
Subs per    Add rate  Cost fill  Decision  Avg days   Notification
 user       (new/mo)   rate %    fill %   before     open rate
                                         renewal
```

### Input Metrics (detailed)

| Input Metric | Definition | Current State | Target |
|-------------|-----------|---------------|--------|
| **Subs per user** | Active + lenny-pass subs per user | ~48 (69 - 21 lenny at $0, single user) | 50+ |
| **Add rate** | New subscriptions added per user per month | Unknown (no analytics) | 2-3/month |
| **Cost fill rate** | % of active subs with cost populated | ~90% (few TBDs remaining) | 98% |
| **Decision fill rate** | % of active subs with keep/cancel/review set | ~80% (some null) | 95% |
| **Avg days before renewal** | Average days before renewal that decision was last updated | Unknown | 7+ days |
| **Notification open rate** | % of renewal alert emails opened/acted on | Unknown (no tracking) | 40%+ |
| **Tax-ready %** (secondary NSM) | % of biz subs with complete tax data | ~70% (some missing categories) | 95% |

---

## Measurement Plan

### Phase 1: Instrument Now (no new features required)

| What to measure | How | Effort |
|----------------|-----|--------|
| Conscious Renewal Rate | Compare `decision_changed_at` to `next_renewal_date` for each renewal that passed | SQL query, can run manually or via cron |
| Tax-Ready % | Query biz subs for null `tax_category`, null `cost`, null `billing_cycle` | SQL query |
| Cost fill rate | `COUNT(cost IS NOT NULL) / COUNT(*)` for active subs | SQL query |
| Decision fill rate | `COUNT(keep_cancel_review IS NOT NULL) / COUNT(*)` for active subs | SQL query |

### Phase 2: Alongside Next Features

| What to measure | Required feature |
|----------------|-----------------|
| Avg days before renewal | Add `last_decision_date` or use `decision_changed_at` with renewal history |
| Notification open rate | Email tracking pixels or link tracking in renewal alert emails |
| Add rate | Track subscription creation events with timestamps |

### Phase 3: Analytics Infrastructure

| What to measure | Infrastructure needed |
|----------------|---------------------|
| Funnel: sign up -> add 5 subs -> first decision -> conscious renewal | Event tracking (PostHog, Mixpanel) |
| Cohort retention by conscious renewal rate | Analytics platform with cohort analysis |
| NSM trend over time (weekly/monthly) | Dashboard or scheduled report |

---

## Validation: Seven Criteria Check

| # | Criterion | Conscious Renewal Rate | Pass? |
|---|----------|----------------------|-------|
| 1 | Expresses value delivery | Yes: every intentional renewal = value delivered | Yes |
| 2 | Represents the product's vision | Yes: "no surprise charges" is the vision; this measures progress toward it | Yes |
| 3 | Is a leading indicator of revenue (if monetized) | Yes: engaged users with high rates would convert to paid | Yes |
| 4 | Is measurable | Yes: existing schema supports it | Yes |
| 5 | Is actionable by the team | Yes: notifications, UX, reminders all improve it | Yes |
| 6 | Is understandable by non-technical stakeholders | Yes: "X% of your renewals were intentional this month" | Yes |
| 7 | Is not a vanity metric | Yes: requires genuine user engagement, can't be gamed | Yes |

---

## What Changed from V1

| Aspect | V1 | V2 |
|--------|----|----|
| North Star count | 2 (both aspirational taglines) | 1 primary metric + 1 secondary metric |
| Primary | "Zero surprise charges" (binary goal) | Conscious Renewal Rate (measurable %) |
| Secondary | "Tax time takes 5 minutes" (aspirational) | Tax-Ready Percentage (measurable %) |
| Input metrics | Listed but not structured | Full input metric tree with targets |
| Measurement plan | "Add columns later" | 3-phase instrumentation plan |

---

## References

- Existing schema: `decision_changed_at`, `next_renewal_date`, `keep_cancel_review`, `tax_category`, `expense_type`
- V1 metrics doc: `docs/strategy/04-metrics.md`
- Production data: 69 subs, ~23 active/keep, ~15 active/review, ~3 active/cancel
