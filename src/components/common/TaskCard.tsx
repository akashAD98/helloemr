
import { cn } from "@/lib/utils";
import { StatusBadge } from "./StatusBadge";
import { Card, CardContent } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";

interface TaskCardProps {
  title: string;
  date: string;
  time: string;
  status: 'pending' | 'overdue' | 'booked' | 'completed' | 'unassigned';
  assignee?: string;
  onExpand?: () => void;
  className?: string;
}

export function TaskCard({ 
  title, 
  date, 
  time, 
  status, 
  assignee = 'Unassigned',
  onExpand,
  className 
}: TaskCardProps) {
  return (
    <Card 
      className={cn("card-hover", className)}
      onClick={onExpand}
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-4">
          <h3 className="text-sm font-medium flex-1">{title}</h3>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              onExpand?.();
            }}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </button>
        </div>
        
        <div className="flex justify-between items-end">
          <div className="text-xs text-gray-500">
            <div>{date}</div>
            <div>{time}</div>
          </div>
          
          <div className="flex flex-col items-end gap-1">
            <StatusBadge status={status} />
            <span className="text-xs text-gray-500">{assignee}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
