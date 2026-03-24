type RenewalAlertData = {
  serviceName: string;
  cost: string | null;
  billingCycle: string | null;
  renewalDate: string;
  daysUntil: number;
  decision: string | null;
  appUrl: string;
};

type StaleReviewAlertData = {
  serviceName: string;
  cost: string | null;
  billingCycle: string | null;
  daysInReview: number;
  renewalDate: string | null;
  appUrl: string;
};

type DigestSubscription = {
  serviceName: string;
  cost: string | null;
  billingCycle: string | null;
  renewalDate: string;
  daysUntil: number;
};

type StaleReviewDigestItem = {
  serviceName: string;
  daysInReview: number;
  cost: string | null;
  billingCycle: string | null;
};

type WeeklyDigestData = {
  subscriptions: DigestSubscription[];
  totalUpcoming: number;
  reviewCount: number;
  staleReviews: StaleReviewDigestItem[];
  appUrl: string;
};

function urgencyLabel(days: number): string {
  if (days === 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
}

function formatCost(cost: string | null, cycle: string | null): string {
  if (!cost) return "TBD";
  return `$${parseFloat(cost).toFixed(2)}/${cycle || "?"}`;
}

function formatDateShort(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

const baseStyles = `
  body { margin: 0; padding: 0; background: #030712; color: #e5e7eb; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; }
  .container { max-width: 560px; margin: 0 auto; padding: 32px 24px; }
  .logo { font-size: 24px; font-weight: 700; color: #e5e7eb; }
  .logo span { color: #fbbf24; }
  .card { background: #111827; border: 1px solid #1f2937; border-radius: 12px; padding: 24px; margin: 24px 0; }
  .label { font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; margin-bottom: 4px; }
  .value { font-size: 16px; color: #f3f4f6; margin-bottom: 16px; }
  .highlight { color: #fbbf24; font-weight: 600; }
  .urgent { color: #f87171; font-weight: 600; }
  .btn { display: inline-block; background: #fbbf24; color: #030712; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; font-size: 14px; }
  .footer { margin-top: 32px; font-size: 12px; color: #6b7280; text-align: center; }
  .footer a { color: #9ca3af; }
  table { width: 100%; border-collapse: collapse; }
  th { text-align: left; padding: 8px 12px; font-size: 12px; color: #9ca3af; text-transform: uppercase; letter-spacing: 0.05em; border-bottom: 1px solid #1f2937; }
  td { padding: 10px 12px; font-size: 14px; color: #e5e7eb; border-bottom: 1px solid #111827; }
`;

export function renewalAlertSubject(data: RenewalAlertData): string {
  return `${data.serviceName} renews ${urgencyLabel(data.daysUntil)} — ${formatCost(data.cost, data.billingCycle)}`;
}

export function renewalAlertHtml(data: RenewalAlertData): string {
  const urgencyClass = data.daysUntil <= 3 ? "urgent" : "highlight";

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>${baseStyles}</style></head>
<body>
<div class="container">
  <div class="logo">sub<span>trackt</span></div>
  <div class="card">
    <div class="label">Subscription</div>
    <div class="value" style="font-size: 20px; font-weight: 600;">${data.serviceName}</div>
    <div class="label">Renews</div>
    <div class="value"><span class="${urgencyClass}">${urgencyLabel(data.daysUntil)}</span> &mdash; ${formatDateShort(data.renewalDate)}</div>
    <div class="label">Cost</div>
    <div class="value">${formatCost(data.cost, data.billingCycle)}</div>
    <div class="label">Your Decision</div>
    <div class="value" style="margin-bottom: 0;">${data.decision || "Not set"}</div>
  </div>
  <div style="text-align: center;">
    <a href="${data.appUrl}" class="btn">Open subtrackt</a>
  </div>
  <div class="footer">
    <p>You're receiving this because you enabled renewal alerts in subtrackt.</p>
    <p><a href="${data.appUrl}">Manage notification preferences</a></p>
  </div>
</div>
</body></html>`;
}

export function weeklyDigestSubject(): string {
  return "Your upcoming renewals — subtrackt";
}

export function weeklyDigestHtml(data: WeeklyDigestData): string {
  const rows = data.subscriptions
    .map(
      (s) =>
        `<tr>
          <td style="font-weight: 500;">${s.serviceName}</td>
          <td>${formatCost(s.cost, s.billingCycle)}</td>
          <td>${formatDateShort(s.renewalDate)}</td>
          <td><span class="${s.daysUntil <= 3 ? "urgent" : s.daysUntil <= 7 ? "highlight" : ""}">${s.daysUntil}d</span></td>
        </tr>`
    )
    .join("");

  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>${baseStyles}</style></head>
<body>
<div class="container">
  <div class="logo">sub<span>trackt</span></div>
  <div class="card">
    <div class="label">Upcoming Renewals (next 14 days)</div>
    <div class="value" style="font-size: 20px;"><span class="highlight">${data.subscriptions.length}</span> subscription${data.subscriptions.length !== 1 ? "s" : ""} &mdash; $${data.totalUpcoming.toFixed(2)} total</div>
    ${data.reviewCount > 0 ? `<div style="color: #fbbf24; font-size: 13px; margin-bottom: 16px;">${data.reviewCount} still marked "review" — time to decide?</div>` : ""}
    <table>
      <thead><tr><th>Service</th><th>Cost</th><th>Renews</th><th></th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
  </div>
  ${data.staleReviews.length > 0 ? `<div class="card" style="border-color: #92400e;">
    <div class="label">Stale Reviews (30+ days)</div>
    <div style="color: #fbbf24; font-size: 13px; margin-bottom: 12px;">${data.staleReviews.length} subscription${data.staleReviews.length !== 1 ? "s" : ""} waiting for a decision</div>
    <table>
      <thead><tr><th>Service</th><th>Cost</th><th>Days in Review</th></tr></thead>
      <tbody>${data.staleReviews.map((s) => `<tr><td style="font-weight: 500;">${s.serviceName}</td><td>${formatCost(s.cost, s.billingCycle)}</td><td><span class="highlight">${s.daysInReview}d</span></td></tr>`).join("")}</tbody>
    </table>
  </div>` : ""}
  <div style="text-align: center;">
    <a href="${data.appUrl}" class="btn">Open subtrackt</a>
  </div>
  <div class="footer">
    <p>Weekly digest from subtrackt.</p>
    <p><a href="${data.appUrl}">Manage notification preferences</a></p>
  </div>
</div>
</body></html>`;
}

// Stale review alert
export function staleReviewAlertSubject(data: StaleReviewAlertData): string {
  return `${data.serviceName} has been in review for ${data.daysInReview} days — time to decide?`;
}

export function staleReviewAlertHtml(data: StaleReviewAlertData): string {
  return `<!DOCTYPE html>
<html><head><meta charset="utf-8"><style>${baseStyles}</style></head>
<body>
<div class="container">
  <div class="logo">sub<span>trackt</span></div>
  <div class="card">
    <div class="label">Subscription</div>
    <div class="value" style="font-size: 20px; font-weight: 600;">${data.serviceName}</div>
    <div class="label">In Review For</div>
    <div class="value"><span class="highlight">${data.daysInReview} days</span></div>
    <div class="label">Cost</div>
    <div class="value">${formatCost(data.cost, data.billingCycle)}</div>
    ${data.renewalDate ? `<div class="label">Next Renewal</div><div class="value" style="margin-bottom: 0;">${formatDateShort(data.renewalDate)}</div>` : `<div class="value" style="margin-bottom: 0; color: #9ca3af;">No renewal date set</div>`}
  </div>
  <div style="text-align: center;">
    <a href="${data.appUrl}" class="btn">Make a Decision</a>
  </div>
  <div class="footer">
    <p>You're receiving this because you enabled stale review reminders in subtrackt.</p>
    <p><a href="${data.appUrl}">Manage notification preferences</a></p>
  </div>
</div>
</body></html>`;
}

export function staleReviewAlertSlack(data: StaleReviewAlertData): string {
  return [
    `⏳ *${data.serviceName}* has been in review for ${data.daysInReview} days`,
    `Cost: ${formatCost(data.cost, data.billingCycle)}${data.renewalDate ? ` | Renews: ${formatDateShort(data.renewalDate)}` : ""}`,
    `<${data.appUrl}|Make a decision in subtrackt>`,
  ].join("\n");
}

// Slack message formatters
export function renewalAlertSlack(data: RenewalAlertData): string {
  return [
    `*${data.serviceName}* renews ${urgencyLabel(data.daysUntil)} (${formatDateShort(data.renewalDate)})`,
    `Cost: ${formatCost(data.cost, data.billingCycle)} | Decision: ${data.decision || "Not set"}`,
    `<${data.appUrl}|Open subtrackt>`,
  ].join("\n");
}

export function weeklyDigestSlack(data: WeeklyDigestData): string {
  const lines = data.subscriptions.map(
    (s) => `• *${s.serviceName}* — ${formatCost(s.cost, s.billingCycle)} — ${s.daysUntil}d`
  );

  const staleLines = data.staleReviews.map(
    (s) => `• *${s.serviceName}* — ${formatCost(s.cost, s.billingCycle)} — ${s.daysInReview}d in review`
  );

  return [
    `*Upcoming Renewals (next 14 days)*`,
    `${data.subscriptions.length} subs — $${data.totalUpcoming.toFixed(2)} total`,
    ...(data.reviewCount > 0 ? [`⚠️ ${data.reviewCount} still marked "review"`] : []),
    "",
    ...lines,
    ...(staleLines.length > 0 ? ["", `*⏳ Stale Reviews (30+ days)*`, ...staleLines] : []),
    "",
    `<${data.appUrl}|Open subtrackt>`,
  ].join("\n");
}
