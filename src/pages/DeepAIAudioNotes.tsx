import { useState } from "react";
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

type ViewMode = "setup" | "templates";

export default function DeepAIAudioNotes() {
  const { toast } = useToast();
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

  const handleSaveAndProcess = () => {
    console.log("Save & Process clicked");
    console.log("Patient name:", patientName);
    console.log("Visit type:", visitType);
    
    if (!patientName || !visitType) {
      toast({
        title: "Missing Information",
        description: "Please fill in patient name and visit type to continue.",
        variant: "destructive"
      });
      return;
    }

    // Create session data with timestamp to ensure uniqueness
    const sessionData = {
      patientName,
      visitType,
      pronouns,
      noteLength,
      pastContext,
      template: selectedTemplate,
      customInstructions,
      timestamp: Date.now()
    };

    console.log("Storing session data:", sessionData);
    
    // Store data with a unique key
    const sessionKey = `recordingSessionData_${sessionData.timestamp}`;
    localStorage.setItem(sessionKey, JSON.stringify(sessionData));
    localStorage.setItem('currentSessionKey', sessionKey);
    console.log("Data stored in localStorage with key:", sessionKey);

    // Open new tab with recording session
    const recordingUrl = `/recording-session?sessionKey=${sessionKey}`;
    const newWindow = window.open(recordingUrl, '_blank');
    
    if (newWindow) {
      console.log("New tab opened successfully");
      
      // Wait a moment for the window to load, then send data via postMessage as backup
      setTimeout(() => {
        try {
          newWindow.postMessage({
            type: 'SESSION_DATA',
            data: sessionData
          }, window.location.origin);
          console.log("Session data sent via postMessage");
        } catch (error) {
          console.log("PostMessage failed, relying on localStorage");
        }
      }, 1000);
      
      toast({
        title: "Recording Session Started",
        description: "Recording session opened in new tab",
      });
    } else {
      // Fallback if popup is blocked
      toast({
        title: "Popup Blocked",
        description: "Please allow popups and try again, or use the recording session in a new tab.",
        variant: "destructive"
      });
    }
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

                  {/* Microphone Access Warning */}
                  <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
                    <div className="flex items-center gap-2 text-orange-800">
                      <span>⚠️</span>
                      <span className="text-sm">Microphone access needed. Click to enable or update settings.</span>
                    </div>
                  </div>

                  {/* Save & Process Button */}
                  <Button onClick={handleSaveAndProcess} className="w-full bg-green-500 hover:bg-green-600" size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    🎤 CAPTURE CONVERSATION
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
                    <span>Click "Capture Conversation" to start recording</span>
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
                    <span>The recording session will open in a new tab for easy switching</span>
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
      </div>
    </PageContainer>
  );
}
