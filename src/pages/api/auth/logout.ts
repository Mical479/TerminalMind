// Logout endpoint - clears the session

import type { APIRoute } from 'astro';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  // Clear session cookie
  const logoutCookie = 'tm_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';

  // Handle both JSON and form submissions
  const contentType = request.headers.get('content-type') || '';
  let redirectTo = '/';

  if (contentType.includes('application/json')) {
    try {
      const body = await request.json();
      redirectTo = body.redirect || '/';
    } catch {
      // Ignore parse errors
    }
  } else {
    const formData = await request.formData();
    redirectTo = formData.get('redirect')?.toString() || '/';
  }

  return new Response(null, {
    status: 302,
    headers: {
      'Location': redirectTo,
      'Set-Cookie': logoutCookie,
      'Content-Type': 'text/plain'
    }
  });
};

export const GET: APIRoute = async () => {
  const logoutCookie = 'tm_session=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0';

  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/',
      'Set-Cookie': logoutCookie,
      'Content-Type': 'text/plain'
    }
  });
};
