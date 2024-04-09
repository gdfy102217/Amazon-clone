import { authMiddleware } from "@clerk/nextjs";
import { NextRequest, NextResponse } from "next/server";

// This example protects all routes including api/trpc routes
// Please edit this to allow other routes to be public as needed.
// See https://clerk.com/docs/nextjs/middleware for more information about configuring your middleware
export default authMiddleware({
  publicRoutes: ['/landing', "/api/uploadthing", "cdn-icons-png.flaticon.com"],
});


export function middleware(request: NextRequest) {
    const agentId = request.nextUrl.searchParams.get('agentId')
    const taskId = request.nextUrl.searchParams.get('taskId')
    const currentPath = request.nextUrl.pathname
    console.log(`Current Path is ${currentPath}, agentId is ${agentId}, taskId is ${taskId}`)


    if ((!agentId || !taskId) && currentPath !== '/error' && !currentPath.startsWith('/api')) {
        
        console.log(`Because the current url is ${currentPath}, so we redirect to /error`)
        return NextResponse.redirect(new URL('/error', request.url))
    }

}


export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
