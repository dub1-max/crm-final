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
import { CreateDialog } from "./create-dialog";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { useNavigate } from "react-router-dom";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { generateEstimatesTablePDF, generateEstimateDetailPDF } from "../generate-estimate-pdf";
import { useToast } from "@/components/ui/use-toast";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Estimate {
  id: string;
  amount: number;
  totalTax: number;
  customer: string;
  project?: string;
  tags?: string[];
  date: string;
  expiryDate: string;
  reference?: string;
  status: 'Draft' | 'Sent' | 'Expired' | 'Declined' | 'Accepted';
}

export const estimatesDemoData: Estimate[] = [
  {
    id: "EST-000015",
    amount: 2670.00,
    totalTax: 270.00,
    customer: "Effertz, Lang and Daniel",
    date: "2025-05-14",
    expiryDate: "2025-06-11",
    status: "Draft",
    tags: ["High Priority"]
  },
  {
    id: "EST-000014",
    amount: 7990.00,
    totalTax: 0.00,
    customer: "Effertz, Lang and Daniel",
    date: "2025-05-14",
    expiryDate: "2025-06-04",
    status: "Draft",
    project: "Website Redesign"
  }
];

const Estimates = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();
  const { toast } = useToast();
  const [viewEstimate, setViewEstimate] = useState<Estimate | null>(null);
  
  const [estimates, setEstimates] = useState<Estimate[]>([
    {
      id: "EST-000015",
      amount: 2670.00,
      totalTax: 270.00,
      customer: "Effertz, Lang and Daniel",
      date: "2025-05-14",
      expiryDate: "2025-06-11",
      status: "Draft",
      tags: ["High Priority"]
    },
    {
      id: "EST-000014",
      amount: 7990.00,
      totalTax: 0.00,
      customer: "Effertz, Lang and Daniel",
      date: "2025-05-14",
      expiryDate: "2025-06-04",
      status: "Draft",
      project: "Website Redesign"
    },
    {
      id: "EST-000013",
      amount: 1850.00,
      totalTax: 150.00,
      customer: "Jones-Dare",
      date: "2025-05-12",
      expiryDate: "2025-06-11",
      status: "Sent",
      project: "Marketing Campaign"
    },
    {
      id: "EST-000012",
      amount: 3560.00,
      totalTax: 360.00,
      customer: "Kautzer Inc",
      date: "2025-05-10",
      expiryDate: "2025-06-01",
      status: "Sent",
      project: "Mobile App"
    },
    {
      id: "EST-000011",
      amount: 5250.00,
      totalTax: 250.00,
      customer: "Lehner, Swift and Erdman",
      date: "2025-05-08",
      expiryDate: "2025-05-28",
      status: "Sent",
      project: "SEO Optimization"
    },
    {
      id: "EST-000010",
      amount: 4125.00,
      totalTax: 125.00,
      customer: "Klocko-Dickinson",
      date: "2025-05-05",
      expiryDate: "2025-05-25",
      status: "Accepted",
      project: "Branding Redesign"
    },
    {
      id: "EST-000009",
      amount: 1975.00,
      totalTax: 175.00,
      customer: "Hahn, Reilly and Ortiz",
      date: "2025-05-02",
      expiryDate: "2025-05-22",
      status: "Declined",
      project: "Email Campaign"
    }
  ]);

  // Calculate estimate statistics dynamically
  const calculateStats = () => {
    const total = estimates.length;
    const draft = estimates.filter(e => e.status === 'Draft').length;
    const sent = estimates.filter(e => e.status === 'Sent').length;
    const expired = estimates.filter(e => e.status === 'Expired').length;
    const declined = estimates.filter(e => e.status === 'Declined').length;
    const accepted = estimates.filter(e => e.status === 'Accepted').length;

    return {
      draft: {
        count: draft,
        total,
        percentage: Math.round((draft / total) * 100)
      },
      sent: {
        count: sent,
        total,
        percentage: Math.round((sent / total) * 100)
      },
      expired: {
        count: expired,
        total,
        percentage: Math.round((expired / total) * 100)
      },
      declined: {
        count: declined,
        total,
        percentage: Math.round((declined / total) * 100)
      },
      accepted: {
        count: accepted,
        total,
        percentage: Math.round((accepted / total) * 100)
      }
    };
  };

  const stats = calculateStats();

  const handleCreateEstimate = (data: any) => {
    const newEstimate: Estimate = {
      id: `EST-${String(estimates.length + 1).padStart(6, '0')}`,
      amount: parseFloat(data.amount),
      totalTax: parseFloat(data.tax),
      customer: data.customer,
      project: data.project,
      date: new Date().toISOString().split('T')[0],
      expiryDate: data.expiryDate,
      status: 'Draft',
    };
    
    setEstimates([newEstimate, ...estimates]);
    
    toast({
      title: "Estimate Created",
      description: `Estimate ${newEstimate.id} has been created successfully.`,
      variant: "default"
    });
  };

  const handleExport = (format: 'pdf' | 'xlsx' | 'csv') => {
    const exportData = estimates.map(({ id, amount, totalTax, customer, project, date, expiryDate, status }) => ({
      'Estimate #': id,
      'Amount': `$${amount.toFixed(2)}`,
      'Total Tax': `$${totalTax.toFixed(2)}`,
      'Customer': customer,
      'Project': project || '',
      'Date': formatDate(date),
      'Expiry Date': formatDate(expiryDate),
      'Status': status,
    }));

    if (format === 'csv') {
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const csv = XLSX.utils.sheet_to_csv(worksheet);
      const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      saveAs(csvBlob, 'estimates.csv');
      toast({
        title: "Export Successful",
        description: "Estimates exported as CSV",
        variant: "default"
      });
    } else if (format === 'xlsx') {
      const workbook = XLSX.utils.book_new();
      const worksheet = XLSX.utils.json_to_sheet(exportData);
      
      // Set column widths
      const columnWidths = [
        { wch: 12 }, // Estimate #
        { wch: 15 }, // Amount
        { wch: 15 }, // Total Tax
        { wch: 30 }, // Customer
        { wch: 20 }, // Project
        { wch: 12 }, // Date
        { wch: 12 }, // Expiry Date
        { wch: 12 }, // Status
      ];
      worksheet['!cols'] = columnWidths;
      
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Estimates');
      XLSX.writeFile(workbook, 'estimates.xlsx');
      toast({
        title: "Export Successful",
        description: "Estimates exported as Excel",
        variant: "default"
      });
    } else {
      // PDF export using our generator function
      const success = generateEstimatesTablePDF(estimates);
      if (success) {
        toast({
          title: "Export Successful",
          description: "Estimates exported as PDF",
          variant: "default"
        });
      } else {
        toast({
          title: "Export Failed",
          description: "Failed to export estimates as PDF",
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

  const handleViewEstimate = (estimate: Estimate) => {
    // Set the estimate to view in the preview dialog
    setViewEstimate(estimate);
  };
  
  const handleDownloadEstimate = (estimate: Estimate) => {
    // Generate and download PDF
    const success = generateEstimateDetailPDF(estimate);
    if (success) {
      toast({
        title: "Download Successful",
        description: `Estimate ${estimate.id} has been downloaded`,
        variant: "default"
      });
    } else {
      toast({
        title: "Download Failed",
        description: "Failed to download the estimate",
        variant: "destructive"
      });
    }
  };

  // Filter estimates based on search query
  const filteredEstimates = estimates.filter(estimate => 
    Object.values(estimate).some(value => 
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3">
      <div className="flex items-center justify-between space-y-2 mb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Estimates</h2>
          <p className="text-muted-foreground cursor-pointer">
            View Financial Stats
          </p>
        </div>
        <div className="flex gap-2">
          <CreateDialog
            title="Estimate"
            onSubmit={handleCreateEstimate}
            fields={[
              { name: 'customer', label: 'Customer', type: 'text', required: true },
              { name: 'amount', label: 'Amount', type: 'number', required: true },
              { name: 'tax', label: 'Tax', type: 'number', required: true },
              { name: 'project', label: 'Project', type: 'text' },
              { name: 'expiryDate', label: 'Expiry Date', type: 'date', required: true },
            ]}
          />
        </div>
      </div>

      {/* Stats Cards - Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 md:grid-cols-5 gap-4 mb-6">
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Draft</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.draft.count}</span>
            <span className="text-gray-500">/{stats.draft.total}</span>
            <span className="text-gray-400 ml-auto">({stats.draft.percentage}%)</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Sent</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.sent.count}</span>
            <span className="text-gray-500">/{stats.sent.total}</span>
            <span className="text-gray-400 ml-auto">({stats.sent.percentage}%)</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Expired</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.expired.count}</span>
            <span className="text-gray-500">/{stats.expired.total}</span>
            <span className="text-gray-400 ml-auto">({stats.expired.percentage}%)</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Declined</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.declined.count}</span>
            <span className="text-gray-500">/{stats.declined.total}</span>
            <span className="text-gray-400 ml-auto">({stats.declined.percentage}%)</span>
          </div>
        </div>
        
        <div className="border rounded-lg p-4">
          <h3 className="text-lg font-medium mb-1">Accepted</h3>
          <div className="flex items-center gap-2">
            <span className="text-3xl font-bold">{stats.accepted.count}</span>
            <span className="text-gray-500">/{stats.accepted.total}</span>
            <span className="text-gray-400 ml-auto">({stats.accepted.percentage}%)</span>
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
              placeholder="Search estimates..."
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
                <TableHead>Estimate #</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Total Tax</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Expiry Date</TableHead>
                <TableHead>Reference #</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEstimates.map((estimate) => (
                <TableRow 
                  key={estimate.id} 
                  className="hover:bg-gray-50"
                >
                  <TableCell>{estimate.id}</TableCell>
                  <TableCell>${estimate.amount.toFixed(2)}</TableCell>
                  <TableCell>${estimate.totalTax.toFixed(2)}</TableCell>
                  <TableCell>{estimate.customer}</TableCell>
                  <TableCell>{estimate.project || '-'}</TableCell>
                  <TableCell>
                    {estimate.tags?.map(tag => (
                      <Badge key={tag} variant="secondary" className="mr-1">
                        {tag}
                      </Badge>
                    )) || '-'}
                  </TableCell>
                  <TableCell>{formatDate(estimate.date)}</TableCell>
                  <TableCell>{formatDate(estimate.expiryDate)}</TableCell>
                  <TableCell>{estimate.reference || '-'}</TableCell>
                  <TableCell>
                    <Badge 
                      className={
                        estimate.status === 'Accepted' ? 'bg-green-100 text-green-800 hover:bg-green-100' :
                        estimate.status === 'Sent' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                        estimate.status === 'Draft' ? 'bg-gray-100 text-gray-800 hover:bg-gray-100' :
                        estimate.status === 'Expired' ? 'bg-yellow-100 text-yellow-800 hover:bg-yellow-100' :
                        'bg-red-100 text-red-800 hover:bg-red-100'
                      }
                    >
                      {estimate.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewEstimate(estimate)}
                      title="View Estimate"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadEstimate(estimate)}
                      title="Download Estimate"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Email Estimate",
                          description: "Email functionality would be implemented here",
                        });
                      }}
                      title="Email Estimate"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Print Estimate",
                          description: "Print functionality would be implemented here",
                        });
                      }}
                      title="Print Estimate"
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
            Showing 1 to {filteredEstimates.length} of {filteredEstimates.length} entries
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
      
      {/* Estimate Preview Dialog */}
      <Dialog open={!!viewEstimate} onOpenChange={(open) => !open && setViewEstimate(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Estimate {viewEstimate?.id}</DialogTitle>
            <DialogDescription>
              View estimate details
            </DialogDescription>
          </DialogHeader>
          
          {viewEstimate && (
            <div className="space-y-6 overflow-auto max-h-[70vh]">
              {/* Estimate Details */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between border-b pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{viewEstimate.customer}</h3>
                    <p className="text-sm text-gray-500">
                      {viewEstimate.project && <span className="block">Project: {viewEstimate.project}</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Status</div>
                    <Badge 
                      className={
                        viewEstimate.status === 'Accepted' ? 'bg-green-100 text-green-800' :
                        viewEstimate.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                        viewEstimate.status === 'Draft' ? 'bg-gray-100 text-gray-800' :
                        viewEstimate.status === 'Expired' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }
                    >
                      {viewEstimate.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div>{formatDate(viewEstimate.date)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Expiry Date</div>
                    <div>{formatDate(viewEstimate.expiryDate)}</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Financial Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <div className="flex justify-between py-1">
                        <span>Subtotal</span>
                        <span>${(viewEstimate.amount - viewEstimate.totalTax).toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span>Tax</span>
                        <span>${viewEstimate.totalTax.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between py-1 font-bold border-t mt-2 pt-2">
                        <span>Total</span>
                        <span>${viewEstimate.amount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setViewEstimate(null)}
                >
                  Close
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => handleDownloadEstimate(viewEstimate)}
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

export default Estimates;
