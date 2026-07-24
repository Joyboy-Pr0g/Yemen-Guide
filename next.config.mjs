/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  // Required for Font Awesome SSR in Next.js App Router
  transpilePackages: [
    '@fortawesome/fontawesome-svg-core',
    '@fortawesome/free-solid-svg-icons',
    '@fortawesome/react-fontawesome',
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '3000',
        pathname: '/api/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/storage/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '3000',
        pathname: '/api/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
      },
      {
        protocol: 'https',
        hostname: 's3.eu-central-2.idrivee2.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 's3.eu-central-1.idrivee2.com',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'api.dulni-sy.com',
        pathname: '/storage/**',
      },
      {
        protocol: 'https',
        hostname: 'dulni-sy.com',
        pathname: '/api/**',
      },
    ],
  },
}

export default nextConfig
