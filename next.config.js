/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL || 'http://localhost:2456',
  },
  images: {
    domains: ['apicall.connects-lab.com', 'localhost'],
  },
};

module.exports = nextConfig;
