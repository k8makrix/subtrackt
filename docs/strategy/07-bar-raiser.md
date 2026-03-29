# Step 7: Bar Raiser (Challenge Mode)

> Recipe step 7 of 15 | Phase: Strategy | Date: 2026-03-29
> Quality gate reviewing Steps 1-6

---

## Lens 1: Devil's Advocate

### Challenged Assumptions

| # | Assumption | Found in | Evidence quality | Challenge | Recommended action |
|---|-----------|---------|-----------------|-----------|-------------------|
| 1 | **"Freelancers and households are equal-weight segments"** | Step 2 bridge | User decision | **Speculation.** No user research validates this. The product was built for Kate (freelancer). Marcus was added based on the creator's personal experience, not market validation. The two segments have fundamentally different needs (tax features matter to one, not the other). | Validate with 5-10 user interviews per segment. For now, design for Kate first, ensure Marcus isn't excluded. |
| 2 | **"Privacy-first (no bank connection) is a differentiator"** | Steps 2, 3 | Moderate | **Could be a rationalization of a limitation.** 42% of users forget subscriptions; auto-detection solves that. Bobby and TrackMySubs are also manual-entry and are niche players, not market leaders. Privacy may matter to a vocal minority but not the mainstream. | Reframe: privacy-first is the *current reality*, not necessarily the *permanent strategy*. Plan Plaid integration architecturally. |
| 3 | **"The decision workflow is the moat"** | Step 3 | Moderate | **Moat requires switching cost.** The decision workflow is unique, but is it *valued* enough that users won't leave for a tool with bank connection + auto-detection? A moat only works if users stay. No evidence yet that users prefer manual decisions over automated detection. | Test: do users actually complete decisions without prompting? Check the data: what % of subs have stale or null decisions? |
| 4 | **"Conscious Renewal Rate is measurable today"** | Step 4 | Moderate | **Only measurable for the single existing user.** With N=1, this metric is a personal tracking tool, not a product metric. It can't be validated as a North Star until there are multiple users with different behaviors. | Acknowledge N=1 limitation. Use as a design principle, not a validated metric. |
| 5 | **"Landing page is the #1 distribution gap"** | Step 3 | Strong | **Necessary but not sufficient.** A landing page without traffic is just a prettier gate. The real gap is *demand generation*, not just a page. SEO takes months; community sharing requires compelling content. | Landing page is step 1 of distribution, not the solution. Budget effort for content + community alongside the page. |
| 6 | **"TAM of $1.6B for consumer subscription tracking"** | Step 2 | Moderate | **Top-down math may overstate willingness to pay.** The 25% "willingness to use a tracking tool" assumption is generous. Rocket Money's free tier sets a $0 anchor. Most consumers use nothing or their bank app. The real addressable market for a paid tool may be 10x smaller. | The TAM is useful for context but shouldn't drive decisions. Focus on SOM: can we get 1,000 engaged users? |
| 7 | **"Growth model is premature"** | Step 3 bridge | User decision | **Risk: building without a path to users.** If growth model decisions wait until the product is "more complete," the product may never reach users. Many successful products launch incomplete but with a distribution channel. | Reconsider: even a lightweight "build in public" strategy is a growth model. Don't need a formal plan, but need *some* path to users. |

### Bias Check

| Bias | Where it appears | Impact |
|------|-----------------|--------|
| **Builder's bias** | Entire strategy | The strategy is heavily informed by the creator's personal experience (Marcus = themselves, Kate = adjacent). This risks building for N=1 rather than a market. |
| **Survivorship bias** | Competitor analysis | We studied successful competitors. We didn't study the graveyard of failed subscription trackers. Bobby, TrackMySubs, and dozens of others haven't achieved meaningful scale. What killed the ones that died? |
| **Anchoring** | Market sizing | The $1.6B TAM anchors expectations. But most of that market is served by free tools. The realistic opportunity for a bootstrapped product is orders of magnitude smaller. |
| **Confirmation bias** | Differentiation assessment | We confirmed features we already have (decision workflow, tax) as differentiators. But are these *valued* differentiators or *invisible* differentiators that users don't know to look for? |

---

## Lens 2: Benchmark

| Category | Benchmark standard | Subtrackt status | Gap severity |
|----------|-------------------|-----------------|-------------|
| **Table-stakes features** | Subscription list, cost tracking, alerts, search, export | All present | No gap |
| **Onboarding** | Best-in-class: <2 minutes to first value (Monarch, Copilot auto-detect on connect) | No onboarding flow at all | **Critical** |
| **Mobile experience** | Competitors: native iOS/Android apps | No mobile app, untested responsiveness | **High** |
| **Data entry friction** | Competitors: bank auto-detect (Rocket Money, Monarch) or 260+ templates (Bobby) | Manual entry only, no templates, no import | **High** |
| **Time to value** | Competitors: <5 minutes (connect bank, see all subs) | Potentially hours (manually add 30+ subs) | **Critical** |
| **Metrics ambition** | Rocket Money: $2.5B saved across all users. Monarch: AI-powered forecasting. | No aggregate metrics, no AI, single-user product | **Acceptable for stage** |
| **Tax workflow** | No direct competitor has this | Subtrackt leads | **Advantage** |
| **Decision workflow** | No direct competitor has this | Subtrackt leads | **Advantage** |
| **Visual design** | Monarch, Copilot: polished, modern, delightful | Functional dark theme, utilitarian | **Moderate gap** |

### Benchmark verdict

Subtrackt **leads** on decision workflow and tax features but **lags significantly** on onboarding and time-to-value. A new user who signs up today faces a blank screen and must manually type in 30+ subscriptions. That's a dealbreaker for most. The product's unique features are invisible until the user has invested significant time populating data.

---

## Lens 3: Innovation Catalyst

| # | Idea | Gap addressed | Value | Feasibility | Notes |
|---|------|-------------|-------|------------|-------|
| 1 | **"Subscription Receipt Scanner"**: Upload a screenshot of a charge/receipt, AI extracts service name, cost, and date | Time-to-value gap (Lens 2) | High | Medium | Uses vision AI (Claude, GPT-4V). Dramatically reduces data entry. Could be a differentiator vs. even bank-connected tools. |
| 2 | **"Renewal Roulette"**: Gamified decision prompt. Each week, randomly surface one sub in "review" and force a keep/cancel decision in 60 seconds. | Stale review problem (O3) | Medium | High | Simple to build. Turns tedious auditing into a quick game. Could be a signature interaction. |
| 3 | **"The $X Experiment"**: When user cancels a sub, show what else they could buy with that money per year. "$300/yr = a weekend trip, 60 lattes, or 3 months of [competitor service]." | Emotional reward gap (O3, O6) | Medium | High | Reinforces the savings dopamine loop. Makes abstract savings concrete. |
| 4 | **"Subscription DNA"**: Visual fingerprint of your subscription portfolio. Categories as colored segments, cost as segment size. Shareable image. | Shareability gap (O6) | Medium | Medium | Creates organic social sharing. "Here's my subscription DNA." Like Spotify Wrapped for subscriptions. |
| 5 | **"Decision Calendar"**: A calendar view where each day shows which decisions are due, which renewals are coming, and what you decided last time. | Decision timing gap (O1) | High | Medium | Merges the calendar export idea with the decision workflow. Visual way to plan subscription management. |
| 6 | **"Price Memory"**: Track the price at each renewal. Alert when a renewal costs more than last time. | Price change detection gap (Job 1) | High | Low (needs history) | Requires storing historical costs. Simple schema change but needs time to accumulate data. Plant the seed now. |
| 7 | **"Subscription Swap"**: Community-sourced alternatives. "87% of users who cancelled [X] switched to [Y]." | Alternatives discovery (Job 5) | Medium | Low (needs users) | Requires scale to work. But the *concept* of community-sourced intelligence is compelling. |
| 8 | **"Tax Season Mode"**: A seasonal UI mode that transforms the dashboard for tax prep. Hides irrelevant features, surfaces categorization, shows progress toward "100% categorized." | Tax workflow optimization (O7) | Medium | High | Simple UI toggle. Makes the tax experience focused and goal-driven. |
| 9 | **"Auto-Stale Escalation"**: After 30 days in review, auto-change decision to "cancel" with a 7-day grace period and email warning. "We're cancelling X in 7 days unless you tell us to keep it." | Stale review problem (O3) | High | Medium | Bold product decision. Forces action through escalation. Could be controversial. |
| 10 | **"Subscription Score"**: A single number (0-100) that represents how well-managed your subscriptions are. Based on: decision coverage, data completeness, cost awareness, review freshness. | Engagement + gamification | Medium | High | Like a credit score but for subscription hygiene. Creates a goal to improve. |

---

## Lens 4: Recommendations

### Top 3 Assumptions to Validate Before Proceeding

1. **"Users will manually enter 30+ subscriptions"** -- This is the single biggest risk. If time-to-value is too high, nothing else matters. Validate by: watching 3-5 new users attempt onboarding. If >50% abandon before adding 10 subs, invest in import/templates first.

2. **"The decision workflow creates enough value to retain users"** -- The moat is only a moat if users stay. Validate by: checking what % of existing subscriptions have been actively decided (not just defaulted). If >40% are null or stale, the workflow isn't working as designed.

3. **"Freelancers and households both want this product"** -- These segments have different primary needs (tax vs. spend visibility). Validate by: building the landing page with separate messaging tracks and measuring which resonates.

### Top 3 Benchmark Gaps to Close

1. **Onboarding / time-to-value**: This is a blocking gap. New users see a blank screen. Priority: onboarding wizard + pre-populated templates at minimum.

2. **Mobile experience**: Untested on mobile. At minimum, ensure responsive design works. Test on real devices.

3. **Data entry friction**: Manual-only entry is the highest friction point. Innovation idea #1 (receipt scanner) could leapfrog bank-connected tools. Shorter term: CSV import or subscription templates.

### Innovative Ideas Worth Adding to Feature Pool

Ranked by value × feasibility:

1. **Subscription Score** (#10) -- High feasibility, clear engagement driver, could be the hero metric on the landing page
2. **Tax Season Mode** (#8) -- High feasibility, directly serves Job 3, seasonal but high-impact
3. **The $X Experiment** (#3) -- High feasibility, emotional reward, reinforces cancel decisions
4. **Renewal Roulette** (#2) -- High feasibility, gamified decision-making, signature interaction
5. **Receipt Scanner** (#1) -- Medium feasibility, but could be the biggest differentiator if executed well
6. **Decision Calendar** (#5) -- Medium feasibility, visual planning tool, unique in the market

### What to Do Next

The bar raiser reveals that **the strategy is sound but the product has a critical onboarding gap**. The decision workflow and tax features are genuine differentiators, but they're locked behind a high-friction manual entry wall. Q2's most impactful investment is reducing time-to-value, not adding more features for existing users.

Proceed to RICE scoring (Step 8) with these additions to the feature pool:
- All 10 innovation ideas added as candidates
- Onboarding and time-to-value solutions elevated in priority
- Landing page confirmed as critical
- "Build in public" as a lightweight growth strategy to consider alongside feature work

---

## Bridge Decisions (user feedback)

### Challenges accepted as real risks

1. **#1 Equal-weight segments unvalidated**: Freelancers and households need separate validation. Design for Kate first, don't exclude Marcus.
2. **#3 Moat requires validation**: Check actual decision completion rates in production data. If >40% null/stale, the workflow needs UX investment.
3. **#7 No growth path is a risk**: Adopt a lightweight "build in public" approach alongside feature work. Not a formal growth model, but a path to users.

### Challenges noted but not changing strategy

- #2 (privacy as rationalization): Acknowledged. Bank connection is planned eventually.
- #4 (N=1 metric): Acknowledged. NSM is a design principle until multi-user.
- #5 (landing page is necessary not sufficient): Accepted. Content + community planned alongside.
- #6 (TAM overstated): Accepted. Focus on SOM (1,000 engaged users), not TAM.

### Innovations entering feature pool (for RICE scoring)

- Subscription Score (high priority)
- Tax Season Mode (high priority)
- The $X Experiment (medium priority)
- Receipt Scanner (medium priority, higher effort)

### Onboarding gap

Onboarding is important but not the singular #1 priority. It competes with landing page, decision loop improvements, and other Q2 objectives. Will be scored via RICE alongside everything else.

---

## References

- Steps 1-6 artifacts reviewed in full
- Competitive benchmarks from Step 3
- Opportunity tree from Step 6
- NSM and OKRs from Steps 4-5
