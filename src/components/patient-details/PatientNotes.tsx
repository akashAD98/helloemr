
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

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
}

export function PatientNotes({ notes }: PatientNotesProps) {
  return (
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
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
