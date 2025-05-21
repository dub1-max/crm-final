import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Search } from "lucide-react";
import { CreateDialog } from "./create-dialog";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Checkbox } from "@/components/ui/checkbox";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';

export interface Invoice {
  id: string;
  amount: number;
  totalTax: number;
  date: string;
  customer: string;
  project?: string;
  tags?: string[];
  dueDate: string;
  status: 'Unpaid' | 'Paid' | 'Partially Paid' | 'Overdue' | 'Draft';
  paidAmount?: number;
}

export const invoicesDemoData: Invoice[] = [
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

const Invoices = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedInvoices, setSelectedInvoices] = useState<string[]>([]);
  const [invoices, setInvoices] = useState<Invoice[]>([
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
  ]);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [batchPaymentStatus, setBatchPaymentStatus] = useState<'Paid' | 'Unpaid' | 'Partially Paid'>('Paid');
  const [partialAmount, setPartialAmount] = useState<string>('');

  // Calculate stats based on actual data
  const calculateStats = () => {
    const total = invoices.length;
    const statusCounts = invoices.reduce((acc, invoice) => {
      acc[invoice.status] = (acc[invoice.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return {
      unpaid: { 
        count: statusCounts['Unpaid'] || 0, 
        total, 
        percentage: total ? ((statusCounts['Unpaid'] || 0) / total * 100).toFixed(2) : 0 
      },
      paid: { 
        count: statusCounts['Paid'] || 0, 
        total, 
        percentage: total ? ((statusCounts['Paid'] || 0) / total * 100).toFixed(2) : 0 
      },
      partiallyPaid: { 
        count: statusCounts['Partially Paid'] || 0, 
        total, 
        percentage: total ? ((statusCounts['Partially Paid'] || 0) / total * 100).toFixed(2) : 0 
      },
      overdue: { 
        count: statusCounts['Overdue'] || 0, 
        total, 
        percentage: total ? ((statusCounts['Overdue'] || 0) / total * 100).toFixed(2) : 0 
      },
      draft: { 
        count: statusCounts['Draft'] || 0, 
        total, 
        percentage: total ? ((statusCounts['Draft'] || 0) / total * 100).toFixed(2) : 0 
      }
    };
  };

  // Calculate totals based on actual data
  const calculateTotals = () => {
    return invoices.reduce((acc, invoice) => {
      if (invoice.status === 'Paid') {
        acc.paidInvoices += invoice.amount;
      } else if (invoice.status === 'Overdue') {
        acc.pastDueInvoices += invoice.amount;
      } else if (invoice.status === 'Unpaid' || invoice.status === 'Partially Paid') {
        acc.outstandingInvoices += invoice.amount - (invoice.paidAmount || 0);
      }
      return acc;
    }, {
      paidInvoices: 0,
      pastDueInvoices: 0,
      outstandingInvoices: 0
    });
  };

  const stats = calculateStats();
  const totals = calculateTotals();

  const handleCreateInvoice = (data: any) => {
    const newInvoice: Invoice = {
      id: `INV-${String(invoices.length + 1).padStart(6, '0')}`,
      amount: parseFloat(data.amount),
      totalTax: parseFloat(data.tax),
      customer: data.customer,
      project: data.project,
      date: new Date().toISOString().split('T')[0],
      dueDate: data.dueDate,
      status: 'Unpaid',
    };
    
    setInvoices([newInvoice, ...invoices]);
  };

  const handleBatchPayment = () => {
    setInvoices(invoices.map(invoice => {
      if (!selectedInvoices.includes(invoice.id)) return invoice;

      switch (batchPaymentStatus) {
        case 'Paid':
          return { ...invoice, status: 'Paid', paidAmount: invoice.amount };
        case 'Unpaid':
          return { ...invoice, status: 'Unpaid', paidAmount: 0 };
        case 'Partially Paid':
          const paidAmount = parseFloat(partialAmount);
          if (isNaN(paidAmount) || paidAmount <= 0 || paidAmount >= invoice.amount) {
            return invoice;
          }
          return { 
            ...invoice, 
            status: 'Partially Paid',
            paidAmount: paidAmount
          };
        default:
          return invoice;
      }
    }));

    // Reset the form
    setSelectedInvoices([]);
    setPartialAmount('');
    setBatchPaymentStatus('Paid');
    setIsDialogOpen(false);
  };

  const getTotalSelectedAmount = () => {
    return selectedInvoices.reduce((total, id) => {
      const invoice = invoices.find(inv => inv.id === id);
      return total + (invoice?.amount || 0);
    }, 0);
  };

  const handleExport = (format: 'csv' | 'xlsx') => {
    const exportData = invoices.map(({ id, amount, totalTax, customer, project, date, dueDate, status }) => ({
      'Invoice #': id,
      'Amount': amount,
      'Total Tax': totalTax,
      'Customer': customer,
      'Project': project || '',
      'Date': date,
      'Due Date': dueDate,
      'Status': status,
    }));

    if (format === 'csv') {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(blob, 'invoices.csv');
    } else {
      const ws = XLSX.utils.json_to_sheet(exportData);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
      XLSX.writeFile(wb, 'invoices.xlsx');
    }
  };

  // Filter invoices based on search query
  const filteredInvoices = invoices.filter(invoice => 
    Object.values(invoice).some(value => 
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Invoices</h2>
          <div className="flex flex-col md:flex-row gap-4 mt-2">
            <span className="text-green-600">
              Paid Invoices: ${totals.paidInvoices.toFixed(2)}
            </span>
            <span className="text-red-600">
              Past Due Invoices: ${totals.pastDueInvoices.toFixed(2)}
            </span>
            <span className="text-orange-600">
              Outstanding Invoices: ${totals.outstandingInvoices.toFixed(2)}
            </span>
          </div>
        </div>
        <div className="flex gap-2">
          <CreateDialog
            title="Invoice"
            onSubmit={handleCreateInvoice}
            fields={[
              { name: 'customer', label: 'Customer', type: 'text', required: true },
              { name: 'amount', label: 'Amount', type: 'number', required: true },
              { name: 'tax', label: 'Tax', type: 'number', required: true },
              { name: 'project', label: 'Project', type: 'text' },
              { name: 'dueDate', label: 'Due Date', type: 'date', required: true },
            ]}
          />
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button 
                variant="outline" 
                disabled={selectedInvoices.length === 0}
                className="w-full md:w-auto"
              >
                Batch Payments
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] w-[95vw] rounded-lg p-4 md:p-6">
              <DialogHeader className="space-y-3">
                <DialogTitle className="text-xl font-semibold">Process Batch Payments</DialogTitle>
                <div className="flex flex-col space-y-1.5">
                  <p className="text-sm font-medium">
                    Selected Invoices: {selectedInvoices.length}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Total Amount: ${getTotalSelectedAmount().toFixed(2)}
                  </p>
                </div>
              </DialogHeader>

              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <label className="text-sm font-medium">Payment Status</label>
                  <Select
                    value={batchPaymentStatus}
                    onValueChange={(value: 'Paid' | 'Unpaid' | 'Partially Paid') => {
                      setBatchPaymentStatus(value);
                      if (value !== 'Partially Paid') {
                        setPartialAmount('');
                      }
                    }}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paid">Mark as Paid</SelectItem>
                      <SelectItem value="Unpaid">Mark as Unpaid</SelectItem>
                      <SelectItem value="Partially Paid">Mark as Partially Paid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {batchPaymentStatus === 'Partially Paid' && (
                  <div className="grid gap-2">
                    <label className="text-sm font-medium">Partial Payment Amount</label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500">$</span>
                      <Input
                        type="number"
                        step="0.01"
                        min="0"
                        max={getTotalSelectedAmount()}
                        value={partialAmount}
                        onChange={(e) => setPartialAmount(e.target.value)}
                        className="pl-7"
                        placeholder="0.00"
                      />
                    </div>
                    {parseFloat(partialAmount) > 0 && (
                      <p className="text-sm text-muted-foreground">
                        Remaining: ${(getTotalSelectedAmount() - parseFloat(partialAmount)).toFixed(2)}
                      </p>
                    )}
                  </div>
                )}

                <Button 
                  onClick={handleBatchPayment}
                  className="w-full mt-4"
                  disabled={
                    batchPaymentStatus === 'Partially Paid' && 
                    (
                      !partialAmount || 
                      parseFloat(partialAmount) <= 0 || 
                      parseFloat(partialAmount) >= getTotalSelectedAmount()
                    )
                  }
                >
                  Update Payments
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span className="text-red-600">Unpaid</span>
            <span className="text-gray-400">({stats.unpaid.percentage}%)</span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-semibold">{stats.unpaid.count}</span>
            <span className="text-gray-500">/{stats.unpaid.total}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span className="text-green-600">Paid</span>
            <span className="text-gray-400">({stats.paid.percentage}%)</span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-semibold">{stats.paid.count}</span>
            <span className="text-gray-500">/{stats.paid.total}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span className="text-orange-600">Partially Paid</span>
            <span className="text-gray-400">({stats.partiallyPaid.percentage}%)</span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-semibold">{stats.partiallyPaid.count}</span>
            <span className="text-gray-500">/{stats.partiallyPaid.total}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span className="text-red-600">Overdue</span>
            <span className="text-gray-400">({stats.overdue.percentage}%)</span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-semibold">{stats.overdue.count}</span>
            <span className="text-gray-500">/{stats.overdue.total}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex justify-between items-center">
            <span className="text-gray-600">Draft</span>
            <span className="text-gray-400">({stats.draft.percentage}%)</span>
          </div>
          <div className="mt-2">
            <span className="text-xl font-semibold">{stats.draft.count}</span>
            <span className="text-gray-500">/{stats.draft.total}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b gap-4">
          <div className="flex items-center gap-2">
            <Select defaultValue="25">
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
                <SelectItem value="100">100</SelectItem>
              </SelectContent>
            </Select>
            <div className="flex gap-2">
              <Button variant="outline" onClick={() => handleExport('csv')}>
                Export CSV
              </Button>
              <Button variant="outline" onClick={() => handleExport('xlsx')}>
                Export Excel
              </Button>
            </div>
          </div>

          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search invoices..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <Checkbox
                  checked={selectedInvoices.length === filteredInvoices.length}
                  onCheckedChange={(checked) => {
                    setSelectedInvoices(
                      checked
                        ? filteredInvoices.map((invoice) => invoice.id)
                        : []
                    );
                  }}
                />
              </TableHead>
              <TableHead>Invoice #</TableHead>
              <TableHead>Amount</TableHead>
              <TableHead>Paid Amount</TableHead>
              <TableHead>Remaining</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Customer</TableHead>
              <TableHead>Project</TableHead>
              <TableHead>Tags</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredInvoices.map((invoice) => (
              <TableRow key={invoice.id}>
                <TableCell>
                  <Checkbox
                    checked={selectedInvoices.includes(invoice.id)}
                    onCheckedChange={(checked) => {
                      setSelectedInvoices(
                        checked
                          ? [...selectedInvoices, invoice.id]
                          : selectedInvoices.filter((id) => id !== invoice.id)
                      );
                    }}
                  />
                </TableCell>
                <TableCell>{invoice.id}</TableCell>
                <TableCell>${invoice.amount.toFixed(2)}</TableCell>
                <TableCell>
                  {invoice.status === 'Paid' && `$${invoice.amount.toFixed(2)}`}
                  {invoice.status === 'Partially Paid' && `$${(invoice.paidAmount || 0).toFixed(2)}`}
                  {(invoice.status === 'Unpaid' || invoice.status === 'Draft') && '-'}
                </TableCell>
                <TableCell>
                  {invoice.status === 'Partially Paid' 
                    ? `$${(invoice.amount - (invoice.paidAmount || 0)).toFixed(2)}`
                    : invoice.status === 'Paid' 
                      ? '$0.00'
                      : `$${invoice.amount.toFixed(2)}`
                  }
                </TableCell>
                <TableCell>
                  <Badge
                    variant={
                      invoice.status === 'Paid' ? 'default' :
                      invoice.status === 'Unpaid' ? 'destructive' :
                      invoice.status === 'Partially Paid' ? 'secondary' :
                      'destructive'
                    }
                  >
                    {invoice.status}
                  </Badge>
                </TableCell>
                <TableCell>{invoice.date}</TableCell>
                <TableCell>{invoice.customer}</TableCell>
                <TableCell>{invoice.project || '-'}</TableCell>
                <TableCell>
                  {invoice.tags?.map(tag => (
                    <Badge key={tag} variant="secondary" className="mr-1">
                      {tag}
                    </Badge>
                  )) || '-'}
                </TableCell>
                <TableCell>{invoice.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing 1 to {filteredInvoices.length} of {invoices.length} entries
          </div>
          <div className="flex gap-1">
            <Button variant="outline" disabled>
              Previous
            </Button>
            <Button variant="outline" className="bg-blue-50">
              1
            </Button>
            <Button variant="outline" disabled>
              Next
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
};

export default Invoices;
