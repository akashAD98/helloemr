
import { Button } from "@/components/ui/button";
import { Mic, MicOff, Headphones, Loader2 } from "lucide-react";

interface RecordingControlsProps {
  isRecording: boolean;
  recordingTime: number;
  audioUrl: string | null;
  isProcessing: boolean;
  onStartRecording: () => void;
  onStopRecording: () => void;
  onPlayAudio: () => void;
}

export function RecordingControls({
  isRecording,
  recordingTime,
  audioUrl,
  isProcessing,
  onStartRecording,
  onStopRecording,
  onPlayAudio
}: RecordingControlsProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex items-center gap-2">
      {isRecording ? (
        <Button 
          variant="destructive" 
          onClick={onStopRecording}
          className="w-full"
        >
          <MicOff className="mr-2 h-4 w-4" />
          Stop Recording ({formatTime(recordingTime)})
        </Button>
      ) : (
        <Button 
          onClick={onStartRecording}
          className="w-full"
          disabled={isProcessing}
        >
          <Mic className="mr-2 h-4 w-4" />
          Start Voice Recording
        </Button>
      )}
      
      {audioUrl && (
        <Button
          variant="outline"
          onClick={onPlayAudio}
          disabled={isProcessing}
        >
          <Headphones className="h-4 w-4" />
        </Button>
      )}
    </div>
  );
}
