
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { 
  Pill, 
  FileText, 
  ClipboardCheck, 
  AlertCircle, 
  RotateCcw, 
  ShieldAlert 
} from "lucide-react";
import { PrescriptionBuilder } from "@/components/prescriptions/PrescriptionBuilder";
import { InteractionChecker } from "@/components/prescriptions/InteractionChecker";
import { PrescriptionQueue } from "@/components/prescriptions/PrescriptionQueue";
import { RefillRequests } from "@/components/prescriptions/RefillRequests";
import { ControlledSubstances } from "@/components/prescriptions/ControlledSubstances";

export default function EPrescribing() {
  const [activeTab, setActiveTab] = useState("prescription-builder");
  
  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="E-Prescribing" 
          description="Electronic prescription management, drug interaction checks, and medication tracking"
        />
        
        <div className="grid grid-cols-1 gap-6">
          <Tabs
            value={activeTab}
            onValueChange={setActiveTab}
            className="space-y-6"
          >
            <TabsList className="grid grid-cols-5">
              <TabsTrigger value="prescription-builder">
                <Pill className="h-4 w-4 mr-2" />
                Prescription Builder
              </TabsTrigger>
              <TabsTrigger value="interaction-checker">
                <AlertCircle className="h-4 w-4 mr-2" />
                Interaction Checker
              </TabsTrigger>
              <TabsTrigger value="prescription-queue">
                <FileText className="h-4 w-4 mr-2" />
                Rx Queue
              </TabsTrigger>
              <TabsTrigger value="refill-requests">
                <RotateCcw className="h-4 w-4 mr-2" />
                Refill Requests
              </TabsTrigger>
              <TabsTrigger value="controlled-substances">
                <ShieldAlert className="h-4 w-4 mr-2" />
                Controlled Substances
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="prescription-builder" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Prescription Builder</CardTitle>
                  <CardDescription>
                    Create and manage prescriptions with pre-populated drug lists, dosage calculators, and auto-complete
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PrescriptionBuilder />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="interaction-checker" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Drug Interaction & Allergy Checker</CardTitle>
                  <CardDescription>
                    Get real-time alerts if a new prescription conflicts with existing medications or recorded allergies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <InteractionChecker />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="prescription-queue" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Prescription Queue</CardTitle>
                  <CardDescription>
                    View and manage prescriptions ready to be sent to pharmacies
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PrescriptionQueue />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="refill-requests" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Refill Requests</CardTitle>
                  <CardDescription>
                    Manage and process medication refill and renewal requests
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <RefillRequests />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="controlled-substances" className="space-y-6">
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle>Controlled Substance Tracking</CardTitle>
                  <CardDescription>
                    Monitor and track controlled substance prescriptions with PDMP integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <ControlledSubstances />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </PageContainer>
  );
}
