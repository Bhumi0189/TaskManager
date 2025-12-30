import { NextResponse, type NextRequest } from "next/server"
import { verifySession } from "@/lib/session"

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Public routes that don't require authentication
  const publicRoutes = ["/login", "/register", "/"]

  // Check if route is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next()
  }

  // Protected routes - verify session
  if (pathname.startsWith("/dashboard") || pathname.startsWith("/api/tasks") || pathname.startsWith("/api/profile")) {
    const session = await verifySession()

    if (!session) {
      if (pathname.startsWith("/api")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
      }
      return NextResponse.redirect(new URL("/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
}
