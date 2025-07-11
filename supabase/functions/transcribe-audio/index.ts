import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const { audio, visitId } = await req.json();
    
    if (!audio || !visitId) {
      throw new Error('Audio data and visit ID are required');
    }

    console.log('Processing audio transcription for visit:', visitId);

    // Initialize Supabase client
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Process audio in chunks to prevent memory issues
    function processBase64Chunks(base64String: string, chunkSize = 32768) {
      const chunks: Uint8Array[] = [];
      let position = 0;
      
      while (position < base64String.length) {
        const chunk = base64String.slice(position, position + chunkSize);
        const binaryChunk = atob(chunk);
        const bytes = new Uint8Array(binaryChunk.length);
        
        for (let i = 0; i < binaryChunk.length; i++) {
          bytes[i] = binaryChunk.charCodeAt(i);
        }
        
        chunks.push(bytes);
        position += chunkSize;
      }

      const totalLength = chunks.reduce((acc, chunk) => acc + chunk.length, 0);
      const result = new Uint8Array(totalLength);
      let offset = 0;

      for (const chunk of chunks) {
        result.set(chunk, offset);
        offset += chunk.length;
      }

      return result;
    }

    // Convert base64 audio to binary
    const binaryAudio = processBase64Chunks(audio);
    
    // Prepare form data for OpenAI Whisper
    const formData = new FormData();
    const blob = new Blob([binaryAudio], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');
    formData.append('response_format', 'json');

    console.log('Sending audio to OpenAI for transcription...');

    // Send to OpenAI Whisper for transcription
    const transcriptionResponse = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!transcriptionResponse.ok) {
      const errorText = await transcriptionResponse.text();
      console.error('OpenAI transcription error:', errorText);
      throw new Error(`OpenAI transcription failed: ${errorText}`);
    }

    const transcriptionResult = await transcriptionResponse.json();
    const transcript = transcriptionResult.text;

    console.log('Transcription completed, generating clinical summary...');

    // Generate clinical summary using GPT
    const summaryResponse = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'system',
            content: `You are a medical assistant helping to create clinical visit summaries. 
            Analyze the provided visit transcript and create a concise, professional clinical summary.
            Include:
            - Chief complaint/reason for visit
            - Key symptoms or concerns mentioned
            - Assessment and observations
            - Plan or next steps
            - Any medications or treatments discussed
            
            Keep the summary concise but comprehensive, using proper medical terminology.`
          },
          {
            role: 'user',
            content: `Please create a clinical summary for this patient visit transcript:\n\n${transcript}`
          }
        ],
        max_tokens: 500,
        temperature: 0.3
      }),
    });

    if (!summaryResponse.ok) {
      console.error('OpenAI summary generation failed');
      throw new Error('Failed to generate clinical summary');
    }

    const summaryResult = await summaryResponse.json();
    const aiSummary = summaryResult.choices[0].message.content;

    console.log('Clinical summary generated, updating database...');

    // Update the visit with transcript and AI summary
    const { error: updateError } = await supabase
      .from('visits')
      .update({
        transcript: transcript,
        ai_generated_summary: aiSummary,
        updated_at: new Date().toISOString()
      })
      .eq('id', visitId);

    if (updateError) {
      console.error('Database update error:', updateError);
      throw new Error(`Failed to update visit: ${updateError.message}`);
    }

    // Also create an audio transcription record
    const { error: transcriptionError } = await supabase
      .from('audio_transcriptions')
      .insert({
        visit_id: visitId,
        audio_url: `visit_${visitId}_audio`, // This would be the storage URL in production
        transcript: transcript,
        ai_summary: aiSummary,
        processing_status: 'completed'
      });

    if (transcriptionError) {
      console.error('Audio transcription record error:', transcriptionError);
      // Don't throw here as the main operation succeeded
    }

    console.log('Audio processing completed successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        transcript, 
        aiSummary,
        message: 'Audio processed and visit updated successfully' 
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Audio transcription error:', error);
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});