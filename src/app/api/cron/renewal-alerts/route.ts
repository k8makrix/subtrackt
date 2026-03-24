import { getDb } from "@/lib/db";
import { getResend } from "@/lib/resend";
import {
  renewalAlertSubject,
  renewalAlertHtml,
  renewalAlertSlack,
  staleReviewAlertSubject,
  staleReviewAlertHtml,
  staleReviewAlertSlack,
  weeklyDigestSubject,
  weeklyDigestHtml,
  weeklyDigestSlack,
} from "@/lib/email-templates";

const MAX_SENDS_PER_RUN = 50;
const FROM_EMAIL = "subtrackt <onboarding@resend.dev>";

type AlertThreshold = {
  days: number;
  prefKey: "alert_7_days" | "alert_3_days" | "alert_day_of";
  type: string;
};

const THRESHOLDS: AlertThreshold[] = [
  { days: 7, prefKey: "alert_7_days", type: "alert_7_days" },
  { days: 3, prefKey: "alert_3_days", type: "alert_3_days" },
  { days: 0, prefKey: "alert_day_of", type: "alert_day_of" },
];

async function sendSlack(webhookUrl: string, text: string): Promise<boolean> {
  try {
    const res = await fetch(webhookUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });
    return res.ok;
  } catch {
    return false;
  }
}

export async function GET(request: Request) {
  // Verify cron auth
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const sql = getDb();
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://subtrackt.vercel.app";

  // Get all users with notifications enabled
  const users = await sql`
    SELECT np.*, u.email, u.name
    FROM notification_preferences np
    JOIN "user" u ON np.user_id = u.id
    WHERE np.email_enabled = true OR np.slack_enabled = true
  `;

  let totalSent = 0;
  const results: string[] = [];

  for (const user of users) {
    if (totalSent >= MAX_SENDS_PER_RUN) break;

    // Process individual threshold alerts
    for (const threshold of THRESHOLDS) {
      if (totalSent >= MAX_SENDS_PER_RUN) break;
      if (!user[threshold.prefKey]) continue;

      // Find subscriptions due at this threshold, not already notified today
      const subs = await sql`
        SELECT s.* FROM subscriptions s
        WHERE s.user_id = ${user.user_id}
          AND s.status = 'active'
          AND s.next_renewal_date IS NOT NULL
          AND s.next_renewal_date::date - CURRENT_DATE = ${threshold.days}
          AND NOT EXISTS (
            SELECT 1 FROM notification_log nl
            WHERE nl.user_id = s.user_id
              AND nl.subscription_id = s.id
              AND nl.notification_type = ${threshold.type}
              AND nl.sent_date = CURRENT_DATE
          )
      `;

      for (const sub of subs) {
        if (totalSent >= MAX_SENDS_PER_RUN) break;

        const alertData = {
          serviceName: sub.service_name,
          cost: sub.cost,
          billingCycle: sub.billing_cycle,
          renewalDate: sub.next_renewal_date,
          daysUntil: threshold.days,
          decision: sub.keep_cancel_review,
          appUrl,
        };

        let sent = false;

        // Send email
        if (user.email_enabled) {
          try {
            await getResend().emails.send({
              from: FROM_EMAIL,
              to: user.email,
              subject: renewalAlertSubject(alertData),
              html: renewalAlertHtml(alertData),
            });
            sent = true;
          } catch (err) {
            results.push(`Email failed for ${sub.service_name}: ${err}`);
          }
        }

        // Send Slack
        if (user.slack_enabled && user.slack_webhook_url) {
          const slackOk = await sendSlack(
            user.slack_webhook_url,
            renewalAlertSlack(alertData)
          );
          if (slackOk) sent = true;
          else results.push(`Slack failed for ${sub.service_name}`);
        }

        if (sent) {
          // Log to prevent duplicates (one row per channel)
          if (user.email_enabled) {
            await sql`
              INSERT INTO notification_log (user_id, subscription_id, notification_type, channel, sent_date)
              VALUES (${user.user_id}, ${sub.id}, ${threshold.type}, 'email', CURRENT_DATE)
              ON CONFLICT DO NOTHING
            `;
          }
          if (user.slack_enabled && user.slack_webhook_url) {
            await sql`
              INSERT INTO notification_log (user_id, subscription_id, notification_type, channel, sent_date)
              VALUES (${user.user_id}, ${sub.id}, ${threshold.type}, 'slack', CURRENT_DATE)
              ON CONFLICT DO NOTHING
            `;
          }
          totalSent++;
          results.push(`Sent ${threshold.type} for ${sub.service_name} to ${user.email}`);
        }
      }
    }

    // Stale review reminders — subs in "review" for 30+ days, max once per week per sub
    if (user.stale_review_reminders && totalSent < MAX_SENDS_PER_RUN) {
      const staleSubs = await sql`
        SELECT s.* FROM subscriptions s
        WHERE s.user_id = ${user.user_id}
          AND s.keep_cancel_review = 'review'
          AND s.status = 'active'
          AND s.decision_changed_at IS NOT NULL
          AND CURRENT_DATE - s.decision_changed_at::date >= 30
          AND NOT EXISTS (
            SELECT 1 FROM notification_log nl
            WHERE nl.user_id = s.user_id
              AND nl.subscription_id = s.id
              AND nl.notification_type = 'stale_review'
              AND nl.sent_date > CURRENT_DATE - INTERVAL '7 days'
          )
      `;

      for (const sub of staleSubs) {
        if (totalSent >= MAX_SENDS_PER_RUN) break;

        const daysInReview = Math.floor(
          (Date.now() - new Date(sub.decision_changed_at).getTime()) / (1000 * 60 * 60 * 24)
        );

        const alertData = {
          serviceName: sub.service_name,
          cost: sub.cost,
          billingCycle: sub.billing_cycle,
          daysInReview,
          renewalDate: sub.next_renewal_date,
          appUrl,
        };

        let sent = false;

        if (user.email_enabled) {
          try {
            await getResend().emails.send({
              from: FROM_EMAIL,
              to: user.email,
              subject: staleReviewAlertSubject(alertData),
              html: staleReviewAlertHtml(alertData),
            });
            sent = true;
          } catch (err) {
            results.push(`Stale review email failed for ${sub.service_name}: ${err}`);
          }
        }

        if (user.slack_enabled && user.slack_webhook_url) {
          const slackOk = await sendSlack(
            user.slack_webhook_url,
            staleReviewAlertSlack(alertData)
          );
          if (slackOk) sent = true;
          else results.push(`Stale review Slack failed for ${sub.service_name}`);
        }

        if (sent) {
          if (user.email_enabled) {
            await sql`
              INSERT INTO notification_log (user_id, subscription_id, notification_type, channel, sent_date)
              VALUES (${user.user_id}, ${sub.id}, 'stale_review', 'email', CURRENT_DATE)
              ON CONFLICT DO NOTHING
            `;
          }
          if (user.slack_enabled && user.slack_webhook_url) {
            await sql`
              INSERT INTO notification_log (user_id, subscription_id, notification_type, channel, sent_date)
              VALUES (${user.user_id}, ${sub.id}, 'stale_review', 'slack', CURRENT_DATE)
              ON CONFLICT DO NOTHING
            `;
          }
          totalSent++;
          results.push(`Sent stale_review for ${sub.service_name} to ${user.email}`);
        }
      }
    }

    // Weekly digest — check if today matches the user's preferred day
    if (user.weekly_digest && totalSent < MAX_SENDS_PER_RUN) {
      const today = new Date()
        .toLocaleDateString("en-US", { weekday: "long" })
        .toLowerCase();

      if (today === user.digest_day) {
        // Check if digest already sent today (use subscription_id = 0 as sentinel)
        const alreadySent = await sql`
          SELECT 1 FROM notification_log
          WHERE user_id = ${user.user_id}
            AND subscription_id = 0
            AND notification_type = 'weekly_digest'
            AND sent_date = CURRENT_DATE
          LIMIT 1
        `;

        if (alreadySent.length === 0) {
          const upcoming = await sql`
            SELECT * FROM subscriptions
            WHERE user_id = ${user.user_id}
              AND status = 'active'
              AND next_renewal_date IS NOT NULL
              AND next_renewal_date::date - CURRENT_DATE BETWEEN 0 AND 14
            ORDER BY next_renewal_date ASC
          `;

          // Fetch stale reviews for digest (30+ days in review)
          const staleForDigest = await sql`
            SELECT service_name, cost, billing_cycle, decision_changed_at
            FROM subscriptions
            WHERE user_id = ${user.user_id}
              AND keep_cancel_review = 'review'
              AND status = 'active'
              AND decision_changed_at IS NOT NULL
              AND CURRENT_DATE - decision_changed_at::date >= 30
            ORDER BY decision_changed_at ASC
          `;

          const staleReviews = staleForDigest.map((s: Record<string, unknown>) => ({
            serviceName: s.service_name as string,
            daysInReview: Math.floor(
              (Date.now() - new Date(s.decision_changed_at as string).getTime()) / (1000 * 60 * 60 * 24)
            ),
            cost: s.cost as string | null,
            billingCycle: s.billing_cycle as string | null,
          }));

          if (upcoming.length > 0 || staleReviews.length > 0) {
            const reviewCount = upcoming.filter(
              (s: Record<string, unknown>) => s.keep_cancel_review === "review"
            ).length;

            const digestSubs = upcoming.map((s: Record<string, unknown>) => ({
              serviceName: s.service_name as string,
              cost: s.cost as string | null,
              billingCycle: s.billing_cycle as string | null,
              renewalDate: s.next_renewal_date as string,
              daysUntil: Math.ceil(
                (new Date(s.next_renewal_date as string).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              ),
            }));

            const totalUpcoming = digestSubs.reduce((sum: number, s) => {
              if (!s.cost) return sum;
              return sum + parseFloat(s.cost);
            }, 0);

            const digestData = {
              subscriptions: digestSubs,
              totalUpcoming,
              reviewCount,
              staleReviews,
              appUrl,
            };

            // Send email digest
            if (user.email_enabled) {
              try {
                await getResend().emails.send({
                  from: FROM_EMAIL,
                  to: user.email,
                  subject: weeklyDigestSubject(),
                  html: weeklyDigestHtml(digestData),
                });
              } catch (err) {
                results.push(`Digest email failed: ${err}`);
              }
            }

            // Send Slack digest
            if (user.slack_enabled && user.slack_webhook_url) {
              await sendSlack(user.slack_webhook_url, weeklyDigestSlack(digestData));
            }

            await sql`
              INSERT INTO notification_log (user_id, subscription_id, notification_type, channel, sent_date)
              VALUES (${user.user_id}, 0, 'weekly_digest', 'all', CURRENT_DATE)
              ON CONFLICT DO NOTHING
            `;

            totalSent++;
            results.push(`Sent weekly digest to ${user.email}`);
          }
        }
      }
    }
  }

  return Response.json({
    ok: true,
    sent: totalSent,
    details: results,
    timestamp: new Date().toISOString(),
  });
}
