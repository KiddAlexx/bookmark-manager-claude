import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const isLoggedIn = !!req.nextauth.token

    const PUBLIC_PATHS = ["/sign-in", "/sign-up"]
    if (isLoggedIn && PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
      return NextResponse.redirect(new URL("/", req.url))
    }
  },
  {
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/sign-in",
    },
  },
)

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|assets|api/auth).*)"],
}
