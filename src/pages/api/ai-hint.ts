import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { question } = body;
    
    if (!question) {
      return new Response(JSON.stringify({ error: 'Question is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Load config
    const configResponse = await fetch(new URL('/config/site.config.json', request.url));
    const config = await configResponse.json();
    
    const apiKey = config.ai?.apiKey;
    const endpoint = config.ai?.endpoint || 'http://localhost:8250/api/chat';
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return new Response(JSON.stringify({ 
        hint: 'API key not configured. Please set your API key in config/site.config.json' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call OpenClaw API with a hint-focused prompt
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: [
          {
            role: 'user',
            content: `Give a brief hint for this interview question. Be concise and helpful (1-2 sentences max):\n\n${question}`
          }
        ],
        stream: false
      })
    });

    if (!response.ok) {
      return new Response(JSON.stringify({ 
        hint: 'Sorry, could not get a hint at this time.' 
      }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    let hint = 'No hint available.';
    
    if (data.message?.content) {
      hint = data.message.content;
    } else if (data.content) {
      hint = data.content;
    }

    return new Response(JSON.stringify({ hint }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('AI Hint error:', error);
    return new Response(JSON.stringify({ 
      hint: 'Failed to get hint. Please try again.' 
    }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
