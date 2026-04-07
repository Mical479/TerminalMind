// Session check endpoint - returns current user info if logged in

import type { APIRoute } from 'astro';
import { getSessionFromRequest } from '../../../lib/auth';

export const prerender = false;

function getEnv(key: string): string {
  return process.env[key] || '';
}

export const GET: APIRoute = async ({ request }) => {
  const sessionSecret = getEnv('SESSION_SECRET') || 'default-secret-change-me';
  const session = getSessionFromRequest(request, sessionSecret);

  if (!session) {
    return new Response(JSON.stringify({ loggedIn: false }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  return new Response(JSON.stringify({
    loggedIn: true,
    user: {
      id: session.user.id,
      nickname: session.user.nickname,
      figure: session.user.figureurl_qq_1 || session.user.figureurl,
      gender: session.user.gender
    }
  }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
