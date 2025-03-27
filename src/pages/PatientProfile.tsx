
import { useState } from "react";
import { useParams } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { StatusBadge } from "@/components/common/StatusBadge";
import { TaskCard } from "@/components/common/TaskCard";
import { VitalCard } from "@/components/common/VitalCard";
import { ExternalLink, FileText, MessageCircle, Phone } from "lucide-react";
import { patients, tasks, vitals, patientProblems, patientMedications, patientAllergies, patientLabResults, patientNotes } from "@/data/mockData";
import { ProblemsTab } from "@/components/patient-details/ProblemsTab";
import { MedicationsTab } from "@/components/patient-details/MedicationsTab";
import { AllergiesTab } from "@/components/patient-details/AllergiesTab";
import { LabsTab } from "@/components/patient-details/LabsTab";
import { AudioNoteRecorder } from "@/components/patient-details/AudioNoteRecorder";
import { useToast } from "@/components/ui/use-toast";

export default function PatientProfile() {
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState("overview");
  const { toast } = useToast();
  const [notes, setNotes] = useState(patientNotes);
  
  const patient = patients.find(p => p.id === id);
  const patientTasks = tasks.filter(t => t.patientId === id);
  const patientVitals = vitals.filter(v => v.patientId === id);
  const problems = patientProblems.filter(p => p.patientId === id);
  const medications = patientMedications.filter(m => m.patientId === id);
  const allergies = patientAllergies.filter(a => a.patientId === id);
  const labResults = patientLabResults.filter(l => l.patientId === id);
  
  if (!patient) {
    return (
      <PageContainer>
        <div className="p-6">
          <h1>Patient not found</h1>
        </div>
      </PageContainer>
    );
  }

  // Get initials from name
  const initials = patient.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
    
  const handleUploadPdf = (file: File) => {
    toast({
      title: "Report Uploaded",
      description: `${file.name} has been uploaded successfully.`,
    });
    // In a real application, you would upload this file to a server
  };
  
  const handleSaveNote = (note: { text: string, audioUrl?: string }) => {
    const newNote = {
      id: `note${notes.length + 1}`,
      patientId: id || "",
      date: new Date().toLocaleDateString(),
      content: note.text,
      author: "Dr. Sharma",
      audioRecording: note.audioUrl || null
    };
    
    setNotes([newNote, ...notes]);
    
    toast({
      title: "Note Saved",
      description: "Your voice note has been transcribed and saved.",
    });
  };

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

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <Card className="animate-slideUp">
              <CardContent className="p-6">
                <div className="flex flex-col items-center text-center">
                  <Avatar className="h-24 w-24 mb-4">
                    <AvatarImage src={patient.image} alt={patient.name} />
                    <AvatarFallback className="text-lg">{initials}</AvatarFallback>
                  </Avatar>
                  
                  <h2 className="text-xl font-semibold">{patient.name}</h2>
                  <p className="text-sm text-muted-foreground">{patient.pronouns}</p>
                  
                  <div className="mt-4 w-full">
                    <div className="grid grid-cols-2 gap-2 text-sm">
                      <div className="text-muted-foreground text-right">Age:</div>
                      <div className="text-left font-medium">{patient.age} years</div>
                      
                      <div className="text-muted-foreground text-right">Gender:</div>
                      <div className="text-left font-medium">{patient.gender}</div>
                      
                      <div className="text-muted-foreground text-right">DOB:</div>
                      <div className="text-left font-medium">{
                        new Date(patient.dateOfBirth).toLocaleDateString()
                      }</div>
                      
                      <div className="text-muted-foreground text-right">Status:</div>
                      <div className="text-left">
                        {patient.active ? (
                          <StatusBadge status="completed" className="!bg-green-50">Active</StatusBadge>
                        ) : (
                          <StatusBadge status="overdue" className="!bg-red-50">Inactive</StatusBadge>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full border-t mt-4 pt-4">
                    <h3 className="text-sm font-medium mb-2 text-left">Contact Information</h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-start">
                        <span className="text-muted-foreground w-20">Email:</span>
                        <span className="flex-1 text-left">{patient.contactInfo.email}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-muted-foreground w-20">Phone:</span>
                        <span className="flex-1 text-left">{patient.contactInfo.phone}</span>
                      </div>
                      <div className="flex items-start">
                        <span className="text-muted-foreground w-20">Address:</span>
                        <span className="flex-1 text-left">{patient.contactInfo.address}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full border-t mt-4 pt-4">
                    <h3 className="text-sm font-medium mb-2 text-left">Provider</h3>
                    <div className="text-sm text-left">{patient.provider}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <Tabs 
              defaultValue="overview" 
              className="animate-fadeIn"
              onValueChange={setActiveTab}
            >
              <TabsList className="grid grid-cols-5 mb-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="problems">Problems</TabsTrigger>
                <TabsTrigger value="medications">Medications</TabsTrigger>
                <TabsTrigger value="allergies">Allergies</TabsTrigger>
                <TabsTrigger value="labs">Labs</TabsTrigger>
              </TabsList>
              
              <TabsContent value="overview" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {patientVitals.slice(0, 3).map(vital => (
                    <VitalCard
                      key={vital.id}
                      title={vital.type}
                      value={vital.value}
                      unit={vital.unit}
                      date={vital.date}
                      secondary={vital.secondary}
                    />
                  ))}
                </div>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Patient Notes</h3>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-medical-600">
                        <ExternalLink className="h-4 w-4" />
                        <span>See all</span>
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      {notes.slice(0, 1).map(note => (
                        <div key={note.id} className="border rounded-md p-4 bg-muted/30">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-medium">{note.author}</h4>
                            <span className="text-xs text-muted-foreground">{note.date}</span>
                          </div>
                          <p className="text-sm">{note.content}</p>
                          {note.audioRecording && (
                            <div className="mt-2">
                              <audio controls src={note.audioRecording} className="w-full h-8" />
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                {/* Audio Note Recorder */}
                <AudioNoteRecorder onSaveNote={handleSaveNote} />
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Patient Tasks</h3>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-medical-600">
                        <ExternalLink className="h-4 w-4" />
                        <span>See all</span>
                      </Button>
                    </div>
                    
                    <div className="space-y-3">
                      {patientTasks.slice(0, 3).map(task => (
                        <TaskCard
                          key={task.id}
                          title={task.title}
                          date={task.date}
                          time={task.time}
                          status={task.status}
                          assignee={task.assignee}
                        />
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium">Patient Education</h3>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1 text-medical-600">
                        <ExternalLink className="h-4 w-4" />
                        <span>See all</span>
                      </Button>
                    </div>
                    
                    <div className="border rounded-md p-4 bg-muted/30">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-medium">Hypertension Management</h4>
                        <span className="text-xs text-muted-foreground">Shared: Jan 12, 2024</span>
                      </div>
                      <p className="text-sm">
                        Educational materials on managing high blood pressure through diet, exercise, and medication adherence.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="problems">
                <ProblemsTab problems={problems} />
              </TabsContent>
              
              <TabsContent value="medications">
                <MedicationsTab medications={medications} />
              </TabsContent>
              
              <TabsContent value="allergies">
                <AllergiesTab allergies={allergies} />
              </TabsContent>
              
              <TabsContent value="labs">
                <LabsTab 
                  labResults={labResults}
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
