'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Navbar from '@/app/components/Navbar'

const clash = "'Clash Display', sans-serif"

export default function ProfilePage() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [isMobile, setIsMobile] = useState(false)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [activeTab, setActiveTab] = useState('profile')

  const [form, setForm] = useState({
    first_name: '', last_name: '', restaurant_name: '', phone: ''
  })

  const [passwords, setPasswords] = useState({
    current: '', new: '', confirm: ''
  })
  const [pwError, setPwError] = useState('')
  const [pwSaved, setPwSaved] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { initialize() }, [])

  async function initialize() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    setUser(user)
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single()
    if (data) {
      setProfile(data)
      setForm({
        first_name: data.first_name || '',
        last_name: data.last_name || '',
        restaurant_name: data.restaurant_name || '',
        phone: data.phone || ''
      })
    }
  }

  async function saveProfile() {
    if (!form.first_name.trim()) return
    setLoading(true)
    const { error } = await supabase.from('profiles').upsert({
      id: user.id,
      ...form,
      updated_at: new Date().toISOString()
    })
    if (!error) {
      setSaved(true)
      setTimeout(() => setSaved(false), 3000)
    }
    setLoading(false)
  }

  async function changePassword() {
    setPwError('')
    if (!passwords.new || passwords.new.length < 6) { setPwError('Password must be at least 6 characters'); return }
    if (passwords.new !== passwords.confirm) { setPwError('Passwords do not match'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password: passwords.new })
    if (error) { setPwError(error.message) }
    else {
      setPwSaved(true)
      setPasswords({ current: '', new: '', confirm: '' })
      setTimeout(() => setPwSaved(false), 3000)
    }
    setLoading(false)
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!user) return null

  const initials = `${form.first_name?.[0] || ''}${form.last_name?.[0] || ''}`.toUpperCase() || user.email?.[0].toUpperCase()

  const inputStyle = {
    width: '100%', padding: '11px 14px', border: '1.5px solid #e5e7eb',
    borderRadius: '12px', fontSize: '14px', outline: 'none',
    background: 'white', boxSizing: 'border-box', color: '#111',
    transition: 'border-color 0.15s', fontFamily: 'inherit'
  }

  const tabs = [
    { id: 'profile', label: 'Profile', icon: '👤' },
    { id: 'security', label: 'Security', icon: '🔒' },
    { id: 'account', label: 'Account', icon: '⚙️' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0EDE8' }}>
      <Navbar user={user} />

      <main style={{ flex: 1, overflowX: 'hidden', padding: isMobile ? '16px' : '28px', paddingBottom: isMobile ? '100px' : '40px' }}>

        {/* Header */}
        <div style={{ marginBottom: '28px' }}>
          <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 800, color: '#111', fontFamily: clash, marginBottom: '4px' }}>Settings</h1>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>Manage your profile and account</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap: '20px', alignItems: 'start' }}>

          {/* Left — Profile card + tabs */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>

            {/* Avatar card */}
            <div style={{ background: 'linear-gradient(135deg, #071f12, #0C3D22)', borderRadius: '20px', padding: '28px 20px', textAlign: 'center', boxShadow: '0 8px 28px rgba(12,61,34,0.2)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '120px', height: '120px', background: 'rgba(37,211,102,0.06)', borderRadius: '50%' }}></div>
              <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #1A6B3C, #25D366)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '26px', margin: '0 auto 14px', fontFamily: clash, boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}>
                {initials}
              </div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '16px', fontFamily: clash, marginBottom: '4px' }}>
                {form.first_name ? `${form.first_name} ${form.last_name}` : 'Your Name'}
              </p>
              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '12px', marginBottom: '8px' }}>{user.email}</p>
              {form.restaurant_name && (
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '5px', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '20px', padding: '4px 12px' }}>
                  <span style={{ fontSize: '11px' }}>🇷🇼</span>
                  <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 600 }}>{form.restaurant_name}</span>
                </div>
              )}
            </div>

            {/* Tabs */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '8px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              {tabs.map(tab => (
                <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '10px', padding: '11px 14px', borderRadius: '12px', border: 'none', background: activeTab === tab.id ? '#f0fdf4' : 'transparent', color: activeTab === tab.id ? '#1A6B3C' : '#6b7280', fontWeight: activeTab === tab.id ? 700 : 500, fontSize: '14px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: clash, textAlign: 'left', marginBottom: '2px' }}
                  onMouseEnter={e => { if (activeTab !== tab.id) e.currentTarget.style.background = '#f9fafb' }}
                  onMouseLeave={e => { if (activeTab !== tab.id) e.currentTarget.style.background = 'transparent' }}
                >
                  <span style={{ fontSize: '16px' }}>{tab.icon}</span>
                  {tab.label}
                  {activeTab === tab.id && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', background: '#1A6B3C', borderRadius: '50%' }}></div>}
                </button>
              ))}
            </div>

            {/* Free plan badge */}
            <div style={{ background: 'white', borderRadius: '16px', padding: '16px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '10px' }}>
                <p style={{ fontWeight: 700, fontSize: '13px', color: '#111', fontFamily: clash }}>Current Plan</p>
                <span style={{ background: '#f0fdf4', color: '#1A6B3C', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '20px', border: '1px solid #bbf7d0' }}>Free</span>
              </div>
              <p style={{ fontSize: '12px', color: '#9ca3af', lineHeight: 1.5, marginBottom: '12px' }}>2 suppliers · 5 products · 10 orders/month</p>
              <div style={{ background: 'linear-gradient(135deg, #0C3D22, #1A6B3C)', borderRadius: '12px', padding: '12px 14px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={e => e.currentTarget.style.opacity = '1'}
              >
                <p style={{ color: 'white', fontWeight: 700, fontSize: '13px', fontFamily: clash, marginBottom: '2px' }}>Upgrade to Pro</p>
                <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '11px' }}>RWF 8,000/month · Unlimited everything</p>
              </div>
            </div>
          </div>

          {/* Right — Tab content */}
          <div>

            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <div style={{ background: 'white', borderRadius: '20px', padding: isMobile ? '20px' : '28px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '17px', color: '#111', fontFamily: clash, marginBottom: '4px' }}>Profile Information</h2>
                  <p style={{ color: '#9ca3af', fontSize: '13px' }}>Update your name and restaurant details</p>
                </div>

                {saved && (
                  <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: '#16a34a', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ✅ Profile saved successfully!
                  </div>
                )}

                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px' }}>
                  {[
                    { label: 'First Name', key: 'first_name', placeholder: 'Chris', required: true },
                    { label: 'Last Name', key: 'last_name', placeholder: 'Mugabo' },
                    { label: 'Restaurant Name', key: 'restaurant_name', placeholder: 'Flower Restaurant' },
                    { label: 'Phone Number', key: 'phone', placeholder: '+250 7XX XXX XXX' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        {field.label} {field.required && <span style={{ color: '#dc2626' }}>*</span>}
                      </label>
                      <input
                        value={form[field.key]}
                        onChange={e => setForm(p => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#1A6B3C'}
                        onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  ))}
                </div>

                {/* Email (read only) */}
                <div style={{ marginTop: '16px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>Email Address</label>
                  <div style={{ ...inputStyle, background: '#f9fafb', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span>✉️</span>
                    <span>{user.email}</span>
                    <span style={{ marginLeft: 'auto', fontSize: '11px', background: '#f3f4f6', padding: '2px 8px', borderRadius: '20px', color: '#6b7280' }}>Cannot change</span>
                  </div>
                </div>

                <div style={{ marginTop: '24px', display: 'flex', gap: '10px' }}>
                  <button onClick={saveProfile} disabled={loading} style={{ background: '#0C3D22', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, boxShadow: '0 4px 12px rgba(12,61,34,0.2)', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    {loading ? 'Saving...' : '✓ Save Profile'}
                  </button>
                </div>
              </div>
            )}

            {/* Security Tab */}
            {activeTab === 'security' && (
              <div style={{ background: 'white', borderRadius: '20px', padding: isMobile ? '20px' : '28px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ marginBottom: '24px' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '17px', color: '#111', fontFamily: clash, marginBottom: '4px' }}>Change Password</h2>
                  <p style={{ color: '#9ca3af', fontSize: '13px' }}>Update your account password</p>
                </div>

                {pwSaved && (
                  <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: '#16a34a', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ✅ Password updated successfully!
                  </div>
                )}

                {pwError && (
                  <div style={{ background: '#fef2f2', border: '1.5px solid #fecaca', borderRadius: '12px', padding: '12px 16px', marginBottom: '20px', color: '#dc2626', fontWeight: 600, fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    ⚠️ {pwError}
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '400px' }}>
                  {[
                    { label: 'New Password', key: 'new', placeholder: 'At least 6 characters' },
                    { label: 'Confirm New Password', key: 'confirm', placeholder: 'Repeat new password' },
                  ].map(field => (
                    <div key={field.key}>
                      <label style={{ display: 'block', fontSize: '12px', fontWeight: 600, color: '#374151', marginBottom: '6px', textTransform: 'uppercase', letterSpacing: '0.4px' }}>
                        {field.label}
                      </label>
                      <input
                        type="password"
                        value={passwords[field.key]}
                        onChange={e => setPasswords(p => ({ ...p, [field.key]: e.target.value }))}
                        placeholder={field.placeholder}
                        style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#1A6B3C'}
                        onBlur={e => e.target.style.borderColor = '#e5e7eb'}
                      />
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: '24px' }}>
                  <button onClick={changePassword} disabled={loading} style={{ background: '#0C3D22', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, boxShadow: '0 4px 12px rgba(12,61,34,0.2)' }}>
                    {loading ? 'Updating...' : '🔒 Update Password'}
                  </button>
                </div>

                {/* Session info */}
                <div style={{ marginTop: '32px', padding: '16px', background: '#f9fafb', borderRadius: '14px', border: '1px solid #f0f0f0' }}>
                  <p style={{ fontWeight: 600, fontSize: '13px', color: '#111', marginBottom: '8px', fontFamily: clash }}>Current Session</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>Signed in as <strong style={{ color: '#374151' }}>{user.email}</strong></p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '4px' }}>
                    Last sign in: {user.last_sign_in_at ? new Date(user.last_sign_in_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : 'Unknown'}
                  </p>
                </div>
              </div>
            )}

            {/* Account Tab */}
            {activeTab === 'account' && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>

                {/* App preferences */}
                <div style={{ background: 'white', borderRadius: '20px', padding: isMobile ? '20px' : '28px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '17px', color: '#111', fontFamily: clash, marginBottom: '4px' }}>App Info</h2>
                  <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>About your Stoqly account</p>

                  {[
                    { label: 'Account Created', value: user.created_at ? new Date(user.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
                    { label: 'User ID', value: user.id?.slice(0, 8) + '...' },
                    { label: 'Plan', value: 'Free Plan' },
                    { label: 'App Version', value: 'Stoqly v1.0 · Built for Kigali 🇷🇼' },
                  ].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 0', borderBottom: i < 3 ? '1px solid #f5f3f0' : 'none' }}>
                      <p style={{ fontSize: '13px', color: '#6b7280' }}>{item.label}</p>
                      <p style={{ fontSize: '13px', fontWeight: 600, color: '#111', fontFamily: clash }}>{item.value}</p>
                    </div>
                  ))}
                </div>

                {/* Danger zone */}
                <div style={{ background: 'white', borderRadius: '20px', padding: isMobile ? '20px' : '28px', border: '1.5px solid #fecaca', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '17px', color: '#dc2626', fontFamily: clash, marginBottom: '4px' }}>Danger Zone</h2>
                  <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>Irreversible actions — be careful</p>

                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', background: '#fef2f2', borderRadius: '14px', border: '1px solid #fecaca', marginBottom: '10px' }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '14px', color: '#111', fontFamily: clash }}>Sign Out</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Sign out of your current session</p>
                    </div>
                    <button onClick={handleLogout} style={{ background: 'white', color: '#dc2626', border: '1.5px solid #fecaca', borderRadius: '10px', padding: '9px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fef2f2' }}
                      onMouseLeave={e => { e.currentTarget.style.background = 'white' }}
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}