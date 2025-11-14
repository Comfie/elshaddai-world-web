import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Heart, CreditCard, Building, Smartphone, Info } from 'lucide-react';

export default function GivePage() {
  const givingMethods = [
    {
      icon: CreditCard,
      title: 'Online Giving',
      description: 'Give securely online using your credit/debit card',
      details: 'Coming soon - Online giving portal integration',
    },
    {
      icon: Building,
      title: 'Bank Transfer',
      description: 'Transfer directly to our church account',
      details: (
        <div className="space-y-1 text-sm">
          <p><span className="font-medium">Bank:</span> First National Bank</p>
          <p><span className="font-medium">Account Name:</span> El Shaddai World Ministries</p>
          <p><span className="font-medium">Account Number:</span> 1234567890</p>
          <p><span className="font-medium">Branch Code:</span> 250655</p>
          <p className="text-xs text-gray-500 mt-2">
            Please use your name and "Offering" or "Tithe" as reference
          </p>
        </div>
      ),
    },
    {
      icon: Smartphone,
      title: 'Mobile Payment',
      description: 'Give using mobile money services',
      details: 'Contact the church office for mobile payment options',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <Heart className="h-16 w-16 mx-auto mb-6 text-blue-300" />
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Give to El Shaddai
            </h1>
            <p className="text-xl text-blue-100">
              Your generosity helps us spread the Gospel and serve our community
            </p>
          </div>
        </div>
      </section>

      {/* Giving Philosophy */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Why We Give</h2>
            <p className="text-lg text-gray-600">
              "Each of you should give what you have decided in your heart to give, not reluctantly or under compulsion, for God loves a cheerful giver." - 2 Corinthians 9:7
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3">
            <Card className="text-center border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Heart className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Worship</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Giving is an act of worship and obedience to God
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Users className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Ministry</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Your gifts support our ministries and outreach programs
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-blue-100">
                  <Globe className="h-8 w-8 text-blue-600" />
                </div>
                <CardTitle className="text-blue-900">Kingdom Growth</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Together we're building God's kingdom locally and globally
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Giving Methods */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Ways to Give</h2>
            <p className="text-lg text-gray-600">
              Choose the method that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
            {givingMethods.map((method) => {
              const Icon = method.icon;
              return (
                <Card key={method.title} className="border-blue-200">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-full bg-blue-100 p-3">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl text-blue-900">{method.title}</CardTitle>
                    </div>
                    <CardDescription>{method.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    {typeof method.details === 'string' ? (
                      <p className="text-sm text-gray-600">{method.details}</p>
                    ) : (
                      method.details
                    )}
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* What Your Giving Supports */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold text-blue-900 mb-4">Your Impact</h2>
            <p className="text-lg text-gray-600">
              See how your generosity makes a difference
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Ministry & Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Sunday services and worship</li>
                  <li>• Children and youth programs</li>
                  <li>• Small groups and discipleship</li>
                  <li>• Prayer and counseling ministries</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Community Outreach</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Food and clothing assistance</li>
                  <li>• Community service projects</li>
                  <li>• Evangelism and missions</li>
                  <li>• Support for those in need</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Facility & Operations</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Building maintenance and utilities</li>
                  <li>• Audio/visual equipment</li>
                  <li>• Office operations</li>
                  <li>• Technology and communications</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <CardTitle className="text-blue-900">Staff & Leadership</CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Pastoral staff support</li>
                  <li>• Ministry leaders</li>
                  <li>• Administrative team</li>
                  <li>• Leadership development</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Tax Information */}
      <section className="bg-blue-50 py-12">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <Card className="border-blue-200">
            <CardHeader>
              <div className="flex items-center gap-2">
                <Info className="h-5 w-5 text-blue-600" />
                <CardTitle className="text-blue-900">Tax Information</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-gray-600">
                El Shaddai World Ministries is a registered non-profit organization. All donations are tax-deductible to the extent allowed by law. Tax receipts will be issued for all qualifying donations at the end of each financial year.
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}

// Import missing components
import { Globe, Users } from 'lucide-react';
