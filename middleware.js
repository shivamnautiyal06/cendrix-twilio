import { next } from "@vercel/edge";

export const config = { matcher: "/(.*)" };

export default function middleware(request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader) {
    const base64 = authHeader.split(" ")[1];
    const [user, pass] = atob(base64).split(":");
    if (
      user === process.env.BASIC_AUTH_USER &&
      pass === process.env.BASIC_AUTH_PASS
    ) {
      return next(); // Auth passed
    }
  }
  return new Response("Unauthorized", {
    status: 401,
    headers: { "WWW-Authenticate": 'Basic realm="Secure Area"' },
  });
}
  
