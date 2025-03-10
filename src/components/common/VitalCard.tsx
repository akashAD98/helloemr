
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface VitalCardProps {
  title: string;
  value: string | number;
  unit: string;
  date: string;
  secondary?: string;
  className?: string;
}

export function VitalCard({ 
  title,
  value,
  unit,
  date,
  secondary,
  className 
}: VitalCardProps) {
  return (
    <Card className={cn("", className)}>
      <CardContent className="p-3">
        <div className="flex flex-col">
          <h3 className="text-sm font-medium text-gray-700">{title}</h3>
          <div className="text-lg font-semibold mt-1">
            {value} <span className="text-sm font-normal">{unit}</span>
          </div>
          {secondary && (
            <div className="text-xs text-gray-500 mt-0.5">{secondary}</div>
          )}
          <div className="text-xs text-gray-500 mt-2">{date}</div>
        </div>
      </CardContent>
    </Card>
  );
}
