import { getDb } from "@/lib/db";
import { Dashboard } from "@/components/Dashboard";

export const dynamic = "force-dynamic";

export default async function Home() {
  const sql = getDb();

  const subscriptions = await sql`
    SELECT * FROM subscriptions ORDER BY
      CASE WHEN status = 'active' THEN 0 WHEN status = 'lenny-pass' THEN 1 ELSE 2 END,
      next_renewal_date ASC NULLS LAST
  `;

  return <Dashboard subscriptions={subscriptions as any} />;
}
