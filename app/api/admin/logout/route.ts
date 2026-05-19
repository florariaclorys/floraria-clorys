import { NextResponse } from 'next/server'

export async function POST() {
  const response = NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  response.cookies.delete('admin_session')
  return response
}

export async function GET() {
  const response = NextResponse.redirect(new URL('/admin', process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'))
  response.cookies.delete('admin_session')
  return response
}
