/* eslint-disable no-unused-vars */
import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
  "/api/webhooks",
]);

export default clerkMiddleware(
  async (auth: { protect: () => any }, request: any) => {
    if (!isProtectedRoute(request)) {
      await auth.protect();
    }
  }
);

export const config = {
  matcher: ["/((?!.*\\..*|_next).*)", "/", "/(api|trpc)(.*)"],
};
