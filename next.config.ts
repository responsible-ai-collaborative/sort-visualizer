import type { NextConfig } from "next";

// On GitHub Pages this deploys to a *project* page served under
// https://<user>.github.io/<repo>/, so the app needs a basePath.
// Locally (pnpm dev / pnpm build) GITHUB_ACTIONS is unset, so basePath is "".
const repo = "sort_visualizer";
const isGithubPages = process.env.GITHUB_ACTIONS === "true";
const basePath = isGithubPages ? `/${repo}` : "";

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
