
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Mic, MicOff, Loader2, Headphones } from "lucide-react";

interface AudioNoteRecorderProps {
  onSaveNote: (note: { text: string, audioUrl?: string }) => void;
}

export function AudioNoteRecorder({ onSaveNote }: AudioNoteRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  
  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      chunksRef.current = [];
      
      mediaRecorder.ondataavailable = (e) => {
        chunksRef.current.push(e.data);
      };
      
      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);
        
        // Simulate AI transcription
        setIsProcessing(true);
        setTimeout(() => {
          // Here you would integrate with a real transcription API
          setTranscribedText("Patient reports feeling better after starting the new medication. Reports mild headache in the mornings. Blood pressure seems to be under control. Follow up in 2 weeks.");
          setIsProcessing(false);
        }, 2000);
      };
      
      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error accessing microphone:", error);
    }
  };
  
  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      // Stop all audio tracks
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };
  
  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };
  
  const handleSaveNote = () => {
    onSaveNote({
      text: transcribedText,
      audioUrl: audioUrl || undefined
    });
    setTranscribedText("");
    setAudioUrl(null);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Voice Notes</h3>
        
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            {isRecording ? (
              <Button 
                variant="destructive" 
                onClick={stopRecording}
                className="w-full"
              >
                <MicOff className="mr-2 h-4 w-4" />
                Stop Recording
              </Button>
            ) : (
              <Button 
                onClick={startRecording}
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
                onClick={playAudio}
                disabled={isProcessing}
              >
                <Headphones className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            <label className="text-sm font-medium">
              AI Transcription {isProcessing && <span className="text-muted-foreground">(Processing...)</span>}
            </label>
            {isProcessing ? (
              <div className="h-32 flex items-center justify-center border rounded-md bg-muted/20">
                <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
              </div>
            ) : (
              <Textarea
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
                placeholder="AI transcription will appear here..."
                className="min-h-32 resize-none"
              />
            )}
          </div>
          
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
