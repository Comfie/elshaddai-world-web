import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Phone, MapPin, Clock } from 'lucide-react';
import { ContactForm } from '@/components/public/contact-form';

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
                    5th Road, Northwold<br />
                    Randburg, Gauteng<br />
                    South Africa, 2188
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-blue-100 p-3">
                      <Mail className="h-6 w-6 text-blue-600" />
                    </div>
                    <div>
                      <CardTitle className="text-lg text-blue-900">Contact Us</CardTitle>
                      <CardDescription>Get in touch with us</CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3">
                    <Phone className="h-5 w-5 text-blue-600" />
                    <a href="tel:+27123456789" className="text-gray-600 hover:text-blue-600">
                      +27 12 345 6789
                    </a>
                  </div>
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-blue-600" />
                    <a href="mailto:info@elshaddaiworld.org" className="text-gray-600 hover:text-blue-600">
                      info@elshaddaiworld.org
                    </a>
                  </div>
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
              <ContactForm />
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-blue-900 mb-6 text-center">Find Us</h2>
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-lg">
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3583.8662839567766!2d28.011726!3d-26.102222!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x1e957331c3c8d6a9%3A0x8a1b1c5d5e6f7a8b!2s5th%20Rd%2C%20Northwold%2C%20Randburg%2C%202188!5e0!3m2!1sen!2sza!4v1234567890"
              width="100%"
              height="100%"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              title="El Shaddai World Ministries Location"
            />
          </div>
        </div>
      </section>
    </div>
  );
}
