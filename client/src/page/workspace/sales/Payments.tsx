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
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { Search, Download, Mail, Printer, Eye } from "lucide-react";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useNavigate, useLocation } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { generatePaymentsTablePDF, generatePaymentReceiptPDF } from "../../workspace/generate-payment-pdf";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMode: string;
  transactionId?: string;
  customer: string;
  date: string;
  status?: 'completed' | 'pending' | 'draft';
}

export const paymentsDemoData: Payment[] = [
  {
    id: "8",
    invoiceId: "INV-000001",
    amount: 1535.40,
    paymentMode: "Bank",
    customer: "Hahn, Reilly and Ortiz",
    date: "2024-05-15",
    status: "completed"
  },
  {
    id: "7",
    invoiceId: "INV-000008",
    amount: 4697.00,
    paymentMode: "Bank",
    customer: "Lehner, Swift and Erdman",
    date: "2024-05-21",
    status: "completed"
  }
];

const Payments = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const workspaceId = useWorkspaceId();
  const { toast } = useToast();
  const [viewPayment, setViewPayment] = useState<Payment | null>(null);
  
  const [payments, setPayments] = useState<Payment[]>([
    {
      id: "8",
      invoiceId: "INV-000001",
      amount: 1535.40,
      paymentMode: "Bank",
      transactionId: "",
      customer: "Hahn, Reilly and Ortiz",
      date: "2024-05-15",
      status: "completed"
    },
    {
      id: "7",
      invoiceId: "INV-000008",
      amount: 4697.00,
      paymentMode: "Bank",
      transactionId: "",
      customer: "Lehner, Swift and Erdman",
      date: "2024-05-21",
      status: "completed"
    },
    {
      id: "6",
      invoiceId: "INV-000006",
      amount: 2989.00,
      paymentMode: "Bank",
      transactionId: "",
      customer: "Kautzer Inc",
      date: "2024-05-15",
      status: "completed"
    },
    {
      id: "5",
      invoiceId: "INV-000010",
      amount: 1291.00,
      paymentMode: "Bank",
      transactionId: "",
      customer: "Jones-Dare",
      date: "2024-05-19",
      status: "completed"
    },
    {
      id: "4",
      invoiceId: "INV-000013",
      amount: 106.20,
      paymentMode: "Bank",
      transactionId: "",
      customer: "Jones-Dare",
      date: "2024-05-13",
      status: "pending"
    },
    {
      id: "3",
      invoiceId: "INV-000011",
      amount: 2509.00,
      paymentMode: "Bank",
      transactionId: "",
      customer: "Jones-Dare",
      date: "2024-05-17",
      status: "draft"
    },
    {
      id: "2",
      invoiceId: "INV-000012",
      amount: 2500.00,
      paymentMode: "Bank",
      transactionId: "",
      customer: "Jones-Dare",
      date: "2024-05-13",
      status: "draft"
    },
    {
      id: "1",
      invoiceId: "INV-000007",
      amount: 5943.00,
      paymentMode: "Bank",
      transactionId: "",
      customer: "Klocko-Dickinson",
      date: "2024-05-15",
      status: "draft"
    }
  ]);

  // Calculate payment statistics
  const calculateStats = () => {
    const total = payments.length;
    const completed = payments.filter(p => p.status === 'completed').length;
    const pending = payments.filter(p => p.status === 'pending').length;
    const draft = payments.filter(p => p.status === 'draft').length;

    return {
      completed: {
        count: completed,
        total,
        percentage: Math.round((completed / total) * 100)
      },
      pending: {
        count: pending,
        total,
        percentage: Math.round((pending / total) * 100)
      },
      draft: {
        count: draft,
        total,
        percentage: Math.round((draft / total) * 100)
      }
    };
  };

  const stats = calculateStats();

  const handleExport = (format: 'pdf' | 'xlsx' | 'csv') => {
    const exportData = payments.map(payment => ({
      'Payment #': payment.id,
      'Invoice #': payment.invoiceId,
      'Payment Mode': payment.paymentMode,
      'Transaction ID': payment.transactionId || '',
      'Customer': payment.customer,
      'Amount': `$${payment.amount.toFixed(2)}`,
      'Date': formatDate(payment.date),
      'Status': payment.status || 'completed'
    }));

    if (format === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, 'payments.csv');
      toast({
        title: "Export Successful",
        description: "Payments exported as CSV",
        variant: "default"
      });
    } else if (format === 'xlsx') {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths
      const columnWidths = [
        { wch: 12 }, // Payment #
        { wch: 12 }, // Invoice #
        { wch: 15 }, // Payment Mode
        { wch: 15 }, // Transaction ID
        { wch: 30 }, // Customer
        { wch: 15 }, // Amount
        { wch: 12 }, // Date
        { wch: 12 }, // Status
      ];
      worksheet['!cols'] = columnWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Payments');
      XLSX.writeFile(workbook, 'payments.xlsx');
      toast({
        title: "Export Successful",
        description: "Payments exported as Excel",
        variant: "default"
      });
    } else {
      // PDF export using our new generator function
      const success = generatePaymentsTablePDF(payments);
      if (success) {
        toast({
          title: "Export Successful",
          description: "Payments exported as PDF",
          variant: "default"
        });
      } else {
        toast({
          title: "Export Failed",
          description: "Failed to export payments as PDF",
          variant: "destructive"
        });
      }
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('/');
  };

  const handleViewPayment = (payment: Payment) => {
    // Set the payment to view in the preview dialog
    setViewPayment(payment);
  };
  
  const handleDownloadPayment = (payment: Payment) => {
    // Generate and download PDF
    const success = generatePaymentReceiptPDF(payment);
    if (success) {
      toast({
        title: "Download Successful",
        description: `Payment receipt for ${payment.invoiceId} has been downloaded`,
        variant: "default"
      });
    } else {
      toast({
        title: "Download Failed",
        description: "Failed to download the payment receipt",
        variant: "destructive"
      });
    }
  };

  // Filter payments based on search query
  const filteredPayments = payments.filter(payment => 
    Object.values(payment).some(value => 
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Payments</h2>
          <p className="text-muted-foreground cursor-pointer">
            View Financial Stats
          </p>
        </div>
        <Button 
          variant="default" 
          className="rounded-md px-4 py-2 bg-black text-white"
          onClick={() => {
            // Create payment functionality
            toast({
              title: "Create Payment",
              description: "Payment creation functionality would be implemented here",
            });
          }}
        >
          <span className="mr-1">+</span> Create New Payment
        </Button>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Completed</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.completed.count}</span>
            <span className="text-gray-500">/{stats.completed.total}</span>
            <span className="text-gray-400 ml-auto">({stats.completed.percentage}%)</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Pending</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.pending.count}</span>
            <span className="text-gray-500">/{stats.pending.total}</span>
            <span className="text-gray-400 ml-auto">({stats.pending.percentage}%)</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Draft</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.draft.count}</span>
            <span className="text-gray-500">/{stats.draft.total}</span>
            <span className="text-gray-400 ml-auto">({stats.draft.percentage}%)</span>
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
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem onClick={() => handleExport('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('xlsx')}>
                  Export as Excel
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleExport('pdf')}>
                  Export as PDF
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search payments..."
              className="pl-8 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payment #</TableHead>
                <TableHead>Invoice #</TableHead>
                <TableHead>Payment Mode</TableHead>
                <TableHead>Transaction ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPayments.map((payment) => (
                <TableRow 
                  key={payment.id}
                  className="hover:bg-gray-50"
                >
                  <TableCell>{payment.id}</TableCell>
                  <TableCell>{payment.invoiceId}</TableCell>
                  <TableCell>{payment.paymentMode}</TableCell>
                  <TableCell>{payment.transactionId || '-'}</TableCell>
                  <TableCell>{payment.customer}</TableCell>
                  <TableCell>${payment.amount.toFixed(2)}</TableCell>
                  <TableCell>{formatDate(payment.date)}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        payment.status === 'completed' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        payment.status === 'pending' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        'bg-gray-100 text-gray-800 hover:bg-gray-100'
                      }
                    >
                      {payment.status ? payment.status.charAt(0).toUpperCase() + payment.status.slice(1) : 'Completed'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewPayment(payment)}
                      title="View Payment"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadPayment(payment)}
                      title="Download Receipt"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Email Receipt",
                          description: "Email functionality would be implemented here",
                        });
                      }}
                      title="Email Receipt"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Print Receipt",
                          description: "Print functionality would be implemented here",
                        });
                      }}
                      title="Print Receipt"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between px-4 py-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing 1 to {filteredPayments.length} of {filteredPayments.length} entries
          </div>
          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              disabled={true}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="bg-primary text-primary-foreground"
            >
              1
            </Button>
            <Button
              variant="outline"
              size="sm"
              disabled={true}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
      
      {/* Payment Preview Dialog */}
      <Dialog open={!!viewPayment} onOpenChange={(open) => !open && setViewPayment(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Payment Receipt {viewPayment?.id}</DialogTitle>
            <DialogDescription>
              View payment details
            </DialogDescription>
          </DialogHeader>
          
          {viewPayment && (
            <div className="space-y-6 overflow-auto max-h-[70vh]">
              {/* Payment Details */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between border-b pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">Receipt #{viewPayment.id}</h3>
                    <p className="text-sm text-gray-500">
                      <span className="block">Invoice: {viewPayment.invoiceId}</span>
                      <span className="block">Customer: {viewPayment.customer}</span>
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Status</div>
                    <Badge 
                      className={
                        viewPayment.status === 'completed' ? 'bg-green-100 text-green-800' :
                        viewPayment.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-gray-100 text-gray-800'
                      }
                    >
                      {viewPayment.status ? viewPayment.status.charAt(0).toUpperCase() + viewPayment.status.slice(1) : 'Completed'}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div>{formatDate(viewPayment.date)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Payment Mode</div>
                    <div>{viewPayment.paymentMode}</div>
                  </div>
                  {viewPayment.transactionId && (
                    <div>
                      <div className="text-sm text-gray-500">Transaction ID</div>
                      <div>{viewPayment.transactionId}</div>
                    </div>
                  )}
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Payment Details</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <div className="flex justify-between py-1 font-bold">
                        <span>Amount</span>
                        <span>${viewPayment.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setViewPayment(null)}
                >
                  Close
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => handleDownloadPayment(viewPayment)}
                  className="flex items-center gap-2"
                >
                  <Download className="h-4 w-4" />
                  Download PDF
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </main>
  );
};

export default Payments; 