
import { format } from "date-fns";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Clock, CheckCircle, AlertCircle, Users, Activity, Calendar } from "lucide-react";

interface AppointmentStatsProps {
  stats: {
    total: number;
    pending: number;
    booked: number;
    completed: number;
    cancelled: number;
    ongoing: number;
  };
  selectedDate: Date;
}

export function AppointmentStats({ stats, selectedDate }: AppointmentStatsProps) {
  const isToday = format(selectedDate, "yyyy-MM-dd") === format(new Date(), "yyyy-MM-dd");

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="animate-slideUp">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center">
              <Calendar className="mr-2 h-4 w-4 text-blue-600" />
              {isToday ? "Today's Total" : "Total Appointments"}
            </span>
            <Badge variant="outline" className="ml-2">
              {stats.total}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
          <p className="text-xs text-muted-foreground">
            {isToday ? "Scheduled for today" : `For ${format(selectedDate, "MMM d")}`}
          </p>
        </CardContent>
      </Card>

      <Card className="animate-slideUp animation-delay-75">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center">
              <Clock className="mr-2 h-4 w-4 text-yellow-600" />
              Pending
            </span>
            <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
              {stats.pending}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-yellow-600">{stats.pending}</div>
          <p className="text-xs text-muted-foreground">
            Awaiting confirmation
          </p>
        </CardContent>
      </Card>

      <Card className="animate-slideUp animation-delay-150">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center">
              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
              Completed
            </span>
            <Badge variant="outline" className="ml-2 bg-green-50 text-green-700 border-green-200">
              {stats.completed}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-green-600">{stats.completed}</div>
          <p className="text-xs text-muted-foreground">
            Successfully finished
          </p>
        </CardContent>
      </Card>

      <Card className="animate-slideUp animation-delay-225">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center justify-between">
            <span className="flex items-center">
              <Activity className="mr-2 h-4 w-4 text-red-600" />
              {isToday ? "Ongoing" : "Booked"}
            </span>
            <Badge variant="outline" className="ml-2 bg-red-50 text-red-700 border-red-200">
              {isToday ? stats.ongoing : stats.booked}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <div className="text-2xl font-bold text-red-600">
            {isToday ? stats.ongoing : stats.booked}
          </div>
          <p className="text-xs text-muted-foreground">
            {isToday ? "Currently in progress" : "Confirmed appointments"}
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
