
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { FileText, Edit, Save, X, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Template {
  id: string;
  name: string;
  instructions: string;
  type: "Default Template" | "Custom";
  lastUpdated: string;
  sections: string[];
}

interface TemplateSwitcherProps {
  currentTemplate: string;
  onTemplateChange: (templateId: string, instructions: string) => void;
  children: React.ReactNode;
}

const defaultTemplates: Template[] = [
  {
    id: "soap-general",
    name: "SOAP General",
    type: "Default Template",
    lastUpdated: "2025/06/10 11:05",
    sections: ["Subjective", "Objective", "Assessment", "Plan"],
    instructions: "Create a comprehensive SOAP note including:\n1. Subjective: Patient's chief complaint and history\n2. Objective: Physical examination findings and vital signs\n3. Assessment: Clinical assessment and differential diagnosis\n4. Plan: Treatment plan and follow-up recommendations"
  },
  {
    id: "soap-lite",
    name: "SOAP Lite",
    type: "Custom",
    lastUpdated: "2025/06/10 11:05",
    sections: ["Subjective", "Assessment", "Plan"],
    instructions: "Create a brief SOAP note focusing on:\n- Chief complaint\n- Key examination findings\n- Primary diagnosis\n- Treatment plan"
  },
  {
    id: "soap-combined",
    name: "SOAP: Combined A&P",
    type: "Custom",
    lastUpdated: "2025/06/10 11:05",
    sections: ["Subjective", "Objective", "Assessment & Plan"],
    instructions: "Create a SOAP note with combined Assessment and Plan section:\n- Subjective findings\n- Objective examination\n- Combined Assessment & Plan with diagnosis and treatment"
  },
  {
    id: "soap-detailed",
    name: "SOAP Detailed",
    type: "Custom",
    lastUpdated: "2025/06/10 11:05",
    sections: ["Subjective", "Objective", "Assessment", "Plan", "Follow-up"],
    instructions: "Create a detailed SOAP note with comprehensive sections including:\n- Detailed subjective history\n- Complete physical examination\n- Thorough assessment with differential\n- Detailed treatment plan with follow-up"
  }
];

export function TemplateSwitcher({ currentTemplate, onTemplateChange, children }: TemplateSwitcherProps) {
  const { toast } = useToast();
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [selectedTemplate, setSelectedTemplate] = useState<string>(currentTemplate);
  const [editingTemplate, setEditingTemplate] = useState<string | null>(null);
  const [editInstructions, setEditInstructions] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onTemplateChange(templateId, template.instructions);
      toast({
        title: "Template Selected",
        description: `Switched to ${template.name}`,
      });
    }
  };

  const handleEditStart = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      setEditingTemplate(templateId);
      setEditInstructions(template.instructions);
    }
  };

  const handleEditSave = () => {
    if (editingTemplate) {
      const updatedTemplates = templates.map(t => 
        t.id === editingTemplate 
          ? { ...t, instructions: editInstructions, lastUpdated: new Date().toLocaleString() }
          : t
      );
      setTemplates(updatedTemplates);
      
      if (selectedTemplate === editingTemplate) {
        onTemplateChange(editingTemplate, editInstructions);
      }
      
      setEditingTemplate(null);
      toast({
        title: "Template Updated",
        description: "Template instructions have been saved",
      });
    }
  };

  const handleEditCancel = () => {
    setEditingTemplate(null);
    setEditInstructions("");
  };

  const currentTemplateData = templates.find(t => t.id === currentTemplate);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            My Templates
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Current Template Info */}
          <Card className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="text-lg flex items-center gap-2">
                <Check className="h-5 w-5 text-green-600" />
                Currently Selected: {currentTemplateData?.name}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2 mb-3">
                {currentTemplateData?.sections.map((section) => (
                  <Badge key={section} variant="outline" className="text-green-700 border-green-300">
                    {section}
                  </Badge>
                ))}
              </div>
              <p className="text-sm text-muted-foreground">
                Last updated: {currentTemplateData?.lastUpdated}
              </p>
            </CardContent>
          </Card>

          {/* Templates List */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Available Templates</h3>
            
            <div className="grid gap-4">
              {templates.map((template) => (
                <Card 
                  key={template.id} 
                  className={`transition-colors cursor-pointer ${
                    selectedTemplate === template.id ? 'border-green-500 bg-green-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => selectedTemplate !== template.id && handleTemplateSelect(template.id)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium">{template.name}</h4>
                          {template.type === "Default Template" && (
                            <Badge variant="secondary" className="text-xs">Default</Badge>
                          )}
                          {selectedTemplate === template.id && (
                            <Badge className="text-xs bg-green-100 text-green-800">Current</Badge>
                          )}
                        </div>
                        
                        <div className="flex flex-wrap gap-1 mb-2">
                          {template.sections.map((section) => (
                            <Badge key={section} variant="outline" className="text-xs">
                              {section}
                            </Badge>
                          ))}
                        </div>
                        
                        <p className="text-xs text-muted-foreground mb-3">
                          Last updated: {template.lastUpdated}
                        </p>

                        {/* Instructions */}
                        {editingTemplate === template.id ? (
                          <div className="space-y-3">
                            <Label htmlFor={`instructions-${template.id}`}>Template Instructions</Label>
                            <Textarea
                              id={`instructions-${template.id}`}
                              value={editInstructions}
                              onChange={(e) => setEditInstructions(e.target.value)}
                              className="min-h-[120px] text-sm"
                            />
                            <div className="flex gap-2">
                              <Button size="sm" onClick={handleEditSave}>
                                <Save className="h-3 w-3 mr-1" />
                                Save
                              </Button>
                              <Button size="sm" variant="outline" onClick={handleEditCancel}>
                                <X className="h-3 w-3 mr-1" />
                                Cancel
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="bg-muted rounded-md p-3">
                            <p className="text-sm whitespace-pre-line">
                              {template.instructions}
                            </p>
                          </div>
                        )}
                      </div>
                      
                      <div className="flex flex-col gap-2 ml-4">
                        {selectedTemplate !== template.id && (
                          <Button 
                            size="sm" 
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTemplateSelect(template.id);
                            }}
                            className="bg-green-500 hover:bg-green-600"
                          >
                            Select
                          </Button>
                        )}
                        
                        {editingTemplate !== template.id && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleEditStart(template.id);
                            }}
                          >
                            <Edit className="h-3 w-3 mr-1" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div className="flex justify-end gap-2 pt-4 border-t">
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
