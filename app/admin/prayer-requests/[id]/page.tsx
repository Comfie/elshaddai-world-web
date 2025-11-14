import { prisma } from '@/lib/db/prisma';
import { notFound } from 'next/navigation';
import { PrayerRequestDetail } from '@/components/admin/prayer-request-detail';

async function getPrayerRequest(id: string) {
  const request = await prisma.prayerRequest.findUnique({
    where: { id },
  });

  if (!request) {
    notFound();
  }

  return request;
}

export default async function PrayerRequestPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const request = await getPrayerRequest(id);

  return (
    <div className="space-y-6">
      <PrayerRequestDetail request={JSON.parse(JSON.stringify(request))} />
    </div>
  );
}
