# Metrics Dashboard

North star metrics:
- **Job A:** "Zero surprise charges" — every renewal is either a conscious keep or a timely cancel
- **Job B:** "Tax time takes 5 minutes, not 5 hours" — all deductions pre-categorized, export ready

---

## 1. Engagement Metrics

| Metric | Definition | Target | How to Measure |
|--------|-----------|--------|----------------|
| Subscriptions tracked | Active + lenny-pass subscriptions per user | 15+ per user | `COUNT(*) FROM subscriptions WHERE status IN ('active', 'lenny-pass')` |
| Data completeness | % of subs with cost, renewal date, and decision filled | >80% | Null checks on `cost`, `next_renewal_date`, `keep_cancel_review` |
| Weekly active users | Users who open the app at least once per week | Growing month-over-month | Better Auth `session` table (session creation timestamps) |
| Notes created | Notes added per user per month | >2/month = engaged user | `subscription_notes` table count |

### Engagement Health Signals

| Signal | Definition |
|--------|-----------|
| **Healthy** | Logs in weekly, >15 subs tracked, >80% data completeness |
| **At risk** | No login for 14+ days |
| **Churned** | No login for 30+ days |

---

## 2. Value Delivery Metrics (Job A: Renewal Awareness)

| Metric | Definition | Target | Notes |
|--------|-----------|--------|-------|
| Renewals caught | Subs where user took action (changed decision) before renewal date | >90% of upcoming renewals | Requires `decision_changed_at` timestamp (not yet tracked) |
| Surprise charges prevented | Renewals where decision changed to "cancel" before charge date | Track absolute count | **Hero metric** — the reason the app exists |
| Notification open rate | % of renewal alert emails opened | >40% | Requires email notification system ([Roadmap](03-roadmap.md) NEXT #2) |
| Time before renewal | Average days before renewal that user last viewed/updated a sub | >7 days | Requires `last_viewed_at` timestamp (not yet tracked) |

---

## 3. Financial Impact Metrics (Job C: Save Money)

| Metric | Definition | Target | Notes |
|--------|-----------|--------|-------|
| Total annual spend tracked | Sum of annualized costs across all active subs | Accurate to within 95% (few TBDs) | Already computed in `Dashboard.tsx` as `totalAnnualized` |
| Money saved (cancellations) | Annualized cost of subs moved to cancelled status | Growing over time | Requires cancelled sub tracking ([Roadmap](03-roadmap.md) NEXT #3) |
| Cancel rate | % of subscriptions with decision = "cancel" | 10-20% is healthy | `keep_cancel_review = 'cancel'` |
| Review conversion rate | % of "review" subs resolved to "keep" or "cancel" within 30 days | >70% within 30 days | Requires decision change timestamps |
| Cost discovery rate | % of TBD costs that get filled within 7 days | >80% | Track transitions from null cost to populated |

---

## 4. Tax Utility Metrics (Job B: Tax Preparation)

| Metric | Definition | Target | Notes |
|--------|-----------|--------|-------|
| Deductions tracked | Total annualized value of business-deductible subs | Accurate and growing | Already computed as `bizDeductible` in `Dashboard.tsx` |
| Categorization completeness | % of business subs with `tax_category` set (not "none") | >95% | `expense_type != 'personal' AND tax_category != 'none'` |
| CSV exports generated | Tax CSV exports per user per year | At least 1 (ideally 2-3) | `/api/export` endpoint hits |
| Tax categories used | Distinct tax categories across a user's subs | At least 3 per user | Shows thoughtful categorization vs bulk-setting everything to one category |

---

## 5. Retention Indicators

| Signal | What It Means |
|--------|--------------|
| Subscription count growing over time | User trusts subtrackt as system of record |
| Regular decision updates | Actively managing subscription lifecycle |
| Tax data populated (expense type + tax category) | Invested in tax workflow — high switching cost |
| Notes activity | Using the app for decision context, not just tracking |
| Return at tax time (Jan-Apr logins) | Annual retention anchor |
| Multi-payment-source usage | Tracking full financial picture across cards/accounts |

### Cohort Analysis Framework

| Milestone | Timeframe | Activation Signal |
|-----------|-----------|-------------------|
| Activation | Week 1 | Added >5 subscriptions |
| Habit | Week 4 | Returning weekly |
| Value realized | Month 3 | Made cancel decisions, saved money |
| Annual anchor | Tax season | Exported CSV or used Tax tab |

---

## Implementation Phases

### Phase 1: Instrument Now (No New Features Needed)

These metrics can be tracked with the existing data model, possibly with minor schema additions:

- [ ] Track subscription count per user over time (snapshot table or analytics event)
- [ ] Track data completeness rates (scheduled query)
- [ ] Track CSV export events (log `/api/export` hits with user + timestamp)
- [ ] Add `decision_changed_at` column to `subscriptions` table (set on PATCH when `keep_cancel_review` changes)
- [ ] Add `last_viewed_at` column or analytics event for subscription views

### Phase 2: Alongside NEXT Features

These metrics become measurable as new features ship:

- [ ] Notification delivery and open rates (with email notification system)
- [ ] "Money saved" from cancellations (with cancelled sub tracking)
- [ ] Pre-renewal action timing (with notification + decision timestamp data)
- [ ] Stale review count and resolution rate (with stale review reminders)

### Phase 3: With Analytics Infrastructure

These require dedicated analytics tooling (PostHog, Mixpanel, or similar):

- [ ] Client-side tab usage distribution (Dashboard vs All vs Tax)
- [ ] Session frequency and duration
- [ ] Cohort retention curves (week 1 → week 4 → month 3 → tax season)
- [ ] Funnel: sign up → add 5 subs → make first decision → export CSV

---

## Dashboard Mockup (Future)

When analytics infrastructure is in place, the internal metrics dashboard should show:

```
┌─────────────────────────────────────────────────┐
│  SUBTRACKT METRICS                              │
├────────────┬────────────┬───────────────────────┤
│ WAU: 42    │ Subs/user: │ Data completeness:    │
│ (+8% WoW)  │ 23 avg     │ 84%                   │
├────────────┴────────────┴───────────────────────┤
│  JOB A: RENEWAL AWARENESS                      │
│  Renewals caught: 94%  │  Avg lead time: 11 days│
├─────────────────────────┤───────────────────────┤
│  JOB C: SAVINGS         │  JOB B: TAX           │
│  Money saved: $2,847    │  Deductions: $12,340   │
│  Cancel rate: 14%       │  Categorized: 97%      │
│  Review conv: 72%       │  Exports: 1.8/user/yr  │
└─────────────────────────┴───────────────────────┘
```

---

## References

- Metric priorities align with [JTBD Analysis](02-jtbd-analysis.md) job hierarchy
- Phase 1 metrics validate [Roadmap](03-roadmap.md) NOW items
- Phase 2 metrics validate [Roadmap](03-roadmap.md) NEXT items
- Stage-level satisfaction maps to [Journey Map](01-journey-map.md)
