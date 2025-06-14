
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, MoreVertical, FileText } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const mockTemplates = [
  {
    id: "soap-general",
    name: "SOAP General",
    type: "Default Template",
    lastUpdated: "2025/06/10 11:05",
    sections: ["Subjective", "Objective", "Assessment", "Plan"]
  },
  {
    id: "soap-lite",
    name: "SOAP Lite",
    type: "Custom",
    lastUpdated: "2025/06/10 11:05",
    sections: ["Subjective", "Assessment", "Plan"]
  },
  {
    id: "soap-combined",
    name: "SOAP: Combined A&P",
    type: "Custom",
    lastUpdated: "2025/06/10 11:05",
    sections: ["Subjective", "Objective", "Assessment & Plan"]
  },
  {
    id: "soap-detailed",
    name: "SOAP Detailed",
    type: "Custom",
    lastUpdated: "2025/06/10 11:05",
    sections: ["Subjective", "Objective", "Assessment", "Plan", "Follow-up"]
  }
];

interface TemplateManagementProps {
  onSelectTemplate: (templateId: string) => void;
  selectedTemplate: string;
  onBackToSetup: () => void;
}

export function TemplateManagement({ onSelectTemplate, selectedTemplate, onBackToSetup }: TemplateManagementProps) {
  const { toast } = useToast();
  const [templates] = useState(mockTemplates);

  const handleTemplateSelect = (templateId: string) => {
    onSelectTemplate(templateId);
    toast({
      title: "Template Selected",
      description: "Template has been applied to your session",
    });
  };

  const handleCreateTemplate = () => {
    toast({
      title: "Create Template",
      description: "Template creation feature coming soon",
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">My Templates</h2>
          <p className="text-muted-foreground">Manage and customize your documentation templates</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onBackToSetup}>
            Back to Setup
          </Button>
          <Button onClick={handleCreateTemplate} className="bg-green-500 hover:bg-green-600">
            <Plus className="h-4 w-4 mr-2" />
            CREATE TEMPLATE
          </Button>
        </div>
      </div>

      <Card>
        <CardContent className="p-0">
          <div className="grid grid-cols-1 gap-0">
            {/* Header */}
            <div className="grid grid-cols-4 gap-4 p-4 border-b bg-gray-50 text-sm font-medium text-muted-foreground">
              <div>Template Name</div>
              <div>Last Updated</div>
              <div>Type</div>
              <div>More</div>
            </div>

            {/* Template Rows */}
            {templates.map((template) => (
              <div 
                key={template.id}
                className={`grid grid-cols-4 gap-4 p-4 border-b hover:bg-gray-50 cursor-pointer transition-colors ${
                  selectedTemplate === template.id ? 'bg-green-50 border-green-200' : ''
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span className="font-medium">{template.name}</span>
                  {template.type === "Default Template" && (
                    <Badge variant="secondary" className="text-xs">Default</Badge>
                  )}
                  {selectedTemplate === template.id && (
                    <Badge className="text-xs bg-green-100 text-green-800">Selected</Badge>
                  )}
                </div>
                <div className="text-sm text-muted-foreground">{template.lastUpdated}</div>
                <div className="text-sm">{template.type}</div>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm">
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="ghost" size="sm">
                    <MoreVertical className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Template Preview */}
      {selectedTemplate && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Template Preview: {templates.find(t => t.id === selectedTemplate)?.name}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Sections included:</h4>
                <div className="flex flex-wrap gap-2">
                  {templates.find(t => t.id === selectedTemplate)?.sections.map((section) => (
                    <Badge key={section} variant="outline">{section}</Badge>
                  ))}
                </div>
              </div>
              
              {selectedTemplate === 'soap-general' && (
                <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                  <h5 className="font-medium mb-2">Subjective</h5>
                  <p className="text-sm text-muted-foreground mb-4">
                    • Reason for Visit: Create a bullet item detailing the patient's reason for visiting, including specific symptoms or concerns. If not explicitly provided, leave blank.
                  </p>
                  <p className="text-sm text-muted-foreground">
                    • Chief Complaints: Create a bullet item capturing the chief complaints, including prominent symptoms and main concerns. Include details like duration, timing, and location. If not provided, leave blank.
                  </p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
