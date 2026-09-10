import { useEffect } from "react";
import type { ReactNode } from "react";
import {
  createRootRouteWithContext,
  HeadContent,
  Outlet,
  Scripts,
  useRouter,
} from "@tanstack/react-router";
import type { QueryClient } from "@tanstack/react-query";
import { QueryClientProvider } from "@tanstack/react-query";
import { HelmetProvider } from "react-helmet-async";
import { TooltipProvider } from "@/components/ui/tooltip";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { AuthProvider } from "@/contexts/AuthContext";
import ErrorBoundary from "@/components/ErrorBoundary";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ScrollToTop from "@/components/ScrollToTop";
import SkipToContent from "@/components/SkipToContent";
import GoogleAnalytics from "@/components/seo/GoogleAnalytics";
import { useWebVitals } from "@/hooks/useWebVitals";
import { reportLovableError } from "@/lib/lovable-error-reporting";
import appCss from "../styles.css?url";

const FAVICON_SVG =
  "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHZpZXdCb3g9IjAgMCAzMiAzMiIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdHlsZT0ic3RvcC1jb2xvcjojNjRGRkRBIiAvPgogICAgICA8c3RvcCBvZmZzZXQ9IjEwMCUiIHN0eWxlPSJzdG9wLWNvbG9yOiM2MEE1RkEiIC8+CiAgICA8L2xpbmVhckdyYWRpZW50PgogIDwvZGVmcz4KICA8cmVjdCB3aWR0aD0iMzIiIGhlaWdodD0iMzIiIHJ4PSI4IiBmaWxsPSJ1cmwoI2dyYWRpZW50KSIgLz4KICA8cGF0aCBkPSJNMTYgOGMtNC40MTggMC04IDMuNTgyLTggOHMzLjU4MiA4IDggOCA4LTMuNTgyIDgtOC0zLjU4Mi04LTgtOHptMCAyYzMuMzE0IDAgNiAyLjY4NiA2IDZzLTIuNjg2IDYtNiA2LTYtMi42ODYtNi02IDIuNjg2LTYgNi02eiIgZmlsbD0id2hpdGUiIC8+CiAgPGNpcmNsZSBjeD0iMTMiIGN5PSIxMyIgcj0iMiIgZmlsbD0id2hpdGUiIC8+CiAgPGNpcmNsZSBjeD0iMTkiIGN5PSIxMyIgcj0iMiIgZmlsbD0id2hpdGUiIC8+CiAgPHBhdGggZD0iTTEzIDE5YzEuNjU3IDAgMy0xLjM0MyAzLTNoLTZ2MGMwIDEuNjU3IDEuMzQzIDMgMyAzeiIgZmlsbD0id2hpdGUiIC8+Cjwvc3ZnPgo=";

const GOOGLE_FONTS_HREF =
  "https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap";

// ported from index.html: applies the saved theme before first paint to avoid a flash
const THEME_BOOTSTRAP = `(function(){try{var t=localStorage.getItem('theme');if(t==='light'){document.documentElement.classList.add('light');}}catch(e){}})();`;

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1.0" },
      { title: "GenerateAI.dev - Build Production-Ready AI Agents in Minutes" },
      { name: "author", content: "GenerateAI.dev" },
      { name: "robots", content: "index, follow" },
      { name: "theme-color", content: "#64FFDA" },
      { name: "msapplication-TileColor", content: "#64FFDA" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", type: "image/svg+xml", href: FAVICON_SVG },
      { rel: "apple-touch-icon", sizes: "180x180", href: FAVICON_SVG },
      { rel: "dns-prefetch", href: "//fonts.googleapis.com" },
      { rel: "dns-prefetch", href: "//fonts.gstatic.com" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: GOOGLE_FONTS_HREF },
    ],
    scripts: [{ children: THEME_BOOTSTRAP }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: RootErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function WebVitalsMonitor({ children }: { children: ReactNode }) {
  useWebVitals();
  return <>{children}</>;
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <HelmetProvider>
      <QueryClientProvider client={queryClient}>
        <AuthProvider>
          <TooltipProvider>
            <WebVitalsMonitor>
              <GoogleAnalytics />
              <Toaster />
              <Sonner />
              <ScrollToTop />
              <div className="min-h-screen flex flex-col bg-background text-foreground">
                <SkipToContent />
                <Header />
                <main id="main" className="flex-1">
                  <ErrorBoundary>
                    <Outlet />
                  </ErrorBoundary>
                </main>
                <Footer />
              </div>
            </WebVitalsMonitor>
          </TooltipProvider>
        </AuthProvider>
      </QueryClientProvider>
    </HelmetProvider>
  );
}

function NotFoundComponent() {
  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 text-center px-4">
      <h1 className="text-4xl font-bold text-foreground">404</h1>
      <p className="text-muted-foreground">This page doesn&apos;t exist.</p>
      <a
        href="/"
        className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
      >
        Go home
      </a>
    </div>
  );
}

function RootErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();

  useEffect(() => {
    console.error(error);
    reportLovableError(error, { boundary: "tanstack_root_error_component" });
  }, [error]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 bg-background text-foreground px-4 text-center">
      <h1 className="text-2xl font-semibold">This page didn&apos;t load</h1>
      <p className="text-muted-foreground max-w-md">
        Something went wrong while rendering this page. You can try again or head back home.
      </p>
      <div className="flex gap-3">
        <button
          type="button"
          className="inline-flex items-center rounded-md bg-primary px-4 py-2 text-primary-foreground"
          onClick={() => {
            void router.invalidate();
            reset();
          }}
        >
          Try again
        </button>
        <a
          href="/"
          className="inline-flex items-center rounded-md border border-border px-4 py-2 text-foreground"
        >
          Go home
        </a>
      </div>
    </div>
  );
}
