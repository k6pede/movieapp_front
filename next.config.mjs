/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
        domains: ['image.tmdb.org'],
      },
      experimental: {
        esmExternals: false,
      },
    
};

export default nextConfig;
