'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { supabase } from '../lib/supabase'
import { useState } from 'react'

export default function Navbar({ user, onCollapse }) {
  const pathname = usePathname()
  const [hoveredLink, setHoveredLink] = useState(null)
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  const links = [
    { href: '/dashboard', label: 'Dashboard', icon: '⊞' },
    { href: '/suppliers', label: 'Suppliers & Products', icon: '◈' },
    { href: '/orders', label: 'Orders', icon: '◎' },
  ]

  const width = collapsed ? '64px' : '224px'

  return (
    <aside style={{
      width,
      minHeight: '100vh',
      background: 'linear-gradient(180deg, #0a3520 0%, #0C3D22 100%)',
      display: 'flex',
      flexDirection: 'column',
      flexShrink: 0,
      borderRight: '1px solid rgba(255,255,255,0.05)',
      transition: 'width 0.25s ease',
      overflow: 'hidden'
    }}>

      {/* Logo + collapse button */}
      <div style={{ padding: collapsed ? '24px 0' : '28px 24px 24px', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'space-between' }}>
        {!collapsed && (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '6px' }}>
              <div style={{ width: '32px', height: '32px', background: '#1A6B3C', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', fontWeight: 800, color: 'white', flexShrink: 0 }}>S</div>
              <span style={{ color: 'white', fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px', whiteSpace: 'nowrap' }}>Stoqly</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></div>
              <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 500 }}>Kigali, Rwanda</span>
            </div>
          </div>
        )}

        {collapsed && (
          <div style={{ width: '32px', height: '32px', background: '#1A6B3C', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, color: 'white', fontSize: '16px' }}>S</div>
        )}
      </div>

      {/* Collapse toggle button */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        style={{
          margin: collapsed ? '0 auto 16px' : '0 16px 16px',
          width: collapsed ? '36px' : '100%',
          padding: '6px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.1)',
          borderRadius: '8px',
          color: 'rgba(255,255,255,0.5)',
          fontSize: '12px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '6px',
          transition: 'all 0.15s',
          whiteSpace: 'nowrap'
        }}
        onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
        onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
      >
        <span style={{ display: 'inline-block', transform: collapsed ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s ease', fontSize: '14px' }}>←</span>
        {!collapsed && <span style={{ fontSize: '11px' }}>Collapse</span>}
      </button>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: `0 ${collapsed ? '8px' : '16px'} 16px` }}></div>

      {/* Nav Links */}
      <nav style={{ flex: 1, padding: `0 ${collapsed ? '8px' : '10px'}` }}>
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
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: collapsed ? 'center' : 'flex-start',
                  gap: '10px',
                  padding: collapsed ? '11px' : '11px 14px',
                  borderRadius: '10px',
                  marginBottom: '4px',
                  cursor: 'pointer',
                  background: active ? '#1A6B3C' : hovered ? 'rgba(26,107,60,0.35)' : 'transparent',
                  color: active ? 'white' : hovered ? 'rgba(255,255,255,0.9)' : 'rgba(255,255,255,0.45)',
                  transition: 'all 0.18s ease',
                  fontWeight: active ? 600 : 400,
                  fontSize: '13.5px',
                  transform: hovered && !active && !collapsed ? 'translateX(4px)' : 'translateX(0)',
                  borderLeft: !collapsed && active ? '3px solid #4ade80' : '3px solid transparent',
                }}>
                <span style={{ fontSize: '16px', flexShrink: 0 }}>{link.icon}</span>
                {!collapsed && <span style={{ whiteSpace: 'nowrap' }}>{link.label}</span>}
                {!collapsed && active && (
                  <div style={{ marginLeft: 'auto', width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%' }}></div>
                )}
              </div>
            </Link>
          )
        })}
      </nav>

      {/* Divider */}
      <div style={{ height: '1px', background: 'rgba(255,255,255,0.06)', margin: `0 ${collapsed ? '8px' : '16px'} 16px` }}></div>

      {/* User */}
      <div style={{ padding: collapsed ? '0 8px 24px' : '0 16px 24px' }}>
        {!collapsed && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
            <div style={{ width: '32px', height: '32px', background: '#1A6B3C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, flexShrink: 0 }}>
              {user?.email?.[0].toUpperCase()}
            </div>
            <div style={{ flex: 1, overflow: 'hidden' }}>
              <p style={{ color: 'white', fontSize: '12px', fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.email}</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '1px' }}>Pro Plan</p>
            </div>
          </div>
        )}

        {collapsed && (
          <div style={{ width: '32px', height: '32px', background: '#1A6B3C', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, margin: '0 auto 12px' }}>
            {user?.email?.[0].toUpperCase()}
          </div>
        )}

        <button
          onClick={handleLogout}
          title={collapsed ? 'Sign out' : ''}
          style={{
            width: '100%',
            padding: '8px',
            background: 'rgba(255,255,255,0.05)',
            border: '1px solid rgba(255,255,255,0.08)',
            borderRadius: '8px',
            color: 'rgba(255,255,255,0.4)',
            fontSize: collapsed ? '14px' : '12px',
            cursor: 'pointer',
            transition: 'all 0.15s',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}
          onMouseEnter={e => { e.currentTarget.style.background = 'rgba(239,68,68,0.15)'; e.currentTarget.style.color = '#f87171' }}
          onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.05)'; e.currentTarget.style.color = 'rgba(255,255,255,0.4)' }}
        >
          {collapsed ? '→' : 'Sign out'}
        </button>
      </div>

    </aside>
  )
}