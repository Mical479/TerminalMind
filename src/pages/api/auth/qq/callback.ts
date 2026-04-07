// QQ OAuth2.0 Callback Handler
// Exchanges authorization code for access token and retrieves user info

import type { APIRoute } from 'astro';
import { signSession, createSessionCookie, type Session, type User } from '../../../../lib/auth';

export const prerender = false;

const QQ_TOKEN_URL = 'https://graph.qq.com/oauth2.0/token';
const QQ_OPEN_ID_URL = 'https://graph.qq.com/oauth2.0/me';
const QQ_USER_INFO_URL = 'https://graph.qq.com/user/get_user_info';

function getEnv(key: string): string {
  return process.env[key] || '';
}

function parseQueryString(query: string): Record<string, string> {
  const params: Record<string, string> = {};
  query.split('&').forEach(pair => {
    const [key, value] = pair.split('=');
    if (key) params[decodeURIComponent(key)] = decodeURIComponent(value || '');
  });
  return params;
}

async function fetchAccessToken(code: string, appId: string, appKey: string, callbackUrl: string): Promise<{ access_token: string; expires_in: number; refresh_token: string } | null> {
  const params = new URLSearchParams({
    grant_type: 'authorization_code',
    client_id: appId,
    client_secret: appKey,
    code: code,
    redirect_uri: callbackUrl
  });

  try {
    const response = await fetch(`${QQ_TOKEN_URL}?${params.toString()}`);
    const text = await response.text();
    const data = parseQueryString(text);

    if (data.access_token) {
      return {
        access_token: data.access_token,
        expires_in: parseInt(data.expires_in) || 3600,
        refresh_token: data.refresh_token || ''
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch access token:', error);
    return null;
  }
}

async function fetchOpenId(accessToken: string): Promise<string | null> {
  try {
    const response = await fetch(`${QQ_OPEN_ID_URL}?access_token=${accessToken}`);
    const text = await response.text();

    // QQ returns JSONP: callback({"client_id":"xxx","openid":"xxx"})
    const match = text.match(/{"client_id":"([^"]+)","openid":"([^"]+)"}/);
    if (match) {
      return match[2]; // openid
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch openid:', error);
    return null;
  }
}

async function fetchUserInfo(accessToken: string, appId: string, openId: string): Promise<User | null> {
  try {
    const params = new URLSearchParams({
      access_token: accessToken,
      oauth_consumer_key: appId,
      openid: openId
    });

    const response = await fetch(`${QQ_USER_INFO_URL}?${params.toString()}`);
    const data = await response.json();

    if (data.ret === 0 && data.nickname) {
      return {
        id: openId,
        nickname: data.nickname,
        figure: data.figure,
        figureurl: data.figureurl,
        figureurl_qq_1: data.figureurl_qq_1,
        gender: data.gender
      };
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch user info:', error);
    return null;
  }
}

export const GET: APIRoute = async ({ request, cookies, redirect }) => {
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const state = url.searchParams.get('state');
  const error = url.searchParams.get('error');

  // Check for errors from QQ
  if (error) {
    return redirect(`/?auth_error=${encodeURIComponent(error)}`, 302);
  }

  // Verify state for CSRF protection
  const savedState = cookies.get('tm_oauth_state')?.value;
  if (!state || !savedState || state !== savedState) {
    return redirect('/?auth_error=invalid_state', 302);
  }

  // Clear state cookie
  cookies.delete('tm_oauth_state', { path: '/' });

  if (!code) {
    return redirect('/?auth_error=missing_code', 302);
  }

  const appId = getEnv('QQ_OAUTH_APP_ID');
  const appKey = getEnv('QQ_OAUTH_APP_KEY');
  const callbackUrl = getEnv('QQ_OAUTH_CALLBACK_URL') || '/api/auth/qq/callback';
  const sessionSecret = getEnv('SESSION_SECRET') || 'default-secret-change-me';

  if (!appId || !appKey) {
    return redirect('/?auth_error=not_configured', 302);
  }

  // Exchange code for access token
  const tokenData = await fetchAccessToken(
    code,
    appId,
    appKey,
    callbackUrl.startsWith('http') ? callbackUrl : `${url.origin}${callbackUrl}`
  );

  if (!tokenData) {
    return redirect('/?auth_error=token_failed', 302);
  }

  // Get OpenID
  const openId = await fetchOpenId(tokenData.access_token);
  if (!openId) {
    return redirect('/?auth_error=openid_failed', 302);
  }

  // Get user info
  const user = await fetchUserInfo(tokenData.access_token, appId, openId);
  if (!user) {
    return redirect('/?auth_error=userinfo_failed', 302);
  }

  // Create session
  const session: Session = {
    user,
    createdAt: Date.now(),
    expiresAt: Date.now() + (tokenData.expires_in * 1000)
  };

  const sessionCookie = signSession(session, sessionSecret);

  // Redirect to home or original page
  const redirectTo = cookies.get('tm_auth_redirect')?.value || '/';
  cookies.delete('tm_auth_redirect', { path: '/' });

  return new Response(null, {
    status: 302,
    headers: {
      'Location': redirectTo,
      'Set-Cookie': `tm_session=${sessionCookie}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${7 * 24 * 60 * 60}`,
      'Content-Type': 'text/plain'
    }
  });
};
