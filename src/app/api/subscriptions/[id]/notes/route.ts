import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse, validateOrigin, forbiddenResponse } from "@/lib/auth-guard";
import { createNoteSchema, idParamSchema } from "@/lib/validators";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const { id } = await params;
  const idCheck = idParamSchema.safeParse(id);
  if (!idCheck.success) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const sql = getDb();

  const notes = await sql`
    SELECT sn.* FROM subscription_notes sn
    JOIN subscriptions s ON sn.subscription_id = s.id
    WHERE sn.subscription_id = ${id} AND s.user_id = ${session.user.id}
    ORDER BY sn.created_at DESC
  `;

  return NextResponse.json(notes);
}

export async function POST(
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
  const parsed = createNoteSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const body = parsed.data;

  // Use session user info instead of trusting client input
  // Verify the subscription belongs to this user
  const ownership = await sql`
    SELECT id FROM subscriptions WHERE id = ${id} AND user_id = ${session.user.id}
  `;
  if (ownership.length === 0) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const result = await sql`
    INSERT INTO subscription_notes (subscription_id, user_email, user_name, note, note_type)
    VALUES (${id}, ${session.user.email}, ${session.user.name}, ${body.note}, ${body.note_type || "comment"})
    RETURNING *
  `;

  return NextResponse.json(result[0], { status: 201 });
}
