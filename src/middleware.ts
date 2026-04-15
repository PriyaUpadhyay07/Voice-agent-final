import NextAuth from "next-auth";
import { authConfig } from "./auth.config";

const { auth } = NextAuth(authConfig);

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  
  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/login", "/signup", "/privacy", "/terms"].includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isClientRoute = nextUrl.pathname.startsWith("/client");

  // 1. Allow API auth routes
  if (isApiAuthRoute) return;

  // 2. Public route logic
  if (isPublicRoute) {
    if (isLoggedIn) {
      const role = (req.auth?.user as any)?.role;
      return Response.redirect(new URL(role === "admin" ? "/admin" : "/client", nextUrl));
    }
    return;
  }

  // 3. Protected route logic
  if (!isLoggedIn) {
    const host = req.headers.get("host") || "";
    const isProtected = isAdminRoute || isClientRoute;

    // Local/Tunnel Bypass
    if (isProtected && (host.includes("localhost") || host.includes("loca.lt") || host.includes("trycloudflare"))) {
      return; 
    }
    
    // Redirect to login if not logged in and not on public route
    return Response.redirect(new URL("/login", nextUrl));
  }

  // 4. Role based access control
  const userRole = (req.auth?.user as any)?.role;
  if (userRole === "admin") return;

  if (isAdminRoute && userRole !== "admin") {
    return Response.redirect(new URL("/client", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
