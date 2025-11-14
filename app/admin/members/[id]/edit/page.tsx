import { notFound } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { MemberForm } from '@/components/admin/member-form';
import { getMemberById } from '@/lib/actions/members';
import { prisma } from '@/lib/db';

export default async function EditMemberPage({ params }: { params: { id: string } }) {
  const member = await getMemberById(params.id);
  const ministries = await prisma.ministry.findMany({
    where: { isActive: true },
    orderBy: { name: 'asc' },
  });

  if (!member) {
    notFound();
  }

  // Prepare initial data for the form
  const initialData = {
    firstName: member.firstName,
    lastName: member.lastName,
    email: member.email || '',
    phone: member.phone,
    alternatePhone: member.alternatePhone || '',
    address: member.address || '',
    city: member.city || '',
    province: member.province || '',
    postalCode: member.postalCode || '',
    dateOfBirth: member.dateOfBirth ? new Date(member.dateOfBirth) : undefined,
    gender: member.gender || undefined,
    maritalStatus: member.maritalStatus || undefined,
    photoUrl: member.photoUrl || '',
    membershipType: member.membershipType,
    baptized: member.baptized,
    baptismDate: member.baptismDate ? new Date(member.baptismDate) : undefined,
    salvationDate: member.salvationDate ? new Date(member.salvationDate) : undefined,
    ministryId: member.ministryId || '',
    status: member.status,
    notes: member.notes || '',
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Link href={`/admin/members/${member.id}`}>
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight">
            Edit {member.firstName} {member.lastName}
          </h1>
          <p className="text-muted-foreground">
            Update member information
          </p>
        </div>
      </div>

      <MemberForm initialData={initialData} memberId={member.id} ministries={ministries} />
    </div>
  );
}
