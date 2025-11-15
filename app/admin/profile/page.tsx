'use client';

import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Loader2, User, Mail, Calendar, Shield, CheckCircle2, AlertCircle, Edit2, KeyRound } from 'lucide-react';
import { format } from 'date-fns';

export default function ProfilePage() {
  const { data: session, update } = useSession();
  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [userDetails, setUserDetails] = useState<any>(null);

  useEffect(() => {
    if (session?.user) {
      fetchUserDetails();
    }
  }, [session]);

  const fetchUserDetails = async () => {
    try {
      const response = await fetch('/api/user/profile');
      if (response.ok) {
        const data = await response.json();
        setUserDetails(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          currentPassword: '',
          newPassword: '',
          confirmPassword: '',
        });
      }
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    // Validate password fields if user is trying to change password
    if (formData.newPassword) {
      if (!formData.currentPassword) {
        setMessage({ type: 'error', text: 'Current password is required to set a new password' });
        setIsLoading(false);
        return;
      }
      if (formData.newPassword !== formData.confirmPassword) {
        setMessage({ type: 'error', text: 'New passwords do not match' });
        setIsLoading(false);
        return;
      }
      if (formData.newPassword.length < 8) {
        setMessage({ type: 'error', text: 'Password must be at least 8 characters long' });
        setIsLoading(false);
        return;
      }
    }

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          currentPassword: formData.currentPassword || undefined,
          newPassword: formData.newPassword || undefined,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        setMessage({ type: 'error', text: data.error || 'Failed to update profile' });
        setIsLoading(false);
        return;
      }

      setMessage({ type: 'success', text: 'Profile updated successfully!' });
      setIsEditing(false);
      setFormData({
        ...formData,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      });

      // Update session with new data
      await update();
      await fetchUserDetails();
    } catch (error) {
      setMessage({ type: 'error', text: 'An error occurred. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const formatRole = (role: string) => {
    return role.replace('_', ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase());
  };

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case 'SUPER_ADMIN':
        return 'bg-purple-500 text-white';
      case 'ADMIN':
        return 'bg-blue-500 text-white';
      case 'LEADER':
        return 'bg-green-500 text-white';
      default:
        return 'bg-gray-500 text-white';
    }
  };

  if (!userDetails) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-blue-700 rounded-lg p-8 text-white shadow-lg">
        <h1 className="text-3xl font-bold">My Profile</h1>
        <p className="text-blue-100 mt-2">Manage your account settings and preferences</p>
      </div>

      {message && (
        <div className={`flex items-center gap-2 rounded-md p-4 ${
          message.type === 'success' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message.type === 'success' ? (
            <CheckCircle2 className="h-5 w-5" />
          ) : (
            <AlertCircle className="h-5 w-5" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Overview Card */}
        <Card className="lg:col-span-1 shadow-md border-blue-100">
          <CardContent className="pt-6">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="relative">
                <div className="flex h-24 w-24 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-700 text-white shadow-lg">
                  <User className="h-12 w-12" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-green-500 h-6 w-6 rounded-full border-4 border-white"></div>
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-gray-900">{userDetails.name}</h3>
                <Badge className={`${getRoleBadgeColor(userDetails.role)} px-3 py-1`}>
                  <Shield className="h-3 w-3 mr-1" />
                  {formatRole(userDetails.role)}
                </Badge>
              </div>
              <Separator />
              <div className="w-full space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Email</span>
                  <span className="font-medium text-gray-900 truncate ml-2">{userDetails.email}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-500">Member Since</span>
                  <span className="font-medium text-gray-900">
                    {format(new Date(userDetails.createdAt), 'MMM d, yyyy')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Account Details Card */}
        <Card className="lg:col-span-2 shadow-md border-blue-100">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-white border-b">
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">Account Information</CardTitle>
                <CardDescription className="mt-1">View and update your account details</CardDescription>
              </div>
              {!isEditing && (
                <Button onClick={() => setIsEditing(true)} size="sm" className="bg-blue-900 hover:bg-blue-800">
                  <Edit2 className="h-4 w-4 mr-2" />
                  Edit Profile
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            {!isEditing ? (
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <User className="h-4 w-4" />
                      Full Name
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{userDetails.name}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Mail className="h-4 w-4" />
                      Email Address
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{userDetails.email}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Shield className="h-4 w-4" />
                      Account Role
                    </div>
                    <p className="text-lg font-semibold text-gray-900">{formatRole(userDetails.role)}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm font-medium text-gray-500">
                      <Calendar className="h-4 w-4" />
                      Last Updated
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {format(new Date(userDetails.updatedAt), 'MMM d, yyyy')}
                    </p>
                  </div>
                </div>
              </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name" className="flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email" className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="border-gray-300"
                  />
                </div>
              </div>

              <Separator />

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-gray-700">
                  <KeyRound className="h-4 w-4" />
                  Change Password (Optional)
                </div>

                <div className="grid grid-cols-1 gap-4 pl-6">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Current Password</Label>
                    <Input
                      id="currentPassword"
                      name="currentPassword"
                      type="password"
                      value={formData.currentPassword}
                      onChange={handleChange}
                      placeholder="Enter current password"
                      className="border-gray-300"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="newPassword">New Password</Label>
                      <Input
                        id="newPassword"
                        name="newPassword"
                        type="password"
                        value={formData.newPassword}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        className="border-gray-300"
                      />
                      <p className="text-xs text-gray-500">Min. 8 characters</p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password</Label>
                      <Input
                        id="confirmPassword"
                        name="confirmPassword"
                        type="password"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        className="border-gray-300"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <Separator />

              <div className="flex gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-900 hover:bg-blue-800"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving Changes...
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="mr-2 h-4 w-4" />
                      Save Changes
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setIsEditing(false);
                    setMessage(null);
                    setFormData({
                      name: userDetails.name || '',
                      email: userDetails.email || '',
                      currentPassword: '',
                      newPassword: '',
                      confirmPassword: '',
                    });
                  }}
                  disabled={isLoading}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
      </div>
    </div>
  );
}
