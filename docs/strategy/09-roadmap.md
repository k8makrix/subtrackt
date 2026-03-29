# Step 9: Now / Next / Later Roadmap

> Recipe step 9 of 15 | Phase: Prioritize | Date: 2026-03-29
> Replaces stale `03-roadmap.md` from V1

---

## Already Shipped (context)

These features are live and working. They inform what's possible but are not part of the roadmap:

Subscription CRUD, 3-tab dashboard, urgency-coded renewals, Google OAuth, tax categorization + expense types, CSV export, PDF tax report, year-filtered exports, per-subscription notes, search, sort + filter controls, keep/cancel/review decision workflow, email/Slack notifications (7/3/0 days), calendar .ics export, stale review reminders (30+ days), cancelled sub tracking + money saved counter, Lenny Pass section.

---

## NOW (0-4 weeks)

High-RICE features buildable immediately with existing infrastructure. Total effort: ~5 person-weeks.

### Sprint 1: Decision Loop (RICE ranks 2-8, ~2 weeks)

| # | Feature | RICE | Effort | Job | OKR |
|---|---------|------|--------|-----|-----|
| S1.1 | **Pre-renewal decision prompts in email** | 25.6 | 0.5 wk | 1 | O1 |
| S1.2 | **Dashboard "needs attention" section** | 25.6 | 0.5 wk | 1 | O1 |
| S2.3 | **"Undecided" badge/counter** | 23.3 | 0.3 wk | 1 | O1 |
| S3.2 | **Time-decay urgency for stale reviews** | 19.2 | 0.5 wk | 1 | O1 |
| S3.4 | **Cost of indecision display** | 16.0 | 0.3 wk | 1, 2 | O1 |
| BR3 | **The $X Experiment** (savings visualization) | 16.0 | 0.3 wk | 2 | O1 |
| S2.1 | **Default decision on add** | 13.3 | 0.3 wk | 1 | O1 |

**Why this sprint first:** These are all modifications to existing components (Dashboard.tsx, SubscriptionRow.tsx, email templates, AddSubscriptionModal.tsx). Small changes, high impact on NSM. Completes the "close the decision loop" theme.

**Definition of done:** Conscious Renewal Rate measurably improves. Every sub approaching renewal surfaces a decision prompt.

### Sprint 2: Landing Page + Foundation (RICE rank 1 + supporting, ~3 weeks)

| # | Feature | RICE | Effort | Job | OKR |
|---|---------|------|--------|-----|-----|
| S4.1 | **Public landing page** | 30.0 | 1.0 wk | All | O2 |
| BR1 | **Subscription Score** (0-100) | 12.8 | 1.0 wk | 1, 2 | O1, O2 |
| S5.2 | **Pre-populated subscription templates** | 9.6 | 0.5 wk | 1 | O2 |
| S2.4 | **Weekly "undecided" email** | 8.0 | 0.5 wk | 1 | O1 |

**Why second:** Landing page is the #1 RICE item but requires design decisions. Sprint 1 ships quick wins while the landing page is being designed. Subscription Score becomes the hero metric for the landing page. Templates reduce onboarding friction.

**Definition of done:** A visitor can understand Subtrackt's value without signing in. Subscription Score is computed and displayed.

---

## NEXT (1-3 months)

High-RICE features needing design or more substantial engineering. Total effort: ~8 person-weeks.

| # | Feature | RICE | Effort | Job | OKR | Why NEXT not NOW |
|---|---------|------|--------|-----|-----|-----------------|
| S4.2 | **Mobile-responsive UI** | 12.8 | 1.0 wk | All | O2 | Needs audit of all components first |
| S5.1 | **Onboarding wizard** | 12.8 | 1.0 wk | All | O2 | Design depends on landing page decisions |
| S6.1 | **Spend trends chart** | 11.2 | 1.0 wk | 2 | O3 | Needs data snapshot infrastructure |
| S7.2 | **Bulk categorization tool** | 8.0 | 0.5 wk | 3 | O3 | Tax-ready % driver, but not urgent until tax season |
| BR2 | **Tax Season Mode** | 8.0 | 1.0 wk | 3 | O3 | Seasonal: build before next Jan |
| S5.3 | **CSV import** | 6.4 | 1.0 wk | 1 | O2 | Reduces onboarding friction for power users |
| S8.2 | **"Who uses this?" field** | 5.3 | 0.3 wk | 2 | -- | Simple schema addition, low effort |
| S7.3 | **Mixed-use % slider** | 4.8 | 0.5 wk | 3 | O3 | Niche but valuable for sole props |
| S3.3 | **"Decide or snooze" modal** | 5.0 | 1.0 wk | 1 | O1 | Interruptive UX, needs user testing |
| S1.4 | **Slack daily digest** | 4.8 | 0.5 wk | 1 | O1 | Niche enhancement to existing Slack support |

---

## LATER (3-6+ months)

Strategic bets, moonshots, and features requiring significant infrastructure. Not RICE-prioritized; sequenced by strategic value.

| # | Feature | Job | Why later | Dependency |
|---|---------|-----|----------|-----------|
| BR4 | **Receipt Scanner (AI)** | 1 | High effort (3 wks), needs vision AI integration | Claude/GPT-4V API access |
| S8.3 | **Overlap/duplicate detection** | 2 | Needs heuristic design + data model | Service name normalization |
| S6.4 | **Shareable subscription audit report** | 2 | Growth feature, needs landing page first | Landing page + Subscription Score |
| S8.1 | **Shared household view** | 2 | Requires multi-user auth model | Architecture decision |
| S6.2 | **Price change detection** | 1 | Needs historical price data (time to accumulate) | Monthly cost snapshots |
| S6.3 | **Budget target / spending cap** | 2 | Useful but not differentiated | Spend trends |
| S7.1 | **Smart category suggestions** | 3 | AI/heuristic, low confidence in accuracy | Sufficient categorized data for training |
| S7.4 | **Accountant sharing view** | 3 | Niche, needs auth scoping | Multi-user model |
| S4.3 | **PWA** | All | Nice-to-have after responsive works | Mobile-responsive UI |
| S8.4 | **Household budget cap** | 2 | Needs household model | Shared household view |
| S4.4 | **Browser extension** | 1 | High effort, unclear adoption | User base to validate need |

---

## Decision Log

| Decision | Rationale |
|----------|-----------|
| Decision loop before landing page | Quick wins (0.3-0.5 wk each) ship while landing page is designed. Improves product before new users arrive. |
| Subscription Score in NOW, not NEXT | Becomes the hero metric for the landing page. Build them together. |
| Templates in NOW sprint 2 | Reduces blank-slate problem for new users arriving via landing page. |
| Mobile-responsive in NEXT, not NOW | Needs full component audit. Responsive fixes are harder to scope. |
| Onboarding wizard in NEXT | Design depends on landing page flow and template availability. |
| Tax Season Mode in NEXT | Seasonal: must ship before January 2027. Not urgent in Q2. |
| Receipt Scanner in LATER | Highest-potential innovation but 3 weeks effort and needs AI integration. Worth doing but not yet. |
| Household features in LATER | Marcus persona is validated but multi-user auth is a big architectural change. |
| No bank connection on roadmap | Eventual need acknowledged (Step 3 bridge), but not prioritized in Q2-Q3. Architecture consideration only. |

---

## Roadmap Visualization

```
Q2 2026 (Apr-Jun)                    Q3 2026 (Jul-Sep)              Q4+ 2026
─────────────────                    ─────────────────              ─────────

NOW Sprint 1 (2 wks)                NEXT (8 wks)                   LATER
┌─────────────────────┐             ┌──────────────────┐           ┌──────────────┐
│ Decision prompts     │             │ Mobile responsive │           │ Receipt scan │
│ Needs attention      │             │ Onboarding wizard │           │ Overlap detect│
│ Undecided badge      │             │ Spend trends      │           │ Shared house │
│ Time-decay urgency   │             │ Bulk categorize   │           │ Price change │
│ Cost of indecision   │             │ Tax Season Mode   │           │ Budget target│
│ $X Experiment        │             │ CSV import        │           │ Smart suggest│
│ Default decision     │             │ Decide or snooze  │           │ PWA          │
└─────────────────────┘             │ Who uses this?    │           │ ...          │
                                     │ Mixed-use %       │           └──────────────┘
NOW Sprint 2 (3 wks)                │ Slack digest      │
┌─────────────────────┐             └──────────────────┘
│ Landing page         │
│ Subscription Score   │
│ Sub templates        │
│ Weekly undecided     │
└─────────────────────┘
```

---

## OKR-to-Roadmap Traceability

| OKR Key Result | Roadmap items serving it |
|---------------|------------------------|
| O1: KR1.1 (65% conscious renewal) | S1.1, S1.2, S2.3, S3.2, S3.4, S2.1, BR3 |
| O1: KR1.2 (90% decision fill) | S2.1, S2.3, S2.4 |
| O1: KR1.3 (7-day lead time) | S1.1, S1.2 |
| O1: KR1.4 (<5 stale reviews) | S3.2, S3.4, S3.3 |
| O2: KR2.1 (landing page) | S4.1 |
| O2: KR2.2 (mobile responsive) | S4.2 |
| O2: KR2.3 (onboarding) | S5.1, S5.2 |
| O3: KR3.1 (90% tax-ready) | S7.2, BR2 |
| O3: KR3.2 (98% cost fill) | Data quality work (operational) |
| O3: KR3.3 (spend trends) | S6.1 |
| O3: KR3.4 (100% renewal dates) | Data quality work (operational) |

---

## References

- RICE scores: Step 8
- OKRs: Step 5
- Feature pool: Steps 6 (Opportunity Tree) + 7 (Bar Raiser)
- V1 roadmap: `03-roadmap.md` (superseded; all V1 NEXT items are now shipped)
