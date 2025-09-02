'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import Link from 'next/link';

interface Patient {
  id: number;
  name: string;
  phone: string;
  cnic?: string;
  age?: number;
  gender?: string;
  address?: string;
  created_at: string;
}

export default function PatientsPage() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [newPatient, setNewPatient] = useState({
    name: '',
    phone: '',
    cnic: '',
    dob: '',
    gender: '',
    address: '',
    emergency_contact: '',
    emergency_phone: '',
    medical_history: '',
    allergies: ''
  });

  // Demo patients data
  useEffect(() => {
    const demoPatients = [
      {
        id: 1,
        name: 'Ahmed Khan',
        phone: '+92-300-1234567',
        cnic: '42101-1234567-1',
        age: 35,
        gender: 'Male',
        address: 'Gulshan-e-Iqbal, Karachi',
        created_at: new Date().toISOString()
      },
      {
        id: 2,
        name: 'Fatima Sheikh',
        phone: '+92-321-2345678',
        cnic: '42201-2345678-2',
        age: 28,
        gender: 'Female', 
        address: 'Defence, Karachi',
        created_at: new Date().toISOString()
      },
      {
        id: 3,
        name: 'Muhammad Ali',
        phone: '+92-345-3456789',
        cnic: '42301-3456789-3',
        age: 42,
        gender: 'Male',
        address: 'Clifton, Karachi',
        created_at: new Date().toISOString()
      }
    ];
    setPatients(demoPatients);
  }, []);

  const filteredPatients = patients.filter(patient =>
    patient.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.phone.includes(searchTerm) ||
    (patient.cnic && patient.cnic.includes(searchTerm))
  );

  const handleAddPatient = (e: React.FormEvent) => {
    e.preventDefault();
    
    const patient = {
      id: patients.length + 1,
      name: newPatient.name,
      phone: newPatient.phone,
      cnic: newPatient.cnic || undefined,
      age: newPatient.dob ? new Date().getFullYear() - new Date(newPatient.dob).getFullYear() : undefined,
      gender: newPatient.gender || undefined,
      address: newPatient.address || undefined,
      created_at: new Date().toISOString()
    };

    setPatients([...patients, patient]);
    setNewPatient({
      name: '',
      phone: '',
      cnic: '',
      dob: '',
      gender: '',
      address: '',
      emergency_contact: '',
      emergency_phone: '',
      medical_history: '',
      allergies: ''
    });
    setIsDialogOpen(false);
  };

  const validateCNIC = (cnic: string) => {
    const cnicPattern = /^\d{5}-\d{7}-\d{1}$/;
    return cnicPattern.test(cnic);
  };

  const validatePhone = (phone: string) => {
    const phonePattern = /^\+?92-?3\d{2}-?\d{7}$/;
    return phonePattern.test(phone.replace(/\s/g, ''));
  };

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
                <h1 className="text-xl font-bold text-gray-900">Patient Management</h1>
                <p className="text-sm text-emerald-600">Register and manage patient records</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Actions Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Patients</h2>
            <p className="text-gray-600">Manage patient registrations and records</p>
          </div>
          
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-emerald-600 hover:bg-emerald-700">
                📋 Register New Patient
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle className="text-xl text-gray-900">Register New Patient</DialogTitle>
              </DialogHeader>
              
              <form onSubmit={handleAddPatient} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      value={newPatient.name}
                      onChange={(e) => setNewPatient({...newPatient, name: e.target.value})}
                      placeholder="Enter patient's full name"
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number *</Label>
                    <Input
                      id="phone"
                      value={newPatient.phone}
                      onChange={(e) => setNewPatient({...newPatient, phone: e.target.value})}
                      placeholder="+92-300-1234567"
                      required
                    />
                    {newPatient.phone && !validatePhone(newPatient.phone) && (
                      <p className="text-xs text-red-600">Invalid Pakistani phone format</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="cnic">CNIC</Label>
                    <Input
                      id="cnic"
                      value={newPatient.cnic}
                      onChange={(e) => setNewPatient({...newPatient, cnic: e.target.value})}
                      placeholder="42101-1234567-1"
                    />
                    {newPatient.cnic && !validateCNIC(newPatient.cnic) && (
                      <p className="text-xs text-red-600">Invalid CNIC format (xxxxx-xxxxxxx-x)</p>
                    )}
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="dob">Date of Birth</Label>
                    <Input
                      id="dob"
                      type="date"
                      value={newPatient.dob}
                      onChange={(e) => setNewPatient({...newPatient, dob: e.target.value})}
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="gender">Gender</Label>
                    <Select onValueChange={(value) => setNewPatient({...newPatient, gender: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select gender" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="emergency_phone">Emergency Contact</Label>
                    <Input
                      id="emergency_phone"
                      value={newPatient.emergency_phone}
                      onChange={(e) => setNewPatient({...newPatient, emergency_phone: e.target.value})}
                      placeholder="+92-300-1234567"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="address">Address</Label>
                  <Textarea
                    id="address"
                    value={newPatient.address}
                    onChange={(e) => setNewPatient({...newPatient, address: e.target.value})}
                    placeholder="Patient's complete address"
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="medical_history">Medical History</Label>
                  <Textarea
                    id="medical_history"
                    value={newPatient.medical_history}
                    onChange={(e) => setNewPatient({...newPatient, medical_history: e.target.value})}
                    placeholder="Previous medical conditions, surgeries, etc."
                    rows={2}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="allergies">Allergies</Label>
                  <Textarea
                    id="allergies"
                    value={newPatient.allergies}
                    onChange={(e) => setNewPatient({...newPatient, allergies: e.target.value})}
                    placeholder="Known allergies to medications or substances"
                    rows={2}
                  />
                </div>
                
                <div className="flex justify-end space-x-2 pt-4">
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
                    disabled={!newPatient.name || !newPatient.phone}
                  >
                    Register Patient
                  </Button>
                </div>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <Input
            placeholder="Search patients by name, phone, or CNIC..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>

        {/* Patients Table */}
        <Card className="bg-white border-emerald-200">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Registered Patients ({filteredPatients.length})</span>
              <Badge variant="outline" className="text-emerald-700 border-emerald-300">
                Demo Data
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Patient Info</TableHead>
                  <TableHead>Contact</TableHead>
                  <TableHead>CNIC</TableHead>
                  <TableHead>Age/Gender</TableHead>
                  <TableHead>Registration</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredPatients.map((patient) => (
                  <TableRow key={patient.id} className="hover:bg-emerald-50">
                    <TableCell>
                      <div>
                        <div className="font-semibold text-gray-900">{patient.name}</div>
                        {patient.address && (
                          <div className="text-sm text-gray-500">{patient.address}</div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        <div className="text-gray-900">{patient.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      {patient.cnic ? (
                        <div className="font-mono text-sm">{patient.cnic}</div>
                      ) : (
                        <span className="text-gray-400">Not provided</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="text-sm">
                        {patient.age && <div>{patient.age} years</div>}
                        {patient.gender && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {patient.gender}
                          </Badge>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="text-xs text-gray-500">
                        {new Date(patient.created_at).toLocaleDateString('en-PK')}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex space-x-2">
                        <Button 
                          size="sm" 
                          variant="outline"
                          className="border-emerald-300 text-emerald-600 hover:bg-emerald-50"
                        >
                          View
                        </Button>
                        <Button 
                          size="sm"
                          className="bg-blue-600 hover:bg-blue-700 text-white"
                        >
                          New Visit
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
            
            {filteredPatients.length === 0 && (
              <div className="text-center py-8">
                <div className="text-gray-400 text-lg mb-2">👤</div>
                <p className="text-gray-500">
                  {searchTerm ? 'No patients found matching your search.' : 'No patients registered yet.'}
                </p>
                {!searchTerm && (
                  <Button 
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700"
                    onClick={() => setIsDialogOpen(true)}
                  >
                    Register First Patient
                  </Button>
                )}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Pakistan-specific Information */}
        <div className="mt-8 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
          <h3 className="font-semibold text-emerald-800 mb-2">🇵🇰 Pakistan-Specific Features</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-emerald-700">
            <div>
              <strong>CNIC Validation:</strong> Format validation for Pakistani CNIC numbers (xxxxx-xxxxxxx-x)
            </div>
            <div>
              <strong>Phone Validation:</strong> Pakistani mobile number format (+92-3xx-xxxxxxx)
            </div>
            <div>
              <strong>Health Card Ready:</strong> Integration ready for government health cards and insurance
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}