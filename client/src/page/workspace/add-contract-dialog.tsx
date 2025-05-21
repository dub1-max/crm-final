import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
//import { format } from "date-fns";
import { Contract } from "./contracts-table";

interface AddContractDialogProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
  onAddContract: (contract: Contract) => void;
}

export function AddContractDialog({ isOpen, setIsOpen, onAddContract }: AddContractDialogProps) {
  const [name, setName] = useState("");
  const [client, setClient] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(new Date());
  const [value, setValue] = useState("");
  const [status, setStatus] = useState<"active" | "draft" | "expired" | "terminated">("draft");

  const handleSubmit = () => {
    // Generate a random ID with format "CON-XXX"
    const id = `CON-${Math.floor(Math.random() * 900) + 100}`;
    
    // Create new contract object
    const newContract: Contract = {
      id,
      name,
      client,
      startDate: startDate ? startDate.toISOString().split('T')[0] : "",
      endDate: endDate ? endDate.toISOString().split('T')[0] : "",
      value: parseFloat(value) || 0,
      status
    };
    
    // Add the contract
    onAddContract(newContract);
    
    // Reset form
    setName("");
    setClient("");
    setStartDate(new Date());
    setEndDate(new Date());
    setValue("");
    setStatus("draft");
    
    // Close dialog
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add New Contract</DialogTitle>
          <DialogDescription>
            Enter the details for the new contract.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="col-span-3"
              placeholder="Contract name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="client" className="text-right">
              Client
            </Label>
            <Input
              id="client"
              value={client}
              onChange={(e) => setClient(e.target.value)}
              className="col-span-3"
              placeholder="Client name"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="startDate" className="text-right">
              Start Date
            </Label>
            <div className="col-span-3">
              <Input
                id="startDate"
                type="date"
                value={startDate ? startDate.toISOString().split('T')[0] : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined;
                  setStartDate(date);
                }}
                className="col-span-3"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="endDate" className="text-right">
              End Date
            </Label>
            <div className="col-span-3">
              <Input
                id="endDate"
                type="date"
                value={endDate ? endDate.toISOString().split('T')[0] : ""}
                onChange={(e) => {
                  const date = e.target.value ? new Date(e.target.value) : undefined;
                  setEndDate(date);
                }}
                className="col-span-3"
              />
            </div>
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="value" className="text-right">
              Value ($)
            </Label>
            <Input
              id="value"
              type="number"
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="col-span-3"
              placeholder="Contract value"
            />
          </div>
          
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="status" className="text-right">
              Status
            </Label>
            <Select 
              value={status} 
              onValueChange={(value) => setStatus(value as any)}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="expired">Expired</SelectItem>
                <SelectItem value="terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        
        <DialogFooter>
          <Button type="submit" onClick={handleSubmit}>Add Contract</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 