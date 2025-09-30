import React, { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation() as any
  const from = location.state?.from?.pathname || '/'

  const [email, setEmail] = useState('analyst@kmrl.co.in')
  const [password, setPassword] = useState('password123')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await login(email, password)
      navigate(from, { replace: true })
    } catch (err: any) {
      setError(err?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{
      display: 'grid',
      placeItems: 'center',
      minHeight: '100vh',
      background: '#0b1220'
    }}>
      <div style={{
        width: 380,
        background: 'rgba(2,6,23,0.8)',
        border: '1px solid rgba(255,255,255,0.12)',
        borderRadius: 16,
        padding: 24,
      }}>
        <div style={{ textAlign: 'center', marginBottom: 16 }}>
          <h1 style={{ margin: 0, fontWeight: 800, color: 'white' }}>Trinetra</h1>
          <div style={{ color: '#94a3b8' }}>KMRL Document Intelligence Platform</div>
        </div>
        <form onSubmit={onSubmit}>
          <label style={{ fontSize: 12, color: '#cbd5e1' }}>Email</label>
          <input
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            required
            style={{
              width: '100%', marginTop: 6, marginBottom: 12,
              padding: '10px 12px', borderRadius: 8,
              background: '#0f172a', color: 'white',
              border: '1px solid rgba(255,255,255,0.12)'
            }}
          />
          <label style={{ fontSize: 12, color: '#cbd5e1' }}>Password</label>
          <input
            value={password}
            onChange={e => setPassword(e.target.value)}
            type="password"
            required
            style={{
              width: '100%', marginTop: 6, marginBottom: 16,
              padding: '10px 12px', borderRadius: 8,
              background: '#0f172a', color: 'white',
              border: '1px solid rgba(255,255,255,0.12)'
            }}
          />
          {error && (
            <div style={{
              marginBottom: 12, padding: 8, borderRadius: 8,
              background: 'rgba(127,29,29,0.25)', color: '#fecaca',
              border: '1px solid rgba(239,68,68,0.5)'
            }}>
              {error}
            </div>
          )}
          <button
            disabled={loading}
            type="submit"
            style={{
              width: '100%',
              padding: '10px 12px',
              borderRadius: 10,
              border: '1px solid rgba(255,255,255,0.12)',
              background: '#2563eb',
              color: 'white',
              fontWeight: 700
            }}
          >
            {loading ? 'Signing in…' : 'Sign in'}
          </button>
        </form>
        <div style={{ textAlign: 'center', marginTop: 10, color: '#64748b', fontSize: 12 }}>
          © 2025 House Stark
        </div>
      </div>
    </div>
  )
}