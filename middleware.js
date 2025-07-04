import { next } from "@vercel/edge";

export const config = {
  matcher: "/:path*",  // matches all requests
};

export default function middleware(request) {
  const url = new URL(request.url);
  const path = url.pathname;

  // Skip auth for static assets
  if (
    path.startsWith("/assets/") ||
    path.startsWith("/favicon.ico") ||
    path.startsWith("/logo") ||
    path.includes(".json") ||
    path.includes(".js") ||
    path.includes(".css") ||
    path.includes(".ico") ||
    path.includes(".png") ||
    path.includes(".svg") ||
    path.includes(".webmanifest")
  ) {
    return next();
  }

  const auth = request.headers.get("authorization");
  if (auth) {
    const base64 = auth.split(" ")[1];
    const [user, pass] = atob(base64).split(":");
    if (
      user === process.env.BASIC_AUTH_USER &&
      pass === process.env.BASIC_AUTH_PASS
    ) {
      return next();  // Allow request
    }
  }

  return new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}
