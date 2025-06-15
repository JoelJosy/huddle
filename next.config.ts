/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ocvyaicrbpqrhmkgrlay.supabase.co",
        pathname: "/storage/v1/object/public/**",
      },
    ],
    unoptimized: true,
  },
  experimental: {
    optimizePackageImports: [
      "lucide-react",
      "@tiptap/react",
      "@tiptap/starter-kit",
      "reactflow",
    ],
    serverComponentsHmrCache: true, // Cache Server Components during HMR
  },
  // Enable compression
  compress: true,
  // Enable static optimization
  output: "standalone",
};

export default nextConfig;
