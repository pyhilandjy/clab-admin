/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    BACKEND_URL: process.env.NEXT_PUBLIC_API_URL,
  },
  images: {
    domains: ['apicall.connects-lab.com', 'localhost'],
  },
};

module.exports = nextConfig;
