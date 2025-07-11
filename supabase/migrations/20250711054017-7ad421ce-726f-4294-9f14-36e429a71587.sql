-- Create visits table for patient visit records
CREATE TABLE public.visits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_by UUID NULL,
  visit_date DATE NOT NULL,
  visit_time TIME NOT NULL,
  reason TEXT NOT NULL,
  provider TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'scheduled',
  summary TEXT NULL,
  transcript TEXT NULL,
  audio_recording_url TEXT NULL,
  ai_generated_summary TEXT NULL,
  vital_signs JSONB NULL,
  exam_findings JSONB NULL,
  medications JSONB NULL,
  documents JSONB NULL,
  notes TEXT NULL
);

-- Enable Row Level Security
ALTER TABLE public.visits ENABLE ROW LEVEL SECURITY;

-- Create policies for visits access
CREATE POLICY "Authenticated users can view visits" 
ON public.visits 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create visits" 
ON public.visits 
FOR INSERT 
WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Authenticated users can update visits" 
ON public.visits 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete visits" 
ON public.visits 
FOR DELETE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_visits_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_visits_updated_at
BEFORE UPDATE ON public.visits
FOR EACH ROW
EXECUTE FUNCTION public.update_visits_updated_at();

-- Create audio transcriptions table for storing audio processing results
CREATE TABLE public.audio_transcriptions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  visit_id UUID NOT NULL REFERENCES public.visits(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  audio_url TEXT NOT NULL,
  transcript TEXT NULL,
  ai_summary TEXT NULL,
  processing_status TEXT NOT NULL DEFAULT 'pending',
  processing_error TEXT NULL
);

-- Enable RLS for audio transcriptions
ALTER TABLE public.audio_transcriptions ENABLE ROW LEVEL SECURITY;

-- Create policies for audio transcriptions
CREATE POLICY "Authenticated users can view audio transcriptions" 
ON public.audio_transcriptions 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create audio transcriptions" 
ON public.audio_transcriptions 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update audio transcriptions" 
ON public.audio_transcriptions 
FOR UPDATE 
USING (true);