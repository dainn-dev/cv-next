import { NextRequest, NextResponse } from 'next/server'

// Add your whitelisted IPs here
const WHITELIST = [
  '127.0.0.1',
  '171.250.162.117', // localhost
  '::1',       // IPv6 localhost
  // 'YOUR.PUBLIC.IP', // Add your real IPs here
]

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
    // Get the IP address
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      '';
    if (WHITELIST.includes(ip)) {
      console.log('Admin access granted by IP whitelist:', ip)
      return NextResponse.next()
    }
    console.log('Admin access attempt:', {
      path: request.nextUrl.pathname,
      timestamp: new Date().toISOString(),
      ip,
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