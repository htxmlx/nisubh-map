import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";

const isProtectedRoute = createRouteMatcher([]);

export default clerkMiddleware((auth, request) => {
    if (isProtectedRoute(request)) {
        const authHeader = request.headers.get("Authorization");

        // Check if the Authorization header is present and valid
        if (!authHeader || !authHeader.startsWith("Basic ")) {
            // Respond with 401 Unauthorized and prompt for credentials
            return new Response("Unauthorized", {
                status: 401,
                headers: {
                    "WWW-Authenticate": 'Basic realm="Secure Area"',
                },
            });
        }

        // If basic auth is provided, decode it
        const base64Credentials = authHeader.split(" ")[1];
        const credentials = atob(base64Credentials).split(":");
        const username = credentials[0];
        const password = credentials[1];

        // You can replace this with your own user validation logic
        if (username !== "admin" || password !== "admin") {
            return new Response("Unauthorized", {
                status: 401,
                headers: {
                    "WWW-Authenticate": 'Basic realm="Secure Area"',
                },
            });
        }

        // Protect the route with Clerk
        auth().protect();
    }
});

export const config = {
    matcher: [
        "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
        "/(api|trpc)(.*)",
    ],
};
