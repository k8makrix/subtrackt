# Now / Next / Later Roadmap

Prioritization driven by [JTBD Analysis](02-jtbd-analysis.md): Job A ("help me not get surprised") is primary. Pain points sourced from [Journey Map](01-journey-map.md).

---

## NOW (Built and Functional)

These features exist in the current codebase and are working:

| Feature | Serves Job | Key Files |
|---------|-----------|-----------|
| Subscription inventory (view, edit, status) | A, B, C | `Dashboard.tsx`, `SubscriptionRow.tsx`, `/api/subscriptions/` |
| Urgency color-coding (red <7d, amber <30d, yellow <90d) | A | `SubscriptionRow.tsx` |
| Dashboard with annualized spend, needs-review count, costs-TBD count | A, C | `Dashboard.tsx` |
| Keep / cancel / review decision tracking | A, C | `SubscriptionRow.tsx`, `/api/subscriptions/[id]/` |
| Tax category + expense type per subscription | B | `SubscriptionRow.tsx` |
| Tax & Expenses summary tab (deductible vs personal breakdown) | B | `Dashboard.tsx` |
| CSV export for tax purposes | B | `/api/export/` |
| Payment source tracking (personal / work / credit card / Lenny Pass) | B | `SubscriptionRow.tsx` |
| Per-subscription notes with user attribution | A | `/api/subscriptions/[id]/notes/` |
| Search across subscriptions | A | `Dashboard.tsx` |
| Lenny Pass bundled tools section | A | `Dashboard.tsx` |
| Google OAuth authentication | Infra | `auth.ts`, `auth-client.ts` |

### NOW Gaps to Close (Polish)

These aren't new features — they're data quality issues in the existing system:

- [ ] Fill missing costs (`costsTBD` count on dashboard shows this is a known gap)
- [ ] Complete tax categorization for all business subscriptions (some have null `tax_category`)
- [ ] Populate `next_renewal_date` for all active subscriptions
- [ ] Surface unused DB fields that have value: `cancel_url`, `cancel_notes`, `auto_renew`

---

## NEXT (Build Next — High Impact)

Ordered by priority. Each addresses the primary job (A) or strengthens the A→C or A→B pipelines.

### 1. Add-Subscription UI
**Job:** A (Onboarding) | **Journey stage:** 2 (Discovery & Inventory)

The `POST /api/subscriptions` endpoint exists but has no frontend consumer. Users currently depend on direct database manipulation to add subscriptions.

- Quick-add form (service name, cost, billing cycle, renewal date)
- Smart defaults for optional fields
- "Add another" flow for bulk onboarding
- **Why first:** Nothing else matters if users can't add their own subscriptions.

### 2. Email Notification System
**Job:** A (Critical Gap) | **Journey stage:** 4 (Renewal Awareness)

The single highest-impact feature gap. Transforms subtrackt from "open to check" to "proactively helps you."

- Pre-renewal email alerts at configurable thresholds (7 days, 3 days, day-of)
- Weekly digest of upcoming renewals
- Leverages existing data: renewal dates are tracked, Better Auth has user emails
- **Infrastructure:** Needs an email provider (Resend, SendGrid, or similar) + a cron job or scheduled function

### 3. Cancelled Subscription Tracking + "Money Saved" Counter
**Job:** C (Savings Feedback Loop) | **Journey stage:** 3 (Triage)

Currently, cancelling a subscription changes its status but doesn't celebrate the savings.

- Track cancellation date and last known cost
- Dashboard "Money Saved" metric: cumulative annualized cost of cancelled subs
- Creates a positive feedback loop — every cancellation feels like a win
- **Data:** `status = 'canceled'` already exists; need `canceled_at` timestamp and to preserve the cost

### 4. Calendar Integration
**Job:** A (Awareness in Existing Tools) | **Journey stage:** 4

Put renewal dates where users already look every day.

- Export renewal dates as .ics file (simplest)
- Or Google Calendar sync (leverages existing Google OAuth)
- Each renewal becomes a calendar event with the subscription name and cost

### 5. Stale Review Reminders
**Job:** A→C Pipeline | **Journey stage:** 3

Prevents "review" from becoming a permanent non-decision.

- Flag subscriptions marked "review" for longer than 30 days
- Surface them prominently on dashboard (separate section or badge)
- Optional: include in weekly email digest (pairs with #2)

### 6. Enhanced Tax Export
**Job:** B (Retention) | **Journey stage:** 6

Makes tax time genuinely painless and increases switching cost.

- Formatted year-end tax summary grouped by category with totals
- PDF export option alongside CSV
- Filter export by tax year
- Separate business vs personal export

---

## LATER (Future Vision)

| Feature | Job | Notes |
|---------|-----|-------|
| Bank/email import (auto-detect subscriptions) | A | Dramatically reduces manual entry; requires integrations (Plaid, email parsing) |
| Spend trends + year-over-year comparison | C | Requires data accumulation over time; "are my costs going up?" |
| Mixed-use percentage slider | B | For partially deductible subs (60% business, 40% personal); niche but valuable for sole props |
| Multi-user / household subscription sharing | A | Track who in the family uses what; shared vs individual subs |
| Smart tax category suggestions | B | Auto-suggest category based on service name/category; heuristic or ML |
| Direct tax software integration | B | TurboTax, FreshBooks, etc.; requires API partnerships |
| Mobile app / PWA | A | Push notifications need native or PWA; extends reach beyond desktop |
| Subscription price change detection | A, C | Alert when a renewal costs more than last time; requires historical price data |
| "Should I cancel?" recommendations | C | Based on usage patterns, competitive alternatives, price benchmarks |
| Accountant sharing / read-only view | B | Share tax data with CPA without giving full account access |

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Add-sub UI before notifications | Can't notify about renewals if users can't add subscriptions |
| Email before calendar integration | Email reaches users who don't use Google Calendar; broader impact |
| "Money Saved" before spend trends | Immediate dopamine hit vs long-term data accumulation |
| Enhanced export in NEXT not LATER | Tax features are the retention moat; worth investing early |

---

## References

- Priority order follows [JTBD Analysis](02-jtbd-analysis.md) — Job A primary, B is retention moat
- Pain points from [Journey Map](01-journey-map.md) — Stage 4 gap is the biggest
- Success measurement in [Metrics Dashboard](04-metrics.md)
