import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([
  "/",
  "/sign-in(.*)",
  "/sign-up(.*)",
]);

// export default clerkMiddleware((auth, req) => {
//   if (isProtectedRoute(req)) auth();
// });

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
