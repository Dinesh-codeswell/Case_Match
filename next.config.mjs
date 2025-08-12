/** @type {import('next').NextConfig} */
const nextConfig = {
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: [
      'storage.googleapis.com',
      'prod.spline.design',
      'upload.wikimedia.org',
      'www.canva.com',
      'docs.google.com',
      'drive.google.com',
      'blob.v0.dev',
      'media.licdn.com'
    ],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'storage.googleapis.com',
        port: '',
        pathname: '/a1aa/image/**',
      },
      {
        protocol: 'https',
        hostname: 'prod.spline.design',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'www.canva.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'docs.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'drive.google.com',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'blob.v0.dev',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.licdn.com',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Exclude Spline from server-side rendering completely
    if (isServer) {
      config.externals.push('@splinetool/react-spline/next', '@splinetool/runtime')
    }

    config.externals.push({
      'utf-8-validate': 'commonjs utf-8-validate',
      'bufferutil': 'commonjs bufferutil',
    })

    return config
  },
  // Reduce build timeout issues
  experimental: {
    workerThreads: false,
    cpus: 1,
  },
}

export default nextConfig
