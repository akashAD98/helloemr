
export interface VisitMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

export interface VisitVitals {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  // Additional visual measurements
  visionOD?: string; // Right eye
  visionOS?: string; // Left eye
  visionCorrection?: string;
  intraocularPressure?: string;
}

export interface ExamFindings {
  subjective?: string;
  objective?: string;
  assessment?: string;
  cc?: string; // Chief complaint
  ros?: string; // Review of systems
}

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  reason: string;
  provider: string;
  status: string; // "completed", "scheduled", "cancelled", "in-session"
  summary?: string;
  vitalSigns?: VisitVitals;
  examFindings?: ExamFindings;
  medications?: VisitMedication[];
  audioRecording?: string;
  transcript?: string;
  documents?: Array<{id: string, name: string, url: string, type: string}>;
}
