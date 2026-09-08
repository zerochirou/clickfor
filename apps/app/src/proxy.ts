import { NextRequest, NextResponse } from "next/server";
import { authClient } from "./lib/auth/auth-client";

const LAST_WORKSPACE_COOKIE_NAME = "last_workspace";

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const { data: session } = await authClient.getSession({
    fetchOptions: {
      headers: {
        cookie: request.headers.get("cookie") || "",
      },
    },
  });

  const isAuthPage =
    pathname.startsWith("/signin") || pathname.startsWith("/signup");
  const isProtectedRoute =
    pathname.startsWith("/workspace") || pathname.startsWith("/workspace");

  if (session && isAuthPage) {
    return NextResponse.redirect(new URL("/workspace", request.url));
  }

  if (!session && isProtectedRoute) {
    return NextResponse.redirect(new URL("/signin", request.url));
  }

  if (session && (pathname === "/workspace" || pathname === "/workspace/")) {
    const lastWorkspace = request.cookies.get(LAST_WORKSPACE_COOKIE_NAME);

    if (lastWorkspace?.value) {
      return NextResponse.redirect(
        new URL(`/workspace/${lastWorkspace.value}`, request.url),
      );
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/workspace/:path*", "/signin", "/signup"],
};
