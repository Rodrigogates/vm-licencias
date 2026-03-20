import { NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { auth } from '@clerk/nextjs/server'

// GET - listar todas las licencias
export async function GET() {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { data, error } = await supabase
        .from('licencias')
        .select('*')
        .order('fecha_creacion', { ascending: false })

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}

// POST - crear nueva licencia
export async function POST(request: Request) {
    const { userId } = await auth()
    if (!userId) return NextResponse.json({ error: 'No autorizado' }, { status: 401 })

    const { id, nombre, notas } = await request.json()

    const { data, error } = await supabase
        .from('licencias')
        .insert({ id, nombre, notas, status: 'activa' })
        .select()
        .single()

    if (error) return NextResponse.json({ error: error.message }, { status: 500 })
    return NextResponse.json(data)
}