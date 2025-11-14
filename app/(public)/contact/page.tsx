import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';

export default function ContactPage() {
  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              Get In Touch
            </h1>
            <p className="text-xl text-blue-100">
              We'd love to hear from you. Reach out to us with any questions or prayer requests.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Info & Form */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            {/* Contact Information */}
            <div className="space-y-6">
              <div>
                <h2 className="text-2xl font-bold text-blue-900 mb-4">Contact Information</h2>
                <p className="text-gray-600 mb-6">
                  Feel free to reach out to us through any of these channels. We're here to serve you!
                </p>
              </div>

              <Card className="border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-3">
                      <MapPin className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-blue-900">Our Location</CardTitle>
                      <CardDescription>Visit us at</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    123 Church Street<br />
                    Pretoria, Gauteng<br />
                    South Africa, 0001
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-3">
                      <Phone className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-blue-900">Phone</CardTitle>
                      <CardDescription>Call us during office hours</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a href="tel:+27123456789" className="text-gray-600 hover:text-blue-600">
                    +27 12 345 6789
                  </a>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-3">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-blue-900">Email</CardTitle>
                      <CardDescription>Send us a message</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <a href="mailto:info@elshaddaiworld.org" className="text-gray-600 hover:text-blue-600">
                    info@elshaddaiworld.org
                  </a>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-3">
                      <Clock className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-blue-900">Office Hours</CardTitle>
                      <CardDescription>When we're available</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p>Monday - Friday: 9:00 AM - 5:00 PM</p>
                    <p>Saturday: 9:00 AM - 1:00 PM</p>
                    <p>Sunday: Before and after services</p>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Contact Form */}
            <div>
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-2xl text-blue-900">Send Us a Message</CardTitle>
                  <CardDescription>
                    Fill out the form below and we'll get back to you as soon as possible
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form className="space-y-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                        Email Address *
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        required
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
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-1">
                        Subject *
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">
                        Message *
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        rows={6}
                        required
                        className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-1 focus:ring-blue-600 resize-none"
                      />
                    </div>

                    <button
                      type="submit"
                      className="w-full rounded-md bg-blue-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-blue-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-900"
                    >
                      Send Message
                    </button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section (Placeholder) */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Find Us</h2>
          <div className="aspect-video w-full rounded-lg bg-gray-200 flex items-center justify-center">
            <p className="text-gray-500">Map integration coming soon</p>
          </div>
        </div>
      </section>
    </div>
  );
}
