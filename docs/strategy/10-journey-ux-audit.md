# Step 10: Journey Map + UX Audit

> Recipe step 10 of 15 | Phase: Validate | Date: 2026-03-29

---

## Updated Journey Map

### Stage 1: Discovery

**What happens:** User hears about Subtrackt or finds it while searching for subscription tracking tools.

| Dimension | Current state | Gap |
|-----------|-------------|-----|
| Touchpoints | None. No landing page, no SEO, no social presence. | **Critical.** No path to discovery exists. |
| Emotions | N/A | N/A |
| Actions | Cannot preview the product without signing in | Blank wall for visitors |

**Roadmap items addressing:** S4.1 (landing page), Subscription Score as hero metric

---

### Stage 2: Onboarding

**What happens:** User signs in with Google OAuth and sees the dashboard for the first time.

| Dimension | Current state | Gap |
|-----------|-------------|-----|
| Touchpoints | Google sign-in button, empty dashboard | **Critical.** No guidance, no templates, no import. |
| Emotions | Confusion ("What do I do now?"), overwhelm ("I have to add 30 subs manually?") | High friction, high drop-off risk |
| Actions | Must manually add each subscription one at a time via the + button | No bulk add, no CSV import, no templates |
| Time to value | Potentially hours for 30+ subscriptions | Competitors: <5 minutes with bank connection |

**Roadmap items addressing:** S5.1 (onboarding wizard), S5.2 (templates), S5.3 (CSV import), BR4 (receipt scanner)

---

### Stage 3: Inventory Building

**What happens:** User adds subscriptions, fills in costs, renewal dates, and categories.

| Dimension | Current state | Gap |
|-----------|-------------|-----|
| Touchpoints | AddSubscriptionModal, SubscriptionRow inline editing | Functional but tedious for bulk entry |
| Emotions | Tedium (per-sub entry), then growing satisfaction (seeing totals) | Dopamine hit when annualized total appears |
| Actions | Add sub -> expand row -> fill details -> repeat | No "add another" flow, no smart defaults |
| Pain points | No decision is required on add (defaults to null). Many fields optional with no nudge to complete. | Leads to incomplete data and null decisions |

**Roadmap items addressing:** S2.1 (default decision on add), S2.3 (undecided badge)

---

### Stage 4: Triage & Decision-Making

**What happens:** User reviews subscriptions and sets keep/cancel/review decisions.

| Dimension | Current state | Gap |
|-----------|-------------|-----|
| Touchpoints | Dashboard tab (metrics, urgent renewals), All Subs tab (sort, filter, search) | Functional and well-designed |
| Emotions | Empowerment, occasional regret ("$200/mo for Lovable Labs?!") | Money saved counter provides positive reinforcement |
| Actions | Expand row -> change decision dropdown -> auto-saves | Works well. Stale reminders catch abandoned reviews. |
| Pain points | Decision dropdown is small and easy to miss in the expanded row. No visual distinction between subs with vs. without decisions. | Missing "undecided" prominence |

**Roadmap items addressing:** S2.3 (undecided badge), S3.2 (time-decay urgency), S3.4 (cost of indecision)

---

### Stage 5: Renewal Awareness (Ongoing)

**What happens:** User receives renewal alerts and takes action.

| Dimension | Current state | Gap |
|-----------|-------------|-----|
| Touchpoints | Email alerts (7/3/0 days), Slack webhooks, dashboard urgency colors, calendar .ics | **Well served.** V1's biggest gap is now closed. |
| Emotions | Confidence when caught early, relief when acting before charge | Positive loop when notifications work |
| Actions | Receive email -> open app -> review sub -> confirm/change decision | No in-email decision action (must visit app) |
| Pain points | Email doesn't include decision prompt. No mobile push. No price change detection. | Prompts would close the loop faster |

**Roadmap items addressing:** S1.1 (pre-renewal decision prompts), S6.2 (price change detection, LATER)

---

### Stage 6: Tax Preparation (Seasonal)

**What happens:** Tax season arrives. User categorizes subs, reviews deductions, exports data.

| Dimension | Current state | Gap |
|-----------|-------------|-----|
| Touchpoints | Tax & Expenses tab, expense type/tax category dropdowns, PDF/CSV export, year filter | **Well served.** Strong differentiator. |
| Emotions | Confidence if categorized throughout the year, mild tedium for bulk categorization | Satisfaction when export is ready in minutes |
| Actions | Set expense type per sub -> set tax category -> export PDF/CSV | Per-sub categorization is tedious for 30+ subs |
| Pain points | No bulk categorization. No mixed-use %. No smart suggestions. | Tedium at scale |

**Roadmap items addressing:** S7.2 (bulk categorization), S7.3 (mixed-use %), BR2 (Tax Season Mode)

---

### Stage 7: Retention & Expansion

**What happens:** User has been using Subtrackt for months. Switching cost increases.

| Dimension | Current state | Gap |
|-----------|-------------|-----|
| Touchpoints | Dashboard metrics, money saved counter, notes history | Passive retention through accumulated data |
| Emotions | Ownership ("this is MY subscription data"), pride in savings | Low engagement between tax seasons for non-power users |
| Actions | Periodic check-ins, respond to email alerts, add new subs | No spend trends to draw users back |
| Pain points | No trends over time. No Subscription Score to gamify. No shareable results. | Missing engagement hooks |

**Roadmap items addressing:** S6.1 (spend trends), BR1 (Subscription Score), S6.4 (shareable report)

---

## Experience Highs and Lows

```
HIGH ●                    ●               ●                          ●
     │                    │               │                          │
     │    ●               │               │                          │
     │    │               │   ●           │                          │
MED  │    │               │   │           │              ●           │
     │    │               │   │     ●     │              │     ●     │
     │    │               │   │     │     │              │     │     │
LOW  │    │               │   │     │     │              │     │     │
     ●    │               │   │     │     │              │     │     │
     │    │               │   │     │     │              │     │     │
     ─────┼───────────────┼───┼─────┼─────┼──────────────┼─────┼─────┤
     Disc  Onboard        Inv  Tri  Renew  Tax           Retain
     overy                ory  age  al     Prep          ion

     ●=Current  Disc=Critical gap  Onboard=Critical gap  Rest=Functional
```

---

## UX Audit: Nielsen's 10 Heuristics

| # | Heuristic | Score | Issues found |
|---|----------|-------|-------------|
| 1 | **Visibility of system status** | 6/10 | Save state indicator exists ("saving"/"saved") but is subtle. No loading states on initial page load. No progress indicator for data completeness. |
| 2 | **Match between system and real world** | 8/10 | Good. "Keep/cancel/review" language is natural. Urgency colors (red/amber/green) are intuitive. Currency formatting is clear. |
| 3 | **User control and freedom** | 7/10 | Can undo cancel (change decision back). But no confirmation on destructive actions. No bulk undo. |
| 4 | **Consistency and standards** | 7/10 | Consistent dark theme and amber accents. But tab behavior varies: Dashboard shows summary cards, All Subs shows a list, Tax shows a different layout. Filter/sort only on All Subs tab. |
| 5 | **Error prevention** | 6/10 | Zod validation on API. But AddSubscriptionModal allows empty cost/date submission with no warning about impact. No duplicate detection on add. |
| 6 | **Recognition rather than recall** | 7/10 | Good. Metrics are always visible. But decision status per sub isn't visible from the list view without expanding. |
| 7 | **Flexibility and efficiency** | 6/10 | No keyboard shortcuts. No bulk operations. No "add another" flow. Power users must click through modals for each sub. |
| 8 | **Aesthetic and minimalist design** | 8/10 | Clean dark theme. Good information density. Amber accent is distinctive. Some visual clutter in expanded row with many dropdowns. |
| 9 | **Help users recognize, diagnose, recover from errors** | 5/10 | API errors shown as raw JSON in some cases. No contextual help or guidance. No empty states with helpful prompts. |
| 10 | **Help and documentation** | 3/10 | No help text, tooltips, onboarding guide, or documentation. User must figure out the app through exploration. |

**Overall UX score: 6.3/10** -- Functional but rough edges. Strong on visual design and domain language, weak on onboarding, help, and efficiency.

---

## Accessibility Check

| Area | Status | Issue |
|------|--------|-------|
| Color contrast | Partial pass | Amber (#fbbf24) on gray-950 passes WCAG AA for large text but may fail for small text. Gray-500 text on gray-950 fails AA. |
| Keyboard navigation | Not tested | No visible focus indicators in custom components. Tab order likely follows DOM but not verified. |
| Screen reader | Not tested | Interactive elements use native HTML (buttons, selects). But expandable rows use click handlers on divs, not buttons. |
| Motion/animation | Pass | No animations that could cause motion sickness. |
| Touch targets | Unknown | No mobile testing. Buttons and dropdowns may be too small on touch screens. |

**Accessibility verdict:** Likely fails WCAG AA. Key fixes needed: color contrast for gray-500 text, focus indicators, semantic HTML for expandable rows.

---

## UX Issues List (prioritized)

| # | Issue | Severity | Heuristic | Fix |
|---|-------|----------|-----------|-----|
| 1 | **No onboarding or empty state** | Critical | H10 | Onboarding wizard + helpful empty state |
| 2 | **Metadata still says "Create Next App"** | High | H2 | Update layout.tsx title and description |
| 3 | **Decision status not visible in list view** | High | H6 | Show keep/cancel/review badge on collapsed row |
| 4 | **No help text or tooltips** | High | H10 | Add contextual help for tax categories, expense types |
| 5 | **Gray-500 text fails contrast** | High | Accessibility | Use gray-400 minimum for body text |
| 6 | **Expanded row click target is a div** | Medium | Accessibility | Use button or details/summary element |
| 7 | **No loading state on page load** | Medium | H1 | Skeleton or spinner while subs load |
| 8 | **Raw JSON error messages** | Medium | H9 | User-friendly error messages |
| 9 | **No duplicate detection on add** | Medium | H5 | Warn if service_name already exists |
| 10 | **No keyboard shortcuts** | Low | H7 | Add key bindings for common actions |
| 11 | **No "add another" flow** | Low | H7 | Keep modal open with reset after add |

---

## Top 3 Experience Gaps That Change Roadmap Priorities

1. **Discovery is a dead end.** No landing page = no new users. Already #1 on roadmap. Confirmed.
2. **Onboarding is a cliff.** Blank screen after sign-in. Already in roadmap (Sprint 2 + NEXT). Confirmed as important but not singular #1.
3. **Decision visibility is hidden.** Users can't see which subs have decisions without expanding each row. This is a quick fix (show badge on collapsed row) not currently on the roadmap. **Recommend adding to Sprint 1.**

---

## References

- Codebase reviewed: Dashboard.tsx, SubscriptionRow.tsx, AddSubscriptionModal.tsx, page.tsx, layout.tsx
- V1 journey map: docs/strategy/01-journey-map.md (now superseded by Step 1 personas)
- Roadmap: Step 9
