/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  async redirects(){
    return[
      {
        source: '/',
        destination: '/auth/login',
        permanent: true
      }
    ]
  }
}

module.exports = nextConfig
