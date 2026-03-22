import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sql = getDb();
  const body = await request.json();

  const values: Record<string, unknown> = {};

  const allowedFields = [
    "keep_cancel_review",
    "payment_source",
    "covered_by",
    "cost",
    "status",
    "next_renewal_date",
    "plan_details",
    "cancel_notes",
    "tax_category",
    "expense_type",
    "tax_deductible",
  ];

  for (const field of allowedFields) {
    if (body[field] !== undefined) {
      values[field] = body[field];
    }
  }

  if (Object.keys(values).length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const result = await sql`
    UPDATE subscriptions
    SET
      keep_cancel_review = COALESCE(${values.keep_cancel_review ?? null}, keep_cancel_review),
      payment_source = COALESCE(${values.payment_source ?? null}, payment_source),
      covered_by = COALESCE(${values.covered_by ?? null}, covered_by),
      cost = COALESCE(${values.cost ?? null}, cost),
      status = COALESCE(${values.status ?? null}, status),
      cancel_notes = COALESCE(${values.cancel_notes ?? null}, cancel_notes),
      tax_category = COALESCE(${values.tax_category ?? null}, tax_category),
      expense_type = COALESCE(${values.expense_type ?? null}, expense_type),
      tax_deductible = COALESCE(${values.tax_deductible ?? null}, tax_deductible),
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `;

  return NextResponse.json(result[0]);
}
