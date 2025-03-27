
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
import { Badge } from "@/components/ui/badge";
import { ChevronDown, ChevronRight, Edit, FileText, Mic, Plus } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export interface VisitMedication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  notes?: string;
}

export interface VisitVitals {
  bloodPressure?: string;
  heartRate?: string;
  temperature?: string;
  respiratoryRate?: string;
  oxygenSaturation?: string;
  // Additional visual measurements
  visionOD?: string; // Right eye
  visionOS?: string; // Left eye
  visionCorrection?: string;
  intraocularPressure?: string;
}

export interface ExamFindings {
  subjective?: string;
  objective?: string;
  assessment?: string;
  cc?: string; // Chief complaint
  ros?: string; // Review of systems
}

export interface Visit {
  id: string;
  patientId: string;
  date: string;
  reason: string;
  provider: string;
  status: string; // "completed", "scheduled", "cancelled", "in-session"
  summary?: string;
  vitalSigns?: VisitVitals;
  examFindings?: ExamFindings;
  medications?: VisitMedication[];
  audioRecording?: string;
  transcript?: string;
  documents?: Array<{id: string, name: string, url: string, type: string}>;
}

interface VisitsTabProps {
  visits: Visit[];
  onAddVisit?: () => void;
  onEditVisit?: (visitId: string) => void;
}

export function VisitsTab({ visits, onAddVisit, onEditVisit }: VisitsTabProps) {
  const [expandedVisits, setExpandedVisits] = useState<string[]>([]);
  const [activeTab, setActiveTab] = useState<Record<string, string>>({});

  const toggleVisit = (visitId: string) => {
    if (expandedVisits.includes(visitId)) {
      setExpandedVisits(expandedVisits.filter(id => id !== visitId));
    } else {
      setExpandedVisits([...expandedVisits, visitId]);
    }
  };

  const handleTabChange = (visitId: string, tab: string) => {
    setActiveTab({...activeTab, [visitId]: tab});
  };

  // Helper function to determine status badge type
  const getStatusBadgeType = (status: string) => {
    switch(status.toLowerCase()) {
      case "completed": return "completed";
      case "scheduled": return "pending";
      case "cancelled": return "cancelled";
      case "in-session": return "in-progress";
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
                    {visit.status === "in-session" ? "In Session" : visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
                  </StatusBadge>
                </div>
              </CollapsibleTrigger>
              
              <CollapsibleContent className="px-4 pb-4">
                <div className="flex justify-end mb-2">
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => onEditVisit && onEditVisit(visit.id)}
                  >
                    <Edit className="h-4 w-4 mr-2" />
                    Edit Visit
                  </Button>
                </div>
                
                <Tabs 
                  defaultValue="summary" 
                  value={activeTab[visit.id] || 'summary'}
                  onValueChange={(value) => handleTabChange(visit.id, value)}
                  className="w-full"
                >
                  <TabsList className="grid grid-cols-4 mb-4">
                    <TabsTrigger value="summary">Summary</TabsTrigger>
                    <TabsTrigger value="exam">Examination</TabsTrigger>
                    <TabsTrigger value="vitals">Vitals</TabsTrigger>
                    <TabsTrigger value="meds">Medications</TabsTrigger>
                  </TabsList>
                  
                  <TabsContent value="summary" className="space-y-4 mt-0">
                    {/* Visit Summary */}
                    {visit.summary && (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Visit Summary</h4>
                        <div className="text-sm bg-muted/30 p-3 rounded-md">
                          {visit.summary}
                        </div>
                      </div>
                    )}
                    
                    {/* Audio Recording & Transcript */}
                    {(visit.audioRecording || visit.transcript) && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Visit Notes</h4>
                          <div className="flex items-center gap-2">
                            {visit.audioRecording && (
                              <Badge variant="outline" className="bg-green-50 text-green-700">
                                <Mic className="h-3 w-3 mr-1" />
                                Audio
                              </Badge>
                            )}
                            {visit.transcript && (
                              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                                <FileText className="h-3 w-3 mr-1" />
                                Transcript
                              </Badge>
                            )}
                          </div>
                        </div>
                        
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
                  </TabsContent>
                  
                  <TabsContent value="exam" className="space-y-4 mt-0">
                    {visit.examFindings?.subjective && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Subjective</h4>
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Patient reported
                          </Badge>
                        </div>
                        <div className="text-sm bg-muted/30 p-3 rounded-md">
                          {visit.examFindings.subjective}
                        </div>
                      </div>
                    )}
                    
                    {visit.examFindings?.objective && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Objective</h4>
                          <Badge variant="outline" className="bg-amber-50 text-amber-700">
                            Provider observed
                          </Badge>
                        </div>
                        <div className="text-sm bg-muted/30 p-3 rounded-md">
                          {visit.examFindings.objective}
                        </div>
                      </div>
                    )}
                    
                    {visit.examFindings?.assessment && (
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="text-sm font-medium">Assessment</h4>
                        </div>
                        <div className="text-sm bg-muted/30 p-3 rounded-md">
                          {visit.examFindings.assessment}
                        </div>
                      </div>
                    )}
                    
                    {!visit.examFindings?.subjective && 
                     !visit.examFindings?.objective && 
                     !visit.examFindings?.assessment && (
                      <div className="text-center py-4 text-muted-foreground">
                        No examination details recorded
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="vitals" className="mt-0">
                    {/* Vital Signs */}
                    {visit.vitalSigns ? (
                      <div>
                        <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm mb-4">
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
                        
                        {/* Visual measurements */}
                        {(visit.vitalSigns.visionOD || visit.vitalSigns.visionOS || 
                          visit.vitalSigns.visionCorrection || visit.vitalSigns.intraocularPressure) && (
                          <div>
                            <h4 className="text-sm font-medium mb-2">Vision Measurements</h4>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
                              {visit.vitalSigns.visionOD && (
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <span className="text-xs text-muted-foreground block">Vision OD (Right)</span>
                                  <span>{visit.vitalSigns.visionOD}</span>
                                </div>
                              )}
                              {visit.vitalSigns.visionOS && (
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <span className="text-xs text-muted-foreground block">Vision OS (Left)</span>
                                  <span>{visit.vitalSigns.visionOS}</span>
                                </div>
                              )}
                              {visit.vitalSigns.visionCorrection && (
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <span className="text-xs text-muted-foreground block">Vision Correction</span>
                                  <span>{visit.vitalSigns.visionCorrection}</span>
                                </div>
                              )}
                              {visit.vitalSigns.intraocularPressure && (
                                <div className="bg-muted/30 p-2 rounded-md">
                                  <span className="text-xs text-muted-foreground block">Intraocular Pressure</span>
                                  <span>{visit.vitalSigns.intraocularPressure}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No vital signs recorded
                      </div>
                    )}
                  </TabsContent>
                  
                  <TabsContent value="meds" className="mt-0">
                    {/* Medications */}
                    {visit.medications && visit.medications.length > 0 ? (
                      <div>
                        <h4 className="text-sm font-medium mb-2">Prescribed Medications</h4>
                        <div className="rounded-md border overflow-hidden">
                          <Table>
                            <TableHeader>
                              <TableRow>
                                <TableHead>Medication</TableHead>
                                <TableHead>Dosage</TableHead>
                                <TableHead>Frequency</TableHead>
                                <TableHead>Notes</TableHead>
                              </TableRow>
                            </TableHeader>
                            <TableBody>
                              {visit.medications.map((med) => (
                                <TableRow key={med.id}>
                                  <TableCell className="font-medium">{med.name}</TableCell>
                                  <TableCell>{med.dosage}</TableCell>
                                  <TableCell>{med.frequency}</TableCell>
                                  <TableCell>{med.notes || '-'}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No medications prescribed during this visit
                      </div>
                    )}
                  </TabsContent>
                </Tabs>
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
