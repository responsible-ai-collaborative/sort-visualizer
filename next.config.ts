import type { NextConfig } from "next";

// Deployed via a custom domain (sortingai.incidentdatabase.ai) configured in
// the repo's GitHub Pages settings, so the site is served from the domain
// root — no basePath needed, unlike a default <user>.github.io/<repo>/ page.
const basePath = "";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  // Emit a fully static site into `out/` for GitHub Pages.
  output: "export",
  basePath,
  // GH Pages serves clean URLs from directory/index.html.
  trailingSlash: true,
  // No image optimization server on GitHub Pages.
  images: { unoptimized: true },
  // Exposed so client code / assets can prefix the basePath if needed.
  env: { NEXT_PUBLIC_BASE_PATH: basePath },
};

export default nextConfig;
