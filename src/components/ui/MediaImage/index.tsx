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
}

/**
 * The project's canonical image component.
 *
 * - Wraps next/image with support for focalPoint (object-position),
 *   textSafeArea metadata, and optional aspect-ratio wrapper.
 * - `alt` is always required (TypeScript enforces it).
 * - All asset URLs must come from url helpers, never hardcoded.
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
      style={imageStyle}
      className={cn(className)}
      {...props}
    />
  );
}

/**
 * Image skeleton shown while the real image loads.
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
