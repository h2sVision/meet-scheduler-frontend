/** @type {import('next').NextConfig} */
const nextConfig = {
  distDir: 'out', // Output directory for build files
  reactStrictMode: true,
  async redirects() {
    return [
      {
        source: '/',
        destination: '/auth/login',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
