import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Clock } from 'lucide-react';
import { prisma } from '@/lib/db';
import { format } from 'date-fns';

async function getEvents() {
  const events = await prisma.event.findMany({
    where: {
      eventDate: { gte: new Date() },
      status: 'SCHEDULED',
      displayOnWebsite: true,
    },
    include: {
      ministry: {
        select: {
          name: true,
        },
      },
    },
    orderBy: { eventDate: 'asc' },
    take: 20,
  });

  return events;
}

export default async function EventsPage() {
  const events = await getEvents();

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'SERVICE':
        return 'bg-blue-600';
      case 'PRAYER_MEETING':
        return 'bg-purple-600';
      case 'BIBLE_STUDY':
        return 'bg-green-600';
      case 'CONFERENCE':
        return 'bg-orange-600';
      case 'OUTREACH':
        return 'bg-pink-600';
      default:
        return 'bg-blue-600';
    }
  };

  const formatEventType = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Upcoming Events
            </h1>
            <p className="text-xl text-blue-100">
              Join us for these exciting events and activities
            </p>
          </div>
        </div>
      </section>

      {/* Events List */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {events.length === 0 ? (
            <div className="text-center py-12">
              <Calendar className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-lg text-gray-600 mb-2">No upcoming events at this time</p>
              <p className="text-sm text-gray-500">Check back soon for new events!</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <Card key={event.id} className="hover:shadow-xl transition-shadow border-blue-200">
                  {event.imageUrl && (
                    <div className="aspect-video w-full overflow-hidden rounded-t-lg">
                      <img
                        src={event.imageUrl}
                        alt={event.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-3">
                      <Badge className="bg-blue-600 text-white">
                        {format(new Date(event.eventDate), 'MMM dd, yyyy')}
                      </Badge>
                      <Badge className={`${getEventTypeColor(event.eventType)} text-white`}>
                        {formatEventType(event.eventType)}
                      </Badge>
                    </div>
                    <CardTitle className="text-xl text-blue-900">{event.title}</CardTitle>
                    {event.description && (
                      <CardDescription className="line-clamp-2">
                        {event.description}
                      </CardDescription>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {event.startTime && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4 text-blue-600" />
                        <span>{event.startTime}</span>
                      </div>
                    )}
                    {event.location && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <MapPin className="h-4 w-4 text-blue-600" />
                        <span className="line-clamp-1">{event.location}</span>
                      </div>
                    )}
                    {event.ministry && (
                      <div className="pt-2 border-t">
                        <span className="text-xs text-gray-500">Hosted by:</span>
                        <span className="text-xs text-blue-600 font-medium ml-1">
                          {event.ministry.name}
                        </span>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
