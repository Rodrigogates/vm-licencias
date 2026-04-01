import { NextResponse } from 'next/server'

export async function POST(request: Request) {
    const { password } = await request.json()

    if (password !== process.env.ADMIN_PASSWORD) {
        return NextResponse.json({ error: 'Contraseña incorrecta' }, { status: 401 })
    }

    const response = NextResponse.json({ ok: true })
    response.cookies.set('admin_session', process.env.ADMIN_PASSWORD!, {
        httpOnly: true,
        secure: true,
        sameSite: 'strict',
        maxAge: 60 * 60 * 24 * 7, // 7 días
    })

    return response
}