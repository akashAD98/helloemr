
import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, Loader2, Headphones, FileText } from "lucide-react";

interface Visit {
  id: string;
  date: string;
  reason: string;
}

interface AudioNoteRecorderProps {
  onSaveNote: (note: { 
    text: string, 
    audioUrl?: string, 
    visitId?: string, 
    summary?: string 
  }) => void;
  visits?: Visit[];
}

export function AudioNoteRecorder({ onSaveNote, visits = [] }: AudioNoteRecorderProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [transcribedText, setTranscribedText] = useState("");
  const [summary, setSummary] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<string>("");
  const [recordingTime, setRecordingTime] = useState(0);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Cleanup function
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);
  
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
          const mockTranscription = "Patient reports feeling better after starting the new medication. Blood pressure readings have improved to 130/85. Patient still experiences occasional headaches in the morning, but they are less severe. Patient is following the prescribed exercise regimen and has noticed increased energy levels. Follow up in 2 weeks to adjust medication if needed.";
          setTranscribedText(mockTranscription);
          
          // Generate a summary
          setTimeout(() => {
            setSummary("Patient showing improvement with new medication. BP improved to 130/85. Minor morning headaches persist. Adhering to exercise plan with increased energy. 2-week follow-up recommended.");
            setIsProcessing(false);
          }, 1000);
        }, 2000);
      };
      
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
      
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
      
      if (timerRef.current) {
        clearInterval(timerRef.current);
        timerRef.current = null;
      }
    }
  };
  
  const playAudio = () => {
    if (audioUrl) {
      const audio = new Audio(audioUrl);
      audio.play();
    }
  };
  
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };
  
  const handleSaveNote = () => {
    onSaveNote({
      text: transcribedText,
      audioUrl: audioUrl || undefined,
      visitId: selectedVisit || undefined,
      summary: summary || undefined
    });
    setTranscribedText("");
    setSummary("");
    setAudioUrl(null);
    setSelectedVisit("");
  };

  return (
    <Card>
      <CardContent className="p-6">
        <h3 className="text-lg font-medium mb-4">Voice Notes</h3>
        
        <div className="space-y-4">
          {/* Visit selector */}
          {visits.length > 0 && (
            <div className="space-y-2">
              <label className="text-sm font-medium">
                Associate with Visit (Optional)
              </label>
              <Select 
                value={selectedVisit} 
                onValueChange={setSelectedVisit}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a visit" />
                </SelectTrigger>
                <SelectContent>
                  {visits.map(visit => (
                    <SelectItem key={visit.id} value={visit.id}>
                      {visit.date} - {visit.reason}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        
          <div className="flex items-center gap-2">
            {isRecording ? (
              <Button 
                variant="destructive" 
                onClick={stopRecording}
                className="w-full"
              >
                <MicOff className="mr-2 h-4 w-4" />
                Stop Recording ({formatTime(recordingTime)})
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
          
          {isProcessing && (
            <div className="flex items-center justify-center py-2">
              <Loader2 className="h-4 w-4 animate-spin mr-2 text-muted-foreground" />
              <span className="text-sm text-muted-foreground">Processing audio...</span>
            </div>
          )}
          
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
                  onChange={(e) => setTranscribedText(e.target.value)}
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
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="AI summary will appear here..."
                  className="min-h-16 resize-none"
                />
              )}
            </div>
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
