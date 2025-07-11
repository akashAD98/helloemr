import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { TemplateSelector } from "@/components/deepai-audio/TemplateSelector";
import { TemplateManagement } from "@/components/deepai-audio/TemplateManagement";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save, Settings, FileText, ArrowLeft } from "lucide-react";
import { DeepAIAudioForm } from "@/components/patient-details/forms/DeepAIAudioForm";

type ViewMode = "setup" | "templates";

export default function DeepAIAudioNotes() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const [viewMode, setViewMode] = useState<ViewMode>("setup");
  const [selectedTemplate, setSelectedTemplate] = useState("soap-general");
  const [customInstructions, setCustomInstructions] = useState("");
  
  // Patient information form state
  const [patientName, setPatientName] = useState("");
  const [visitType, setVisitType] = useState("");
  const [pronouns, setPronouns] = useState("");
  const [noteLength, setNoteLength] = useState("");
  const [pastContext, setPastContext] = useState("");

  const handleTemplateChange = (templateId: string, instructions: string) => {
    setSelectedTemplate(templateId);
    setCustomInstructions(instructions);
  };

  const handleManageTemplates = () => {
    setViewMode("templates");
  };

  const handleBackToSetup = () => {
    setViewMode("setup");
  };

  const handleProcessNext = () => {
    console.log("Process Next clicked");

    // Validate required fields
    if (!patientName.trim() || !visitType) {
      toast({
        title: "Missing Required Information",
        description: "Please fill in Patient Name and Visit Type before proceeding.",
        variant: "destructive"
      });
      return;
    }

    // Prepare session data
    const sessionData = {
      patientName,
      visitType,
      pronouns,
      noteLength,
      pastContext,
      template: selectedTemplate,
      customInstructions
    };

    console.log("Session data prepared:", sessionData);

    // Store session data in localStorage
    const sessionKey = `recording-session-${Date.now()}`;
    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    localStorage.setItem('currentSessionKey', sessionKey);

    // Navigate to recording session page
    navigate(`/recording-session?sessionKey=${sessionKey}`);

    toast({
      title: "Starting Recording Session",
      description: "Navigating to recording session...",
    });
  };

  if (viewMode === "templates") {
    return (
      <PageContainer>
        <div className="p-6">
          <TemplateManagement
            selectedTemplate={selectedTemplate}
            onSelectTemplate={setSelectedTemplate}
            onBackToSetup={handleBackToSetup}
          />
        </div>
      </PageContainer>
    );
  }

  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <div className="flex items-center justify-between">
          <PageHeader 
            title="DeepAI Audio Notes" 
            description="Configure your recording session settings"
          />
          <Button 
            variant="outline" 
            onClick={handleManageTemplates}
            className="flex items-center gap-2"
          >
            <FileText className="h-4 w-4" />
            My Templates
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Template Selection</h2>
                  <Button variant="outline" size="sm" onClick={handleManageTemplates}>
                    <Settings className="h-4 w-4 mr-2" />
                    Manage Templates
                  </Button>
                </div>
                <TemplateSelector
                  selectedTemplate={selectedTemplate}
                  onTemplateChange={handleTemplateChange}
                />
              </CardContent>
            </Card>

            {/* Patient Information Form */}
            <Card>
              <CardContent className="p-6">
                <h2 className="text-xl font-semibold mb-6">Patient Information</h2>
                
                <div className="space-y-6">
                  {/* Patient Information Form */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="patientName">Patient Name: *</Label>
                      <Input
                        id="patientName"
                        value={patientName}
                        onChange={(e) => setPatientName(e.target.value)}
                        placeholder="Search existing or create new"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="visitType">Visit Type: *</Label>
                      <Select value={visitType} onValueChange={setVisitType}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select visit type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="New Patient">New Patient</SelectItem>
                          <SelectItem value="Returning Patient">Returning Patient</SelectItem>
                          <SelectItem value="Follow-up">Follow-up</SelectItem>
                          <SelectItem value="Consultation">Consultation</SelectItem>
                          <SelectItem value="Emergency">Emergency</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="pronouns">Pronouns:</Label>
                      <Select value={pronouns} onValueChange={setPronouns}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select pronouns" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="He/Him">He/Him</SelectItem>
                          <SelectItem value="She/Her">She/Her</SelectItem>
                          <SelectItem value="They/Them">They/Them</SelectItem>
                          <SelectItem value="Unknown">Unknown</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="noteLength">Note Length:</Label>
                      <Select value={noteLength} onValueChange={setNoteLength}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select note length" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Brief">Brief</SelectItem>
                          <SelectItem value="Standard">Standard</SelectItem>
                          <SelectItem value="Detailed">Detailed</SelectItem>
                          <SelectItem value="Comprehensive">Comprehensive</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Past Context */}
                  <div className="space-y-2">
                    <Label htmlFor="pastContext">Past note or any context:</Label>
                    <Textarea
                      id="pastContext"
                      value={pastContext}
                      onChange={(e) => setPastContext(e.target.value)}
                      placeholder="Add any context that you want to be included in the notes. For example, the patient's chief complaint or any other relevant information."
                      className="min-h-[100px]"
                    />
                  </div>

                  {/* Process Next Button */}
                  <Button onClick={handleProcessNext} className="w-full bg-green-500 hover:bg-green-600" size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    🎤 PROCESS NEXT
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Setup Guide */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Setup Guide</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">1️⃣</span>
                    <span>Select your preferred documentation template</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">2️⃣</span>
                    <span>Fill in patient information (name and visit type required)</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600">3️⃣</span>
                    <span>Add any relevant context or background information</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600">4️⃣</span>
                    <span>Click "Process Next" to start the recording session</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Tips & Help */}
            <Card>
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4">Recording Tips</h3>
                <div className="space-y-3 text-sm text-muted-foreground">
                  <div className="flex items-start gap-2">
                    <span className="text-blue-600">💡</span>
                    <span>Ensure microphone access is enabled in your browser</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-green-600">🎯</span>
                    <span>Record in a quiet environment for best transcription quality</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-purple-600">📝</span>
                    <span>The recording session will navigate to a dedicated recording page</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-orange-600">🔄</span>
                    <span>You can customize templates to match your documentation style</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        <DeepAIAudioForm
          patientId={"patientId"}
          onSaveNote={(note) => {
            // handle the saved note, e.g., show a toast or update state
          }}
        />
      </div>
    </PageContainer>
  );
}
