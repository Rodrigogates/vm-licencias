import { getSupabase } from '@/lib/supabase'

export const dynamic = 'force-dynamic'

export async function GET() {
    const supabase = getSupabase()
    await supabase.from('licencias').select('id').limit(1)
    return new Response('ok')
}