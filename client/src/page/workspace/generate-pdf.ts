import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { Contract } from './contracts-table';

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

// Helper to get status colors
function getStatusColors(status: string): { fill: number[], text: number[] } {
  switch (status) {
    case 'active':
      return { fill: [235, 245, 255], text: [37, 99, 235] }; // Lighter blue with blue text
    case 'draft':
      return { fill: [254, 252, 232], text: [202, 138, 4] };  // Lighter yellow with amber text
    case 'expired':
    case 'terminated':
      return { fill: [254, 242, 242], text: [220, 38, 38] }; // Lighter red with red text
    default:
      return { fill: [245, 245, 245], text: [100, 100, 100] }; // Default gray
  }
}

export function generateContractPDF(contract: Contract): boolean {
  try {
    console.log("Generating PDF for contract:", contract.id);
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const margin = 20;

    // Get status colors for this contract
    const statusColors = getStatusColors(contract.status);

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
    
    // Contract ID with subtle styling
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`CONTRACT #${contract.id}`, pageWidth - margin, 24, { align: 'right' });
    
    // Add a thin divider line
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, 50, pageWidth - margin, 50);
    
    // Contract Title in large, clean font
    doc.setFontSize(16);
    doc.setTextColor(40, 40, 40);
    doc.text(contract.name, margin, 65);
    
    // Status indicator - now a subtle badge
    const statusCapitalized = contract.status.charAt(0).toUpperCase() + contract.status.slice(1);
    const textWidth = doc.getTextWidth(statusCapitalized);
    doc.setFillColor(statusColors.fill[0], statusColors.fill[1], statusColors.fill[2]);
    doc.roundedRect(margin, 70, textWidth + 10, 7, 1, 1, 'F');
    doc.setFontSize(8);
    doc.setTextColor(statusColors.text[0], statusColors.text[1], statusColors.text[2]);
    doc.text(statusCapitalized, margin + 5, 74.5);
    
    // Client and date info in clean, organized layout
    doc.setFontSize(10);
    doc.setTextColor(80, 80, 80);
    doc.text('CLIENT', margin, 90);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(contract.client, margin, 96);
    
    // Calculate middle position and value position for better spacing
    const middlePos = (pageWidth / 2) - 20;
    const valuePos = pageWidth - margin - 40;
    
    // Contract period
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('PERIOD', middlePos, 90);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(50, 50, 50);
    doc.text(`${formatDate(contract.startDate)} - ${formatDate(contract.endDate)}`, middlePos, 96);
    
    // Contract value
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(80, 80, 80);
    doc.text('VALUE', valuePos, 90);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(50, 50, 50);
    doc.text(`$${contract.value.toLocaleString()}.00`, valuePos, 96);
    
    // Another subtle divider
    doc.setDrawColor(230, 230, 230);
    doc.line(margin, 105, pageWidth - margin, 105);
    
    // Contract description section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text('Description', margin, 120);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(70, 70, 70);
    doc.text(`This contract between ${contract.client} and our company establishes a formal agreement for`, margin, 128);
    doc.text(`the services described. The contract is valid from ${formatDate(contract.startDate)} to ${formatDate(contract.endDate)}.`, margin, 134);
    
    // Terms section
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.setTextColor(60, 60, 60);
    doc.text('Terms and Conditions', margin, 150);
    
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(70, 70, 70);
    doc.text('• The service provider agrees to provide services as outlined in the contract.', margin, 158);
    doc.text(`• Payment of $${contract.value.toLocaleString()}.00 shall be made according to the payment schedule.`, margin, 164);
    doc.text('• Any modifications to this contract must be made in writing and agreed upon by both parties.', margin, 170);
    
    // Subtle footer with minimal styling
    const footerY = doc.internal.pageSize.getHeight() - 15;
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, footerY, pageWidth - margin, footerY);
    
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text('CRM © 2024', margin, footerY + 8);
    doc.text('Page 1 of 1', pageWidth - margin, footerY + 8, { align: 'right' });
    
    // Generate PDF Blob and force download
    const pdfBlob = doc.output('blob');
    const filename = `contract-${contract.id}.pdf`;
    
    return forceDownload(pdfBlob, filename);
  } catch (error) {
    console.error("Error generating PDF:", error);
    return false;
  }
}

export function generateContractsTablePDF(contracts: Contract[]): boolean {
  try {
    console.log("Generating table PDF for contracts");
    
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
    doc.text('CONTRACTS REPORT', pageWidth - margin, 22, { align: 'right' });
    
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
    
    const totalContracts = contracts.length;
    const activeContracts = contracts.filter(c => c.status === 'active').length;
    const totalValue = contracts.reduce((sum, contract) => sum + contract.value, 0);
    
    doc.text(`Total: ${totalContracts}`, margin, summaryY + 7);
    doc.text(`Active: ${activeContracts}`, margin + 50, summaryY + 7);
    doc.text(`Value: $${totalValue.toLocaleString()}.00`, margin + 100, summaryY + 7);
    
    // A subtle divider
    doc.setDrawColor(230, 230, 230);
    doc.setLineWidth(0.5);
    doc.line(margin, summaryY + 12, pageWidth - margin, summaryY + 12);
    
    // Create table with modern, clean styling
    (doc as any).autoTable({
      head: [['Contract ID', 'Name', 'Client', 'Start Date', 'End Date', 'Value', 'Status']],
      body: contracts.map(contract => [
        contract.id,
        contract.name,
        contract.client,
        formatDate(contract.startDate),
        formatDate(contract.endDate),
        `$${contract.value.toLocaleString()}.00`,
        contract.status.charAt(0).toUpperCase() + contract.status.slice(1)
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
        1: { cellWidth: 'auto' },
        2: { cellWidth: 35 },
        3: { cellWidth: 28 },
        4: { cellWidth: 28 },
        5: { cellWidth: 25, halign: 'right' },
        6: { cellWidth: 22, halign: 'center' }
      },
      styles: {
        cellPadding: 4,
        fontSize: 9,
        valign: 'middle',
        overflow: 'ellipsize',
        lineWidth: 0.2,
        lineColor: [230, 230, 230]
      },
      // Add custom color to cells based on status
      didDrawCell: (data: any) => {
        if (data.column.dataKey === 6 && data.row.section === 'body') {
          const status = contracts[data.row.index].status;
          const statusColors = getStatusColors(status);
          
          // Draw a small colored dot before the status text
          const dotX = data.cell.x + 5;
          const dotY = data.cell.y + data.cell.height / 2;
          doc.setFillColor(statusColors.text[0], statusColors.text[1], statusColors.text[2]);
          doc.circle(dotX, dotY, 2, 'F');
          
          // Draw text with status color
          doc.setTextColor(70, 70, 70);
          doc.setFont('helvetica', 'normal');
          doc.text(
            data.cell.text,
            dotX + 6,
            dotY,
            { baseline: 'middle' }
          );
          
          return true;
        }
        return false;
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
    const filename = 'contracts-report.pdf';
    
    return forceDownload(pdfBlob, filename);
  } catch (error) {
    console.error("Error generating table PDF:", error);
    return false;
  }
}
