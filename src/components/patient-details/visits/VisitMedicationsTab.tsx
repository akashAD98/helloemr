
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from "@/components/ui/table";
import { Visit } from "@/types/visit";

interface VisitMedicationsTabProps {
  visit: Visit;
}

export function VisitMedicationsTab({ visit }: VisitMedicationsTabProps) {
  return (
    <div>
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
    </div>
  );
}
