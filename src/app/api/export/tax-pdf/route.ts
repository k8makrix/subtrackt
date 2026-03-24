import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-guard";
import {
  generateTaxPDF,
  type TaxReportData,
  type TaxReportSummaryRow,
  type TaxReportDetailRow,
} from "@/lib/tax-pdf";

const SUMMARY_COLS = `tax_category, expense_type, COUNT(*) as count,
  SUM(CASE WHEN billing_cycle = 'monthly' THEN cost * 12
           WHEN billing_cycle = 'annual' THEN cost
           WHEN billing_cycle = '6-month' THEN cost * 2
           ELSE 0 END) as annual_total`;

const DETAIL_COLS = `service_name, tax_category, expense_type, billing_cycle,
  cost, payment_source,
  CASE WHEN billing_cycle = 'monthly' THEN cost * 12
       WHEN billing_cycle = 'annual' THEN cost
       WHEN billing_cycle = '6-month' THEN cost * 2
       ELSE 0 END as annualized_cost`;

const PERSONAL_COLS = `SUM(CASE WHEN billing_cycle = 'monthly' THEN cost * 12
                    WHEN billing_cycle = 'annual' THEN cost
                    WHEN billing_cycle = '6-month' THEN cost * 2
                    ELSE 0 END) as total`;

const DEDUCTIBLE_FILTER = `AND expense_type IS NOT NULL AND expense_type != 'personal'
  AND tax_category IS NOT NULL AND tax_category != 'none'`;

const PERSONAL_FILTER = `AND (expense_type IS NULL OR expense_type = 'personal')`;

export async function GET(request: Request) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const sql = getDb();
  const url = new URL(request.url);
  const yearParam = url.searchParams.get("year");
  const year = yearParam && yearParam !== "all" ? parseInt(yearParam) : null;

  const yearStart = year ? `${year}-01-01` : "";
  const yearEnd = year ? `${year}-12-31` : "";

  // Summary: deductible by category
  const summaryResult = year
    ? await sql`
        SELECT ${sql.unsafe(SUMMARY_COLS)}
        FROM subscriptions
        WHERE user_id = ${session.user.id}
          ${sql.unsafe(DEDUCTIBLE_FILTER)}
          AND (signup_date IS NULL OR signup_date <= ${yearEnd})
          AND (canceled_at IS NULL OR canceled_at >= ${yearStart})
          AND status IN ('active', 'canceled')
        GROUP BY tax_category, expense_type
        ORDER BY annual_total DESC
      `
    : await sql`
        SELECT ${sql.unsafe(SUMMARY_COLS)}
        FROM subscriptions
        WHERE user_id = ${session.user.id}
          ${sql.unsafe(DEDUCTIBLE_FILTER)}
        GROUP BY tax_category, expense_type
        ORDER BY annual_total DESC
      `;

  // Detail: all deductible subscriptions
  const detailResult = year
    ? await sql`
        SELECT ${sql.unsafe(DETAIL_COLS)}
        FROM subscriptions
        WHERE user_id = ${session.user.id}
          ${sql.unsafe(DEDUCTIBLE_FILTER)}
          AND (signup_date IS NULL OR signup_date <= ${yearEnd})
          AND (canceled_at IS NULL OR canceled_at >= ${yearStart})
          AND status IN ('active', 'canceled')
        ORDER BY annualized_cost DESC NULLS LAST
      `
    : await sql`
        SELECT ${sql.unsafe(DETAIL_COLS)}
        FROM subscriptions
        WHERE user_id = ${session.user.id}
          ${sql.unsafe(DEDUCTIBLE_FILTER)}
        ORDER BY annualized_cost DESC NULLS LAST
      `;

  // Personal total
  const personalResult = year
    ? await sql`
        SELECT ${sql.unsafe(PERSONAL_COLS)}
        FROM subscriptions
        WHERE user_id = ${session.user.id}
          ${sql.unsafe(PERSONAL_FILTER)}
          AND (signup_date IS NULL OR signup_date <= ${yearEnd})
          AND (canceled_at IS NULL OR canceled_at >= ${yearStart})
          AND status IN ('active', 'canceled')
      `
    : await sql`
        SELECT ${sql.unsafe(PERSONAL_COLS)}
        FROM subscriptions
        WHERE user_id = ${session.user.id}
          ${sql.unsafe(PERSONAL_FILTER)}
      `;

  const summaryRows: TaxReportSummaryRow[] = summaryResult.map((r: Record<string, unknown>) => ({
    tax_category: String(r.tax_category || ""),
    expense_type: String(r.expense_type || ""),
    count: Number(r.count),
    annual_total: Number(r.annual_total) || 0,
  }));

  const detailRows: TaxReportDetailRow[] = detailResult.map((r: Record<string, unknown>) => ({
    service_name: String(r.service_name || ""),
    tax_category: String(r.tax_category || ""),
    expense_type: String(r.expense_type || ""),
    billing_cycle: String(r.billing_cycle || ""),
    cost: Number(r.cost) || 0,
    annualized_cost: Number(r.annualized_cost) || 0,
    payment_source: String(r.payment_source || ""),
  }));

  const deductibleTotal = summaryRows.reduce((sum, r) => sum + r.annual_total, 0);
  const personalTotal = Number(personalResult[0]?.total) || 0;

  const data: TaxReportData = {
    year: year ? String(year) : "All Time",
    generatedAt: new Date().toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    }),
    summaryRows,
    detailRows,
    deductibleTotal,
    personalTotal,
  };

  const pdfBuffer = generateTaxPDF(data);
  const filename = year
    ? `subtrackt-tax-report-${year}.pdf`
    : `subtrackt-tax-report-all.pdf`;

  return new NextResponse(Buffer.from(pdfBuffer), {
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
