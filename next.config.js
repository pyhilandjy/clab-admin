/** @type {import('next').NextConfig} */
const nextConfig = {
  env: {
    NEXT_PUBLIC_API_URL:
      process.env.NEXT_PUBLIC_API_URL ||
      'https://admin.apicall.connects-lab.com',
  },
  images: {
    domains: ['admin.apicall.connects-lab.com', 'localhost'],
  },
};

module.exports = nextConfig;
