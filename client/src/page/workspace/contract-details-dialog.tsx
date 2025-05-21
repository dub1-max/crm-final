import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Contract } from "./contracts-table";
import { generateContractPDF } from "./generate-pdf";
import { useToast } from "@/components/ui/use-toast";
import { Download } from "lucide-react";
import { useState } from "react";

interface ContractDetailsDialogProps {
  contract: Contract | null;
  isOpen: boolean;
  onClose: () => void;
}

export function ContractDetailsDialog({ contract, isOpen, onClose }: ContractDetailsDialogProps) {
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  if (!contract) {
    return null;
  }

  const handleDownloadPDF = async () => {
    if (!contract || isGenerating) return;

    setIsGenerating(true);
    console.log("Download PDF clicked for contract:", contract.id);

    try {
      const result = generateContractPDF(contract);
      const success = await Promise.resolve(result);

      if (success) {
        toast({
          title: "Contract exported",
          description: `${contract.name} has been exported as PDF.`,
          variant: "success"
        });
      } else {
        toast({
          title: "Export failed",
          description: "There was an issue generating the PDF. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error in handleDownloadPDF:", error);
      toast({
        title: "Export failed",
        description: "There was an error exporting the contract.",
        variant: "destructive"
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const options: Intl.DateTimeFormatOptions = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(amount);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Contract {contract.id}</DialogTitle>
          <DialogDescription>
            View contract details
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6 overflow-auto max-h-[70vh]">
          {/* Contract Details */}
          <div className="border rounded-lg p-4">
            <div className="flex justify-between border-b pb-4 mb-4">
              <div>
                <h3 className="font-bold text-lg mb-1">{contract.name}</h3>
                <p className="text-sm text-gray-500">
                  Client: {contract.client}
                </p>
              </div>
              <div className="text-right">
                <div className="text-sm text-gray-500">Status</div>
                <Badge 
                  className={
                    contract.status === 'active' ? 'bg-green-100 text-green-800' :
                    contract.status === 'draft' ? 'bg-yellow-100 text-yellow-800' :
                    contract.status === 'expired' ? 'bg-gray-100 text-gray-800' :
                    'bg-red-100 text-red-800'
                  }
                >
                  {contract.status.charAt(0).toUpperCase() + contract.status.slice(1)}
                </Badge>
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mb-4">
              <div>
                <div className="text-sm text-gray-500">Start Date</div>
                <div>{formatDate(contract.startDate)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">End Date</div>
                <div>{formatDate(contract.endDate)}</div>
              </div>
              <div>
                <div className="text-sm text-gray-500">Contract Value</div>
                <div className="font-medium">{formatCurrency(contract.value)}</div>
              </div>
            </div>
            
            <div className="border-t pt-4">
              <h3 className="font-medium mb-3">Description</h3>
              <p className="text-sm text-gray-600">
                This contract between {contract.client} and our company establishes a formal agreement for
                the services described. The contract is valid from {formatDate(contract.startDate)} to {formatDate(contract.endDate)}.
              </p>
            </div>
            
            <div className="border-t pt-4 mt-4">
              <h3 className="font-medium mb-3">Contract Terms</h3>
              <ul className="list-none space-y-1 text-sm text-gray-600">
                <li>• The service provider agrees to provide services as outlined in the contract.</li>
                <li>• Payment of {formatCurrency(contract.value)} shall be made according to the payment schedule.</li>
                <li>• Any modifications to this contract must be made in writing and agreed upon by both parties.</li>
              </ul>
            </div>
          </div>
          
          {/* Actions */}
          <div className="flex justify-end gap-2">
            <Button 
              variant="outline" 
              onClick={onClose}
            >
              Close
            </Button>
            <Button 
              variant="default" 
              onClick={handleDownloadPDF}
              className="flex items-center gap-2"
              disabled={isGenerating}
            >
              <Download className="h-4 w-4" />
              {isGenerating ? "Generating..." : "Download PDF"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
} 