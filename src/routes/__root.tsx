import { createRootRoute, HeadContent, Outlet, Scripts } from "@tanstack/react-router";
import { AuthProvider } from "@/lib/auth/provider";
import { PreviewHostBridge } from "@/components/preview-host-bridge";
import { Toaster } from "sonner";
import { AppOverlays } from "@/components/AppOverlays";
import appCss from "../styles.css?url";

const APP_NAME = "星语号";

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1, viewport-fit=cover" },
      { title: APP_NAME },
      { name: "theme-color", content: "#0E1A3A" },
      { name: "description", content: "小学 AI 编程 · Agent 原生课堂。星光驯养员，去把伙伴唤醒。" },
    ],
    links: [
      { rel: "icon", type: "image/svg+xml", href: "/favicon.svg" },
      { rel: "stylesheet", href: appCss },
      { rel: "manifest", href: "/__grok/manifest.webmanifest" },
      { rel: "apple-touch-icon", href: "/__grok/icon-180.png" },
    ],
  }),
  component: () => (
    <html lang="zh-CN" className="antialiased" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body className="min-h-dvh bg-navy text-cream">
        <PreviewHostBridge />
        <AuthProvider>
          <Outlet />
          <AppOverlays />
        </AuthProvider>
        <Toaster
          position="top-center"
          toastOptions={{
            style: {
              background: "#F7F0E4",
              color: "#1B1635",
              border: "none",
              borderRadius: "18px",
              fontFamily: "Fredoka, Noto Sans SC, sans-serif",
              fontWeight: 600,
            },
          }}
        />
        <Scripts />
      </body>
    </html>
  ),
});
