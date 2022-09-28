import {NextRequest, NextResponse} from 'next/server'
import {NextURL} from "next/dist/server/web/next-url";

export async function middleware(req: NextRequest) {
    const url = req.nextUrl;
    // Get hostname (e.g. vercel.com, test.vercel.app, etc.)
    const hostname = req.headers.get("host") || '';

    return process.env.APP_ENV == "production" ? manageMiddlewareProduction(hostname, url) : NextResponse.next();


}

function manageMiddlewareProduction(hostname: string, url: NextURL): NextResponse | Response | undefined {
    // If localhost, assign the host value manually
    // If prod, get the custom domain/subdomain value by removing the root URL
    // (in the case of "test.vercel.app", "vercel.app" is the root URL)
    const currentHost =
        process.env.APP_ENV == "production"
            ? hostname?.replace(`.groupepeyrot.netlify.app`, "") // PUT YOUR DOMAIN HERE
            : hostname?.replace(`.localhost:3000`, "");
    // Prevent security issues – users should not be able to canonically access
    // the pages/sites folder and its respective contents. This can also be done
    // via rewrites to a custom 404 page
    if (url.pathname.startsWith(`/_sites`)) {
        return new Response(null, {status: 404});
    }
    if (
        !url.pathname.includes(".") && // exclude all files in the public folder
        !url.pathname.startsWith("/api") &&// exclude all API routes
        !hostname.startsWith('localhost:3000')
    ) {
        // rewrite to the current hostname under the pages/sites folder
        // the main logic component will happen in pages/sites/[site]/index.tsx
        url.pathname =`/_sites/${currentHost}${url.pathname}`
        return NextResponse.rewrite(url);
    }
    return undefined;
}
