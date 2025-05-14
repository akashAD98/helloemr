

export interface Visit {
  id: string;
  date: string;
  reason: string;
}

export interface AudioNoteProps {
  onSaveNote: (note: { 
    text: string, 
    audioUrl?: string, 
    visitId?: string, 
    summary?: string 
  }) => void;
  visits?: Visit[];
}
