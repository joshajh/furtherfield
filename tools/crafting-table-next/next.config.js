/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/social-generator',
  assetPrefix: '/social-generator',
  env: {
    NEXT_PUBLIC_BASE_PATH: '/social-generator',
  },
}

module.exports = nextConfig
