'use client'

import { useEffect, useState } from 'react'
import { UserButton } from '@clerk/nextjs'

interface Licencia {
  id: string
  nombre: string
  status: string
  machine_id: string | null
  fecha_creacion: string
  fecha_activacion: string | null
  notas: string | null
}

export default function Home() {
  const [licencias, setLicencias] = useState<Licencia[]>([])
  const [loading, setLoading] = useState(true)
  const [nombre, setNombre] = useState('')
  const [notas, setNotas] = useState('')

  const fetchLicencias = async () => {
    const res = await fetch('/api/licencias')
    const data = await res.json()
    setLicencias(data)
    setLoading(false)
  }

  useEffect(() => { fetchLicencias() }, [])

  const crearLicencia = async () => {
    if (!nombre) return
    const id = `vm-${Date.now()}`
    await fetch('/api/licencias', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ id, nombre, notas }),
    })
    setNombre('')
    setNotas('')
    fetchLicencias()
  }

  const cambiarEstado = async (id: string, status: string) => {
    await fetch(`/api/licencias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    fetchLicencias()
  }

  const resetearMachine = async (id: string) => {
    await fetch(`/api/licencias/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ machine_id: null }),
    })
    fetchLicencias()
  }

  const eliminarLicencia = async (id: string) => {
    if (!confirm('¿Eliminar esta licencia?')) return
    await fetch(`/api/licencias/${id}`, { method: 'DELETE' })
    fetchLicencias()
  }

  return (
      <main className="min-h-screen bg-gray-950 text-white p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-bold">Panel de Licencias VM</h1>
            <UserButton />
          </div>

          {/* Crear licencia */}
          <div className="bg-gray-900 rounded-lg p-6 mb-8">
            <h2 className="text-lg font-semibold mb-4">Nueva licencia</h2>
            <div className="flex gap-4">
              <input
                  className="flex-1 bg-gray-800 rounded px-4 py-2 text-white"
                  placeholder="Nombre del alumno"
                  value={nombre}
                  onChange={e => setNombre(e.target.value)}
              />
              <input
                  className="flex-1 bg-gray-800 rounded px-4 py-2 text-white"
                  placeholder="Notas (opcional)"
                  value={notas}
                  onChange={e => setNotas(e.target.value)}
              />
              <button
                  onClick={crearLicencia}
                  className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded font-semibold"
              >
                Crear
              </button>
            </div>
          </div>

          {/* Lista de licencias */}
          <div className="bg-gray-900 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-gray-800">
              <tr>
                <th className="text-left px-4 py-3">ID</th>
                <th className="text-left px-4 py-3">Nombre</th>
                <th className="text-left px-4 py-3">Estado</th>
                <th className="text-left px-4 py-3">Machine ID</th>
                <th className="text-left px-4 py-3">Fecha</th>
                <th className="text-left px-4 py-3">Acciones</th>
              </tr>
              </thead>
              <tbody>
              {loading && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">Cargando...</td></tr>
              )}
              {!loading && licencias.length === 0 && (
                  <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-400">No hay licencias</td></tr>
              )}
              {licencias.map(l => (
                  <tr key={l.id} className="border-t border-gray-800">
                    <td className="px-4 py-3 font-mono text-sm">{l.id}</td>
                    <td className="px-4 py-3">{l.nombre}</td>
                    <td className="px-4 py-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${
                        l.status === 'activa' ? 'bg-green-800 text-green-200' :
                            l.status === 'revocada' ? 'bg-red-800 text-red-200' :
                                'bg-yellow-800 text-yellow-200'
                    }`}>
                      {l.status}
                    </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-xs text-gray-400">
                      {l.machine_id ?? '—'}
                    </td>
                    <td className="px-4 py-3 text-sm text-gray-400">
                      {new Date(l.fecha_creacion).toLocaleDateString('es-ES')}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex gap-2">
                        {l.status === 'activa' ? (
                            <button onClick={() => cambiarEstado(l.id, 'revocada')}
                                    className="bg-red-700 hover:bg-red-800 px-3 py-1 rounded text-xs">
                              Revocar
                            </button>
                        ) : (
                            <button onClick={() => cambiarEstado(l.id, 'activa')}
                                    className="bg-green-700 hover:bg-green-800 px-3 py-1 rounded text-xs">
                              Activar
                            </button>
                        )}
                        <button onClick={() => resetearMachine(l.id)}
                                className="bg-yellow-700 hover:bg-yellow-800 px-3 py-1 rounded text-xs">
                          Reset
                        </button>
                        <button onClick={() => eliminarLicencia(l.id)}
                                className="bg-gray-700 hover:bg-gray-800 px-3 py-1 rounded text-xs">
                          Eliminar
                        </button>
                      </div>
                    </td>
                  </tr>
              ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
  )
}