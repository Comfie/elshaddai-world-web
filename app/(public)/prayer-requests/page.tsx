'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, Shield, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function PrayerRequestsPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    isAnonymous: false,
    category: 'GENERAL',
    request: '',
    isUrgent: false,
    isPublic: false,
    shareWithPastors: true,
    shareWithLeaders: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setFormData({
        ...formData,
        [name]: checked,
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/prayer-requests', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        toast.success(data.message || 'Prayer request submitted successfully!');
        // Reset form
        setFormData({
          name: '',
          email: '',
          phone: '',
          isAnonymous: false,
          category: 'GENERAL',
          request: '',
          isUrgent: false,
          isPublic: false,
          shareWithPastors: true,
          shareWithLeaders: false,
        });
      } else {
        toast.error(data.error || 'Failed to submit prayer request');
      }
    } catch (error) {
      console.error('Error submitting prayer request:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Heart className="h-16 w-16 mx-auto mb-6 text-blue-300" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Prayer Requests
            </h1>
            <p className="text-xl text-blue-100">
              "The prayer of a righteous person is powerful and effective." - James 5:16
            </p>
          </div>
        </div>
      </section>

      {/* Info Section */}
      <section className="py-16 bg-blue-50">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Card className="text-center border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">We Care</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Your prayer request matters to us. Our prayer team is committed to praying for you.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Shield className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Confidential</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Your privacy is important. Choose to submit anonymously or privately.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Community</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Join our church family in prayer. Optionally share with our prayer wall.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Prayer Request Form */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-6 lg:px-8">
          <Card className="border-blue-200">
            <CardHeader>
              <CardTitle className="text-2xl text-blue-900">Submit Your Prayer Request</CardTitle>
              <CardDescription>
                Fill out the form below and our prayer team will be notified. All fields are optional except your prayer request.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Anonymous Checkbox */}
                <div className="flex items-center gap-2 p-4 bg-blue-50 rounded-md">
                  <input
                    type="checkbox"
                    id="isAnonymous"
                    name="isAnonymous"
                    checked={formData.isAnonymous}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600"
                  />
                  <label htmlFor="isAnonymous" className="text-sm font-medium text-gray-700">
                    Submit anonymously (your personal information will not be collected)
                  </label>
                </div>

                {/* Personal Information - Hidden if anonymous */}
                {!formData.isAnonymous && (
                  <div className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleChange}
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>
                  </div>
                )}

                {/* Category */}
                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                    Prayer Category
                  </label>
                  <select
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                  >
                    <option value="GENERAL">General</option>
                    <option value="HEALTH">Health/Healing</option>
                    <option value="FAMILY">Family</option>
                    <option value="FINANCIAL">Financial</option>
                    <option value="EMPLOYMENT">Employment</option>
                    <option value="SPIRITUAL">Spiritual Growth</option>
                    <option value="SALVATION">Salvation</option>
                    <option value="DIRECTION">Guidance/Direction</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>

                {/* Prayer Request */}
                <div>
                  <label htmlFor="request" className="block text-sm font-medium text-gray-700 mb-1">
                    Your Prayer Request *
                  </label>
                  <textarea
                    id="request"
                    name="request"
                    rows={6}
                    value={formData.request}
                    onChange={handleChange}
                    required
                    minLength={10}
                    placeholder="Share what you would like us to pray about..."
                    className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                  />
                </div>

                {/* Options */}
                <div className="space-y-3 border-t pt-4">
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isUrgent"
                      name="isUrgent"
                      checked={formData.isUrgent}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="isUrgent" className="text-sm text-gray-700">
                      This is an urgent prayer request
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="isPublic"
                      name="isPublic"
                      checked={formData.isPublic}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="isPublic" className="text-sm text-gray-700">
                      Share on public prayer wall (others can pray for this request)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="shareWithPastors"
                      name="shareWithPastors"
                      checked={formData.shareWithPastors}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="shareWithPastors" className="text-sm text-gray-700">
                      Share with pastoral team (recommended)
                    </label>
                  </div>

                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      id="shareWithLeaders"
                      name="shareWithLeaders"
                      checked={formData.shareWithLeaders}
                      onChange={handleChange}
                      className="h-4 w-4 text-blue-600"
                    />
                    <label htmlFor="shareWithLeaders" className="text-sm text-gray-700">
                      Share with ministry leaders
                    </label>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-blue-900 hover:bg-blue-800"
                  size="lg"
                >
                  {isSubmitting ? 'Submitting...' : 'Submit Prayer Request'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Encouragement Section */}
      <section className="bg-blue-50 py-12">
        <div className="mx-auto max-w-3xl px-6 lg:px-8 text-center">
          <p className="text-lg text-gray-700 mb-4">
            "Do not be anxious about anything, but in every situation, by prayer and petition, with thanksgiving, present your requests to God."
          </p>
          <p className="text-sm text-gray-600">Philippians 4:6</p>
        </div>
      </section>
    </div>
  );
}
