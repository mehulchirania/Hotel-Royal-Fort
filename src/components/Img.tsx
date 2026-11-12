import React, { useState } from 'react';
import { ImageOff } from 'lucide-react';
import { images, type ImageName } from '../data/images.generated';

interface ImgProps {
  name: ImageName;
  alt: string;
  className?: string;
  /** Viewport-width hint for picking a srcset variant. Defaults to full width. */
  sizes?: string;
  /** Set on the hero image only — everything else should stay lazy. */
  priority?: boolean;
}

/**
 * Shared image element. Every photo on the site goes through here so they all
 * get responsive sources, lazy loading, and a placeholder that fills the frame
 * while loading or if the file is missing — previously a failed image left a
 * large empty void in the card.
 */
export function Img({ name, alt, className = '', sizes = '100vw', priority = false }: ImgProps) {
  const asset = images[name];
  const [status, setStatus] = useState<'loading' | 'loaded' | 'error'>('loading');

  if (status === 'error') {
    return (
      <div
        className={`flex flex-col items-center justify-center gap-1.5 bg-gray-100 text-gray-400 ${className}`}
        role="img"
        aria-label={alt}
      >
        <ImageOff className="w-6 h-6" aria-hidden="true" />
        <span className="text-[11px] font-medium px-2 text-center">{alt}</span>
      </div>
    );
  }

  return (
    <img
      src={asset.src}
      srcSet={asset.srcSet}
      sizes={sizes}
      alt={alt}
      width={1000}
      height={Math.round(1000 / asset.aspectRatio)}
      loading={priority ? 'eager' : 'lazy'}
      // fetchPriority is still missing from React's JSX typings in some versions.
      {...({ fetchpriority: priority ? 'high' : 'auto' } as Record<string, string>)}
      decoding={priority ? 'sync' : 'async'}
      onLoad={() => setStatus('loaded')}
      onError={() => setStatus('error')}
      className={`${className} ${status === 'loading' ? 'bg-gray-100' : ''}`}
    />
  );
}
