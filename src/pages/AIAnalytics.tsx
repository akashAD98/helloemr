
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InsightsDashboard } from "@/components/ai-analytics/InsightsDashboard";
import { UnifiedAIAssistant } from "@/components/ai-analytics/UnifiedAIAssistant";
import { RiskDashboard } from "@/components/risk-engine/RiskDashboard";

export default function AIAnalytics() {
  return (
    <PageContainer>
      <div className="space-y-6">
        <PageHeader 
          title="AI Analytics & Assistant" 
          description="Advanced analytics, AI assistance, and predictive risk assessment"
        />
        
        <Tabs defaultValue="ai-assistant" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="ai-assistant">AI Assistant</TabsTrigger>
            <TabsTrigger value="risk-engine">Risk Engine</TabsTrigger>
            <TabsTrigger value="insights">Health Insights</TabsTrigger>
          </TabsList>
          
          <TabsContent value="ai-assistant">
            <UnifiedAIAssistant />
          </TabsContent>
          
          <TabsContent value="risk-engine">
            <RiskDashboard />
          </TabsContent>
          
          <TabsContent value="insights">
            <InsightsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </PageContainer>
  );
}
