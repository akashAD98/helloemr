
export interface Prescription {
  id: string;
  patientId: string;
  patientName: string;
  medicationId: string;
  medicationName: string;
  dosage: string;
  frequency: string;
  route: string;
  quantity: string;
  refills: number;
  instructions: string;
  prescribedBy: string;
  prescribedDate: string;
  status: "pending" | "sent" | "filled";
  pharmacyName?: string;
  notes?: string;
}

export interface PrescriptionFormData {
  patientId: string;
  medicationId: string;
  customMedication?: string;
  dosage: string;
  frequency: string;
  route: string;
  quantity: string;
  refills: number;
  instructions: string;
  notes?: string;
}
