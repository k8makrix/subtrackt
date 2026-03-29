# Step 5: OKRs

> Recipe step 5 of 15 | Phase: Strategy | Date: 2026-03-29
> Timeframe: Q2 2026 (April - June)

---

## Alignment

```
North Star Metric: Conscious Renewal Rate
  ↓ drives
Objective 1: Make every renewal a deliberate decision
Objective 2: Make Subtrackt visible and accessible
Objective 3: Deepen the data foundation for long-term value
```

---

## Objective 1: Make every renewal a deliberate decision

*Directly drives the primary NSM (Conscious Renewal Rate)*

| # | Key Result | Current | Target | How to measure |
|---|-----------|---------|--------|----------------|
| 1.1 | Conscious Renewal Rate reaches 65% | ~40-50% (est.) | 65% | `decision_changed_at` vs. `next_renewal_date` for all renewals in period |
| 1.2 | 90% of active subscriptions have a keep/cancel/review decision set | ~80% | 90% | `COUNT(decision NOT NULL) / COUNT(active)` |
| 1.3 | Average decision lead time is 7+ days before renewal | Unknown | 7 days | `next_renewal_date - MAX(decision_changed_at)` |
| 1.4 | Stale review count drops below 5 | ~15 in review, unknown stale count | < 5 stale | Subs with `keep_cancel_review = 'review'` AND `decision_changed_at` > 30 days ago |

**Initiatives:**
- Pre-renewal decision prompts in notification emails ("Figma renews in 3 days -- still keeping it?")
- Dashboard prominence for subs approaching renewal without a recent decision
- Weekly digest email that highlights subs needing attention
- UX improvement: make decision dropdown more prominent in SubscriptionRow

---

## Objective 2: Make Subtrackt visible and accessible

*Addresses the #1 competitive gap: distribution*

| # | Key Result | Current | Target | How to measure |
|---|-----------|---------|--------|----------------|
| 2.1 | Ship a public landing page that communicates the value prop without sign-in | No landing page | Shipped and live | Page exists at subtrackt.vercel.app with value prop, screenshots, CTA |
| 2.2 | Core UI is usable on mobile viewports (responsive, not native app) | Untested on mobile | All critical flows work on 375px+ | Manual testing on mobile viewport |
| 2.3 | Onboarding flow guides new users to add their first 5 subscriptions | No onboarding | Flow exists and 80%+ complete it | Track completion of onboarding steps |

**Initiatives:**
- Design and ship a landing page (hero, features, screenshots, sign-in CTA)
- Responsive audit and fixes for Dashboard, SubscriptionRow, AddSubscriptionModal
- First-time user onboarding: guided setup wizard or checklist
- Open Graph / social preview metadata for link sharing

---

## Objective 3: Deepen the data foundation for long-term value

*Drives secondary NSM (Tax-Ready %) and enables future features*

| # | Key Result | Current | Target | How to measure |
|---|-----------|---------|--------|----------------|
| 3.1 | Tax-Ready % for business subscriptions reaches 90% | ~70% (est.) | 90% | Biz subs with `tax_category` AND `cost` AND `billing_cycle` all non-null |
| 3.2 | Cost fill rate reaches 98% for active subscriptions | ~90% | 98% | Active subs with `cost` populated |
| 3.3 | Spend trends feature ships (month-over-month cost tracking) | Not built | Shipped | Feature exists in Dashboard or dedicated view |
| 3.4 | 100% of active subscriptions have `next_renewal_date` populated | ~85% (est.) | 100% | Active subs with non-null `next_renewal_date` |

**Initiatives:**
- "Costs TBD" nudge: surface incomplete subs prominently, make it easy to fill gaps
- Spend trends: store monthly snapshots, display trend chart
- Data completeness dashboard or progress bar
- Bulk edit for missing fields (renewal date, cost, tax category)

---

## OKR Summary Table

| Objective | Key Results | Initiatives |
|-----------|------------|-------------|
| O1: Deliberate decisions | 4 KRs: 65% conscious renewal, 90% decision fill, 7-day lead time, <5 stale reviews | Pre-renewal prompts, dashboard prominence, weekly digest, UX improvements |
| O2: Visible and accessible | 3 KRs: landing page, mobile responsive, onboarding flow | Landing page, responsive audit, onboarding wizard, OG metadata |
| O3: Data foundation | 4 KRs: 90% tax-ready, 98% cost fill, spend trends, 100% renewal dates | TBD nudges, spend trends feature, completeness dashboard, bulk edit |

---

## What's Explicitly Out of Scope for Q2

| Item | Why deferred |
|------|-------------|
| Mobile native app | Too large for Q2; responsive web covers the immediate need |
| Bank connection (Plaid) | Architectural decision needed; not a Q2 priority |
| Multi-user / team features | Requires fundamental auth/data model changes |
| Bill negotiation | Operational complexity, not a product feature |
| AI-powered categorization | Nice-to-have, not essential for core value delivery |
| Alternative discovery | Data-intensive, latent job, park for later |

---

## References

- NSM: Conscious Renewal Rate (Step 4)
- Competitive gap: distribution (Step 3, Key Takeaway #3)
- Production data: 69 subs, decision fill ~80%, cost fill ~90%
