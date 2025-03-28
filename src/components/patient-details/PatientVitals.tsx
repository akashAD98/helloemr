
import { VitalCard } from "@/components/common/VitalCard";

interface Vital {
  id: string;
  patientId: string;
  type: string;
  value: string;
  unit: string;
  date: string;
  secondary?: string;
}

interface PatientVitalsProps {
  vitals: Vital[];
}

export function PatientVitals({ vitals }: PatientVitalsProps) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {vitals.slice(0, 3).map(vital => (
        <VitalCard
          key={vital.id}
          title={vital.type}
          value={vital.value}
          unit={vital.unit}
          date={vital.date}
          secondary={vital.secondary}
        />
      ))}
    </div>
  );
}
