
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock } from "lucide-react";

interface TranscriptEntry {
  timestamp: string;
  speaker: string;
  text: string;
  isPartial?: boolean;
}

interface RealTimeTranscriptionProps {
  isRecording: boolean;
  recordingTime: number;
}

export function RealTimeTranscription({ isRecording, recordingTime }: RealTimeTranscriptionProps) {
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [currentPartial, setCurrentPartial] = useState<string>("");

  const formatTimestamp = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    const time = `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    return `00:${time}`;
  };

  // Simulate real-time transcription when recording
  useEffect(() => {
    if (!isRecording) return;

    const mockTranscriptParts = [
      { speaker: "Doctor", text: "Good morning, how are you feeling today?" },
      { speaker: "Patient", text: "Good morning, Doctor. I've been having severe headaches for the past three days." },
      { speaker: "Doctor", text: "Can you describe the pain? On a scale of 1 to 10, how would you rate it?" },
      { speaker: "Patient", text: "I'd say it's about a 10 out of 10. It's really intense and gets worse when I move or when there's bright light." },
      { speaker: "Doctor", text: "I see. Have you experienced any nausea or sensitivity to light?" },
      { speaker: "Patient", text: "Yes, both actually. The light sensitivity is particularly bad." },
      { speaker: "Doctor", text: "Based on your symptoms, this sounds like it could be a migraine. Let me do a quick examination and we'll discuss treatment options." },
      { speaker: "Patient", text: "No, it's just that. Except I am concerned. I just recently changed insurance companies and I'm not sure this is going to be covered yet." }
    ];

    let entryIndex = 0;
    let charIndex = 0;

    const interval = setInterval(() => {
      if (entryIndex >= mockTranscriptParts.length) {
        clearInterval(interval);
        return;
      }

      const currentEntry = mockTranscriptParts[entryIndex];
      const currentChar = currentEntry.text[charIndex];

      if (currentChar) {
        setCurrentPartial(prev => prev + currentChar);
        charIndex++;
      } else {
        // Finished this entry, add to transcript
        setTranscript(prev => [...prev, {
          timestamp: formatTimestamp(recordingTime - (mockTranscriptParts.length - entryIndex) * 10),
          speaker: currentEntry.speaker,
          text: currentEntry.text
        }]);
        setCurrentPartial("");
        entryIndex++;
        charIndex = 0;
      }
    }, 50); // Simulate typing speed

    return () => clearInterval(interval);
  }, [isRecording, recordingTime]);

  return (
    <Card className="h-[400px] overflow-hidden">
      <CardContent className="p-0 h-full">
        <div className="p-4 border-b bg-gray-50">
          <div className="flex items-center justify-between">
            <h3 className="font-medium">Live Transcript</h3>
            <div className="flex items-center gap-2">
              {isRecording && (
                <>
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
                  <span className="text-sm text-muted-foreground">Recording</span>
                </>
              )}
            </div>
          </div>
        </div>
        
        <div className="p-4 h-[calc(100%-65px)] overflow-y-auto space-y-3">
          {transcript.map((entry, index) => (
            <div key={index} className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{entry.timestamp}</span>
                <Badge variant={entry.speaker === "Doctor" ? "default" : "secondary"} className="text-xs">
                  {entry.speaker}
                </Badge>
              </div>
              <p className="text-sm leading-relaxed">{entry.text}</p>
            </div>
          ))}
          
          {/* Current partial transcription */}
          {currentPartial && isRecording && (
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Clock className="h-3 w-3" />
                <span>{formatTimestamp(recordingTime)}</span>
                <Badge variant="outline" className="text-xs">Live</Badge>
              </div>
              <p className="text-sm leading-relaxed text-blue-600 italic">{currentPartial}</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
