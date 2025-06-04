
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  AlertTriangle, 
  Calendar, 
  Clock, 
  TrendingUp,
  UserCheck,
  Phone,
  Mail
} from "lucide-react";
import { notificationService } from "@/services/notificationService";
import { Patient } from "@/types/patient";
import { toast } from "sonner";

interface PatientRiskWidgetProps {
  patientId: string;
  showActions?: boolean;
}

export function PatientRiskWidget({ patientId, showActions = true }: PatientRiskWidgetProps) {
  const [riskAssessment, setRiskAssessment] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRiskAssessment = () => {
      const assessment = notificationService.getPatientRiskAssessment(patientId);
      setRiskAssessment(assessment);
      setLoading(false);
    };

    loadRiskAssessment();
  }, [patientId]);

  const handleScheduleFollowUp = () => {
    toast.success(`Follow-up scheduled for ${riskAssessment.patient.name}`);
  };

  const handleContactPatient = (method: 'phone' | 'email') => {
    toast.success(`${method === 'phone' ? 'Calling' : 'Emailing'} ${riskAssessment.patient.name}`);
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-900"></div>
            <span className="text-sm">Loading risk assessment...</span>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!riskAssessment) {
    return (
      <Card>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground">Risk assessment not available</p>
        </CardContent>
      </Card>
    );
  }

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'High': return 'bg-red-100 text-red-800';
      case 'Medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-green-100 text-green-800';
    }
  };

  const getRiskIcon = (level: string) => {
    switch (level) {
      case 'High': return <AlertTriangle className="h-4 w-4" />;
      case 'Medium': return <Clock className="h-4 w-4" />;
      default: return <UserCheck className="h-4 w-4" />;
    }
  };

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-lg flex items-center gap-2">
          <TrendingUp className="h-5 w-5" />
          Risk Assessment
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Badge className={getRiskColor(riskAssessment.riskLevel)}>
              {getRiskIcon(riskAssessment.riskLevel)}
              {riskAssessment.riskLevel} Risk
            </Badge>
            <span className="text-sm text-muted-foreground">
              Score: {riskAssessment.riskScore}/10
            </span>
          </div>
        </div>

        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Risk Score</span>
            <span>{riskAssessment.riskScore}/10</span>
          </div>
          <Progress value={riskAssessment.riskScore * 10} className="h-2" />
        </div>

        {riskAssessment.isFollowUpOverdue && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Follow-up appointment is overdue. Recommended follow-up: 
              {riskAssessment.recommendedFollowUpDays} days.
            </AlertDescription>
          </Alert>
        )}

        <div className="text-sm space-y-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Recommended Follow-up:</span>
            <span className="font-medium">
              {riskAssessment.recommendedFollowUpDays} days
            </span>
          </div>
        </div>

        {showActions && (
          <div className="flex gap-2 pt-2">
            <Button 
              size="sm" 
              variant="outline" 
              onClick={handleScheduleFollowUp}
              className="flex-1"
            >
              <Calendar className="h-3 w-3 mr-1" />
              Schedule
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleContactPatient('phone')}
            >
              <Phone className="h-3 w-3" />
            </Button>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => handleContactPatient('email')}
            >
              <Mail className="h-3 w-3" />
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
