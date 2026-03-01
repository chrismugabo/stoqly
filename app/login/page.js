 'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

const clash = "'Clash Display', sans-serif"

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      window.location.href = '/dashboard'
    }
  }

  return (
    <main style={{ minHeight: '100vh', background: '#0C3D22', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'DM Sans, sans-serif' }}>

      {/* Logo */}
      <Link href="/">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', cursor: 'pointer' }}>
          <div style={{ width: '36px', height: '36px', background: '#1A6B3C', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', color: 'white', fontFamily: clash }}>S</div>
          <span style={{ fontWeight: 700, fontSize: '22px', color: 'white', letterSpacing: '-0.5px', fontFamily: clash }}>Stoqly</span>
        </div>
      </Link>

      {/* Card */}
      <div style={{ width: '100%', maxWidth: '420px', background: '#F7F4EF', borderRadius: '24px', padding: '40px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>

        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px', fontFamily: clash }}>Welcome back</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>Sign in to your Stoqly account</p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '13px', fontWeight: 500 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white', color: '#111', boxSizing: 'border-box', transition: 'border 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#1A6B3C'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white', color: '#111', boxSizing: 'border-box', transition: 'border 0.15s' }}
              onFocus={e => e.target.style.borderColor = '#1A6B3C'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#1A6B3C', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, transition: 'opacity 0.15s', fontFamily: clash }}
          >
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Don't have an account?{' '}
            <Link href="/signup">
              <span style={{ color: '#1A6B3C', fontWeight: 700, cursor: 'pointer' }}>Sign up free</span>
            </Link>
          </p>
        </div>

      </div>

      {/* Bottom note */}
      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '32px' }}>Built for Kigali restaurants 🇷🇼</p>

    </main>
  )
}