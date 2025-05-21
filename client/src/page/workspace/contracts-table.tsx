import { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
/*import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from "@/components/ui/dropdown-menu";*/
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Download, Mail, Printer, Eye } from "lucide-react";

export interface Contract {
  id: string;
  name: string;
  client: string;
  startDate: string;
  endDate: string;
  value: number;
  status: "active" | "draft" | "expired" | "terminated";
}

interface ContractsTableProps {
  contracts: Contract[];
  onDeleteContract?: (id: string) => void;
  onViewContract?: (contract: Contract) => void;
  onDownloadContract?: (contract: Contract) => void;
  onEmailContract?: (contract: Contract) => void;
  onPrintContract?: (contract: Contract) => void;
}

export function ContractsTable({ 
  contracts, 
  //onDeleteContract, 
  onViewContract,
  onDownloadContract,
  onEmailContract,
  onPrintContract
}: ContractsTableProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "draft": return "bg-yellow-100 text-yellow-800";
      case "expired": return "bg-gray-100 text-gray-800";
      case "terminated": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  // Show full table on desktop, and a simplified version on mobile
  return (
    <div className="rounded-lg border bg-card">
      {/* Desktop view */}
      <div className="hidden md:block overflow-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Contract ID</TableHead>
              <TableHead>Name</TableHead>
              <TableHead>Client</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead>Value</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {contracts.map((contract) => (
              <TableRow 
                key={contract.id} 
                className="hover:bg-muted/50"
              >
                <TableCell className="font-medium">{contract.id}</TableCell>
                <TableCell>{contract.name}</TableCell>
                <TableCell>{contract.client}</TableCell>
                <TableCell>{formatDate(contract.startDate)}</TableCell>
                <TableCell>{formatDate(contract.endDate)}</TableCell>
                <TableCell>{formatCurrency(contract.value)}</TableCell>
                <TableCell>
                  <Badge className={getStatusColor(contract.status)} variant="outline">
                    {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right space-x-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewContract && onViewContract(contract)}
                    title="View Contract"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onDownloadContract && onDownloadContract(contract)}
                    title="Download Contract"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEmailContract && onEmailContract(contract)}
                    title="Email Contract"
                  >
                    <Mail className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onPrintContract && onPrintContract(contract)}
                    title="Print Contract"
                  >
                    <Printer className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      {/* Mobile view - card-based layout */}
      <div className="md:hidden">
        {contracts.map((contract) => (
          <div 
            key={contract.id}
            className="border-b p-4 hover:bg-muted/50"
          >
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-medium text-base">{contract.name}</h3>
                <p className="text-sm text-muted-foreground">{contract.client}</p>
              </div>
              <div className="flex space-x-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onViewContract && onViewContract(contract)}
                  title="View Contract"
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={() => onDownloadContract && onDownloadContract(contract)}
                  title="Download Contract"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-xs text-muted-foreground">{contract.id}</span>
              <Badge className={getStatusColor(contract.status)} variant="outline">
                {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
              </Badge>
            </div>
            
            <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
              <div>
                <span className="text-muted-foreground">Value: </span>
                <span className="font-medium">{formatCurrency(contract.value)}</span>
              </div>
              <div>
                <span className="text-muted-foreground">Dates: </span>
                <span>{formatDate(contract.startDate).split(',')[0]} - {formatDate(contract.endDate).split(',')[0]}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
