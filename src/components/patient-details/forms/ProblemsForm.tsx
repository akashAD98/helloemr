
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Plus, X } from "lucide-react";

interface Problem {
  id: string;
  name: string;
  dateIdentified: string;
  status: string;
  notes: string;
}

interface ProblemsFormProps {
  problems: Problem[];
  onSave: (problems: Problem[]) => void;
  onCancel: () => void;
}

export function ProblemsForm({ problems, onSave, onCancel }: ProblemsFormProps) {
  const [editedProblems, setEditedProblems] = useState<Problem[]>(problems);

  const addProblem = () => {
    const newProblem: Problem = {
      id: `problem_${Date.now()}`,
      name: "",
      dateIdentified: new Date().toISOString().split('T')[0],
      status: "active",
      notes: ""
    };
    setEditedProblems([...editedProblems, newProblem]);
  };

  const removeProblem = (id: string) => {
    setEditedProblems(editedProblems.filter(p => p.id !== id));
  };

  const updateProblem = (id: string, field: keyof Problem, value: string) => {
    setEditedProblems(editedProblems.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ));
  };

  const handleSave = () => {
    onSave(editedProblems.filter(p => p.name.trim() !== ""));
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Edit Problems & Conditions</h3>
        <Button onClick={addProblem} size="sm">
          <Plus className="h-4 w-4 mr-2" />
          Add Problem
        </Button>
      </div>

      <div className="space-y-4">
        {editedProblems.map((problem) => (
          <div key={problem.id} className="border rounded-lg p-4 space-y-3">
            <div className="flex justify-between items-start">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
                <div>
                  <Label htmlFor={`problem-${problem.id}`}>Problem Name</Label>
                  <Input
                    id={`problem-${problem.id}`}
                    value={problem.name}
                    onChange={(e) => updateProblem(problem.id, 'name', e.target.value)}
                    placeholder="Enter problem name"
                  />
                </div>
                <div>
                  <Label htmlFor={`date-${problem.id}`}>Date Identified</Label>
                  <Input
                    id={`date-${problem.id}`}
                    type="date"
                    value={problem.dateIdentified}
                    onChange={(e) => updateProblem(problem.id, 'dateIdentified', e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor={`status-${problem.id}`}>Status</Label>
                  <Select
                    value={problem.status}
                    onValueChange={(value) => updateProblem(problem.id, 'status', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">Active</SelectItem>
                      <SelectItem value="chronic">Chronic</SelectItem>
                      <SelectItem value="resolved">Resolved</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeProblem(problem.id)}
                className="ml-2"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            <div>
              <Label htmlFor={`notes-${problem.id}`}>Notes</Label>
              <Textarea
                id={`notes-${problem.id}`}
                value={problem.notes}
                onChange={(e) => updateProblem(problem.id, 'notes', e.target.value)}
                placeholder="Additional notes..."
                rows={2}
              />
            </div>
          </div>
        ))}

        {editedProblems.length === 0 && (
          <div className="text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg">
            No problems added yet. Click "Add Problem" to get started.
          </div>
        )}
      </div>

      <div className="flex justify-end gap-2 pt-4">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleSave}>
          Save Changes
        </Button>
      </div>
    </div>
  );
}
