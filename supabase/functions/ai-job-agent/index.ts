
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { action, jobDescription, currentResume, query } = await req.json();

    let systemPrompt = '';
    let userPrompt = '';

    if (action === 'analyze-job') {
      systemPrompt = 'You are an AI career advisor. Analyze job descriptions and provide insights about required skills, qualifications, and recommendations.';
      userPrompt = `Analyze this job description and provide:
1. Key required skills
2. Nice-to-have skills
3. Experience level required
4. Key responsibilities
5. Tips for applying

Job Description: ${jobDescription}`;
    } else if (action === 'optimize-resume') {
      systemPrompt = 'You are an AI resume optimization expert. Help optimize resumes to match specific job descriptions.';
      userPrompt = `Based on this job description, provide specific recommendations to optimize this resume:

Job Description: ${jobDescription}

Current Resume Summary: ${currentResume}

Provide:
1. Keywords to add
2. Skills to highlight
3. Experience to emphasize
4. Suggested improvements
5. ATS optimization tips`;
    } else if (action === 'job-search') {
      systemPrompt = 'You are a job search assistant. Provide helpful advice about job searching strategies and opportunities.';
      userPrompt = `Help with job search query: ${query}`;
    }

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
        temperature: 0.7,
      }),
    });

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    return new Response(JSON.stringify({ response: aiResponse }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  } catch (error) {
    console.error('Error in ai-job-agent function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
