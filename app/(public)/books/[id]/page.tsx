import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Download } from 'lucide-react';
import { prisma } from '@/lib/db';
import { safeQuery } from '@/lib/public-data';
import { Photo } from '@/components/public/photo';
import { CtaLink } from '@/components/public/cta';
import { Reveal } from '@/components/public/reveal';
import { PlanVisitCTA } from '@/components/public/plan-visit-cta';
import { JsonLd } from '@/components/public/json-ld';
import { getSiteInfo } from '@/lib/site-info';
import { formatCategory, formatLongDate } from '@/lib/format';

export const revalidate = 60;

async function getBook(id: string) {
  const book = await prisma.book.findUnique({ where: { id } });
  return book && book.isAvailable ? book : null;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const book = await safeQuery(() => getBook(id), null);
  if (!book) return { title: 'Book not found' };
  const description = book.shortDescription || book.description.slice(0, 160);
  return {
    title: `${book.title} by ${book.author}`,
    description,
    alternates: { canonical: `/books/${book.id}` },
    openGraph: {
      title: `${book.title} by ${book.author}`,
      description,
      url: `/books/${book.id}`,
      type: 'book',
      ...(book.coverImageUrl && { images: [{ url: book.coverImageUrl }] }),
    },
  };
}

export default async function BookDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const [book, info] = await Promise.all([getBook(id), getSiteInfo()]);
  if (!book) notFound();

  const related = await prisma.book.findMany({
    where: { category: book.category, id: { not: book.id }, isAvailable: true },
    orderBy: { createdAt: 'desc' },
    take: 4,
  });

  const details = [
    ['ISBN', book.isbn],
    ['Publisher', book.publisher],
    ['Published', book.publishedDate ? formatLongDate(book.publishedDate) : null],
    ['Edition', book.edition],
    ['Pages', book.pageCount?.toString()],
    ['Language', book.language],
  ].filter((d): d is [string, string] => !!d[1]);

  return (
    <>
      <JsonLd
        data={{
          '@context': 'https://schema.org',
          '@type': 'Book',
          name: book.title,
          author: { '@type': 'Person', name: book.author },
          description: book.shortDescription || book.description,
          ...(book.isbn && { isbn: book.isbn }),
          ...(book.coverImageUrl && { image: book.coverImageUrl }),
          inLanguage: book.language,
        }}
      />
      <section className="on-dark relative isolate overflow-hidden bg-brand-navy pb-16 pt-32 text-white sm:pb-24 sm:pt-40">
        <Photo src={book.coverImageUrl} alt="" variant={1} className="scale-125 opacity-25 blur-3xl" />
        <div aria-hidden="true" className="absolute inset-0 bg-brand-navy/70" />
        <div className="wrap relative">
          <CtaLink href="/books" variant="text-light" arrow={false} className="mb-10">
            ← All books
          </CtaLink>
          <div className="grid items-center gap-12 md:grid-cols-12 md:gap-16">
            <div className="md:col-span-4">
              <div className="relative mx-auto aspect-[2/3] max-w-xs overflow-hidden rounded-xl bg-brand-900 shadow-2xl">
                <Photo src={book.coverImageUrl} alt={`Cover of ${book.title}`} variant={1} priority sizes="(min-width: 768px) 30vw, 70vw" />
              </div>
            </div>
            <div className="md:col-span-8">
              <p className="kicker mb-5 text-brand-300">{formatCategory(book.category)}</p>
              <h1 className="display-lg">{book.title}</h1>
              {book.subtitle && <p className="display-sm mt-3 text-brand-100">{book.subtitle}</p>}
              <p className="mt-5 text-lg text-brand-100">by {book.author}</p>
              {book.price && (
                <p className="font-display mt-6 text-3xl text-white">
                  {book.currency} {book.price.toString()}
                </p>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <CtaLink href={book.amazonUrl} variant="primary" external>
                  Buy on Amazon
                </CtaLink>
                {book.samplePdfUrl && (
                  <CtaLink href={book.samplePdfUrl} variant="outline-light" external arrow={false}>
                    <Download className="size-4" aria-hidden="true" /> Download sample
                  </CtaLink>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="on-light section-y bg-brand-50">
        <div className="wrap grid gap-14 lg:grid-cols-12 lg:gap-20">
          <Reveal className="lg:col-span-8">
            <h2 className="kicker mb-5 text-brand-700">About this book</h2>
            <p className="lead max-w-2xl whitespace-pre-wrap text-body">{book.description}</p>
            {book.tags.length > 0 && (
              <ul className="mt-10 flex flex-wrap gap-2" aria-label="Tags">
                {book.tags.map((t) => (
                  <li key={t} className="rounded-full border border-brand-200 px-4 py-1.5 text-sm text-body">
                    {t}
                  </li>
                ))}
              </ul>
            )}
          </Reveal>
          {details.length > 0 && (
            <Reveal className="lg:col-span-4" delay={100}>
              <h2 className="kicker mb-5 text-brand-700">Book details</h2>
              <dl className="divide-y divide-brand-200 border-y border-brand-200">
                {details.map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-6 py-4">
                    <dt className="text-body">{k}</dt>
                    <dd className="text-right text-brand-navy">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>
          )}
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="more-books" className="on-light section-y bg-brand-100">
          <div className="wrap">
            <h2 id="more-books" className="display-md mb-12 text-brand-navy">
              More books
            </h2>
            <ul className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((b, i) => (
                <li key={b.id} className="group relative">
                  <div className="relative aspect-[2/3] overflow-hidden rounded-xl bg-brand-900">
                    <Photo src={b.coverImageUrl} alt="" variant={i} zoom sizes="(min-width: 1024px) 22vw, 45vw" />
                  </div>
                  <h3 className="display-sm mt-5 line-clamp-2 text-brand-navy">
                    <Link href={`/books/${b.id}`} className="link-underline after:absolute after:inset-0 after:content-['']">
                      {b.title}
                    </Link>
                  </h3>
                  <p className="mt-1 text-sm text-body">{b.author}</p>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      <PlanVisitCTA info={info} />
    </>
  );
}
