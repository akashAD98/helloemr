
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientCard } from "@/components/common/PatientCard";
import { TaskCard } from "@/components/common/TaskCard";
import { PlusCircle, Users, CheckCircle, Clock } from "lucide-react";
import { patients, tasks } from "@/data/mockData";

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const recentPatients = patients.slice(0, 3);
  const pendingTasks = tasks.filter(task => task.status === "pending");
  const overdueTasks = tasks.filter(task => task.status === "overdue");

  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="Dashboard" 
          description="Welcome back, Dr. Davis"
          actions={
            <Button>
              <PlusCircle className="mr-2 h-4 w-4" />
              New Patient
            </Button>
          }
        />

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
              <div className="text-3xl font-bold">247</div>
              <p className="text-xs text-muted-foreground mt-1">+12 this month</p>
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
                Upcoming Appointments
              </CardTitle>
              <CardDescription>Scheduled for today</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">8</div>
              <p className="text-xs text-muted-foreground mt-1">Next at 10:30 AM</p>
            </CardContent>
          </Card>
        </div>

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
                      name={patient.name}
                      age={patient.age}
                      gender={patient.gender}
                      pronouns={patient.pronouns}
                      provider={patient.provider}
                    />
                  ))}
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
                    name={patient.name}
                    age={patient.age}
                    gender={patient.gender}
                    pronouns={patient.pronouns}
                    provider={patient.provider}
                  />
                ))}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
