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
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Plus, Upload, MoreHorizontal, Search, Download } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

// Add this interface for Customer type
interface Customer {
  id: number;
  company: string;
  primaryContact: string;
  email: string;
  phone: string;
  active: boolean;
  groups: string[];
  dateCreated: string;
}

// Update the form schema to handle groups
const customerFormSchema = z.object({
  company: z.string().min(2, "Company name must be at least 2 characters"),
  primaryContact: z.string().min(2, "Contact name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Phone number must be at least 10 characters"),
  groups: z.array(z.string()).default([]), // Set default as empty array
});

type CustomerFormValues = z.infer<typeof customerFormSchema>;

const Customers = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewCustomerOpen, setIsNewCustomerOpen] = useState(false);
  const [customers, setCustomers] = useState<Customer[]>([
    {
      id: 5,
      company: "Baumbach Inc",
      primaryContact: "Lincoln Macejkovic",
      email: "klocko.raquel@example.org",
      phone: "727.668.2321",
      active: true,
      groups: ["Wholesaler"],
      dateCreated: "2025-05-14 13:00:09"
    },
    {
      id: 10,
      company: "Effertz, Lang and Daniel",
      primaryContact: "Godfrey Metz",
      email: "nthompson@example.org",
      phone: "+1 (540) 679-9144",
      active: true,
      groups: ["Low Budget", "High Budget"],
      dateCreated: "2025-05-14 13:00:09"
    },
  ]);

  // Form handling
  const form = useForm<CustomerFormValues>({
    resolver: zodResolver(customerFormSchema),
    defaultValues: {
      company: "",
      primaryContact: "",
      email: "",
      phone: "",
      groups: [],
    },
  });

  // Update the onSubmit function to ensure groups is always an array
  const onSubmit = (data: CustomerFormValues) => {
    const newCustomer: Customer = {
      id: customers.length + 1,
      ...data,
      groups: data.groups || [], // Ensure groups is an array
      active: true,
      dateCreated: new Date().toISOString(),
    };
    setCustomers([...customers, newCustomer]);
    setIsNewCustomerOpen(false);
    form.reset();
  };

  // Handle customer search
  const filteredCustomers = customers.filter((customer) =>
    Object.values(customer).some((value) =>
      value.toString().toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  // Handle toggle active status
  const handleToggleActive = (customerId: number) => {
    setCustomers(
      customers.map((customer) =>
        customer.id === customerId
          ? { ...customer, active: !customer.active }
          : customer
      )
    );
  };

  // Update the import handler to ensure proper typing
  const handleImportCustomers = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedData = JSON.parse(e.target?.result as string);
          // Ensure imported data matches Customer type
          const importedCustomers: Customer[] = importedData.map((item: any) => ({
            ...item,
            groups: Array.isArray(item.groups) ? item.groups : [],
            active: Boolean(item.active),
            dateCreated: item.dateCreated || new Date().toISOString(),
          }));
          setCustomers([...customers, ...importedCustomers]);
        } catch (error) {
          console.error("Error importing customers:", error);
        }
      };
      reader.readAsText(file);
    }
  };

  // Add these new functions for export functionality
  const exportToCSV = (customers: Customer[]) => {
    // Convert customers data to CSV format
    const headers = ['ID', 'Company', 'Primary Contact', 'Email', 'Phone', 'Active', 'Groups', 'Date Created'];
    const csvData = customers.map(customer => [
      customer.id,
      customer.company,
      customer.primaryContact,
      customer.email,
      customer.phone,
      customer.active ? 'Yes' : 'No',
      customer.groups.join(', '),
      customer.dateCreated
    ]);

    const csvContent = [
      headers.join(','),
      ...csvData.map(row => row.map(cell => 
        typeof cell === 'string' ? `"${cell.replace(/"/g, '""')}"` : cell
      ).join(','))
    ].join('\n');

    downloadFile(csvContent, 'customers.csv', 'text/csv');
  };

  const exportToJSON = (customers: Customer[]) => {
    const jsonContent = JSON.stringify(customers, null, 2);
    downloadFile(jsonContent, 'customers.json', 'application/json');
  };

  const downloadFile = (content: string, fileName: string, contentType: string) => {
    const blob = new Blob([content], { type: contentType });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  // Add function to handle selected customers export
  const exportSelectedCustomers = (format: 'csv' | 'json') => {
    const selectedCustomers = customers.filter((_, index) => 
      selectedRows.includes(index)
    );
    if (selectedCustomers.length === 0) {
      // If no customers are selected, export all customers
      format === 'csv' ? exportToCSV(customers) : exportToJSON(customers);
    } else {
      format === 'csv' ? exportToCSV(selectedCustomers) : exportToJSON(selectedCustomers);
    }
  };

  // Add state for selected rows
  const [selectedRows, setSelectedRows] = useState<number[]>([]);

  // Add function to handle row selection
  const handleRowSelection = (index: number) => {
    setSelectedRows(prev => 
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  // Add function to handle select all
  const handleSelectAll = () => {
    setSelectedRows(
      selectedRows.length === filteredCustomers.length
        ? []
        : filteredCustomers.map((_, index) => index)
    );
  };

  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3">
      <div className="flex items-center justify-between space-y-2 mb-6">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Customers</h2>
          <div className="flex gap-2 mt-2">
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow-sm">
              <span className="text-sm font-medium">{customers.length}</span>
              <span className="text-sm text-gray-600">Total Customers</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow-sm">
              <span className="text-sm font-medium text-green-600">
                {customers.filter(c => c.active).length}
              </span>
              <span className="text-sm text-gray-600">Active Customers</span>
            </div>
            <div className="flex items-center gap-2 bg-white rounded-lg px-3 py-1 shadow-sm">
              <span className="text-sm font-medium text-red-600">
                {customers.filter(c => !c.active).length}
              </span>
              <span className="text-sm text-gray-600">Inactive Customers</span>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Dialog open={isNewCustomerOpen} onOpenChange={setIsNewCustomerOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                New Customer
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Add New Customer</DialogTitle>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="company"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Company Name</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="primaryContact"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Primary Contact</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="phone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <DialogFooter>
                    <Button type="submit">Add Customer</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
          <div className="relative">
            <input
              type="file"
              id="import-customers"
              className="hidden"
              accept=".json"
              onChange={handleImportCustomers}
            />
            <Button variant="outline" onClick={() => document.getElementById('import-customers')?.click()}>
              <Upload className="h-4 w-4 mr-2" />
              Import Customers
            </Button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-4 border-b gap-4">
          <div className="flex items-center gap-2 w-full md:w-auto">
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
                <DropdownMenuItem onClick={() => exportSelectedCustomers('csv')}>
                  Export as CSV
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => exportSelectedCustomers('json')}>
                  Export as JSON
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem 
                  className="text-xs text-gray-500"
                  disabled
                >
                  {selectedRows.length} customers selected
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            {selectedRows.length > 0 && (
              <Button 
                variant="outline" 
                onClick={() => setSelectedRows([])}
                className="text-red-600 hover:text-red-700"
              >
                Clear Selection
              </Button>
            )}
          </div>

          <div className="relative w-full md:w-auto">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Search..."
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
                <input 
                  type="checkbox"
                  checked={selectedRows.length === filteredCustomers.length}
                  onChange={handleSelectAll}
                  className="rounded border-gray-300"
                />
              </TableHead>
              <TableHead className="w-12">#</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Primary Contact</TableHead>
              <TableHead>Primary Email</TableHead>
              <TableHead>Phone</TableHead>
              <TableHead>Active</TableHead>
              <TableHead>Groups</TableHead>
              <TableHead>Date Created</TableHead>
              <TableHead className="w-12"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer, index) => (
              <TableRow key={customer.id}>
                <TableCell>
                  <input 
                    type="checkbox"
                    checked={selectedRows.includes(index)}
                    onChange={() => handleRowSelection(index)}
                    className="rounded border-gray-300"
                  />
                </TableCell>
                <TableCell>{customer.id}</TableCell>
                <TableCell>{customer.company}</TableCell>
                <TableCell>{customer.primaryContact}</TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  <Switch 
                    checked={customer.active}
                    onCheckedChange={() => handleToggleActive(customer.id)}
                  />
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    {customer.groups.map((group) => (
                      <Badge key={group} variant="secondary">
                        {group}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{customer.dateCreated}</TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        <div className="flex items-center justify-between p-4 border-t">
          <div className="text-sm text-gray-500">
            Showing 1 to {filteredCustomers.length} of {customers.length} entries
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

export default Customers;

