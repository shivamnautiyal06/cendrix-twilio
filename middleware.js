import { next } from '@vercel/edge';

export const config = {
  matcher: [
    '/((?!.*\\.(png|jpg|jpeg|svg|ico|json|js|css|map)).*)',
  ],
};

export default function middleware(request) {
  const auth = request.headers.get('authorization');
  if (auth) {
    const [u, p] = atob(auth.split(' ')[1]).split(':');
    if (
      u === process.env.BASIC_AUTH_USER &&
      p === process.env.BASIC_AUTH_PASS
    ) {
      return next();
    }
  }
  return new Response('Unauthorized', {
    status: 401,
    headers: {
      'WWW-Authenticate': 'Basic realm="Secure Area"',
    },
  });
}
