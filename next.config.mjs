/**
 * Static export so the whole site can be served from GitHub Pages.
 *
 * Custom domain (circuitkid.com)  -> leave NEXT_PUBLIC_BASE_PATH unset.
 * Project pages (user.github.io/circuitkid) -> set NEXT_PUBLIC_BASE_PATH=/circuitkid.
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH || '';

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  basePath,
  images: { unoptimized: true },
};

export default nextConfig;
