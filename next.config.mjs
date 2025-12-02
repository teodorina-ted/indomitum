// next.config.mjs (V6 - Updated: 2025-07-29 - Removed dangerouslyAllowSVG)

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      // Add other image domains here if needed
    ],
    // dangerouslyAllowSVG is no longer a valid top-level option or within remotePatterns
    // for this Next.js version. Use 'unoptimized' prop on Image component for SVGs.
  },
};

export default nextConfig;
