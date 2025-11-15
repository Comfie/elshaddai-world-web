'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  User,
  Mail,
  Phone,
  MapPin,
  Calendar,
  ArrowLeft,
  CheckCircle,
  XCircle,
  Heart,
  Users,
} from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface Member {
  id: string;
  firstName: string;
  lastName: string;
  email: string | null;
  phone: string;
  alternatePhone: string | null;
  address: string | null;
  city: string | null;
  province: string | null;
  postalCode: string | null;
  dateOfBirth: Date | null;
  gender: string | null;
  maritalStatus: string | null;
  membershipType: string;
  notes: string | null;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

export function RegistrationApproval({ registration }: { registration: Member }) {
  const router = useRouter();
  const [isApproving, setIsApproving] = useState(false);
  const [isRejecting, setIsRejecting] = useState(false);

  const handleApprove = async () => {
    if (!confirm('Are you sure you want to approve this registration? The member will be added to the active members list.')) {
      return;
    }

    setIsApproving(true);
    try {
      const res = await fetch(`/api/members/${registration.id}/approve`, {
        method: 'POST',
      });

      if (res.ok) {
        toast.success('Registration approved successfully');
        router.push('/admin/pending-registrations');
        router.refresh();
      } else {
        toast.error('Failed to approve registration');
      }
    } catch (error) {
      console.error('Error approving registration:', error);
      toast.error('An error occurred');
    } finally {
      setIsApproving(false);
    }
  };

  const handleReject = async () => {
    if (!confirm('Are you sure you want to reject this registration? This action cannot be undone.')) {
      return;
    }

    setIsRejecting(true);
    try {
      const res = await fetch(`/api/members/${registration.id}/reject`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Registration rejected and removed');
        router.push('/admin/pending-registrations');
        router.refresh();
      } else {
        toast.error('Failed to reject registration');
      }
    } catch (error) {
      console.error('Error rejecting registration:', error);
      toast.error('An error occurred');
    } finally {
      setIsRejecting(false);
    }
  };

  const getMembershipTypeLabel = (type: string) => {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, (l) => l.toUpperCase());
  };

  const getMembershipTypeColor = (type: string) => {
    switch (type) {
      case 'VISITOR':
        return 'bg-orange-500';
      case 'NEW_CONVERT':
        return 'bg-green-500';
      case 'MEMBER':
        return 'bg-blue-500';
      default:
        return 'bg-gray-500';
    }
  };

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/admin/pending-registrations">
            <Button variant="outline" size="sm">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Pending
            </Button>
          </Link>
          <h1 className="text-3xl font-bold text-gray-900">Review Registration</h1>
        </div>
        <div className="flex gap-2">
          <Button
            variant="destructive"
            onClick={handleReject}
            disabled={isRejecting || isApproving}
          >
            <XCircle className="h-4 w-4 mr-2" />
            {isRejecting ? 'Rejecting...' : 'Reject'}
          </Button>
          <Button
            onClick={handleApprove}
            disabled={isApproving || isRejecting}
            className="bg-green-600 hover:bg-green-700"
          >
            <CheckCircle className="h-4 w-4 mr-2" />
            {isApproving ? 'Approving...' : 'Approve'}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-2xl">
                    {registration.firstName} {registration.lastName}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-2">
                    <Badge variant="outline" className={`${getMembershipTypeColor(registration.membershipType)} text-white`}>
                      {getMembershipTypeLabel(registration.membershipType)}
                    </Badge>
                    <Badge variant="outline" className="bg-orange-500 text-white">
                      PENDING APPROVAL
                    </Badge>
                  </CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-sm font-medium text-gray-500 mb-3">Contact Information</h3>
                <div className="space-y-2">
                  {registration.email && (
                    <div className="flex items-center gap-2 text-sm">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <a href={`mailto:${registration.email}`} className="text-blue-600 hover:underline">
                        {registration.email}
                      </a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-gray-400" />
                    <a href={`tel:${registration.phone}`} className="text-blue-600 hover:underline">
                      {registration.phone}
                    </a>
                  </div>
                  {registration.alternatePhone && (
                    <div className="flex items-center gap-2 text-sm">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <a href={`tel:${registration.alternatePhone}`} className="text-gray-600">
                        {registration.alternatePhone} (Alternate)
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Address Information */}
              {(registration.address || registration.city || registration.province || registration.postalCode) && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Address</h3>
                  <div className="flex items-start gap-2 text-sm text-gray-600">
                    <MapPin className="h-4 w-4 mt-0.5 text-gray-400" />
                    <div>
                      {registration.address && <div>{registration.address}</div>}
                      <div>
                        {registration.city && `${registration.city}, `}
                        {registration.province && `${registration.province} `}
                        {registration.postalCode}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Personal Information */}
              <div className="border-t pt-4">
                <h3 className="text-sm font-medium text-gray-500 mb-3">Personal Information</h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {registration.dateOfBirth && (
                    <div>
                      <span className="font-medium text-gray-700">Date of Birth:</span>
                      <div className="text-gray-600">{format(new Date(registration.dateOfBirth), 'PPP')}</div>
                    </div>
                  )}
                  {registration.gender && (
                    <div>
                      <span className="font-medium text-gray-700">Gender:</span>
                      <div className="text-gray-600">{registration.gender}</div>
                    </div>
                  )}
                  {registration.maritalStatus && (
                    <div>
                      <span className="font-medium text-gray-700">Marital Status:</span>
                      <div className="text-gray-600">{registration.maritalStatus}</div>
                    </div>
                  )}
                </div>
              </div>

              {/* Additional Notes */}
              {registration.notes && (
                <div className="border-t pt-4">
                  <h3 className="text-sm font-medium text-gray-500 mb-3">Additional Information</h3>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap">{registration.notes}</p>
                </div>
              )}

              {/* Registration Date */}
              <div className="border-t pt-4">
                <div className="flex items-center gap-2 text-xs text-gray-500">
                  <Calendar className="h-3 w-3" />
                  Registered on {format(new Date(registration.createdAt), 'PPpp')}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Actions and Info */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Approval Actions</CardTitle>
              <CardDescription>Review and approve or reject this registration</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleApprove}
                disabled={isApproving || isRejecting}
                className="w-full bg-green-600 hover:bg-green-700"
                size="lg"
              >
                <CheckCircle className="h-5 w-5 mr-2" />
                {isApproving ? 'Approving...' : 'Approve Registration'}
              </Button>
              <Button
                variant="destructive"
                onClick={handleReject}
                disabled={isRejecting || isApproving}
                className="w-full"
                size="lg"
              >
                <XCircle className="h-5 w-5 mr-2" />
                {isRejecting ? 'Rejecting...' : 'Reject & Delete'}
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Next Steps</CardTitle>
            </CardHeader>
            <CardContent className="text-sm text-gray-600 space-y-2">
              <div className="flex items-start gap-2">
                <CheckCircle className="h-4 w-4 mt-0.5 text-green-600" />
                <div>
                  <span className="font-medium">If Approved:</span>
                  <p className="text-xs mt-1">Member will be added to the active members list and can be assigned to groups and ministries.</p>
                </div>
              </div>
              <div className="flex items-start gap-2">
                <XCircle className="h-4 w-4 mt-0.5 text-red-600" />
                <div>
                  <span className="font-medium">If Rejected:</span>
                  <p className="text-xs mt-1">Registration will be permanently deleted from the system.</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Membership Type</CardTitle>
            </CardHeader>
            <CardContent className="text-sm">
              <div className="flex items-center gap-2 mb-2">
                <Users className="h-4 w-4 text-gray-400" />
                <Badge className={getMembershipTypeColor(registration.membershipType)}>
                  {getMembershipTypeLabel(registration.membershipType)}
                </Badge>
              </div>
              <p className="text-xs text-gray-600">
                {registration.membershipType === 'VISITOR' && 'First-time visitor to the church'}
                {registration.membershipType === 'NEW_CONVERT' && 'Recently accepted Christ as Savior'}
                {registration.membershipType === 'MEMBER' && 'Transferring from another church'}
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
