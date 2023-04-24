// @type {import('next').NextConfig}
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['localhost', 'pasteboard.co', 'via.placeholder.com', 'i.postimg.cc'],
  },
};

module.exports = nextConfig;