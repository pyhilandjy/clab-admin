/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['admin.apicall.connects-lab.com', 'localhost'],
  },
  experimental: {
    missingSuspenseWithCSRBailout: false,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
};

module.exports = nextConfig;
