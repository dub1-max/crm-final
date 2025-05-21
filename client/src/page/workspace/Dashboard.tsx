import { useState } from "react";
import { DndContext, closestCenter } from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { 
  Search,
  Plus,
  Download} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow 
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { DashboardCalendar } from "@/components/dashboard/dashboard-calendar";
import SalesOverviewCards, { Invoice as InvoiceType, Estimate as EstimateType, Proposal as ProposalType } from "./SalesOverviewCards";

const SECTION_IDS = [
  "overview",
  "stats",
  "tasks",
  "calendar",
  "payments",
];

function DraggableSection({ id, children }: { id: string; children: React.ReactNode }) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id });
  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition: transition || 'box-shadow 0.25s cubic-bezier(0.22, 1, 0.36, 1), transform 0.25s cubic-bezier(0.22, 1, 0.36, 1)',
        opacity: isDragging ? 0.92 : 1,
        zIndex: isDragging ? 20 : undefined,
        boxShadow: isDragging ? '0 8px 32px 0 rgba(31, 38, 135, 0.15), 0 2px 8px 0 rgba(0,0,0,0.08)' : undefined,
        scale: isDragging ? 1.03 : 1,
        borderRadius: 16,
      }}
      className="relative group"
    >
      <div
        {...attributes}
        {...listeners}
        className="absolute -left-6 top-1/2 -translate-y-1/2 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
        style={{ zIndex: 20 }}
        title="Drag to rearrange"
      >
        <span style={{ fontSize: 20, userSelect: 'none' }}>⋮⋮</span>
      </div>
      {children}
    </div>
  );
}

const invoiceData: InvoiceType[] = [
  {
    id: "INV-000011",
    amount: 30.00,
    totalTax: 0.00,
    date: "2025-05-14",
    customer: "Effertz, Lang and Daniel",
    dueDate: "2025-06-13",
    status: "Unpaid"
  },
  {
    id: "INV-000010",
    amount: 5980.00,
    totalTax: 180.00,
    date: "2025-05-14",
    customer: "Runolfsdottir and Sons",
    dueDate: "2025-06-13",
    status: "Partially Paid"
  }
];

const estimateData: EstimateType[] = [
  { id: "EST-000015", amount: 2670.00, totalTax: 270.00, customer: "Effertz, Lang and Daniel", date: "2025-05-14", expiryDate: "2025-06-11", status: "Draft", tags: ["High Priority"] },
  { id: "EST-000014", amount: 7990.00, totalTax: 0.00, customer: "Effertz, Lang and Daniel", date: "2025-05-14", expiryDate: "2025-06-04", status: "Draft", project: "Website Redesign" },
  { id: "EST-000013", amount: 1850.00, totalTax: 150.00, customer: "Jones-Dare", date: "2025-05-12", expiryDate: "2025-06-11", status: "Sent", project: "Marketing Campaign" },
  { id: "EST-000012", amount: 3560.00, totalTax: 360.00, customer: "Kautzer Inc", date: "2025-05-10", expiryDate: "2025-06-01", status: "Sent", project: "Mobile App" },
  { id: "EST-000011", amount: 5250.00, totalTax: 250.00, customer: "Lehner, Swift and Erdman", date: "2025-05-08", expiryDate: "2025-05-28", status: "Sent", project: "SEO Optimization" },
  { id: "EST-000010", amount: 4125.00, totalTax: 125.00, customer: "Klocko-Dickinson", date: "2025-05-05", expiryDate: "2025-05-25", status: "Accepted", project: "Branding Redesign" },
  { id: "EST-000009", amount: 1975.00, totalTax: 175.00, customer: "Hahn, Reilly and Ortiz", date: "2025-05-02", expiryDate: "2025-05-22", status: "Declined", project: "Email Campaign" }
];

const proposalData: ProposalType[] = [
  { id: "PRO-000002", subject: "Web Design Proposal", to: "Schaden-Watsica", total: 5900.00, date: "2025-05-14", openTill: "2025-05-21", status: "Sent" },
  { id: "PRO-000001", subject: "SEO Proposal", to: "Stehr, Kuhic and Klocko", total: 1932.00, date: "2025-05-14", openTill: "2025-05-21", status: "Open" }
];

function InvoiceAwaitingPayment({ invoices }: { invoices: InvoiceType[] }) {
  const awaiting = invoices.filter(inv => inv.status === 'Unpaid' || inv.status === 'Partially Paid');
  const total = invoices.length;
  const count = awaiting.length;
  const amount = awaiting.reduce((sum, inv) => sum + (inv.amount - (inv.paidAmount || 0)), 0);
  return (
    <div className="bg-white rounded-xl shadow p-8 flex flex-col items-center justify-center mb-6" style={{ minHeight: 160 }}>
      <div className="flex items-center justify-between w-full mb-2">
        <h3 className="text-lg font-bold">Invoice Awaiting Payment</h3>
        <span className="bg-gray-100 text-gray-700 rounded-full px-3 py-1 text-xs font-semibold">{count} / {total}</span>
      </div>
      <div className="flex items-center gap-4 w-full justify-between">
        <span className="text-4xl font-extrabold text-red-600">${amount.toLocaleString(undefined, {minimumFractionDigits:2})}</span>
        <div className="flex-1 h-4 bg-red-100 rounded-full ml-4">
          <div className="h-full rounded-full bg-red-500" style={{ width: `${total ? (count / total) * 100 : 0}%` }} />
        </div>
      </div>
      <div className="w-full text-right mt-2 text-sm text-gray-500">Unpaid or partially paid invoices</div>
    </div>
  );
}

const Dashboard = () => {
  const [sectionOrder, setSectionOrder] = useState(SECTION_IDS);

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active.id !== over?.id) {
      setSectionOrder((items) => {
        const oldIndex = items.indexOf(active.id);
        const newIndex = items.indexOf(over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const sections: Record<string, React.ReactNode> = {
    overview: <SalesOverviewCards invoices={invoiceData} estimates={estimateData} proposals={proposalData} />,
    stats: (
      <>
        <InvoiceAwaitingPayment invoices={invoiceData} />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-4 space-y-2">
            {/* ...rest of stat cards... */}
          </Card>
        </div>
      </>
    ),
    tasks: (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <h2 className="text-xl font-bold">My Tasks</h2>
            <Badge>12</Badge>
          </div>
          <div className="flex items-center space-x-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input placeholder="Search tasks..." className="w-64 pl-9" />
            </div>
            <Select defaultValue="all">
              <SelectTrigger className="w-32">
                <SelectValue placeholder="Filter" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Tasks</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>Type</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>{/* Add table rows here */}</TableBody>
        </Table>
      </Card>
    ),
    calendar: (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Calendar</h2>
          <Button variant="outline" size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Event
          </Button>
        </div>
        <DashboardCalendar />
      </Card>
    ),
    payments: (
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Payment Records</h2>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
        </div>
        <DashboardChart />
      </Card>
    ),
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6">
      {/* Main Content */}
      <div className="flex-1 space-y-6">
        <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
          <SortableContext items={sectionOrder} strategy={verticalListSortingStrategy}>
            {sectionOrder.map((id) => (
              <DraggableSection key={id} id={id}>
                {sections[id]}
              </DraggableSection>
            ))}
          </SortableContext>
        </DndContext>
      </div>
      {/* Right Sidebar */}
      <div className="w-full lg:w-80 space-y-6">
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Latest Project Activity</h3>
          {/* Add activity items here */}
        </Card>
        <Card className="p-6">
          <h3 className="font-semibold mb-4">Statistics by Project Status</h3>
          {/* Add statistics here */}
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
