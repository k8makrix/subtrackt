# Step 1: Personas + Jobs-to-Be-Done

> Recipe step 1 of 15 | Phase: Foundation | Date: 2026-03-28

---

## Personas

### Persona 1: Kate (Primary)

**The Overwhelmed Solopreneur**

| Attribute | Details |
|-----------|---------|
| Role | Freelancer / solopreneur, files 1099 taxes |
| Age range | 30-45 |
| Subscriptions | 30-50 across personal and business use |
| Payment methods | Multiple credit cards, PayPal, direct debit |
| Tech comfort | High: uses SaaS tools daily, comfortable with web apps |
| Income | $80k-$150k variable (freelance) |

**Goals:**
- Know exactly what she's paying for and when charges hit
- Maximize legitimate business deductions at tax time
- Stop paying for things she forgot she signed up for
- Feel financially organized despite chaotic freelance income

**Frustrations:**
- Surprise charges from forgotten trials and auto-renewals
- Tax season scramble to figure out which subscriptions are deductible
- "Dark pattern" cancellation flows that make it hard to leave (e.g. Zeroqode)
- Subscription costs that creep up without notice (e.g. Lovable Labs $200/mo when a free tier exists)
- No single place to see all subscriptions across all payment methods

**Behaviors:**
- Signs up for lots of tools to "try them out," forgets to cancel
- Uses Lenny's Product Pass for bundled tools (21 subscriptions at $0)
- Checks bank statements reactively, not proactively
- Categorizes expenses in bulk at tax time rather than continuously
- Makes keep/cancel/review decisions when prompted, not spontaneously

**Quote:** "I just want to know what's renewing before it charges, and I want tax time to take 5 minutes, not 5 hours."

---

### Persona 2: Marcus (Secondary)

**The Budget-Conscious Household Manager**

| Attribute | Details |
|-----------|---------|
| Role | Dual-income household, manages family finances |
| Age range | 28-40 |
| Subscriptions | 15-25 across streaming, utilities, fitness, kids' apps |
| Payment methods | Joint credit card, personal cards |
| Tech comfort | Moderate: uses apps but prefers simple interfaces |
| Income | $100k-$180k household |

**Goals:**
- Track family subscription spend without spreadsheets
- Identify subscriptions nobody in the family actually uses
- Avoid paying for overlapping services (e.g. multiple streaming bundles)
- Stay within a monthly entertainment/software budget

**Frustrations:**
- Partner signs up for things without telling him
- Kids' app subscriptions that auto-renew after the novelty wears off
- No visibility into total household subscription burden
- Cancelling one service means finding and logging into an account he barely remembers

**Behaviors:**
- Does a "subscription audit" every few months when the credit card bill feels too high
- Uses spreadsheets or mental math to track recurring costs
- Compares streaming services seasonally (cancel one, add another)
- Rarely thinks about tax deductions for personal subscriptions

**Quote:** "I know we're paying too much for stuff nobody uses, but I don't even know where to start."

---

### Persona 3: Priya (Tertiary)

**The Small Business Operator**

| Attribute | Details |
|-----------|---------|
| Role | Small business owner (5-15 employees), manages SaaS stack |
| Age range | 35-50 |
| Subscriptions | 40-80 business SaaS tools (some per-seat) |
| Payment methods | Corporate card, expense accounts |
| Tech comfort | High: evaluates and procures software regularly |
| Income | Business revenue $500k-$2M |

**Goals:**
- Control SaaS sprawl as the team grows
- Track per-seat costs and identify underutilized licenses
- Ensure all software expenses are properly categorized for the accountant
- Plan for annual renewals that hit the budget hard (e.g. $384/yr Miro)

**Frustrations:**
- Employees sign up for tools on personal cards and expense them
- Annual renewals arrive as surprises because nobody tracks the dates
- Overlapping tools across teams (three different design tools, two project managers)
- Can't easily answer "what's our total SaaS spend?" for the board

**Behaviors:**
- Reviews SaaS spend quarterly, typically triggered by a large unexpected charge
- Negotiates enterprise pricing when per-seat costs exceed thresholds
- Delegates cancellation but doesn't verify it happened
- Needs shareable reports for partners or board

**Quote:** "Every quarter I find another tool we're paying for that two people use and fifteen have forgotten about."

---

## Jobs-to-Be-Done

### Job 1 (Primary): "Help me not get surprised by charges"

*Renewal awareness, pre-charge action, financial predictability*

| Dimension | Details |
|-----------|---------|
| **Functional** | Alert me before charges hit. Show what renews when. Let me act (cancel, downgrade, approve) before money leaves my account. |
| **Emotional** | Feel in control of my financial commitments, not ambushed by my own subscriptions |
| **Social** | Be the person who manages money intentionally, not the one who "forgot to cancel that trial" |
| **Frequency** | Continuous: renewals happen weekly/monthly across a portfolio |
| **Current state** | **Served.** Subtrackt now has urgency-coded renewal dates, email/Slack notifications at 7/3/0 days, calendar .ics export, and stale review reminders. The "pull-based only" gap identified in V1 analysis is closed. |

**Remaining gaps:**
- No mobile push notifications (email only)
- No pre-renewal decision prompts ("Figma renews in 3 days, still keeping it?")
- No price change detection ("This renewal is $20 more than last time")
- No integration with bank/card to verify charges actually posted

**Personas served:** Kate (primary), Marcus, Priya

---

### Job 2 (Supporting): "Help me understand and reduce my total spend"

*Spend visibility, cancellation support, savings tracking*

| Dimension | Details |
|-----------|---------|
| **Functional** | Show total spend across all subscriptions. Identify waste. Track savings from cancellations. Surface overlapping services. |
| **Emotional** | Feel financially responsible. Get a dopamine hit from cutting waste. |
| **Social** | Demonstrate fiscal discipline to partners, spouses, or board members |
| **Frequency** | Periodic: monthly check-ins, triggered by bill shock or budget reviews |
| **Current state** | **Partially served.** Dashboard shows total annualized spend, monthly/annual breakdown, and money saved from cancellations ($2,974/yr). Keep/cancel/review decision workflow exists. Sort and filter controls help slice the data. |

**Remaining gaps:**
- No spend trends over time ("Is my total going up or down?")
- No overlap/duplicate detection ("You have 3 design tools")
- No cancellation assistance (cancel URLs exist in schema but aren't surfaced prominently)
- No budget or spend target to measure against
- No shared/family view for household spend visibility

**Personas served:** Marcus (primary), Kate, Priya

---

### Job 3 (Supporting): "Help me get my tax deductions right"

*Expense categorization, deduction tracking, export for filing*

| Dimension | Details |
|-----------|---------|
| **Functional** | Categorize subscriptions by tax deductibility. Track business vs. personal. Export clean, formatted data for an accountant or tax software. |
| **Emotional** | Feel prepared and confident at tax time, not scrambling |
| **Social** | Appear organized to the accountant. Maximize legitimate deductions without anxiety. |
| **Frequency** | Seasonal: primarily Jan-Apr, with periodic categorization throughout the year |
| **Current state** | **Well served.** Tax category and expense type per subscription, Tax & Expenses tab with year filter, CSV export, PDF tax report generation, deductible vs. personal breakdown. |

**Remaining gaps:**
- No mixed-use percentage (e.g. 60% business, 40% personal)
- No smart category suggestions based on service name
- No direct tax software integration (TurboTax, FreshBooks)
- No accountant sharing / read-only view
- No year-over-year comparison

**Personas served:** Kate (primary), Priya

---

### Job 4 (Emerging): "Help me manage my team's software stack"

*SaaS inventory, license utilization, procurement visibility*

| Dimension | Details |
|-----------|---------|
| **Functional** | Track all SaaS tools across the organization. Know per-seat costs. Identify shelfware. Plan for renewal budgets. |
| **Emotional** | Feel confident that software spend is intentional and controlled |
| **Social** | Demonstrate operational efficiency to leadership or investors |
| **Frequency** | Quarterly reviews, plus ad-hoc when new tools are requested |
| **Current state** | **Not served.** Subtrackt is single-user. No team/org features, no per-seat tracking, no shared dashboards. |

**Remaining gaps (all):**
- Multi-user access with roles
- Per-seat cost tracking and license counts
- Team-level dashboards and reports
- Vendor management (contract dates, negotiation notes)
- Approval workflows for new subscriptions

**Personas served:** Priya (primary)

---

### Job 5 (Latent): "Help me discover better or cheaper alternatives"

*Price benchmarking, alternative discovery, negotiation leverage*

| Dimension | Details |
|-----------|---------|
| **Functional** | Tell me if I'm overpaying. Suggest cheaper alternatives. Give me leverage to negotiate renewals. |
| **Emotional** | Feel smart about software choices, not like a passive consumer |
| **Social** | Share savings wins ("I switched from X to Y and saved $200/yr") |
| **Frequency** | At renewal decision points and during periodic audits |
| **Current state** | **Not served.** No price data, no alternatives database, no benchmarking. |

**Remaining gaps (all):**
- Price comparison data
- Alternative suggestion engine
- Community-sourced pricing intelligence
- Negotiation templates or scripts

**Personas served:** Kate, Marcus, Priya

---

## Job Hierarchy

```
PRIMARY: "Help me not get surprised by charges" (Job 1)
  │
  ├── SUPPORTING: "Help me understand and reduce my total spend" (Job 2)
  │   Activation: Renewal awareness → "Wait, how much am I paying total?" → Spend visibility
  │   Status: Partially served (dashboard + money saved), gaps in trends and overlap detection
  │
  ├── SUPPORTING: "Help me get my tax deductions right" (Job 3)
  │   Activation: Subscription inventory → categorize → tax-time payoff
  │   Status: Well served (tax tab, PDF export, year filter). Retention superpower.
  │
  ├── EMERGING: "Help me manage my team's software stack" (Job 4)
  │   Activation: Personal use → "I wish I had this for work" → team features
  │   Status: Not served. Requires multi-user architecture. Big investment, big TAM.
  │
  └── LATENT: "Help me discover better alternatives" (Job 5)
      Activation: Cancel decision → "Is there something cheaper?" → discovery
      Status: Not served. Data-intensive. Could be community-powered.
```

---

## Job-Persona Mapping

| Job | Kate | Marcus | Priya |
|-----|------|--------|-------|
| 1. Not get surprised | **Primary** (30-50 subs, freelance income) | High (household budget) | High (annual SaaS renewals) |
| 2. Understand/reduce spend | High (variable income) | **Primary** (household optimizer) | High (SaaS sprawl) |
| 3. Tax deductions | **Primary** (1099 filer) | Low (W-2, standard deduction) | High (business expenses) |
| 4. Team software stack | Low (solo) | N/A | **Primary** (5-15 employees) |
| 5. Discover alternatives | Medium | Medium | High (procurement decisions) |

---

## What Changed from V1 Analysis

| Aspect | V1 (2026-03-21) | V2 (2026-03-28) |
|--------|-----------------|-----------------|
| Personas | 1 (Kate only) | 3 (Kate, Marcus, Priya) |
| Jobs | 3 (surprise, taxes, save money) | 5 (+team management, +alternatives discovery) |
| Job 1 status | "Biggest gap: no push notifications" | Push notifications shipped. Gaps now in mobile, price detection, bank verification. |
| Job 2 status | "Not built" | Partially built (money saved, sort/filter). Gaps in trends, overlap detection. |
| Job 3 status | "CSV only" | Well served (PDF, year filter, tax tab). Gaps in mixed-use %, smart suggestions. |
| Primary job | Job A unchanged | Job 1 still primary, but the gap has shifted from "build basic awareness" to "deepen and extend awareness" |

---

## References

- Production data: 69 subscriptions (23 active/keep, 15 active/review, 3 active/cancel, 8 canceled, 21 lenny-pass)
- Financial snapshot: $11,431/yr keep, $4,347/yr review, $1,356/yr cancel, $2,974/yr saved
- Shipped features informing status: email/Slack notifications, calendar export, stale reminders, money saved counter, tax PDF, sort/filter
