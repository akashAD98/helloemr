import { useState, useEffect } from "react";
import { format } from "date-fns";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientCard } from "@/components/common/PatientCard";
import { TaskCard } from "@/components/common/TaskCard";
import { PlusCircle, Users, CheckCircle, Clock, Calendar, Activity, Bell, RefreshCw, LogOut } from "lucide-react";
import { dataStore } from "@/lib/dataStore";
import { tasks } from "@/data/mockData";
import { Patient } from "@/types/patient";
import { Appointment } from "@/data/mockData";
import { toast } from "sonner";
import { useAuth } from "@/contexts/AuthContext";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [patients, setPatients] = useState<Patient[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, signOut } = useAuth();

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [patientsData, appointmentsData] = await Promise.all([
        dataStore.getPatients(),
        dataStore.getAppointments()
      ]);
      
      setPatients(patientsData);
      setAppointments(appointmentsData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      toast.error('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleRefresh = async () => {
    await loadDashboardData();
    toast.success("Dashboard refreshed");
  };

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Signed out successfully");
    } catch (error) {
      console.error('Error signing out:', error);
      toast.error("Failed to sign out");
    }
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

  const userName = user?.user_metadata?.full_name || user?.email || "Doctor";

  return (
    <PageContainer>
      <div className="responsive-p responsive-gap space-y-4 sm:space-y-6">
        <PageHeader 
          title="Dashboard" 
          description={`Welcome back, ${userName}`}
          actions={
            <div className="flex flex-col xs:flex-row gap-2 w-full sm:w-auto">
              <Button variant="outline" onClick={handleRefresh} disabled={loading} className="touch-button w-full xs:w-auto">
                <RefreshCw className={`mr-2 h-4 w-4 ${loading ? 'animate-spin' : ''}`} />
                <span className="hidden sm:inline">Refresh</span>
                <span className="sm:hidden">Refresh</span>
              </Button>
              <Button variant="outline" onClick={handleSignOut} className="touch-button w-full xs:w-auto">
                <LogOut className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Sign Out</span>
                <span className="sm:hidden">Sign Out</span>
              </Button>
              <Button className="touch-button w-full xs:w-auto">
                <PlusCircle className="mr-2 h-4 w-4" />
                <span className="hidden sm:inline">New Patient</span>
                <span className="sm:hidden">New Patient</span>
              </Button>
            </div>
          }
        />

        {/* Today's Appointment Statistics */}
        <div className="grid grid-responsive-4 responsive-gap-sm">
          <Card className="animate-slideUp">
            <CardHeader className="pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="responsive-text-xs flex items-center gap-1 sm:gap-2">
                <Calendar className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600 flex-shrink-0" />
                <span className="hidden xs:inline">Today's Appointments</span>
                <span className="xs:hidden">Today</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Total scheduled for today</span>
                <span className="sm:hidden">Scheduled</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 md:p-6 md:pt-0">
              <div className="responsive-text-xl font-bold text-blue-600">{appointmentStats.total}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="hidden sm:inline">{format(new Date(), "EEEE, MMM d")}</span>
                <span className="sm:hidden">{format(new Date(), "MMM d")}</span>
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slideUp animation-delay-75">
            <CardHeader className="pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="responsive-text-xs flex items-center gap-1 sm:gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-yellow-600 flex-shrink-0" />
                <span>Pending</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Awaiting confirmation</span>
                <span className="sm:hidden">Awaiting</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 md:p-6 md:pt-0">
              <div className="responsive-text-xl font-bold text-yellow-600">{appointmentStats.pending}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="hidden sm:inline">Need to confirm</span>
                <span className="sm:hidden">To confirm</span>
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slideUp animation-delay-150">
            <CardHeader className="pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="responsive-text-xs flex items-center gap-1 sm:gap-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-green-600 flex-shrink-0" />
                <span>Completed</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Finished appointments</span>
                <span className="sm:hidden">Finished</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 md:p-6 md:pt-0">
              <div className="responsive-text-xl font-bold text-green-600">{appointmentStats.completed}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="hidden sm:inline">Successfully done</span>
                <span className="sm:hidden">Done</span>
              </p>
            </CardContent>
          </Card>

          <Card className="animate-slideUp animation-delay-225">
            <CardHeader className="pb-2 p-3 sm:p-4 md:p-6">
              <CardTitle className="responsive-text-xs flex items-center gap-1 sm:gap-2">
                <Activity className="h-4 w-4 sm:h-5 sm:w-5 text-red-600 flex-shrink-0" />
                <span>Ongoing</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">
                <span className="hidden sm:inline">Currently in progress</span>
                <span className="sm:hidden">Active</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="p-3 pt-0 sm:p-4 md:p-6 md:pt-0">
              <div className="responsive-text-xl font-bold text-red-600">{appointmentStats.ongoing}</div>
              <p className="text-xs text-muted-foreground mt-1">
                <span className="hidden sm:inline">Active now</span>
                <span className="sm:hidden">Now</span>
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-responsive-3 responsive-gap">
          <Card className="animate-slideUp">
            <CardHeader className="pb-2 responsive-p">
              <CardTitle className="responsive-text-sm flex items-center gap-2">
                <Users className="h-4 w-4 sm:h-5 sm:w-5 text-medical-600 flex-shrink-0" />
                <span>Active Patients</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Total active patients</CardDescription>
            </CardHeader>
            <CardContent className="responsive-p pt-0">
              <div className="responsive-text-xl font-bold">{patients.length}</div>
              <p className="text-xs text-muted-foreground mt-1">Current count</p>
            </CardContent>
          </Card>
          
          <Card className="animate-slideUp animation-delay-100">
            <CardHeader className="pb-2 responsive-p">
              <CardTitle className="responsive-text-sm flex items-center gap-2">
                <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5 text-medical-600 flex-shrink-0" />
                <span>Completed Tasks</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Tasks completed today</CardDescription>
            </CardHeader>
            <CardContent className="responsive-p pt-0">
              <div className="responsive-text-xl font-bold">16</div>
              <p className="text-xs text-muted-foreground mt-1">78% of daily tasks</p>
            </CardContent>
          </Card>
          
          <Card className="animate-slideUp animation-delay-200">
            <CardHeader className="pb-2 responsive-p">
              <CardTitle className="responsive-text-sm flex items-center gap-2">
                <Clock className="h-4 w-4 sm:h-5 sm:w-5 text-medical-600 flex-shrink-0" />
                <span className="hidden sm:inline">Next Appointment</span>
                <span className="sm:hidden">Next</span>
              </CardTitle>
              <CardDescription className="text-xs sm:text-sm">Coming up next</CardDescription>
            </CardHeader>
            <CardContent className="responsive-p pt-0">
              <div className="responsive-text-lg font-bold truncate">
                {todaysAppointments.length > 0 ? todaysAppointments[0]?.time || "None" : "None"}
              </div>
              <p className="text-xs text-muted-foreground mt-1 truncate">
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
            <TabsContent value="overview" className="space-y-4 sm:space-y-6">
              <div className="grid grid-responsive-2 responsive-gap">
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
                <CardContent className="space-y-4">
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
                    <p className="text-center text-muted-foreground py-4">No patients available</p>
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