import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import * as crypto from 'crypto'

const HMAC_SECRET = process.env.HMAC_SECRET!
const REPLAY_WINDOW = 5 * 60 // 5 minutos en segundos

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)

    const license_id = searchParams.get('license_id')
    const machine_id = searchParams.get('machine_id')
    const timestamp = searchParams.get('timestamp')
    const signature = searchParams.get('signature')

    // Verificar parámetros
    if (!license_id || !machine_id || !timestamp || !signature) {
        return NextResponse.json({ error: 'Parámetros incompletos' }, { status: 400 })
    }

    // Verificar timestamp anti-replay
    const now = Math.floor(Date.now() / 1000)
    const ts = parseInt(timestamp)
    if (Math.abs(now - ts) > REPLAY_WINDOW) {
        return NextResponse.json({ error: 'Timestamp expirado' }, { status: 401 })
    }

    // Verificar HMAC
    const payload = `${license_id}:${machine_id}:${timestamp}`
    const expected = crypto
        .createHmac('sha256', HMAC_SECRET)
        .update(payload)
        .digest('hex')

    if (signature !== expected) {
        return NextResponse.json({ error: 'Firma inválida' }, { status: 401 })
    }

    // Consultar licencia
    const { data: licencia, error } = await supabase
        .from('licencias')
        .select('*')
        .eq('id', license_id)
        .single()

    if (error || !licencia) {
        return NextResponse.json({ error: 'Licencia no encontrada' }, { status: 404 })
    }

    // Verificar estado
    if (licencia.status === 'revocada') {
        return NextResponse.json({ error: 'Licencia revocada' }, { status: 403 })
    }

    // Primera activación
    if (!licencia.machine_id) {
        await supabase
            .from('licencias')
            .update({ machine_id, fecha_activacion: new Date().toISOString() })
            .eq('id', license_id)
        return NextResponse.json({ ok: true })
    }

    // Verificar machine_id
    if (licencia.machine_id !== machine_id) {
        // Alerta Discord
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
```

Y añade estas variables al `.env.local`:
```