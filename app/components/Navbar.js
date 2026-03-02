'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { useState, useEffect } from 'react'

const clash = "'Clash Display', sans-serif"

export default function Navbar({ user }) {
  const pathname = usePathname()
  const [hoveredLink, setHoveredLink] = useState(null)
  const [collapsed, setCollapsed] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '⊞', mobileIcon: '🏠' },
    { href: '/suppliers', label: 'Suppliers', icon: '◈', mobileIcon: '🏪' },
    { href: '/orders', label: 'Orders', icon: '◎', mobileIcon: '📲' },
    { href: '/prices', label: 'Prices', icon: '📈', mobileIcon: '📈' },
  ]

  if (isMobile) {
    return (
      <nav style={{
        position: 'fixed', bottom: 0, left: 0, right: 0,
        background: 'linear-gradient(180deg, #0a3520, #0C3D22)',
        borderTop: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-around',
        padding: '10px 0 24px', zIndex: 100,
        boxShadow: '0 -8px 32px rgba(0,0,0,0.2)'
      }}>
        {links.map(link => {
          const active = pathname === link.href
          return (
            <Link key={link.href} href={link.href}>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '6px 16px', cursor: 'pointer', position: 'relative' }}>
                {active && (
                  <div style={{ position: 'absolute', top: '-10px', left: '50%', transform: 'translateX(-50%)', width: '32px', height: '3px', background: '#25D366', borderRadius: '0 0 4px 4px' }}></div>
                )}
                <span style={{ fontSize: '20px' }}>{link.mobileIcon}</span>
                <span style={{ fontSize: '10px', fontWeight: active ? 700 : 400, color: active ? '#4ade80' : 'rgba(255,255,255,0.35)', fontFamily: clash }}>
                  {link.label}
                </span>
              </div>
            </Link>
          )
        })}
        <div onClick={handleLogout} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', padding: '6px 16px', cursor: 'pointer' }}>
          <span style={{ fontSize: '20px' }}>🚪</span>
          <span style={{ fontSize: '10px', color: 'rgba(255,255,255,0.35)', fontFamily: clash }}>Out</span>
        </div>
      </nav>
    )
  }

  const width = collapsed ? '68px' : '230px'

  return (
    <aside style={{
      width, minHeight: '100vh',
      background: 'linear-gradient(180deg, #071f12 0%, #0C3D22 40%, #0a3520 100%)',
      display: 'flex', flexDirection: 'column', flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.06)',
      transition: 'width 0.25s ease', overflow: 'hidden',
      boxShadow: '4px 0 24px rgba(0,0,0,0.15)'
    }}>

      {/* Logo */}
      <div style={{ padding: collapsed ? '28px 0 20px' : '28px 20px 20px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: '12px' }}>
        <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #1A6B3C, #25D366)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 800, color: 'white', flexShrink: 0, boxShadow: '0 4px 12px rgba(37,211,102,0.3)', fontFamily: clash }}>S</div>
        {!collapsed && (
          <div>
            <p style={{ color: 'white', fontWeight: 800, fontSize: '19px', letterSpacing: '-0.5px', fontFamily: clash, lineHeight: 1 }}>Stoqly</p>
            <p style={{ color: '#4ade80', fontSize: '10px', fontWeight: 500, marginTop: '3px', display: 'flex', alignItems: 'center', gap: '4px' }}>
              <span style={{ width: '5px', height: '5px', background: '#4ade80', borderRadius: '50%', display: 'inline-block' }}></span>
              Kigali, Rwanda 🇷🇼
            </p>
          </div>
        )}
      </div>

      {/* Collapse button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{ margin: collapsed ? '0 auto 12px' : '0 14px 12px', width: collapsed ? '40px' : '100%', padding: '7px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '10px', color: 'rgba(255,255,255,0.4)', fontSize: '11px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', transition: 'all 0.15s' }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
      >
        <span style={{ display: 'inline-block', transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s', fontSize: '13px' }}>←</span>
        {!collapsed && <span>Collapse</span>}
      </button>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: `0 ${collapsed ? '10px' : '14px'} 14px` }}></div>

      {/* Nav links */}
      <nav style={{ flex: 1, padding: '0 10px' }}>
        {links.map(link => {
          const active = pathname === link.href
          const hovered = hoveredLink === link.href
          return (
            <Link key={link.href} href={link.href}>
              <div
                onMouseEnter={() => setHoveredLink(link.href)}
                onMouseLeave={() => setHoveredLink(null)}
                title={collapsed ? link.label : ''}
                style={{
                  display: 'flex', alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '10px', padding: collapsed ? '12px' : '11px 14px',
                  borderRadius: '12px', marginBottom: '4px', cursor: 'pointer',
                  background: active ? 'linear-gradient(135deg, #1A6B3C, #166534)' : hovered ? 'rgba(26,107,60,0.3)' : 'transparent',
                  color: active ? 'white' : hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.4)',
                  transition: 'all 0.18s ease',
                  fontWeight: active ? 600 : 400, fontSize: '13.5px',
                  transform: hovered && !active && !collapsed ? 'translateX(4px)' : 'translateX(0)',
                  borderLeft: !collapsed && active ? '3px solid #4ade80' : '3px solid transparent',
                  boxShadow: active ? '0 4px 12px rgba(26,107,60,0.3)' : 'none'
                }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{link.icon}</span>
                {!collapsed && <span style={{ whiteSpace: 'nowrap', fontFamily: clash }}>{link.label}</span>}
                {!collapsed && active && <div style={{ marginLeft: 'auto', width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></div>}
              </div>
            </Link>
          )
        })}
      </nav>

      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: `0 ${collapsed ? '10px' : '14px'} 14px` }}></div>

      {/* User */}
      <div style={{ padding: collapsed ? '0 10px 28px' : '0 14px 28px' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px', padding: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.06)' }}>
            <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #1A6B3C, #25D366)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700, flexShrink: 0, fontFamily: clash }}>
              {user?.email?.[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ color: 'white', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
              <p style={{ color: '#25D366', fontSize: '10px', marginTop: '1px', fontWeight: 500 }}>● Free Plan</p>
            </div>
          </div>
        )}

        {collapsed && (
          <div style={{ width: '34px', height: '34px', background: 'linear-gradient(135deg, #1A6B3C, #25D366)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px', fontWeight: 700, margin: '0 auto 10px', fontFamily: clash }}>
            {user?.email?.[0].toUpperCase()}
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign out' : ''}
          style={{ width: '100%', padding: '9px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', color: 'rgba(255,255,255,0.35)', fontSize: collapsed ? '14px' : '12px', cursor: 'pointer', transition: 'all 0.15s', fontWeight: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px', fontFamily: clash }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.12)'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.borderColor = 'rgba(239,68,68,0.2)' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.color = 'rgba(255,255,255,0.35)'; e.currentTarget.style.borderColor = 'rgba(255,255,255,0.07)' }}
        >
          {collapsed ? '→' : 'Sign out'}
        </button>
      </div>
    </aside>
  )
}