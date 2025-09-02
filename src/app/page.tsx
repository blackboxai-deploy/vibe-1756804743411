import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

const features = [
  {
    title: 'WhatsApp Integration',
    description: 'Native WhatsApp messaging for appointment reminders, token updates, and post-visit care instructions.',
    icon: '💬'
  },
  {
    title: 'Offline-First PWA',
    description: 'Keep working during internet outages. Patient registration and billing sync when online.',
    icon: '📱'
  },
  {
    title: 'Live Token Display',
    description: 'Real-time queue display for waiting areas. Works on any TV or Android device.',
    icon: '🎫'
  },
  {
    title: 'Smart E-Prescriptions',
    description: 'Pakistani drug database with generic-to-brand mapping and QR verification.',
    icon: '💊'
  },
  {
    title: 'Local Payment Methods',
    description: 'Cash-first billing with Easypaisa, JazzCash, and bank transfer support.',
    icon: '💳'
  },
  {
    title: 'Bilingual Interface',
    description: 'Complete Urdu and English support with proper fonts and currency formatting.',
    icon: '🌐'
  }
];

const demoCredentials = [
  { username: 'admin', password: 'password', role: 'Owner' },
  { username: 'reception', password: 'password', role: 'Reception' },
  { username: 'doctor1', password: 'password', role: 'Doctor' },
  { username: 'pharmacy', password: 'password', role: 'Pharmacy' }
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-emerald-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-lg">🏥</span>
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pakistan Clinic Management</h1>
                <p className="text-sm text-emerald-600">Complete Healthcare Solution</p>
              </div>
            </div>
            <div className="flex space-x-2">
              <Link href="/auth/login">
                <Button variant="outline" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50">
                  Login
                </Button>
              </Link>
              <Link href="/auth/login">
                <Button className="bg-emerald-600 hover:bg-emerald-700">
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <Badge className="mb-4 bg-emerald-100 text-emerald-700 hover:bg-emerald-200">
            🇵🇰 Made for Pakistan
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
            Pakistan Clinic
            <span className="text-emerald-600 block">Management System</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Lean to build now, rock-solid in low-connectivity environments, easy to polish later. 
            Built with <strong>WhatsApp integration</strong>, <strong>offline-first PWA</strong>, and <strong>bilingual support</strong>.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth/login">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-lg text-lg">
                Access Demo System
              </Button>
            </Link>
            <Link href="#features">
              <Button variant="outline" size="lg" className="border-emerald-600 text-emerald-600 hover:bg-emerald-50 px-8 py-3 rounded-lg text-lg">
                Explore Features
              </Button>
            </Link>
          </div>
        </div>

        {/* Demo Credentials */}
        <div className="max-w-4xl mx-auto mb-16">
          <Card className="bg-white shadow-lg border-emerald-200">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl text-gray-900">Demo Credentials</CardTitle>
              <CardDescription>
                Use these credentials to explore different role perspectives
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {demoCredentials.map((cred, index) => (
                  <div key={index} className="flex items-center justify-between p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                    <div>
                      <div className="font-semibold text-gray-900">{cred.role}</div>
                      <div className="text-sm text-gray-600">
                        <span className="font-mono bg-white px-2 py-1 rounded mr-2 border">
                          {cred.username}
                        </span>
                        <span className="font-mono bg-white px-2 py-1 rounded border">
                          {cred.password}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/auth/login">
                  <Button className="bg-emerald-600 hover:bg-emerald-700 text-white">
                    Try Demo Login
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Features Grid */}
        <div id="features" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <Card key={index} className="bg-white shadow-md hover:shadow-lg transition-shadow border-l-4 border-l-emerald-500">
              <CardHeader>
                <div className="flex items-start gap-3">
                  <div className="text-2xl">{feature.icon}</div>
                  <div>
                    <CardTitle className="text-lg text-gray-900 leading-tight">
                      {feature.title}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600 text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pakistan-Specific Features */}
        <div className="bg-white rounded-2xl shadow-xl p-8 mb-16 border border-emerald-100">
          <h2 className="text-3xl font-bold text-gray-900 text-center mb-8">
            Built Specifically for Pakistani Clinics
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Healthcare Compliance</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  CNIC validation and patient ID management
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  Health card and insurance integration
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  Pakistani drug database with local brands
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  PMC and provincial licensing support
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Local Business Needs</h3>
              <ul className="space-y-2 text-gray-600">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  Multi-language support (Urdu/English)
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  Local payment methods integration
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  Offline-first for power/internet issues
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full mr-3"></div>
                  WhatsApp-first communication
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="text-center bg-white rounded-2xl shadow-lg p-8 border border-emerald-100">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Transform Your Clinic?
          </h2>
          <p className="text-xl text-gray-600 mb-6">
            Built for Pakistani healthcare providers who need reliable, feature-rich clinic management.
          </p>
          <Link href="/auth/login">
            <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
              Start Demo Experience
            </Button>
          </Link>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="w-8 h-8 bg-emerald-600 rounded-lg flex items-center justify-center mr-3">
                <span className="text-white font-bold">🏥</span>
              </div>
              <span className="text-xl font-bold">Pakistan Clinic Management</span>
            </div>
            <p className="text-gray-400 mb-6">
              Modern clinic management system designed specifically for Pakistani healthcare providers.
            </p>
            <p className="text-gray-500 text-sm">
              © 2024 Pakistan Clinic Management System. All rights reserved. Made in Pakistan 🇵🇰
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}