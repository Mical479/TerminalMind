import type { APIRoute } from 'astro';

interface Message {
  role: 'user' | 'assistant';
  content: string;
}

export const POST: APIRoute = async ({ request }) => {
  try {
    const body = await request.json();
    const { messages }: { messages: Message[] } = body;
    
    // Load config
    const configResponse = await fetch(new URL('/config/site.config.json', request.url));
    const config = await configResponse.json();
    
    const apiKey = config.ai?.apiKey;
    const endpoint = config.ai?.endpoint || 'http://localhost:8250/api/chat';
    
    if (!apiKey || apiKey === 'YOUR_API_KEY_HERE') {
      return new Response(JSON.stringify({ 
        error: 'API key not configured. Please set your API key in config/site.config.json' 
      }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Call OpenClaw API
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        messages: messages.map(m => ({
          role: m.role,
          content: m.content
        })),
        stream: false
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      return new Response(JSON.stringify({ 
        error: `API request failed: ${response.status} - ${errorText}` 
      }), {
        status: response.status,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    const data = await response.json();
    
    // Extract the response message
    let message = '';
    if (data.message?.content) {
      message = data.message.content;
    } else if (data.content) {
      message = data.content;
    } else if (typeof data === 'string') {
      message = data;
    } else {
      message = JSON.stringify(data);
    }

    return new Response(JSON.stringify({ message }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ 
      error: `Failed to process request: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
};
