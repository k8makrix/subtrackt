"use client";

import { authClient } from "@/lib/auth-client";
import { AuthButton } from "./AuthButton";
import { SubscriptionRow } from "./SubscriptionRow";

type Subscription = {
  id: number;
  service_name: string;
  cost: string | null;
  billing_cycle: string | null;
  email_account: string | null;
  next_renewal_date: string | null;
  category: string | null;
  source: string | null;
  tax_deductible: string | null;
  plan_name: string | null;
  keep_cancel_review: string | null;
  payment_source: string | null;
  covered_by: string | null;
  status: string | null;
  parent_subscription_id: number | null;
  tax_category: string | null;
  expense_type: string | null;
};

function daysUntil(dateStr: string | null): number | null {
  if (!dateStr) return null;
  const target = new Date(dateStr);
  const now = new Date();
  return Math.ceil((target.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}

function formatDate(dateStr: string | null): string {
  if (!dateStr) return "TBD";
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function urgencyColor(days: number | null): string {
  if (days === null) return "text-gray-400";
  if (days < 0) return "text-red-500 font-bold";
  if (days <= 7) return "text-red-500";
  if (days <= 30) return "text-amber-500";
  if (days <= 90) return "text-yellow-500";
  return "text-green-500";
}

export function Dashboard({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  const { data: session } = authClient.useSession();

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const lennyPassSubs = subscriptions.filter((s) => s.status === "lenny-pass");

  const monthlySpend = activeSubs
    .filter((s) => s.billing_cycle === "monthly" && s.cost)
    .reduce((sum, s) => sum + parseFloat(s.cost!), 0);

  const annualSpend = activeSubs
    .filter((s) => s.billing_cycle === "annual" && s.cost)
    .reduce((sum, s) => sum + parseFloat(s.cost!), 0);

  const totalAnnualized = monthlySpend * 12 + annualSpend;

  const urgentRenewals = activeSubs.filter((s) => {
    const days = daysUntil(s.next_renewal_date);
    return days !== null && days <= 30;
  });

  const needsReview = subscriptions.filter(
    (s) => s.keep_cancel_review === "review"
  );

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              sub<span className="text-amber-400">trackt</span>
            </h1>
            <p className="text-gray-400 mt-1">
              Know what you pay for. Cancel what you don&apos;t need.
            </p>
          </div>
          <AuthButton />
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="text-sm text-gray-400">Monthly Spend</div>
            <div className="text-2xl font-bold mt-1">
              ${monthlySpend.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {activeSubs.filter((s) => s.billing_cycle === "monthly").length}{" "}
              subscriptions
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="text-sm text-gray-400">Annual Spend</div>
            <div className="text-2xl font-bold mt-1">
              ${annualSpend.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {activeSubs.filter((s) => s.billing_cycle === "annual").length}{" "}
              subscriptions
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="text-sm text-gray-400">Total Annualized</div>
            <div className="text-2xl font-bold text-amber-400 mt-1">
              ${totalAnnualized.toFixed(2)}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              projected yearly cost
            </div>
          </div>
          <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
            <div className="text-sm text-gray-400">Needs Review</div>
            <div className="text-2xl font-bold text-amber-500 mt-1">
              {needsReview.length}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              of {subscriptions.length} total
            </div>
          </div>
        </div>

        {/* Urgent Renewals */}
        {urgentRenewals.length > 0 && (
          <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-5 mb-8">
            <h2 className="text-lg font-semibold text-red-400 mb-3">
              Upcoming Renewals (next 30 days)
            </h2>
            <div className="space-y-2">
              {urgentRenewals.map((s) => {
                const days = daysUntil(s.next_renewal_date);
                return (
                  <div
                    key={s.id}
                    className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-2"
                  >
                    <span className="font-medium">{s.service_name}</span>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">
                        {s.cost ? `$${s.cost}` : "TBD"}
                      </span>
                      <span className={urgencyColor(days)}>
                        {days !== null && days < 0
                          ? `${Math.abs(days)}d overdue`
                          : `${days}d`}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Active Subscriptions */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-4">
            Active Subscriptions ({activeSubs.length})
            <span className="text-sm text-gray-500 font-normal ml-2">
              Click a row to expand
            </span>
          </h2>
          <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-800 text-gray-400">
                  <th className="text-left px-4 py-3">Service</th>
                  <th className="text-left px-4 py-3">Cost</th>
                  <th className="text-left px-4 py-3">Cycle</th>
                  <th className="text-left px-4 py-3">Category</th>
                  <th className="text-left px-4 py-3">Next Renewal</th>
                  <th className="text-left px-4 py-3">Paid By</th>
                  <th className="text-left px-4 py-3">Decision</th>
                </tr>
              </thead>
              <tbody>
                {activeSubs.map((s) => (
                  <SubscriptionRow
                    key={s.id}
                    sub={s}
                    userEmail={session?.user?.email || null}
                    userName={session?.user?.name || null}
                  />
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Lenny Pass Tools */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold mb-2">
            Lenny&apos;s Product Pass ({lennyPassSubs.length} tools)
          </h2>
          <p className="text-sm text-gray-400 mb-4">
            Free via $349.65/yr Lenny&apos;s Newsletter subscription. Renews Aug
            6, 2026.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {lennyPassSubs.map((s) => {
              const days = daysUntil(s.next_renewal_date);
              return (
                <div
                  key={s.id}
                  className="bg-gray-900 rounded-lg border border-gray-800 px-4 py-3 flex items-center justify-between"
                >
                  <div>
                    <div className="font-medium text-sm">{s.service_name}</div>
                    <div className="text-xs text-gray-500">{s.category}</div>
                  </div>
                  <span className={`text-xs ${urgencyColor(days)}`}>
                    {days !== null ? `${days}d` : "TBD"}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tax & Expense Summary */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">
              Tax & Expense Summary
            </h2>
            <a
              href="/api/export"
              className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700 transition"
            >
              Export CSV for Tax
            </a>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="text-sm text-gray-400">Business Deductible</div>
              <div className="text-2xl font-bold text-green-400 mt-1">
                ${(() => {
                  const biz = subscriptions.filter(
                    (s) => s.expense_type && s.expense_type !== "personal" && s.tax_category !== "none"
                  );
                  return biz.reduce((sum, s) => {
                    if (!s.cost) return sum;
                    const cost = parseFloat(s.cost);
                    if (s.billing_cycle === "monthly") return sum + cost * 12;
                    if (s.billing_cycle === "annual") return sum + cost;
                    return sum;
                  }, 0).toFixed(2);
                })()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                annualized deductible expenses
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="text-sm text-gray-400">Personal (Non-deductible)</div>
              <div className="text-2xl font-bold mt-1">
                ${(() => {
                  const personal = subscriptions.filter(
                    (s) => !s.expense_type || s.expense_type === "personal"
                  );
                  return personal.reduce((sum, s) => {
                    if (!s.cost) return sum;
                    const cost = parseFloat(s.cost);
                    if (s.billing_cycle === "monthly") return sum + cost * 12;
                    if (s.billing_cycle === "annual") return sum + cost;
                    return sum;
                  }, 0).toFixed(2);
                })()}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                annualized personal expenses
              </div>
            </div>
            <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
              <div className="text-sm text-gray-400">Costs Still TBD</div>
              <div className="text-2xl font-bold text-amber-400 mt-1">
                {subscriptions.filter((s) => !s.cost && s.status === "active").length}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                subscriptions need cost lookup
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 py-8">
          subtrackt -- built by Kate Makrigiannis with Claude Code + Neon
        </div>
      </div>
    </main>
  );
}
