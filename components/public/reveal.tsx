'use client';

import { useEffect, useRef } from 'react';

/**
 * Gentle fade/slide-in as a section enters the viewport.
 *
 * Content is fully visible in the server HTML (works without JS). On mount,
 * only elements that start *below* the fold are hidden, then revealed on
 * scroll — so nothing above the fold ever flashes. The `data-reveal`
 * attribute is toggled directly on the DOM node (React never renders it), and
 * prefers-reduced-motion is handled in CSS.
 */
export function Reveal({
  children,
  className,
  delay = 0,
  as: Tag = 'div',
}: {
  children: React.ReactNode;
  className?: string;
  /** ms */
  delay?: number;
  as?: React.ElementType;
}) {
  const ref = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === 'undefined') return;

    const { top } = el.getBoundingClientRect();
    if (top < window.innerHeight * 0.92) return; // already in view: leave visible

    el.dataset.reveal = 'hidden';
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          el.dataset.reveal = 'shown';
          observer.disconnect();
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref}
      style={delay ? ({ ['--reveal-delay' as string]: `${delay}ms` } as React.CSSProperties) : undefined}
      className={className}
    >
      {children}
    </Tag>
  );
}
