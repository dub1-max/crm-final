import { useState } from "react";
import { Card } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";
import { Invoice as InvoiceType } from "./sales/Invoices";
import { Estimate as EstimateType } from "./sales/Estimates";
import { Proposal as ProposalType } from "./sales/Proposals";
import { Payment as PaymentType } from "./sales/Payments";

// Mock/demo data (replace with context or API in future)
const invoices: InvoiceType[] = [
  { id: "INV-000011", amount: 30.00, totalTax: 0.00, date: "2025-05-14", customer: "Effertz, Lang and Daniel", dueDate: "2025-06-13", status: "Unpaid" },
  { id: "INV-000010", amount: 5980.00, totalTax: 180.00, date: "2025-05-14", customer: "Runolfsdottir and Sons", dueDate: "2025-06-13", status: "Partially Paid" }
];
const estimates: EstimateType[] = [
  { id: "EST-000015", amount: 2670.00, totalTax: 270.00, customer: "Effertz, Lang and Daniel", date: "2025-05-14", expiryDate: "2025-06-11", status: "Draft", tags: ["High Priority"] },
  { id: "EST-000014", amount: 7990.00, totalTax: 0.00, customer: "Effertz, Lang and Daniel", date: "2025-05-14", expiryDate: "2025-06-04", status: "Draft", project: "Website Redesign" }
];
const proposals: ProposalType[] = [
  { id: "PRO-000002", subject: "Web Design Proposal", to: "Schaden-Watsica", total: 5900.00, date: "2025-05-14", openTill: "2025-05-21", status: "Sent" },
  { id: "PRO-000001", subject: "SEO Proposal", to: "Stehr, Kuhic and Klocko", total: 1932.00, date: "2025-05-14", openTill: "2025-05-21", status: "Open" }
];
const payments: PaymentType[] = [
  { id: "8", invoiceId: "INV-000001", amount: 1535.40, paymentMode: "Bank", customer: "Hahn, Reilly and Ortiz", date: "2024-05-15", status: "completed" },
  { id: "7", invoiceId: "INV-000008", amount: 4697.00, paymentMode: "Bank", customer: "Lehner, Swift and Erdman", date: "2024-05-21", status: "completed" }
];

const salesReports = [
  "Invoices Report",
  "Items Report",
  "Payments Received",
  "Credit Notes Report",
  "Proposals Report",
  "Estimates Report",
  "Customers Report",
];

const chartReports = [
  "Total Income",
  "Payment Modes (Transactions)",
  "Total Value By Customer Groups",
];

const years = [2025, 2024, 2023, 2022];

function getChartData(selectedSales: string, selectedYear: number) {
  // Example: generate chart data based on selected report and year
  if (selectedSales === "Invoices Report") {
    return invoices.map(inv => ({ name: inv.date, value: inv.amount }));
  }
  if (selectedSales === "Payments Received") {
    return payments.map(p => ({ name: p.date, value: p.amount }));
  }
  if (selectedSales === "Proposals Report") {
    return proposals.map(p => ({ name: p.date, value: p.total ?? 0 }));
  }
  if (selectedSales === "Estimates Report") {
    return estimates.map(e => ({ name: e.date, value: e.amount ?? 0 }));
  }
  // Default
  return [{ name: "No Data", value: 0 }];
}

export default function Reports() {
  const [selectedSales, setSelectedSales] = useState(salesReports[0]);
  const [selectedChart, setSelectedChart] = useState(chartReports[0]);
  const [selectedYear, setSelectedYear] = useState(years[0]);

  const chartData = getChartData(selectedSales, selectedYear);

  return (
    <div className="flex flex-col min-h-screen bg-[#f7f8fa]">
      <div className="flex flex-col md:flex-row w-full gap-8 px-4 md:px-8 pt-8">
        {/* Sales Report */}
        <Card className="flex-1 p-6 min-w-[220px] max-w-xs mb-4 md:mb-0">
          <h3 className="font-bold text-lg mb-4">Sales Report</h3>
          <ul className="space-y-2">
            {salesReports.map((item) => (
              <li key={item}>
                <button
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 font-medium ${selectedSales === item ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedSales(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </Card>
        {/* Charts Based Report */}
        <Card className="flex-1 p-6 min-w-[220px] max-w-xs mb-4 md:mb-0">
          <h3 className="font-bold text-lg mb-4">Charts Based Report</h3>
          <ul className="space-y-2">
            {chartReports.map((item) => (
              <li key={item}>
                <button
                  className={`w-full text-left px-3 py-2 rounded hover:bg-gray-100 font-medium ${selectedChart === item ? 'bg-gray-100' : ''}`}
                  onClick={() => setSelectedChart(item)}
                >
                  {item}
                </button>
              </li>
            ))}
          </ul>
        </Card>
        {/* Year Selection */}
        <Card className="flex-1 p-6 min-w-[120px] max-w-xs flex flex-col items-start">
          <h3 className="font-bold text-lg mb-4">Year</h3>
          <select
            className="border rounded px-3 py-2 text-base"
            value={selectedYear}
            onChange={e => setSelectedYear(Number(e.target.value))}
          >
            {years.map((year) => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </Card>
      </div>
      {/* Generated Report */}
      <div className="px-4 md:px-8 pt-8 pb-8">
        <Card className="p-6">
          <h3 className="font-bold text-lg mb-4">Generated Report</h3>
          <div className="w-full h-[350px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 0, bottom: 20 }}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#4ade80" stroke="#22c55e" fillOpacity={0.2} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>
    </div>
  );
} 