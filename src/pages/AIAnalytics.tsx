
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Brain, FileText, MessageSquare, Upload } from "lucide-react";
import { HealthAssistantChat } from "@/components/ai-analytics/HealthAssistantChat";
import { DocumentAnalyzer } from "@/components/ai-analytics/DocumentAnalyzer";
import { InsightsDashboard } from "@/components/ai-analytics/InsightsDashboard";

export default function AIAnalytics() {
  const [activeTab, setActiveTab] = useState("assistant");
  
  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="AI Analytics" 
          description="AI-powered tools to help analyze patient data and medical documents"
        />
        
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
                    Review AI-generated insights across all patient data to identify trends and improve care
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
