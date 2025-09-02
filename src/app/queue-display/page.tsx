'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface Token {
  id: number;
  token_number: number;
  patient_name: string;
  doctor_name: string;
  specialty: string;
  status: 'waiting' | 'called' | 'in_progress' | 'completed';
  estimated_time?: string;
}

export default function QueueDisplayPage() {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  // Demo tokens data with real-time updates
  useEffect(() => {
    const demoTokens = [
      {
        id: 1,
        token_number: 1,
        patient_name: 'Ahmed K.',
        doctor_name: 'Dr. Fatima Sheikh',
        specialty: 'General Medicine',
        status: 'completed' as const,
        estimated_time: '09:30 AM'
      },
      {
        id: 2,
        token_number: 2,
        patient_name: 'Fatima S.',
        doctor_name: 'Dr. Fatima Sheikh',
        specialty: 'General Medicine',
        status: 'in_progress' as const,
        estimated_time: '09:45 AM'
      },
      {
        id: 3,
        token_number: 3,
        patient_name: 'Muhammad A.',
        doctor_name: 'Dr. Fatima Sheikh',
        specialty: 'General Medicine',
        status: 'waiting' as const,
        estimated_time: '10:00 AM'
      },
      {
        id: 4,
        token_number: 4,
        patient_name: 'Sarah K.',
        doctor_name: 'Dr. Ahmed Ali',
        specialty: 'Cardiology',
        status: 'waiting' as const,
        estimated_time: '10:15 AM'
      },
      {
        id: 5,
        token_number: 5,
        patient_name: 'Hassan M.',
        doctor_name: 'Dr. Fatima Sheikh',
        specialty: 'General Medicine',
        status: 'waiting' as const,
        estimated_time: '10:30 AM'
      }
    ];
    setTokens(demoTokens);

    // Simulate real-time updates
    const updateTimer = setInterval(() => {
      setTokens(prevTokens => {
        const updated = [...prevTokens];
        // Randomly update a waiting token to called
        const waitingTokens = updated.filter(t => t.status === 'waiting');
        if (waitingTokens.length > 0 && Math.random() > 0.7) {
          const randomToken = waitingTokens[Math.floor(Math.random() * waitingTokens.length)];
          const index = updated.findIndex(t => t.id === randomToken.id);
          if (index !== -1) {
            updated[index] = { ...updated[index], status: 'called' };
          }
        }
        return updated;
      });
    }, 10000); // Update every 10 seconds

    return () => clearInterval(updateTimer);
  }, []);

  const currentToken = tokens.find(t => t.status === 'in_progress');
  const calledTokens = tokens.filter(t => t.status === 'called');
  const waitingTokens = tokens.filter(t => t.status === 'waiting');



  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-600 via-teal-600 to-blue-600 p-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="flex items-center justify-center mb-4">
          <div className="w-16 h-16 bg-white rounded-xl flex items-center justify-center mr-4">
            <span className="text-emerald-600 font-bold text-2xl">🏥</span>
          </div>
          <div className="text-white">
            <h1 className="text-4xl font-bold">Demo Clinic Karachi</h1>
            <p className="text-xl opacity-90">Token Queue Display</p>
          </div>
        </div>
        
        <div className="flex justify-center items-center space-x-8 text-white">
          <div className="text-center">
            <div className="text-3xl font-bold">
              {currentTime.toLocaleTimeString('en-PK', { 
                hour: '2-digit', 
                minute: '2-digit',
                hour12: true 
              })}
            </div>
            <div className="text-lg opacity-75">
              {currentTime.toLocaleDateString('en-PK', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric' 
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Current Token Display */}
      {currentToken && (
        <Card className="mb-8 bg-gradient-to-r from-green-400 to-green-600 border-0 shadow-2xl">
          <CardContent className="p-8 text-center">
            <div className="text-white">
              <h2 className="text-2xl font-semibold mb-2">NOW SERVING</h2>
              <div className="text-6xl font-bold mb-4">#{currentToken.token_number}</div>
              <div className="text-2xl font-medium mb-2">{currentToken.patient_name}</div>
              <div className="text-xl opacity-90">{currentToken.doctor_name}</div>
              <div className="text-lg opacity-75">{currentToken.specialty}</div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Called Tokens */}
      {calledTokens.length > 0 && (
        <Card className="mb-8 bg-gradient-to-r from-blue-400 to-blue-600 border-0 shadow-xl">
          <CardContent className="p-6">
            <h2 className="text-xl font-semibold text-white mb-4 text-center">PLEASE PROCEED TO CONSULTATION</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {calledTokens.map((token) => (
                <div key={token.id} className="bg-white bg-opacity-20 rounded-lg p-4 text-center text-white animate-pulse">
                  <div className="text-3xl font-bold mb-2">#{token.token_number}</div>
                  <div className="text-lg font-medium">{token.patient_name}</div>
                  <div className="text-sm opacity-75">{token.doctor_name}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Waiting Queue */}
      <Card className="bg-white bg-opacity-95 border-0 shadow-xl">
        <CardContent className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Waiting Queue</h2>
            <Badge className="bg-emerald-600 text-white text-lg px-4 py-2">
              {waitingTokens.length} Waiting
            </Badge>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {waitingTokens.map((token, index) => (
              <div key={token.id} className="text-center p-4 border border-gray-200 rounded-lg">
                <div className="text-2xl font-bold text-gray-900 mb-2">#{token.token_number}</div>
                <div className="text-sm font-medium text-gray-700">{token.patient_name}</div>
                <div className="text-xs text-gray-500 mt-1">{token.doctor_name}</div>
                {token.estimated_time && (
                  <div className="text-xs text-emerald-600 mt-1">Est: {token.estimated_time}</div>
                )}
                <Badge variant="outline" className="mt-2 text-xs">
                  Position: {index + 1}
                </Badge>
              </div>
            ))}
          </div>
          
          {waitingTokens.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-4">✅</div>
              <div className="text-xl">No patients waiting</div>
              <div className="text-sm mt-2">All patients have been served</div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Footer Info */}
      <div className="mt-8 text-center">
        <div className="bg-white bg-opacity-20 rounded-lg p-4 text-white">
          <div className="text-sm opacity-75">
            🇵🇰 Pakistan Clinic Management System • Live Queue Display
          </div>
          <div className="text-xs opacity-60 mt-1">
            Updates automatically • Compatible with Android TV
          </div>
        </div>
      </div>
    </div>
  );
}