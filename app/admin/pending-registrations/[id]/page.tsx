import { prisma } from '@/lib/db';
import { notFound } from 'next/navigation';
import { RegistrationApproval } from '@/components/admin/registration-approval';

async function getMemberRegistration(id: string) {
  const member = await prisma.member.findUnique({
    where: { id },
  });

  if (!member || member.status !== 'PENDING') {
    notFound();
  }

  return member;
}

export default async function RegistrationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const registration = await getMemberRegistration(id);

  return (
    <div className="space-y-6">
      <RegistrationApproval registration={JSON.parse(JSON.stringify(registration))} />
    </div>
  );
}
