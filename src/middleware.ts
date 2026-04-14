import { auth } from "@/auth";

export default auth((req) => {
  const { nextUrl } = req;
  const isLoggedIn = !!req.auth;
  console.log(`[MIDDLEWARE] ${req.method} ${nextUrl.pathname} — Host: ${req.headers.get("host")}`);

  const isApiAuthRoute = nextUrl.pathname.startsWith("/api/auth");
  const isPublicRoute = ["/", "/login", "/signup"].includes(nextUrl.pathname);
  const isAdminRoute = nextUrl.pathname.startsWith("/admin");
  const isClientRoute = nextUrl.pathname.startsWith("/client");

  if (isApiAuthRoute) return;

  if (isPublicRoute) {
    if (isLoggedIn) {
      const role = (req.auth?.user as any)?.role;
      return Response.redirect(new URL(role === "admin" ? "/admin" : "/client", nextUrl));
    }
    return;
  }

  if (!isLoggedIn) {
    // TOTAL BYPASS: Allow direct access via local or tunnel URLs
    const host = req.headers.get("host") || "";
    const isProtected = isAdminRoute || isClientRoute;

    if (isProtected) {
      if (host.includes("localhost") || host.includes("loca.lt") || host.includes("trycloudflare")) {
        return; // Allow direct access
      }
    }
    
    // Default: Don't redirect to login if we are already on a public route or if it matches tunnel
    return; 
  }

  // Role based access control
  const userRole = (req.auth?.user as any)?.role;
  // Admin can access everything
  if (userRole === "admin") return;

  if (isAdminRoute && userRole !== "admin") {
    return Response.redirect(new URL("/client", nextUrl));
  }

  return;
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
