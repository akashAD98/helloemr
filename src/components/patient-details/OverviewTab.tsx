
import { MedicalHistorySection } from "./MedicalHistorySection";
import { PatientVitals } from "./PatientVitals";
import { PatientNotes } from "./PatientNotes";
import { AudioNoteRecorder } from "./AudioNoteRecorder";
import { PatientTasks } from "./PatientTasks";

interface MedicalCondition {
  id: string;
  condition: string;
  status: string;
  details?: string;
  medications?: string[];
}

interface Visit {
  id: string;
  date: string;
  reason: string;
}

interface Note {
  id: string;
  patientId: string;
  date: string;
  content: string;
  author: string;
  audioRecording: string | null;
  summary?: string;
}

interface OverviewTabProps {
  patientId: string;
  medicalHistory: MedicalCondition[];
  vitals: any[];
  notes: Note[];
  visits: { id: string; date: string; reason: string }[];
  tasks: any[];
  onEditMedicalHistory: () => void;
  onSaveNote: (note: { 
    text: string;
    audioUrl?: string;
    visitId?: string;
    summary?: string;
    pdfUrl?: string;
  }) => void;
}

export function OverviewTab({
  patientId,
  medicalHistory,
  vitals,
  notes,
  visits,
  tasks,
  onEditMedicalHistory,
  onSaveNote
}: OverviewTabProps) {
  return (
    <div className="space-y-6 mt-0">
      {/* Medical History */}
      <MedicalHistorySection 
        patientId={patientId}
        conditions={medicalHistory}
        onEdit={onEditMedicalHistory}
      />
      
      {/* Vitals */}
      <PatientVitals vitals={vitals} />
      
      {/* Patient Notes */}
      <PatientNotes 
        notes={notes} 
        patientId={patientId} 
        visits={visits}
        onSaveNote={onSaveNote}
      />
      
      {/* Patient Tasks */}
      <PatientTasks tasks={tasks} />
    </div>
  );
}
