import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  const origin = request.nextUrl.origin
  const response = NextResponse.redirect(new URL('/admin', origin))
  response.cookies.delete('admin_session')
  return response
}

export async function GET(request: NextRequest) {
  const origin = request.nextUrl.origin
  const response = NextResponse.redirect(new URL('/admin', origin))
  response.cookies.delete('admin_session')
  return response
}
