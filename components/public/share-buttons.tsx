'use client';

import { useState } from 'react';
import { Check, Facebook, Link2, MessageCircle, Share2 } from 'lucide-react';
import { cn } from '@/lib/utils';

/** Share via WhatsApp, Facebook, the native share sheet (mobile) or copy-link. */
export function ShareButtons({ url, title, tone = 'light' }: { url: string; title: string; tone?: 'light' | 'dark' }) {
  const [copied, setCopied] = useState(false);
  const [canNativeShare] = useState(() => typeof navigator !== 'undefined' && typeof navigator.share === 'function');

  const btn = cn(
    'inline-flex min-h-11 items-center gap-2 rounded-lg border px-4 text-[0.8rem] font-semibold uppercase tracking-[0.12em] transition-colors',
    tone === 'dark'
      ? 'border-white/25 text-white hover:border-white hover:bg-white/10'
      : 'border-brand-200 text-brand-navy hover:border-brand-700 hover:bg-brand-700 hover:text-white',
  );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      window.prompt('Copy this link', url);
    }
  };

  return (
    <div className="flex flex-wrap gap-3" role="group" aria-label="Share this page">
      <a
        className={btn}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://wa.me/?text=${encodeURIComponent(`${title} ${url}`)}`}
      >
        <MessageCircle className="size-4" aria-hidden="true" /> WhatsApp
      </a>
      <a
        className={btn}
        target="_blank"
        rel="noopener noreferrer"
        href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`}
      >
        <Facebook className="size-4" aria-hidden="true" /> Facebook
      </a>
      {canNativeShare && (
        <button type="button" className={btn} onClick={() => navigator.share({ title, url }).catch(() => {})}>
          <Share2 className="size-4" aria-hidden="true" /> Share
        </button>
      )}
      <button type="button" className={btn} onClick={copy}>
        {copied ? <Check className="size-4" aria-hidden="true" /> : <Link2 className="size-4" aria-hidden="true" />}
        <span aria-live="polite">{copied ? 'Link copied' : 'Copy link'}</span>
      </button>
    </div>
  );
}
