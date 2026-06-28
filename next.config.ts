import type { NextConfig } from 'next';
import createNextIntlPlugin from 'next-intl/plugin';

const withNextIntl = createNextIntlPlugin('./src/i18n/request.ts');

const nextConfig: NextConfig = {
  images: {
    // Custom loader: uses Cloudflare Image Resizing (cdn-cgi/image) when
    // NEXT_PUBLIC_CF_IMAGES=true; falls back to original URL otherwise.
    loader: 'custom',
    loaderFile: './src/lib/assets/cloudflare-image-loader.ts',
    // Matches common mobile breakpoints (390 = iPhone 14) through 4K.
    deviceSizes: [390, 640, 750, 828, 1080, 1200, 1920, 2560],
    // Thumbnail/icon sizes for fill-mode images in small containers.
    imageSizes: [64, 128, 256, 384, 512],
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 31536000,
    // remotePatterns kept for next/image domain validation even with custom loader.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'pub-fb20589839af46f69072388882397132.r2.dev',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'media.be4best.com',
        pathname: '/**',
      },
    ],
  },
  experimental: {
    optimizePackageImports: ['lucide-react', 'framer-motion'],
  },
};

export default withNextIntl(nextConfig);
