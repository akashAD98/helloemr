
import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, RefreshCw } from "lucide-react";
import { Visit } from "@/types/visit";
import { VisitItem } from "./visits/VisitItem";
import { EmptyVisits } from "./visits/EmptyVisits";
import { NewVisitDialog } from "./visits/NewVisitDialog";
import { VisitDetailsDialog } from "./visits/VisitDetailsDialog";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Re-export the Visit type for backwards compatibility
export type { Visit } from "@/types/visit";
export type { VisitMedication, VisitVitals, ExamFindings } from "@/types/visit";

interface VisitsTabProps {
  visits: Visit[];
  onAddVisit?: () => void;
  onEditVisit?: (visitId: string) => void;
  patientId: string; // Add patientId prop
}

export function VisitsTab({ visits: initialVisits, onAddVisit, onEditVisit, patientId }: VisitsTabProps) {
  const [expandedVisits, setExpandedVisits] = useState<string[]>([]);
  const [isNewVisitOpen, setIsNewVisitOpen] = useState(false);
  const [selectedVisit, setSelectedVisit] = useState<any>(null);
  const [visits, setVisits] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Load visits from database
  useEffect(() => {
    loadVisits();
  }, [patientId]);

  const loadVisits = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('visits')
        .select('*')
        .eq('patient_id', patientId)
        .order('visit_date', { ascending: false })
        .order('visit_time', { ascending: false });

      if (error) throw error;

      setVisits(data || []);
    } catch (error) {
      console.error('Error loading visits:', error);
      toast.error('Failed to load visits');
      // Fallback to initial visits if provided
      setVisits(initialVisits || []);
    } finally {
      setLoading(false);
    }
  };

  const handleRefreshVisits = async () => {
    await loadVisits();
    toast.success('Visits refreshed');
  };

  const handleVisitCreated = (newVisit: any) => {
    setVisits(prev => [newVisit, ...prev]);
    toast.success('Visit created successfully');
  };

  const handleAddVisit = () => {
    if (onAddVisit) {
      onAddVisit();
    } else {
      setIsNewVisitOpen(true);
    }
  };

  const toggleVisit = (visitId: string) => {
    if (expandedVisits.includes(visitId)) {
      setExpandedVisits(expandedVisits.filter(id => id !== visitId));
    } else {
      setExpandedVisits([...expandedVisits, visitId]);
    }
  };

  const handleViewVisit = (visit: any) => {
    setSelectedVisit(visit);
  };

  return (
    <>
      <Card>
        <CardContent className="p-4 md:p-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 gap-2">
            <h3 className="text-lg font-medium">Patient Visits</h3>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleRefreshVisits}
                disabled={loading}
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
              </Button>
              <Button onClick={handleAddVisit} size="sm">
                <Plus className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">New Visit</span>
                <span className="sm:hidden">New</span>
              </Button>
            </div>
          </div>
          
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2" />
              <p className="text-muted-foreground">Loading visits...</p>
            </div>
          ) : (
            <div className="space-y-4">
              {visits.map((visit) => (
                <VisitItem
                  key={visit.id}
                  visit={visit}
                  isExpanded={expandedVisits.includes(visit.id)}
                  onToggle={() => toggleVisit(visit.id)}
                  onEditVisit={onEditVisit}
                  onViewVisit={() => handleViewVisit(visit)}
                />
              ))}
              
              {visits.length === 0 && !loading && (
                <EmptyVisits onAddVisit={handleAddVisit} />
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <NewVisitDialog
        open={isNewVisitOpen}
        onOpenChange={setIsNewVisitOpen}
        patientId={patientId}
        onVisitCreated={handleVisitCreated}
      />

      <VisitDetailsDialog
        open={!!selectedVisit}
        onOpenChange={(open) => !open && setSelectedVisit(null)}
        visit={selectedVisit}
      />
    </>
  );
}
