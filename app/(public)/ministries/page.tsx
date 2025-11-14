import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight } from 'lucide-react';
import { prisma } from '@/lib/db';

async function getMinistries() {
  const ministries = await prisma.ministry.findMany({
    where: {
      isActive: true,
      displayOnWebsite: true,
    },
    include: {
      _count: {
        select: {
          members: true,
        },
      },
    },
    orderBy: { sortOrder: 'asc' },
  });

  return ministries;
}

export default async function MinistriesPage() {
  const ministries = await getMinistries();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Our Ministries
            </h1>
            <p className="text-xl text-blue-100">
              Find your place to serve, grow, and make a difference
            </p>
          </div>
        </div>
      </section>

      {/* Ministries Grid */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {ministries.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-lg text-gray-600">
                Check back soon for our ministry opportunities!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {ministries.map((ministry) => (
                <Link key={ministry.id} href={`/ministries/${ministry.slug}`}>
                  <Card className="h-full hover:shadow-xl transition-all border-blue-200 group">
                    {ministry.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                        <img
                          src={ministry.imageUrl}
                          alt={ministry.name}
                          className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-start justify-between gap-2 mb-2">
                        <CardTitle className="text-xl text-blue-900 group-hover:text-blue-700 transition-colors">
                          {ministry.name}
                        </CardTitle>
                        <ArrowRight className="h-5 w-5 text-blue-600 group-hover:translate-x-1 transition-transform" />
                      </div>
                      {ministry.description && (
                        <CardDescription className="line-clamp-3">
                          {ministry.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between">
                        <Badge variant="secondary" className="text-xs">
                          {ministry._count.members} members
                        </Badge>
                        {ministry.meetingDay && (
                          <span className="text-xs text-blue-600">
                            {ministry.meetingDay}
                            {ministry.meetingTime && ` • ${ministry.meetingTime}`}
                          </span>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl mb-4">
              Want to Get Involved?
            </h2>
            <p className="text-lg text-gray-600 mb-8">
              We'd love to help you find the perfect ministry fit for your gifts and passions.
            </p>
            <Link href="/contact">
              <button className="rounded-md bg-blue-900 px-6 py-3 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900">
                Contact Us
              </button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
