# Subtrackt: Product Strategy Deck

> Generated from 15-step product strategy recipe | 2026-03-29

---

## Slide 1: What is Subtrackt?

A subscription tracker that turns passive spending into intentional decisions.

- Track every subscription in one place
- Decide: keep, cancel, or review before each renewal
- Categorize expenses for tax time
- See what you're saving

**Live at** subtrackt.vercel.app | **Stack:** Next.js 16, Neon PostgreSQL, Vercel

---

## Slide 2: Who is it for?

| Persona | Who | Core need |
|---------|-----|-----------|
| **Kate** | Freelancer/solopreneur, 30-50 subs, files 1099 | Don't get surprised by charges. Get taxes right. |
| **Marcus** | Household manager, 15-25 subs, dual income | Know total family spend. Cut waste. |
| **Priya** | Small business operator, 40-80 SaaS tools | Control SaaS sprawl. Plan renewals. |

**Adjacent segments:** Content creators, agency owners, accountants

---

## Slide 3: Five Jobs to Be Done

| # | Job | Status | Serves |
|---|-----|--------|--------|
| 1 | **"Help me not get surprised by charges"** | Served (notifications, calendar, urgency coding) | All |
| 2 | **"Help me understand and reduce my total spend"** | Partially served (dashboard, money saved) | Marcus, Kate |
| 3 | **"Help me get my tax deductions right"** | Well served (tax tab, PDF, year filter) | Kate, Priya |
| 4 | **"Help me manage my team's software stack"** | Not served | Priya |
| 5 | **"Help me discover better alternatives"** | Not served | All |

**Primary job:** Job 1. It drives daily engagement and creates the data foundation for everything else.

---

## Slide 4: Market Opportunity

| Metric | Value |
|--------|-------|
| **Subscription economy** | $536B globally (2025), growing 17.8% CAGR |
| **TAM** (U.S. consumer sub tracking) | ~$1.6B/year |
| **SAM** (reachable freelancers + households) | ~$16.8M/year |
| **SOM** (year 2, if monetized) | $6-15K/year |

**The pain is real:** 89% underestimate their spending by 2.5x. 42% have forgotten a subscription. Average household wastes $127/year on unused subs.

---

## Slide 5: Competitive Landscape

```
        Privacy-First (Manual)          Bank-Connected (Auto)
            |                                   |
  Renewal   |  SUBTRACKT    TrackMySubs         |  Rocket Money
  Focused   |  Bobby                            |
            |                                   |
  Expense   |                                   |  Monarch  YNAB
  Focused   |                                   |  Copilot  PocketGuard
```

**Subtrackt's unique combination:** Decision workflow + tax categorization + privacy-first. No competitor has all three.

**The real moat:** Keep/cancel/review with stale reminders and urgency coding. Tax categorization per subscription. These require deep domain understanding, not just features.

---

## Slide 6: North Star Metric

### Primary: Conscious Renewal Rate

> "What % of renewals this month were deliberate decisions, not passive auto-charges?"

- Current: ~45% (estimated)
- Q2 target: 65%
- Q3 target: 80%
- Aspirational: 95%

### Secondary: Tax-Ready %

> "What % of business subscriptions are fully categorized and export-ready?"

- Current: ~70%
- Q2 target: 90%

---

## Slide 7: Q2 2026 OKRs

| Objective | Key Results |
|-----------|-----------|
| **O1: Deliberate decisions** | 65% conscious renewal rate, 90% decision fill, 7-day lead time, <5 stale reviews |
| **O2: Visible and accessible** | Landing page live, mobile responsive, onboarding flow |
| **O3: Data foundation** | 90% tax-ready, 98% cost fill, spend trends shipped, 100% renewal dates |

---

## Slide 8: What We're Building (NOW)

### Sprint 1: Close the Decision Loop (~2 weeks)

| Feature | Impact |
|---------|--------|
| Pre-renewal decision prompts in email | Users decide before charges hit |
| "Needs Attention" dashboard section | Surface subs needing action |
| Decision badge on collapsed rows | See status at a glance |
| Undecided counter | Motivate triage completion |
| Time-decay urgency for stale reviews | Reviews can't be ignored forever |
| Cost of indecision display | Feel the cost of delay |
| Savings visualization ("The $X Experiment") | Make cancelling rewarding |
| Default "review" on new subs | No sub enters without a decision queue |

### Sprint 2: Landing Page & Foundation (~3 weeks)

| Feature | Impact |
|---------|--------|
| Public landing page | Product becomes discoverable |
| Subscription Score (0-100) | Hero metric, engagement driver |
| Pre-populated templates | Reduce onboarding friction |
| Weekly undecided email | Persistent nudge to complete triage |

---

## Slide 9: What's Next (Q3) and Later

### NEXT (1-3 months)

Mobile-responsive UI, onboarding wizard, spend trends chart, bulk tax categorization, Tax Season Mode, CSV import, mixed-use % slider, "Who uses this?" field

### LATER (3-6+ months)

Receipt Scanner (AI), overlap detection, shared household view, price change detection, budget targets, smart category suggestions, PWA, accountant sharing

---

## Slide 10: Bar Raiser Highlights

### Top 3 Challenged Assumptions

1. **"Users will manually enter 30+ subs"** -- Existential risk. Templates + CSV import mitigate.
2. **"Decision workflow is the moat"** -- Only if users actually complete decisions. Measure it.
3. **"Equal-weight segments (freelancers + households)"** -- Unvalidated. Design for Kate, don't exclude Marcus.

### Top 3 Innovations Added

1. **Subscription Score** (0-100) -- Gamified subscription hygiene metric
2. **Tax Season Mode** -- Seasonal UI toggle for focused tax prep
3. **The $X Experiment** -- Show what cancelled savings could buy

---

## Slide 11: Risks

| Risk | Severity | Mitigation |
|------|----------|-----------|
| **Manual data entry kills adoption** | Critical | Templates (NOW), CSV import (NEXT), Receipt Scanner (LATER) |
| **Onboarding cliff** | Critical | Empty state (NOW), templates (NOW), wizard (NEXT) |
| **Nobody pays for sub tracking** | High | Defer monetization. Focus on value. Consider one-time pricing. |
| **Single-user architecture** | High | Auth scoping works. Multi-user is a Q3+ investment. |
| **Solo developer burnout** | High | Scope ruthlessly. Ship small. |

---

## Slide 12: Security Pre-Launch Gate

5 must-haves before landing page goes live:

| # | Requirement | Status |
|---|------------|--------|
| SEC-1 | Fix page.tsx to filter by authenticated user | To do |
| SEC-2 | Rotate BETTER_AUTH_SECRET | To do |
| SEC-3 | Add rate limiting to API routes | To do |
| SEC-4 | Add account deletion flow | To do |
| SEC-5 | Update layout.tsx metadata | To do |

---

## Slide 13: UX Scorecard

**Overall: 6.3/10** -- Functional but rough edges.

| Strength | Weakness |
|----------|----------|
| Clean dark theme, good info density | No onboarding or empty states |
| Decision workflow is intuitive | Decision status hidden until row expanded |
| Urgency color-coding is effective | Text contrast issues (gray-500) |
| Tax tab is well-structured | No help text or tooltips |
| Amber accent is distinctive | Layout metadata still default |

---

## Slide 14: 20 Stories, Ready to Build

| Milestone | Stories | Must | Should | Effort |
|-----------|---------|------|--------|--------|
| **M1: Security Gate** | 7 | 7 | 0 | ~4 days |
| **M2: Decision Loop** | 8 | 2 | 6 | ~4.5 days |
| **M3: Landing Page** | 5 | 2 | 3 | ~5.5 days |
| **Total** | **20** | **11** | **9** | **~14 days** |

All stories have Gherkin acceptance criteria (Given/When/Then). Full details in `14-stories.md`.

---

## Slide 15: Coherence Check

| Audit | Result |
|-------|--------|
| Every story traces to an OKR | Pass |
| Every OKR traces to the NSM | Pass |
| Every feature traces to a JTBD | Pass |
| Every JTBD maps to a persona | Pass |
| Terminology consistent | Pass (1 minor flag) |
| Decisions consistent across docs | Pass (1 minor flag) |
| No orphaned artifacts | Pass |
| No blocking issues | **Pass** |

---

## Slide 16: What Success Looks Like

**End of Q2 2026:**

- Conscious Renewal Rate: 65% (up from ~45%)
- Landing page live, attracting first external users
- Security gate closed, ready for public traffic
- 20 stories shipped across 3 milestones
- Subscription Score gamifying engagement
- Tax-Ready %: 90%

**The bigger picture:** Subtrackt goes from a powerful personal tool to a product that other people can discover, understand, and use -- with every renewal being a deliberate decision.

---

## Appendix: Full Artifact Inventory

| # | Doc | File |
|---|-----|------|
| 1 | Personas + JTBD | `docs/strategy/01-personas-jtbd.md` |
| 2 | Market Sizing | `docs/strategy/02-market-sizing.md` |
| 3 | Competitive Analysis | `docs/strategy/03-competitor-analysis.md` |
| 4 | North Star Metric | `docs/strategy/04-north-star-metric.md` |
| 5 | OKRs | `docs/strategy/05-okrs.md` |
| 6 | Opportunity Tree | `docs/strategy/06-opportunity-tree.md` |
| 7 | Bar Raiser | `docs/strategy/07-bar-raiser.md` |
| 8 | RICE Scores | `docs/strategy/08-rice-scores.md` |
| 9 | Roadmap | `docs/strategy/09-roadmap.md` |
| 10 | Journey + UX Audit | `docs/strategy/10-journey-ux-audit.md` |
| 11 | Pre-Mortem | `docs/strategy/11-pre-mortem.md` |
| 12 | Security Review | `docs/strategy/12-security-review.md` |
| 13 | PRD | `docs/strategy/13-prd.md` |
| 14 | Stories | `docs/strategy/14-stories.md` |
| 15 | Coherence Audit | `docs/strategy/15-coherence-audit.md` |
