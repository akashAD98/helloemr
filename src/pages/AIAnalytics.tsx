
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { patients, tasks } from "@/data/mockData";
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, PieChart, Pie, Cell, LineChart, Line } from "recharts";
import { Brain, TrendingUp, User, Calendar, AlertCircle, Lightbulb, Notebook } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StatusBadge } from "@/components/common/StatusBadge";

// Generate diagnostic suggestion data
const diagnosticSuggestions = [
  { id: 1, condition: "Type 2 Diabetes", confidence: 92, patientId: "PT-3847", symptoms: ["Frequent urination", "Increased thirst", "Fatigue"], reasoning: "Patient showing classic symptoms and has elevated blood glucose levels in recent tests." },
  { id: 2, condition: "Hypertension", confidence: 88, patientId: "PT-2519", symptoms: ["Headaches", "Shortness of breath", "Nosebleeds"], reasoning: "Multiple blood pressure readings above 140/90 mmHg over several visits." },
  { id: 3, condition: "Allergic Rhinitis", confidence: 76, patientId: "PT-4023", symptoms: ["Sneezing", "Runny nose", "Itchy eyes"], reasoning: "Symptoms correlate with seasonal patterns and response to antihistamines." }
];

// Data for charts
const ageDistribution = [
  { name: '0-18', value: 87 },
  { name: '19-35', value: 152 },
  { name: '36-50', value: 195 },
  { name: '51-65', value: 136 },
  { name: '65+', value: 107 }
];

const conditionPrevalence = [
  { name: 'Hypertension', value: 124 },
  { name: 'Diabetes', value: 85 },
  { name: 'Asthma', value: 67 },
  { name: 'Arthritis', value: 56 },
  { name: 'Depression', value: 43 }
];

const readmissionRisk = [
  { name: 'Low', value: 65, fill: '#4ade80' },
  { name: 'Medium', value: 25, fill: '#fbbf24' },
  { name: 'High', value: 10, fill: '#f87171' }
];

const treatmentEfficacy = [
  { month: 'Jan', efficacy: 78 },
  { month: 'Feb', efficacy: 82 },
  { month: 'Mar', efficacy: 79 },
  { month: 'Apr', efficacy: 84 },
  { month: 'May', efficacy: 88 },
  { month: 'Jun', efficacy: 90 }
];

export default function AIAnalytics() {
  const [activeTab, setActiveTab] = useState("insights");

  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="AI Analytics" 
          description="AI-powered insights and predictions for patient care"
          actions={
            <Button>
              <Lightbulb className="mr-2 h-4 w-4" />
              Generate Report
            </Button>
          }
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="animate-slideUp">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Brain className="mr-2 h-5 w-5 text-medical-600" />
                Diagnostic Suggestions
              </CardTitle>
              <CardDescription>AI-assisted diagnosis predictions</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">37</div>
              <p className="text-xs text-muted-foreground mt-1">New suggestions this week</p>
            </CardContent>
          </Card>
          
          <Card className="animate-slideUp animation-delay-100">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <TrendingUp className="mr-2 h-5 w-5 text-medical-600" />
                Patient Outcomes
              </CardTitle>
              <CardDescription>Predicted improvement rates</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">84%</div>
              <p className="text-xs text-muted-foreground mt-1">12% higher than last quarter</p>
            </CardContent>
          </Card>
          
          <Card className="animate-slideUp animation-delay-200">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <AlertCircle className="mr-2 h-5 w-5 text-medical-600" />
                At-Risk Patients
              </CardTitle>
              <CardDescription>Requiring immediate attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">12</div>
              <p className="text-xs text-muted-foreground mt-1">3 high priority cases</p>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="insights" className="animate-fadeIn animation-delay-300">
          <TabsList>
            <TabsTrigger value="insights" onClick={() => setActiveTab("insights")}>Clinical Insights</TabsTrigger>
            <TabsTrigger value="predictions" onClick={() => setActiveTab("predictions")}>Predictions</TabsTrigger>
            <TabsTrigger value="demographics" onClick={() => setActiveTab("demographics")}>Demographics</TabsTrigger>
          </TabsList>
          
          <TabsContent value="insights" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Diagnostic Suggestions</CardTitle>
                  <CardDescription>AI-powered diagnostic possibilities</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {diagnosticSuggestions.map(suggestion => (
                    <div key={suggestion.id} className="border rounded-lg p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-medium">{suggestion.condition}</h3>
                          <p className="text-sm text-muted-foreground">Patient ID: {suggestion.patientId}</p>
                        </div>
                        <div className="bg-medical-100 text-medical-800 text-xs font-medium px-2.5 py-0.5 rounded-full">
                          {suggestion.confidence}% confidence
                        </div>
                      </div>
                      <div className="text-sm mb-2">
                        <span className="font-medium">Symptoms: </span>
                        {suggestion.symptoms.join(", ")}
                      </div>
                      <div className="text-sm text-muted-foreground">
                        <span className="font-medium">AI reasoning: </span>
                        {suggestion.reasoning}
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Treatment Efficacy</CardTitle>
                  <CardDescription>AI-predicted treatment outcomes</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ChartContainer 
                      config={{ 
                        efficacy: { color: "#0284c7" }
                      }}
                    >
                      <LineChart data={treatmentEfficacy}>
                        <XAxis dataKey="month" />
                        <YAxis />
                        <ChartTooltip
                          content={<ChartTooltipContent />}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="efficacy" 
                          name="efficacy" 
                          stroke="var(--color-efficacy, #0284c7)" 
                          strokeWidth={2} 
                        />
                      </LineChart>
                    </ChartContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="predictions" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Predictive Analytics</CardTitle>
                <CardDescription>AI-powered predictions for patient care</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Calendar className="mr-2 h-5 w-5 text-medical-600" />
                      Readmission Risk Analysis
                    </h3>
                    <div className="h-60">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={readmissionRisk}
                            cx="50%"
                            cy="50%"
                            labelLine={false}
                            outerRadius={80}
                            fill="#8884d8"
                            dataKey="value"
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                          >
                            {readmissionRisk.map((entry, index) => (
                              <Cell key={`cell-${index}`} fill={entry.fill} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  
                  <div className="border rounded-lg p-4">
                    <h3 className="text-lg font-medium mb-4 flex items-center">
                      <Notebook className="mr-2 h-5 w-5 text-medical-600" />
                      Appointment Scheduling Optimization
                    </h3>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Monday</span>
                        <div className="text-sm font-medium text-green-700">Optimal (87%)</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '87%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Tuesday</span>
                        <div className="text-sm font-medium text-green-700">Optimal (82%)</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '82%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Wednesday</span>
                        <div className="text-sm font-medium text-yellow-700">Moderate (65%)</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-yellow-400 h-2.5 rounded-full" style={{ width: '65%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Thursday</span>
                        <div className="text-sm font-medium text-green-700">Optimal (79%)</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-green-600 h-2.5 rounded-full" style={{ width: '79%' }}></div>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Friday</span>
                        <div className="text-sm font-medium text-red-700">Crowded (94%)</div>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2.5">
                        <div className="bg-red-500 h-2.5 rounded-full" style={{ width: '94%' }}></div>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="border rounded-lg p-4">
                  <h3 className="text-lg font-medium mb-4">Care Plan Recommendations</h3>
                  <div className="space-y-4">
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <h4 className="font-medium">Anil Kumar (PT-2519)</h4>
                          <StatusBadge status="pending">High Priority</StatusBadge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Hypertension, Type 2 Diabetes</p>
                        <div className="text-sm border-l-2 border-blue-500 pl-2">
                          <p>Based on recent blood work and vital trends, recommend adjusting medication dosage and increasing follow-up frequency to bi-weekly.</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-start gap-4">
                      <div className="bg-blue-100 p-2 rounded-full">
                        <User className="h-5 w-5 text-blue-700" />
                      </div>
                      <div>
                        <div className="flex justify-between">
                          <h4 className="font-medium">Priya Verma (PT-3104)</h4>
                          <StatusBadge status="pending">Medium Priority</StatusBadge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">Asthma, Seasonal Allergies</p>
                        <div className="text-sm border-l-2 border-blue-500 pl-2">
                          <p>Environmental triggers detected in patient history. Recommend allergy panel and preventative inhaler adjustment before allergy season.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="demographics" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Age Distribution</CardTitle>
                  <CardDescription>Patient population by age group</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={ageDistribution}>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Bar dataKey="value" fill="#4ade80" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Condition Prevalence</CardTitle>
                  <CardDescription>Most common conditions</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={conditionPrevalence} layout="vertical">
                        <XAxis type="number" />
                        <YAxis type="category" dataKey="name" width={100} />
                        <Bar dataKey="value" fill="#0ea5e9" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
