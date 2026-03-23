"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { authClient } from "@/lib/auth-client";
import { AuthButton } from "./AuthButton";
import { SubscriptionRow } from "./SubscriptionRow";
import { AddSubscriptionModal } from "./AddSubscriptionModal";
import { NotificationSettings } from "./NotificationSettings";
import type { Subscription } from "@/lib/types";

type Tab = "dashboard" | "all" | "tax";

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

function annualize(cost: string | null, cycle: string | null): number {
  if (!cost) return 0;
  const c = parseFloat(cost);
  if (cycle === "monthly") return c * 12;
  if (cycle === "annual") return c;
  if (cycle === "6-month") return c * 2;
  return 0;
}

export function Dashboard({
  subscriptions,
}: {
  subscriptions: Subscription[];
}) {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [activeTab, setActiveTab] = useState<Tab>("dashboard");
  const [search, setSearch] = useState("");
  const [showAddModal, setShowAddModal] = useState(false);
  const [showNotificationSettings, setShowNotificationSettings] = useState(false);

  const activeSubs = subscriptions.filter((s) => s.status === "active");
  const lennyPassSubs = subscriptions.filter((s) => s.status === "lenny-pass");
  const canceledSubs = subscriptions.filter((s) => s.status === "canceled");
  const [showCancelled, setShowCancelled] = useState(false);

  const totalAnnualized = useMemo(() => {
    return [...activeSubs, ...lennyPassSubs].reduce(
      (sum, s) => sum + annualize(s.cost, s.billing_cycle),
      0
    );
  }, [activeSubs, lennyPassSubs]);

  const moneySaved = useMemo(() => {
    return canceledSubs.reduce(
      (sum, s) => sum + annualize(s.cost, s.billing_cycle),
      0
    );
  }, [canceledSubs]);

  const monthlySpend = activeSubs
    .filter((s) => s.billing_cycle === "monthly" && s.cost)
    .reduce((sum, s) => sum + parseFloat(s.cost!), 0);

  const annualSpend = activeSubs
    .filter((s) => s.billing_cycle === "annual" && s.cost)
    .reduce((sum, s) => sum + parseFloat(s.cost!), 0);

  const urgentRenewals = activeSubs.filter((s) => {
    const days = daysUntil(s.next_renewal_date);
    return days !== null && days <= 30;
  });

  const needsReview = subscriptions.filter(
    (s) => s.keep_cancel_review === "review"
  );

  const costsTBD = subscriptions.filter(
    (s) => !s.cost && s.status === "active"
  );

  const filteredSubs = useMemo(() => {
    const all = [...activeSubs, ...lennyPassSubs];
    if (!search.trim()) return all;
    const q = search.toLowerCase();
    return all.filter(
      (s) =>
        s.service_name.toLowerCase().includes(q) ||
        s.category?.toLowerCase().includes(q)
    );
  }, [activeSubs, lennyPassSubs, search]);

  const bizDeductible = useMemo(() => {
    return subscriptions
      .filter(
        (s) =>
          s.expense_type &&
          s.expense_type !== "personal" &&
          s.tax_category !== "none"
      )
      .reduce((sum, s) => sum + annualize(s.cost, s.billing_cycle), 0);
  }, [subscriptions]);

  const personalSpend = useMemo(() => {
    return subscriptions
      .filter((s) => !s.expense_type || s.expense_type === "personal")
      .reduce((sum, s) => sum + annualize(s.cost, s.billing_cycle), 0);
  }, [subscriptions]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "all", label: `All Subscriptions (${activeSubs.length + lennyPassSubs.length})` },
    { key: "tax", label: "Tax & Expenses" },
  ];

  return (
    <main className="min-h-screen bg-gray-950 text-gray-100">
      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">
              sub<span className="text-amber-400">trackt</span>
            </h1>
            <p className="text-gray-500 text-sm mt-0.5">
              Know what you pay for. Cancel what you don&apos;t need.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setShowNotificationSettings(true)}
              className="text-gray-500 hover:text-amber-400 transition-colors p-1.5"
              title="Notification settings"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
            </button>
            <AuthButton />
          </div>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mb-6 border-b border-gray-800">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2.5 text-sm font-medium transition-colors -mb-px ${
                activeTab === tab.key
                  ? "text-amber-400 border-b-2 border-amber-400"
                  : "text-gray-500 hover:text-gray-300"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ===== DASHBOARD TAB ===== */}
        {activeTab === "dashboard" && (
          <>
            {/* Hero Metric + Summary */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              <div className="bg-gray-900 rounded-xl p-6 border border-gray-800">
                <div className="text-sm text-gray-400">Total Annualized</div>
                <div className="text-4xl font-bold text-amber-400 mt-2">
                  ${totalAnnualized.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-2 flex gap-4">
                  <span>${monthlySpend.toFixed(0)}/mo</span>
                  <span>${annualSpend.toFixed(0)}/yr</span>
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-6 border border-green-900/50">
                <div className="text-sm text-gray-400">Money Saved</div>
                <div className="text-4xl font-bold text-green-400 mt-2">
                  ${moneySaved.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-2">
                  {canceledSubs.length} cancelled subscription{canceledSubs.length !== 1 ? "s" : ""}
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="text-sm text-gray-400">Needs Review</div>
                <div className="text-2xl font-bold text-amber-500 mt-1">
                  {needsReview.length}
                </div>
                <button
                  onClick={() => setActiveTab("all")}
                  className="text-xs text-gray-500 mt-1 hover:text-amber-400 transition-colors"
                >
                  of {subscriptions.length} total &rarr;
                </button>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="text-sm text-gray-400">Costs Still TBD</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">
                  {costsTBD.length}
                </div>
                <button
                  onClick={() => {
                    setActiveTab("all");
                    setSearch("");
                  }}
                  className="text-xs text-gray-500 mt-1 hover:text-amber-400 transition-colors"
                >
                  need cost lookup &rarr;
                </button>
              </div>
            </div>

            {/* Urgent Renewals */}
            {urgentRenewals.length > 0 && (
              <div className="bg-red-950/30 border border-red-900/50 rounded-xl p-5 mb-8">
                <h2 className="text-base font-semibold text-red-400 mb-3">
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
                        <span className="font-medium text-sm">{s.service_name}</span>
                        <div className="flex items-center gap-4 text-sm">
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

            {/* Lenny Pass Tools */}
            {lennyPassSubs.length > 0 && (
              <div className="mb-8">
                <h2 className="text-base font-semibold mb-2">
                  Lenny&apos;s Product Pass ({lennyPassSubs.length} tools)
                </h2>
                <p className="text-xs text-gray-500 mb-3">
                  Free via $349.65/yr Lenny&apos;s Newsletter subscription. Renews Aug 6, 2026.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                  {lennyPassSubs.map((s) => {
                    const days = daysUntil(s.next_renewal_date);
                    return (
                      <div
                        key={s.id}
                        className="bg-gray-900 rounded-lg border border-gray-800 px-4 py-2.5 flex items-center justify-between"
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
            )}
          </>
        )}

        {/* ===== ALL SUBSCRIPTIONS TAB ===== */}
        {activeTab === "all" && (
          <div className="mb-8">
            {/* Search + Add */}
            <div className="mb-4 flex items-center gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search subscriptions..."
                className="bg-gray-900 text-sm rounded-lg px-4 py-2.5 w-full max-w-md border border-gray-800 focus:border-amber-500/50 focus:outline-none transition-colors"
              />
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 text-sm rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors whitespace-nowrap"
              >
                + Add
              </button>
            </div>

            {/* Table */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="w-8 px-3 py-3"></th>
                    <th className="text-left px-4 py-3">Service</th>
                    <th className="text-left px-4 py-3">Cost</th>
                    <th className="text-left px-4 py-3">Next Renewal</th>
                    <th className="text-left px-4 py-3">Decision</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredSubs.map((s) => (
                    <SubscriptionRow
                      key={s.id}
                      sub={s}
                      userEmail={session?.user?.email || null}
                      userName={session?.user?.name || null}
                      onUpdate={() => router.refresh()}
                    />
                  ))}
                  {filteredSubs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        {search ? `No subscriptions matching "${search}"` : "No subscriptions"}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Cancelled Subscriptions */}
            {canceledSubs.length > 0 && (
              <div className="mt-6">
                <button
                  onClick={() => setShowCancelled(!showCancelled)}
                  className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-300 transition-colors mb-3"
                >
                  <svg
                    className={`w-3 h-3 transition-transform ${showCancelled ? "rotate-90" : ""}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  Cancelled ({canceledSubs.length}) -- ${moneySaved.toFixed(2)}/yr saved
                </button>
                {showCancelled && (
                  <div className="bg-gray-900/50 rounded-xl border border-gray-800/50 overflow-hidden opacity-70">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-gray-800 text-gray-400">
                          <th className="w-8 px-3 py-3"></th>
                          <th className="text-left px-4 py-3">Service</th>
                          <th className="text-left px-4 py-3">Cost</th>
                          <th className="text-left px-4 py-3">Cancelled</th>
                          <th className="text-left px-4 py-3">Decision</th>
                        </tr>
                      </thead>
                      <tbody>
                        {canceledSubs.map((s) => (
                          <SubscriptionRow
                            key={s.id}
                            sub={s}
                            userEmail={session?.user?.email || null}
                            userName={session?.user?.name || null}
                            onUpdate={() => router.refresh()}
                          />
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* ===== TAX & EXPENSES TAB ===== */}
        {activeTab === "tax" && (
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-semibold">Tax & Expense Summary</h2>
              <a
                href="/api/export"
                className="text-sm bg-gray-800 hover:bg-gray-700 px-4 py-2 rounded-lg border border-gray-700 transition"
              >
                Export CSV for Tax
              </a>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="text-sm text-gray-400">Business Deductible</div>
                <div className="text-2xl font-bold text-green-400 mt-1">
                  ${bizDeductible.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  annualized deductible expenses
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="text-sm text-gray-400">
                  Personal (Non-deductible)
                </div>
                <div className="text-2xl font-bold mt-1">
                  ${personalSpend.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  annualized personal expenses
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="text-sm text-gray-400">Costs Still TBD</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">
                  {costsTBD.length}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  subscriptions need cost lookup
                </div>
              </div>
            </div>

            {/* Deductible subscriptions detail */}
            <h3 className="text-sm font-medium text-gray-400 mb-3">Deductible Subscriptions</h3>
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="text-left px-4 py-3">Service</th>
                    <th className="text-left px-4 py-3">Tax Category</th>
                    <th className="text-left px-4 py-3">Expense Type</th>
                    <th className="text-right px-4 py-3">Annualized</th>
                  </tr>
                </thead>
                <tbody>
                  {subscriptions
                    .filter(
                      (s) =>
                        s.expense_type &&
                        s.expense_type !== "personal" &&
                        s.tax_category !== "none"
                    )
                    .sort(
                      (a, b) =>
                        annualize(b.cost, b.billing_cycle) -
                        annualize(a.cost, a.billing_cycle)
                    )
                    .map((s) => (
                      <tr
                        key={s.id}
                        className="border-b border-gray-800/50"
                      >
                        <td className="px-4 py-2.5 font-medium">{s.service_name}</td>
                        <td className="px-4 py-2.5 text-gray-400">
                          {s.tax_category?.replace(/-/g, " ")}
                        </td>
                        <td className="px-4 py-2.5 text-gray-400">
                          {s.expense_type?.replace(/-/g, " ")}
                        </td>
                        <td className="px-4 py-2.5 text-right text-green-400">
                          ${annualize(s.cost, s.billing_cycle).toFixed(2)}
                        </td>
                      </tr>
                    ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="text-center text-xs text-gray-600 py-8">
          subtrackt -- built by Kate Makrigiannis with Claude Code + Neon
        </div>
      </div>
      {showAddModal && (
        <AddSubscriptionModal
          onClose={() => setShowAddModal(false)}
          onSuccess={() => {
            setShowAddModal(false);
            router.refresh();
          }}
        />
      )}
      {showNotificationSettings && (
        <NotificationSettings onClose={() => setShowNotificationSettings(false)} />
      )}
    </main>
  );
}
