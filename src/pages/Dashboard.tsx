import { useState, useEffect } from "react";
import { format } from "date-fns";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientCard } from "@/components/common/PatientCard";
import { TaskCard } from "@/components/common/TaskCard";
import { PlusCircle, Users, CheckCircle, Clock, Calendar, Activity, Bell, RefreshCw } from "lucide-react";
import { supabaseDataStore } from "@/lib/supabaseDataStore";
import { realtimeNotificationService } from "@/services/realtimeNotificationService";
import { tasks } from "@/data/mockData";
import { Patient } from "@/types/patient";
import { Appointment } from "@/data/mockData";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [notifications, setNotifications] = useState<any[]>([]);

  useEffect(() => {
    checkAuthAndLoadData();
    
    // Setup real-time subscriptions only after authentication
    const setupRealtimeSubscriptions = () => {
      // Initialize the notification service
      realtimeNotificationService.initialize();

      // Setup data store subscriptions
      supabaseDataStore.subscribeToChanges(() => {
        loadDashboardData();
      });
    };

    setupRealtimeSubscriptions();

    return () => {
      // Cleanup subscriptions on component unmount
      realtimeNotificationService.cleanup();
    };
  }, []);

  const checkAuthAndLoadData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      setIsAuthenticated(false);
      toast.error("Please sign in to view the dashboard");
      return;
    }
    
    setIsAuthenticated(true);
    await loadDashboardData();
  };

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      await supabaseDataStore.initialize();
      
      const [patientsData, appointmentsData, notificationsData] = await Promise.all([
        supabaseDataStore.getPatients(),
        supabaseDataStore.getAppointments(),
        realtimeNotificationService.getUserNotifications()
      ]);
      
      setPatients(patientsData);
      setAppointments(appointmentsData);
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await supabaseDataStore.refresh();
    await loadDashboardData();
    toast.success("Dashboard refreshed");
  };

  // Get today's appointments
  const today = format(new Date(), "yyyy-MM-dd");
  const todaysAppointments = appointments.filter(appointment => appointment.date === today);
  
  // Calculate appointment statistics for today
  const appointmentStats = {
    total: todaysAppointments.length,
    pending: todaysAppointments.filter(a => a.status === "pending").length,
    booked: todaysAppointments.filter(a => a.status === "booked").length,
    completed: todaysAppointments.filter(a => a.status === "completed").length,
    ongoing: todaysAppointments.filter(a => a.status === "booked" && isCurrentTimeSlot(a.time)).length
  };

  // Check if appointment is currently ongoing
  function isCurrentTimeSlot(appointmentTime: string): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    const currentMinute = now.getMinutes();
    const [time, period] = appointmentTime.split(' ');
    const [hour, minute] = time.split(':').map(Number);
    
    let appointmentHour = hour;
    if (period === 'PM' && hour !== 12) appointmentHour += 12;
    if (period === 'AM' && hour === 12) appointmentHour = 0;
    
    const appointmentStart = appointmentHour * 60 + minute;
    const currentTime = currentHour * 60 + currentMinute;
    
    return currentTime >= appointmentStart && currentTime <= appointmentStart + 30;
  }

  const recentPatients = patients.slice(0, 3);
  const pendingTasks = tasks.filter(task => task.status === "pending");
  const overdueTasks = tasks.filter(task => task.status === "overdue");
  const unreadNotifications = notifications.filter(n => !n.read_at);

  if (!isAuthenticated) {
    return (
      <PageContainer>
        <div className="p-6 space-y-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-xl font-semibold mb-4">Authentication Required</h2>
              <p className="text-muted-foreground">Please sign in to view the dashboard.</p>
            </CardContent>
          </Card>
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="Dashboard" 
          description="Welcome back, Dr. Jennifer Davis"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" onClick={handleRefresh} disabled={loading}>
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </Button>
              <Button>
                <PlusCircle className="mr-2 h-4 w-4" />
                New Patient
              </Button>
            </div>
          }
        />

        {unreadNotifications.length > 0 && (
          <Card className="border-orange-200 bg-orange-50">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center text-orange-800">
                <Bell className="mr-2 h-5 w-5" />
                New Notifications ({unreadNotifications.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {unreadNotifications.slice(0, 3).map((notification) => (
                <div key={notification.id} className="p-2 bg-white rounded border">
                  <p className="font-medium text-sm">{notification.title}</p>
                  <p className="text-xs text-muted-foreground">{notification.message}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        )}

        {/* Today's Appointment Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="animate-slideUp">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Calendar className="mr-2 h-5 w-5 text-blue-600" />
                Today's Appointments
              </CardTitle>
              <CardDescription>Total scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">{appointmentStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                {format(new Date(), "EEEE, MMM d")}
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slideUp animation-delay-75">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-yellow-600" />
                Pending
              </CardTitle>
              <CardDescription>Awaiting confirmation</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{appointmentStats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">Need to confirm</p>
            </CardContent>
          </Card>

          <Card className="animate-slideUp animation-delay-150">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-green-600" />
                Completed
              </CardTitle>
              <CardDescription>Finished appointments</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">{appointmentStats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">Successfully done</p>
            </CardContent>
          </Card>

          <Card className="animate-slideUp animation-delay-225">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Activity className="mr-2 h-5 w-5 text-red-600" />
                Ongoing
              </CardTitle>
              <CardDescription>Currently in progress</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-red-600">{appointmentStats.ongoing}</div>
              <p className="text-xs text-muted-foreground mt-1">Active now</p>
            </CardContent>
          </Card>
        </div>

        {/* Rest of dashboard content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-slideUp">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5 text-medical-600" />
                Active Patients
              </CardTitle>
              <CardDescription>Total active patients</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Real-time count</p>
            </CardContent>
          </Card>
          
          <Card className="animate-slideUp animation-delay-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <CheckCircle className="mr-2 h-5 w-5 text-medical-600" />
                Completed Tasks
              </CardTitle>
              <CardDescription>Tasks completed today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">16</div>
              <p className="text-xs text-muted-foreground mt-1">78% of daily tasks</p>
            </CardContent>
          </Card>
          
          <Card className="animate-slideUp animation-delay-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5 text-medical-600" />
                Next Appointment
              </CardTitle>
              <CardDescription>Coming up next</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">
                {todaysAppointments.length > 0 ? todaysAppointments[0]?.time || "None" : "None"}
              </div>
              <p className="text-xs text-muted-foreground mt-1">
                {todaysAppointments.length > 0 ? todaysAppointments[0]?.patientName || "No patient" : "No appointments today"}
              </p>
            </CardContent>
          </Card>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
            <p className="text-muted-foreground">Loading dashboard data...</p>
          </div>
        ) : (
          <Tabs defaultValue="overview" className="animate-fadeIn animation-delay-300">
            <TabsList>
              <TabsTrigger value="overview" onClick={() => setActiveTab("overview")}>Overview</TabsTrigger>
              <TabsTrigger value="tasks" onClick={() => setActiveTab("tasks")}>Tasks</TabsTrigger>
              <TabsTrigger value="patients" onClick={() => setActiveTab("patients")}>Patients</TabsTrigger>
            </TabsList>
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recent Patients</CardTitle>
                    <CardDescription>Recently accessed patient records</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {recentPatients.map(patient => (
                      <PatientCard
                        key={patient.id}
                        id={patient.id}
                        name={patient.name || `${patient.firstName} ${patient.lastName}` || "Unknown"}
                        age={patient.age || 0}
                        gender={patient.gender}
                        pronouns={patient.pronouns}
                        provider={patient.provider}
                      />
                    ))}
                    
                    {recentPatients.length === 0 && (
                      <p className="text-center text-muted-foreground py-4">No recent patients</p>
                    )}
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Tasks</CardTitle>
                    <CardDescription>Your pending and overdue tasks</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {overdueTasks.slice(0, 1).map(task => (
                      <TaskCard
                        key={task.id}
                        title={task.title}
                        date={task.date}
                        time={task.time}
                        status={task.status}
                        assignee={task.assignee}
                      />
                    ))}
                    
                    {pendingTasks.slice(0, 2).map(task => (
                      <TaskCard
                        key={task.id}
                        title={task.title}
                        date={task.date}
                        time={task.time}
                        status={task.status}
                        assignee={task.assignee}
                      />
                    ))}
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
            
            <TabsContent value="tasks" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>All Tasks</CardTitle>
                  <CardDescription>Manage your tasks and assignments</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {tasks.map(task => (
                    <TaskCard
                      key={task.id}
                      title={task.title}
                      date={task.date}
                      time={task.time}
                      status={task.status}
                      assignee={task.assignee}
                    />
                  ))}
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="patients" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Recent Patients</CardTitle>
                  <CardDescription>All your recently accessed patients</CardDescription>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {patients.map(patient => (
                    <PatientCard
                      key={patient.id}
                      id={patient.id}
                      name={patient.name || `${patient.firstName} ${patient.lastName}` || "Unknown"}
                      age={patient.age || 0}
                      gender={patient.gender}
                      pronouns={patient.pronouns}
                      provider={patient.provider}
                    />
                  ))}
                  
                  {patients.length === 0 && (
                    <p className="col-span-2 text-center text-muted-foreground py-4">No patients found</p>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>
    </PageContainer>
  );
}
