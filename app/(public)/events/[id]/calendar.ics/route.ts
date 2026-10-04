import { prisma } from '@/lib/db';
import { buildIcs } from '@/lib/calendar';

export const revalidate = 300;

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const event = await prisma.event.findFirst({
    where: { id, displayOnWebsite: true, status: { not: 'CANCELLED' } },
  });
  if (!event) return new Response('Not found', { status: 404 });

  return new Response(buildIcs(event), {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': `attachment; filename="event-${event.id}.ics"`,
    },
  });
}
