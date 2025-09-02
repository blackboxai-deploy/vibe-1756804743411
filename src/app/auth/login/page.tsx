'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const demoCredentials = [
  { username: 'admin', password: 'password', role: 'Owner', description: 'Full system access with analytics and settings' },
  { username: 'reception', password: 'password', role: 'Reception', description: 'Patient registration, tokens, and basic billing' },
  { username: 'doctor1', password: 'password', role: 'Doctor', description: 'Visit notes, prescriptions, and patient history' },
  { username: 'pharmacy', password: 'password', role: 'Pharmacy', description: 'Inventory management and medicine dispensing' }
];

export default function LoginPage() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // Redirect to dashboard
        router.push('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError('Network error. Please check your connection.');
      console.error('Login error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDemoLogin = (cred: typeof demoCredentials[0]) => {
    setUsername(cred.username);
    setPassword(cred.password);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 flex items-center justify-center p-4">
      <div className="w-full max-w-4xl">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-emerald-600 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">🏥</span>
            </div>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Pakistan Clinic Management</h1>
              <p className="text-emerald-600 font-medium">Complete Healthcare Solution</p>
            </div>
          </div>
          <Badge className="mb-4 bg-emerald-100 text-emerald-700">
            🇵🇰 Made for Pakistan
          </Badge>
        </div>

        <Tabs defaultValue="login" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="demo">Demo Accounts</TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <Card className="w-full max-w-md mx-auto shadow-lg border-emerald-200">
              <CardHeader className="text-center">
                <CardTitle className="text-2xl text-gray-900">Sign In</CardTitle>
                <CardDescription>
                  Access your clinic management dashboard
                </CardDescription>
              </CardHeader>
              
              <form onSubmit={handleLogin}>
                <CardContent className="space-y-4">
                  {error && (
                    <Alert className="border-red-200 bg-red-50">
                      <AlertDescription className="text-red-700">
                        {error}
                      </AlertDescription>
                    </Alert>
                  )}
                  
                  <div className="space-y-2">
                    <Label htmlFor="username">Username</Label>
                    <Input
                      id="username"
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      placeholder="Enter your username"
                      required
                      className="w-full"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Enter your password"
                      required
                      className="w-full"
                    />
                  </div>
                </CardContent>
                
                <CardFooter className="flex flex-col space-y-4">
                  <Button 
                    type="submit" 
                    className="w-full bg-emerald-600 hover:bg-emerald-700"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Signing in...' : 'Sign In'}
                  </Button>
                  
                  <div className="flex items-center justify-between w-full text-sm">
                    <Link href="/" className="text-emerald-600 hover:underline">
                      Back to Home
                    </Link>
                    <div className="text-gray-500">Demo System</div>
                  </div>
                </CardFooter>
              </form>
            </Card>
          </TabsContent>

          <TabsContent value="demo">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-4xl mx-auto">
              {demoCredentials.map((cred, index) => (
                <Card 
                  key={index} 
                  className="shadow-md hover:shadow-lg transition-shadow cursor-pointer border-l-4 border-l-emerald-500"
                  onClick={() => handleDemoLogin(cred)}
                >
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg text-gray-900">
                        {cred.role}
                      </CardTitle>
                      <Badge className="bg-emerald-100 text-emerald-700">
                        Demo Account
                      </Badge>
                    </div>
                    <CardDescription className="text-sm text-gray-600">
                      {cred.description}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="bg-gray-50 rounded-lg p-3 border">
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div>
                          <span className="font-semibold text-gray-700">Username:</span>
                          <div className="font-mono bg-white px-2 py-1 rounded text-emerald-700 mt-1 border">
                            {cred.username}
                          </div>
                        </div>
                        <div>
                          <span className="font-semibold text-gray-700">Password:</span>
                          <div className="font-mono bg-white px-2 py-1 rounded text-emerald-700 mt-1 border">
                            {cred.password}
                          </div>
                        </div>
                      </div>
                    </div>
                    <Button 
                      className="w-full mt-3 bg-emerald-600 hover:bg-emerald-700 text-white"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleDemoLogin(cred);
                      }}
                    >
                      Use This Account
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>

        <div className="text-center mt-8 text-sm text-gray-600">
          <p>© 2024 Pakistan Clinic Management System</p>
          <p className="mt-1">Built with modern technology for Pakistani healthcare providers</p>
        </div>
      </div>
    </div>
  );
}