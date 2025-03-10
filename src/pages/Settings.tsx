
import { useState } from "react";
import { PageContainer } from "@/components/layout/PageContainer";
import { PageHeader } from "@/components/layout/PageHeader";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { toast } from "sonner";
import { 
  User, 
  Building2, 
  Bell, 
  Shield, 
  Palette, 
  Save,
  CheckCircle
} from "lucide-react";

export default function Settings() {
  const [activeTab, setActiveTab] = useState("profile");
  
  const handleSave = () => {
    toast.success("Settings saved successfully", {
      description: "Your changes have been saved.",
      icon: <CheckCircle className="h-4 w-4 text-green-500" />,
    });
  };

  return (
    <PageContainer>
      <div className="p-6 space-y-6">
        <PageHeader 
          title="Settings" 
          description="Manage your account preferences"
        />
        
        <Tabs 
          defaultValue="profile" 
          className="animate-fadeIn"
          onValueChange={setActiveTab}
        >
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-8">
            <TabsList className="grid w-full sm:w-auto sm:grid-cols-1 h-auto gap-2">
              <TabsTrigger 
                value="profile" 
                className="flex items-center justify-start py-2 px-4 h-auto"
              >
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </TabsTrigger>
              <TabsTrigger 
                value="practice" 
                className="flex items-center justify-start py-2 px-4 h-auto"
              >
                <Building2 className="mr-2 h-4 w-4" />
                <span>Practice</span>
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="flex items-center justify-start py-2 px-4 h-auto"
              >
                <Bell className="mr-2 h-4 w-4" />
                <span>Notifications</span>
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="flex items-center justify-start py-2 px-4 h-auto"
              >
                <Shield className="mr-2 h-4 w-4" />
                <span>Security</span>
              </TabsTrigger>
              <TabsTrigger 
                value="appearance" 
                className="flex items-center justify-start py-2 px-4 h-auto"
              >
                <Palette className="mr-2 h-4 w-4" />
                <span>Appearance</span>
              </TabsTrigger>
            </TabsList>
            
            <div className="flex-1">
              <TabsContent value="profile" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Profile Information</CardTitle>
                    <CardDescription>
                      Manage your personal information
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input id="firstName" defaultValue="Jennifer" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input id="lastName" defaultValue="Davis" />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input id="email" type="email" defaultValue="jennifer.davis@example.com" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" defaultValue="(555) 123-4567" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="specialty">Specialty</Label>
                      <Select defaultValue="family-medicine">
                        <SelectTrigger id="specialty">
                          <SelectValue placeholder="Select specialty" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="family-medicine">Family Medicine</SelectItem>
                          <SelectItem value="internal-medicine">Internal Medicine</SelectItem>
                          <SelectItem value="pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="cardiology">Cardiology</SelectItem>
                          <SelectItem value="dermatology">Dermatology</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Professional Bio</Label>
                      <textarea 
                        id="bio" 
                        className="flex w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                        rows={4}
                        defaultValue="Board-certified family medicine physician with over 10 years of experience in primary care, preventive medicine, and chronic disease management."
                      />
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="practice" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Practice Settings</CardTitle>
                    <CardDescription>
                      Configure your practice details
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="practiceName">Practice Name</Label>
                      <Input id="practiceName" defaultValue="HealthFirst Medical Group" />
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="practicePhone">Phone</Label>
                        <Input id="practicePhone" defaultValue="(555) 987-6543" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="practiceFax">Fax</Label>
                        <Input id="practiceFax" defaultValue="(555) 987-6544" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="practiceAddress">Address</Label>
                      <Input id="practiceAddress" defaultValue="123 Medical Center Blvd" />
                    </div>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="practiceCity">City</Label>
                        <Input id="practiceCity" defaultValue="San Francisco" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="practiceState">State</Label>
                        <Input id="practiceState" defaultValue="CA" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="practiceZip">Zip Code</Label>
                        <Input id="practiceZip" defaultValue="94107" />
                      </div>
                    </div>
                    
                    <div className="flex justify-end">
                      <Button onClick={handleSave}>
                        <Save className="mr-2 h-4 w-4" />
                        Save Changes
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="notifications" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                    <CardDescription>
                      Manage how you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      This section is coming soon
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="security" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Security Settings</CardTitle>
                    <CardDescription>
                      Manage your account security
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      This section is coming soon
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
              
              <TabsContent value="appearance" className="mt-0">
                <Card>
                  <CardHeader>
                    <CardTitle>Appearance Settings</CardTitle>
                    <CardDescription>
                      Customize how the application looks
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center py-8 text-muted-foreground">
                      This section is coming soon
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </div>
        </Tabs>
      </div>
    </PageContainer>
  );
}
