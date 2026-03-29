@AGENTS.md

# Subtrackt - AI Assistant Guide

## Project Overview

Subtrackt is a full-stack subscription tracker that helps users manage recurring subscriptions, track spending, monitor renewals, and make data-driven cancellation decisions. Built for a single-user/small-team use case.

**Production URL**: https://subtrackt.vercel.app

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16.2.1 (App Router) |
| UI | React 19.2.4, Tailwind CSS 4 (dark theme) |
| Database | Neon PostgreSQL (serverless, raw SQL -- no ORM) |
| Auth | Better Auth 1.5.6 (Google OAuth) |
| Validation | Zod 4.3.6 |
| Email | Resend 6.9.4 |
| PDF | jspdf + jspdf-autotable |
| Deployment | Vercel (with daily Cron) |
| Language | TypeScript 5 (strict mode) |

> **Note**: drizzle-orm is installed but NOT used. All DB access is raw SQL via `@neondatabase/serverless`.

## Critical Rules

1. **Read Next.js 16 docs first**: This version has breaking changes. Read `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
2. **No ORM**: Use raw SQL with `getDb()` from `src/lib/db.ts`. Do not introduce Drizzle queries.
3. **Auth on every API route**: Use `requireAuth()` from `src/lib/auth-guard.ts`. State-changing routes (POST/PATCH/PUT/DELETE) also need `validateOrigin()`.
4. **Validate all inputs**: Use Zod schemas from `src/lib/validators.ts`. Add new schemas there for new endpoints.
5. **Dark theme only**: Background is `bg-gray-950`, text is `gray-100`, accent is amber (`#fbbf24`). Match existing styling.

## Directory Structure

```
src/
  app/
    page.tsx                           # Root page (server component, fetches data)
    layout.tsx                         # Root layout (Geist fonts, metadata)
    globals.css                        # Tailwind CSS entry
    api/
      auth/[...all]/route.ts           # Better Auth handler
      subscriptions/
        route.ts                       # GET (list) / POST (create)
        [id]/route.ts                  # PATCH (update)
        [id]/notes/route.ts            # GET/POST notes
      notification-preferences/route.ts # GET/PUT notification settings
      export/
        route.ts                       # CSV export (year-filtered)
        calendar/route.ts              # ICS calendar export
        tax-pdf/route.ts               # PDF tax report
      tax-summary/route.ts             # Tax data aggregation
      cron/renewal-alerts/route.ts     # Vercel Cron (daily 2PM UTC)
  components/
    Dashboard.tsx                      # Main UI: 3 tabs, metrics, search, sort, filter
    SubscriptionRow.tsx                # Expandable row with inline editing
    AddSubscriptionModal.tsx           # New subscription form
    AuthButton.tsx                     # Google sign-in/out
    NotificationSettings.tsx           # Notification preferences modal
  lib/
    db.ts                              # Neon serverless SQL client (getDb())
    auth.ts                            # Better Auth server config
    auth-client.ts                     # Better Auth client (useSession, signIn, signOut)
    auth-guard.ts                      # requireAuth(), validateOrigin(), response helpers
    types.ts                           # Subscription TypeScript type
    validators.ts                      # All Zod schemas
    email-templates.ts                 # HTML email templates (renewal, stale, digest)
    ics.ts                             # RFC 5545 ICS calendar generation
    tax-pdf.ts                         # PDF generation for tax reports
    resend.ts                          # Resend email singleton
docs/strategy/                         # Product strategy documents
```

## Development

```bash
npm run dev          # Start dev server (port 3001 via .claude/launch.json)
npm run build        # Production build
npm run lint         # ESLint
```

### Environment Variables (.env.local)

```
DATABASE_URL=postgresql://...@...neon.tech/...
BETTER_AUTH_URL=http://localhost:3001
BETTER_AUTH_SECRET=<openssl rand -base64 32>
GOOGLE_CLIENT_ID=...apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=...
NEXT_PUBLIC_APP_URL=http://localhost:3001
RESEND_API_KEY=re_...
CRON_SECRET=<random-string>
```

## Architecture Patterns

### Data Flow
1. `page.tsx` (server) fetches all subscriptions via raw SQL
2. Passes data to `Dashboard` (client component) as props
3. Client handles search, sort, filter, tab switching
4. Mutations go through API routes (fetch calls)
5. Page reloads or manual re-fetch to sync after mutations

### API Route Pattern
Every API route follows this structure:
```typescript
export async function POST(request: Request) {
  const session = await requireAuth(request);           // returns session or null
  if (!session) return unauthorizedResponse();           // 401
  if (!validateOrigin(request)) return forbiddenResponse(); // 403 CSRF check
  const parsed = MyZodSchema.safeParse(await request.json());
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  const sql = getDb();
  // ... raw SQL query using sql`SELECT ... WHERE user_id = ${session.user.id}`
  return NextResponse.json(result);
}
```

### Component Pattern
- Server components: Only `page.tsx` and `layout.tsx`
- Client components: Everything in `src/components/` (marked `"use client"`)
- No server actions used; all mutations via API fetch calls

### Database
- Raw SQL via `getDb()` which returns a Neon serverless client
- No migration files; schema managed manually
- Key tables: `subscriptions`, `subscription_notes`, `notification_preferences`, `notification_log`, plus Better Auth tables (`user`, `session`, `account`, `verification`)

### Subscription Status Model
- `status`: `active` | `canceled` | `lenny-pass`
- `keep_cancel_review`: `keep` | `cancel` | `review` (decision field)
- `decision_changed_at`: Tracks when decision was last changed (for stale detection)
- Canceled subs: `canceled_at` timestamp set, appear in collapsed "Cancelled" section

### Urgency Color Coding (renewals)
- Red: 0-3 days
- Amber: 4-7 days
- Yellow: 8-14 days
- Green: 15+ days

## Notifications System
- **Email**: Via Resend (templates in `email-templates.ts`)
- **Slack**: Incoming webhooks (user-configured URL)
- **Cron**: `/api/cron/renewal-alerts` runs daily at 2PM UTC (vercel.json)
- **Dedup**: `notification_log` table prevents duplicate sends per day per subscription
- **Types**: Renewal alerts (7/3/0 days), stale review reminders (30+ days), weekly digest

## Shipped Features (chronological)
1. Core app -- subscription CRUD, 3-tab dashboard, urgency-coded renewals, tax categorization, CSV export, notes, search, Lenny Pass section
2. Security hardening -- auth guards (K8-301), Zod validation + CSRF (K8-303) (2026-03-22)
3. Add Subscription UI (2026-03-22)
4. Email notification system -- Resend + Slack webhook, Vercel Cron, notification preferences UI (2026-03-22)
5. Cancelled sub tracking + Money Saved counter (K8-316) (2026-03-23)
6. Calendar integration .ics export (K8-317) (2026-03-23)
7. Stale review reminders (K8-318) (2026-03-23)
8. Enhanced tax export with PDF generation and year filter (K8-319) (2026-03-23)
9. Sort controls + filter bar on All Subscriptions tab (K8-307, K8-312) (2026-03-24)

## Open Issues

| Priority | Issue | Status |
|----------|-------|--------|
| Urgent | K8-302: Rotate hardcoded secrets | DOCS SHIPPED -- manual rotation needed (see SECURITY.md) |
| Medium | K8-313: Slide-out detail panel | Backlog |
| Low | K8-314: Clickable TBD/Review counts | Backlog |

## Manual Steps Still Needed
1. Rotate BETTER_AUTH_SECRET per SECURITY.md
2. Add `https://subtrackt.vercel.app/api/auth/callback/google` as redirect URI in Google Cloud Console
3. Add RESEND_API_KEY and CRON_SECRET to Vercel env vars

## Data Audit Status (2026-03-23)
69 subscription records in DB. Major audit completed:
- 23 active/keep ($11,431/yr), 15 active/review ($4,347/yr), 3 active/cancel ($1,356/yr)
- 8 canceled ($2,974/yr saved), 21 lenny-pass ($0)
- Remaining gaps: 7 "believed canceled" subs to verify, missing costs for Kaiser/Rocket Money, incomplete email_account/payment_source fields
