import { auth } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function requireAuth(request: Request) {
  const session = await auth.api.getSession({ headers: request.headers });
  return session;
}

export function unauthorizedResponse() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export function validateOrigin(request: Request): boolean {
  const method = request.method.toUpperCase();
  if (method === "GET" || method === "HEAD" || method === "OPTIONS") {
    return true;
  }

  const origin = request.headers.get("origin");
  const referer = request.headers.get("referer");
  const allowedUrl =
    process.env.NEXT_PUBLIC_APP_URL || process.env.BETTER_AUTH_URL || "http://localhost:3001";

  if (origin) {
    return origin === new URL(allowedUrl).origin;
  }

  if (referer) {
    try {
      return new URL(referer).origin === new URL(allowedUrl).origin;
    } catch {
      return false;
    }
  }

  // No origin or referer — reject state-changing requests
  return false;
}

export function forbiddenResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
