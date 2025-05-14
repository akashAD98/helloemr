
import { ExternalLink, Plus, FileText, MessageSquare } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { AudioNoteRecorder } from "./AudioNoteRecorder";
import { PDFAttachment } from "./PDFAttachment";
import { PatientChat } from "./PatientChat";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";

interface Note {
  id: string;
  patientId: string;
  date: string;
  content: string;
  author: string;
  audioRecording: string | null;
  summary?: string;
}

interface PatientNotesProps {
  notes: Note[];
  patientId: string;
  visits: { id: string; date: string; reason: string }[];
  onSaveNote: (note: { 
    text: string;
    audioUrl?: string;
    visitId?: string;
    summary?: string;
  }) => void;
}

export function PatientNotes({ notes, patientId, visits, onSaveNote }: PatientNotesProps) {
  const [activeTab, setActiveTab] = useState<string>("voice");

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Patient Notes</h3>
          <div className="flex items-center gap-2">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Plus className="h-4 w-4" />
                  <span>Add Note</span>
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[600px]">
                <DialogHeader>
                  <DialogTitle>Add Patient Note</DialogTitle>
                </DialogHeader>
                <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                  <TabsList className="grid grid-cols-3">
                    <TabsTrigger value="voice">Voice Note</TabsTrigger>
                    <TabsTrigger value="pdf">PDF Document</TabsTrigger>
                    <TabsTrigger value="chat">Chat</TabsTrigger>
                  </TabsList>
                  <TabsContent value="voice" className="mt-4">
                    <AudioNoteRecorder 
                      onSaveNote={onSaveNote} 
                      visits={visits}
                    />
                  </TabsContent>
                  <TabsContent value="pdf" className="mt-4">
                    <PDFAttachment patientId={patientId} onSaveNote={onSaveNote} />
                  </TabsContent>
                  <TabsContent value="chat" className="mt-4">
                    <PatientChat patientId={patientId} />
                  </TabsContent>
                </Tabs>
              </DialogContent>
            </Dialog>
            
            <Button variant="ghost" size="sm" className="flex items-center gap-1 text-medical-600">
              <ExternalLink className="h-4 w-4" />
              <span>See all</span>
            </Button>
          </div>
        </div>
        
        <div className="space-y-4">
          {notes.length > 0 ? (
            notes.slice(0, 3).map(note => (
              <div key={note.id} className="border rounded-md p-4 bg-muted/30">
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium">{note.author}</h4>
                  <span className="text-xs text-muted-foreground">{note.date}</span>
                </div>
                {note.summary && (
                  <div className="mb-2 text-sm font-medium bg-blue-50 text-blue-800 p-2 rounded">
                    Summary: {note.summary}
                  </div>
                )}
                <p className="text-sm">{note.content}</p>
                {note.audioRecording && (
                  <div className="mt-2">
                    <audio controls src={note.audioRecording} className="w-full h-8" />
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-6 text-muted-foreground">
              No notes available. Click "Add Note" to create one.
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
