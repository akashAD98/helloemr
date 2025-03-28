
import { ExternalLink } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TaskCard } from "@/components/common/TaskCard";

interface Task {
  id: string;
  patientId: string;
  title: string;
  date: string;
  time: string;
  status: string;
  assignee: string;
}

interface PatientTasksProps {
  tasks: Task[];
}

export function PatientTasks({ tasks }: PatientTasksProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Patient Tasks</h3>
          <Button variant="ghost" size="sm" className="flex items-center gap-1 text-medical-600">
            <ExternalLink className="h-4 w-4" />
            <span>See all</span>
          </Button>
        </div>
        
        <div className="space-y-3">
          {tasks.slice(0, 3).map(task => (
            <TaskCard
              key={task.id}
              title={task.title}
              date={task.date}
              time={task.time}
              status={task.status}
              assignee={task.assignee}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
