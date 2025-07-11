import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Mic, MicOff, Play, Square, Save } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { useAudioRecording } from "../audio-notes/useAudioRecording";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface NewVisitDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  patientId: string;
  onVisitCreated: (visit: any) => void;
}

export function NewVisitDialog({ 
  open, 
  onOpenChange, 
  patientId, 
  onVisitCreated 
}: NewVisitDialogProps) {
  const [date, setDate] = useState<Date>(new Date());
  const [time, setTime] = useState(format(new Date(), "HH:mm"));
  const [reason, setReason] = useState("");
  const [provider, setProvider] = useState("");
  const [status, setStatus] = useState("in-session");
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessingAudio, setIsProcessingAudio] = useState(false);
  const [visitId, setVisitId] = useState<string | null>(null);

  const { 
    isRecording, 
    audioUrl, 
    recordingTime,
    startRecording, 
    stopRecording,
    clearRecording
  } = useAudioRecording();

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleStartVisit = async () => {
    if (!reason || !provider) {
      toast.error("Please fill in all required fields");
      return;
    }

    setIsSubmitting(true);
    try {
      const { data: user } = await supabase.auth.getUser();
      
      const visitData = {
        patient_id: patientId,
        visit_date: format(date, "yyyy-MM-dd"),
        visit_time: time,
        reason,
        provider,
        status,
        notes,
        created_by: user.user?.id
      };

      const { data: visit, error } = await supabase
        .from('visits')
        .insert(visitData)
        .select()
        .single();

      if (error) throw error;

      setVisitId(visit.id);
      toast.success("Visit started successfully! You can now record audio notes.");
      
      // Don't close dialog yet - allow audio recording
    } catch (error) {
      console.error('Error creating visit:', error);
      toast.error("Failed to start visit");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAudioRecording = async () => {
    if (isRecording) {
      await stopRecording();
      toast.success("Recording stopped. Processing audio...");
    } else {
      if (!visitId) {
        toast.error("Please start the visit first");
        return;
      }
      await startRecording();
      toast.info("Recording started. Speak your clinical notes.");
    }
  };

  const handleProcessAudio = async () => {
    if (!audioUrl || !visitId) {
      toast.error("No audio to process");
      return;
    }

    setIsProcessingAudio(true);
    try {
      // Convert audio URL to base64
      const response = await fetch(audioUrl);
      const arrayBuffer = await response.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);
      let binary = '';
      const chunkSize = 0x8000;
      
      for (let i = 0; i < uint8Array.length; i += chunkSize) {
        const chunk = uint8Array.subarray(i, Math.min(i + chunkSize, uint8Array.length));
        binary += String.fromCharCode.apply(null, Array.from(chunk));
      }
      
      const base64Audio = btoa(binary);

      // Send to transcription service
      const { data, error } = await supabase.functions.invoke('transcribe-audio', {
        body: {
          audio: base64Audio,
          visitId: visitId
        }
      });

      if (error) throw error;

      if (data.success) {
        toast.success("Audio processed and visit updated with transcript and summary!");
        
        // Refresh the visit data
        const { data: updatedVisit } = await supabase
          .from('visits')
          .select('*')
          .eq('id', visitId)
          .single();

        if (updatedVisit) {
          onVisitCreated(updatedVisit);
        }
        
        clearRecording();
        onOpenChange(false);
        resetForm();
      } else {
        throw new Error(data.error || 'Failed to process audio');
      }
    } catch (error) {
      console.error('Error processing audio:', error);
      toast.error("Failed to process audio: " + error.message);
    } finally {
      setIsProcessingAudio(false);
    }
  };

  const handleFinishVisit = async () => {
    if (!visitId) {
      onOpenChange(false);
      resetForm();
      return;
    }

    try {
      const { error } = await supabase
        .from('visits')
        .update({ 
          status: 'completed',
          notes: notes
        })
        .eq('id', visitId);

      if (error) throw error;

      // Get the updated visit
      const { data: updatedVisit } = await supabase
        .from('visits')
        .select('*')
        .eq('id', visitId)
        .single();

      if (updatedVisit) {
        onVisitCreated(updatedVisit);
      }

      toast.success("Visit completed successfully!");
      onOpenChange(false);
      resetForm();
    } catch (error) {
      console.error('Error finishing visit:', error);
      toast.error("Failed to finish visit");
    }
  };

  const resetForm = () => {
    setDate(new Date());
    setTime(format(new Date(), "HH:mm"));
    setReason("");
    setProvider("");
    setStatus("in-session");
    setNotes("");
    setVisitId(null);
    clearRecording();
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {!visitId ? "Start New Visit" : "Visit In Progress"}
          </DialogTitle>
          <DialogDescription>
            {!visitId 
              ? "Fill in the visit details to start a new patient visit"
              : "Record audio notes and manage the current visit"
            }
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          {!visitId ? (
            <>
              {/* Visit Setup Form */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="date">Visit Date</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !date && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {date ? format(date, "PPP") : <span>Pick a date</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Visit Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reason">Reason for Visit *</Label>
                <Input
                  id="reason"
                  placeholder="e.g., Annual check-up, Follow-up, Consultation"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="provider">Provider *</Label>
                <Select value={provider} onValueChange={setProvider}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select provider" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Dr. Jennifer Davis">Dr. Jennifer Davis</SelectItem>
                    <SelectItem value="Dr. Anjali Gupta">Dr. Anjali Gupta</SelectItem>
                    <SelectItem value="Dr. Michael Wong">Dr. Michael Wong</SelectItem>
                    <SelectItem value="Dr. Sarah Johnson">Dr. Sarah Johnson</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="notes">Initial Notes</Label>
                <Textarea
                  id="notes"
                  placeholder="Any initial observations or notes..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                />
              </div>
            </>
          ) : (
            <>
              {/* Audio Recording Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <h4 className="font-medium text-blue-900">Visit In Progress</h4>
                    <p className="text-sm text-blue-700">Record audio notes for this visit</p>
                  </div>
                  <div className="text-sm text-blue-600">
                    {format(date, "PPP")} at {time}
                  </div>
                </div>

                <div className="flex items-center gap-4 p-4 border rounded-lg">
                  <Button
                    onClick={handleAudioRecording}
                    disabled={isProcessingAudio}
                    variant={isRecording ? "destructive" : "default"}
                    size="lg"
                  >
                    {isRecording ? (
                      <>
                        <MicOff className="w-5 h-5 mr-2" />
                        Stop Recording ({formatTime(recordingTime)})
                      </>
                    ) : (
                      <>
                        <Mic className="w-5 h-5 mr-2" />
                        Start Recording
                      </>
                    )}
                  </Button>

                  {audioUrl && !isRecording && (
                    <Button
                      onClick={handleProcessAudio}
                      disabled={isProcessingAudio}
                      variant="outline"
                    >
                      <Save className="w-4 h-4 mr-2" />
                      {isProcessingAudio ? "Processing..." : "Process Audio"}
                    </Button>
                  )}
                </div>

                {audioUrl && (
                  <div className="p-4 bg-green-50 rounded-lg">
                    <p className="text-sm text-green-700 mb-2">Audio recorded successfully</p>
                    <audio controls src={audioUrl} className="w-full" />
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="visit-notes">Additional Notes</Label>
                  <Textarea
                    id="visit-notes"
                    placeholder="Add any additional notes for this visit..."
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    rows={4}
                  />
                </div>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          {!visitId ? (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button 
                onClick={handleStartVisit} 
                disabled={isSubmitting || !reason || !provider}
              >
                {isSubmitting ? "Starting..." : "Start Visit"}
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Continue Later
              </Button>
              <Button onClick={handleFinishVisit}>
                Finish Visit
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}