import { notFound } from 'next/navigation';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Users, Calendar, MapPin, Mail, Phone } from 'lucide-react';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

async function getMinistry(slug: string) {
  const ministry = await prisma.ministry.findUnique({
    where: {
      slug,
      isActive: true,
      displayOnWebsite: true,
    },
    include: {
      leader: {
        select: {
          name: true,
          email: true,
        },
      },
      events: {
        where: {
          eventDate: { gte: new Date() },
          status: 'SCHEDULED',
          displayOnWebsite: true,
        },
        orderBy: { eventDate: 'asc' },
        take: 6,
      },
      _count: {
        select: {
          members: true,
          events: true,
        },
      },
    },
  });

  return ministry;
}

export default async function MinistryDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const ministry = await getMinistry(slug);

  if (!ministry) {
    notFound();
  }

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-20">
        {ministry.bannerUrl && (
          <div className="absolute inset-0 opacity-20">
            <img
              src={ministry.bannerUrl}
              alt={ministry.name}
              className="h-full w-full object-cover"
            />
          </div>
        )}
        <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
          <Link
            href="/ministries"
            className="inline-flex items-center gap-2 text-blue-200 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Ministries
          </Link>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-4">
              {ministry.name}
            </h1>
            {ministry.description && (
              <p className="text-xl text-blue-100">
                {ministry.description}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {/* Main Info */}
            <div className="lg:col-span-2 space-y-8">
              {/* Vision */}
              {ministry.vision && (
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Vision</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{ministry.vision}</p>
                </div>
              )}

              {/* Mission */}
              {ministry.mission && (
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Our Mission</h2>
                  <p className="text-gray-600 whitespace-pre-wrap">{ministry.mission}</p>
                </div>
              )}

              {/* Upcoming Events */}
              {ministry.events.length > 0 && (
                <div>
                  <h2 className="text-2xl font-bold text-blue-900 mb-4">Upcoming Events</h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    {ministry.events.map((event) => (
                      <Card key={event.id} className="border-blue-200">
                        <CardHeader>
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className="bg-blue-600 text-white">
                              {format(new Date(event.eventDate), 'MMM dd')}
                            </Badge>
                            {event.startTime && (
                              <span className="text-sm text-blue-600">{event.startTime}</span>
                            )}
                          </div>
                          <CardTitle className="text-lg text-blue-900">{event.title}</CardTitle>
                          {event.location && (
                            <CardDescription className="flex items-center gap-1 text-xs">
                              <MapPin className="h-3 w-3" />
                              {event.location}
                            </CardDescription>
                          )}
                        </CardHeader>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Meeting Info */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Meeting Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  {ministry.meetingDay && (
                    <div className="flex items-start gap-2">
                      <Calendar className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{ministry.meetingDay}</p>
                        {ministry.meetingTime && (
                          <p className="text-sm text-gray-600">{ministry.meetingTime}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {ministry.meetingLocation && (
                    <div className="flex items-start gap-2">
                      <MapPin className="h-5 w-5 text-blue-600 mt-0.5" />
                      <p className="text-sm text-gray-600">{ministry.meetingLocation}</p>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Leadership */}
              {ministry.leader && (
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Leadership</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{ministry.leader.name}</p>
                      <p className="text-xs text-gray-600">Ministry Leader</p>
                    </div>
                    {ministry.leader.email && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <a
                          href={`mailto:${ministry.leader.email}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {ministry.leader.email}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Contact */}
              {(ministry.contactEmail || ministry.contactPhone) && (
                <Card className="border-blue-200">
                  <CardHeader>
                    <CardTitle className="text-blue-900">Contact</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {ministry.contactEmail && (
                      <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-blue-600" />
                        <a
                          href={`mailto:${ministry.contactEmail}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {ministry.contactEmail}
                        </a>
                      </div>
                    )}
                    {ministry.contactPhone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-blue-600" />
                        <a
                          href={`tel:${ministry.contactPhone}`}
                          className="text-sm text-blue-600 hover:text-blue-800"
                        >
                          {ministry.contactPhone}
                        </a>
                      </div>
                    )}
                  </CardContent>
                </Card>
              )}

              {/* Stats */}
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Ministry Stats</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Members</span>
                    </div>
                    <span className="text-lg font-semibold text-blue-900">
                      {ministry._count.members}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-blue-600" />
                      <span className="text-sm text-gray-600">Events</span>
                    </div>
                    <span className="text-lg font-semibold text-blue-900">
                      {ministry._count.events}
                    </span>
                  </div>
                </CardContent>
              </Card>

              {/* CTA */}
              <Card className="bg-gradient-to-br from-blue-900 to-blue-950 text-white border-0">
                <CardHeader>
                  <CardTitle>Get Involved</CardTitle>
                  <CardDescription className="text-blue-200">
                    Interested in joining this ministry?
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href="/contact">
                    <button className="w-full rounded-md bg-white px-4 py-2 text-sm font-semibold text-blue-900 shadow-sm hover:bg-blue-50">
                      Contact Us
                    </button>
                  </Link>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
