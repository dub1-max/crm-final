import React from "react";
import { Card } from "@/components/ui/card";

export interface Invoice {
  id: string;
  status: 'Unpaid' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Draft';
  amount: number;
  paidAmount?: number;
  totalTax?: number;
  date?: string;
  customer?: string;
  dueDate?: string;
  project?: string;
  tags?: string[];
}
export interface Estimate {
  id: string;
  status: 'Draft' | 'Sent' | 'Expired' | 'Declined' | 'Accepted';
  amount?: number;
  totalTax?: number;
  customer?: string;
  project?: string;
  tags?: string[];
  date?: string;
  expiryDate?: string;
  reference?: string;
}
export interface Proposal {
  id: string;
  status: 'Sent' | 'Open' | 'Revised' | 'Declined' | 'Accepted' | 'Draft';
  subject?: string;
  to?: string;
  total?: number;
  date?: string;
  openTill?: string;
  project?: string;
  tags?: string[];
}

interface SalesOverviewCardsProps {
  invoices: Invoice[];
  estimates: Estimate[];
  proposals: Proposal[];
}

function getInvoiceStats(invoices: Invoice[]) {
  const total = invoices.length || 1;
  const statusList = [
    { label: 'Draft', color: '#6B7280' },
    { label: 'Not Sent', color: '#374151' }, // Not Sent is not in the model, so always 0
    { label: 'Unpaid', color: '#EF4444' },
    { label: 'Partially Paid', color: '#F59E42' },
    { label: 'Overdue', color: '#F59E42' },
    { label: 'Paid', color: '#22C55E' },
  ];
  const statusMap: Record<string, number> = {};
  invoices.forEach(inv => {
    statusMap[inv.status] = (statusMap[inv.status] || 0) + 1;
  });
  return statusList.map(s => {
    let count = 0;
    if (s.label === 'Not Sent') count = 0;
    else count = statusMap[s.label] || 0;
    return {
      label: s.label,
      count,
      percent: +(count / total * 100).toFixed(2),
      color: s.color,
    };
  });
}

function getEstimateStats(estimates: Estimate[]) {
  const total = estimates.length || 1;
  const statusList = [
    { label: 'Draft', color: '#6B7280' },
    { label: 'Not Sent', color: '#374151' }, // Not Sent is not in the model, so always 0
    { label: 'Sent', color: '#2563EB' },
    { label: 'Expired', color: '#F59E42' },
    { label: 'Declined', color: '#EF4444' },
    { label: 'Accepted', color: '#22C55E' },
  ];
  const statusMap: Record<string, number> = {};
  estimates.forEach(e => {
    statusMap[e.status] = (statusMap[e.status] || 0) + 1;
  });
  return statusList.map(s => {
    let count = 0;
    if (s.label === 'Not Sent') count = 0;
    else count = statusMap[s.label] || 0;
    return {
      label: s.label,
      count,
      percent: +(count / total * 100).toFixed(2),
      color: s.color,
    };
  });
}

function getProposalStats(proposals: Proposal[]) {
  const total = proposals.length || 1;
  const statusList = [
    { label: 'Draft', color: '#6B7280' },
    { label: 'Sent', color: '#2563EB' },
    { label: 'Open', color: '#374151' },
    { label: 'Revised', color: '#2563EB' },
    { label: 'Declined', color: '#EF4444' },
    { label: 'Accepted', color: '#22C55E' },
  ];
  const statusMap: Record<string, number> = {};
  proposals.forEach(p => {
    statusMap[p.status] = (statusMap[p.status] || 0) + 1;
  });
  return statusList.map(s => {
    let count = statusMap[s.label] || 0;
    return {
      label: s.label,
      count,
      percent: +(count / total * 100).toFixed(2),
      color: s.color,
    };
  });
}

function getInvoiceSummary(invoices: Invoice[]) {
  let outstanding = 0, pastDue = 0, paid = 0;
  invoices.forEach(inv => {
    if (inv.status === 'Paid') paid += inv.amount;
    else if (inv.status === 'Overdue') pastDue += inv.amount;
    else if (inv.status === 'Unpaid' || inv.status === 'Partially Paid') outstanding += inv.amount - (inv.paidAmount || 0);
  });
  return [
    { label: 'Outstanding Invoices', value: `$${outstanding.toLocaleString(undefined, {minimumFractionDigits:2})}`, color: '#F59E42' },
    { label: 'Past Due Invoices', value: `$${pastDue.toLocaleString(undefined, {minimumFractionDigits:2})}`, color: '#EF4444' },
    { label: 'Paid Invoices', value: `$${paid.toLocaleString(undefined, {minimumFractionDigits:2})}`, color: '#22C55E' },
  ];
}

function StatusBar({ count, percent, color, label }: any) {
  return (
    <div className="flex items-center gap-2 mb-1">
      <span style={{ color }}>{count} {label}</span>
      <span className="ml-auto text-xs text-gray-400">{percent}%</span>
      <div className="flex-1 h-1.5 bg-gray-200 rounded-full ml-2 mr-2" style={{ minWidth: 60 }}>
        <div style={{ width: `${percent}%`, background: color }} className="h-full rounded-full"></div>
      </div>
    </div>
  );
}

export default function SalesOverviewCards({ invoices, estimates, proposals }: SalesOverviewCardsProps) {
  const invoiceStats = getInvoiceStats(invoices);
  const estimateStats = getEstimateStats(estimates);
  const proposalStats = getProposalStats(proposals);
  const summaryData = getInvoiceSummary(invoices);
  return (
    <div className="bg-white rounded-xl p-6 mb-6 shadow flex flex-col gap-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Invoice Overview */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Invoice overview</h3>
          {invoiceStats.map((s) => (
            <StatusBar key={s.label} {...s} />
          ))}
        </Card>
        {/* Estimate Overview */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Estimate overview</h3>
          {estimateStats.map((s) => (
            <StatusBar key={s.label} {...s} />
          ))}
        </Card>
        {/* Proposal Overview */}
        <Card className="p-4">
          <h3 className="font-semibold mb-2">Proposal overview</h3>
          {proposalStats.map((s) => (
            <StatusBar key={s.label} {...s} />
          ))}
        </Card>
      </div>
      <div className="flex gap-4 mt-4">
        {summaryData.map((s) => (
          <div key={s.label} className="flex-1 text-center border rounded-lg py-4" style={{ borderColor: s.color }}>
            <div className="text-sm font-medium" style={{ color: s.color }}>{s.label}</div>
            <div className="text-2xl font-bold mt-1" style={{ color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
} 