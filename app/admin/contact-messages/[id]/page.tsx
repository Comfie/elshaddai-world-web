import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { ContactMessageDetail } from '@/components/admin/contact-message-detail';

async function getContactMessage(id: string) {
  const message = await prisma.contactMessage.findUnique({
    where: { id },
  });

  if (!message) {
    notFound();
  }

  return message;
}

export default async function ContactMessagePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const message = await getContactMessage(id);

  return (
    <div className="space-y-6">
      <ContactMessageDetail message={JSON.parse(JSON.stringify(message))} />
    </div>
  );
}
