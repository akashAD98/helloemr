
import { Textarea } from "@/components/ui/textarea";
import { Loader2, FileText } from "lucide-react";

interface TranscriptionDisplayProps {
  isProcessing: boolean;
  transcribedText: string;
  onTranscriptionChange: (text: string) => void;
  summary: string;
  onSummaryChange: (text: string) => void;
}

export function TranscriptionDisplay({
  isProcessing,
  transcribedText,
  onTranscriptionChange,
  summary,
  onSummaryChange
}: TranscriptionDisplayProps) {
  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">
          AI Transcription
        </label>
        {isProcessing ? (
          <div className="h-24 flex items-center justify-center border rounded-md bg-muted/20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Textarea
            value={transcribedText}
            onChange={(e) => onTranscriptionChange(e.target.value)}
            placeholder="AI transcription will appear here..."
            className="min-h-24 resize-none"
          />
        )}
      </div>
      
      <div className="space-y-2">
        <label className="text-sm font-medium flex items-center">
          <FileText className="mr-2 h-4 w-4" />
          AI Generated Summary
        </label>
        {isProcessing ? (
          <div className="h-16 flex items-center justify-center border rounded-md bg-muted/20">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <Textarea
            value={summary}
            onChange={(e) => onSummaryChange(e.target.value)}
            placeholder="AI summary will appear here..."
            className="min-h-16 resize-none"
          />
        )}
      </div>
    </div>
  );
}
