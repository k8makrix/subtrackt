import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse, validateOrigin, forbiddenResponse } from "@/lib/auth-guard";
import { updateSubscriptionSchema, idParamSchema } from "@/lib/validators";

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();
  if (!validateOrigin(request)) return forbiddenResponse();

  const { id } = await params;
  const idCheck = idParamSchema.safeParse(id);
  if (!idCheck.success) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const sql = getDb();
  const raw = await request.json();
  const parsed = updateSubscriptionSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const values = parsed.data;

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
    WHERE id = ${id} AND user_id = ${session.user.id}
    RETURNING *
  `;

  return NextResponse.json(result[0]);
}
