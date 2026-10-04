import type { Metadata } from 'next';
import Link from 'next/link';
import { PageHero } from '@/components/public/page-hero';
import { Photo } from '@/components/public/photo';
import { CtaLink } from '@/components/public/cta';
import { EmptyState } from '@/components/public/empty-state';
import { Reveal } from '@/components/public/reveal';
import { prisma } from '@/lib/db';
import { safeQuery } from '@/lib/public-data';
import { formatCategory } from '@/lib/format';

export const revalidate = 60;

export const metadata: Metadata = {
  title: 'Books',
  description: 'Books by Apostle Charles Magaiza — biblical insight and encouragement to strengthen your faith.',
  alternates: { canonical: '/books' },
  openGraph: { title: 'Books | El Shaddai World Ministries', url: '/books' },
};

export default async function BooksPage() {
  const books = await safeQuery(
    () =>
      prisma.book.findMany({
        where: { isAvailable: true },
        orderBy: [{ isFeatured: 'desc' }, { displayOrder: 'asc' }, { createdAt: 'desc' }],
      }),
    [],
  );

  const [lead, ...rest] = books;

  return (
    <>
      <PageHero
        variant={0}
        kicker="Books"
        title={
          <>
            Words that <em className="text-gold-light">strengthen.</em>
          </>
        }
        description="Books by Apostle Charles Magaiza, written to inspire, teach and encourage your walk with God."
      />

      <section aria-label="Books" className="on-light section-y bg-ivory">
        <div className="wrap">
          {books.length === 0 ? (
            <EmptyState title="New books are coming soon." description="Check back soon for new releases.">
              <CtaLink href="/sermons" variant="dark">
                Explore sermons
              </CtaLink>
            </EmptyState>
          ) : (
            <>
              {/* Lead book */}
              <Reveal className="grid items-center gap-10 border-b border-stone-200 pb-16 md:grid-cols-12 md:gap-16">
                <Link href={`/books/${lead.id}`} className="group md:col-span-4" aria-label={lead.title}>
                  <div className="relative mx-auto aspect-[2/3] max-w-xs overflow-hidden rounded-xl bg-ink-900 shadow-[0_30px_50px_-30px_rgba(13,15,18,0.6)]">
                    <Photo src={lead.coverImageUrl} alt="" variant={1} zoom sizes="(min-width: 768px) 30vw, 70vw" />
                  </div>
                </Link>
                <div className="md:col-span-8">
                  <p className="kicker mb-4 text-bronze">{lead.isFeatured ? 'Featured' : formatCategory(lead.category)}</p>
                  <h2 className="display-lg text-ink-900">
                    <Link href={`/books/${lead.id}`} className="link-underline">
                      {lead.title}
                    </Link>
                  </h2>
                  {lead.subtitle && <p className="display-sm mt-3 text-stone-600">{lead.subtitle}</p>}
                  <p className="mt-4 text-stone-600">by {lead.author}</p>
                  {lead.shortDescription && <p className="lead mt-6 max-w-xl text-stone-600">{lead.shortDescription}</p>}
                  <div className="mt-9 flex flex-wrap items-center gap-x-8 gap-y-4">
                    <CtaLink href={lead.amazonUrl} variant="dark" external>
                      Buy now
                    </CtaLink>
                    <CtaLink href={`/books/${lead.id}`} variant="text-dark">
                      Details
                    </CtaLink>
                  </div>
                </div>
              </Reveal>

              {rest.length > 0 && (
                <ul className="mt-16 grid gap-x-8 gap-y-14 sm:grid-cols-2 lg:grid-cols-4">
                  {rest.map((book, i) => (
                    <Reveal as="li" key={book.id} delay={(i % 4) * 70}>
                      <article className="group relative">
                        <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-ink-900">
                          <Photo src={book.coverImageUrl} alt="" variant={i} zoom sizes="(min-width: 1024px) 22vw, 45vw" />
                        </div>
                        <h3 className="display-sm mt-5 line-clamp-2 text-ink-900">
                          <Link href={`/books/${book.id}`} className="link-underline after:absolute after:inset-0 after:content-['']">
                            {book.title}
                          </Link>
                        </h3>
                        <p className="mt-1 text-sm text-stone-600">
                          {book.author}
                          {book.price && <> &middot; {book.currency} {book.price.toString()}</>}
                        </p>
                      </article>
                    </Reveal>
                  ))}
                </ul>
              )}
            </>
          )}
        </div>
      </section>
    </>
  );
}
