
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardContent } from "@/components/ui/card";
import { TemplateSelector } from "@/components/deepai-audio/TemplateSelector";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { Save } from "lucide-react";

export default function DeepAIAudioNotes() {
  const { toast } = useToast();
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

    // Store session data in localStorage for the new tab
    const sessionData = {
      patientName,
      visitType,
      pronouns,
      noteLength,
      pastContext,
      template: selectedTemplate
    };

    console.log("Storing session data:", sessionData);
    localStorage.setItem('recordingSessionData', JSON.stringify(sessionData));
    console.log("Data stored in localStorage");

    // Open new tab with recording session
    const newTab = window.open('/recording-session', '_blank');
    console.log("New tab opened:", newTab);

    toast({
      title: "Session Prepared",
      description: "Recording session opened in new tab",
    });
  };

  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="DeepAI Audio Notes" 
          description="Configure your recording session settings"
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Template Selection */}
            <TemplateSelector
              selectedTemplate={selectedTemplate}
              onTemplateChange={handleTemplateChange}
            />

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
                        placeholder="Enter patient name"
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

                  {/* Save & Process Button */}
                  <Button onClick={handleSaveAndProcess} className="w-full" size="lg">
                    <Save className="h-4 w-4 mr-2" />
                    Save & Process
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
                    <span>Click "Save & Process" to open the recording interface</span>
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
