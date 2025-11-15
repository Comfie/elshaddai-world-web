import Link from 'next/link';
import { Church, Facebook, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react';

const navigation = {
  main: [
    { name: 'Home', href: '/' },
    { name: 'About', href: '/about' },
    { name: 'Ministries', href: '/ministries' },
    { name: 'Events', href: '/events' },
    { name: 'Contact', href: '/contact' },
    { name: 'Give', href: '/give' },
  ],
  social: [
    { name: 'Facebook', href: '#', icon: Facebook },
    { name: 'Instagram', href: '#', icon: Instagram },
    { name: 'YouTube', href: '#', icon: Youtube },
  ],
};

export function PublicFooter() {
  return (
    <footer className="bg-blue-950 text-blue-100">
      <div className="mx-auto max-w-7xl px-6 py-12 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-4">
          {/* Logo and Description */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <Church className="h-8 w-8 text-blue-400" />
              <div className="flex flex-col">
                <span className="text-xl font-bold text-white">El Shaddai</span>
                <span className="text-sm text-blue-300">World Ministries</span>
              </div>
            </Link>
            <p className="text-sm text-blue-300 mb-4 max-w-md">
              A Bible-believing, Spirit-filled church committed to transforming lives through the power of God's Word and the demonstration of His love.
            </p>
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-blue-400" />
                <span>123 Church Street, Pretoria, South Africa</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-blue-400" />
                <span>+27 12 345 6789</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-blue-400" />
                <span>info@elshaddaiworld.org</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Quick Links</h3>
            <ul className="space-y-2">
              {navigation.main.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="text-sm text-blue-300 hover:text-white transition-colors"
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Service Times */}
          <div>
            <h3 className="text-sm font-semibold text-white mb-4">Service Times</h3>
            <ul className="space-y-2 text-sm text-blue-300">
              <li>
                <span className="font-medium text-white">Sunday Service</span>
                <br />
                9:00 AM & 11:00 AM
              </li>
              <li>
                <span className="font-medium text-white">Wednesday Bible Study</span>
                <br />
                6:00 PM
              </li>
              <li>
                <span className="font-medium text-white">Friday Prayer</span>
                <br />
                7:00 PM
              </li>
            </ul>
          </div>
        </div>

        {/* Social Links and Copyright */}
        <div className="mt-8 border-t border-blue-900 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-sm text-blue-300">
            &copy; {new Date().getFullYear()} El Shaddai World Ministries. All rights reserved.
          </p>
          <div className="flex gap-4">
            {navigation.social.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.name}
                  href={item.href}
                  className="text-blue-400 hover:text-white transition-colors"
                >
                  <span className="sr-only">{item.name}</span>
                  <Icon className="h-6 w-6" />
                </a>
              );
            })}
          </div>
        </div>
      </div>
    </footer>
  );
}
