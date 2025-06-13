
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { RecordingSession } from "@/components/deepai-audio/RecordingSession";

export default function RecordingSessionPage() {
  const navigate = useNavigate();
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("RecordingSession page loaded, checking for session data...");
    
    // Try to get session data from localStorage
    const storedData = localStorage.getItem('recordingSessionData');
    console.log("Stored data from localStorage:", storedData);
    
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        console.log("Parsed session data:", parsedData);
        setSessionData(parsedData);
        // Clean up localStorage after retrieving
        localStorage.removeItem('recordingSessionData');
      } catch (error) {
        console.error("Error parsing session data:", error);
        // If parsing fails, redirect back to setup page
        setTimeout(() => {
          navigate('/deepai-audio-notes');
        }, 2000);
      }
    } else {
      console.log("No session data found, redirecting to setup page...");
      // If no data found, redirect back to setup page after a short delay
      setTimeout(() => {
        navigate('/deepai-audio-notes');
      }, 2000);
    }
    
    setIsLoading(false);
  }, [navigate]);

  if (isLoading || !sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Session...</h2>
          <p className="text-muted-foreground">Preparing your recording session</p>
          {!sessionData && !isLoading && (
            <p className="text-sm text-muted-foreground mt-2">
              No session data found. Redirecting to setup page...
            </p>
          )}
        </div>
      </div>
    );
  }

  return <RecordingSession sessionData={sessionData} />;
}
