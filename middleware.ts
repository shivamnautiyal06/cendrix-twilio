// middleware.ts
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const basicAuth = request.headers.get('authorization');
  const USER = process.env.BASIC_AUTH_USER;
  const PASS = process.env.BASIC_AUTH_PASS;

  if (basicAuth) {
    const [, base64] = basicAuth.split(' ');
    const [user, pass] = atob(base64).split(':');

    if (user === USER && pass === PASS) {
      return NextResponse.next();
    }
  }

  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
