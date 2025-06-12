
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { DeepAIAudioForm } from "./forms/DeepAIAudioForm";

interface DeepAIAudioNotesTabProps {
  patientId: string;
  onSaveNote: (note: { 
    text: string;
    audioUrl?: string;
    visitId?: string;
    summary?: string;
    patientName?: string;
    visitType?: string;
    pronouns?: string;
    noteLength?: string;
    pastContext?: string;
  }) => void;
}

export function DeepAIAudioNotesTab({ patientId, onSaveNote }: DeepAIAudioNotesTabProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardContent className="p-6">
          <h2 className="text-xl font-semibold mb-6">DeepAI Audio Notes</h2>
          <DeepAIAudioForm 
            patientId={patientId}
            onSaveNote={onSaveNote}
          />
        </CardContent>
      </Card>
    </div>
  );
}
