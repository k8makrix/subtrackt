# Step 2: Market Sizing + Segments

> Recipe step 2 of 15 | Phase: Foundation | Date: 2026-03-28

---

## Market Context

The subscription economy is valued at approximately **$536 billion globally** (2025) and is projected to reach **$859 billion by 2026**. Between 2012 and 2022, it grew by more than 435%. This growth creates an ever-expanding problem: people and businesses have more subscriptions than they can track, and they're spending more than they realize.

### The Pain in Numbers

| Statistic | Source |
|-----------|--------|
| Average household spends **$219/month** on subscriptions | C+R Research |
| 89% of consumers **underestimate** their subscription spending by 2.5x | Industry aggregate |
| 42% have **forgotten** about a subscription while still being charged | Consumer surveys |
| Average person wastes **$127/year** on unused subscriptions | 2025 aggregate data |
| 65% forgot to cancel a trial before being billed | Consumer surveys |
| 41% of consumers report **subscription fatigue** | 2025 surveys |
| Consumers cut subscriptions from 4.1 to 2.8 in 2024-2025 (32% drop) | Self Financial |

---

## TAM (Total Addressable Market)

### Top-Down: Personal Finance Software Market

The U.S. personal finance software market was valued at **$300.42 million in 2025**, projected to reach $513 million by 2035 (5.5% CAGR). Subscription tracking is an emerging segment within this.

The broader subscription billing/management market (B2B + B2C) was valued at **$8.5-10.9 billion in 2025**, projected to reach $30-39 billion by mid-2030s at ~16% CAGR. However, most of this is B2B billing infrastructure (Zuora, Recurly, Chargebee), not consumer-facing tracking.

### Bottom-Up: Consumer Subscription Tracking

```
U.S. households:                                    ~130 million
× Households with 3+ subscriptions:                 ~78% = 101 million
× Willingness to use a tracking tool:               ~25% = 25.3 million
× Average willingness to pay for tracking:           $3-5/month

TAM (U.S. consumer subscription tracking) = 25.3M × $48/yr = ~$1.2 billion/year
```

### Bottom-Up: Freelancer/Self-Employed Segment

```
U.S. self-employed professionals:                    ~9.82 million
× Have 10+ software subscriptions:                  ~60% = 5.9 million
× Need tax categorization for subscriptions:        ~80% = 4.7 million
× Willingness to pay for tracking + tax features:   $5-10/month

TAM (U.S. freelancer sub tracking) = 4.7M × $84/yr = ~$395 million/year
```

**Combined TAM (U.S.): ~$1.6 billion/year**

---

## SAM (Serviceable Addressable Market)

Subtrackt's SAM narrows to English-speaking users who:
- Self-manage subscriptions (no bank connection required)
- Are freelancers, solopreneurs, or budget-conscious households
- Value privacy (manual entry vs. Plaid-connected)
- Need tax deduction tracking (freelancers) or spending visibility (households)

```
U.S. freelancers/solopreneurs who self-manage:       ~5.9 million
+ Budget-conscious households (active trackers):     ~8 million
= Addressable population:                           ~14 million

× Reachable via free/freemium web app:              ~40% = 5.6 million
× Conversion to any paid tier:                      ~5% = 280,000

SAM = 280K × $60/yr (blended ARPU) = ~$16.8 million/year
```

[REVIEW: SAM assumes a paid tier that doesn't exist yet. Current product is free. SAM calculation shows the revenue ceiling if monetization is introduced.]

---

## SOM (Serviceable Obtainable Market)

For a bootstrapped/solo product in year 1-2, realistic obtainable market:

```
Organic/PLG users in first 2 years:                  ~2,000-5,000
× Paid conversion (if monetized):                   ~5% = 100-250

SOM (Year 2) = 100-250 users × $60/yr = $6,000-$15,000/year
```

If remaining free (ad-free, no monetization):
```
SOM = user growth as a portfolio/credibility asset
     Value = demonstration of product + engineering skills
     + potential acqui-hire or portfolio showcase value
```

[REVIEW: SOM is highly dependent on whether Subtrackt pursues monetization. As a side project/portfolio piece, the "market" is reputational rather than financial.]

---

## Market Segments

### Segment 1: Overwhelmed Freelancers (Primary)

| Attribute | Details |
|-----------|---------|
| Size | ~5.9 million in U.S. |
| Spending on subs | $50-350/month ($600-$4,200/yr) on software |
| Pain intensity | High: tax implications + surprise charges + tool sprawl |
| Current solutions | Spreadsheets, YNAB tags, Rocket Money (poor fit for business subs) |
| Willingness to pay | Medium-high: already pay for accounting tools ($13-60/month) |
| Subtrackt fit | **Strong**: tax categorization, renewal tracking, decision workflow |

### Segment 2: Budget-Conscious Households (Secondary)

| Attribute | Details |
|-----------|---------|
| Size | ~8 million active budget trackers in U.S. |
| Spending on subs | $90-219/month across streaming, fitness, delivery, etc. |
| Pain intensity | Medium: subscription fatigue, duplicate services, forgotten trials |
| Current solutions | Rocket Money (free tier), bank app alerts, spreadsheets |
| Willingness to pay | Low: many free alternatives exist |
| Subtrackt fit | **Moderate**: good for tracking, but no bank connection is friction |

### Segment 3: Content Creators (Adjacent)

| Attribute | Details |
|-----------|---------|
| Size | ~2 million full-time creators in U.S. |
| Spending on subs | $100-500/month on tools (editing, hosting, analytics, music licensing) |
| Pain intensity | High: high tool churn, mix personal/business on one card |
| Current solutions | Spreadsheets, ad-hoc tracking |
| Willingness to pay | Medium: budget-sensitive but value time-saving tools |
| Subtrackt fit | **Strong**: same needs as freelancers, plus high tool turnover |

### Segment 4: Small Business Operators (Aspirational)

| Attribute | Details |
|-----------|---------|
| Size | ~6 million small businesses (1-50 employees) in U.S. |
| Spending on subs | $4,830-9,100/employee/year on SaaS |
| Pain intensity | Very high: SaaS sprawl, 35% of licenses unused |
| Current solutions | Zylo, Productiv, Torii (enterprise), spreadsheets (SMB) |
| Willingness to pay | High: SaaS management is a line item |
| Subtrackt fit | **Weak today**: needs multi-user, per-seat tracking, approval workflows |

### Segment 5: Agency Owners (Adjacent)

| Attribute | Details |
|-----------|---------|
| Size | ~500,000 digital/creative agencies in U.S. |
| Spending on subs | $200-1,000/month on tools, plus per-client tools |
| Pain intensity | High: managing client tool stacks + internal tools |
| Current solutions | Spreadsheets, accounting software |
| Willingness to pay | High: time = money, need clean expense tracking |
| Subtrackt fit | **Moderate**: needs per-client cost allocation features |

---

## Growth Trajectory & Tailwinds

### Tailwinds (market forces working in Subtrackt's favor)

1. **Subscription fatigue is peaking**: 41% report fatigue, 32% cut subscriptions in 2025. People actively want tools to help manage this.
2. **SaaS price inflation**: Average 8-15% price increases per year. Makes tracking more valuable as costs rise.
3. **Freelance economy growth**: 1.5 billion freelancers globally, 9.82M self-employed in U.S. All need tax-deductible expense tracking.
4. **Privacy awareness**: Growing resistance to bank-connected apps (Plaid). Manual-entry tools gain trust.
5. **AI integration expectations**: Users expect smart categorization, pattern detection, and proactive alerts.

### Headwinds (market forces working against)

1. **Bank apps adding tracking**: Chase, Capital One, and others now surface recurring charges natively.
2. **Free alternatives dominate**: Rocket Money free tier, bank apps, spreadsheets set a $0 price expectation.
3. **Market consolidation**: Trim acquired by OneMain Financial, Mint shut down. Smaller players struggle to survive independently.
4. **Subscription to track subscriptions irony**: Users resist paying a subscription to manage subscriptions.

---

## Underserved Segment Hypotheses

| Hypothesis | Evidence | Validation needed |
|-----------|---------|-------------------|
| Freelancers who file 1099 taxes need subscription-specific tax categorization, not general expense tracking | YNAB requires manual tagging; Rocket Money has no tax workflow; accounting tools don't track renewals | Interview 5-10 freelancers about tax-time subscription workflows |
| Content creators have the highest tool churn rate and worst tracking habits | Anecdotal; creator economy growth data | Survey creator communities about subscription management |
| Privacy-first users (no bank connection) are underserved by Rocket Money and Monarch | Both rely on Plaid; Bobby/TrackMySubs exist but are limited | Analyze app store reviews for privacy-related complaints |
| Couples/households want shared subscription visibility without full financial merging | Monarch offers collaboration but at $100/yr premium | Survey households about subscription coordination pain |

---

## Key Takeaways for Chain State

1. **TAM is real but niche**: ~$1.6B U.S. consumer subscription tracking, with freelancer (~$395M) and household (~$1.2B) segments both viable
2. **Dual primary segments**: Overwhelmed freelancers (5.9M) and budget-conscious households (8M) get equal weight. Freelancers have stronger product-market fit today (tax features), but households are the larger market.
3. **The privacy angle is a differentiator**: No bank connection = trust advantage over Rocket Money/Monarch
4. **Monetization is optional**: Product can succeed as a portfolio/credibility asset without revenue
5. **Biggest tailwind**: Subscription fatigue + SaaS price inflation = growing pain = growing demand

---

## References

- Subscription economy: Fortune Business Insights ($536B global, 2025)
- Subscription billing management market: Precedence Research, Astute Analytica ($8.5-10.9B, 2025)
- U.S. personal finance software: OpenPR ($300.42M, 2025)
- Consumer subscription statistics: C+R Research, Self Financial, Deloitte Digital Media Trends 2025
- Freelancer market: U.S. Bureau of Labor Statistics (9.82M self-employed)
- SaaS spend per employee: Zylo 2025 SaaS Management Index, Vertice SaaS Inflation Index
