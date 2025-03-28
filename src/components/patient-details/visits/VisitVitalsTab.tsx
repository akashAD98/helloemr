
import { Visit } from "@/types/visit";

interface VisitVitalsTabProps {
  visit: Visit;
}

export function VisitVitalsTab({ visit }: VisitVitalsTabProps) {
  return (
    <div>
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
    </div>
  );
}
