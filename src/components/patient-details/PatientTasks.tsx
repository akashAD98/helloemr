
import { Card, CardContent } from "@/components/ui/card";
import { TaskCard } from "@/components/common/TaskCard";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { StatusType } from "@/components/common/StatusBadge";

interface Task {
  id: string;
  patientId: string;
  title: string;
  dueDate: string;
  time: string;
  status: string;
  assignee?: string;
}

interface PatientTasksProps {
  tasks: Task[];
}

export function PatientTasks({ tasks }: PatientTasksProps) {
  // Map task status to StatusType
  const mapStatusToType = (status: string): StatusType => {
    switch(status.toLowerCase()) {
      case "completed": return "completed";
      case "overdue": return "overdue";
      case "booked": return "booked";
      case "cancelled": return "cancelled";
      case "unassigned": return "unassigned";
      case "pending": return "pending";
      default: return "pending";
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Tasks</h3>
          <Button size="sm">
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {tasks.map((task) => (
            <TaskCard
              key={task.id}
              title={task.title}
              date={task.dueDate}
              time={task.time}
              status={mapStatusToType(task.status)}
              assignee={task.assignee}
              onExpand={() => console.log(`Expand task ${task.id}`)}
            />
          ))}
          
          {tasks.length === 0 && (
            <div className="col-span-2 p-4 text-center text-muted-foreground">
              No tasks assigned
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
