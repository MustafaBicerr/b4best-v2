import Image, { type ImageProps } from 'next/image';
import { cn } from '@/lib/utils/cn';
import type { TextSafeArea } from '@/types/metadata';

interface MediaImageProps extends Omit<ImageProps, 'alt'> {
  alt: string;
  focalX?: number;
  focalY?: number;
  textSafeArea?: TextSafeArea;
  fill?: boolean;
  aspectRatio?: string;
  className?: string;
  wrapperClassName?: string;
  /**
   * sizes attribute — tells the browser what width this image will be
   * rendered at so it can pick the best srcset entry.
   * ALWAYS provide this when using fill mode for responsive images.
   * Examples:
   *   "100vw"                                   — full-width hero
   *   "(max-width: 640px) 50vw, 25vw"           — grid card
   *   "(max-width: 640px) 50vw, (max-width: 1280px) 33vw, 25vw"
   */
  sizes?: string;
  /**
   * priority={true} maps to fetchPriority="high" + disables lazy loading.
   * Use for the first visible (LCP) image on each page.
   */
  priority?: boolean;
}

/**
 * The project's canonical image component.
 *
 * - Wraps next/image with Cloudflare Image Resizing loader (cdn-cgi/image).
 * - Requires `alt` (TypeScript enforces it).
 * - Use `priority={true}` for above-the-fold / LCP images.
 * - Always pass `sizes` for responsive fill-mode images.
 * - focalX / focalY control CSS object-position.
 */
export function MediaImage({
  alt,
  focalX,
  focalY,
  textSafeArea: _textSafeArea,
  fill = false,
  aspectRatio,
  className,
  wrapperClassName,
  style,
  sizes,
  priority = false,
  ...props
}: MediaImageProps) {
  const objectPosition =
    focalX !== undefined && focalY !== undefined
      ? `${focalX}% ${focalY}%`
      : 'center';

  const imageStyle: React.CSSProperties = {
    objectFit: 'cover',
    objectPosition,
    ...style,
  };

  if (fill) {
    return (
      <div className={cn('relative overflow-hidden', wrapperClassName)}>
        <Image
          alt={alt}
          fill
          sizes={sizes ?? '100vw'}
          priority={priority}
          style={imageStyle}
          className={cn('transition-transform duration-700', className)}
          {...props}
        />
      </div>
    );
  }

  if (aspectRatio) {
    return (
      <div
        className={cn('relative overflow-hidden', wrapperClassName)}
        style={{ aspectRatio }}
      >
        <Image
          alt={alt}
          fill
          sizes={sizes ?? '100vw'}
          priority={priority}
          style={imageStyle}
          className={cn('transition-transform duration-700', className)}
          {...props}
        />
      </div>
    );
  }

  return (
    <Image
      alt={alt}
      sizes={sizes}
      priority={priority}
      style={imageStyle}
      className={cn(className)}
      {...props}
    />
  );
}

/**
 * Shimmer skeleton shown while an image loads.
 * Use inside a positioned container alongside a MediaImage.
 */
export function ImageSkeleton({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        'bg-gradient-to-r from-cream-dark via-cream to-cream-dark',
        'animate-[shimmer_2s_infinite]',
        '[background-size:200%_100%]',
        className
      )}
      aria-hidden="true"
    />
  );
}
