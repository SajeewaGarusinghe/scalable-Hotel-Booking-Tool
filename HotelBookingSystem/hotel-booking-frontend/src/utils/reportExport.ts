import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import html2canvas from 'html2canvas';
import { WeeklyBookingsReport, DailyBookingsDetail } from '../types/analytics';

export class ReportExportService {
  // Export report as PDF
  static async exportToPDF(report: WeeklyBookingsReport, includePrintStyles: boolean = true): Promise<void> {
    const pdf = new jsPDF();
    
    // Title
    pdf.setFontSize(16);
    pdf.text('Weekly Bookings and Special Requests Report', 20, 20);
    
    // Report period
    pdf.setFontSize(12);
    const startDate = new Date(report.weekStartDate).toLocaleDateString();
    const endDate = new Date(report.weekEndDate).toLocaleDateString();
    pdf.text(`Report Period: ${startDate} - ${endDate}`, 20, 30);
    pdf.text(`Generated: ${new Date(report.generatedAt).toLocaleString()}`, 20, 40);
    
    // Summary
    pdf.setFontSize(14);
    pdf.text('Summary', 20, 55);
    pdf.setFontSize(10);
    pdf.text(`Total Bookings: ${report.totalBookings}`, 20, 65);
    pdf.text(`Total Revenue: $${report.totalRevenue.toFixed(2)}`, 20, 75);
    pdf.text(`Occupancy Rate: ${(report.occupancyRate * 100).toFixed(1)}%`, 20, 85);
    pdf.text(`Total Guests: ${report.totalGuests}`, 20, 95);
    
    let yPosition = 110;
    
    // Daily breakdown
    for (const day of report.dailyDetails) {
      if (yPosition > 270) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(12);
      pdf.text(`${day.dayOfWeek}, ${new Date(day.date).toLocaleDateString()}`, 20, yPosition);
      yPosition += 10;
      
      // Daily statistics
      pdf.setFontSize(9);
      pdf.text(`Bookings: ${day.totalBookings} | Revenue: $${day.dayRevenue.toFixed(2)} | Occupancy: ${(day.dayOccupancyRate * 100).toFixed(1)}%`, 20, yPosition);
      yPosition += 10;
      
      // Bookings table
      if (day.bookings.length > 0) {
        const bookingHeaders = ['Guest', 'Room', 'Type', 'Guests', 'Amount', 'Status'];
        const bookingRows = day.bookings.map(booking => [
          booking.customerName,
          booking.roomNumber,
          booking.roomType,
          booking.numberOfGuests.toString(),
          `$${booking.totalAmount.toFixed(2)}`,
          booking.status
        ]);
        
        autoTable(pdf, {
          startY: yPosition,
          head: [bookingHeaders],
          body: bookingRows,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [66, 139, 202] },
          margin: { left: 20, right: 20 }
        });
        
        yPosition = (pdf as any).lastAutoTable.finalY + 10;
      }
      
      // Special requests table
      if (day.specialRequests.length > 0) {
        const requestHeaders = ['Guest', 'Booking Ref', 'Request Type', 'Description', 'Status'];
        const requestRows = day.specialRequests.map(request => [
          request.customerName || 'N/A',
          request.bookingReference,
          request.requestType,
          request.description || 'N/A',
          request.status
        ]);
        
        autoTable(pdf, {
          startY: yPosition,
          head: [requestHeaders],
          body: requestRows,
          styles: { fontSize: 8 },
          headStyles: { fillColor: [217, 83, 79] },
          margin: { left: 20, right: 20 }
        });
        
        yPosition = (pdf as any).lastAutoTable.finalY + 15;
      }
    }
    
    // Room type statistics
    if (report.roomTypeStats.length > 0) {
      if (yPosition > 250) {
        pdf.addPage();
        yPosition = 20;
      }
      
      pdf.setFontSize(14);
      pdf.text('Room Type Statistics', 20, yPosition);
      yPosition += 10;
      
      const roomTypeHeaders = ['Room Type', 'Bookings', 'Revenue', 'Occupancy Rate'];
      const roomTypeRows = report.roomTypeStats.map(stat => [
        stat.roomType,
        stat.bookingCount.toString(),
        `$${stat.revenue.toFixed(2)}`,
        `${(stat.occupancyRate * 100).toFixed(1)}%`
      ]);
      
      autoTable(pdf, {
        startY: yPosition,
        head: [roomTypeHeaders],
        body: roomTypeRows,
        styles: { fontSize: 10 },
        headStyles: { fillColor: [92, 184, 92] },
        margin: { left: 20, right: 20 }
      });
    }
    
    pdf.save(`weekly-bookings-report-${startDate}-${endDate}.pdf`);
  }
  
  // Export report as CSV
  static exportToCSV(report: WeeklyBookingsReport): void {
    const csvContent = this.generateCSVContent(report);
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `weekly-bookings-report-${new Date(report.weekStartDate).toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
  
  private static generateCSVContent(report: WeeklyBookingsReport): string {
    let csv = 'Weekly Bookings and Special Requests Report\n';
    csv += `Report Period,${new Date(report.weekStartDate).toLocaleDateString()},${new Date(report.weekEndDate).toLocaleDateString()}\n`;
    csv += `Generated,${new Date(report.generatedAt).toLocaleString()}\n\n`;
    
    // Summary
    csv += 'Summary\n';
    csv += `Total Bookings,${report.totalBookings}\n`;
    csv += `Total Revenue,$${report.totalRevenue.toFixed(2)}\n`;
    csv += `Occupancy Rate,${(report.occupancyRate * 100).toFixed(1)}%\n`;
    csv += `Total Guests,${report.totalGuests}\n\n`;
    
    // Daily details
    csv += 'Daily Breakdown\n';
    for (const day of report.dailyDetails) {
      csv += `\n${day.dayOfWeek} - ${new Date(day.date).toLocaleDateString()}\n`;
      csv += `Daily Stats,Bookings: ${day.totalBookings},Revenue: $${day.dayRevenue.toFixed(2)},Occupancy: ${(day.dayOccupancyRate * 100).toFixed(1)}%\n`;
      
      if (day.bookings.length > 0) {
        csv += 'Bookings\n';
        csv += 'Guest Name,Room Number,Room Type,Number of Guests,Total Amount,Status\n';
        for (const booking of day.bookings) {
          csv += `"${booking.customerName}","${booking.roomNumber}","${booking.roomType}",${booking.numberOfGuests},$${booking.totalAmount.toFixed(2)},"${booking.status}"\n`;
        }
      }
      
      if (day.specialRequests.length > 0) {
        csv += 'Special Requests\n';
        csv += 'Guest Name,Booking Reference,Request Type,Description,Status,Request Date\n';
        for (const request of day.specialRequests) {
          csv += `"${request.customerName}","${request.bookingReference}","${request.requestType}","${request.description || 'N/A'}","${request.status}","${new Date(request.requestDate).toLocaleString()}"\n`;
        }
      }
    }
    
    // Room type statistics
    if (report.roomTypeStats.length > 0) {
      csv += '\nRoom Type Statistics\n';
      csv += 'Room Type,Booking Count,Revenue,Occupancy Rate\n';
      for (const stat of report.roomTypeStats) {
        csv += `"${stat.roomType}",${stat.bookingCount},$${stat.revenue.toFixed(2)},${(stat.occupancyRate * 100).toFixed(1)}%\n`;
      }
    }
    
    return csv;
  }
  
  // Print the report
  static printReport(elementId: string): void {
    const printContent = document.getElementById(elementId);
    if (!printContent) {
      console.error('Print element not found');
      return;
    }
    
    const originalContent = document.body.innerHTML;
    const printWindow = window.open('', '_blank');
    
    if (printWindow) {
      printWindow.document.write(`
        <html>
          <head>
            <title>Weekly Bookings Report</title>
            <style>
              body { font-family: Arial, sans-serif; margin: 20px; }
              table { border-collapse: collapse; width: 100%; margin-bottom: 20px; }
              th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
              th { background-color: #f2f2f2; }
              .summary-card { border: 1px solid #ddd; padding: 15px; margin: 10px 0; }
              .daily-section { page-break-inside: avoid; margin-bottom: 30px; }
              h1, h2, h3 { color: #333; }
              .no-print { display: none; }
              @media print {
                body { margin: 0; }
                .no-print { display: none !important; }
              }
            </style>
          </head>
          <body>
            ${printContent.innerHTML}
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      setTimeout(() => {
        printWindow.print();
        printWindow.close();
      }, 250);
    }
  }
}
