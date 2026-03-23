/**
 * ICS (iCalendar) generation utility for subscription renewal exports.
 * Generates RFC 5545 compliant .ics files.
 */

export interface CalendarEvent {
  uid: string;
  summary: string;
  description: string;
  date: string; // ISO date string like "2026-04-15"
}

function escapeText(text: string): string {
  return text
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\n/g, "\\n");
}

function formatICSDate(isoDate: string): string {
  return isoDate.replace(/-/g, "").slice(0, 8);
}

function nextDay(isoDate: string): string {
  const d = new Date(isoDate + "T00:00:00Z");
  d.setUTCDate(d.getUTCDate() + 1);
  return d.toISOString().split("T")[0].replace(/-/g, "");
}

function formatTimestamp(): string {
  return new Date().toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

function foldLine(line: string): string {
  if (line.length <= 75) return line;
  const parts: string[] = [];
  parts.push(line.slice(0, 75));
  let i = 75;
  while (i < line.length) {
    parts.push(" " + line.slice(i, i + 74));
    i += 74;
  }
  return parts.join("\r\n");
}

export function generateICS(events: CalendarEvent[]): string {
  const stamp = formatTimestamp();
  const lines: string[] = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//subtrackt//Renewal Calendar//EN",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "X-WR-CALNAME:subtrackt Renewals",
  ];

  for (const event of events) {
    lines.push(
      "BEGIN:VEVENT",
      foldLine(`UID:${escapeText(event.uid)}`),
      `DTSTAMP:${stamp}`,
      `DTSTART;VALUE=DATE:${formatICSDate(event.date)}`,
      `DTEND;VALUE=DATE:${nextDay(event.date)}`,
      foldLine(`SUMMARY:${escapeText(event.summary)}`),
      foldLine(`DESCRIPTION:${escapeText(event.description)}`),
      "BEGIN:VALARM",
      "TRIGGER:-P1D",
      "ACTION:DISPLAY",
      "DESCRIPTION:Renewal reminder",
      "END:VALARM",
      "END:VEVENT",
    );
  }

  lines.push("END:VCALENDAR");
  return lines.join("\r\n") + "\r\n";
}
