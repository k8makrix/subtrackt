# Step 8: RICE Scoring

> Recipe step 8 of 15 | Phase: Prioritize | Date: 2026-03-29

---

## Scoring Rubric

| Factor | Scale | Definition |
|--------|-------|-----------|
| **Reach** | 1-10 | How many users/period benefit? (10 = all users every session, 1 = rare edge case) |
| **Impact** | 0.25 / 0.5 / 1 / 2 / 3 | How much value per user? (3 = massive, 2 = high, 1 = medium, 0.5 = low, 0.25 = minimal) |
| **Confidence** | 0.5 / 0.8 / 1.0 | How sure are we? (1.0 = validated, 0.8 = strong signal, 0.5 = speculation) |
| **Effort** | Person-weeks | Engineering effort. Lower = better for the score. |
| **RICE** | (R x I x C) / E | Higher = higher priority |

**Context**: Single developer, product is live with 1 active user (creator), open to paid tier later. Scores calibrated for this stage.

---

## Full Feature Scoring

### Tier 1: Decision Loop (O1-O3)

| # | Feature | R | I | C | E (wks) | RICE | OKR | Notes |
|---|---------|---|---|---|---------|------|-----|-------|
| S1.1 | Pre-renewal decision prompts in email | 8 | 2 | 0.8 | 0.5 | **25.6** | O1 | Modify existing email templates to include decision CTA |
| S1.2 | Dashboard "needs attention" section | 8 | 2 | 0.8 | 0.5 | **25.6** | O1 | Filter subs renewing <7d with stale/null decision |
| S2.3 | "Undecided" badge/counter on dashboard | 7 | 1 | 1.0 | 0.3 | **23.3** | O1 | Simple count like existing costsTBD |
| S3.4 | Cost of indecision display | 6 | 1 | 0.8 | 0.3 | **16.0** | O1 | "This sub is costing $X/mo while in review" |
| S3.2 | Time-decay urgency for stale reviews | 6 | 2 | 0.8 | 0.5 | **19.2** | O1 | Progressive color/prominence after 14d, 30d, 60d |
| S2.1 | Require decision on add (default review) | 5 | 1 | 0.8 | 0.3 | **13.3** | O1 | Modify AddSubscriptionModal |
| S3.3 | "Decide or snooze" modal | 5 | 2 | 0.5 | 1.0 | **5.0** | O1 | Interruptive UX, risky without validation |
| S2.4 | Weekly "undecided" email | 5 | 1 | 0.8 | 0.5 | **8.0** | O1 | Extend existing cron/email system |
| S1.4 | Slack daily renewal digest | 3 | 1 | 0.8 | 0.5 | **4.8** | O1 | Niche; Slack already supports alerts |

### Tier 2: Distribution & Access (O4-O5)

| # | Feature | R | I | C | E (wks) | RICE | OKR | Notes |
|---|---------|---|---|---|---------|------|-----|-------|
| S4.1 | Public landing page | 10 | 3 | 1.0 | 1.0 | **30.0** | O2 | Prerequisite for any user growth |
| S4.2 | Mobile-responsive UI | 8 | 2 | 0.8 | 1.0 | **12.8** | O2 | Audit + fix existing components |
| S5.1 | Onboarding wizard | 8 | 2 | 0.8 | 1.0 | **12.8** | O2 | First-time user guided setup |
| S5.2 | Pre-populated subscription templates | 6 | 1 | 0.8 | 0.5 | **9.6** | O2 | Common subs (Netflix, Spotify, Adobe, etc.) |
| S5.3 | CSV import | 4 | 2 | 0.8 | 1.0 | **6.4** | O2 | Import from bank export or spreadsheet |
| S4.3 | PWA with home screen install | 4 | 1 | 0.5 | 1.0 | **2.0** | O2 | Nice-to-have after responsive works |
| S4.4 | Browser extension | 2 | 1 | 0.5 | 3.0 | **0.3** | O2 | High effort, unclear adoption |

### Tier 3: Value Visibility (O6)

| # | Feature | R | I | C | E (wks) | RICE | OKR | Notes |
|---|---------|---|---|---|---------|------|-----|-------|
| S6.1 | Spend trends chart | 7 | 2 | 0.8 | 1.0 | **11.2** | O3 | Month-over-month cost tracking |
| S6.3 | Budget target / spending cap | 5 | 1 | 0.5 | 1.0 | **2.5** | O3 | Set target, see progress |
| S6.4 | Shareable subscription audit report | 4 | 2 | 0.5 | 1.5 | **2.7** | O3 | PDF/image of total spend + savings |
| S6.2 | Price change detection alerts | 4 | 2 | 0.5 | 2.0 | **2.0** | O3 | Needs historical price data |

### Tier 4: Tax & Business (O7)

| # | Feature | R | I | C | E (wks) | RICE | OKR | Notes |
|---|---------|---|---|---|---------|------|-----|-------|
| S7.2 | Bulk categorization tool | 5 | 1 | 0.8 | 0.5 | **8.0** | O3 | Select multiple, set category |
| S7.1 | Smart category suggestions | 4 | 1 | 0.5 | 1.5 | **1.3** | O3 | AI/heuristic based on service name |
| S7.3 | Mixed-use % slider | 3 | 1 | 0.8 | 0.5 | **4.8** | O3 | 60% biz / 40% personal |
| S7.4 | Accountant sharing view | 2 | 1 | 0.5 | 2.0 | **0.5** | O3 | Read-only link to tax summary |

### Tier 5: Household (O8)

| # | Feature | R | I | C | E (wks) | RICE | OKR | Notes |
|---|---------|---|---|---|---------|------|-----|-------|
| S8.3 | Overlap/duplicate detection | 5 | 2 | 0.5 | 1.5 | **3.3** | -- | "You have 3 streaming services" |
| S8.2 | "Who uses this?" field | 4 | 0.5 | 0.8 | 0.3 | **5.3** | -- | Simple text field per sub |
| S8.1 | Shared household view | 3 | 2 | 0.5 | 3.0 | **1.0** | -- | Requires multi-user auth model |
| S8.4 | Household budget cap | 2 | 1 | 0.5 | 2.0 | **0.5** | -- | Needs household model first |

### Tier 6: Bar Raiser Innovations

| # | Feature | R | I | C | E (wks) | RICE | OKR | Notes |
|---|---------|---|---|---|---------|------|-----|-------|
| BR1 | Subscription Score (0-100) | 8 | 2 | 0.8 | 1.0 | **12.8** | O1, O2 | Hero metric for landing page + engagement |
| BR2 | Tax Season Mode | 5 | 2 | 0.8 | 1.0 | **8.0** | O3 | Seasonal UI toggle for tax prep |
| BR3 | The $X Experiment | 6 | 1 | 0.8 | 0.3 | **16.0** | O1 | Show what cancelled savings could buy |
| BR4 | Receipt Scanner (AI) | 6 | 3 | 0.5 | 3.0 | **3.0** | O2 | Vision AI to extract sub data from screenshots |

---

## Ranked Feature List

| Rank | Feature | RICE | Effort | Category |
|------|---------|------|--------|----------|
| 1 | **S4.1: Public landing page** | 30.0 | 1.0 wk | Distribution |
| 2 | **S1.1: Pre-renewal decision prompts in email** | 25.6 | 0.5 wk | Decision loop |
| 3 | **S1.2: Dashboard "needs attention" section** | 25.6 | 0.5 wk | Decision loop |
| 4 | **S2.3: "Undecided" badge/counter** | 23.3 | 0.3 wk | Decision loop |
| 5 | **S3.2: Time-decay urgency for stale reviews** | 19.2 | 0.5 wk | Decision loop |
| 6 | **S3.4: Cost of indecision display** | 16.0 | 0.3 wk | Decision loop |
| 7 | **BR3: The $X Experiment** | 16.0 | 0.3 wk | Innovation |
| 8 | **S2.1: Default decision on add** | 13.3 | 0.3 wk | Decision loop |
| 9 | **BR1: Subscription Score** | 12.8 | 1.0 wk | Innovation |
| 10 | **S4.2: Mobile-responsive UI** | 12.8 | 1.0 wk | Distribution |
| 11 | **S5.1: Onboarding wizard** | 12.8 | 1.0 wk | Distribution |
| 12 | **S6.1: Spend trends chart** | 11.2 | 1.0 wk | Value visibility |
| 13 | **S5.2: Pre-populated templates** | 9.6 | 0.5 wk | Distribution |
| 14 | **S2.4: Weekly "undecided" email** | 8.0 | 0.5 wk | Decision loop |
| 15 | **S7.2: Bulk categorization** | 8.0 | 0.5 wk | Tax |
| 16 | **BR2: Tax Season Mode** | 8.0 | 1.0 wk | Innovation |
| 17 | **S5.3: CSV import** | 6.4 | 1.0 wk | Distribution |
| 18 | **S8.2: "Who uses this?" field** | 5.3 | 0.3 wk | Household |
| 19 | **S3.3: "Decide or snooze" modal** | 5.0 | 1.0 wk | Decision loop |
| 20 | **S1.4: Slack daily digest** | 4.8 | 0.5 wk | Decision loop |
| 21 | **S7.3: Mixed-use % slider** | 4.8 | 0.5 wk | Tax |
| 22 | **S8.3: Overlap detection** | 3.3 | 1.5 wk | Household |
| 23 | **BR4: Receipt Scanner** | 3.0 | 3.0 wk | Innovation |
| 24 | **S6.4: Shareable audit report** | 2.7 | 1.5 wk | Value visibility |
| 25 | **S6.3: Budget target** | 2.5 | 1.0 wk | Value visibility |
| 26 | **S4.3: PWA** | 2.0 | 1.0 wk | Distribution |
| 27 | **S6.2: Price change detection** | 2.0 | 2.0 wk | Value visibility |
| 28 | **S7.1: Smart category suggestions** | 1.3 | 1.5 wk | Tax |
| 29 | **S8.1: Shared household view** | 1.0 | 3.0 wk | Household |
| 30 | **S7.4: Accountant sharing** | 0.5 | 2.0 wk | Tax |
| 31 | **S8.4: Household budget cap** | 0.5 | 2.0 wk | Household |
| 32 | **S4.4: Browser extension** | 0.3 | 3.0 wk | Distribution |

---

## Scoring Notes

**Math shown for top 5:**

1. Landing page: (10 × 3 × 1.0) / 1.0 = **30.0**
2. Pre-renewal prompts: (8 × 2 × 0.8) / 0.5 = **25.6**
3. Dashboard needs attention: (8 × 2 × 0.8) / 0.5 = **25.6**
4. Undecided badge: (7 × 1 × 1.0) / 0.3 = **23.3**
5. Time-decay urgency: (6 × 2 × 0.8) / 0.5 = **19.2**

**Confidence adjustments:**
- Features using existing infrastructure (email, dashboard) get 0.8+ confidence
- Innovations without user validation get 0.5 confidence
- Features that modify existing UI patterns get 1.0 confidence

**Reach calibration:**
- "All users every session" = 10 (landing page: every potential visitor)
- "Most users most sessions" = 7-8 (dashboard features, emails)
- "Some users sometimes" = 4-5 (tax features, imports)
- "Niche use case" = 2-3 (Slack, browser extension, accountant view)

---

## Key Observation

The top 8 features by RICE score total **~3.4 person-weeks** of effort. That's achievable in a single sprint. The decision loop features (ranks 2-8) are all small, high-impact changes to existing infrastructure. The landing page (rank 1) is the single highest-impact investment.

**The efficient path**: Build ranks 1-8 first (landing page + decision loop improvements), then tackle the larger items (Subscription Score, responsive UI, onboarding, spend trends) in a second pass.

---

## References

- Feature pool: Step 6 (Opportunity Tree) + Step 7 (Bar Raiser innovations)
- OKR alignment: Step 5
- NSM: Conscious Renewal Rate (Step 4)
