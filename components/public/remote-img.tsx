'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';

/**
 * Admin-supplied image URL. If it fails to load (deleted, blocked, offline)
 * it hides itself so the placeholder beneath shows instead of a broken icon.
 */
export function RemoteImg({
  src,
  alt,
  priority,
  className,
}: {
  src: string;
  alt: string;
  priority?: boolean;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) return null;
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={src}
      alt={alt}
      loading={priority ? 'eager' : 'lazy'}
      decoding="async"
      fetchPriority={priority ? 'high' : 'auto'}
      onError={() => setFailed(true)}
      className={cn('absolute inset-0 h-full w-full object-cover', className)}
    />
  );
}
