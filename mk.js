import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

const secretKey = "myscret_kxa";

// Middleware function

// Middleware function
export async function middleware(req) {
  const { pathname } = req.nextUrl;

  // Define routes that require authentication
  const protectedRoutes = ["/dashboard", "/", "/settings"];

  // Get the token from the cookies
  const token = req.cookies.get("token")?.value;

  // If a user tries to access the login page and has a valid token, redirect to /profile
  if (pathname === "/login" && token) {
    try {
      // Verify the token
      jwt.verify(token, secretKey);

      // Redirect to /profile if the token is valid
      const url = req.nextUrl.clone();
      url.pathname = "/profile";
      return NextResponse.redirect(url);
    } catch (err) {
      // If token is invalid, allow the user to access /login
      return NextResponse.next();
    }
  }

  // Check if the route is protected
  if (protectedRoutes.some((route) => pathname.startsWith(route))) {
    if (!token) {
      // Redirect to login if no token is found
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      url.searchParams.set("error", "unauthorized");
      return NextResponse.redirect(url);
    }

    try {
      // Verify the token
      jwt.verify(token, secretKey);

      // Allow the request to continue
      return NextResponse.next();
    } catch (err) {
      // If token verification fails, redirect to login
      const url = req.nextUrl.clone();
      url.pathname = "/login";
      return NextResponse.redirect(url);
    }
  }

  // Allow requests to public routes
  return NextResponse.next();
}

// Matcher configuration to apply middleware only to specific routes
export const config = {
  matcher: [
    "/dashboard/:path*",
    "/profile/:path*",
    "/settings/:path*",
    "/login",
  ],
};
