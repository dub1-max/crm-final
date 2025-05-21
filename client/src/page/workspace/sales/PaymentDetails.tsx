import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Mail, Printer, Download, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import useWorkspaceId from "@/hooks/use-workspace-id";
import { generatePaymentReceiptPDF } from "../../workspace/generate-payment-pdf";

interface Payment {
  id: string;
  invoiceId: string;
  amount: number;
  paymentMode: string;
  transactionId?: string;
  customer: string;
  date: string;
  companyInfo?: {
    name: string;
    address1: string;
    address2: string;
    country: string;
    postal: string;
  };
  customerInfo?: {
    address: string;
    city: string;
    state: string;
    postal: string;
  };
}

const PaymentDetails = () => {
  const { invoiceId } = useParams<{ invoiceId: string }>();
  const [payment, setPayment] = useState<Payment | null>(null);
  const [activeTab, setActiveTab] = useState("receipt");
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const workspaceId = useWorkspaceId();

  useEffect(() => {
    // In a real application, fetch the payment data from API
    const mockPayment: Payment = {
      id: "8",
      invoiceId: "INV-000001",
      amount: 1535.40,
      paymentMode: "Bank",
      transactionId: "",
      customer: "Hahn, Reilly and Ortiz",
      date: "2024-05-15",
      companyInfo: {
        name: "CRM",
        address1: "172 Ivy Club Gottliebfurt",
        address2: "New Heaven",
        country: "Canada [CA]",
        postal: "2364",
      },
      customerInfo: {
        address: "32832 Lueilwitz Gateway Suite 500",
        city: "West Mya",
        state: "Washington",
        postal: "42153-6499",
      }
    };
    
    setPayment(mockPayment);
  }, [invoiceId]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    }).split('/').join('/');
  };

  const handleDownloadPDF = () => {
    if (!payment) return;
    
    setLoading(true);
    
    try {
      const success = generatePaymentReceiptPDF(payment);
      
      if (success) {
        toast({
          title: "PDF Downloaded Successfully",
          description: `Payment receipt for ${payment.invoiceId} has been downloaded.`,
          variant: "default"
        });
      } else {
        toast({
          title: "Download Failed",
          description: "There was an error generating the PDF. Please try again.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error("Error generating PDF:", error);
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate(`/workspace/${workspaceId}/sales/payments`);
  };

  if (!payment) {
    return <div className="p-8 text-center">Loading payment details...</div>;
  }

  return (
    <main className="flex flex-1 flex-col py-4 md:pt-3">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <div>
          <Button
            variant="outline"
            onClick={handleBack}
            className="mb-2"
          >
            &larr; Back to Payments
          </Button>
          <h2 className="text-2xl font-bold tracking-tight">
            Payment for Invoice {payment.invoiceId}
          </h2>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={() => {
              // Handle email functionality
              toast({
                title: "Email Sent",
                description: "Payment receipt has been emailed.",
                variant: "default"
              });
            }}
          >
            <Mail className="h-4 w-4" />
            <span className="hidden sm:inline">Email</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={() => window.print()}
          >
            <Printer className="h-4 w-4" />
            <span className="hidden sm:inline">Print</span>
          </Button>
          <Button
            variant="outline"
            className="gap-2 w-full sm:w-auto"
            onClick={handleDownloadPDF}
            disabled={loading}
          >
            <Download className="h-4 w-4" />
            <span className="hidden sm:inline">{loading ? "Generating..." : "Download"}</span>
          </Button>
        </div>
      </div>

      <Tabs defaultValue="receipt" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="receipt">Payment Receipt</TabsTrigger>
          <TabsTrigger value="payment">Payment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="receipt" className="bg-white rounded-lg shadow">
          <div className="p-6 sm:p-8">
            <div className="flex flex-col md:flex-row justify-between">
              <div className="mb-6 md:mb-0">
                <h3 className="text-lg font-bold">CRM</h3>
                <p className="text-sm text-gray-600">172 Ivy Club Gottliebfurt</p>
                <p className="text-sm text-gray-600">New Heaven</p>
                <p className="text-sm text-gray-600">Canada [CA] 2364</p>
              </div>
              
              <div className="text-right">
                <h3 className="text-lg font-bold">{payment.customer}</h3>
                <p className="text-sm text-gray-600">32832 Lueilwitz Gateway Suite 500</p>
                <p className="text-sm text-gray-600">West Mya Washington</p>
                <p className="text-sm text-gray-600">GB 42153-6499</p>
              </div>
            </div>
            
            <h2 className="text-2xl font-bold my-10 uppercase">PAYMENT RECEIPT</h2>
            
            <div className="mb-8">
              <div className="flex justify-between mb-2">
                <span className="font-semibold">Payment Date:</span>
                <span>{formatDate(payment.date)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-semibold">Payment Mode:</span>
                <span>{payment.paymentMode}</span>
              </div>
            </div>
            
            <div className="border-t border-b py-4 my-4">
              <table className="w-full">
                <thead>
                  <tr>
                    <th className="text-left pb-2 font-semibold">Invoice Number</th>
                    <th className="text-left pb-2 font-semibold">Invoice Date</th>
                    <th className="text-left pb-2 font-semibold">Invoice Amount</th>
                    <th className="text-right pb-2 font-semibold">Payment Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{payment.invoiceId}</td>
                    <td>{formatDate(payment.date)}</td>
                    <td>${payment.amount.toFixed(2)}</td>
                    <td className="text-right">${payment.amount.toFixed(2)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div className="flex justify-end mt-8">
              <div className="w-1/3">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total Amount</span>
                  <span>${payment.amount.toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="payment">
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Payment Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-sm text-gray-500">Payment #</p>
                <p className="font-medium">{payment.id}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Invoice #</p>
                <p className="font-medium">{payment.invoiceId}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Mode</p>
                <p className="font-medium">{payment.paymentMode}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Payment Date</p>
                <p className="font-medium">{formatDate(payment.date)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Amount</p>
                <p className="font-medium">${payment.amount.toFixed(2)}</p>
              </div>
              <div>
                <p className="text-sm text-gray-500">Customer</p>
                <p className="font-medium">{payment.customer}</p>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </main>
  );
};

export default PaymentDetails; 