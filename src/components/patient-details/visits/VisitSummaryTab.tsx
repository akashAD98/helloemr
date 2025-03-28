
import { Badge } from "@/components/ui/badge";
import { Visit } from "@/types/visit";
import { FileText, Mic } from "lucide-react";

interface VisitSummaryTabProps {
  visit: Visit;
}

export function VisitSummaryTab({ visit }: VisitSummaryTabProps) {
  return (
    <div className="space-y-4 mt-0">
      {/* Visit Summary */}
      {visit.summary && (
        <div>
          <h4 className="text-sm font-medium mb-2">Visit Summary</h4>
          <div className="text-sm bg-muted/30 p-3 rounded-md">
            {visit.summary}
          </div>
        </div>
      )}
      
      {/* Audio Recording & Transcript */}
      {(visit.audioRecording || visit.transcript) && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Visit Notes</h4>
            <div className="flex items-center gap-2">
              {visit.audioRecording && (
                <Badge variant="outline" className="bg-green-50 text-green-700">
                  <Mic className="h-3 w-3 mr-1" />
                  Audio
                </Badge>
              )}
              {visit.transcript && (
                <Badge variant="outline" className="bg-blue-50 text-blue-700">
                  <FileText className="h-3 w-3 mr-1" />
                  Transcript
                </Badge>
              )}
            </div>
          </div>
          
          {visit.audioRecording && (
            <div className="mb-2">
              <audio 
                src={visit.audioRecording} 
                controls 
                className="w-full h-8" 
              />
            </div>
          )}
          {visit.transcript && (
            <div className="text-sm bg-muted/30 p-3 rounded-md">
              {visit.transcript}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
