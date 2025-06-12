
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Edit, Plus, Save, X } from "lucide-react";

interface Template {
  id: string;
  name: string;
  instructions: string;
  lastUpdated: string;
}

interface TemplateSelectorProps {
  selectedTemplate: string;
  onTemplateChange: (templateId: string, instructions: string) => void;
}

const defaultTemplates: Template[] = [
  {
    id: "soap-general",
    name: "SOAP General",
    instructions: "Create a comprehensive SOAP note including:\n1. Subjective: Patient's chief complaint and history\n2. Objective: Physical examination findings and vital signs\n3. Assessment: Clinical assessment and differential diagnosis\n4. Plan: Treatment plan and follow-up recommendations",
    lastUpdated: "2025/06/12 07:37"
  },
  {
    id: "soap-lite",
    name: "SOAP Lite",
    instructions: "Create a brief SOAP note focusing on:\n- Chief complaint\n- Key examination findings\n- Primary diagnosis\n- Treatment plan",
    lastUpdated: "2025/06/12 07:37"
  },
  {
    id: "soap-combined",
    name: "SOAP: Combined A&P",
    instructions: "Create a SOAP note with combined Assessment and Plan section:\n- Subjective findings\n- Objective examination\n- Combined Assessment & Plan with diagnosis and treatment",
    lastUpdated: "2025/06/12 07:37"
  },
  {
    id: "soap-detailed",
    name: "SOAP Detailed",
    instructions: "Create a detailed SOAP note with comprehensive sections including:\n- Detailed subjective history\n- Complete physical examination\n- Thorough assessment with differential\n- Detailed treatment plan with follow-up",
    lastUpdated: "2025/06/12 07:37"
  }
];

export function TemplateSelector({ selectedTemplate, onTemplateChange }: TemplateSelectorProps) {
  const [templates, setTemplates] = useState<Template[]>(defaultTemplates);
  const [isEditing, setIsEditing] = useState(false);
  const [editingTemplate, setEditingTemplate] = useState<Template | null>(null);
  const [customInstructions, setCustomInstructions] = useState("");
  const [showCreateNew, setShowCreateNew] = useState(false);
  const [newTemplateName, setNewTemplateName] = useState("");

  const currentTemplate = templates.find(t => t.id === selectedTemplate);

  const handleTemplateSelect = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (template) {
      onTemplateChange(templateId, template.instructions);
      setCustomInstructions(template.instructions);
    }
  };

  const handleEditTemplate = () => {
    if (currentTemplate) {
      setEditingTemplate(currentTemplate);
      setCustomInstructions(currentTemplate.instructions);
      setIsEditing(true);
    }
  };

  const handleSaveTemplate = () => {
    if (editingTemplate) {
      const updatedTemplates = templates.map(t => 
        t.id === editingTemplate.id 
          ? { ...t, instructions: customInstructions, lastUpdated: new Date().toLocaleString() }
          : t
      );
      setTemplates(updatedTemplates);
      onTemplateChange(editingTemplate.id, customInstructions);
      setIsEditing(false);
      setEditingTemplate(null);
    }
  };

  const handleCreateTemplate = () => {
    if (newTemplateName && customInstructions) {
      const newTemplate: Template = {
        id: `custom-${Date.now()}`,
        name: newTemplateName,
        instructions: customInstructions,
        lastUpdated: new Date().toLocaleString()
      };
      setTemplates([...templates, newTemplate]);
      onTemplateChange(newTemplate.id, newTemplate.instructions);
      setShowCreateNew(false);
      setNewTemplateName("");
      setCustomInstructions("");
    }
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingTemplate(null);
    setShowCreateNew(false);
    setCustomInstructions(currentTemplate?.instructions || "");
    setNewTemplateName("");
  };

  if (showCreateNew) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">Create New Template</h3>
              <Button variant="ghost" size="sm" onClick={cancelEdit}>
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="templateName">Template Name</Label>
              <Input
                id="templateName"
                value={newTemplateName}
                onChange={(e) => setNewTemplateName(e.target.value)}
                placeholder="Enter template name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="customInstructions">Custom Instructions</Label>
              <Textarea
                id="customInstructions"
                value={customInstructions}
                onChange={(e) => setCustomInstructions(e.target.value)}
                placeholder="Enter your custom instructions for note generation..."
                className="min-h-[200px]"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreateTemplate}>
                <Save className="h-4 w-4 mr-2" />
                Create Template
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                Cancel
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-6">
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium">Template Selection</h3>
            <Button variant="outline" size="sm" onClick={() => setShowCreateNew(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Template
            </Button>
          </div>

          <div className="space-y-2">
            <Label htmlFor="template">Select Template</Label>
            <Select value={selectedTemplate} onValueChange={handleTemplateSelect}>
              <SelectTrigger>
                <SelectValue placeholder="Choose a template" />
              </SelectTrigger>
              <SelectContent>
                {templates.map((template) => (
                  <SelectItem key={template.id} value={template.id}>
                    <div className="flex flex-col">
                      <span>{template.name}</span>
                      <span className="text-xs text-muted-foreground">
                        Updated: {template.lastUpdated}
                      </span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {currentTemplate && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="instructions">Template Instructions</Label>
                <Button variant="ghost" size="sm" onClick={handleEditTemplate}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </Button>
              </div>
              
              {isEditing ? (
                <div className="space-y-4">
                  <Textarea
                    value={customInstructions}
                    onChange={(e) => setCustomInstructions(e.target.value)}
                    className="min-h-[150px]"
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSaveTemplate}>
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button variant="outline" onClick={cancelEdit}>
                      Cancel
                    </Button>
                  </div>
                </div>
              ) : (
                <div className="p-3 bg-muted rounded-md text-sm whitespace-pre-line">
                  {currentTemplate.instructions}
                </div>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
