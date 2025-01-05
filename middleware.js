import { NextResponse } from "next/server";

// This function can be marked `async` if using `await` inside
export function middleware(request) {
  const path = request.url.pathname;
  console.log("path: " + path);
  const isPublicpath = path === "/login" || path === "/signup";
  const token = request.cookies.get("token");
  console.log("hamroom token: ", token);
  if (!token && !isPublicpath) {
    return NextResponse.redirect(new URL("/login", request.url));
  }
  if (token && isPublicpath) {
    return NextResponse.redirect(new URL(path, request.url));
  }
}

// See "Matching Paths" below to learn more
export const config = {
  matcher: ["/about/:path*", "/about", "/", "/profile"],
};
