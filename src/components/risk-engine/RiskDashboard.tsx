
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  AlertTriangle, 
  Bell, 
  Calendar, 
  Users, 
  TrendingUp, 
  Clock,
  Phone,
  Mail,
  UserCheck,
  RefreshCw
} from "lucide-react";
import { notificationService, ScheduledNotification } from "@/services/notificationService";
import { Patient } from "@/types/patient";
import { Link } from "react-router-dom";
import { toast } from "sonner";

interface RiskAlert {
  patient: Patient;
  riskScore: number;
  alerts: string[];
  recommendedActions: string[];
}

export function RiskDashboard() {
  const [riskAlerts, setRiskAlerts] = useState<RiskAlert[]>([]);
  const [upcomingNotifications, setUpcomingNotifications] = useState<ScheduledNotification[]>([]);
  const [notificationHistory, setNotificationHistory] = useState<ScheduledNotification[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    try {
      const alerts = notificationService.analyzePatientRisks();
      const upcoming = notificationService.getUpcomingNotifications();
      const history = notificationService.getNotificationHistory();
      
      setRiskAlerts(alerts);
      setUpcomingNotifications(upcoming);
      setNotificationHistory(history);
    } catch (error) {
      console.error('Error loading risk data:', error);
      toast.error('Failed to load risk analysis data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
    
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleScheduleNotifications = () => {
    try {
      notificationService.scheduleAppointmentNotifications();
      toast.success('Appointment notifications scheduled successfully');
      loadData();
    } catch (error) {
      console.error('Error scheduling notifications:', error);
      toast.error('Failed to schedule notifications');
    }
  };

  const handleTestNotifications = () => {
    notificationService.triggerNotificationCheck();
    toast.success('Notification check triggered');
    setTimeout(loadData, 1000);
  };

  const getRiskColor = (score: number) => {
    if (score > 7) return 'text-red-600 bg-red-50';
    if (score > 4) return 'text-yellow-600 bg-yellow-50';
    return 'text-green-600 bg-green-50';
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-blue-100 text-blue-800';
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          <span>Loading risk analysis...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Predictive Risk & Follow-up Engine</h1>
          <p className="text-muted-foreground">
            Monitor patient risks and automate follow-up notifications
          </p>
        </div>
        <div className="flex gap-2">
          <Button onClick={handleScheduleNotifications} variant="outline">
            <Calendar className="h-4 w-4 mr-2" />
            Schedule Notifications
          </Button>
          <Button onClick={handleTestNotifications} variant="outline">
            <Bell className="h-4 w-4 mr-2" />
            Test Notifications
          </Button>
          <Button onClick={loadData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-red-500" />
              <div>
                <p className="text-sm font-medium">High Risk Patients</p>
                <p className="text-2xl font-bold">
                  {riskAlerts.filter(alert => alert.riskScore > 7).length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-yellow-500" />
              <div>
                <p className="text-sm font-medium">Total Risk Alerts</p>
                <p className="text-2xl font-bold">{riskAlerts.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-500" />
              <div>
                <p className="text-sm font-medium">Upcoming Notifications</p>
                <p className="text-2xl font-bold">{upcomingNotifications.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium">Notifications Sent</p>
                <p className="text-2xl font-bold">{notificationHistory.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="risk-alerts" className="space-y-4">
        <TabsList>
          <TabsTrigger value="risk-alerts">Risk Alerts</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        <TabsContent value="risk-alerts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                Patient Risk Alerts
              </CardTitle>
              <CardDescription>
                Patients requiring immediate attention or follow-up
              </CardDescription>
            </CardHeader>
            <CardContent>
              {riskAlerts.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No risk alerts at this time
                </p>
              ) : (
                <div className="space-y-4">
                  {riskAlerts.map((alert, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-3">
                        <div className="flex items-center gap-3">
                          <Link 
                            to={`/patients/${alert.patient.id}`}
                            className="text-lg font-semibold hover:underline"
                          >
                            {alert.patient.name || `${alert.patient.firstName} ${alert.patient.lastName}`}
                          </Link>
                          <Badge className={getRiskColor(alert.riskScore)}>
                            Risk Score: {alert.riskScore}/10
                          </Badge>
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Age: {alert.patient.age} • {alert.patient.gender}
                        </div>
                      </div>

                      <div className="mb-3">
                        <Progress value={alert.riskScore * 10} className="h-2" />
                      </div>

                      <div className="space-y-2">
                        <div>
                          <h4 className="font-medium text-sm mb-1">Alerts:</h4>
                          {alert.alerts.map((alertText, i) => (
                            <Alert key={i} className="mb-2">
                              <AlertTriangle className="h-4 w-4" />
                              <AlertDescription>{alertText}</AlertDescription>
                            </Alert>
                          ))}
                        </div>

                        <div>
                          <h4 className="font-medium text-sm mb-1">Recommended Actions:</h4>
                          <ul className="text-sm text-muted-foreground space-y-1">
                            {alert.recommendedActions.map((action, i) => (
                              <li key={i} className="flex items-center gap-2">
                                <UserCheck className="h-3 w-3" />
                                {action}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Upcoming Notifications
              </CardTitle>
              <CardDescription>
                Scheduled appointment reminders and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {upcomingNotifications.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No upcoming notifications scheduled
                </p>
              ) : (
                <div className="space-y-3">
                  {upcomingNotifications.slice(0, 10).map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          <Badge variant="outline">{notification.type}</Badge>
                        </div>
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          Scheduled for: {notification.scheduledFor.toLocaleString()}
                        </p>
                      </div>
                      <div className="flex gap-1">
                        {notification.type === 'email' && <Mail className="h-4 w-4 text-muted-foreground" />}
                        {notification.type === 'sms' && <Phone className="h-4 w-4 text-muted-foreground" />}
                        {notification.type === 'system' && <Bell className="h-4 w-4 text-muted-foreground" />}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notification History
              </CardTitle>
              <CardDescription>
                Previously sent notifications and alerts
              </CardDescription>
            </CardHeader>
            <CardContent>
              {notificationHistory.length === 0 ? (
                <p className="text-center text-muted-foreground py-8">
                  No notifications sent yet
                </p>
              ) : (
                <div className="space-y-3">
                  {notificationHistory.slice(-20).reverse().map((notification) => (
                    <div key={notification.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          <Badge className={getPriorityColor(notification.priority)}>
                            {notification.priority}
                          </Badge>
                          <Badge variant="outline">{notification.type}</Badge>
                          <Badge variant="secondary">Sent</Badge>
                        </div>
                        <p className="text-sm">{notification.message}</p>
                        <p className="text-xs text-muted-foreground">
                          Sent: {notification.scheduledFor.toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
