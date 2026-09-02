import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/robots.txt")({
  server: {
    handlers: {
      GET: async () => {
        if (import.meta.env.VITE_SITE_URL !== "https://curioswitch.org") {
          return new Response("User-agent: *\nDisallow: /", {
            headers: {
              "Content-Type": "text/plain",
            },
          });
        }
        const robots = `User-agent: *
Allow: /

Sitemap: https://curioswitch.org/sitemap.xml`;

        return new Response(robots, {
          headers: {
            "Content-Type": "text/plain",
          },
        });
      },
    },
  },
});
