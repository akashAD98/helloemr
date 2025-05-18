
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Brain, FileText, MessageSquare, ArrowUp, ArrowDown } from "lucide-react";
import { HealthAssistantChat } from "@/components/ai-analytics/HealthAssistantChat";
import { DocumentAnalyzer } from "@/components/ai-analytics/DocumentAnalyzer";
import { InsightsDashboard } from "@/components/ai-analytics/InsightsDashboard";
import { Button } from "@/components/ui/button";

export default function AIAnalytics() {
  const [activeTab, setActiveTab] = useState("assistant");
  
  // Demo insights for the cards
  const insights = [
    { 
      title: "High Blood Pressure Cases",
      value: 28,
      change: 12,
      increase: true,
      description: "Percentage of patients with high blood pressure readings in the last 30 days"
    },
    { 
      title: "Diabetic Patients Under Control",
      value: 65,
      change: 5,
      increase: true,
      description: "Percentage of diabetic patients with HbA1c levels under 7% in the last quarter"
    },
    { 
      title: "Missed Appointments",
      value: 8,
      change: 3,
      increase: false,
      description: "Percentage decrease in missed appointments after implementing SMS reminders"
    }
  ];
  
  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="AI Analytics" 
          description="AI-powered tools to analyze patient data, medical documents, and generate clinical insights"
          actions={
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                Export Insights
              </Button>
              <Button size="sm">
                New Analysis
              </Button>
            </div>
          }
        />
        
        {/* Quick Insight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {insights.map((insight, index) => (
            <Card key={index} className="relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">{insight.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-baseline justify-between">
                  <div className="text-3xl font-bold">{insight.value}%</div>
                  <div className={`flex items-center ${insight.increase ? 'text-green-500' : 'text-red-500'}`}>
                    {insight.increase ? (
                      <ArrowUp className="h-4 w-4 mr-1" />
                    ) : (
                      <ArrowDown className="h-4 w-4 mr-1" />
                    )}
                    <span className="font-medium">{insight.change}%</span>
                  </div>
                </div>
                <p className="text-xs text-muted-foreground mt-2">{insight.description}</p>
              </CardContent>
              <div 
                className={`absolute bottom-0 left-0 w-full h-1 ${
                  insight.increase 
                    ? 'bg-gradient-to-r from-green-200 to-green-500'
                    : 'bg-gradient-to-r from-red-200 to-red-500'
                }`} 
              />
            </Card>
          ))}
        </div>
        
        <div className="grid grid-cols-1 gap-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-3">
              <TabsTrigger value="assistant">
                <MessageSquare className="h-4 w-4 mr-2" />
                Health Assistant
              </TabsTrigger>
              <TabsTrigger value="documents">
                <FileText className="h-4 w-4 mr-2" />
                Document Analysis
              </TabsTrigger>
              <TabsTrigger value="insights">
                <Brain className="h-4 w-4 mr-2" />
                AI Insights
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="assistant" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Health Assistant</CardTitle>
                  <CardDescription>
                    Chat with your intelligent health assistant about patient records, medical conditions, and treatment options
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <HealthAssistantChat />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="documents" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Document Analysis</CardTitle>
                  <CardDescription>
                    Upload medical documents, research papers, or patient records to get AI-generated summaries and insights
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <DocumentAnalyzer />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="insights" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>AI Insights</CardTitle>
                  <CardDescription>
                    Review AI-generated insights across your patient population to identify trends and improve care
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InsightsDashboard />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
}
