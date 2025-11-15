import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowRight, Church, Users, Calendar, Heart, BookOpen, Sparkles } from 'lucide-react';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

async function getPublicData() {
  const [upcomingEvents, ministries] = await Promise.all([
    prisma.event.findMany({
      where: {
        eventDate: { gte: new Date() },
        status: 'SCHEDULED',
        displayOnWebsite: true,
      },
      orderBy: { eventDate: 'asc' },
      take: 3,
    }),
    prisma.ministry.findMany({
      where: {
        isActive: true,
        displayOnWebsite: true,
      },
      orderBy: { sortOrder: 'asc' },
      take: 6,
    }),
  ]);

  return { upcomingEvents, ministries };
}

export default async function HomePage() {
  const { upcomingEvents, ministries } = await getPublicData();

  const features = [
    {
      icon: Church,
      title: 'Spirit-Filled Worship',
      description: 'Experience the presence of God through passionate worship and powerful preaching.',
    },
    {
      icon: BookOpen,
      title: 'Bible Teaching',
      description: 'Grow in your faith through sound biblical teaching and discipleship.',
    },
    {
      icon: Users,
      title: 'Community',
      description: 'Connect with a loving community that supports and encourages one another.',
    },
    {
      icon: Heart,
      title: 'Care & Support',
      description: 'Find help and encouragement through our pastoral care and support groups.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        {/* Animated gradient orbs */}
        <div className="absolute top-0 -left-4 w-72 h-72 bg-blue-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob" />
        <div className="absolute top-0 -right-4 w-72 h-72 bg-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000" />
        <div className="absolute -bottom-8 left-20 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000" />

        <div className="relative mx-auto max-w-7xl px-6 py-24 sm:py-32 lg:px-8">
          <div className="mx-auto max-w-2xl text-center">
            <div className="mb-8 inline-flex items-center gap-2 rounded-full bg-blue-800/50 px-4 py-2 text-sm backdrop-blur-sm border border-blue-700/50 hover:bg-blue-700/50 transition-all duration-300 hover:scale-105">
              <Sparkles className="h-4 w-4 text-blue-300 animate-pulse" />
              <span className="text-blue-200">Welcome to El Shaddai</span>
            </div>
            <h1 className="text-4xl font-bold tracking-tight sm:text-6xl mb-6 animate-fade-in-up">
              Transforming Lives Through God's Love
            </h1>
            <p className="text-lg leading-8 text-blue-100 mb-10 animate-fade-in-up animation-delay-200">
              Join us as we worship together, grow in faith, and make a difference in our community and the world.
            </p>
            <div className="flex items-center justify-center gap-4 animate-fade-in-up animation-delay-400">
              <Link href="/about">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  Learn More
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              </Link>
              <Link href="/events">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl">
                  View Events
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Service Times */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
              Join Us This Week
            </h2>
            <p className="mt-4 text-lg text-blue-700">
              You're always welcome at El Shaddai World Ministries
            </p>
          </div>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
            <Card className="border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer bg-gradient-to-br from-white to-blue-50/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 w-fit p-3 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300">
                  <Calendar className="h-12 w-12 text-blue-600 group-hover:text-white transition-colors duration-300 group-hover:scale-110 transform" />
                </div>
                <CardTitle className="text-blue-900 group-hover:text-blue-700 transition-colors">Sunday Service</CardTitle>
                <CardDescription>Main Worship Service</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-blue-900 group-hover:scale-105 transition-transform">9:00 AM & 11:00 AM</p>
                <p className="text-sm text-blue-600 mt-2">Every Sunday</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer bg-gradient-to-br from-white to-blue-50/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 w-fit p-3 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300">
                  <BookOpen className="h-12 w-12 text-blue-600 group-hover:text-white transition-colors duration-300 group-hover:scale-110 transform" />
                </div>
                <CardTitle className="text-blue-900 group-hover:text-blue-700 transition-colors">Bible Study</CardTitle>
                <CardDescription>Midweek Teaching</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-blue-900 group-hover:scale-105 transition-transform">6:00 PM</p>
                <p className="text-sm text-blue-600 mt-2">Every Wednesday</p>
              </CardContent>
            </Card>

            <Card className="border-blue-200 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group cursor-pointer bg-gradient-to-br from-white to-blue-50/50">
              <CardHeader className="text-center">
                <div className="mx-auto mb-2 w-fit p-3 rounded-full bg-blue-100 group-hover:bg-blue-600 transition-colors duration-300">
                  <Heart className="h-12 w-12 text-blue-600 group-hover:text-white transition-colors duration-300 group-hover:scale-110 transform" />
                </div>
                <CardTitle className="text-blue-900 group-hover:text-blue-700 transition-colors">Prayer Meeting</CardTitle>
                <CardDescription>Corporate Prayer</CardDescription>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-2xl font-bold text-blue-900 group-hover:scale-105 transition-transform">7:00 PM</p>
                <p className="text-sm text-blue-600 mt-2">Every Friday</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
              What We Offer
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Experience a church that feels like family
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature) => {
              const Icon = feature.icon;
              return (
                <div key={feature.title} className="text-center group cursor-pointer">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-blue-100 mb-4 group-hover:bg-gradient-to-br group-hover:from-blue-600 group-hover:to-blue-800 transition-all duration-300 group-hover:scale-110 group-hover:shadow-lg">
                    <Icon className="h-8 w-8 text-blue-600 group-hover:text-white transition-colors duration-300 group-hover:rotate-6 transform" />
                  </div>
                  <h3 className="text-lg font-semibold text-blue-900 mb-2 group-hover:text-blue-700 transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                    {feature.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Ministries Preview */}
      {ministries.length > 0 && (
        <section className="bg-blue-50 py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
                  Our Ministries
                </h2>
                <p className="mt-2 text-lg text-blue-700">
                  Find your place to serve and grow
                </p>
              </div>
              <Link href="/ministries">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {ministries.slice(0, 6).map((ministry) => (
                <Link key={ministry.id} href={`/ministries/${ministry.slug}`}>
                  <Card className="h-full hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-blue-200 group overflow-hidden">
                    {ministry.imageUrl && (
                      <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
                        <img
                          src={ministry.imageUrl}
                          alt={ministry.name}
                          className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="text-blue-900 group-hover:text-blue-700 transition-colors flex items-center justify-between">
                        {ministry.name}
                        <ArrowRight className="h-5 w-5 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 transition-all duration-300" />
                      </CardTitle>
                      {ministry.description && (
                        <CardDescription className="line-clamp-2">
                          {ministry.description}
                        </CardDescription>
                      )}
                    </CardHeader>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Upcoming Events */}
      {upcomingEvents.length > 0 && (
        <section className="py-16">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="flex items-center justify-between mb-12">
              <div>
                <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
                  Upcoming Events
                </h2>
                <p className="mt-2 text-lg text-gray-600">
                  Don't miss what's happening at El Shaddai
                </p>
              </div>
              <Link href="/events">
                <Button variant="outline" className="border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white">
                  View All
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {upcomingEvents.map((event) => (
                <Card key={event.id} className="hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 border-blue-200 group overflow-hidden">
                  {event.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg relative">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover group-hover:scale-110 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-blue-900/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <Badge className="bg-blue-600 text-white group-hover:bg-blue-700 transition-colors">
                        {format(new Date(event.eventDate), 'MMM dd')}
                      </Badge>
                      {event.startTime && (
                        <span className="text-sm text-blue-600">{event.startTime}</span>
                      )}
                    </div>
                    <CardTitle className="text-blue-900 group-hover:text-blue-700 transition-colors">{event.title}</CardTitle>
                    {event.description && (
                      <CardDescription className="line-clamp-2">
                        {event.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-900 to-blue-950 text-white py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold tracking-tight sm:text-4xl mb-4">
            Ready to Take the Next Step?
          </h2>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            Whether you're new to faith or looking for a church home, we'd love to connect with you.
          </p>
          <div className="flex items-center justify-center gap-4">
            <Link href="/contact">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                Get In Touch
              </Button>
            </Link>
            <Link href="/give">
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                Support Our Mission
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
