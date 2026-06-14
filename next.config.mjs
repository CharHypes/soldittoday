/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
    ],
  },
  // Consolidation: /communities is the canonical hub; the retired /service-areas
  // permanently redirects to it.
  async redirects() {
    return [
      { source: "/service-areas", destination: "/communities", permanent: true },
    ];
  },
};

export default nextConfig;
