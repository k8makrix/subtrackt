"use client";

import { useState } from "react";

type Subscription = {
  id: number;
  service_name: string;
  cost: string | null;
  billing_cycle: string | null;
  category: string | null;
  next_renewal_date: string | null;
  tax_deductible: string | null;
  keep_cancel_review: string | null;
  payment_source: string | null;
  covered_by: string | null;
  status: string | null;
  tax_category: string | null;
  expense_type: string | null;
};

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
}: {
  sub: Subscription;
  userEmail: string | null;
  userName: string | null;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [newNote, setNewNote] = useState("");
  const [decision, setDecision] = useState(sub.keep_cancel_review);
  const [paymentSource, setPaymentSource] = useState(sub.payment_source || "personal");
  const [coveredBy, setCoveredBy] = useState(sub.covered_by || "");
  const [taxCategory, setTaxCategory] = useState(sub.tax_category || "none");
  const [expenseType, setExpenseType] = useState(sub.expense_type || "personal");
  const [saving, setSaving] = useState(false);

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
    setSaving(true);
    await fetch(`/api/subscriptions/${sub.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ [field]: value }),
    });
    setSaving(false);
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
        className="border-b border-gray-800/50 hover:bg-gray-800/30 cursor-pointer"
        onClick={toggleExpand}
      >
        <td className="px-4 py-3 font-medium">{sub.service_name}</td>
        <td className="px-4 py-3">
          {sub.cost ? `$${parseFloat(sub.cost).toFixed(2)}` : "TBD"}
        </td>
        <td className="px-4 py-3 text-gray-400">{sub.billing_cycle}</td>
        <td className="px-4 py-3">
          <span className="text-xs bg-gray-800 px-2 py-0.5 rounded-full">
            {sub.category}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={urgencyColor(days)}>
            {sub.next_renewal_date
              ? `${formatDate(sub.next_renewal_date)} (${days}d)`
              : "TBD"}
          </span>
        </td>
        <td className="px-4 py-3">
          <span className={`text-xs px-2 py-0.5 rounded-full ${
            paymentSource === "work"
              ? "bg-blue-900/50 text-blue-300"
              : paymentSource === "credit-card"
                ? "bg-purple-900/50 text-purple-300"
                : "bg-gray-800 text-gray-400"
          }`}>
            {paymentSource}
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
          <td colSpan={7} className="bg-gray-900/80 px-6 py-4">
            <div className="grid grid-cols-3 gap-4 mb-4">
              {/* Decision */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Decision</label>
                <select
                  value={decision || "review"}
                  onChange={(e) => {
                    setDecision(e.target.value);
                    updateField("keep_cancel_review", e.target.value);
                  }}
                  className="bg-gray-800 text-sm rounded px-3 py-1.5 w-full border border-gray-700"
                >
                  <option value="review">Review</option>
                  <option value="keep">Keep</option>
                  <option value="cancel">Cancel</option>
                </select>
              </div>
              {/* Payment Source */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Paid By</label>
                <select
                  value={paymentSource}
                  onChange={(e) => {
                    setPaymentSource(e.target.value);
                    updateField("payment_source", e.target.value);
                  }}
                  className="bg-gray-800 text-sm rounded px-3 py-1.5 w-full border border-gray-700"
                >
                  <option value="personal">Personal</option>
                  <option value="work">Work</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="lenny-pass">Lenny Pass</option>
                </select>
              </div>
              {/* Covered By */}
              <div>
                <label className="text-xs text-gray-500 block mb-1">Covered By (card/account)</label>
                <input
                  type="text"
                  value={coveredBy}
                  onChange={(e) => setCoveredBy(e.target.value)}
                  onBlur={() => updateField("covered_by", coveredBy)}
                  placeholder="e.g. Chase Sapphire, Artium card"
                  className="bg-gray-800 text-sm rounded px-3 py-1.5 w-full border border-gray-700"
                />
              </div>
            </div>

            {/* Tax & Expense */}
            <div className="grid grid-cols-3 gap-4 mb-4">
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
                <div className={`text-xs px-3 py-2 rounded-lg w-full text-center ${
                  expenseType !== "personal" && taxCategory !== "none"
                    ? "bg-green-900/30 text-green-400 border border-green-800/50"
                    : "bg-gray-800/50 text-gray-500"
                }`}>
                  {expenseType !== "personal" && taxCategory !== "none"
                    ? "Deductible"
                    : "Not deductible"}
                </div>
              </div>
            </div>

            {/* Notes */}
            <div>
              <div className="text-xs text-gray-500 mb-2">
                Notes & Questions {saving && <span className="text-amber-400 ml-2">Saving...</span>}
              </div>
              {notes.map((n) => (
                <div key={n.id} className="bg-gray-800/50 rounded px-3 py-2 mb-2 text-sm">
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
                    placeholder="Add a note or question..."
                    className="bg-gray-800 text-sm rounded px-3 py-1.5 flex-1 border border-gray-700"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      addNote();
                    }}
                    className="bg-amber-600 text-white text-sm px-3 py-1.5 rounded hover:bg-amber-500"
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
