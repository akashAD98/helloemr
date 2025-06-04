
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsightsDashboard } from "@/components/ai-analytics/InsightsDashboard";
import { DocumentAnalyzer } from "@/components/ai-analytics/DocumentAnalyzer";
import { HealthAssistantChat } from "@/components/ai-analytics/HealthAssistantChat";
import { RiskDashboard } from "@/components/risk-engine/RiskDashboard";

export default function AIAnalytics() {
  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="AI Analytics & Risk Engine" 
          description="Advanced analytics, document processing, and predictive risk assessment"
        />
        
        <Tabs defaultValue="risk-engine" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="risk-engine">Risk Engine</TabsTrigger>
            <TabsTrigger value="insights">Health Insights</TabsTrigger>
            <TabsTrigger value="documents">Document Analysis</TabsTrigger>
            <TabsTrigger value="assistant">AI Assistant</TabsTrigger>
          </TabsList>
          
          <TabsContent value="risk-engine">
            <RiskDashboard />
          </TabsContent>
          
          <TabsContent value="insights">
            <InsightsDashboard />
          </TabsContent>
          
          <TabsContent value="documents">
            <DocumentAnalyzer />
          </TabsContent>
          
          <TabsContent value="assistant">
            <HealthAssistantChat />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
