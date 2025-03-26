
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export type StatusType = 'pending' | 'overdue' | 'booked' | 'completed' | 'unassigned' | 'cancelled';

interface StatusBadgeProps {
  status: StatusType;
  className?: string;
  children?: ReactNode;
}

export function StatusBadge({ status, className, children }: StatusBadgeProps) {
  const getStatusClass = (status: StatusType) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return 'bg-amber-100 text-amber-800';
      case 'overdue':
        return 'bg-red-100 text-red-800';
      case 'booked':
        return 'bg-blue-100 text-blue-800';
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'cancelled':
        return 'bg-gray-300 text-gray-800';
      case 'unassigned':
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <span 
      className={cn(
        "px-2.5 py-0.5 rounded-full text-xs font-medium", 
        getStatusClass(status),
        className
      )}
    >
      {children || status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
}
