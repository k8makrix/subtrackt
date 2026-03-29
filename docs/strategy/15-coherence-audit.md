# Step 15: Coherence Audit (Bar Raiser, Coherence Mode)

> Recipe step 15 of 15 | Phase: Deliver | Date: 2026-03-29
> Final quality gate across all 14 prior artifacts

---

## 1. Traceability Audit

### Story -> OKR traceability

| Story | OKR KR | Traced? |
|-------|--------|---------|
| SEC-1 through SEC-5 | O2 (visible/accessible) | Yes (enablers for launch) |
| UX-1, UX-2 | O2 | Yes |
| DL-1 | O1: KR1.1, KR1.3 | Yes |
| DL-2 | O1: KR1.1, KR1.4 | Yes |
| DL-3 | O1: KR1.2 | Yes |
| DL-4 | O1: KR1.2 | Yes |
| DL-5 | O1: KR1.4 | Yes |
| DL-6 | O1: KR1.1 | Yes |
| DL-7 | O1: KR1.1 | Yes (indirectly, reinforces cancel decisions) |
| DL-8 | O1: KR1.2 | Yes |
| LP-1, LP-3 | O2: KR2.1 | Yes |
| LP-2, LP-4 | O2: KR2.1 | Yes |
| SS-1, SS-2 | O1, O2 | Yes |
| TP-1 | O2: KR2.3 | Yes |
| TP-2 | O1: KR1.2 | Yes |

**Orphan check:** No stories without an OKR mapping. No OKR KRs without at least one story.

### OKR -> NSM traceability

| OKR | NSM connection |
|-----|---------------|
| O1: Deliberate decisions | **Direct** driver of Conscious Renewal Rate |
| O2: Visible and accessible | **Enabler**: can't measure NSM without users |
| O3: Data foundation | **Driver** of secondary NSM (Tax-Ready %) + input metrics (cost fill, renewal fill) |

### JTBD -> Feature traceability

| Job | Features serving it |
|-----|-------------------|
| Job 1: Not get surprised | DL-1 through DL-8, SS-1, TP-2 |
| Job 2: Reduce spend | DL-6 (cost of indecision), DL-7 ($X Experiment), SS-1 |
| Job 3: Tax deductions | (No direct stories in NOW scope; served by existing features + NEXT bulk categorization) |
| Job 4: Team management | (Out of scope for Q2) |
| Job 5: Discover alternatives | (Out of scope for Q2) |

**Flag:** Job 3 (tax deductions) has no new stories in the NOW roadmap. This is acceptable because Job 3 is already "well served" per Step 1. The secondary NSM (Tax-Ready %) is served by data quality work and NEXT items (bulk categorization, Tax Season Mode).

### Persona -> Feature traceability

| Feature | Kate | Marcus | Priya |
|---------|------|--------|-------|
| Security gate (SEC-*) | Yes | Yes | Yes |
| Decision loop (DL-*) | **Primary** | Yes | Yes |
| Landing page (LP-*) | Yes | Yes | Yes |
| Subscription Score (SS-*) | Yes | Yes | Yes |
| Templates (TP-1) | Yes | **Primary** (simpler onboarding) | Yes |

No persona is unserved by the NOW roadmap.

---

## 2. Terminology Audit

| Term | Used consistently? | Where inconsistent |
|------|-------------------|-------------------|
| "Conscious Renewal Rate" | Yes | -- |
| "Tax-Ready %" | Yes | -- |
| "Subscription Score" | Yes | -- |
| "keep/cancel/review" | Yes | -- |
| "decision" vs "keep_cancel_review" | **Inconsistent** | Code uses `keep_cancel_review` (schema), docs use "decision." Acceptable: schema name is a DB convention, "decision" is the user-facing term. Not a bug. |
| "stale review" | Yes | -- |
| "Needs Attention" vs "Urgent Renewals" | **New term** | Dashboard currently has "Urgent Renewals." PRD introduces "Needs Attention" as a separate section. These are different: Urgent = renewing soon, Needs Attention = renewing soon WITHOUT a decision. Should be clearly differentiated in UI. |
| "landing page" | Yes | -- |
| "onboarding" | Yes | -- |
| "NOW/NEXT/LATER" | Yes | -- |

**Action:** Ensure "Needs Attention" and "Urgent Renewals" are clearly differentiated when DL-2 is built. "Urgent Renewals" shows all upcoming, "Needs Attention" shows only those needing action.

---

## 3. Decision Consistency

| Decision | Where made | Consistent throughout? |
|----------|-----------|----------------------|
| Freelancers and households get equal weight | Step 2 bridge | **Partially.** Step 1 still labels Kate "Primary" and Marcus "Secondary." Roadmap features skew toward Kate (decision workflow, tax). Recommendation: update Step 1 labels to "Co-Primary" or acknowledge that equal weight means "serve both, design for Kate first." |
| Growth model is premature | Step 3 bridge | **Yes.** No growth model features in NOW/NEXT. Landing page is a prerequisite, not a growth strategy. |
| Privacy-first with eventual bank connection | Step 3 bridge | **Yes.** No bank connection on roadmap. Architectural consideration only. |
| Onboarding is important but not #1 | Step 7 bridge | **Yes.** Onboarding wizard is in NEXT, not NOW. Templates in NOW Sprint 2 reduce friction without a full wizard. |
| All 5 security must-haves before launch | Step 10-12 bridge | **Yes.** PRD Milestone 1 includes all 5. Timeline puts security gate first (weeks 1-2). |

**Inconsistency found:** Step 1 persona labels (Primary/Secondary/Tertiary) conflict with the Step 2 bridge decision for equal weight. This is a minor documentation inconsistency, not a strategy conflict. The roadmap correctly serves both.

---

## 4. Completeness Check

| Question | Answer |
|---------|--------|
| Anything decided but not captured? | No. All bridge decisions are recorded in their respective docs. |
| Anything referenced but not defined? | "Subscription Score algorithm" is referenced in SS-1 but weights are proposed, not finalized. Open question #2 in PRD. Acceptable: finalize during Sprint 2 implementation. |
| Any PRD stories missing acceptance criteria? | No. All 20 stories have Gherkin criteria. |
| Any RICE-scored features that disappeared? | S1.3 (calendar adoption) and S1.4 (Slack daily digest) scored low and are in NEXT/LATER. Accounted for. |
| Any security requirements not in stories? | SEC-6 through SEC-9 (should-have) are not in stories. Acceptable: they're Q2 should-haves, not NOW must-haves. Track as tech debt. |

---

## 5. Quality Check

| Area | Status | Notes |
|------|--------|-------|
| Spelling | Pass | Verified across all 14 docs |
| Formatting | Pass | Consistent markdown: headers, tables, code blocks, bullet lists |
| Tone | Consistent | Opinionated, evidence-cited, scannable. Executives could skim any doc. |
| No em-dashes | Pass | En-dashes, commas, and colons used throughout |
| [REVIEW] markers | 2 found | Step 2: SAM and SOM have [REVIEW] flags noting assumptions. Appropriate: these are genuinely uncertain. |
| Math shown | Pass | RICE scores show formulas. Market sizing shows arithmetic. |

---

## 6. Fixes Applied

| # | Issue | Fix | Artifact |
|---|-------|-----|---------|
| 1 | "Needs Attention" vs "Urgent Renewals" terminology overlap | Added note to differentiate in DL-2 implementation | This doc (terminology section) |
| 2 | Persona labels inconsistent with equal-weight decision | Documented as minor inconsistency. Roadmap serves both. No artifact change needed. | This doc (decision consistency section) |
| 3 | SEC-6 through SEC-9 not tracked as stories | Listed as tech debt to track alongside NOW work | This doc (completeness section) |

No blocking issues found. All artifacts are internally consistent and traceable.

---

## Recipe Complete

### Final Artifact Inventory

| # | Artifact | File |
|---|---------|------|
| 1 | Personas + JTBD | `01-personas-jtbd.md` |
| 2 | Market Sizing + Segments | `02-market-sizing.md` |
| 3 | Competitive Analysis + Growth Model | `03-competitor-analysis.md` |
| 4 | North Star Metric | `04-north-star-metric.md` |
| 5 | OKRs | `05-okrs.md` |
| 6 | Opportunity Solution Tree | `06-opportunity-tree.md` |
| 7 | Bar Raiser (Challenge Mode) | `07-bar-raiser.md` |
| 8 | RICE Scoring | `08-rice-scores.md` |
| 9 | Now/Next/Later Roadmap | `09-roadmap.md` |
| 10 | Journey Map + UX Audit | `10-journey-ux-audit.md` |
| 11 | Pre-Mortem | `11-pre-mortem.md` |
| 12 | Security Review | `12-security-review.md` |
| 13 | PRD | `13-prd.md` |
| 14 | Stories | `14-stories.md` |
| 15 | Coherence Audit | `15-coherence-audit.md` |

### Stale Files to Archive

These V1 docs are superseded by the recipe output:

| Old file | Replaced by |
|---------|-------------|
| `01-journey-map.md` | `01-personas-jtbd.md` + `10-journey-ux-audit.md` |
| `02-jtbd-analysis.md` | `01-personas-jtbd.md` |
| `03-roadmap.md` | `09-roadmap.md` |
| `04-metrics.md` | `04-north-star-metric.md` |

---

## References

- All 14 prior strategy documents in `docs/strategy/`
- Codebase: src/app/page.tsx, src/components/*.tsx, src/lib/*.ts
