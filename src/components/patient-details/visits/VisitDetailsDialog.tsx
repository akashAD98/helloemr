import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Calendar, 
  Clock, 
  User, 
  FileText, 
  Mic, 
  Activity, 
  Pill, 
  Heart,
  Clipboard
} from "lucide-react";
import { format } from "date-fns";

interface VisitDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  visit: any; // Visit data from database
}

export function VisitDetailsDialog({ open, onOpenChange, visit }: VisitDetailsDialogProps) {
  if (!visit) return null;

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'in-session':
        return 'bg-blue-100 text-blue-800';
      case 'scheduled':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Visit Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Visit Header */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg">Visit Overview</CardTitle>
                <Badge className={getStatusColor(visit.status)}>
                  {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                </Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Date</p>
                    <p className="font-medium">
                      {format(new Date(visit.visit_date), "PPP")}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Time</p>
                    <p className="font-medium">{visit.visit_time}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Provider</p>
                    <p className="font-medium">{visit.provider}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Reason</p>
                    <p className="font-medium">{visit.reason}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Visit Details Tabs */}
          <Tabs defaultValue="summary" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="summary">Summary</TabsTrigger>
              <TabsTrigger value="transcript">Transcript</TabsTrigger>
              <TabsTrigger value="vitals">Vitals</TabsTrigger>
              <TabsTrigger value="notes">Notes</TabsTrigger>
            </TabsList>

            <TabsContent value="summary" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Clipboard className="h-5 w-5" />
                    AI-Generated Clinical Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {visit.ai_generated_summary ? (
                    <div className="prose prose-sm max-w-none">
                      <p className="leading-relaxed">{visit.ai_generated_summary}</p>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No AI summary available for this visit
                    </p>
                  )}
                </CardContent>
              </Card>

              {visit.summary && (
                <Card>
                  <CardHeader>
                    <CardTitle>Provider Summary</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="leading-relaxed">{visit.summary}</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="transcript" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mic className="h-5 w-5" />
                    Audio Transcript
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {visit.transcript ? (
                    <div className="prose prose-sm max-w-none">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="leading-relaxed whitespace-pre-wrap">
                          {visit.transcript}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No transcript available for this visit
                    </p>
                  )}
                  
                  {visit.audio_recording_url && (
                    <div className="mt-4">
                      <p className="text-sm font-medium mb-2">Audio Recording:</p>
                      <audio controls src={visit.audio_recording_url} className="w-full" />
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="vitals" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Heart className="h-5 w-5" />
                    Vital Signs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {visit.vital_signs ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      {Object.entries(visit.vital_signs).map(([key, value]) => (
                        <div key={key} className="p-3 bg-gray-50 rounded-lg">
                          <p className="text-sm text-muted-foreground capitalize">
                            {key.replace(/([A-Z])/g, ' $1').trim()}
                          </p>
                          <p className="font-medium">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No vital signs recorded for this visit
                    </p>
                  )}
                </CardContent>
              </Card>

              {visit.exam_findings && (
                <Card>
                  <CardHeader>
                    <CardTitle>Examination Findings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {Object.entries(visit.exam_findings).map(([key, value]) => (
                        <div key={key}>
                          <p className="text-sm font-medium text-muted-foreground capitalize mb-1">
                            {key}:
                          </p>
                          <p className="text-sm leading-relaxed">{value as string}</p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="notes" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5" />
                    Visit Notes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {visit.notes ? (
                    <p className="leading-relaxed whitespace-pre-wrap">{visit.notes}</p>
                  ) : (
                    <p className="text-muted-foreground italic">
                      No additional notes for this visit
                    </p>
                  )}
                </CardContent>
              </Card>

              {visit.medications && visit.medications.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Pill className="h-5 w-5" />
                      Medications Discussed
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {visit.medications.map((med: any, index: number) => (
                        <div key={index} className="p-3 bg-gray-50 rounded-lg">
                          <p className="font-medium">{med.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {med.dosage} - {med.frequency}
                          </p>
                          {med.notes && (
                            <p className="text-sm mt-1">{med.notes}</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </TabsContent>
          </Tabs>
        </div>

        <div className="flex justify-end">
          <Button onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}