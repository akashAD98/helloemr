
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StatusBadge } from "@/components/common/StatusBadge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown, ChevronRight, Edit } from "lucide-react";
import { Visit } from "@/types/visit";
import { VisitSummaryTab } from "./VisitSummaryTab";
import { VisitExamTab } from "./VisitExamTab";
import { VisitVitalsTab } from "./VisitVitalsTab";
import { VisitMedicationsTab } from "./VisitMedicationsTab";

interface VisitItemProps {
  visit: Visit;
  isExpanded: boolean;
  onToggle: () => void;
  onEditVisit?: (visitId: string) => void;
}

export function VisitItem({ visit, isExpanded, onToggle, onEditVisit }: VisitItemProps) {
  const [activeTab, setActiveTab] = useState('summary');

  // Helper function to determine status badge type
  const getStatusBadgeType = (status: string): "completed" | "pending" | "cancelled" | "overdue" => {
    switch(status.toLowerCase()) {
      case "completed": return "completed";
      case "scheduled": return "pending";
      case "cancelled": return "cancelled";
      case "in-session": return "overdue"; // Map in-session to overdue for visual distinction
      default: return "pending";
    }
  };

  return (
    <Collapsible 
      open={isExpanded}
      onOpenChange={onToggle}
      className="border rounded-md"
    >
      <CollapsibleTrigger className="flex items-center justify-between w-full p-4 text-left">
        <div className="flex items-center space-x-4">
          {isExpanded ? (
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          )}
          <div>
            <div className="font-medium">{visit.date}</div>
            <div className="text-sm text-muted-foreground">{visit.reason}</div>
          </div>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-right">
            <div>{visit.provider}</div>
          </div>
          <StatusBadge status={getStatusBadgeType(visit.status)}>
            {visit.status === "in-session" ? "In Session" : visit.status.charAt(0).toUpperCase() + visit.status.slice(1)}
          </StatusBadge>
        </div>
      </CollapsibleTrigger>
      
      <CollapsibleContent className="px-4 pb-4">
        <div className="flex justify-end mb-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onEditVisit && onEditVisit(visit.id)}
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Visit
          </Button>
        </div>
        
        <Tabs 
          defaultValue="summary" 
          value={activeTab}
          onValueChange={setActiveTab}
          className="w-full"
        >
          <TabsList className="grid grid-cols-4 mb-4">
            <TabsTrigger value="summary">Summary</TabsTrigger>
            <TabsTrigger value="exam">Examination</TabsTrigger>
            <TabsTrigger value="vitals">Vitals</TabsTrigger>
            <TabsTrigger value="meds">Medications</TabsTrigger>
          </TabsList>
          
          <TabsContent value="summary" className="mt-0">
            <VisitSummaryTab visit={visit} />
          </TabsContent>
          
          <TabsContent value="exam" className="mt-0">
            <VisitExamTab visit={visit} />
          </TabsContent>
          
          <TabsContent value="vitals" className="mt-0">
            <VisitVitalsTab visit={visit} />
          </TabsContent>
          
          <TabsContent value="meds" className="mt-0">
            <VisitMedicationsTab visit={visit} />
          </TabsContent>
        </Tabs>
      </CollapsibleContent>
    </Collapsible>
  );
}
