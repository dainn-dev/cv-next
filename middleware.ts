import { NextRequest, NextResponse } from 'next/server'

function isValidKey(key: string | null): boolean {
  if (!key) return false
  try {
    const decoded = Buffer.from(key, "base64").toString("utf-8")
    const [datePart, code] = decoded.split("-")
    if (code !== "1112") return false
    const now = new Date()
    const pad = (n: number) => n.toString().padStart(2, '0')
    const yyyy = now.getFullYear().toString()
    const MM = pad(now.getMonth() + 1)
    const dd = pad(now.getDate())
    const hh = pad(now.getHours())
    const mm = pad(now.getMinutes())
    const current = `${yyyy}${MM}${dd}${hh}${mm}`
    return datePart === current
  } catch {
    return false
  }
}

export default function middleware(request: NextRequest) {
  if (request.nextUrl.pathname.startsWith('/admin')) {
    console.log('Admin access attempt:', {
      path: request.nextUrl.pathname,
      timestamp: new Date().toISOString()
    })
    const key = request.nextUrl.searchParams.get('key')
    if (!isValidKey(key)) {
      console.log('Admin access denied - invalid key')
      return NextResponse.redirect(new URL('/', request.url))
    }
    console.log('Admin access granted')
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*'],
} 