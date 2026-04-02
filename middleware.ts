import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!

export function middleware(request: NextRequest) {
    // Rutas públicas - no requieren auth
    if (request.nextUrl.pathname.startsWith('/api/verify') ||
        request.nextUrl.pathname.startsWith('/api/login')) {
        return NextResponse.next()
    }

    // Página de login
    if (request.nextUrl.pathname === '/login') {
        return NextResponse.next()
    }

    // Verificar cookie de sesión
    const session = request.cookies.get('admin_session')?.value
    if (session === ADMIN_PASSWORD) {
        return NextResponse.next()
    }

    // Redirigir al login
    return NextResponse.redirect(new URL('/login', request.url))
}

export const config = {
    matcher: ['/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)'],
}