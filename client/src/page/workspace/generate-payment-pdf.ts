import { jsPDF } from 'jspdf';

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

// Force download using a direct browser download approach
function forceDownload(blob: Blob, filename: string): boolean {
  try {
    // Create a link element
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    link.style.display = 'none';
    
    // Add to document, click and remove
    document.body.appendChild(link);
    link.click();
    
    // Clean up
    setTimeout(() => {
      window.URL.revokeObjectURL(link.href);
      document.body.removeChild(link);
    }, 100);
    
    return true;
  } catch (error) {
    console.error("Error forcing download:", error);
    return false;
  }
}

// Helper to format dates
function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
}

export function generatePaymentReceiptPDF(payment: Payment): boolean {
  try {
    console.log("Generating PDF for payment:", payment.id);
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Clean, minimal header with subtle accent
    doc.setFillColor(249, 250, 251); // Very light gray background
    doc.rect(0, 0, pageWidth, 45, 'F');
    
    // Add a subtle accent line at the top
    doc.setFillColor(42, 57, 80);
    doc.rect(0, 0, pageWidth, 4, 'F');
    
    // Logo and branding
    doc.setFillColor(45, 85, 155);
    doc.circle(margin, 22, 4, 'F');
    
    // Company name
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(18);
    doc.text('CRM', margin + 10, 24);
    
    // Payment ID with subtle styling
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`PAYMENT for INVOICE ${payment.invoiceId}`, pageWidth - margin, 24, { align: 'right' });
    
    // Add a thin divider line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, 50, pageWidth - margin, 50);

    // Company details on left
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text(payment.companyInfo?.name || 'Perfex INC', margin, 65);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(payment.companyInfo?.address1 || '172 Ivy Club Gottliebfurt', margin, 72);
    doc.text(payment.companyInfo?.address2 || 'New Heaven', margin, 79);
    doc.text(payment.companyInfo?.country || 'Canada [CA] 2364', margin, 86);
    
    // Customer details on right
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text(payment.customer, pageWidth - margin, 65, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(payment.customerInfo?.address || '32832 Lueilwitz Gateway Suite 500', pageWidth - margin, 72, { align: 'right' });
    const cityState = `${payment.customerInfo?.city || 'West Mya'} ${payment.customerInfo?.state || 'Washington'}`;
    doc.text(cityState, pageWidth - margin, 79, { align: 'right' });
    doc.text(`${payment.customerInfo?.postal || 'GB 42153-6499'}`, pageWidth - margin, 86, { align: 'right' });
    
    // Payment Receipt heading
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('PAYMENT RECEIPT', margin, 105);
    
    // Payment details
    const detailsY = 120;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(90, 90, 90);
    doc.text('Payment Date:', margin, detailsY);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(payment.date), margin + 80, detailsY);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Payment Mode:', margin, detailsY + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(payment.paymentMode, margin + 80, detailsY + 10);
    
    if (payment.transactionId) {
      doc.setFont('helvetica', 'bold');
      doc.text('Transaction ID:', margin, detailsY + 20);
      doc.setFont('helvetica', 'normal');
      doc.text(payment.transactionId, margin + 80, detailsY + 20);
    }
    
    // Add a line separator
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, detailsY + 30, pageWidth - margin, detailsY + 30);
    
    // Invoice details table header
    const tableY = detailsY + 45;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    
    // Much wider spacing between columns to prevent overlap
    const col1 = margin;                  // Invoice Number
    const col2 = margin + 70;             // Invoice Date
    const col3 = pageWidth / 2 + 10;      // Invoice Amount - positioned in right half
    const col4 = pageWidth - margin;      // Payment Amount - right aligned
    
    doc.text('Invoice Number', col1, tableY);
    doc.text('Invoice Date', col2, tableY);
    doc.text('Invoice Amount', col3, tableY);
    doc.text('Payment Amount', col4, tableY, { align: 'right' });
    
    // Line under header
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, tableY + 5, pageWidth - margin, tableY + 5);
    
    // Invoice data row with more spacing
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(payment.invoiceId, col1, tableY + 15);
    doc.text(formatDate(payment.date), col2, tableY + 15);
    doc.text(`$${payment.amount.toFixed(2)}`, col3, tableY + 15);
    doc.text(`$${payment.amount.toFixed(2)}`, col4, tableY + 15, { align: 'right' });
    
    // Line under data
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, tableY + 25, pageWidth - margin, tableY + 25);
    
    // Total
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('Total Amount', pageWidth - margin - 70, tableY + 40);
    doc.text(`$${payment.amount.toFixed(2)}`, pageWidth - margin, tableY + 40, { align: 'right' });
    
    // Footer
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('CRM © 2024', margin, footerY + 8);
    doc.text('Page 1 of 1', pageWidth - margin, footerY + 8, { align: 'right' });
    
    // Generate blob and force download
    const pdfBlob = doc.output('blob');
    const filename = `payment-receipt-${payment.id}-${payment.invoiceId}.pdf`;
    
    return forceDownload(pdfBlob, filename);
  } catch (error) {
    console.error("Error generating payment receipt PDF:", error);
    return false;
  }
}

// Generate a PDF for multiple payment records (table format)
export function generatePaymentsTablePDF(payments: Payment[]): boolean {
  try {
    console.log("Generating table PDF for payments");
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;
    
    // Clean, minimal header
    doc.setFillColor(249, 250, 251); // Very light gray background
    doc.rect(0, 0, pageWidth, 40, 'F');
    
    // Add a subtle accent line at the top
    doc.setFillColor(42, 57, 80);
    doc.rect(0, 0, pageWidth, 4, 'F');
    
    // Logo and branding - minimal style
    doc.setFillColor(45, 85, 155);
    doc.circle(margin, 20, 4, 'F');
    
    // Company name
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.setFontSize(18);
    doc.text('CRM', margin + 10, 22);
    
    // Document title - clean, modern style
    doc.setFontSize(12);
    doc.setTextColor(90, 90, 90);
    doc.text('PAYMENTS REPORT', pageWidth - margin, 22, { align: 'right' });
    
    // Add date in a subtle way
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(120, 120, 120);
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric'
    })}`, pageWidth - margin, 30, { align: 'right' });
    
    // Summary section with minimal styling
    const summaryY = 50;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text('SUMMARY', margin, summaryY);
    
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    
    const totalPayments = payments.length;
    const totalAmount = payments.reduce((sum, payment) => sum + payment.amount, 0);
    
    doc.text(`Total Payments: ${totalPayments}`, margin, summaryY + 7);
    doc.text(`Total Amount: $${totalAmount.toLocaleString()}.00`, margin + 100, summaryY + 7);
    
    // A subtle divider
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, summaryY + 12, pageWidth - margin, summaryY + 12);
    
    // Create table with modern, clean styling
    (doc as any).autoTable({
      head: [['Payment #', 'Invoice #', 'Customer', 'Payment Mode', 'Date', 'Amount']],
      body: payments.map(payment => [
        payment.id,
        payment.invoiceId,
        payment.customer,
        payment.paymentMode,
        formatDate(payment.date),
        `$${payment.amount.toLocaleString()}.00`,
      ]),
      startY: summaryY + 20,
      theme: 'plain',
      headStyles: { 
        fillColor: [245, 247, 250],
        textColor: [50, 50, 50],
        fontStyle: 'bold',
        halign: 'left',
        cellPadding: 5
      },
      alternateRowStyles: {
        fillColor: [252, 252, 252]
      },
      columnStyles: {
        0: { cellWidth: 22 },
        1: { cellWidth: 28 },
        2: { cellWidth: 'auto' },
        3: { cellWidth: 30 },
        4: { cellWidth: 35 },
        5: { cellWidth: 25, halign: 'right' }
      },
      styles: {
        cellPadding: 4,
        fontSize: 9,
        valign: 'middle',
        overflow: 'ellipsize',
        lineWidth: 0.2,
        lineColor: [230, 230, 230]
      },
      didDrawPage: (data: any) => {
        // Clean, minimal footer
        const footerY = doc.internal.pageSize.getHeight() - 15;
        doc.setDrawColor(230, 230, 230);
        doc.setLineWidth(0.5);
        doc.line(margin, footerY, pageWidth - margin, footerY);
        
        doc.setFontSize(8);
        doc.setTextColor(150, 150, 150);
        doc.text('CRM © 2024', margin, footerY + 8);
        doc.text(`Page ${data.pageNumber} of ${data.pageCount}`, pageWidth - margin, footerY + 8, { align: 'right' });
      }
    });
    
    // Generate blob and force download
    const pdfBlob = doc.output('blob');
    const filename = 'payments-report.pdf';
    
    return forceDownload(pdfBlob, filename);
  } catch (error) {
    console.error("Error generating payments table PDF:", error);
    return false;
  }
} 