
import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { RecordingSession } from "@/components/deepai-audio/RecordingSession";

export default function RecordingSessionPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [sessionData, setSessionData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("RecordingSession page loaded, checking for session data...");
    
    const sessionKey = searchParams.get('sessionKey');
    console.log("Session key from URL:", sessionKey);
    
    // Function to load session data
    const loadSessionData = () => {
      // Try to get session data from URL parameter first
      if (sessionKey) {
        const storedData = localStorage.getItem(sessionKey);
        console.log("Data from localStorage with key:", storedData);
        
        if (storedData) {
          try {
            const parsedData = JSON.parse(storedData);
            console.log("Parsed session data:", parsedData);
            setSessionData(parsedData);
            // Clean up localStorage after retrieving
            localStorage.removeItem(sessionKey);
            localStorage.removeItem('currentSessionKey');
            setIsLoading(false);
            return;
          } catch (error) {
            console.error("Error parsing session data:", error);
          }
        }
      }
      
      // Fallback: try the old method
      const fallbackData = localStorage.getItem('recordingSessionData');
      console.log("Fallback data from localStorage:", fallbackData);
      
      if (fallbackData) {
        try {
          const parsedData = JSON.parse(fallbackData);
          console.log("Parsed fallback session data:", parsedData);
          setSessionData(parsedData);
          localStorage.removeItem('recordingSessionData');
          setIsLoading(false);
          return;
        } catch (error) {
          console.error("Error parsing fallback session data:", error);
        }
      }
      
      // If no data found, wait a moment and try again (for postMessage)
      console.log("No session data found initially, waiting for postMessage...");
      setTimeout(() => {
        if (!sessionData) {
          console.log("No session data found after waiting, redirecting to setup page...");
          navigate('/deepai-audio-notes');
        }
      }, 3000);
      
      setIsLoading(false);
    };

    // Listen for postMessage from parent window
    const handleMessage = (event) => {
      console.log("Received postMessage:", event);
      
      if (event.origin !== window.location.origin) {
        console.log("Message from different origin, ignoring");
        return;
      }
      
      if (event.data && event.data.type === 'SESSION_DATA') {
        console.log("Session data received via postMessage:", event.data.data);
        setSessionData(event.data.data);
        setIsLoading(false);
      }
    };

    window.addEventListener('message', handleMessage);
    
    // Load session data
    loadSessionData();

    // Cleanup
    return () => {
      window.removeEventListener('message', handleMessage);
    };
  }, [navigate, searchParams, sessionData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Session...</h2>
          <p className="text-muted-foreground">Preparing your recording session</p>
        </div>
      </div>
    );
  }

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">No Session Data Found</h2>
          <p className="text-muted-foreground mb-4">
            Unable to load session data. Redirecting to setup page...
          </p>
          <button 
            onClick={() => navigate('/deepai-audio-notes')}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Return to Setup
          </button>
        </div>
      </div>
    );
  }

  return <RecordingSession sessionData={sessionData} />;
}
