import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { accessRole } from "@/services/access";

const decodeTokenPayload = (token: string): { role?: string | null } | null => {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      "="
    );
    const json = atob(padded);
    return JSON.parse(json) as { role?: string | null };
  } catch {
    return null;
  }
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get("access_token")?.value;

  const isAuth = Boolean(token && token.length > 0);
  const isLogin = pathname.startsWith("/login");
  const isNoAccessPage = pathname === "/dontHaveAccess";
  const isProtected =
    pathname === "/" ||
    pathname === "/dashboard" ||
    pathname.startsWith("/dashboard/") ||
    pathname === "/dontHaveAccess";

  if (!isAuth && isProtected) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAuth && isLogin) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    url.search = "";
    return NextResponse.redirect(url);
  }

  if (isAuth && !isNoAccessPage && token) {
    const payload = decodeTokenPayload(token);
    const role = String(payload?.role ?? "").toLowerCase();
    const rule = accessRole.find((r) => String(r.role).toLowerCase() === role);
    const denied = rule?.dontHaveAccess ?? [];
    const blocked = denied.some((item) => {
      const url = String(item.url ?? "");
      if (!url) return false;
      return pathname === url || pathname.startsWith(`${url}/`);
    });
    if (blocked) {
      const url = req.nextUrl.clone();
      url.pathname = "/dontHaveAccess";
      url.search = "";
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/", "/dashboard", "/dashboard/:path*", "/login", "/dontHaveAccess"]
};
