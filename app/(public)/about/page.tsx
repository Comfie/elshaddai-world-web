import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Church, Target, Heart, Users, BookOpen, Globe } from 'lucide-react';

export default function AboutPage() {
  const values = [
    {
      icon: BookOpen,
      title: 'Biblical Truth',
      description: 'We believe in the authority and sufficiency of Scripture for life and faith.',
    },
    {
      icon: Heart,
      title: 'Loving Community',
      description: 'We are committed to loving God and loving one another as Christ loved us.',
    },
    {
      icon: Users,
      title: 'Unity in Diversity',
      description: 'We celebrate our diversity while maintaining unity in Christ.',
    },
    {
      icon: Globe,
      title: 'Global Impact',
      description: 'We are passionate about reaching the nations with the Gospel.',
    },
    {
      icon: Church,
      title: 'Spirit-Led Worship',
      description: 'We seek to honor God through authentic, Spirit-filled worship.',
    },
    {
      icon: Target,
      title: 'Excellence',
      description: 'We strive for excellence in all we do, offering our best to God.',
    },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-900 via-blue-800 to-blue-950 text-white py-20">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="text-4xl font-bold tracking-tight sm:text-5xl mb-6">
              About El Shaddai World Ministries
            </h1>
            <p className="text-xl text-blue-100">
              A Bible-believing, Spirit-filled church committed to transforming lives through the power of God's Word
            </p>
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl mb-6">
              Our Story
            </h2>
            <div className="prose prose-lg max-w-none text-gray-600">
              <p className="mb-4">
                El Shaddai World Ministries was founded with a vision to create a church where people can encounter the living God, grow in their faith, and discover their purpose. Since our inception, we have been committed to preaching the uncompromising Word of God and demonstrating His love through practical ministry.
              </p>
              <p className="mb-4">
                Our name "El Shaddai" means "God Almighty" or "God All-Sufficient," reflecting our belief that God is more than enough for every need, challenge, and circumstance we face. This foundational truth shapes everything we do as a church community.
              </p>
              <p>
                Today, we are a growing family of believers from diverse backgrounds, united by our love for Jesus Christ and our commitment to advancing His Kingdom both locally and globally.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-blue-900">Our Vision</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600">
                  To be a Bible-based, Spirit-filled church that transforms lives, builds strong families, and impacts communities through the power of God's Word and the demonstration of His love.
                </p>
              </CardContent>
            </Card>

            <Card className="border-blue-200">
              <CardHeader>
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-full bg-blue-100 p-3">
                    <Church className="h-8 w-8 text-blue-600" />
                  </div>
                  <CardTitle className="text-2xl text-blue-900">Our Mission</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-lg text-gray-600">
                  To glorify God by making disciples of Jesus Christ through worship, biblical teaching, fellowship, and service, equipping believers to fulfill their God-given purpose.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
              Our Core Values
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              These values guide everything we do as a church community
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {values.map((value) => {
              const Icon = value.icon;
              return (
                <Card key={value.title} className="border-blue-200">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-2">
                      <div className="rounded-full bg-blue-100 p-2">
                        <Icon className="h-6 w-6 text-blue-600" />
                      </div>
                      <CardTitle className="text-xl text-blue-900">{value.title}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* What We Believe */}
      <section className="bg-blue-50 py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl">
            <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl mb-8 text-center">
              What We Believe
            </h2>
            <div className="space-y-6">
              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">The Bible</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We believe the Bible is the inspired, infallible Word of God and the final authority for faith and practice.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">The Trinity</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We believe in one God eternally existing in three persons: Father, Son, and Holy Spirit.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Salvation</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We believe that salvation is by grace alone, through faith alone, in Christ alone. It is a free gift of God, not earned by works.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">The Church</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We believe the Church is the Body of Christ, called to worship God, build up believers, and reach the lost.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">The Holy Spirit</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We believe in the baptism of the Holy Spirit and the operation of spiritual gifts for the edification of the Church.
                  </p>
                </CardContent>
              </Card>

              <Card className="border-blue-200">
                <CardHeader>
                  <CardTitle className="text-blue-900">Christ's Return</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">
                    We believe in the personal, visible return of Jesus Christ to establish His eternal kingdom.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>

      {/* Leadership */}
      <section className="py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-2xl text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-blue-900 sm:text-4xl">
              Our Leadership
            </h2>
            <p className="mt-4 text-lg text-gray-600">
              Meet the team leading El Shaddai World Ministries
            </p>
          </div>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="text-center border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-800" />
                <CardTitle className="text-blue-900">Pastor John Doe</CardTitle>
                <CardDescription>Senior Pastor</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Leading with passion and vision since 2010
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-800" />
                <CardTitle className="text-blue-900">Pastor Jane Smith</CardTitle>
                <CardDescription>Associate Pastor</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Overseeing women's ministry and discipleship
                </p>
              </CardContent>
            </Card>

            <Card className="text-center border-blue-200">
              <CardHeader>
                <div className="mx-auto mb-4 h-32 w-32 rounded-full bg-gradient-to-br from-blue-600 to-blue-800" />
                <CardTitle className="text-blue-900">Elder Mike Johnson</CardTitle>
                <CardDescription>Church Elder</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600">
                  Serving in pastoral care and counseling
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>
    </div>
  );
}
