
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { DeepAIAudioForm } from "@/components/patient-details/forms/DeepAIAudioForm";
import { useToast } from "@/hooks/use-toast";

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

export default function DeepAIAudioNotes() {
  const { toast } = useToast();
  const [notes, setNotes] = useState<Note[]>([]);

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
    
    toast({
      title: "Audio Note Saved",
      description: "Your audio note has been successfully saved.",
    });
  };

  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="DeepAI Audio Notes" 
          description="AI-powered audio note-taking for clinical documentation"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Audio Form */}
          <div className="lg:col-span-2">
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

          {/* Recent Notes */}
          <div className="lg:col-span-1">
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recent Notes</h3>
                {notes.length === 0 ? (
                  <p className="text-muted-foreground text-sm">No notes created yet</p>
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
                            🎵 Audio recording available
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Tips & Help */}
            <Card className="mt-6">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Tips</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">💡</span>
                    <span>Fill out patient information before recording for better context</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">🎯</span>
                    <span>Speak clearly and at a normal pace for accurate transcription</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600">📝</span>
                    <span>Review and edit generated notes before saving</span>
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
