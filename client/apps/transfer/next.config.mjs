import transpileModules from 'next-transpile-modules'

const withTH = transpileModules(['@pancakeswap/uikit', "@pancakeswap/wagmi"])

/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  compiler: {
    styledComponents: true,
  },
  experimental: {
    images: {
      allowFutureImage: true,
    },
  },
  async headers() {
    return [
        {
            // matching all API routes
            source: "https://api.angle.money/v1/:path*",
            headers: [
                { key: "Access-Control-Allow-Credentials", value: "true" },
                { key: "Access-Control-Allow-Origin", value: "https://baseswap.fi/:path*, http://localhost:3000" },
                { key: "Access-Control-Allow-Methods", value: "GET,DELETE,PATCH,POST,PUT" },
                { key: "Access-Control-Allow-Headers", value: "X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version" },
            ]
        }
    ]},
}

export default withTH(nextConfig)
