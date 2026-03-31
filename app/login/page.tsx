'use client'

export const dynamic = 'force-dynamic'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const router = useRouter()

    const handleLogin = async () => {
        const res = await fetch('/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password }),
        })

        if (res.ok) {
            router.push('/')
        } else {
            setError('Contraseña incorrecta')
        }
    }

    return (
        <main className="min-h-screen bg-gray-950 flex items-center justify-center">
            <div className="bg-gray-900 rounded-lg p-8 w-full max-w-sm">
                <h1 className="text-white text-xl font-bold mb-6 text-center">Panel VM Licencias</h1>
                <input
                    type="password"
                    className="w-full bg-gray-800 text-white rounded px-4 py-2 mb-4"
                    placeholder="Contraseña"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && handleLogin()}
                />
                {error && <p className="text-red-400 text-sm mb-4">{error}</p>}
                <button
                    onClick={handleLogin}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 rounded font-semibold"
                >
                    Entrar
                </button>
            </div>
        </main>
    )
}