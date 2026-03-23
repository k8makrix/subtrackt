"use client";

import { useState, useEffect } from "react";

type Props = {
  onClose: () => void;
};

type Preferences = {
  alert_7_days: boolean;
  alert_3_days: boolean;
  alert_day_of: boolean;
  weekly_digest: boolean;
  digest_day: string;
  email_enabled: boolean;
  slack_enabled: boolean;
  slack_webhook_url: string | null;
};

const DAYS = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function NotificationSettings({ onClose }: Props) {
  const [prefs, setPrefs] = useState<Preferences | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saveState, setSaveState] = useState<"idle" | "saved" | "error">("idle");

  useEffect(() => {
    fetch("/api/notification-preferences")
      .then((r) => r.json())
      .then((data) => {
        setPrefs(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  async function handleSave() {
    if (!prefs) return;
    setSaving(true);
    setSaveState("idle");

    try {
      const res = await fetch("/api/notification-preferences", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(prefs),
      });

      if (!res.ok) throw new Error("Failed to save");

      const updated = await res.json();
      setPrefs(updated);
      setSaveState("saved");
      setTimeout(() => setSaveState("idle"), 2000);
    } catch {
      setSaveState("error");
    } finally {
      setSaving(false);
    }
  }

  function toggle(key: keyof Preferences) {
    if (!prefs) return;
    setPrefs({ ...prefs, [key]: !prefs[key] });
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/60" onClick={onClose} />
      <div className="relative bg-gray-900 border border-gray-800 rounded-xl w-full max-w-md mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 border-b border-gray-800 flex items-center justify-between">
          <h2 className="text-lg font-semibold">Notification Settings</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-300 transition-colors text-xl leading-none"
          >
            &times;
          </button>
        </div>

        <div className="px-6 py-5 space-y-6">
          {loading ? (
            <div className="text-gray-500 text-sm text-center py-8">Loading...</div>
          ) : prefs ? (
            <>
              {/* Master toggle */}
              <div className="flex items-center justify-between">
                <div>
                  <div className="text-sm font-medium">Email Notifications</div>
                  <div className="text-xs text-gray-500">
                    Receive renewal alerts via email
                  </div>
                </div>
                <button
                  onClick={() => toggle("email_enabled")}
                  className={`relative w-11 h-6 rounded-full transition-colors ${
                    prefs.email_enabled ? "bg-amber-500" : "bg-gray-700"
                  }`}
                >
                  <span
                    className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                      prefs.email_enabled ? "translate-x-5" : ""
                    }`}
                  />
                </button>
              </div>

              {/* Alert thresholds */}
              <div
                className={
                  !prefs.email_enabled && !prefs.slack_enabled ? "opacity-40 pointer-events-none" : ""
                }
              >
                <div className="text-xs text-gray-400 uppercase tracking-wide mb-3">
                  Alert Thresholds
                </div>
                <div className="space-y-3">
                  {[
                    { key: "alert_7_days" as const, label: "7 days before renewal" },
                    { key: "alert_3_days" as const, label: "3 days before renewal" },
                    { key: "alert_day_of" as const, label: "Day of renewal" },
                  ].map(({ key, label }) => (
                    <label
                      key={key}
                      className="flex items-center gap-3 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={prefs[key]}
                        onChange={() => toggle(key)}
                        className="w-4 h-4 rounded border-gray-600 bg-gray-800 text-amber-500 focus:ring-amber-500/30 focus:ring-offset-0"
                      />
                      <span className="text-sm text-gray-300">{label}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Weekly digest */}
              <div
                className={
                  !prefs.email_enabled && !prefs.slack_enabled ? "opacity-40 pointer-events-none" : ""
                }
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium">Weekly Digest</div>
                    <div className="text-xs text-gray-500">
                      Summary of upcoming renewals
                    </div>
                  </div>
                  <button
                    onClick={() => toggle("weekly_digest")}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      prefs.weekly_digest ? "bg-amber-500" : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        prefs.weekly_digest ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
                {prefs.weekly_digest && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      Send on
                    </label>
                    <select
                      value={prefs.digest_day}
                      onChange={(e) =>
                        setPrefs({ ...prefs, digest_day: e.target.value })
                      }
                      className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors capitalize"
                    >
                      {DAYS.map((d) => (
                        <option key={d} value={d} className="capitalize">
                          {d.charAt(0).toUpperCase() + d.slice(1)}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Slack integration */}
              <div className="border-t border-gray-800 pt-5">
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <div className="text-sm font-medium">Slack Notifications</div>
                    <div className="text-xs text-gray-500">
                      Also send alerts to a Slack channel
                    </div>
                  </div>
                  <button
                    onClick={() => toggle("slack_enabled")}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      prefs.slack_enabled ? "bg-amber-500" : "bg-gray-700"
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform ${
                        prefs.slack_enabled ? "translate-x-5" : ""
                      }`}
                    />
                  </button>
                </div>
                {prefs.slack_enabled && (
                  <div>
                    <label className="block text-xs text-gray-400 mb-1.5">
                      Webhook URL
                    </label>
                    <input
                      type="url"
                      value={prefs.slack_webhook_url || ""}
                      onChange={(e) =>
                        setPrefs({
                          ...prefs,
                          slack_webhook_url: e.target.value || null,
                        })
                      }
                      placeholder="https://hooks.slack.com/services/..."
                      className="bg-gray-800 text-sm rounded-lg px-3 py-2 w-full border border-gray-700 focus:border-amber-500/50 focus:outline-none transition-colors"
                    />
                    <p className="text-xs text-gray-600 mt-1.5">
                      Create one at api.slack.com/messaging/webhooks
                    </p>
                  </div>
                )}
              </div>

              {/* Save */}
              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={onClose}
                  className="flex-1 px-4 py-2.5 text-sm rounded-lg border border-gray-700 text-gray-300 hover:bg-gray-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 px-4 py-2.5 text-sm rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-medium transition-colors disabled:opacity-50"
                >
                  {saving
                    ? "Saving..."
                    : saveState === "saved"
                    ? "Saved!"
                    : saveState === "error"
                    ? "Error — retry"
                    : "Save Preferences"}
                </button>
              </div>
            </>
          ) : (
            <div className="text-red-400 text-sm text-center py-8">
              Failed to load preferences
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
