
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";

interface VisitMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

interface Visit {
  id: string;
  date: string;
  reason: string;
  provider: string;
  status: string; // "completed", "scheduled", "cancelled"
  summary?: string;
  vitalSigns?: {
    bloodPressure?: string;
    heartRate?: string;
    temperature?: string;
    respiratoryRate?: string;
    oxygenSaturation?: string;
  };
  medications?: VisitMedication[];
  audioRecording?: string;
  transcript?: string;
}

interface VisitsTabProps {
  visits: Visit[];
  onAddVisit?: () => void;
}

export function VisitsTab({ visits, onAddVisit }: VisitsTabProps) {
  const [expandedVisits, setExpandedVisits] = useState<string[]>([]);

  const toggleVisit = (visitId: string) => {
    if (expandedVisits.includes(visitId)) {
      setExpandedVisits(expandedVisits.filter(id => id !== visitId));
    } else {
      setExpandedVisits([...expandedVisits, visitId]);
    }
  };

  // Helper function to determine status badge type
  const getStatusBadgeType = (status: string) => {
    switch(status.toLowerCase()) {
      case "completed": return "completed";
      case "scheduled": return "pending";
      case "cancelled": return "cancelled";
      default: return "pending";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Patient Visits</h3>
          <Button onClick={onAddVisit} size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Visit
          </Button>
        </div>
        
        <div className="space-y-4">
          {visits.map((visit) => (
            <Collapsible 
              key={visit.id} 
              open={expandedVisits.includes(visit.id)}
              onOpenChange={() => toggleVisit(visit.id)}
              className="border rounded-md"
            >
              <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
                <div className="flex items-center space-x-4">
                  {expandedVisits.includes(visit.id) ? (
                    <ChevronDown className="h-4 w-4 text-muted-foreground" />
                  ) : (
                    <ChevronRight className="h-4 w-4 text-muted-foreground" />
                  )}
                  <div>
                    <div className="font-medium">{visit.date}</div>
                    <div className="text-sm text-muted-foreground">{visit.reason}</div>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-right">
                    <div>{visit.provider}</div>
                  </div>
                  <StatusBadge status={getStatusBadgeType(visit.status)}>
                    {visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                  </StatusBadge>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="px-4 pb-4">
                <div className="space-y-4">
                  {/* Visit Summary */}
                  {visit.summary && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Visit Summary</h4>
                      <div className="text-sm bg-muted/30 p-3 rounded-md">
                        {visit.summary}
                      </div>
                    </div>
                  )}
                  
                  {/* Vital Signs */}
                  {visit.vitalSigns && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Vital Signs</h4>
                      <div className="grid grid-cols-2 md:grid-cols-5 gap-2 text-sm">
                        {visit.vitalSigns.bloodPressure && (
                          <div className="bg-muted/30 p-2 rounded-md">
                            <span className="text-xs text-muted-foreground block">Blood Pressure</span>
                            <span>{visit.vitalSigns.bloodPressure}</span>
                          </div>
                        )}
                        {visit.vitalSigns.heartRate && (
                          <div className="bg-muted/30 p-2 rounded-md">
                            <span className="text-xs text-muted-foreground block">Heart Rate</span>
                            <span>{visit.vitalSigns.heartRate}</span>
                          </div>
                        )}
                        {visit.vitalSigns.temperature && (
                          <div className="bg-muted/30 p-2 rounded-md">
                            <span className="text-xs text-muted-foreground block">Temperature</span>
                            <span>{visit.vitalSigns.temperature}</span>
                          </div>
                        )}
                        {visit.vitalSigns.respiratoryRate && (
                          <div className="bg-muted/30 p-2 rounded-md">
                            <span className="text-xs text-muted-foreground block">Respiratory Rate</span>
                            <span>{visit.vitalSigns.respiratoryRate}</span>
                          </div>
                        )}
                        {visit.vitalSigns.oxygenSaturation && (
                          <div className="bg-muted/30 p-2 rounded-md">
                            <span className="text-xs text-muted-foreground block">O² Saturation</span>
                            <span>{visit.vitalSigns.oxygenSaturation}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {/* Medications */}
                  {visit.medications && visit.medications.length > 0 && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Prescribed Medications</h4>
                      <div className="rounded-md border overflow-hidden">
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Medication</TableHead>
                              <TableHead>Dosage</TableHead>
                              <TableHead>Frequency</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {visit.medications.map((med) => (
                              <TableRow key={med.id}>
                                <TableCell className="font-medium">{med.name}</TableCell>
                                <TableCell>{med.dosage}</TableCell>
                                <TableCell>{med.frequency}</TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </div>
                    </div>
                  )}
                  
                  {/* Audio Recording & Transcript */}
                  {(visit.audioRecording || visit.transcript) && (
                    <div>
                      <h4 className="text-sm font-medium mb-2">Visit Notes</h4>
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
              </CollapsibleContent>
            </Collapsible>
          ))}
          
          {visits.length === 0 && (
            <div className="text-center py-8 border rounded-md">
              <p className="text-muted-foreground">No visits recorded</p>
              <Button onClick={onAddVisit} size="sm" className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add First Visit
              </Button>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
