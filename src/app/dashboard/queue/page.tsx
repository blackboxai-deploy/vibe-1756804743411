'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import Link from 'next/link';

interface Token {
  id: number;
  token_number: number;
  patient_name: string;
  patient_phone: string;
  doctor_name: string;
  specialty: string;
  status: 'waiting' | 'called' | 'in_progress' | 'completed';
  issue_time: string;
  estimated_time?: string;
}

interface Patient {
  id: number;
  name: string;
  phone: string;
}

export default function QueuePage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [patients] = useState<Patient[]>([
    { id: 1, name: 'Ahmed Khan', phone: '+92-300-1234567' },
    { id: 2, name: 'Fatima Sheikh', phone: '+92-321-2345678' },
    { id: 3, name: 'Muhammad Ali', phone: '+92-345-3456789' },
  ]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newToken, setNewToken] = useState({
    patient_id: '',
    doctor: 'Dr. Fatima Sheikh',
    specialty: 'General Medicine'
  });

  // Demo tokens
  useEffect(() => {
    const demoTokens = [
      {
        id: 1,
        token_number: 1,
        patient_name: 'Ahmed Khan',
        patient_phone: '+92-300-1234567',
        doctor_name: 'Dr. Fatima Sheikh',
        specialty: 'General Medicine',
        status: 'completed' as const,
        issue_time: '09:15 AM',
        estimated_time: '09:30 AM'
      },
      {
        id: 2,
        token_number: 2,
        patient_name: 'Fatima Sheikh',
        patient_phone: '+92-321-2345678',
        doctor_name: 'Dr. Fatima Sheikh',
        specialty: 'General Medicine',
        status: 'in_progress' as const,
        issue_time: '09:30 AM',
        estimated_time: '09:45 AM'
      },
      {
        id: 3,
        token_number: 3,
        patient_name: 'Muhammad Ali',
        patient_phone: '+92-345-3456789',
        doctor_name: 'Dr. Fatima Sheikh',
        specialty: 'General Medicine',
        status: 'waiting' as const,
        issue_time: '09:45 AM',
        estimated_time: '10:00 AM'
      }
    ];
    setTokens(demoTokens);
  }, []);

  const handleIssueToken = (e: React.FormEvent) => {
    e.preventDefault();
    
    const selectedPatient = patients.find(p => p.id.toString() === newToken.patient_id);
    if (!selectedPatient) return;

    const nextTokenNumber = Math.max(...tokens.map(t => t.token_number), 0) + 1;
    const currentTime = new Date();
    const estimatedTime = new Date(currentTime.getTime() + (nextTokenNumber * 15 * 60000)); // 15 minutes per token

    const token = {
      id: tokens.length + 1,
      token_number: nextTokenNumber,
      patient_name: selectedPatient.name,
      patient_phone: selectedPatient.phone,
      doctor_name: newToken.doctor,
      specialty: newToken.specialty,
      status: 'waiting' as const,
      issue_time: currentTime.toLocaleTimeString('en-PK', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      }),
      estimated_time: estimatedTime.toLocaleTimeString('en-PK', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      })
    };

    setTokens([...tokens, token]);
    setNewToken({
      patient_id: '',
      doctor: 'Dr. Fatima Sheikh',
      specialty: 'General Medicine'
    });
    setIsDialogOpen(false);
  };

  const updateTokenStatus = (tokenId: number, newStatus: Token['status']) => {
    setTokens(tokens.map(token => 
      token.id === tokenId 
        ? { ...token, status: newStatus }
        : token
    ));
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'called':
        return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'in_progress':
        return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'completed':
        return 'bg-green-100 text-green-800 border-green-300';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const waitingTokens = tokens.filter(t => t.status === 'waiting');
  const currentToken = tokens.find(t => t.status === 'in_progress');

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-emerald-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Link href="/dashboard">
                <Button variant="outline" size="sm" className="border-emerald-300 text-emerald-600">
                  ← Dashboard
                </Button>
              </Link>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Token Queue Management</h1>
                <p className="text-sm text-emerald-600">Manage patient queue and token system</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant="outline"
                className="border-blue-300 text-blue-600 hover:bg-blue-50"
                onClick={() => window.open('/queue-display', '_blank')}
              >
                📺 TV Display
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-emerald-600 hover:bg-emerald-700">
                    🎫 Issue New Token
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Issue New Token</DialogTitle>
                  </DialogHeader>
                  
                  <form onSubmit={handleIssueToken} className="space-y-4">
                    <div className="space-y-2">
                      <Label>Select Patient</Label>
                      <Select onValueChange={(value) => setNewToken({...newToken, patient_id: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Choose patient" />
                        </SelectTrigger>
                        <SelectContent>
                          {patients.map((patient) => (
                            <SelectItem key={patient.id} value={patient.id.toString()}>
                              {patient.name} - {patient.phone}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Doctor</Label>
                      <Select value={newToken.doctor} onValueChange={(value) => setNewToken({...newToken, doctor: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Dr. Fatima Sheikh">Dr. Fatima Sheikh</SelectItem>
                          <SelectItem value="Dr. Ahmed Ali">Dr. Ahmed Ali</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Specialty</Label>
                      <Select value={newToken.specialty} onValueChange={(value) => setNewToken({...newToken, specialty: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="General Medicine">General Medicine</SelectItem>
                          <SelectItem value="Cardiology">Cardiology</SelectItem>
                          <SelectItem value="Pediatrics">Pediatrics</SelectItem>
                          <SelectItem value="Orthopedics">Orthopedics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="flex justify-end space-x-2">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => setIsDialogOpen(false)}
                      >
                        Cancel
                      </Button>
                      <Button
                        type="submit"
                        className="bg-emerald-600 hover:bg-emerald-700"
                        disabled={!newToken.patient_id}
                      >
                        Issue Token
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Current Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card className="bg-white border-blue-200">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Now Serving</CardTitle>
            </CardHeader>
            <CardContent>
              {currentToken ? (
                <div>
                  <div className="text-3xl font-bold text-blue-600">#{currentToken.token_number}</div>
                  <div className="text-sm text-gray-900 mt-1">{currentToken.patient_name}</div>
                  <div className="text-xs text-gray-500">{currentToken.doctor_name}</div>
                </div>
              ) : (
                <div className="text-gray-400">No patient currently being served</div>
              )}
            </CardContent>
          </Card>
          
          <Card className="bg-white border-yellow-200">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Waiting</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-yellow-600">{waitingTokens.length}</div>
              <div className="text-sm text-gray-500 mt-1">Patients in queue</div>
            </CardContent>
          </Card>
          
          <Card className="bg-white border-emerald-200">
            <CardHeader>
              <CardTitle className="text-sm text-gray-600">Next Token</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-emerald-600">#{Math.max(...tokens.map(t => t.token_number), 0) + 1}</div>
              <div className="text-sm text-gray-500 mt-1">Will be issued next</div>
            </CardContent>
          </Card>
        </div>

        {/* Tokens List */}
        <Card className="bg-white border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Today's Token Queue</span>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                Live Demo
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tokens.length === 0 ? (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-lg mb-2">🎫</div>
                  <p className="text-gray-500">No tokens issued today.</p>
                  <Button 
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Issue First Token
                  </Button>
                </div>
              ) : (
                tokens.map((token) => (
                  <div key={token.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-emerald-50">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span className="font-bold text-emerald-700">#{token.token_number}</span>
                      </div>
                      
                      <div>
                        <div className="font-semibold text-gray-900">{token.patient_name}</div>
                        <div className="text-sm text-gray-600">{token.patient_phone}</div>
                        <div className="text-xs text-gray-500">
                          {token.doctor_name} • {token.specialty}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-3">
                      <div className="text-right text-sm">
                        <div className="text-gray-600">Issued: {token.issue_time}</div>
                        {token.estimated_time && (
                          <div className="text-gray-500">Est: {token.estimated_time}</div>
                        )}
                      </div>
                      
                      <Badge className={getStatusColor(token.status)}>
                        {token.status.replace('_', ' ')}
                      </Badge>
                      
                      <div className="flex space-x-1">
                        {token.status === 'waiting' && (
                          <Button
                            size="sm"
                            className="bg-blue-600 hover:bg-blue-700"
                            onClick={() => updateTokenStatus(token.id, 'called')}
                          >
                            Call
                          </Button>
                        )}
                        {token.status === 'called' && (
                          <Button
                            size="sm"
                            className="bg-orange-600 hover:bg-orange-700"
                            onClick={() => updateTokenStatus(token.id, 'in_progress')}
                          >
                            Start
                          </Button>
                        )}
                        {token.status === 'in_progress' && (
                          <Button
                            size="sm"
                            className="bg-green-600 hover:bg-green-700"
                            onClick={() => updateTokenStatus(token.id, 'completed')}
                          >
                            Complete
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </CardContent>
        </Card>

        {/* WhatsApp Integration */}
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="font-semibold text-emerald-800 mb-2">💬 WhatsApp Integration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-emerald-700">
            <div>
              <strong>Automated Reminders:</strong> "Your token #3 is approaching. Please be ready for your consultation with Dr. Fatima Sheikh."
            </div>
            <div>
              <strong>Status Updates:</strong> Real-time notifications sent to patients when their token status changes.
            </div>
          </div>
          <div className="mt-4">
            <Button size="sm" className="bg-emerald-600 hover:bg-emerald-700 text-white">
              💬 Send WhatsApp Updates
            </Button>
          </div>
        </div>
      </main>
    </div>
  );


}