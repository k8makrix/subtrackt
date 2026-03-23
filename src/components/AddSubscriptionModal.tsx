"use client";

import { useState } from "react";

type Props = {
  onClose: () => void;
  onSuccess: () => void;
};

const INITIAL_FORM = {
  service_name: "",
  cost: "",
  billing_cycle: "monthly" as const,
  email_account: "",
  category: "",
  next_renewal_date: "",
  plan_name: "",
  plan_details: "",
  source: "",
  tax_deductible: "",
};

export function AddSubscriptionModal({ onClose, onSuccess }: Props) {
  const [form, setForm] = useState(INITIAL_FORM);
  const [showOptional, setShowOptional] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  function update(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const payload: Record<string, unknown> = {
        service_name: form.service_name,
        billing_cycle: form.billing_cycle,
      };

      if (form.cost) payload.cost = parseFloat(form.cost);
      if (form.email_account) payload.email_account = form.email_account;
      if (form.category) payload.category = form.category;
      if (form.next_renewal_date) payload.next_renewal_date = form.next_renewal_date;
      if (form.plan_name) payload.plan_name = form.plan_name;
      if (form.plan_details) payload.plan_details = form.plan_details;
      if (form.source) payload.source = form.source;
      if (form.tax_deductible) payload.tax_deductible = form.tax_deductible;

      const res = await fetch("/api/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error?.fieldErrors?.service_name?.[0] || "Failed to add subscription");
      }

      onSuccess();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Add Subscription</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
          {error && (
            <div className="bg-red-950/40 border border-red-900/50 text-red-400 text-sm rounded-lg px-4 py-2.5">
              {error}
            </div>
          )}

          {/* Required fields */}
          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Service Name <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              value={form.service_name}
              onChange={(e) => update("service_name", e.target.value)}
              placeholder="e.g. Netflix, Figma, AWS"
              required
              className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Cost
              </label>
              <input
                type="number"
                step="0.01"
                min="0"
                value={form.cost}
                onChange={(e) => update("cost", e.target.value)}
                placeholder="9.99"
                className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
              />
            </div>
            <div>
              <label className="block text-xs text-gray-400 mb-1.5">
                Billing Cycle
              </label>
              <select
                value={form.billing_cycle}
                onChange={(e) => update("billing_cycle", e.target.value)}
                className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
              >
                <option value="monthly">Monthly</option>
                <option value="annual">Annual</option>
                <option value="6-month">6-month</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs text-gray-400 mb-1.5">
              Next Renewal Date
            </label>
            <input
              type="date"
              value={form.next_renewal_date}
              onChange={(e) => update("next_renewal_date", e.target.value)}
              className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
            />
          </div>

          {/* Optional fields toggle */}
          <button
            type="button"
            onClick={() => setShowOptional(!showOptional)}
            className="text-xs text-gray-500 hover:text-amber-400 transition-colors"
          >
            {showOptional ? "Hide optional fields" : "Show optional fields"}
          </button>

          {showOptional && (
            <div className="space-y-3 pt-1">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Category</label>
                  <input
                    type="text"
                    value={form.category}
                    onChange={(e) => update("category", e.target.value)}
                    placeholder="e.g. Design, DevOps"
                    className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Email Account</label>
                  <input
                    type="email"
                    value={form.email_account}
                    onChange={(e) => update("email_account", e.target.value)}
                    placeholder="you@example.com"
                    className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Plan Name</label>
                  <input
                    type="text"
                    value={form.plan_name}
                    onChange={(e) => update("plan_name", e.target.value)}
                    placeholder="e.g. Pro, Team"
                    className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
                  />
                </div>
                <div>
                  <label className="block text-xs text-gray-400 mb-1.5">Source</label>
                  <input
                    type="text"
                    value={form.source}
                    onChange={(e) => update("source", e.target.value)}
                    placeholder="e.g. bank statement"
                    className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Plan Details</label>
                <input
                  type="text"
                  value={form.plan_details}
                  onChange={(e) => update("plan_details", e.target.value)}
                  placeholder="e.g. 5 seats, 100GB storage"
                  className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
                />
              </div>

              <div>
                <label className="block text-xs text-gray-400 mb-1.5">Tax Deductible</label>
                <select
                  value={form.tax_deductible}
                  onChange={(e) => update("tax_deductible", e.target.value)}
                  className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
                >
                  <option value="">Not set</option>
                  <option value="yes">Yes</option>
                  <option value="no">No</option>
                  <option value="partial">Partial</option>
                </select>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading || !form.service_name.trim()}
              className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Adding..." : "Add Subscription"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
