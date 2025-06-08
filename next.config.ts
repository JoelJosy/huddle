/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "ocvyaicrbpqrhmkgrlay.supabase.co",
        pathname: "/storage/v1/object/public/my-images/**",
      },
    ],
  },
};

module.exports = nextConfig;
