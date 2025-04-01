
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { CheckCircle2, Clock, Plus } from "lucide-react";

type TaskStatus = 'pending' | 'overdue' | 'booked' | 'completed' | 'unassigned' | 'cancelled';

interface Task {
  id: string;
  title: string;
  date: string;
  time: string;
  status: TaskStatus;
  assignee?: string;
}

interface PatientTasksProps {
  tasks: Task[];
  onCreateTask?: () => void;
  onCompleteTask?: (taskId: string) => void;
}

export function PatientTasks({ 
  tasks,
  onCreateTask,
  onCompleteTask
}: PatientTasksProps) {
  
  // Helper function to determine status badge
  const getStatusBadge = (status: TaskStatus) => {
    switch(status) {
      case "completed":
        return <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
          <CheckCircle2 className="h-3 w-3 mr-1" />
          Completed
        </Badge>;
      case "overdue":
        return <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
          <Clock className="h-3 w-3 mr-1" />
          Overdue
        </Badge>;
      case "pending":
        return <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
          <Clock className="h-3 w-3 mr-1" />
          Pending
        </Badge>;
      case "cancelled":
        return <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
          Cancelled
        </Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-medium">Tasks</h3>
          <Button variant="outline" size="sm" onClick={onCreateTask}>
            <Plus className="h-4 w-4 mr-2" />
            Add Task
          </Button>
        </div>
        
        <div className="space-y-3">
          {tasks.map((task) => (
            <div 
              key={task.id} 
              className="border rounded-lg p-3 flex items-start gap-3"
            >
              <div className="flex-shrink-0 pt-1">
                <Checkbox 
                  id={`task-${task.id}`} 
                  checked={task.status === 'completed'}
                  onCheckedChange={() => {
                    if (onCompleteTask) onCompleteTask(task.id);
                  }}
                />
              </div>
              <div className="flex-grow">
                <div className="flex justify-between">
                  <div>
                    <label 
                      htmlFor={`task-${task.id}`}
                      className={`font-medium ${task.status === 'completed' ? 'line-through text-muted-foreground' : ''}`}
                    >
                      {task.title}
                    </label>
                    <div className="text-sm text-muted-foreground">{task.date} | {task.time}</div>
                  </div>
                  <div>{getStatusBadge(task.status)}</div>
                </div>
                {task.assignee && (
                  <div className="mt-1 text-xs text-muted-foreground">
                    Assigned to: {task.assignee}
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {tasks.length === 0 && (
            <div className="text-center py-6 text-muted-foreground">
              No tasks found for this patient
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
