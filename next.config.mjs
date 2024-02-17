/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config, { webpack, isServer, nextRuntime }) => {
    // Avoid AWS SDK Node.js require issue
    config.resolve.fallback = {
      "mongodb-client-encryption": false,
      aws4: false,
    };

    return config;
  },
};

export default nextConfig;
