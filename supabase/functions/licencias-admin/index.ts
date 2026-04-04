import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response('ok', { headers: corsHeaders })

  // Verificar password
  const auth = req.headers.get('Authorization')
  if (auth !== `Bearer ${Deno.env.get('ADMIN_PASSWORD')}`) {
    return new Response(JSON.stringify({ error: 'No autorizado' }), {
      status: 401,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  const supabase = createClient(
      Deno.env.get('SUPABASE_URL')!,
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
  )

  const { action, id, nombre, notas, status, machine_id } = await req.json()

  let result

  if (action === 'crear') {
    result = await supabase.from('licencias').insert({
      id: `vm-${Date.now()}`,
      nombre,
      notas: notas || null,
      status: 'activa'
    })
  } else if (action === 'cambiarEstado') {
    result = await supabase.from('licencias').update({ status }).eq('id', id)
  } else if (action === 'resetear') {
    result = await supabase.from('licencias')
        .update({ machine_id: null, fecha_activacion: null, status: 'activa' })
        .eq('id', id)
  } else if (action === 'eliminar') {
    result = await supabase.from('licencias').delete().eq('id', id)
  } else {
    return new Response(JSON.stringify({ error: 'Acción desconocida' }), {
      status: 400,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  if (result.error) {
    return new Response(JSON.stringify({ error: result.error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' }
    })
  }

  return new Response(JSON.stringify({ ok: true }), {
    headers: { ...corsHeaders, 'Content-Type': 'application/json' }
  })
})