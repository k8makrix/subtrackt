/**
 * PDF generation utility for tax reports.
 * Uses jsPDF + jspdf-autotable for server-side PDF creation.
 */

import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

export interface TaxReportSummaryRow {
  tax_category: string;
  expense_type: string;
  count: number;
  annual_total: number;
}

export interface TaxReportDetailRow {
  service_name: string;
  tax_category: string;
  expense_type: string;
  billing_cycle: string;
  cost: number;
  annualized_cost: number;
  payment_source: string;
}

export interface TaxReportData {
  year: string; // "2026" or "All Time"
  generatedAt: string;
  summaryRows: TaxReportSummaryRow[];
  detailRows: TaxReportDetailRow[];
  deductibleTotal: number;
  personalTotal: number;
}

function fmt(n: number): string {
  return "$" + n.toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

function label(s: string | null): string {
  if (!s) return "";
  return s.replace(/-/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());
}

export function generateTaxPDF(data: TaxReportData): ArrayBuffer {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 20;

  // Header
  doc.setFontSize(22);
  doc.setFont("helvetica", "bold");
  doc.text("subtrackt Tax Report", 14, y);
  y += 10;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(100);
  doc.text(`Tax Year: ${data.year}`, 14, y);
  doc.text(`Generated: ${data.generatedAt}`, pageWidth - 14, y, { align: "right" });
  y += 4;

  doc.setDrawColor(200);
  doc.line(14, y, pageWidth - 14, y);
  y += 10;

  // Totals
  doc.setTextColor(0);
  doc.setFontSize(12);
  doc.setFont("helvetica", "bold");
  doc.text("Summary", 14, y);
  y += 8;

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Business Deductible:  ${fmt(data.deductibleTotal)}`, 14, y);
  y += 6;
  doc.text(`Personal (Non-deductible):  ${fmt(data.personalTotal)}`, 14, y);
  y += 6;
  doc.setFont("helvetica", "bold");
  doc.text(`Grand Total:  ${fmt(data.deductibleTotal + data.personalTotal)}`, 14, y);
  y += 10;

  // Category summary table
  if (data.summaryRows.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.text("By Category", 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      head: [["Tax Category", "Expense Type", "Count", "Annual Total"]],
      body: data.summaryRows.map((r) => [
        label(r.tax_category),
        label(r.expense_type),
        r.count.toString(),
        fmt(r.annual_total),
      ]),
      theme: "grid",
      headStyles: { fillColor: [45, 45, 45], textColor: 255, fontSize: 9 },
      bodyStyles: { fontSize: 9 },
      columnStyles: {
        2: { halign: "center" },
        3: { halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });

    y = (doc as any).lastAutoTable.finalY + 10;
  }

  // Deductible detail table
  if (data.detailRows.length > 0) {
    doc.setFont("helvetica", "bold");
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text("Deductible Detail", 14, y);
    y += 2;

    autoTable(doc, {
      startY: y,
      head: [["Service", "Tax Category", "Expense Type", "Cycle", "Cost", "Annualized", "Payment"]],
      body: data.detailRows.map((r) => [
        r.service_name,
        label(r.tax_category),
        label(r.expense_type),
        r.billing_cycle || "",
        r.cost ? fmt(r.cost) : "",
        fmt(r.annualized_cost),
        label(r.payment_source),
      ]),
      theme: "grid",
      headStyles: { fillColor: [45, 45, 45], textColor: 255, fontSize: 8 },
      bodyStyles: { fontSize: 8 },
      columnStyles: {
        4: { halign: "right" },
        5: { halign: "right" },
      },
      margin: { left: 14, right: 14 },
    });
  }

  // Footer on each page
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150);
    doc.text(
      `subtrackt Tax Report -- Page ${i} of ${pageCount}`,
      pageWidth / 2,
      doc.internal.pageSize.getHeight() - 10,
      { align: "center" }
    );
  }

  return doc.output("arraybuffer");
}
