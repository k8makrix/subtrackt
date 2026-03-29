# Step 12: Security Review (Plan-Level)

> Recipe step 12 of 15 | Phase: Validate | Date: 2026-03-29
> Scope: Product plan and architecture, not a code-level audit

---

## Threat Model (STRIDE)

### Spoofing (Identity)

| Threat | Current mitigation | Gap | Roadmap impact |
|--------|-------------------|-----|---------------|
| Attacker signs in as another user | Google OAuth via Better Auth. No password-based auth. | Low risk. Google handles identity verification. | None |
| Session hijacking | Better Auth sessions (7-day expiry). HTTPS in production. | Session tokens in cookies; no explicit SameSite or Secure flags verified. | Verify cookie flags in auth config. |
| Fake origin bypassing CSRF | `validateOrigin()` checks Origin/Referer headers on state-changing requests | Solid implementation. Falls back to reject if neither header present. | None |

### Tampering (Data integrity)

| Threat | Current mitigation | Gap | Roadmap impact |
|--------|-------------------|-----|---------------|
| User modifies another user's subscriptions | API routes use `requireAuth()` and filter by `session.user.id` | **page.tsx server component queries ALL subscriptions without user_id filter.** Data is passed to client. | **Fix immediately:** Add `WHERE user_id = ${session.user.id}` to page.tsx query, or gate on session. |
| Malicious input in subscription fields | Zod validation on all API inputs | Good coverage. All schemas in validators.ts. | None |
| SQL injection | Neon tagged template literals (parameterized queries) | Safe. Template literals auto-parameterize. | None |

### Repudiation (Deniability)

| Threat | Current mitigation | Gap | Roadmap impact |
|--------|-------------------|-----|---------------|
| User denies making a change | `decision_changed_at`, `updated_at` timestamps. Notes have `user_email` attribution. | No full audit log of field changes. | Low priority. Acceptable for current scale. |

### Information Disclosure

| Threat | Current mitigation | Gap | Roadmap impact |
|--------|-------------------|-----|---------------|
| Subscription data exposed to wrong user | API routes filter by user_id | **page.tsx issue** (see Tampering above) | Fix page.tsx |
| Sensitive data in error responses | Some API routes return raw Zod errors | Zod error flatten() is safe (no internal data). But could leak schema structure. | Low priority. Consider generic error messages in production. |
| Environment variables exposed | .env.local in .gitignore | Verified: .env.local not in repo. But SECURITY.md notes secrets may not have been rotated. | **Rotate BETTER_AUTH_SECRET** per SECURITY.md |

### Denial of Service

| Threat | Current mitigation | Gap | Roadmap impact |
|--------|-------------------|-----|---------------|
| API abuse (excessive requests) | None. No rate limiting. | **No rate limiting on any endpoint.** An attacker could hammer /api/subscriptions. | Add rate limiting (e.g. Vercel Edge Middleware or upstash/ratelimit) before public launch. |
| Cron job abuse | CRON_SECRET bearer token on /api/cron/renewal-alerts | Good. Only Vercel cron can trigger. | None |

### Elevation of Privilege

| Threat | Current mitigation | Gap | Roadmap impact |
|--------|-------------------|-----|---------------|
| Regular user accesses admin functions | No admin functions exist. Single-user product. | N/A for now. Becomes relevant with multi-user. | Design roles/permissions when building shared household or team features. |

---

## Privacy & Data Handling

| Area | Current state | Requirement for roadmap |
|------|-------------|----------------------|
| **Data stored** | Subscription names, costs, renewal dates, email accounts, payment sources, tax categories, notes | Sensitive financial data. Treat as PII. |
| **Data sharing** | No third-party sharing. No analytics. No ads. | Maintain this. If adding analytics, use privacy-respecting tools (PostHog self-hosted or Plaid with explicit consent). |
| **Data export** | CSV and PDF export available | Good. Users can extract their data. |
| **Data deletion** | No account deletion flow | **Add before public launch.** GDPR/CCPA require ability to delete personal data. |
| **Cookie consent** | No consent banner | Only auth cookies (functional). No tracking cookies. Consent banner likely not required for functional cookies only. |
| **Bank connection (future)** | Not built yet | When adding Plaid: explicit opt-in, data minimization (read-only), clear privacy policy. Major privacy implication. |

---

## Security Requirements for PRD

These must be included as acceptance criteria in the PRD (Step 13):

### Must-Have (before public launch)

| # | Requirement | Affected features |
|---|------------|-------------------|
| SEC-1 | **Fix page.tsx to filter by authenticated user** | All (data exposure risk) |
| SEC-2 | **Rotate BETTER_AUTH_SECRET** | All (session security) |
| SEC-3 | **Add rate limiting to API routes** | All public-facing routes |
| SEC-4 | **Add account deletion flow** | Landing page, user settings |
| SEC-5 | **Update layout.tsx metadata** | Landing page (currently says "Create Next App") |

### Should-Have (within Q2)

| # | Requirement | Affected features |
|---|------------|-------------------|
| SEC-6 | Verify cookie SameSite and Secure flags | Auth |
| SEC-7 | Add CSP (Content Security Policy) headers | All pages |
| SEC-8 | Add privacy policy page | Landing page |
| SEC-9 | Add generic error messages in production | API routes |

### Nice-to-Have (Q3+)

| # | Requirement | Affected features |
|---|------------|-------------------|
| SEC-10 | Full audit log for subscription changes | All mutations |
| SEC-11 | Roles and permissions model | Shared household, team features |
| SEC-12 | Plaid integration security review | Bank connection (LATER) |

---

## Critical Finding

**SEC-1 (page.tsx data exposure) is the highest-priority security issue.** The server component in `page.tsx` queries `SELECT * FROM subscriptions` without a `WHERE user_id` clause. All subscription data is loaded server-side and passed to the client Dashboard component. While the client only renders the user's own data (filtered by auth in the Dashboard), the raw data for ALL users passes through the server component.

Currently this is low risk (single user), but it becomes a data leak the moment a second user signs up. This must be fixed before any public launch or landing page goes live.

---

## References

- SECURITY.md: Secret rotation guide
- auth-guard.ts: requireAuth(), validateOrigin(), response helpers
- page.tsx: Server component data fetching (no auth filter)
- validators.ts: Zod schemas for all inputs
- Pre-mortem risk P3: Secrets and security gaps
