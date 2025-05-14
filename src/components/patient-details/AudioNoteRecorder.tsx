
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { VisitSelector } from "./audio-notes/VisitSelector";
import { RecordingControls } from "./audio-notes/RecordingControls";
import { TranscriptionDisplay } from "./audio-notes/TranscriptionDisplay";
import { useAudioRecording } from "./audio-notes/useAudioRecording";
import { AudioNoteProps } from "./audio-notes/types";
import { Loader2 } from "lucide-react";

export function AudioNoteRecorder({ onSaveNote, visits = [] }: AudioNoteProps) {
  const [transcribedText, setTranscribedText] = useState("");
  const [summary, setSummary] = useState("");
  const [selectedVisit, setSelectedVisit] = useState<string>("");
  const [isProcessing, setIsProcessing] = useState(false);
  
  const { 
    isRecording, 
    audioUrl, 
    recordingTime,
    startRecording, 
    stopRecording, 
    playAudio 
  } = useAudioRecording();

  useEffect(() => {
    // Simulate transcription when audio is recorded
    if (audioUrl && !isProcessing && !transcribedText) {
      setIsProcessing(true);
      // Simulate AI transcription with a delay
      setTimeout(() => {
        // Mocked transcription
        const mockTranscription = "Patient reports feeling better after starting the new medication. Blood pressure readings have improved to 130/85. Patient still experiences occasional headaches in the morning, but they are less severe. Patient is following the prescribed exercise regimen and has noticed increased energy levels. Follow up in 2 weeks to adjust medication if needed.";
        setTranscribedText(mockTranscription);
        
        // Generate a summary
        setTimeout(() => {
          setSummary("Patient showing improvement with new medication. BP improved to 130/85. Minor morning headaches persist. Adhering to exercise plan with increased energy. 2-week follow-up recommended.");
          setIsProcessing(false);
        }, 1000);
      }, 2000);
    }
  }, [audioUrl, isProcessing, transcribedText]);
  
  const handleSaveNote = () => {
    onSaveNote({
      text: transcribedText,
      audioUrl: audioUrl || undefined,
      visitId: selectedVisit || undefined,
      summary: summary || undefined
    });
    setTranscribedText("");
    setSummary("");
    setSelectedVisit("");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Voice Notes</h3>
        
        <div className="space-y-4">
          {/* Visit selector */}
          {visits.length > 0 && (
            <VisitSelector
              visits={visits}
              selectedVisit={selectedVisit}
              onVisitChange={setSelectedVisit}
            />
          )}
        
          {/* Recording controls */}
          <RecordingControls
            isRecording={isRecording}
            recordingTime={recordingTime}
            audioUrl={audioUrl}
            isProcessing={isProcessing}
            onStartRecording={startRecording}
            onStopRecording={stopRecording}
            onPlayAudio={playAudio}
          />
          
          {isProcessing && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Processing audio...</span>
            </div>
          )}
          
          {/* Transcription display */}
          <TranscriptionDisplay
            isProcessing={isProcessing}
            transcribedText={transcribedText}
            onTranscriptionChange={setTranscribedText}
            summary={summary}
            onSummaryChange={setSummary}
          />
          
          <Button 
            onClick={handleSaveNote}
            disabled={!transcribedText || isProcessing}
            className="w-full"
          >
            Save Note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
