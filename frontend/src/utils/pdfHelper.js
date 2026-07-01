import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';

export const downloadCertificatePDF = async (element, certificateCode) => {
  if (!element) return;
  try {
    const canvas = await html2canvas(element, {
      scale: 2, // High resolution
      useCORS: true,
      logging: false,
    });
    const imgData = canvas.toDataURL('image/png');
    
    // Landscape A4 size: 297mm x 210mm
    const pdf = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });
    
    const imgWidth = 297;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    // Center vertically
    const yPos = (210 - imgHeight) / 2;
    
    pdf.addImage(imgData, 'PNG', 0, yPos, imgWidth, imgHeight);
    pdf.save(`certificate-${certificateCode}.pdf`);
  } catch (error) {
    console.error('Failed to generate PDF:', error);
    throw error;
  }
};
