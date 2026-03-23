import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse, validateOrigin, forbiddenResponse } from "@/lib/auth-guard";
import { createSubscriptionSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const sql = getDb();

  const subscriptions = await sql`
    SELECT
      s.*,
      p.service_name as parent_name
    FROM subscriptions s
    LEFT JOIN subscriptions p ON s.parent_subscription_id = p.id
    WHERE s.user_id = ${session.user.id}
    ORDER BY
      CASE WHEN s.status = 'active' THEN 0 ELSE 1 END,
      s.next_renewal_date ASC NULLS LAST
  `;

  return NextResponse.json(subscriptions);
}

export async function POST(request: Request) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();
  if (!validateOrigin(request)) return forbiddenResponse();

  const sql = getDb();
  const raw = await request.json();
  const parsed = createSubscriptionSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const body = parsed.data;

  const result = await sql`
    INSERT INTO subscriptions (
      user_id, service_name, cost, billing_cycle, email_account,
      signup_date, last_charge_date, next_renewal_date,
      category, source, tax_deductible, plan_name,
      plan_details, cancel_url, cancel_notes,
      keep_cancel_review, status, parent_subscription_id, auto_renew
    ) VALUES (
      ${session.user.id}, ${body.service_name}, ${body.cost ?? null}, ${body.billing_cycle ?? null}, ${body.email_account ?? null},
      ${body.signup_date ?? null}, ${body.last_charge_date ?? null}, ${body.next_renewal_date ?? null},
      ${body.category ?? null}, ${body.source ?? null}, ${body.tax_deductible ?? null}, ${body.plan_name ?? null},
      ${body.plan_details ?? null}, ${body.cancel_url ?? null}, ${body.cancel_notes ?? null},
      ${body.keep_cancel_review}, ${body.status},
      ${body.parent_subscription_id ?? null}, ${body.auto_renew}
    )
    RETURNING *
  `;

  return NextResponse.json(result[0], { status: 201 });
}
