import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sql = getDb();

  const notes = await sql`
    SELECT * FROM subscription_notes
    WHERE subscription_id = ${id}
    ORDER BY created_at DESC
  `;

  return NextResponse.json(notes);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const sql = getDb();
  const body = await request.json();

  const result = await sql`
    INSERT INTO subscription_notes (subscription_id, user_email, user_name, note, note_type)
    VALUES (${id}, ${body.user_email}, ${body.user_name}, ${body.note}, ${body.note_type || "comment"})
    RETURNING *
  `;

  return NextResponse.json(result[0], { status: 201 });
}
