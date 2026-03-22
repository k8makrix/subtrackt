import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET() {
  const sql = getDb();

  const subscriptions = await sql`
    SELECT
      s.*,
      p.service_name as parent_name
    FROM subscriptions s
    LEFT JOIN subscriptions p ON s.parent_subscription_id = p.id
    ORDER BY
      CASE WHEN s.status = 'active' THEN 0 ELSE 1 END,
      s.next_renewal_date ASC NULLS LAST
  `;

  return NextResponse.json(subscriptions);
}

export async function POST(request: Request) {
  const sql = getDb();
  const body = await request.json();

  const result = await sql`
    INSERT INTO subscriptions (
      service_name, cost, billing_cycle, email_account,
      signup_date, last_charge_date, next_renewal_date,
      category, source, tax_deductible, plan_name,
      plan_details, cancel_url, cancel_notes,
      keep_cancel_review, status, parent_subscription_id, auto_renew
    ) VALUES (
      ${body.service_name}, ${body.cost}, ${body.billing_cycle}, ${body.email_account},
      ${body.signup_date}, ${body.last_charge_date}, ${body.next_renewal_date},
      ${body.category}, ${body.source}, ${body.tax_deductible}, ${body.plan_name},
      ${body.plan_details}, ${body.cancel_url}, ${body.cancel_notes},
      ${body.keep_cancel_review || "review"}, ${body.status || "active"},
      ${body.parent_subscription_id}, ${body.auto_renew ?? true}
    )
    RETURNING *
  `;

  return NextResponse.json(result[0], { status: 201 });
}
