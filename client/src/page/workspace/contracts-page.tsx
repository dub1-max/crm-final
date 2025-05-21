import { Plus, Download, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ContractsStats } from "./contracts-stats";
import { ContractsTable } from "./contracts-table";
import { ContractsCharts } from "./contracts-charts";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useState } from "react";
import { ContractForm } from "@/components/forms/contract-form";
import { useToast } from "@/components/ui/use-toast";
import { format } from "date-fns";

export function ContractsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const handleCreateContract = async (formData: any) => {
    try {
      setIsCreating(true);
      // Here you would typically make an API call to create the contract
      // For now, we'll simulate an API call with a timeout
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Format the contract data
      const newContract = {
        id: `CON-${new Date().getFullYear()}-${Math.floor(Math.random() * 1000)}`,
        title: formData.title,
        client: formData.client,
        startDate: formData.startDate ? format(formData.startDate, "yyyy-MM-dd") : "",
        endDate: formData.endDate ? format(formData.endDate, "yyyy-MM-dd") : "",
        value: formData.value,
        status: formData.status,
        description: formData.description,
      };

      // Here you would typically save the contract to your backend
      console.log("New contract:", newContract);

      toast({
        title: "Success",
        description: "Contract created successfully",
      });

      setIsDialogOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to create contract",
        variant: "destructive",
      });
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <div className="container mx-auto p-4 space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Contracts</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
              <Plus className="h-4 w-4 mr-2" />
              New Contract
            </Button>
          </DialogTrigger>
          <DialogContent className="w-[95vw] max-w-3xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Create New Contract</DialogTitle>
              <DialogDescription>
                Fill in the details below to create a new contract.
              </DialogDescription>
            </DialogHeader>
            <ContractForm
              onSubmit={handleCreateContract}
              onCancel={() => setIsDialogOpen(false)}
              isLoading={isCreating}
            />
          </DialogContent>
        </Dialog>
      </div>

      <ContractsStats />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search contracts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 w-full"
          />
        </div>
        <Button variant="outline" size="icon" className="self-end sm:self-auto">
          <Download className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
        <ContractsCharts />
      </div>

      <ContractsTable />
    </div>
  );
}
