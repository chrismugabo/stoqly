 'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

const clash = "'Clash Display', sans-serif"

export default function Signup() {
  const [form, setForm] = useState({ firstName: '', lastName: '', restaurantName: '', email: '', password: '', confirmPassword: '' })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  const handleSignup = async (e) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) { setError('Passwords do not match'); return }
    if (form.password.length < 6) { setError('Password must be at least 6 characters'); return }
    if (!form.firstName.trim()) { setError('Please enter your first name'); return }

    setLoading(true)

    const { data, error: signUpError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password
    })

    if (signUpError) { setError(signUpError.message); setLoading(false); return }

    if (data?.user) {
      await supabase.from('profiles').insert({
        id: data.user.id,
        first_name: form.firstName.trim(),
        last_name: form.lastName.trim(),
        restaurant_name: form.restaurantName.trim()
      })
    }

    setSuccess(true)
    setLoading(false)
  }

  if (success) {
    return (
      <main style={{ minHeight: '100vh', background: '#0C3D22', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'DM Sans, sans-serif' }}>
        <div style={{ width: '100%', maxWidth: '420px', background: '#F7F4EF', borderRadius: '24px', padding: '40px', textAlign: 'center', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>
          <div style={{ fontSize: '56px', marginBottom: '16px' }}>🎉</div>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111', marginBottom: '12px', fontFamily: clash }}>
            Welcome, {form.firstName}!
          </h1>
          <p style={{ color: '#6b7280', fontSize: '14px', lineHeight: 1.6, marginBottom: '8px' }}>
            Check your email <strong>{form.email}</strong> to confirm your account.
          </p>
          {form.restaurantName && (
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '28px' }}>
              We can't wait to help <strong>{form.restaurantName}</strong> save money on suppliers 🇷🇼
            </p>
          )}
          <Link href="/login">
            <div style={{ background: '#1A6B3C', color: 'white', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: clash }}>
              Go to Login →
            </div>
          </Link>
        </div>
      </main>
    )
  }

  const inputStyle = { width: '100%', padding: '12px 16px', border: '1.5px solid #e5e7eb', borderRadius: '12px', fontSize: '14px', outline: 'none', background: 'white', color: '#111', boxSizing: 'border-box' }
  const labelStyle = { display: 'block', fontSize: '13px', fontWeight: 600, color: '#374151', marginBottom: '6px' }

  return (
    <main style={{ minHeight: '100vh', background: '#0C3D22', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '24px', fontFamily: 'DM Sans, sans-serif' }}>

      <Link href="/">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '40px', cursor: 'pointer' }}>
          <div style={{ width: '36px', height: '36px', background: '#1A6B3C', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '18px', color: 'white', fontFamily: clash }}>S</div>
          <span style={{ fontWeight: 700, fontSize: '22px', color: 'white', letterSpacing: '-0.5px', fontFamily: clash }}>Stoqly</span>
        </div>
      </Link>

      <div style={{ width: '100%', maxWidth: '420px', background: '#F7F4EF', borderRadius: '24px', padding: '40px', boxShadow: '0 32px 80px rgba(0,0,0,0.3)' }}>

        <h1 style={{ fontSize: '28px', fontWeight: 700, color: '#111', marginBottom: '8px', fontFamily: clash }}>Create your account</h1>
        <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '32px' }}>Start managing your suppliers for free 🇷🇼</p>

        {error && (
          <div style={{ background: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontSize: '13px', fontWeight: 500 }}>
            ⚠️ {error}
          </div>
        )}

        <form onSubmit={handleSignup}>

          {/* Name row */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
            <div>
              <label style={labelStyle}>First Name *</label>
              <input
                name="firstName"
                value={form.firstName}
                onChange={handleChange}
                placeholder="Chris"
                required
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1A6B3C'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
            <div>
              <label style={labelStyle}>Last Name</label>
              <input
                name="lastName"
                value={form.lastName}
                onChange={handleChange}
                placeholder="Mugabo"
                style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#1A6B3C'}
                onBlur={e => e.target.style.borderColor = '#e5e7eb'}
              />
            </div>
          </div>

          {/* Restaurant name */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Restaurant / Bar Name</label>
            <input
              name="restaurantName"
              value={form.restaurantName}
              onChange={handleChange}
              placeholder="e.g. Mama Africa Restaurant"
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#1A6B3C'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Email */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Email *</label>
            <input
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#1A6B3C'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Password */}
          <div style={{ marginBottom: '16px' }}>
            <label style={labelStyle}>Password *</label>
            <input
              name="password"
              type="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Min 6 characters"
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#1A6B3C'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Confirm Password */}
          <div style={{ marginBottom: '24px' }}>
            <label style={labelStyle}>Confirm Password *</label>
            <input
              name="confirmPassword"
              type="password"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="••••••••"
              required
              style={inputStyle}
              onFocus={e => e.target.style.borderColor = '#1A6B3C'}
              onBlur={e => e.target.style.borderColor = '#e5e7eb'}
            />
          </div>

          {/* Trust signal */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', padding: '12px', background: '#f0fdf4', borderRadius: '10px' }}>
            <span style={{ fontSize: '16px' }}>🔒</span>
            <p style={{ color: '#166534', fontSize: '12px' }}>Your data is private and secure. No credit card required.</p>
          </div>

          <button
            type="submit"
            disabled={loading}
            style={{ width: '100%', background: '#1A6B3C', color: 'white', border: 'none', borderRadius: '12px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1, fontFamily: clash }}
          >
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>

        <div style={{ marginTop: '24px', textAlign: 'center' }}>
          <p style={{ color: '#9ca3af', fontSize: '14px' }}>
            Already have an account?{' '}
            <Link href="/login">
              <span style={{ color: '#1A6B3C', fontWeight: 700, cursor: 'pointer' }}>Sign in</span>
            </Link>
          </p>
        </div>

      </div>

      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '12px', marginTop: '32px' }}>Built for Kigali restaurants 🇷🇼</p>

    </main>
  )
}