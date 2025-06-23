import { useState, useEffect } from "react";
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
  const [shouldSend, setShouldSend] = useState(false);
  const [jsonResponse, setJsonResponse] = useState<any>(null);

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
    setShouldSend(true);
  };

  useEffect(() => {
    const sendAudio = async () => {
      if (!audioBlob || !shouldSend) return;
      try {
        // Send audioBlob as multipart/form-data with all required fields
        const formData = new FormData();
        formData.append('audio', audioBlob, 'recording.wav');
        formData.append('template_type', 'general');
        formData.append('patient_name', patientName);
        formData.append('visit_type', visitType);
        formData.append('pronouns', pronouns);
        formData.append('note_length', noteLength);
        formData.append('past_context', pastContext);
        const response = await fetch('https://chatbot.deepaarogya.com/nlp/v1/transcribe/audio/soap_notes', {
          method: 'POST',
          headers: {
            'Authorization': 'Bearer 12345',
            'Accept': '*/*',
            'Accept-Language': 'en-GB,en-US;q=0.9,en;q=0.8',
            'Origin': 'https://chatbot.deepaarogya.com',
            'Referer': 'https://chatbot.deepaarogya.com/deep-chatbot-service/static/soap-audio-recorder.html',
            'User-Agent': 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36',
          },
          body: formData,
        });
        const data = await response.json();
        setTranscribedText(data.soapNote || JSON.stringify(data));
        setJsonResponse(data);
      } catch (error) {
        setTranscribedText("Error generating SOAP note.");
        setJsonResponse(null);
      } finally {
        setIsProcessing(false);
        setShouldSend(false);
      }
    };
    sendAudio();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [audioBlob, shouldSend]);

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
      {(jsonResponse || transcribedText) && (
        <div className="relative bg-white dark:bg-zinc-900 shadow-lg rounded-lg p-4 mt-4 border border-muted max-w-2xl mx-auto">
          <div className="flex items-center mb-2">
            <span className="mr-2 text-primary">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2a4 4 0 014-4h3m4 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v4" /></svg>
            </span>
            <Label htmlFor="transcription" className="text-lg font-semibold">Generated Notes</Label>
            <button
              className="ml-auto px-2 py-1 text-xs bg-muted rounded hover:bg-muted-foreground/10 transition-colors"
              title="Copy to clipboard"
              onClick={() => {
                const text = jsonResponse ? JSON.stringify(jsonResponse, null, 2) : transcribedText;
                navigator.clipboard.writeText(text);
              }}
            >
              Copy
            </button>
          </div>
          <div className="overflow-auto max-h-72">
            {jsonResponse ? (
              <pre className="bg-zinc-100 dark:bg-zinc-800 p-4 rounded text-sm text-left whitespace-pre-wrap break-words font-mono select-text">
                {JSON.stringify(jsonResponse, null, 2)}
              </pre>
            ) : (
              <Textarea
                id="transcription"
                value={transcribedText}
                onChange={(e) => setTranscribedText(e.target.value)}
                className="min-h-[150px] font-mono bg-zinc-100 dark:bg-zinc-800"
              />
            )}
          </div>
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
