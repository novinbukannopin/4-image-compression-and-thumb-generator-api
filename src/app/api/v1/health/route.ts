import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({
    message: 'Health check successful',
    status: 'OK',
    timestamp: new Date().toISOString(),
  })
}