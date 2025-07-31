
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/layout/SidebarProvider';
import { Sidebar } from '@/components/layout/Sidebar';
import { MobileHeader } from '@/components/layout/MobileHeader';
import { AuthProvider } from '@/contexts/AuthContext';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import PatientProfile from '@/pages/PatientProfile';
import Appointments from '@/pages/Appointments';
import AIAnalytics from '@/pages/AIAnalytics';
import EPrescribing from '@/pages/EPrescribing';
import Settings from '@/pages/Settings';
import DeepAIAudioNotes from '@/pages/DeepAIAudioNotes';
import RecordingSession from '@/pages/RecordingSession';
import Auth from '@/pages/Auth';
import NotFound from '@/pages/NotFound';
import { HealthcareChatbot } from '@/components/ai-analytics/HealthcareChatbot';
import { DocumentSummarizer } from '@/components/ai-analytics/DocumentSummarizer';
import { DocumentQA } from '@/components/ai-analytics/DocumentQA';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          <Route path="/auth" element={<Auth />} />
          <Route path="*" element={
            <ProtectedRoute>
              <SidebarProvider>
                <div className="flex min-h-screen w-full overflow-x-hidden">
                  <Sidebar />
                  <MobileHeader />
                  <main className="flex-1 w-full min-w-0 overflow-x-hidden">
                    <div className="md:ml-20 pt-16 md:pt-0 min-h-screen safe-area-top safe-area-bottom w-full">
                    <Routes>
                      <Route path="/" element={<Dashboard />} />
                      <Route path="/patients" element={<Patients />} />
                      <Route path="/patients/:id" element={<PatientProfile />} />
                      <Route path="/appointments" element={<Appointments />} />
                      <Route path="/deepai-audio-notes" element={<DeepAIAudioNotes />} />
                      <Route path="/recording-session" element={<RecordingSession />} />
                      <Route path="/ai-analytics" element={<AIAnalytics />} />
                      <Route path="/ai-analytics/healthcare-chat" element={<HealthcareChatbot />} />
                      <Route path="/ai-analytics/document-summary" element={<DocumentSummarizer />} />
                      <Route path="/ai-analytics/document-qa" element={<DocumentQA />} />
                      <Route path="/e-prescribing" element={<EPrescribing />} />
                      <Route path="/settings" element={<Settings />} />
                      <Route path="*" element={<NotFound />} />
                    </Routes>
                    </div>
                  </main>
                  <Toaster />
                </div>
              </SidebarProvider>
            </ProtectedRoute>
          } />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
