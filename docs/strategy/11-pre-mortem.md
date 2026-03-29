# Step 11: Pre-Mortem

> Recipe step 11 of 15 | Phase: Validate | Date: 2026-03-29

---

## Premise

It is September 2026. Six months have passed since the roadmap was set. Subtrackt has failed to gain traction. What went wrong?

---

## Risk Register

### Market Risks

| # | Risk | Likelihood | Impact | L × I | Evidence | Mitigation |
|---|------|-----------|--------|-------|----------|-----------|
| M1 | **Bank-native tools eliminate the need for Subtrackt** | Medium | High | **High** | Chase, Capital One already surface recurring charges. Feature parity increasing. | Differentiate on decision workflow + tax features, which banks won't build. Monitor bank feature releases quarterly. |
| M2 | **Subscription fatigue peaks and users just cancel everything** | Low | Medium | **Low** | 32% cut subs in 2025. But this actually increases demand for tracking tools. | Position Subtrackt as the tool that helps you cancel intelligently, not just cancel. |
| M3 | **No one pays for a subscription to manage subscriptions** | High | Medium | **High** | Irony is real. Bobby is $1.99 one-time. Rocket Money free tier is dominant. | Defer monetization. Focus on value delivery. If/when monetizing, one-time or usage-based pricing may work better than subscription. |
| M4 | **Freelancer and household segments don't overlap** | Medium | Medium | **Medium** | Bar raiser flagged this. No validation that both segments want the same product. | Design for Kate first. Validate Marcus separately. Don't try to serve both with conflicting features. |

### Technical Risks

| # | Risk | Likelihood | Impact | L × I | Evidence | Mitigation |
|---|------|-----------|--------|-------|----------|-----------|
| T1 | **Manual data entry kills adoption** | High | High | **Critical** | Bar raiser's top finding. No import, no templates, no auto-detect. 30+ subs = hours of manual work. | Templates in NOW Sprint 2. CSV import in NEXT. Receipt scanner in LATER. Each reduces friction incrementally. |
| T2 | **Single-user architecture limits growth** | Medium | High | **High** | page.tsx queries all subs without user_id filter (though API routes do filter). No multi-user testing. | page.tsx already uses `WHERE user_id = ${session.user.id}` in API routes. But page.tsx server component queries ALL subs. Fix: add auth to server component query. |
| T3 | **No analytics means flying blind** | High | Medium | **High** | No PostHog, no Mixpanel, no event tracking. Can't measure NSM, can't validate assumptions. | Phase 1 instrumentation (SQL queries) can start immediately. Defer full analytics platform to Phase 3. |
| T4 | **Neon serverless cold starts degrade UX** | Low | Medium | **Low** | Serverless DB can have latency spikes. `force-dynamic` on page.tsx means every load hits DB. | Monitor latency. Consider caching or ISR if latency becomes an issue. |
| T5 | **No test coverage means regressions on every change** | Medium | Medium | **Medium** | Zero test files in codebase. Every feature change risks breaking existing features. | Add tests for critical paths: auth, subscription CRUD, notification cron. Don't need 100% coverage. |

### UX Risks

| # | Risk | Likelihood | Impact | L × I | Evidence | Mitigation |
|---|------|-----------|--------|-------|----------|-----------|
| U1 | **Onboarding cliff: users sign up and leave** | High | High | **Critical** | UX audit: no empty state, no guidance, blank screen after sign-in. | Onboarding wizard (NEXT). But even before that: helpful empty state with "Get started" prompts (small effort, high impact). |
| U2 | **Decision workflow goes unused** | Medium | High | **High** | Bar raiser: moat only works if users actually complete decisions. Unknown % with null decisions. | Undecided badge (NOW), default decision on add (NOW), time-decay urgency (NOW). Measure decision fill rate. |
| U3 | **Mobile experience is broken** | Medium | Medium | **Medium** | Not tested. Components use fixed-width patterns (max-w-6xl). Expanded row with multiple dropdowns likely overflows. | Mobile-responsive audit (NEXT). Quick fix: test on 375px viewport and fix critical breaks. |

### Operational Risks

| # | Risk | Likelihood | Impact | L × I | Evidence | Mitigation |
|---|------|-----------|--------|-------|----------|-----------|
| P1 | **Solo developer burnout** | Medium | High | **High** | Entire product depends on one person. 32 features identified across NOW/NEXT/LATER. | Scope ruthlessly. Sprint 1 (7 features, 2 wks) is realistic. Don't overcommit. Ship small, ship often. |
| P2 | **No user feedback loop** | High | Medium | **High** | N=1 user (creator). No way for external users to report issues or request features. | Add a feedback mechanism (simple mailto link or GitHub Issues). Build in public to attract early users. |
| P3 | **Secrets and security gaps** | Medium | High | **High** | SECURITY.md exists but manual rotation hasn't happened. BETTER_AUTH_SECRET may still be initial value. | Rotate secrets per SECURITY.md. Add environment variable validation on startup. |

---

## Assumption Log

| # | Assumption | Evidence quality | Validation plan |
|---|-----------|-----------------|-----------------|
| A1 | Users will manually enter 30+ subscriptions | **Speculation** | Watch 3-5 new users attempt onboarding. Measure drop-off point. |
| A2 | The decision workflow (keep/cancel/review) creates enough value to retain users | **Moderate** (working for N=1) | Measure decision fill rate in production. If >40% null after 30 days, invest in prompting. |
| A3 | Freelancers value tax categorization per subscription | **Moderate** (Kate persona is the creator) | Interview 5 freelancers about tax-time subscription workflows. |
| A4 | A landing page will drive organic sign-ups | **Weak** | Landing page is necessary but not sufficient. Measure sign-up rate. If <1% conversion after 30 days, invest in content/SEO. |
| A5 | Privacy-first (no bank connection) is valued by target users | **Weak** | Analyze competitor reviews for privacy complaints. Survey potential users. |
| A6 | Subscription Score will drive engagement | **Speculation** | Build it, measure return visits. If score doesn't drive weekly check-ins, reassess. |
| A7 | Conscious Renewal Rate is the right NSM | **Moderate** (logical but N=1) | Track for 3 months with multiple users. If not predictive of retention, pivot metric. |

---

## Top 5 Risks by L × I

1. **T1: Manual data entry kills adoption** -- Critical. The #1 existential risk.
2. **U1: Onboarding cliff** -- Critical. Related to T1 but broader (even with import, need guidance).
3. **M3: Nobody pays for sub tracking** -- High. Affects long-term viability if monetization is a goal.
4. **T2: Single-user architecture** -- High. Blocks growth beyond the creator.
5. **P1: Solo developer burnout** -- High. Scope management is essential.

---

## References

- Bar raiser assumptions: Step 7
- UX audit findings: Step 10
- Architecture: CLAUDE.md, page.tsx, auth-guard.ts
- Roadmap: Step 9
