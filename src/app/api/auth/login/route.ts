import { NextRequest, NextResponse } from 'next/server';
import { authenticateUser, createSession, createAuditLog } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const { username, password } = await request.json();

    if (!username || !password) {
      return NextResponse.json(
        { success: false, message: 'Username and password are required' },
        { status: 400 }
      );
    }

    // Authenticate user
    const user = await authenticateUser(username, password);
    
    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid username or password' },
        { status: 401 }
      );
    }

    // Create session
    const token = await createSession(user);

    // Create audit log
    const clientIP = request.headers.get('x-forwarded-for') || 
                     request.headers.get('x-real-ip') || 
                     'unknown';
    const userAgent = request.headers.get('user-agent') || 'unknown';
    
    createAuditLog(
      user.clinic_id,
      user.id,
      'login',
      'user',
      user.id,
      null,
      { username: user.username },
      clientIP,
      userAgent
    );

    return NextResponse.json({
      success: true,
      message: 'Login successful',
      user: {
        id: user.id,
        clinic_id: user.clinic_id,
        username: user.username,
        email: user.email,
        phone: user.phone,
        full_name: user.full_name,
        role: user.role,
        is_active: user.is_active
      },
      token
    });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}