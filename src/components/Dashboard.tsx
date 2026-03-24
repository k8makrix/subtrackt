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
type SortField = "service" | "cost" | "renewal" | "decision";
type SortDirection = "asc" | "desc";
type Filters = {
  decision: string;
  category: string;
  billing: string;
  payment: string;
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
  const [taxYear, setTaxYear] = useState<string>(new Date().getFullYear().toString());
  const [sortField, setSortField] = useState<SortField>("renewal");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filters, setFilters] = useState<Filters>({
    decision: "all",
    category: "all",
    billing: "all",
    payment: "all",
  });

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

  const staleReviewCount = useMemo(() => {
    return needsReview.filter((s) => {
      if (!s.decision_changed_at) return false;
      const daysSince = Math.floor(
        (Date.now() - new Date(s.decision_changed_at).getTime()) / (1000 * 60 * 60 * 24)
      );
      return daysSince >= 30;
    }).length;
  }, [needsReview]);

  const costsTBD = subscriptions.filter(
    (s) => !s.cost && s.status === "active"
  );

  const filteredSubs = useMemo(() => {
    let all = [...activeSubs, ...lennyPassSubs];
    if (search.trim()) {
      const q = search.toLowerCase();
      all = all.filter(
        (s) =>
          s.service_name.toLowerCase().includes(q) ||
          s.category?.toLowerCase().includes(q)
      );
    }
    if (filters.decision !== "all") {
      all = all.filter((s) => s.keep_cancel_review === filters.decision);
    }
    if (filters.category !== "all") {
      all = all.filter((s) => s.category === filters.category);
    }
    if (filters.billing !== "all") {
      all = all.filter((s) => s.billing_cycle === filters.billing);
    }
    if (filters.payment !== "all") {
      all = all.filter((s) => s.payment_source === filters.payment);
    }
    return all;
  }, [activeSubs, lennyPassSubs, search, filters]);

  const sortedSubs = useMemo(() => {
    const sorted = [...filteredSubs];
    sorted.sort((a, b) => {
      let cmp = 0;
      switch (sortField) {
        case "service":
          cmp = a.service_name.localeCompare(b.service_name);
          break;
        case "cost": {
          const ca = annualize(a.cost, a.billing_cycle);
          const cb = annualize(b.cost, b.billing_cycle);
          if (!a.cost && b.cost) return 1;
          if (a.cost && !b.cost) return -1;
          cmp = ca - cb;
          break;
        }
        case "renewal": {
          if (!a.next_renewal_date && !b.next_renewal_date) cmp = 0;
          else if (!a.next_renewal_date) return 1;
          else if (!b.next_renewal_date) return -1;
          else cmp = new Date(a.next_renewal_date).getTime() - new Date(b.next_renewal_date).getTime();
          break;
        }
        case "decision": {
          const order: Record<string, number> = { keep: 0, review: 1, cancel: 2 };
          const da = order[a.keep_cancel_review || ""] ?? 3;
          const db = order[b.keep_cancel_review || ""] ?? 3;
          cmp = da - db;
          break;
        }
      }
      return sortDirection === "asc" ? cmp : -cmp;
    });
    return sorted;
  }, [filteredSubs, sortField, sortDirection]);

  const filterOptions = useMemo(() => {
    const all = [...activeSubs, ...lennyPassSubs];
    const categories = [...new Set(all.map((s) => s.category).filter(Boolean))].sort() as string[];
    const payments = [...new Set(all.map((s) => s.payment_source).filter(Boolean))].sort() as string[];
    return { categories, payments };
  }, [activeSubs, lennyPassSubs]);

  const activeFilterCount = [filters.decision, filters.category, filters.billing, filters.payment].filter((v) => v !== "all").length;

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

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

  const availableYears = useMemo(() => {
    const years = new Set<number>();
    years.add(new Date().getFullYear());
    subscriptions.forEach((s) => {
      if (s.signup_date) years.add(new Date(s.signup_date).getFullYear());
      if (s.canceled_at) years.add(new Date(s.canceled_at).getFullYear());
    });
    return Array.from(years).sort((a, b) => b - a);
  }, [subscriptions]);

  const taxFilteredSubs = useMemo(() => {
    if (taxYear === "all") return subscriptions;
    const y = parseInt(taxYear);
    const yearStart = new Date(`${y}-01-01`);
    const yearEnd = new Date(`${y}-12-31`);
    return subscriptions.filter((s) => {
      const signup = s.signup_date ? new Date(s.signup_date) : null;
      const canceled = s.canceled_at ? new Date(s.canceled_at) : null;
      if (signup && signup > yearEnd) return false;
      if (canceled && canceled < yearStart) return false;
      return s.status === "active" || s.status === "canceled";
    });
  }, [subscriptions, taxYear]);

  const taxBizDeductible = useMemo(() => {
    return taxFilteredSubs
      .filter((s) => s.expense_type && s.expense_type !== "personal" && s.tax_category !== "none")
      .reduce((sum, s) => sum + annualize(s.cost, s.billing_cycle), 0);
  }, [taxFilteredSubs]);

  const taxPersonalSpend = useMemo(() => {
    return taxFilteredSubs
      .filter((s) => !s.expense_type || s.expense_type === "personal")
      .reduce((sum, s) => sum + annualize(s.cost, s.billing_cycle), 0);
  }, [taxFilteredSubs]);

  const taxCostsTBD = useMemo(() => {
    return taxFilteredSubs.filter((s) => !s.cost && s.status === "active");
  }, [taxFilteredSubs]);

  const tabs: { key: Tab; label: string }[] = [
    { key: "dashboard", label: "Dashboard" },
    { key: "all", label: `All Subscriptions (${activeFilterCount > 0 || search ? `${sortedSubs.length}/` : ""}${activeSubs.length + lennyPassSubs.length})` },
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
                {staleReviewCount > 0 && (
                  <div className="text-xs text-amber-400/70 mt-1">
                    {staleReviewCount} stale (30+ days)
                  </div>
                )}
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
                <div className="flex items-center justify-between mb-3">
                  <h2 className="text-base font-semibold text-red-400">
                    Upcoming Renewals (next 30 days)
                  </h2>
                  <a
                    href="/api/export/calendar"
                    className="flex items-center gap-1.5 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors text-gray-300"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    Export to Calendar
                  </a>
                </div>
                <div className="space-y-2">
                  {urgentRenewals.map((s) => {
                    const days = daysUntil(s.next_renewal_date);
                    return (
                      <div
                        key={s.id}
                        className="flex items-center justify-between bg-gray-900/50 rounded-lg px-4 py-2"
                      >
                        <span className="font-medium text-sm">
                          {s.service_name}
                          {s.keep_cancel_review === "review" && s.decision_changed_at && Math.floor((Date.now() - new Date(s.decision_changed_at).getTime()) / (1000 * 60 * 60 * 24)) >= 30 && (
                            <span className="ml-2 text-xs text-amber-400/80 bg-amber-400/10 px-1.5 py-0.5 rounded">stale review</span>
                          )}
                        </span>
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
              <a
                href="/api/export/calendar"
                className="flex items-center gap-1.5 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-2.5 rounded-lg border border-gray-700 transition-colors text-gray-300 whitespace-nowrap"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                Export Calendar
              </a>
              <button
                onClick={() => setShowAddModal(true)}
                className="px-4 py-2.5 text-sm rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors whitespace-nowrap"
              >
                + Add
              </button>
            </div>

            {/* Filter Bar */}
            <div className="mb-4 flex items-center gap-2 flex-wrap">
              <select
                value={filters.decision}
                onChange={(e) => setFilters((f) => ({ ...f, decision: e.target.value }))}
                className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:border-amber-500/50 focus:outline-none"
              >
                <option value="all">All Decisions</option>
                <option value="keep">Keep</option>
                <option value="review">Review</option>
                <option value="cancel">Cancel</option>
              </select>
              <select
                value={filters.category}
                onChange={(e) => setFilters((f) => ({ ...f, category: e.target.value }))}
                className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:border-amber-500/50 focus:outline-none"
              >
                <option value="all">All Categories</option>
                {filterOptions.categories.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
              <select
                value={filters.billing}
                onChange={(e) => setFilters((f) => ({ ...f, billing: e.target.value }))}
                className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:border-amber-500/50 focus:outline-none"
              >
                <option value="all">All Billing</option>
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="6-month">6-month</option>
              </select>
              <select
                value={filters.payment}
                onChange={(e) => setFilters((f) => ({ ...f, payment: e.target.value }))}
                className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:border-amber-500/50 focus:outline-none"
              >
                <option value="all">All Payments</option>
                {filterOptions.payments.map((p) => (
                  <option key={p} value={p}>{p}</option>
                ))}
              </select>
              {activeFilterCount > 0 && (
                <button
                  onClick={() => setFilters({ decision: "all", category: "all", billing: "all", payment: "all" })}
                  className="text-xs text-amber-400 hover:text-amber-300 transition-colors ml-1"
                >
                  Clear filters ({activeFilterCount})
                </button>
              )}
            </div>

            {/* Table */}
            <div className="bg-gray-900 rounded-xl border border-gray-800 overflow-hidden">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-800 text-gray-400">
                    <th className="w-8 px-3 py-3"></th>
                    {([
                      { field: "service" as SortField, label: "Service" },
                      { field: "cost" as SortField, label: "Cost" },
                      { field: "renewal" as SortField, label: "Next Renewal" },
                      { field: "decision" as SortField, label: "Decision" },
                    ]).map(({ field, label }) => (
                      <th
                        key={field}
                        className="text-left px-4 py-3 cursor-pointer select-none hover:text-gray-200 transition-colors"
                        onClick={() => handleSort(field)}
                      >
                        <span className="inline-flex items-center gap-1">
                          {label}
                          {sortField === field ? (
                            <svg className="w-3 h-3 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              {sortDirection === "asc" ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                              ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                              )}
                            </svg>
                          ) : (
                            <svg className="w-3 h-3 opacity-30" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                            </svg>
                          )}
                        </span>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {sortedSubs.map((s) => (
                    <SubscriptionRow
                      key={s.id}
                      sub={s}
                      userEmail={session?.user?.email || null}
                      userName={session?.user?.name || null}
                      onUpdate={() => router.refresh()}
                    />
                  ))}
                  {sortedSubs.length === 0 && (
                    <tr>
                      <td colSpan={5} className="px-4 py-8 text-center text-gray-500">
                        {search || activeFilterCount > 0 ? "No subscriptions match your filters" : "No subscriptions"}
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
              <div className="flex items-center gap-3">
                <h2 className="text-base font-semibold">Tax & Expense Summary</h2>
                <select
                  value={taxYear}
                  onChange={(e) => setTaxYear(e.target.value)}
                  className="bg-gray-800 text-gray-300 border border-gray-700 rounded-lg px-3 py-1.5 text-sm focus:border-amber-500/50 focus:outline-none"
                >
                  {availableYears.map((y) => (
                    <option key={y} value={y}>{y}</option>
                  ))}
                  <option value="all">All Time</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <a
                  href={`/api/export?year=${taxYear}`}
                  className="text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors text-gray-300"
                >
                  Export CSV
                </a>
                <a
                  href={`/api/export/tax-pdf?year=${taxYear}`}
                  className="flex items-center gap-1.5 text-sm bg-gray-800 hover:bg-gray-700 px-3 py-1.5 rounded-lg border border-gray-700 transition-colors text-gray-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  Export PDF
                </a>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="text-sm text-gray-400">Business Deductible</div>
                <div className="text-2xl font-bold text-green-400 mt-1">
                  ${taxBizDeductible.toFixed(2)}
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
                  ${taxPersonalSpend.toFixed(2)}
                </div>
                <div className="text-xs text-gray-500 mt-1">
                  annualized personal expenses
                </div>
              </div>
              <div className="bg-gray-900 rounded-xl p-5 border border-gray-800">
                <div className="text-sm text-gray-400">Costs Still TBD</div>
                <div className="text-2xl font-bold text-amber-400 mt-1">
                  {taxCostsTBD.length}
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
                  {taxFilteredSubs
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
