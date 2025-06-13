
import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { RecordingSession } from "@/components/deepai-audio/RecordingSession";

export default function RecordingSessionPage() {
  const [searchParams] = useSearchParams();
  const [sessionData, setSessionData] = useState(null);

  useEffect(() => {
    // Get session data from URL parameters or localStorage
    const storedData = localStorage.getItem('recordingSessionData');
    if (storedData) {
      setSessionData(JSON.parse(storedData));
      // Clean up localStorage after retrieving
      localStorage.removeItem('recordingSessionData');
    }
  }, []);

  if (!sessionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Loading Session...</h2>
          <p className="text-muted-foreground">Preparing your recording session</p>
        </div>
      </div>
    );
  }

  return <RecordingSession sessionData={sessionData} />;
}
