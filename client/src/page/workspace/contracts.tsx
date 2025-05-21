import { useState } from "react";
import { generateContractPDF, generateContractsTablePDF } from "./generate-pdf";

import { Plus, Download, Search, FileText } from "lucide-react";
import { Button } from "../../components/ui/button";
import { Input } from "../../components/ui/input";
import { ContractsStats } from "./contracts-stats";
import { ContractsTable, Contract } from "./contracts-table";
import { ContractsCharts } from "./contracts-charts";
import { AddContractDialog } from "./add-contract-dialog";
import { ContractDetailsDialog } from "./contract-details-dialog";
import { useToast } from "@/components/ui/use-toast";
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
  DropdownMenuPortal,
} from "@/components/ui/dropdown-menu";

// Add console logging
console.log("contracts.tsx loaded, jsPDF availability:", typeof window !== 'undefined' ? typeof jsPDF !== 'undefined' : 'Not in browser');

export function Contracts() {
  const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedContract, setSelectedContract] = useState<Contract | null>(null);
  const [isDetailsDialogOpen, setIsDetailsDialogOpen] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [contracts, setContracts] = useState<Contract[]>([
    {
      id: "CON-001",
      name: "Annual Service Agreement",
      client: "Baumbach Inc",
      startDate: "2024-01-01",
      endDate: "2024-12-31",
      value: 24000,
      status: "active"
    },
    {
      id: "CON-002",
      name: "Software Development",
      client: "Effertz, Lang and Daniel",
      startDate: "2024-03-15",
      endDate: "2024-09-15",
      value: 48000,
      status: "active"
    },
    {
      id: "CON-003",
      name: "Website Maintenance",
      client: "Baumbach Inc",
      startDate: "2023-06-01",
      endDate: "2024-05-31",
      value: 12000,
      status: "expired"
    },
    {
      id: "CON-004",
      name: "Cloud Infrastructure Setup",
      client: "Tech Solutions Ltd",
      startDate: "2024-02-15",
      endDate: "2024-07-15",
      value: 35000,
      status: "active"
    },
    {
      id: "CON-005",
      name: "UI/UX Design Project",
      client: "Creative Designs Inc",
      // Set to expire in 25 days from today
      startDate: "2024-01-10",
      endDate: new Date(new Date().setDate(new Date().getDate() + 25)).toISOString().split('T')[0],
      value: 18500,
      status: "active"
    },
    {
      id: "CON-006",
      name: "Data Migration Services",
      client: "DataFlow Systems",
      startDate: "2024-04-01",
      // Set to expire in 15 days from today
      endDate: new Date(new Date().setDate(new Date().getDate() + 15)).toISOString().split('T')[0],
      value: 27500,
      status: "active"
    },
    {
      id: "CON-007",
      name: "Security Audit",
      client: "Secure Networks Inc",
      startDate: "2024-05-15",
      endDate: "2024-06-30",
      value: 15000,
      status: "draft"
    },
    {
      id: "CON-008",
      name: "Mobile App Development",
      client: "Appify Solutions",
      startDate: "2024-04-20",
      endDate: "2024-10-20",
      value: 65000,
      status: "draft"
    }
  ]);

  const handleAddContract = (contract: Contract) => {
    setContracts([...contracts, contract]);
    toast({
      title: "Contract added",
      description: `${contract.name} has been added successfully.`,
    });
  };

  const handleDeleteContract = (id: string) => {
    setContracts(contracts.filter(contract => contract.id !== id));
    toast({
      title: "Contract deleted",
      description: "The contract has been deleted successfully.",
    });
  };

  const handleViewContract = (contract: Contract) => {
    setSelectedContract(contract);
    setIsDetailsDialogOpen(true);
  };
  
  const handleDownloadContract = (contract: Contract) => {
    if (isExporting) return;
    
    setIsExporting(true);
    console.log("Download contract initiated:", contract.id);
    
    setTimeout(() => {  // Add slight delay to ensure UI updates
      try {
        // Use our styled PDF generator
        const success = generateContractPDF(contract);
        
        if (success) {
          toast({
            title: "Contract exported",
            description: `${contract.name} has been exported as PDF.`,
            variant: "success"
          });
        } else {
          toast({
            title: "Export failed",
            description: "Failed to export the contract. Please try again.",
            variant: "destructive"
          });
        }
      } catch (error) {
        console.error("Error exporting contract:", error);
        toast({
          title: "Export failed",
          description: "An error occurred during export.",
          variant: "destructive"
        });
      } finally {
        setIsExporting(false);
      }
    }, 100);
  };
  
  const handleEmailContract = (contract: Contract) => {
    toast({
      title: "Email contract",
      description: "Email functionality would be implemented here",
    });
  };
  
  const handlePrintContract = (contract: Contract) => {
    toast({
      title: "Print contract",
      description: "Print functionality would be implemented here",
    });
  };

  const handleExport = async (format: 'pdf' | 'xlsx' | 'csv') => {
    if (isExporting) return;
    
    setIsExporting(true);
    console.log("Export initiated:", format);
    
    try {
      const exportData = contracts.map(contract => ({
        'Contract ID': contract.id,
        'Name': contract.name,
        'Client': contract.client,
        'Start Date': contract.startDate,
        'End Date': contract.endDate,
        'Value': `$${contract.value.toLocaleString()}`,
        'Status': contract.status.charAt(0).toUpperCase() + contract.status.slice(1)
      }));

      let success = false;
      
      switch (format) {
        case 'csv':
          const worksheet = XLSX.utils.json_to_sheet(exportData);
          const csv = XLSX.utils.sheet_to_csv(worksheet);
          const csvBlob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
          saveAs(csvBlob, 'contracts.csv');
          success = true;
          break;
          
        case 'xlsx':
          const workbook = XLSX.utils.book_new();
          const excelWorksheet = XLSX.utils.json_to_sheet(exportData);
          
          // Set column widths
          const columnWidths = [
            { wch: 12 }, // Contract ID
            { wch: 30 }, // Name
            { wch: 25 }, // Client
            { wch: 12 }, // Start Date
            { wch: 12 }, // End Date
            { wch: 12 }, // Value
            { wch: 12 }, // Status
          ];
          excelWorksheet['!cols'] = columnWidths;
          
          XLSX.utils.book_append_sheet(workbook, excelWorksheet, 'Contracts');
          XLSX.writeFile(workbook, 'contracts.xlsx');
          success = true;
          break;
          
        case 'pdf':
          // Use our styled PDF generator
          success = generateContractsTablePDF(contracts);
          break;
      }
      
      if (success) {
        toast({
          title: "Export successful",
          description: `Contracts exported as ${format.toUpperCase()}`,
          variant: "success"
        });
      } else {
        toast({
          title: "Export failed",
          description: `Failed to export as ${format.toUpperCase()}. Please try again.`,
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error during export:", error);
      toast({
        title: "Export failed",
        description: "An error occurred during export.",
        variant: "destructive"
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleExportSingleContract = (contractId: string) => {
    if (isExporting) return;
    
    const contract = contracts.find(c => c.id === contractId);
    if (contract) {
      handleDownloadContract(contract);
    }
  };

  const filteredContracts = contracts.filter(contract => {
    if (!searchQuery) return true;
    
    const query = searchQuery.toLowerCase();
    return (
      contract.name.toLowerCase().includes(query) ||
      contract.client.toLowerCase().includes(query) ||
      contract.id.toLowerCase().includes(query)
    );
  });

  return (
    <div className="flex flex-col gap-6 p-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
      </div>
      
      <ContractsStats contracts={contracts} />
      
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <Button 
          className="gap-2"
          onClick={() => setIsDialogOpen(true)}
        >
          <Plus className="h-4 w-4" />
          New Contract
        </Button>
        <div className="flex flex-col md:flex-row items-start md:items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search contracts..."
              className="pl-9 w-full md:w-[300px]"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2 w-full md:w-auto" disabled={isExporting}>
                <Download className="h-4 w-4" />
                {isExporting ? "Exporting..." : "Export"}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <DropdownMenuItem 
                onClick={() => handleExport('xlsx')}
                disabled={isExporting}
              >
                Export All as Excel
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => handleExport('csv')}
                disabled={isExporting}
              >
                Export All as CSV
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ContractsCharts />
      </div>

      <ContractsTable 
        contracts={filteredContracts} 
        onDeleteContract={handleDeleteContract}
        onViewContract={handleViewContract}
        onDownloadContract={handleDownloadContract}
        onEmailContract={handleEmailContract}
        onPrintContract={handlePrintContract}
      />
      
      <AddContractDialog 
        isOpen={isDialogOpen}
        setIsOpen={setIsDialogOpen}
        onAddContract={handleAddContract}
      />

      <ContractDetailsDialog
        contract={selectedContract}
        isOpen={isDetailsDialogOpen}
        onClose={() => setIsDetailsDialogOpen(false)}
      />
    </div>
  );
} 