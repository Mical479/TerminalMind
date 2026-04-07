// QQ OAuth2.0 Authorization Endpoint
// Redirects user to QQ authorization page

import type { APIRoute } from 'astro';

export const prerender = false;

const QQ_AUTHORIZE_URL = 'https://graph.qq.com/oauth2.0/authorize';
const QQ_TOKEN_URL = 'https://graph.qq.com/oauth2.0/token';
const QQ_OPEN_ID_URL = 'https://graph.qq.com/oauth2.0/me';
const QQ_USER_INFO_URL = 'https://graph.qq.com/user/get_user_info';

function getEnv(key: string): string {
  return process.env[key] || '';
}

export const GET: APIRoute = async ({ request, redirect }) => {
  const appId = getEnv('QQ_OAUTH_APP_ID');
  const appKey = getEnv('QQ_OAUTH_APP_KEY');
  const callbackUrl = getEnv('QQ_OAUTH_CALLBACK_URL') || '/api/auth/qq/callback';

  if (!appId || !appKey) {
    return new Response(JSON.stringify({
      error: 'QQ OAuth not configured'
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Generate state token for CSRF protection
  const state = Math.random().toString(36).substring(2, 15);
  const stateCookie = `tm_oauth_state=${state}; Path=/; HttpOnly; SameSite=Lax; Max-Age=600`;

  // Build authorization URL
  const params = new URLSearchParams({
    response_type: 'code',
    client_id: appId,
    redirect_uri: callbackUrl.startsWith('http') ? callbackUrl : `${new URL(request.url).origin}${callbackUrl}`,
    state: state
  });

  const authorizeUrl = `${QQ_AUTHORIZE_URL}?${params.toString()}`;

  return new Response(null, {
    status: 302,
    headers: {
      'Location': authorizeUrl,
      'Set-Cookie': stateCookie,
      'Content-Type': 'text/plain'
    }
  });
};
