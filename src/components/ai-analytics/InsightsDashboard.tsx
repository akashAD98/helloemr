
import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  ScatterChart,
  Scatter,
  ZAxis,
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Brain, TrendingUp, Users, AlertTriangle, MapPin, Calendar, BarChart4, PieChart as PieChartIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// Enhanced mock data for deeper analytics
const diagnosisData = [
  { name: "Hypertension", value: 34, ageGroup: "45-65" },
  { name: "Diabetes", value: 18, ageGroup: "35-65" },
  { name: "Asthma", value: 12, ageGroup: "20-50" },
  { name: "Arthritis", value: 9, ageGroup: "50+" },
  { name: "Anxiety", value: 14, ageGroup: "25-45" },
  { name: "Depression", value: 11, ageGroup: "20-45" },
  { name: "Obesity", value: 15, ageGroup: "30-60" },
];

const adherenceData = [
  { month: "Jan", adherence: 72 },
  { month: "Feb", adherence: 68 },
  { month: "Mar", adherence: 74 },
  { month: "Apr", adherence: 78 },
  { month: "May", adherence: 82 },
  { month: "Jun", adherence: 85 },
];

const outcomeData = [
  { name: "Blood Pressure", controlled: 65, uncontrolled: 35 },
  { name: "Blood Sugar", controlled: 58, uncontrolled: 42 },
  { name: "Cholesterol", controlled: 72, uncontrolled: 28 },
  { name: "Weight", controlled: 45, uncontrolled: 55 },
];

const patientDemographics = [
  { ageGroup: "0-18", count: 68 },
  { ageGroup: "19-35", count: 127 },
  { ageGroup: "36-50", count: 156 },
  { ageGroup: "51-65", count: 203 },
  { ageGroup: "66+", count: 184 },
];

const locationData = [
  { location: "Downtown", count: 156, mainDiagnosis: "Hypertension" },
  { location: "North District", count: 124, mainDiagnosis: "Diabetes" },
  { location: "West County", count: 187, mainDiagnosis: "Asthma" },
  { location: "East Village", count: 97, mainDiagnosis: "Obesity" },
  { location: "South Bay", count: 143, mainDiagnosis: "Anxiety" },
];

const seasonalTrends = [
  { month: "Jan", respiratoryIllness: 45, cardiacEvents: 32, mentalHealth: 24 },
  { month: "Feb", respiratoryIllness: 52, cardiacEvents: 28, mentalHealth: 26 },
  { month: "Mar", respiratoryIllness: 38, cardiacEvents: 29, mentalHealth: 29 },
  { month: "Apr", respiratoryIllness: 30, cardiacEvents: 30, mentalHealth: 32 },
  { month: "May", respiratoryIllness: 25, cardiacEvents: 33, mentalHealth: 35 },
  { month: "Jun", respiratoryIllness: 22, cardiacEvents: 35, mentalHealth: 38 },
  { month: "Jul", respiratoryIllness: 20, cardiacEvents: 38, mentalHealth: 42 },
  { month: "Aug", respiratoryIllness: 22, cardiacEvents: 36, mentalHealth: 40 },
  { month: "Sep", respiratoryIllness: 28, cardiacEvents: 34, mentalHealth: 36 },
  { month: "Oct", respiratoryIllness: 35, cardiacEvents: 32, mentalHealth: 33 },
  { month: "Nov", respiratoryIllness: 42, cardiacEvents: 30, mentalHealth: 30 },
  { month: "Dec", respiratoryIllness: 48, cardiacEvents: 34, mentalHealth: 28 },
];

const comorbidityData = [
  { 
    name: "Diabetes + Hypertension", 
    value: 43,
    correlationStrength: 0.78,
    ageGroup: "45-65"
  },
  { 
    name: "Anxiety + Depression", 
    value: 27,
    correlationStrength: 0.85,
    ageGroup: "25-45"
  },
  { 
    name: "COPD + Heart Disease", 
    value: 18,
    correlationStrength: 0.72,
    ageGroup: "60+"
  },
  { 
    name: "Obesity + Sleep Apnea", 
    value: 22,
    correlationStrength: 0.67,
    ageGroup: "35-55"
  },
  { 
    name: "Arthritis + Fibromyalgia", 
    value: 15,
    correlationStrength: 0.61,
    ageGroup: "50+"
  }
];

const totalPatientsSummary = {
  total: 738,
  active: 624,
  new30Days: 43,
  recurring: 581
};

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#82ca9d", "#ff7a45"];

const insights = [
  {
    id: "insight1",
    title: "Medication Adherence",
    description: "Patient medication adherence has improved by 13% over the last 6 months, correlating with better outcomes in hypertension management.",
    tag: "Positive Trend"
  },
  {
    id: "insight2",
    title: "Common Comorbidities",
    description: "83% of your diabetic patients also have hypertension. Consider integrated treatment plans for these patients.",
    tag: "Action Recommended"
  },
  {
    id: "insight3",
    title: "Geographic Health Patterns",
    description: "Patients from North District show 3x higher rates of respiratory conditions than other areas, possibly related to industrial proximity.",
    tag: "Attention Required"
  },
  {
    id: "insight4",
    title: "Treatment Efficacy",
    description: "Patients on the combined therapy protocol show 22% better outcomes than those on standard protocols for similar conditions.",
    tag: "Positive Trend"
  },
  {
    id: "insight5",
    title: "Seasonal Health Pattern",
    description: "Mental health consultations increase 28% during winter months. Consider additional resources during this period.",
    tag: "Action Recommended"
  },
  {
    id: "insight6",
    title: "Similar Cases Analysis",
    description: "Among similar diabetic patients aged 50-65, those following the new nutrition plan showed 17% better glucose control after 3 months.",
    tag: "Positive Trend"
  }
];

export function InsightsDashboard() {
  const [timeRange, setTimeRange] = useState("6m");
  const [analysisView, setAnalysisView] = useState("overview");
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h3 className="text-xl font-medium">AI-Generated Insights</h3>
          <p className="text-sm text-muted-foreground">
            Analytics and patterns detected across your patient population
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Select
            value={timeRange}
            onValueChange={setTimeRange}
          >
            <SelectTrigger className="w-[120px]">
              <SelectValue placeholder="Time Range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="1m">Last Month</SelectItem>
              <SelectItem value="3m">Last 3 Months</SelectItem>
              <SelectItem value="6m">Last 6 Months</SelectItem>
              <SelectItem value="1y">Last Year</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="sm">
            <Brain className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>
      
      {/* Patient Summary Card */}
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Patient Summary</CardTitle>
          <CardDescription>Total patient statistics</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <p className="text-sm text-blue-600 font-medium">Total Patients</p>
              <p className="text-2xl font-bold">{totalPatientsSummary.total}</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <p className="text-sm text-green-600 font-medium">Active Patients</p>
              <p className="text-2xl font-bold">{totalPatientsSummary.active}</p>
            </div>
            <div className="bg-amber-50 p-4 rounded-lg">
              <p className="text-sm text-amber-600 font-medium">New (30 days)</p>
              <p className="text-2xl font-bold">{totalPatientsSummary.new30Days}</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
              <p className="text-sm text-purple-600 font-medium">Recurring Patients</p>
              <p className="text-2xl font-bold">{totalPatientsSummary.recurring}</p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Analysis Views Tabs */}
      <Tabs value={analysisView} onValueChange={setAnalysisView} className="space-y-4">
        <TabsList className="grid grid-cols-4">
          <TabsTrigger value="overview">
            <BarChart4 className="h-4 w-4 mr-2" />
            Overview
          </TabsTrigger>
          <TabsTrigger value="demographics">
            <Users className="h-4 w-4 mr-2" />
            Demographics
          </TabsTrigger>
          <TabsTrigger value="geographic">
            <MapPin className="h-4 w-4 mr-2" />
            Geographic
          </TabsTrigger>
          <TabsTrigger value="trends">
            <TrendingUp className="h-4 w-4 mr-2" />
            Trends
          </TabsTrigger>
        </TabsList>
        
        {/* Overview Tab */}
        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Common Diagnoses</CardTitle>
                <CardDescription>Distribution across patient population</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={diagnosisData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {diagnosisData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Medication Adherence</CardTitle>
                <CardDescription>Trend over time</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={adherenceData}
                      margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="adherence" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card className="col-span-full md:col-span-1">
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Treatment Outcomes</CardTitle>
                <CardDescription>Controlled vs uncontrolled</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[250px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={outcomeData}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="controlled" stackId="a" fill="#82ca9d" />
                      <Bar dataKey="uncontrolled" stackId="a" fill="#ff8042" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Demographics Tab */}
        <TabsContent value="demographics" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Patient Age Distribution</CardTitle>
                <CardDescription>Breakdown by age groups</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={patientDemographics}
                      margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="ageGroup" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="count" fill="#8884d8" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">Common Comorbidities</CardTitle>
                <CardDescription>Frequently co-occurring conditions</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={comorbidityData}
                      layout="vertical"
                      margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis type="number" />
                      <YAxis type="category" dataKey="name" />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="value" fill="#82ca9d" name="Patient Count" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        {/* Geographic Tab */}
        <TabsContent value="geographic" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Patient Distribution by Location</CardTitle>
              <CardDescription>Regional health patterns and diagnoses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={locationData}
                    margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="location" angle={-45} textAnchor="end" height={70} />
                    <YAxis />
                    <Tooltip content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        return (
                          <div className="bg-white p-3 border rounded shadow-md">
                            <p className="font-medium">{payload[0].payload.location}</p>
                            <p>Patients: {payload[0].value}</p>
                            <p>Main Diagnosis: {payload[0].payload.mainDiagnosis}</p>
                          </div>
                        );
                      }
                      return null;
                    }} />
                    <Legend />
                    <Bar dataKey="count" name="Number of Patients" fill="#8884d8" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Trends Tab */}
        <TabsContent value="trends" className="space-y-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Seasonal Disease Patterns</CardTitle>
              <CardDescription>Monthly trends by condition category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={seasonalTrends}
                    margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="respiratoryIllness" stroke="#8884d8" name="Respiratory" />
                    <Line type="monotone" dataKey="cardiacEvents" stroke="#82ca9d" name="Cardiac" />
                    <Line type="monotone" dataKey="mentalHealth" stroke="#ffc658" name="Mental Health" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <h3 className="text-lg font-medium mt-6">Key Insights</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {insights.map(insight => (
          <Card key={insight.id}>
            <CardHeader className="pb-2">
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{insight.title}</CardTitle>
                <div className={cn(
                  "px-2 py-1 text-xs rounded-full",
                  insight.tag === "Positive Trend" && "bg-green-100 text-green-800",
                  insight.tag === "Action Recommended" && "bg-blue-100 text-blue-800",
                  insight.tag === "Attention Required" && "bg-amber-100 text-amber-800",
                )}>
                  {insight.tag}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm">{insight.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>
      
      <Card className="border-amber-200 bg-amber-50">
        <CardHeader className="pb-2">
          <div className="flex items-center">
            <AlertTriangle className="h-5 w-5 text-amber-500 mr-2" />
            <CardTitle className="text-base text-amber-800">AI Recommendation</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-amber-800">
            Based on treatment patterns and outcomes, consider adjusting the hypertension protocol for patients with diabetes to include ACE inhibitors as first-line therapy. Data suggests this could improve blood pressure control by approximately 18% in this patient group.
          </p>
          <div className="mt-3">
            <p className="text-sm text-amber-800 font-medium">Similar Case Reference:</p>
            <p className="text-sm text-amber-800">
              A cohort of 27 patients with similar profiles (diabetes + hypertension, age 50-65) showed significant improvement when this protocol adjustment was implemented at Central Medical last quarter.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
