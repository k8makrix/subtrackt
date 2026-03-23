"use client";

import { useState } from "react";
import type { Subscription } from "@/lib/types";

type Note = {
  id: number;
  user_email: string;
  user_name: string | null;
  note: string;
  note_type: string;
  created_at: string;
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

export function SubscriptionRow({
  sub,
  userEmail,
  userName,
  onUpdate,
}: {
  sub: Subscription;
  userEmail: string | null;
  userName: string | null;
  onUpdate?: () => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [decision, setDecision] = useState(sub.keep_cancel_review);
  const [paymentSource, setPaymentSource] = useState(sub.payment_source || "personal");
  const [coveredBy, setCoveredBy] = useState(sub.covered_by || "");
  const [taxCategory, setTaxCategory] = useState(sub.tax_category || "none");
  const [expenseType, setExpenseType] = useState(sub.expense_type || "personal");
  const [saveState, setSaveState] = useState<"idle" | "saving" | "saved">("idle");

  const days = daysUntil(sub.next_renewal_date);

  async function loadNotes() {
    const res = await fetch(`/api/subscriptions/${sub.id}/notes`);
    const data = await res.json();
    setNotes(data);
  }

  async function toggleExpand() {
    if (!expanded) await loadNotes();
    setExpanded(!expanded);
  }

  async function updateField(field: string, value: string) {
    setSaveState("saving");
    await fetch(`/api/subscriptions/${sub.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 1500);
  }

  async function updateFields(fields: Record<string, string | null>) {
    setSaveState("saving");
    await fetch(`/api/subscriptions/${sub.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(fields),
    });
    setSaveState("saved");
    setTimeout(() => setSaveState("idle"), 1500);
    onUpdate?.();
  }

  async function addNote() {
    if (!newNote.trim() || !userEmail) return;
    await fetch(`/api/subscriptions/${sub.id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_email: userEmail,
        user_name: userName,
        note: newNote,
      }),
    });
    setNewNote("");
    await loadNotes();
  }

  return (
    <>
      <tr
        className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer group"
        onClick={toggleExpand}
      >
        {/* Chevron */}
        <td className="px-3 py-3 text-gray-500">
          <svg
            className={`w-4 h-4 transition-transform ${expanded ? "rotate-90" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </td>
        <td className="px-4 py-3">
          <div className={`font-medium ${sub.status === "canceled" ? "line-through text-gray-500" : ""}`}>{sub.service_name}</div>
          {sub.category && (
            <div className="text-xs text-gray-500">{sub.category}</div>
          )}
        </td>
        <td className="px-4 py-3">
          {sub.cost ? (
            <div>
              <span>${parseFloat(sub.cost).toFixed(2)}</span>
              <span className="text-gray-500 text-xs ml-1">/{sub.billing_cycle === "monthly" ? "mo" : sub.billing_cycle === "annual" ? "yr" : sub.billing_cycle}</span>
            </div>
          ) : (
            <span className="text-gray-500">TBD</span>
          )}
        </td>
        <td className="px-4 py-3">
          <span className={urgencyColor(days)}>
            {sub.next_renewal_date
              ? `${formatDate(sub.next_renewal_date)} (${days}d)`
              : "TBD"}
          </span>
        </td>
        <td className="px-4 py-3">
          <span
            className={`text-xs px-2 py-0.5 rounded-full ${
              decision === "keep"
                ? "bg-green-900/50 text-green-300"
                : decision === "cancel"
                  ? "bg-red-900/50 text-red-300"
                  : "bg-amber-900/50 text-amber-300"
            }`}
          >
            {decision}
          </span>
        </td>
      </tr>
      {expanded && (
        <tr>
          <td colSpan={5} className="bg-gray-900/80 px-6 py-4">
            {/* Save indicator */}
            {saveState !== "idle" && (
              <div className={`text-xs mb-3 ${saveState === "saving" ? "text-amber-400" : "text-green-400"}`}>
                {saveState === "saving" ? "Saving..." : "Saved"}
              </div>
            )}

            {/* Decision & Payment */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Decision</label>
                <select
                  value={decision || "review"}
                  onChange={(e) => {
                    const newDecision = e.target.value;
                    setDecision(newDecision);
                    if (newDecision === "cancel") {
                      updateFields({
                        keep_cancel_review: "cancel",
                        status: "canceled",
                        canceled_at: new Date().toISOString(),
                      });
                    } else if (decision === "cancel") {
                      updateFields({
                        keep_cancel_review: newDecision,
                        status: "active",
                        canceled_at: null,
                      });
                    } else {
                      updateField("keep_cancel_review", newDecision);
                    }
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-800 text-sm rounded px-3 py-1.5 w-full border border-gray-700"
                >
                  <option value="review">Review</option>
                  <option value="keep">Keep</option>
                  <option value="cancel">Cancel</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Paid By</label>
                <select
                  value={paymentSource}
                  onChange={(e) => {
                    setPaymentSource(e.target.value);
                    updateField("payment_source", e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-800 text-sm rounded px-3 py-1.5 w-full border border-gray-700"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="lenny-pass">Lenny Pass</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="text-xs text-gray-500 block mb-1">Covered By</label>
                <input
                  type="text"
                  value={coveredBy}
                  onChange={(e) => setCoveredBy(e.target.value)}
                  onBlur={() => updateField("covered_by", coveredBy)}
                  onClick={(e) => e.stopPropagation()}
                  placeholder="e.g. Chase Sapphire, Apple Card"
                  className="bg-gray-800 text-sm rounded px-3 py-1.5 w-full border border-gray-700"
                />
              </div>
            </div>

            {/* Tax & Expense */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <label className="text-xs text-gray-500 block mb-1">Expense Type</label>
                <select
                  value={expenseType}
                  onChange={(e) => {
                    setExpenseType(e.target.value);
                    updateField("expense_type", e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-800 text-sm rounded px-3 py-1.5 w-full border border-gray-700"
                >
                  <option value="personal">Personal</option>
                  <option value="business-sole-prop">Business (Sole Prop / 1099)</option>
                  <option value="business-w2-unreimbursed">Business (W2 Unreimbursed)</option>
                  <option value="mixed">Mixed Use</option>
                </select>
              </div>
              <div>
                <label className="text-xs text-gray-500 block mb-1">Tax Category</label>
                <select
                  value={taxCategory}
                  onChange={(e) => {
                    setTaxCategory(e.target.value);
                    updateField("tax_category", e.target.value);
                  }}
                  onClick={(e) => e.stopPropagation()}
                  className="bg-gray-800 text-sm rounded px-3 py-1.5 w-full border border-gray-700"
                >
                  <option value="none">Not Deductible</option>
                  <option value="business-tools">Business Tools & Software</option>
                  <option value="professional-dev">Professional Development</option>
                  <option value="software">Software & SaaS</option>
                  <option value="web-hosting">Web Hosting & Domains</option>
                  <option value="hardware">Hardware & Equipment</option>
                  <option value="marketing">Marketing & Advertising</option>
                  <option value="insurance">Insurance</option>
                  <option value="healthcare">Healthcare</option>
                </select>
              </div>
              <div className="flex items-end">
                <div
                  className={`text-xs px-3 py-2 rounded-lg w-full text-center ${
                    expenseType !== "personal" && taxCategory !== "none"
                      ? "bg-green-900/30 text-green-400 border border-green-800/50"
                      : "bg-gray-800/50 text-gray-500"
                  }`}
                >
                  {expenseType !== "personal" && taxCategory !== "none"
                    ? "Deductible"
                    : "Not deductible"}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="text-xs text-gray-500 mb-2">Notes</div>
              {notes.map((n) => (
                <div
                  key={n.id}
                  className="bg-gray-800/50 rounded px-3 py-2 mb-2 text-sm"
                >
                  <div className="flex justify-between text-xs text-gray-500 mb-1">
                    <span>{n.user_name || n.user_email}</span>
                    <span>{new Date(n.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>{n.note}</div>
                </div>
              ))}
              {userEmail ? (
                <div className="flex gap-2 mt-2">
                  <input
                    type="text"
                    value={newNote}
                    onChange={(e) => setNewNote(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && addNote()}
                    placeholder="Add a note..."
                    className="bg-gray-800 text-sm rounded px-3 py-1.5 flex-1 border border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addNote();
                    }}
                    className="bg-amber-600 text-white text-sm px-3 py-1.5 rounded hover:bg-amber-500 transition-colors"
                  >
                    Add
                  </button>
                </div>
              ) : (
                <div className="text-xs text-gray-600 mt-2">
                  Sign in to leave notes
                </div>
              )}
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
