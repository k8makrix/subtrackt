import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse, validateOrigin, forbiddenResponse } from "@/lib/auth-guard";
import { notificationPreferencesSchema } from "@/lib/validators";

export async function GET(request: Request) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const sql = getDb();

  // Upsert: return existing or create defaults
  const rows = await sql`
    INSERT INTO notification_preferences (user_id)
    VALUES (${session.user.id})
    ON CONFLICT (user_id) DO UPDATE SET user_id = notification_preferences.user_id
    RETURNING *
  `;

  return NextResponse.json(rows[0]);
}

export async function PUT(request: Request) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();
  if (!validateOrigin(request)) return forbiddenResponse();

  const sql = getDb();
  const raw = await request.json();
  const parsed = notificationPreferencesSchema.safeParse(raw);

  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const values = parsed.data;

  const result = await sql`
    INSERT INTO notification_preferences (user_id)
    VALUES (${session.user.id})
    ON CONFLICT (user_id) DO UPDATE SET
      alert_7_days = COALESCE(${values.alert_7_days ?? null}, notification_preferences.alert_7_days),
      alert_3_days = COALESCE(${values.alert_3_days ?? null}, notification_preferences.alert_3_days),
      alert_day_of = COALESCE(${values.alert_day_of ?? null}, notification_preferences.alert_day_of),
      weekly_digest = COALESCE(${values.weekly_digest ?? null}, notification_preferences.weekly_digest),
      digest_day = COALESCE(${values.digest_day ?? null}, notification_preferences.digest_day),
      email_enabled = COALESCE(${values.email_enabled ?? null}, notification_preferences.email_enabled),
      slack_enabled = COALESCE(${values.slack_enabled ?? null}, notification_preferences.slack_enabled),
      slack_webhook_url = COALESCE(${values.slack_webhook_url ?? null}, notification_preferences.slack_webhook_url),
      stale_review_reminders = COALESCE(${values.stale_review_reminders ?? null}, notification_preferences.stale_review_reminders),
      updated_at = NOW()
    RETURNING *
  `;

  return NextResponse.json(result[0]);
}
