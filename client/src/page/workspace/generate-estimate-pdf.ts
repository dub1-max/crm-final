import { jsPDF } from 'jspdf';

interface Estimate {
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

export function generateEstimateDetailPDF(estimate: Estimate): boolean {
  try {
    console.log("Generating PDF for estimate:", estimate.id);
    
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
    
    // Estimate ID with subtle styling
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`ESTIMATE ${estimate.id}`, pageWidth - margin, 24, { align: 'right' });
    
    // Add a thin divider line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, 50, pageWidth - margin, 50);

    // Company details on left
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text(estimate.companyInfo?.name || 'Perfex INC', margin, 65);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(estimate.companyInfo?.address1 || '172 Ivy Club Gottliebfurt', margin, 72);
    doc.text(estimate.companyInfo?.address2 || 'New Heaven', margin, 79);
    doc.text(estimate.companyInfo?.country || 'Canada [CA] 2364', margin, 86);
    
    // Customer details on right
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    doc.text(estimate.customer, pageWidth - margin, 65, { align: 'right' });
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    doc.text(estimate.customerInfo?.address || '32832 Lueilwitz Gateway Suite 500', pageWidth - margin, 72, { align: 'right' });
    const cityState = `${estimate.customerInfo?.city || 'West Mya'} ${estimate.customerInfo?.state || 'Washington'}`;
    doc.text(cityState, pageWidth - margin, 79, { align: 'right' });
    doc.text(`${estimate.customerInfo?.postal || 'GB 42153-6499'}`, pageWidth - margin, 86, { align: 'right' });
    
    // Estimate heading
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('ESTIMATE', margin, 105);
    
    // Estimate details
    const detailsY = 120;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(90, 90, 90);
    doc.text('Date:', margin, detailsY);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(estimate.date), margin + 80, detailsY);
    
    doc.setFont('helvetica', 'bold');
    doc.text('Expiry Date:', margin, detailsY + 10);
    doc.setFont('helvetica', 'normal');
    doc.text(formatDate(estimate.expiryDate), margin + 80, detailsY + 10);
    
    if (estimate.project) {
      doc.setFont('helvetica', 'bold');
      doc.text('Project:', margin, detailsY + 20);
      doc.setFont('helvetica', 'normal');
      doc.text(estimate.project, margin + 80, detailsY + 20);
    }
    
    if (estimate.reference) {
      doc.setFont('helvetica', 'bold');
      doc.text('Reference:', margin, detailsY + 30);
      doc.setFont('helvetica', 'normal');
      doc.text(estimate.reference, margin + 80, detailsY + 30);
    }
    
    // Status
    doc.setFont('helvetica', 'bold');
    doc.text('Status:', margin, detailsY + 40);
    doc.setFont('helvetica', 'normal');
    doc.text(estimate.status, margin + 80, detailsY + 40);
    
    // Add a line separator
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, detailsY + 50, pageWidth - margin, detailsY + 50);
    
    // Financial details
    const tableY = detailsY + 65;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(70, 70, 70);
    
    // Create a simple table for financial overview
    doc.text('Description', margin, tableY);
    doc.text('Amount', pageWidth - margin, tableY, { align: 'right' });
    
    // Line under header
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, tableY + 5, pageWidth - margin, tableY + 5);
    
    // Data rows
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(90, 90, 90);
    
    // Subtotal (Amount - Tax)
    const subtotal = estimate.amount - estimate.totalTax;
    doc.text('Subtotal', margin, tableY + 15);
    doc.text(`$${subtotal.toFixed(2)}`, pageWidth - margin, tableY + 15, { align: 'right' });
    
    // Tax
    doc.text('Tax', margin, tableY + 25);
    doc.text(`$${estimate.totalTax.toFixed(2)}`, pageWidth - margin, tableY + 25, { align: 'right' });
    
    // Line before total
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, tableY + 35, pageWidth - margin, tableY + 35);
    
    // Total
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text('Total', margin, tableY + 45);
    doc.text(`$${estimate.amount.toFixed(2)}`, pageWidth - margin, tableY + 45, { align: 'right' });
    
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
    const filename = `estimate-${estimate.id}.pdf`;
    
    return forceDownload(pdfBlob, filename);
  } catch (error) {
    console.error("Error generating estimate PDF:", error);
    return false;
  }
}

// Generate a PDF for multiple estimate records (table format)
export function generateEstimatesTablePDF(estimates: Estimate[]): boolean {
  try {
    console.log("Generating table PDF for estimates");
    
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
    doc.text('ESTIMATES REPORT', pageWidth - margin, 22, { align: 'right' });
    
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
    
    const totalEstimates = estimates.length;
    const totalAmount = estimates.reduce((sum, estimate) => sum + estimate.amount, 0);
    const draftCount = estimates.filter(e => e.status === 'Draft').length;
    const sentCount = estimates.filter(e => e.status === 'Sent').length;
    
    doc.text(`Total Estimates: ${totalEstimates}`, margin, summaryY + 7);
    doc.text(`Draft: ${draftCount}`, margin + 80, summaryY + 7);
    doc.text(`Sent: ${sentCount}`, margin + 120, summaryY + 7);
    doc.text(`Total Amount: $${totalAmount.toLocaleString()}.00`, margin, summaryY + 15);
    
    // A subtle divider
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, summaryY + 20, pageWidth - margin, summaryY + 20);
    
    // Create table with modern, clean styling
    (doc as any).autoTable({
      head: [['Estimate #', 'Customer', 'Project', 'Date', 'Expiry Date', 'Amount', 'Status']],
      body: estimates.map(estimate => [
        estimate.id,
        estimate.customer,
        estimate.project || '-',
        formatDate(estimate.date),
        formatDate(estimate.expiryDate),
        `$${estimate.amount.toLocaleString()}.00`,
        estimate.status
      ]),
      startY: summaryY + 30,
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
        1: { cellWidth: 'auto' },
        2: { cellWidth: 35 },
        3: { cellWidth: 28 },
        4: { cellWidth: 28 },
        5: { cellWidth: 25, halign: 'right' },
        6: { cellWidth: 22 }
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
    const filename = 'estimates-report.pdf';
    
    return forceDownload(pdfBlob, filename);
  } catch (error) {
    console.error("Error generating estimates table PDF:", error);
    return false;
  }
} 