import { NextResponse } from 'next/server'
import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    console.log('GET /api/licencias called')
    console.log('SUPABASE URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
    try {
        const supabase = getSupabase()
        const { data, error } = await supabase
            .from('licencias')
            .select('*')
            .order('fecha_creacion', { ascending: false })

        console.log('data:', JSON.stringify(data))
        console.log('error:', JSON.stringify(error))

        if (error) return NextResponse.json({ error: error.message }, { status: 500 })
        return NextResponse.json(data)
    } catch (e) {
        console.log('CATCH:', e)
        return NextResponse.json({ error: String(e) }, { status: 500 })
    }
}

export async function POST(request: Request) {
    const { id, nombre, notas } = await request.json()

    const supabase = getSupabase()
    const { data, error } = await supabase
        .from('licencias')
        .insert({ id, nombre, notas, status: 'activa' })
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}