import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

const REPLAY_WINDOW = 5 * 60

async function verifyHmac(payload: string, signature: string, secret: string): Promise<boolean> {
    const encoder = new TextEncoder()
    const keyData = encoder.encode(secret)
    const messageData = encoder.encode(payload)

    const key = await crypto.subtle.importKey(
        'raw', keyData,
        { name: 'HMAC', hash: 'SHA-256' },
        false, ['verify']
    )

    const signatureBytes = Uint8Array.from(
        signature.match(/.{1,2}/g)!.map(b => parseInt(b, 16))
    )

    return crypto.subtle.verify('HMAC', key, signatureBytes, messageData)
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const license_id = searchParams.get('license_id')
    const machine_id = searchParams.get('machine_id')
    const timestamp = searchParams.get('timestamp')
    const signature = searchParams.get('signature')

    if (!license_id || !machine_id || !timestamp || !signature) {
        return NextResponse.json({ error: 'Parámetros incompletos' }, { status: 400 })
    }

    const now = Math.floor(Date.now() / 1000)
    const ts = parseInt(timestamp)
    if (Math.abs(now - ts) > REPLAY_WINDOW) {
        return NextResponse.json({ error: 'Timestamp expirado' }, { status: 401 })
    }

    const payload = `${license_id}:${machine_id}:${timestamp}`
    const valid = await verifyHmac(payload, signature, process.env.HMAC_SECRET!)

    if (!valid) {
        return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

    const supabase = getSupabase()
    const { data: licencia, error } = await supabase
        .from('licencias')
        .select('*')
        .eq('id', license_id)
        .single()

    if (error || !licencia) {
        return NextResponse.json({ error: 'Licencia no encontrada' }, { status: 404 })
    }

    if (licencia.status === 'revocada') {
        return NextResponse.json({ error: 'Licencia revocada' }, { status: 403 })
    }

    if (!licencia.machine_id) {
        await supabase
            .from('licencias')
            .update({ machine_id, fecha_activacion: new Date().toISOString() })
            .eq('id', license_id)
        return NextResponse.json({ ok: true })
    }

    if (licencia.machine_id !== machine_id) {
        await fetch(process.env.DISCORD_WEBHOOK_URL!, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                content: `🚨 **Intento de uso no autorizado**\nLicencia: \`${license_id}\`\nComprador: ${licencia.nombre}\nMachine ID registrado: \`${licencia.machine_id}\`\nMachine ID intruso: \`${machine_id}\``,
            }),
        })
        return NextResponse.json({ error: 'Machine ID no autorizado' }, { status: 403 })
    }

    return NextResponse.json({ ok: true })
}