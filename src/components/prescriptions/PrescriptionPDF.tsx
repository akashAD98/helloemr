
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Download, Printer } from "lucide-react";
import { Prescription } from "@/types/prescription";
import { dataStore } from "@/lib/dataStore";

interface PrescriptionPDFProps {
  prescription: Prescription;
}

export function PrescriptionPDF({ prescription }: PrescriptionPDFProps) {
  const patient = dataStore.getPatientById(prescription.patientId);
  
  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // In a real application, you would use a library like jsPDF or react-pdf
    // For now, we'll simulate the download
    const element = document.getElementById('prescription-content');
    if (element) {
      // Create a new window for printing
      const printWindow = window.open('', '_blank');
      if (printWindow) {
        printWindow.document.write(`
          <html>
            <head>
              <title>Prescription - ${prescription.patientName}</title>
              <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .prescription-header { text-align: center; border-bottom: 2px solid #000; padding-bottom: 20px; margin-bottom: 20px; }
                .clinic-info { text-align: center; margin-bottom: 20px; }
                .patient-info, .prescription-details { margin-bottom: 20px; }
                .signature-line { border-top: 1px solid #000; width: 200px; margin-top: 40px; }
                .no-print { display: none; }
                @media print { .no-print { display: none !important; } }
              </style>
            </head>
            <body>
              ${element.innerHTML}
            </body>
          </html>
        `);
        printWindow.document.close();
        printWindow.print();
      }
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end space-x-2 no-print">
        <Button variant="outline" onClick={handlePrint}>
          <Printer className="h-4 w-4 mr-2" />
          Print
        </Button>
        <Button onClick={handleDownloadPDF}>
          <Download className="h-4 w-4 mr-2" />
          Download PDF
        </Button>
      </div>

      <Card id="prescription-content" className="max-w-4xl mx-auto bg-white">
        <CardHeader className="text-center border-b-2 border-black pb-6">
          <div className="clinic-info">
            <h1 className="text-2xl font-bold">HEALTHTECH MEDICAL CENTER</h1>
            <p className="text-sm mt-2">123 Medical Plaza, Suite 100</p>
            <p className="text-sm">Healthcare City, HC 12345</p>
            <p className="text-sm">Phone: (555) 123-4567 | Fax: (555) 123-4568</p>
            <p className="text-sm font-semibold mt-2">Dr. Sarah Johnson, MD</p>
            <p className="text-xs">DEA# BJ1234567 | NPI# 1234567890</p>
          </div>
        </CardHeader>
        
        <CardContent className="p-6 space-y-6">
          <div className="patient-info">
            <h3 className="font-semibold text-lg mb-3">PATIENT INFORMATION</h3>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Name:</strong> {prescription.patientName}</p>
                <p><strong>Date of Birth:</strong> {patient?.dateOfBirth || "N/A"}</p>
                <p><strong>Gender:</strong> {patient?.gender || "N/A"}</p>
              </div>
              <div>
                <p><strong>Address:</strong> {patient?.address || "N/A"}</p>
                <p><strong>Phone:</strong> {patient?.phone || "N/A"}</p>
                <p><strong>Date:</strong> {prescription.prescribedDate}</p>
              </div>
            </div>
          </div>

          <Separator />

          <div className="prescription-details">
            <h3 className="font-semibold text-lg mb-4">PRESCRIPTION</h3>
            
            <div className="bg-gray-50 p-4 rounded border-2 border-gray-300">
              <div className="space-y-3">
                <div className="text-lg">
                  <strong>Rx:</strong> {prescription.medicationName}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p><strong>Dosage:</strong> {prescription.dosage}</p>
                    <p><strong>Frequency:</strong> {prescription.frequency}</p>
                  </div>
                  <div>
                    <p><strong>Route:</strong> {prescription.route}</p>
                    <p><strong>Quantity:</strong> {prescription.quantity}</p>
                  </div>
                </div>
                
                <div>
                  <p><strong>Refills:</strong> {prescription.refills}</p>
                </div>

                {prescription.instructions && (
                  <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                    <p><strong>Patient Instructions:</strong></p>
                    <p className="mt-1">{prescription.instructions}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <Separator />

          <div className="flex justify-between items-end mt-8">
            <div>
              <p className="text-sm text-gray-600">Prescriber Information:</p>
              <p className="font-semibold">{prescription.prescribedBy}</p>
              <p className="text-sm">License: MD123456</p>
            </div>
            
            <div className="text-center">
              <div className="signature-line border-t border-black w-48 pt-2">
                <p className="text-sm">Prescriber Signature</p>
              </div>
              <p className="text-xs mt-2">Date: {prescription.prescribedDate}</p>
            </div>
          </div>

          <div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded">
            <p className="text-xs text-gray-600">
              <strong>Important:</strong> This prescription is valid for one year from the date of issue unless otherwise specified. 
              Contact your healthcare provider if you have any questions about this medication.
            </p>
          </div>

          {prescription.notes && (
            <div className="mt-4 p-3 bg-gray-50 border border-gray-200 rounded">
              <p className="text-sm"><strong>Provider Notes:</strong> {prescription.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
