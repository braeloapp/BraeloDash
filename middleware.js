import { NextResponse } from "next/server";

const PUBLIC_PATHS = ["/", "/auth"];

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const isPublic = PUBLIC_PATHS.some(
    (path) => pathname === path || pathname.startsWith(`${path}/`)
  );
  if (isPublic) {
    return NextResponse.next();
  }

  if (pathname.startsWith("/pages")) {
    const session = request.cookies.get("braelo_admin_session")?.value;
    if (!session) {
      const loginUrl = new URL("/", request.url);
      loginUrl.searchParams.set("next", pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/pages/:path*"],
};
