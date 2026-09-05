import type { NextRequest } from "next/server";
import createMiddleware from "next-intl/middleware";
import { routing } from "./i18n/routing";

const handleI18nRouting = createMiddleware(routing);

// Exposes the current pathname to Server Components (e.g. the root layout)
// via a request header, since Next doesn't provide it directly otherwise.
// Used to set the `home-page` body class server-side and avoid a client-side
// flash where the non-home header briefly renders before switching.
export default function proxy(request: NextRequest) {
  const response = handleI18nRouting(request);
  response.headers.set("x-pathname", request.nextUrl.pathname);
  return response;
}

export const config = {
  matcher: ["/((?!api|admin|_next|_vercel|.*\\..*).*)"],
};
