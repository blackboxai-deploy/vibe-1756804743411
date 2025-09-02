import { NextRequest, NextResponse } from 'next/server';
import { getCurrentUser, clearSession, createAuditLog } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Get current user before clearing session
    const user = await getCurrentUser();

    // Clear the auth cookie
    await clearSession();

    // Create audit log if user was found
    if (user) {
      const clientIP = request.headers.get('x-forwarded-for') || 
                       request.headers.get('x-real-ip') || 
                       'unknown';
      const userAgent = request.headers.get('user-agent') || 'unknown';
      
      createAuditLog(
        user.clinic_id,
        user.id,
        'logout',
        'user',
        user.id,
        null,
        { username: user.username },
        clientIP,
        userAgent
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}