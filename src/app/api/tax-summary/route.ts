import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-guard";

export async function GET(request: Request) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const sql = getDb();

  const summary = await sql`
    SELECT
      tax_category,
      expense_type,
      COUNT(*) as count,
      SUM(CASE WHEN cost IS NOT NULL AND billing_cycle = 'monthly' THEN cost * 12
               WHEN cost IS NOT NULL AND billing_cycle = 'annual' THEN cost
               WHEN cost IS NOT NULL AND billing_cycle = '6-month' THEN cost * 2
               ELSE 0 END) as annual_total
    FROM subscriptions
    WHERE status IN ('active', 'lenny-pass')
    GROUP BY tax_category, expense_type
    ORDER BY annual_total DESC
  `;

  const deductible = await sql`
    SELECT
      service_name, cost, billing_cycle, tax_category, expense_type, tax_deductible,
      CASE WHEN billing_cycle = 'monthly' THEN cost * 12
           WHEN billing_cycle = 'annual' THEN cost
           WHEN billing_cycle = '6-month' THEN cost * 2
           ELSE 0 END as annualized_cost
    FROM subscriptions
    WHERE expense_type != 'personal'
      AND status IN ('active', 'lenny-pass')
    ORDER BY annualized_cost DESC NULLS LAST
  `;

  return NextResponse.json({ summary, deductible });
}
