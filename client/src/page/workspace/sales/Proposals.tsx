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
import { useToast } from "@/components/ui/use-toast";
import { generateProposalDetailPDF, generateProposalsTablePDF } from "../generate-proposal-pdf";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export interface Proposal {
  id: string;
  subject: string;
  to: string;
  total: number;
  date: string;
  openTill: string;
  project?: string;
  tags?: string[];
  status: 'Sent' | 'Open';
}

export const proposalsDemoData: Proposal[] = [
  {
    id: "PRO-000002",
    subject: "Web Design Proposal",
    to: "Schaden-Watsica",
    total: 5900.00,
    date: "2025-05-14",
    openTill: "2025-05-21",
    status: "Sent"
  },
  {
    id: "PRO-000001",
    subject: "SEO Proposal",
    to: "Stehr, Kuhic and Klocko",
    total: 1932.00,
    date: "2025-05-14",
    openTill: "2025-05-21",
    status: "Open"
  }
];

const Proposals = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const { toast } = useToast();
  const [viewProposal, setViewProposal] = useState<Proposal | null>(null);
  
  const [proposals, setProposals] = useState<Proposal[]>([
    {
      id: "PRO-000002",
      subject: "Web Design Proposal",
      to: "Schaden-Watsica",
      total: 5900.00,
      date: "2025-05-14",
      openTill: "2025-05-21",
      status: "Sent"
    },
    {
      id: "PRO-000001",
      subject: "SEO Proposal",
      to: "Stehr, Kuhic and Klocko",
      total: 1932.00,
      date: "2025-05-14",
      openTill: "2025-05-21",
      status: "Open"
    }
  ]);

  const handleExport = (format: 'csv' | 'xlsx' | 'pdf') => {
    const exportData = proposals.map(({ id, subject, to, total, date, openTill, project, status }) => ({
      'Proposal #': id,
      'Subject': subject,
      'To': to,
      'Total': `$${total.toFixed(2)}`,
      'Date': formatDate(date),
      'Open Till': formatDate(openTill),
      'Project': project || '',
      'Status': status,
    }));

    switch (format) {
      case 'csv':
        const ws = XLSX.utils.json_to_sheet(exportData);
        const csv = XLSX.utils.sheet_to_csv(ws);
        const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
        saveAs(csvBlob, 'proposals.csv');
        toast({
          title: "Export Successful",
          description: "Proposals exported as CSV",
          variant: "default"
        });
        break;

      case 'xlsx':
        const workbook = XLSX.utils.book_new();
        const worksheet = XLSX.utils.json_to_sheet(exportData);
        
        // Add column widths
        const columnWidths = [
          { wch: 15 }, // Proposal #
          { wch: 30 }, // Subject
          { wch: 25 }, // To
          { wch: 12 }, // Total
          { wch: 12 }, // Date
          { wch: 12 }, // Open Till
          { wch: 20 }, // Project
          { wch: 10 }, // Status
        ];
        worksheet['!cols'] = columnWidths;

        XLSX.utils.book_append_sheet(workbook, worksheet, 'Proposals');
        XLSX.writeFile(workbook, 'proposals.xlsx');
        toast({
          title: "Export Successful",
          description: "Proposals exported as Excel",
          variant: "default"
        });
        break;

      case 'pdf':
        const success = generateProposalsTablePDF(proposals);
        if (success) {
          toast({
            title: "Export Successful",
            description: "Proposals exported as PDF",
            variant: "default"
          });
        } else {
          toast({
            title: "Export Failed",
            description: "Failed to export proposals as PDF",
            variant: "destructive"
          });
        }
        break;
    }
  };

  const handleCreateProposal = (data: any) => {
    const newProposal: Proposal = {
      id: `PRO-${String(proposals.length + 1).padStart(6, '0')}`,
      subject: data.subject,
      to: data.to,
      total: parseFloat(data.total),
      date: new Date().toISOString().split('T')[0],
      openTill: data.openTill,
      project: data.project,
      status: 'Open'
    };
    
    setProposals([newProposal, ...proposals]);
    
    toast({
      title: "Proposal Created",
      description: `Proposal ${newProposal.id} has been created successfully.`,
      variant: "default"
    });
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('/');
  };
  
  const handleViewProposal = (proposal: Proposal) => {
    // Set the proposal to view in the preview dialog
    setViewProposal(proposal);
  };
  
  const handleDownloadProposal = (proposal: Proposal) => {
    // Generate and download PDF
    const success = generateProposalDetailPDF(proposal);
    if (success) {
      toast({
        title: "Download Successful",
        description: `Proposal ${proposal.id} has been downloaded`,
        variant: "default"
      });
    } else {
      toast({
        title: "Download Failed",
        description: "Failed to download the proposal",
        variant: "destructive"
      });
    }
  };

  // Filter proposals based on search query
  const filteredProposals = proposals.filter(proposal => 
    Object.values(proposal).some(value => 
      value?.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Proposals</h2>
        </div>
        <div className="flex gap-2">
          <CreateDialog
            title="Proposal"
            onSubmit={handleCreateProposal}
            fields={[
              { name: 'subject', label: 'Subject', type: 'text', required: true },
              { name: 'to', label: 'To', type: 'text', required: true },
              { name: 'total', label: 'Total Amount', type: 'number', required: true },
              { name: 'project', label: 'Project', type: 'text' },
              { name: 'openTill', label: 'Open Till', type: 'date', required: true },
            ]}
          />
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
              placeholder="Search proposals..."
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
                <TableHead>Proposal #</TableHead>
                <TableHead>Subject</TableHead>
                <TableHead>To</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Open Till</TableHead>
                <TableHead>Project</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredProposals.map((proposal) => (
                <TableRow 
                  key={proposal.id}
                  className="hover:bg-gray-50"
                >
                  <TableCell>{proposal.id}</TableCell>
                  <TableCell>{proposal.subject}</TableCell>
                  <TableCell>{proposal.to}</TableCell>
                  <TableCell>${proposal.total.toFixed(2)}</TableCell>
                  <TableCell>{formatDate(proposal.date)}</TableCell>
                  <TableCell>{formatDate(proposal.openTill)}</TableCell>
                  <TableCell>{proposal.project || '-'}</TableCell>
                  <TableCell>
                    <Badge
                      className={
                        proposal.status === 'Sent' ? 'bg-blue-100 text-blue-800 hover:bg-blue-100' :
                        'bg-green-100 text-green-800 hover:bg-green-100'
                      }
                    >
                      {proposal.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right space-x-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleViewProposal(proposal)}
                      title="View Proposal"
                    >
                      <Eye className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDownloadProposal(proposal)}
                      title="Download Proposal"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Email Proposal",
                          description: "Email functionality would be implemented here",
                        });
                      }}
                      title="Email Proposal"
                    >
                      <Mail className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        toast({
                          title: "Print Proposal",
                          description: "Print functionality would be implemented here",
                        });
                      }}
                      title="Print Proposal"
                    >
                      <Printer className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-muted-foreground">
            Showing 1 to {filteredProposals.length} of {proposals.length} entries
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
      
      {/* Proposal Preview Dialog */}
      <Dialog open={!!viewProposal} onOpenChange={(open) => !open && setViewProposal(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Proposal {viewProposal?.id}</DialogTitle>
            <DialogDescription>
              View proposal details
            </DialogDescription>
          </DialogHeader>
          
          {viewProposal && (
            <div className="space-y-6 overflow-auto max-h-[70vh]">
              {/* Proposal Details */}
              <div className="border rounded-lg p-4">
                <div className="flex justify-between border-b pb-4 mb-4">
                  <div>
                    <h3 className="font-bold text-lg mb-1">{viewProposal.subject}</h3>
                    <p className="text-sm text-gray-500">
                      To: {viewProposal.to}
                      {viewProposal.project && <span className="block">Project: {viewProposal.project}</span>}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-500">Status</div>
                    <Badge 
                      className={
                        viewProposal.status === 'Sent' ? 'bg-blue-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }
                    >
                      {viewProposal.status}
                    </Badge>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <div className="text-sm text-gray-500">Date</div>
                    <div>{formatDate(viewProposal.date)}</div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Open Till</div>
                    <div>{formatDate(viewProposal.openTill)}</div>
                  </div>
                </div>
                
                <div className="border-t pt-4">
                  <h3 className="font-medium mb-3">Financial Summary</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-sm">
                      <div className="flex justify-between py-1 font-bold">
                        <span>Total Amount</span>
                        <span>${viewProposal.total.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  onClick={() => setViewProposal(null)}
                >
                  Close
                </Button>
                <Button 
                  variant="default" 
                  onClick={() => handleDownloadProposal(viewProposal)}
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

export default Proposals;
