import { getDb } from "@/lib/db";
import { NextResponse } from "next/server";
import { requireAuth, unauthorizedResponse } from "@/lib/auth-guard";
import { generateICS, type CalendarEvent } from "@/lib/ics";

export async function GET(request: Request) {
  const session = await requireAuth(request);
  if (!session) return unauthorizedResponse();

  const sql = getDb();

  const subs = await sql`
    SELECT id, service_name, cost, billing_cycle, next_renewal_date
    FROM subscriptions
    WHERE user_id = ${session.user.id}
      AND status = 'active'
      AND next_renewal_date IS NOT NULL
    ORDER BY next_renewal_date ASC
  `;

  const events: CalendarEvent[] = (subs as any[]).map((s) => {
    const costStr = s.cost ? `$${s.cost}` : null;
    const summary = costStr
      ? `${s.service_name} renewal (${costStr})`
      : `${s.service_name} renewal`;
    const descParts = [`Subscription: ${s.service_name}`];
    if (costStr) descParts.push(`Cost: ${costStr}`);
    if (s.billing_cycle) descParts.push(`Billing: ${s.billing_cycle}`);

    return {
      uid: `sub-${s.id}@subtrackt`,
      summary,
      description: descParts.join("\n"),
      date: s.next_renewal_date,
    };
  });

  const ics = generateICS(events);

  return new NextResponse(ics, {
    headers: {
      "Content-Type": "text/calendar; charset=utf-8",
      "Content-Disposition": `attachment; filename="subtrackt-renewals.ics"`,
    },
  });
}
