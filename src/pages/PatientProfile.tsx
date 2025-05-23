import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, MessageCircle, Phone } from "lucide-react";
import { 
  patients, 
  patientProblems, 
  patientMedications, 
  patientAllergies, 
  patientLabResults, 
  patientNotes,
  vitals as patientVitals,
  tasks as patientTasks
} from "@/data/mockData";
import { ProblemsTab } from "@/components/patient-details/ProblemsTab";
import { MedicationsTab } from "@/components/patient-details/MedicationsTab";
import { AllergiesTab } from "@/components/patient-details/AllergiesTab";
import { LabsTab } from "@/components/patient-details/LabsTab";
import { VisitsTab, Visit } from "@/components/patient-details/VisitsTab";
import { PatientSummary } from "@/components/patient-details/PatientSummary";
import { useToast } from "@/hooks/use-toast";
import { PatientInfoSidebar } from "@/components/patient-details/PatientInfoSidebar";
import { CurrentVisitAlert } from "@/components/patient-details/CurrentVisitAlert";
import { OverviewTab } from "@/components/patient-details/OverviewTab";
import { Patient } from "@/types/patient";

interface Note {
  id: string;
  patientId: string;
  date: string;
  content: string;
  author: string;
  audioRecording: string | null;
  summary?: string;
  pdfUrl?: string;
}

const mockVisits: Visit[] = [
  {
    id: "visit1",
    patientId: "p7",
    date: "Apr 12, 2024",
    reason: "Annual Check-up",
    provider: "Dr. Sharma",
    status: "completed",
    summary: "Patient is in good health overall. Blood pressure is slightly elevated but not concerning. Recommended continued exercise and healthy diet.",
    vitalSigns: {
      bloodPressure: "130/85",
      heartRate: "72 bpm",
      temperature: "98.6°F",
      respiratoryRate: "16 bpm",
      oxygenSaturation: "98%"
    },
    medications: [
      {
        id: "med1",
        name: "Lisinopril",
        dosage: "10mg",
        frequency: "Once daily"
      },
      {
        id: "med2",
        name: "Aspirin",
        dosage: "81mg",
        frequency: "Once daily"
      }
    ]
  },
  {
    id: "visit2",
    patientId: "p7",
    date: "Jan 15, 2024",
    reason: "Hypertension Follow-up",
    provider: "Dr. Patel",
    status: "completed",
    summary: "Patient's blood pressure remains elevated. Increased Lisinopril dosage from 5mg to 10mg. Patient to monitor BP daily and report if exceeding 140/90.",
    vitalSigns: {
      bloodPressure: "142/88",
      heartRate: "78 bpm",
      temperature: "98.4°F",
      oxygenSaturation: "97%"
    },
    medications: [
      {
        id: "med3",
        name: "Lisinopril",
        dosage: "5mg increased to 10mg",
        frequency: "Once daily"
      }
    ],
    transcript: "Patient reports occasional headaches in the morning. Blood pressure readings at home have been ranging from 135/85 to 145/90. Patient has been compliant with medication but admits to inconsistent exercise routine due to work schedule. Discussed importance of regular physical activity and strategies to incorporate it into daily routine."
  },
  {
    id: "visit3",
    patientId: "p7",
    date: "Apr 22, 2024",
    reason: "Comprehensive Eye Exam",
    provider: "Dr. Smith",
    status: "in-session",
    examFindings: {
      subjective: "Blurry vision in the right eye for the past two weeks, particularly noticeable when reading and using a computer. Mild eye strain and occasional headaches. No pain or discharge noted.",
      objective: "Visual acuity testing shows reduced acuity in right eye. No signs of infection or inflammation. Fundus examination normal.",
      assessment: "Mild refractive error change, likely due to extended computer use."
    },
    vitalSigns: {
      visionOD: "20/40",
      visionOS: "20/20",
      visionCorrection: "+1.75 D for both eyes (bifocals)",
      intraocularPressure: "16 mmHg"
    }
  }
];

const mockMedicalHistory = [
  {
    id: "cond1",
    condition: "Hypertension",
    status: "well-controlled on lisinopril",
    medications: ["Lisinopril 10mg daily"]
  },
  {
    id: "cond2",
    condition: "Hyperlipidemia",
    status: "managed with atorvastatin",
    medications: ["Atorvastatin 20mg daily"]
  },
  {
    id: "cond3",
    condition: "No history of diabetes, cardiac disease, or other systemic issues",
    status: ""
  }
];

export default function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>(patientNotes as Note[]);
  const [visits, setVisits] = useState<Visit[]>(mockVisits.filter(v => v.patientId === id));
  const [medicalHistory, setMedicalHistory] = useState(mockMedicalHistory);
  
  const filteredProblems = patientProblems.filter(p => p.patientId === id);
  const filteredMedications = patientMedications.filter(m => m.patientId === id);
  const filteredAllergies = patientAllergies.filter(a => a.patientId === id);
  const filteredLabResults = patientLabResults.filter(l => l.patientId === id);
  const filteredVitals = patientVitals.filter(v => v.patientId === id);
  const filteredTasks = patientTasks.filter(t => t.patientId === id);
  
  const rawPatient = patients.find(p => p.id === id);
  
  const patient: Patient | undefined = rawPatient 
    ? { 
        id: rawPatient.id,
        name: rawPatient.name,
        firstName: rawPatient.name.split(' ')[0],
        lastName: rawPatient.name.split(' ')[1],
        gender: rawPatient.gender,
        dateOfBirth: rawPatient.dateOfBirth,
        age: rawPatient.age,
        provider: rawPatient.provider,
        image: rawPatient.image,
        active: rawPatient.active,
        pronouns: rawPatient.pronouns || "",
        contactInfo: rawPatient.contactInfo,
        medicalHistory: rawPatient.medicalHistory
      } 
    : undefined;
    
  if (!patient) {
    return (
      <PageContainer>
        <div className="p-6">
          <h1>Patient not found</h1>
        </div>
      </PageContainer>
    );
  }
    
  const handleUploadPdf = (file: File) => {
    toast({
      title: "Report Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
  };
  
  const handleSaveNote = (note: { 
    text: string, 
    audioUrl?: string, 
    visitId?: string,
    summary?: string,
    pdfUrl?: string
  }) => {
    const newNote: Note = {
      id: `note${notes.length + 1}`,
      patientId: id || "",
      date: new Date().toLocaleDateString(),
      content: note.text,
      author: "Dr. Sharma",
      audioRecording: note.audioUrl || null,
      summary: note.summary
    };
    
    setNotes([newNote, ...notes]);
    
    if (note.visitId) {
      setVisits(prev => prev.map(visit => 
        visit.id === note.visitId 
          ? { 
              ...visit, 
              transcript: note.text, 
              audioRecording: note.audioUrl 
            } 
          : visit
      ));
    }
    
    toast({
      title: "Note Saved",
      description: note.pdfUrl 
        ? "The PDF document has been attached to patient notes."
        : "Your note has been saved to the patient record.",
    });
  };

  const handleAddVisit = () => {
    toast({
      title: "Add Visit",
      description: "This would open a form to add a new visit.",
    });
  };
  
  const handleEditVisit = (visitId: string) => {
    toast({
      title: "Edit Visit",
      description: `This would open a form to edit visit ${visitId}.`,
    });
  };
  
  const handleEditMedicalHistory = () => {
    toast({
      title: "Edit Medical History",
      description: "This would open a form to edit the patient's medical history.",
    });
  };

  const activeProblemsCount = filteredProblems.filter(p => p.status === "active").length;
  const activeMedicationsCount = filteredMedications.filter(m => m.status === "active").length;
  const lastVisitDate = visits.length > 0 
    ? visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].date 
    : undefined;
  const recentSummary = visits.length > 0 
    ? visits.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0].summary 
    : undefined;
  
  const currentVisit = visits.find(v => v.status.toLowerCase() === "in-session");

  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="Patient Profile" 
          actions={
            <div className="flex gap-3">
              <Button variant="outline" size="sm">
                <Phone className="h-4 w-4 mr-2" />
                Call
              </Button>
              <Button variant="outline" size="sm">
                <MessageCircle className="h-4 w-4 mr-2" />
                Message
              </Button>
              <Button size="sm">
                <FileText className="h-4 w-4 mr-2" />
                Add Note
              </Button>
            </div>
          }
        />

        {currentVisit && (
          <CurrentVisitAlert 
            visit={currentVisit} 
            onEditVisit={handleEditVisit} 
          />
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <PatientInfoSidebar patient={patient} />
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <PatientSummary 
              patientId={id || ""}
              lastVisitDate={lastVisitDate}
              activeProblems={activeProblemsCount}
              activeMedications={activeMedicationsCount}
              allergiesCount={filteredAllergies.length}
              recentSummary={recentSummary}
              nextAppointment="May 15, 2024 at 10:30 AM with Dr. Sharma"
            />
          
            <Tabs 
              defaultValue="overview" 
              className="animate-fadeIn"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-6 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="visits">Visits</TabsTrigger>
                <TabsTrigger value="problems">Problems</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="allergies">Allergies</TabsTrigger>
                <TabsTrigger value="labs">Labs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview">
                <OverviewTab 
                  patientId={id || ""}
                  medicalHistory={medicalHistory}
                  vitals={filteredVitals}
                  notes={notes}
                  visits={visits}
                  tasks={filteredTasks}
                  onEditMedicalHistory={handleEditMedicalHistory}
                  onSaveNote={handleSaveNote}
                />
              </TabsContent>
              
              <TabsContent value="visits">
                <VisitsTab 
                  visits={visits} 
                  onAddVisit={handleAddVisit} 
                  onEditVisit={handleEditVisit}
                />
              </TabsContent>
              
              <TabsContent value="problems">
                <ProblemsTab problems={filteredProblems} />
              </TabsContent>
              
              <TabsContent value="medications">
                <MedicationsTab medications={filteredMedications} />
              </TabsContent>
              
              <TabsContent value="allergies">
                <AllergiesTab allergies={filteredAllergies} />
              </TabsContent>
              
              <TabsContent value="labs">
                <LabsTab 
                  labResults={filteredLabResults}
                  onUploadPdf={handleUploadPdf}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
