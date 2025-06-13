
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { SidebarProvider } from '@/components/layout/SidebarProvider';
import Dashboard from '@/pages/Dashboard';
import Patients from '@/pages/Patients';
import PatientProfile from '@/pages/PatientProfile';
import Appointments from '@/pages/Appointments';
import AIAnalytics from '@/pages/AIAnalytics';
import EPrescribing from '@/pages/EPrescribing';
import Settings from '@/pages/Settings';
import DeepAIAudioNotes from '@/pages/DeepAIAudioNotes';
import RecordingSession from '@/pages/RecordingSession';
import NotFound from '@/pages/NotFound';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

function App() {
  return (
    <Router>
      <SidebarProvider>
        <div className="flex min-h-screen w-full">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/patients" element={<Patients />} />
            <Route path="/patients/:id" element={<PatientProfile />} />
            <Route path="/appointments" element={<Appointments />} />
            <Route path="/deepai-audio-notes" element={<DeepAIAudioNotes />} />
            <Route path="/recording-session" element={<RecordingSession />} />
            <Route path="/ai-analytics" element={<AIAnalytics />} />
            <Route path="/e-prescribing" element={<EPrescribing />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </div>
      </SidebarProvider>
    </Router>
  );
}

export default App;
