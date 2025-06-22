import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Mic, MicOff, Play } from "lucide-react";
import { useAudioRecording } from "../audio-notes/useAudioRecording";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface DeepAIAudioFormProps {
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

export function DeepAIAudioForm({ patientId, onSaveNote }: DeepAIAudioFormProps) {
  const [patientName, setPatientName] = useState("");
  const [visitType, setVisitType] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [noteLength, setNoteLength] = useState("");
  const [pastContext, setPastContext] = useState("");
  const [transcribedText, setTranscribedText] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [microphoneEnabled, setMicrophoneEnabled] = useState(false);

  const { 
    isRecording, 
    audioUrl, 
    audioBlob,
    recordingTime,
    startRecording, 
    stopRecording,
    playAudio
  } = useAudioRecording();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartRecording = async () => {
    try {
      await navigator.mediaDevices.getUserMedia({ audio: true });
      setMicrophoneEnabled(true);
      await startRecording();
    } catch (error) {
      console.error("Microphone access denied:", error);
      setMicrophoneEnabled(false);
    }
  };

  const handleStopRecording = async () => {
    stopRecording();
    setIsProcessing(true);
    try {
      if (!audioBlob) {
        setIsProcessing(false);
        return;
      }
      const response = await fetch('https://chatbot.deepaarogya.com/nlp/v1/transcribe/audio/soap_notes', {
        method: 'POST',
        headers: {
          'Content-Type': 'audio/wav',
          'Authorization': 'Bearer 12345', // Replace with real token in production
          'Accept': '*/*',
        },
        body: audioBlob,
      });
      const data = await response.json();
      setTranscribedText(data.soapNote || JSON.stringify(data));
    } catch (error) {
      setTranscribedText("Error generating SOAP note.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCaptureConversation = () => {
    if (isRecording) {
      handleStopRecording();
    } else {
      handleStartRecording();
    }
  };

  const handleSave = () => {
    onSaveNote({
      text: transcribedText,
      audioUrl: audioUrl || undefined,
      patientName,
      visitType,
      pronouns,
      noteLength,
      pastContext
    });
    
    // Reset form
    setPatientName("");
    setVisitType("");
    setPronouns("");
    setNoteLength("");
    setPastContext("");
    setTranscribedText("");
  };

  return (
    <div className="space-y-6">
      {/* Patient Information Form */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="patientName">Patient Name:</Label>
          <Input
            id="patientName"
            value={patientName}
            onChange={(e) => setPatientName(e.target.value)}
            placeholder="Enter patient name"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="visitType">Visit Type:</Label>
          <Select value={visitType} onValueChange={setVisitType}>
            <SelectTrigger>
              <SelectValue placeholder="Select visit type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="New Patient">New Patient</SelectItem>
              <SelectItem value="Returning Patient">Returning Patient</SelectItem>
              <SelectItem value="Follow-up">Follow-up</SelectItem>
              <SelectItem value="Consultation">Consultation</SelectItem>
              <SelectItem value="Emergency">Emergency</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="pronouns">Pronouns:</Label>
          <Select value={pronouns} onValueChange={setPronouns}>
            <SelectTrigger>
              <SelectValue placeholder="Select pronouns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="He/Him">He/Him</SelectItem>
              <SelectItem value="She/Her">She/Her</SelectItem>
              <SelectItem value="They/Them">They/Them</SelectItem>
              <SelectItem value="Unknown">Unknown</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="noteLength">Note Length:</Label>
          <Select value={noteLength} onValueChange={setNoteLength}>
            <SelectTrigger>
              <SelectValue placeholder="Select note length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Brief">Brief</SelectItem>
              <SelectItem value="Standard">Standard</SelectItem>
              <SelectItem value="Detailed">Detailed</SelectItem>
              <SelectItem value="Comprehensive">Comprehensive</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Past Context */}
      <div className="space-y-2">
        <Label htmlFor="pastContext">Past note or any context:</Label>
        <Textarea
          id="pastContext"
          value={pastContext}
          onChange={(e) => setPastContext(e.target.value)}
          placeholder="Add any context that you want to be included in the notes. For example, the patient's chief complaint or any other relevant information."
          className="min-h-[100px]"
        />
      </div>

      {/* Audio Recording Controls */}
      <div className="flex flex-col items-center space-y-4">
        <Button
          size="lg"
          onClick={isRecording ? handleStopRecording : handleStartRecording}
          disabled={isProcessing}
          className={`px-8 py-6 text-lg ${isRecording ? 'bg-red-500 hover:bg-red-600' : 'bg-green-500 hover:bg-green-600'}`}
        >
          {isRecording ? (
            <>
              <MicOff className="mr-2 h-5 w-5" />
              Stop Recording
            </>
          ) : (
            <>
              <Mic className="mr-2 h-5 w-5" />
              Start Recording
            </>
          )}
        </Button>
        {audioUrl && false && (
          <Button variant="outline" onClick={playAudio}>
            <Play className="mr-2 h-4 w-4" />
            Play Recording
          </Button>
        )}
        {isProcessing && (
          <div className="text-center text-muted-foreground">
            Processing audio and generating notes...
          </div>
        )}
      </div>

      {/* Transcribed Notes */}
      {transcribedText && (
        <div className="space-y-2">
          <Label htmlFor="transcription">Generated Notes:</Label>
          <Textarea
            id="transcription"
            value={transcribedText}
            onChange={(e) => setTranscribedText(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
      )}

      {/* Save Button */}
      {transcribedText && (
        <Button onClick={handleSave} className="w-full" size="lg">
          Save Audio Note
        </Button>
      )}

      {/* Help Link */}
      <div className="text-center">
        <a 
          href="#" 
          className="text-sm text-muted-foreground hover:text-primary underline"
          onClick={(e) => e.preventDefault()}
        >
          How to Explain AiSOAP to Your Patients
        </a>
      </div>
    </div>
  );
}
