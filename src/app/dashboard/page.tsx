'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface User {
  id: number;
  clinic_id: number;
  username: string;
  email: string;
  phone: string;
  full_name: string;
  role: string;
  is_active: boolean;
}

const roleFeatures = {
  owner: {
    title: 'Owner Dashboard',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    features: [
      { name: 'Revenue Analytics', icon: '📊', path: '/dashboard/analytics' },
      { name: 'Staff Management', icon: '👥', path: '/dashboard/staff' },
      { name: 'Audit Logs', icon: '📝', path: '/dashboard/audit' },
      { name: 'Clinic Settings', icon: '⚙️', path: '/dashboard/settings' }
    ]
  },
  reception: {
    title: 'Reception Dashboard', 
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    features: [
      { name: 'Patient Registration', icon: '👤', path: '/dashboard/patients' },
      { name: 'Token Management', icon: '🎫', path: '/dashboard/tokens' },
      { name: 'Queue Display', icon: '📺', path: '/dashboard/queue' },
      { name: 'Basic Billing', icon: '💰', path: '/dashboard/billing' }
    ]
  },
  doctor: {
    title: 'Doctor Dashboard',
    color: 'bg-green-100 text-green-800 border-green-200', 
    features: [
      { name: 'Today\'s Queue', icon: '🏥', path: '/dashboard/queue' },
      { name: 'Visit Notes', icon: '📋', path: '/dashboard/visits' },
      { name: 'E-Prescriptions', icon: '💊', path: '/dashboard/prescriptions' },
      { name: 'Patient History', icon: '📖', path: '/dashboard/patients' }
    ]
  },
  pharmacy: {
    title: 'Pharmacy Dashboard',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    features: [
      { name: 'Inventory Management', icon: '📦', path: '/dashboard/inventory' },
      { name: 'Medicine Dispensing', icon: '💊', path: '/dashboard/dispense' },
      { name: 'Stock Alerts', icon: '⚠️', path: '/dashboard/alerts' },
      { name: 'Batch Tracking', icon: '🏷️', path: '/dashboard/batches' }
    ]
  },
  accountant: {
    title: 'Accountant Dashboard',
    color: 'bg-teal-100 text-teal-800 border-teal-200',
    features: [
      { name: 'Day Close Reports', icon: '📊', path: '/dashboard/reports' },
      { name: 'Payment Tracking', icon: '💳', path: '/dashboard/payments' },
      { name: 'Due Management', icon: '💰', path: '/dashboard/dues' },
      { name: 'Financial Analytics', icon: '📈', path: '/dashboard/financial' }
    ]
  }
};

export default function Dashboard() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const response = await fetch('/api/auth/me');
      const data = await response.json();
      
      if (data.success) {
        setUser(data.user);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Failed to fetch user:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          </div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  const userFeatures = roleFeatures[user.role as keyof typeof roleFeatures] || roleFeatures.reception;

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
                <p className="text-sm text-emerald-600">Demo Clinic Karachi</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3">
                <Avatar>
                  <AvatarFallback className="bg-emerald-100 text-emerald-700">
                    {user.full_name.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{user.full_name}</p>
                  <p className="text-xs text-gray-500 capitalize">{user.role}</p>
                </div>
              </div>
              <Button
                variant="outline" 
                onClick={handleLogout}
                className="border-red-300 text-red-600 hover:bg-red-50"
              >
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Welcome back, {user.full_name}!
              </h1>
              <p className="text-gray-600 mt-2">
                {userFeatures.title} - Here's what you can do today
              </p>
            </div>
            <Badge className={userFeatures.color}>
              {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
            </Badge>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white border-emerald-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Today's Patients</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-emerald-600">24</div>
              <p className="text-xs text-gray-500 mt-1">+3 from yesterday</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-blue-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Active Tokens</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-blue-600">8</div>
              <p className="text-xs text-gray-500 mt-1">Currently waiting</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-orange-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Prescriptions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-orange-600">12</div>
              <p className="text-xs text-gray-500 mt-1">Today's total</p>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-purple-200">
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-gray-600">Revenue</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-purple-600">Rs 45,000</div>
              <p className="text-xs text-gray-500 mt-1">Today's earnings</p>
            </CardContent>
          </Card>
        </div>

        {/* Role-based Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {userFeatures.features.map((feature, index) => (
            <Card 
              key={index} 
              className="bg-white hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-emerald-500"
              onClick={() => router.push(feature.path)}
            >
              <CardHeader>
                <div className="flex items-center space-x-3">
                  <div className="text-3xl">{feature.icon}</div>
                  <div>
                    <CardTitle className="text-lg text-gray-900">
                      {feature.name}
                    </CardTitle>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <Button 
                  variant="outline" 
                  className="w-full border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    router.push(feature.path);
                  }}
                >
                  Open
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Pakistan-Specific Quick Actions */}
        <Separator className="my-8" />
        
        <div className="bg-white rounded-lg shadow-sm border border-emerald-200 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Pakistan-Specific Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center space-x-3 p-4 bg-emerald-50 rounded-lg border border-emerald-200">
              <div className="text-2xl">💬</div>
              <div>
                <p className="font-semibold text-gray-900">WhatsApp Ready</p>
                <p className="text-sm text-gray-600">Patient communication system</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="text-2xl">🌐</div>
              <div>
                <p className="font-semibold text-gray-900">Bilingual Support</p>
                <p className="text-sm text-gray-600">Urdu/English interface</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3 p-4 bg-orange-50 rounded-lg border border-orange-200">
              <div className="text-2xl">📱</div>
              <div>
                <p className="font-semibold text-gray-900">Offline PWA</p>
                <p className="text-sm text-gray-600">Works without internet</p>
              </div>
            </div>
          </div>
        </div>

        {/* Demo Notice */}
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <div className="flex items-start space-x-3">
            <div className="text-emerald-600 text-xl">ℹ️</div>
            <div>
              <h3 className="font-semibold text-emerald-800">Demo Environment</h3>
              <p className="text-emerald-700 text-sm mt-1">
                You are currently using the demo version of Pakistan Clinic Management System. 
                All data is simulated and resets periodically.
              </p>
              <div className="mt-3 flex flex-wrap gap-2">
                <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                  🔐 Secure Authentication
                </Badge>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                  🏥 Role-based Access
                </Badge>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                  📱 Mobile Responsive
                </Badge>
                <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                  🇵🇰 Pakistan Localized
                </Badge>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}