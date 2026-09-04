import latoLatin400Normal from "@fontsource/lato/files/lato-latin-400-normal.woff2?url";
import interLatinWghtNormal from "@fontsource-variable/inter/files/inter-latin-wght-normal.woff2?url";
import { TanStackDevtools } from "@tanstack/react-devtools";
import { createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";
import { TanStackRouterDevtoolsPanel } from "@tanstack/react-router-devtools";

import imgFavicon from "../assets/favicon.png";
import Footer from "../components/Footer";
import Header from "../components/Header";
import { createBaseMetadata } from "../lib/metadata";
import { baseLocale, getLocale } from "../paraglide/runtime";
import appCss from "../styles.css?url";

export const Route = createRootRoute({
  beforeLoad: async () => {
    // Other redirect strategies are possible; see
    // https://github.com/TanStack/router/tree/main/examples/react/i18n-paraglide#offline-redirect
    if (typeof document !== "undefined") {
      document.documentElement.setAttribute("lang", getLocale());
    }
  },

  head: ({ matches }) => {
    const currentPathname = matches[matches.length - 1]?.pathname ?? "/";
    const locale = getLocale();
    const baseMetadata = createBaseMetadata({
      isDomainHome: currentPathname === "/" && locale === baseLocale,
      isIndexable: currentPathname !== "/_shell",
      locale,
      pathname: currentPathname,
    });

    return {
      meta: [
        {
          charSet: "utf-8",
        },
        {
          name: "viewport",
          content: "width=device-width, initial-scale=1",
        },
        ...baseMetadata.meta,
      ],
      links: [
        ...baseMetadata.links,
        {
          rel: "stylesheet",
          href: appCss,
        },
        {
          rel: "preload",
          href: interLatinWghtNormal,
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
        },
        {
          rel: "preload",
          href: latoLatin400Normal,
          as: "font",
          type: "font/woff2",
          crossOrigin: "anonymous",
        },
        {
          rel: "icon",
          href: imgFavicon,
          type: "image/png",
        },
      ],
    };
  },
  shellComponent: RootDocument,
});

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang={getLocale()} className="overflow-x-clip md:overflow-x-visible">
      <head>
        <HeadContent />
      </head>
      <body className="overflow-x-clip font-sans antialiased wrap-anywhere selection:bg-[rgba(79,184,178,0.24)] md:overflow-x-visible">
        <Header />
        <div className="min-h-dvh">{children}</div>
        <Footer />
        <TanStackDevtools
          config={{
            position: "bottom-right",
          }}
          plugins={[
            {
              name: "Tanstack Router",
              render: <TanStackRouterDevtoolsPanel />,
            },
          ]}
        />
        <Scripts />
      </body>
    </html>
  );
}
