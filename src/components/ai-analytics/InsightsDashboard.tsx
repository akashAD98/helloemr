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
} from "recharts";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Brain, TrendingUp, Users, AlertTriangle } from "lucide-react";
import { cn } from "@/lib/utils";

// Mock data for charts
const diagnosisData = [
  { name: "Hypertension", value: 34 },
  { name: "Diabetes", value: 18 },
  { name: "Asthma", value: 12 },
  { name: "Arthritis", value: 9 },
  { name: "Anxiety", value: 14 },
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

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

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
    title: "Preventive Care Gap",
    description: "32 patients over 50 are due for colorectal cancer screening. This represents a 15% increase from last quarter.",
    tag: "Attention Required"
  },
  {
    id: "insight4",
    title: "Treatment Efficacy",
    description: "Patients on the combined therapy protocol show 22% better outcomes than those on standard protocols for similar conditions.",
    tag: "Positive Trend"
  }
];

export function InsightsDashboard() {
  const [timeRange, setTimeRange] = useState("6m");
  
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
        </CardContent>
      </Card>
    </div>
  );
}
