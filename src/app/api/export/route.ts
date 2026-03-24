import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-guard";

const SELECT_COLS = `service_name, cost, billing_cycle, email_account,
  next_renewal_date, category, tax_category, expense_type,
  tax_deductible, payment_source, covered_by,
  keep_cancel_review, status, canceled_at, plan_name,
  CASE WHEN billing_cycle = 'monthly' THEN cost * 12
       WHEN billing_cycle = 'annual' THEN cost
       WHEN billing_cycle = '6-month' THEN cost * 2
       ELSE 0 END as annualized_cost`;

export async function GET(request: Request) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const sql = getDb();
  const url = new URL(request.url);
  const yearParam = url.searchParams.get("year");
  const year = yearParam && yearParam !== "all" ? parseInt(yearParam) : null;

  const subs = year
    ? await sql`
        SELECT ${sql.unsafe(SELECT_COLS)}
        FROM subscriptions
        WHERE user_id = ${session.user.id}
          AND (signup_date IS NULL OR signup_date <= ${`${year}-12-31`})
          AND (canceled_at IS NULL OR canceled_at >= ${`${year}-01-01`})
          AND status IN ('active', 'canceled')
        ORDER BY expense_type, tax_category, annualized_cost DESC NULLS LAST
      `
    : await sql`
        SELECT ${sql.unsafe(SELECT_COLS)}
        FROM subscriptions
        WHERE user_id = ${session.user.id}
        ORDER BY expense_type, tax_category, annualized_cost DESC NULLS LAST
      `;

  const headers = [
    "Service", "Monthly Cost", "Billing Cycle", "Email", "Next Renewal",
    "Category", "Tax Category", "Expense Type", "Tax Deductible",
    "Payment Source", "Covered By", "Decision", "Status", "Canceled At",
    "Plan", "Annualized Cost"
  ];

  const rows = subs.map((s: Record<string, unknown>) => [
    s.service_name, s.cost || "", s.billing_cycle, s.email_account,
    s.next_renewal_date || "", s.category, s.tax_category, s.expense_type,
    s.tax_deductible, s.payment_source, s.covered_by || "",
    s.keep_cancel_review, s.status, s.canceled_at || "", s.plan_name || "",
    s.annualized_cost || ""
  ]);

  const csv = [headers, ...rows]
    .map((row) => row.map((cell: unknown) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv",
      "Content-Disposition": `attachment; filename="subtrackt-export-${year || new Date().toISOString().split("T")[0]}.csv"`,
    },
  });
}
