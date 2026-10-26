'use client';

import React, { useState } from 'react';
import Image, { ImageProps } from 'next/image';
import { ImageIcon } from 'lucide-react';
import { cn } from '../../lib/utils';

export interface AppImageProps extends Omit<ImageProps, 'onLoad' | 'onError'> {
  /** Optional container extra class name */
  containerClassName?: string;
  /** Optional custom class name for the skeleton/loader box */
  skeletonClassName?: string;
  /** Whether to show the subtle center animated spinner along with shimmer (default true) */
  showSpinner?: boolean;
  /** Fallback image URL if the primary image fails to load */
  fallbackSrc?: string;
  /** Called when the image has finished loading */
  onLoad?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
  /** Called if image encounters an error loading */
  onError?: (event: React.SyntheticEvent<HTMLImageElement, Event>) => void;
}

/**
 * AppImage wraps Next.js Image with an animated shimmering skeleton loader
 * that smoothly transitions into the loaded picture and handles load errors gracefully.
 */
export function AppImage({
  src,
  alt,
  className,
  containerClassName,
  skeletonClassName,
  showSpinner = true,
  fallbackSrc,
  fill,
  width,
  height,
  priority,
  referrerPolicy = 'no-referrer',
  onLoad,
  onError,
  ...rest
}: AppImageProps) {
  const [prevSrc, setPrevSrc] = useState(src);
  const [isLoaded, setIsLoaded] = useState(false);
  const [hasError, setHasError] = useState(false);
  const [useFallback, setUseFallback] = useState(false);

  // If src changes externally, reset state during render (React recommended pattern)
  if (src !== prevSrc) {
    setPrevSrc(src);
    setIsLoaded(false);
    setHasError(false);
    setUseFallback(false);
  }

  const currentSrc = useFallback && fallbackSrc ? fallbackSrc : src;

  const handleLoad = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    setIsLoaded(true);
    onLoad?.(e);
  };

  const handleError = (e: React.SyntheticEvent<HTMLImageElement, Event>) => {
    if (fallbackSrc && !useFallback) {
      setUseFallback(true);
      setIsLoaded(false);
    } else {
      setHasError(true);
      setIsLoaded(true); // stop skeleton
    }
    onError?.(e);
  };

  return (
    <div
      className={cn(
        'relative overflow-hidden',
        fill ? 'w-full h-full' : 'inline-block',
        containerClassName
      )}
      style={!fill && width && height ? { width, height } : undefined}
    >
      {/* Animated Loading Skeleton */}
      {!isLoaded && !hasError && (
        <div
          className={cn(
            'absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-100/90 select-none overflow-hidden',
            skeletonClassName
          )}
          aria-busy="true"
          aria-label="Loading image..."
        >
          {/* Shimmer sweep animation */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent -translate-x-full animate-shimmer pointer-events-none" />

          {/* Subtle animated loader indicator */}
          {showSpinner && (
            <div className="relative z-10 flex flex-col items-center justify-center gap-1.5 opacity-60">
              <svg
                className="w-5 h-5 animate-spin text-stone-400"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="3"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          )}
        </div>
      )}

      {/* Error Fallback */}
      {hasError ? (
        <div className="absolute inset-0 z-10 flex flex-col items-center justify-center bg-stone-100 text-stone-400 p-3 text-center select-none">
          <ImageIcon className="w-6 h-6 stroke-[1.5] text-stone-300 mb-1" />
          <span className="text-[11px] font-mono tracking-tight text-stone-500">Image unavailable</span>
        </div>
      ) : (
        <Image
          {...rest}
          src={currentSrc}
          alt={alt}
          fill={fill}
          width={fill ? undefined : width}
          height={fill ? undefined : height}
          priority={priority}
          referrerPolicy={referrerPolicy}
          className={cn(
            className,
            'transition-opacity duration-500 ease-out',
            isLoaded ? 'opacity-100' : 'opacity-0'
          )}
          onLoad={handleLoad}
          onError={handleError}
        />
      )}
    </div>
  );
}

export default AppImage;
