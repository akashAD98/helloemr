
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { DeepAIAudioForm } from "@/components/patient-details/forms/DeepAIAudioForm";
import { TemplateSelector } from "@/components/deepai-audio/TemplateSelector";
import { SessionDisplay } from "@/components/deepai-audio/SessionDisplay";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileText, Mic } from "lucide-react";

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

interface SessionData {
  id: string;
  patientName: string;
  visitType: string;
  date: string;
  duration: string;
  generatedNote: string;
  transcript: string;
  summary: string;
  audioUrl?: string;
  template: string;
}

export default function DeepAIAudioNotes() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedTemplate, setSelectedTemplate] = useState("soap-general");
  const [customInstructions, setCustomInstructions] = useState("");
  const [currentSession, setCurrentSession] = useState<SessionData | null>(null);
  const [viewMode, setViewMode] = useState<"form" | "session">("form");

  const handleTemplateChange = (templateId: string, instructions: string) => {
    setSelectedTemplate(templateId);
    setCustomInstructions(instructions);
  };

  const handleSaveNote = (note: { 
    text: string;
    audioUrl?: string;
    visitId?: string;
    summary?: string;
    patientName?: string;
    visitType?: string;
    pronouns?: string;
    noteLength?: string;
    pastContext?: string;
  }) => {
    const newNote: Note = {
      id: `note${notes.length + 1}`,
      patientId: note.patientName || "unknown",
      date: new Date().toLocaleDateString(),
      content: note.text,
      author: "Dr. Sharma",
      audioRecording: note.audioUrl || null,
      summary: note.summary
    };
    
    setNotes([newNote, ...notes]);

    // Create session data for display
    const sessionData: SessionData = {
      id: `session-${Date.now()}`,
      patientName: note.patientName || "Unknown Patient",
      visitType: note.visitType || "General Visit",
      date: new Date().toLocaleDateString(),
      duration: "3 min 45 sec", // This would come from actual recording
      generatedNote: generateFormattedNote(note),
      transcript: generateMockTranscript(note),
      summary: note.summary || "Session completed successfully with comprehensive clinical documentation.",
      audioUrl: note.audioUrl,
      template: selectedTemplate
    };

    setCurrentSession(sessionData);
    setViewMode("session");
    
    toast({
      title: "Audio Note Session Complete",
      description: "Your audio note has been processed and is ready for review.",
    });
  };

  const generateFormattedNote = (note: any): string => {
    return `Summary:

The patient ${note.patientName} presents for ${note.visitType?.toLowerCase()}. Based on the audio documentation and clinical assessment, a comprehensive evaluation was conducted with detailed findings and treatment recommendations.

Subjective:

1. Reason for Visit
Patient presents with chief complaint as documented during the session. Medical history and current symptoms were thoroughly reviewed.

2. Chief Complaints
${note.text.substring(0, 200)}... [Generated based on audio transcription]

3. History of Present Illness (HPI)
Detailed assessment of current condition including onset, duration, severity, and associated factors as captured during the clinical encounter.

4. Impact on Daily Activities
Patient's functional status and quality of life considerations were evaluated and documented.

Objective:

Physical examination findings and vital signs assessment completed. Clinical observations and diagnostic findings documented based on the encounter.

Assessment:

Clinical assessment and diagnostic considerations based on the subjective and objective findings. Differential diagnosis and risk factors evaluated.

Plan:

Treatment recommendations and follow-up care plan established. Patient education provided and next steps outlined for optimal care management.`;
  };

  const generateMockTranscript = (note: any): string => {
    return `Doctor: Good morning, ${note.patientName}. How are you feeling today?

Patient: Good morning, Doctor. I've been having some issues that I wanted to discuss with you.

Doctor: Of course, tell me about what's been bothering you.

Patient: ${note.text.substring(0, 150)}...

Doctor: I see. Let me ask you a few more questions about this. When did you first notice these symptoms?

Patient: It started about a week ago, and it's been getting progressively worse.

Doctor: Based on what you've told me and my examination, I think we have a good understanding of what's going on. Let me explain my assessment and what we should do next.

[Transcript continues with detailed clinical discussion...]

Doctor: Do you have any questions about the treatment plan we've discussed?

Patient: No, I think I understand everything. Thank you for explaining it so clearly.

Doctor: You're welcome. We'll schedule a follow-up appointment to see how you're doing.`;
  };

  const handleBackToForm = () => {
    setViewMode("form");
    setCurrentSession(null);
  };

  const handlePlayAudio = () => {
    toast({
      title: "Playing Audio",
      description: "Audio recording is now playing...",
    });
  };

  if (viewMode === "session" && currentSession) {
    return (
      <PageContainer>
        <div className="p-6 space-y-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={handleBackToForm}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Recording
            </Button>
            <PageHeader 
              title="Session Complete" 
              description="Review your generated clinical note and transcript"
            />
          </div>

          <SessionDisplay 
            sessionData={currentSession}
            onPlayAudio={handlePlayAudio}
          />

          <div className="flex justify-center">
            <Button onClick={handleBackToForm} size="lg">
              <Mic className="h-4 w-4 mr-2" />
              Start New Recording
            </Button>
          </div>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="DeepAI Audio Notes" 
          description="AI-powered audio note-taking with customizable templates"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
            />

            {/* Audio Form */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Create Audio Note</h2>
                <DeepAIAudioForm 
                  patientId=""
                  onSaveNote={handleSaveNote}
                />
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Recent Sessions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Sessions</h3>
                {notes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No sessions created yet</p>
                ) : (
                  <div className="space-y-4">
                    {notes.slice(0, 5).map((note) => (
                      <div key={note.id} className="border rounded-lg p-3">
                        <div className="flex justify-between items-start mb-2">
                          <span className="font-medium text-sm">{note.patientId}</span>
                          <span className="text-xs text-muted-foreground">{note.date}</span>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {note.content}
                        </p>
                        {note.audioRecording && (
                          <div className="mt-2 flex items-center text-xs text-blue-600">
                            <FileText className="h-3 w-3 mr-1" />
                            Session completed
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips & Help */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recording Tips</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">💡</span>
                    <span>Select your preferred template before recording</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">🎯</span>
                    <span>Customize instructions to match your documentation style</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600">📝</span>
                    <span>Review generated notes in the session view</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600">🔄</span>
                    <span>Create custom templates for specialized visits</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
