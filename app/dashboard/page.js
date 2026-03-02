 'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Link from 'next/link'

const clash = "'Clash Display', sans-serif"

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [profile, setProfile] = useState(null)
  const [supplierCount, setSupplierCount] = useState(0)
  const [productCount, setProductCount] = useState(0)
  const [ordersCount, setOrdersCount] = useState(0)
  const [monthlySpend, setMonthlySpend] = useState(0)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { initialize() }, [])

  const initialize = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    setUser(user)

    const { data: profileData } = await supabase
      .from('profiles').select('*').eq('id', user.id).single()
    setProfile(profileData)

    const { count: supplierTotal } = await supabase
      .from('suppliers').select('*', { count: 'exact', head: true })
    setSupplierCount(supplierTotal || 0)

    const { count: productTotal } = await supabase
      .from('products').select('*', { count: 'exact', head: true })
    setProductCount(productTotal || 0)

    const firstDay = new Date()
    firstDay.setDate(1); firstDay.setHours(0, 0, 0, 0)

    const { data: ordersThisMonth } = await supabase
      .from('orders').select('total_amount').gte('created_at', firstDay.toISOString())
    setOrdersCount(ordersThisMonth?.length || 0)
    setMonthlySpend(ordersThisMonth?.reduce((s, o) => s + Number(o.total_amount), 0) || 0)

    const { data: recent } = await supabase
      .from('orders').select('id, total_amount, status, created_at, suppliers(name)')
      .order('created_at', { ascending: false }).limit(5)
    setRecentOrders(recent || [])
    setLoading(false)
  }

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  if (!user) return null

  const stats = [
    { label: 'Suppliers', value: supplierCount, emoji: '🏪', bg: 'linear-gradient(135deg, #1A6B3C, #166534)', href: '/suppliers' },
    { label: 'Products', value: productCount, emoji: '📦', bg: 'linear-gradient(135deg, #2563eb, #1d4ed8)', href: '/suppliers' },
    { label: 'Orders', value: ordersCount, emoji: '📋', bg: 'linear-gradient(135deg, #f97316, #ea580c)', href: '/orders' },
    { label: 'Spend (RWF)', value: monthlySpend.toLocaleString(), emoji: '💰', bg: 'linear-gradient(135deg, #7c3aed, #6d28d9)', href: '/orders' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0EDE8' }}>
      <Navbar user={user} />

      <main style={{
        flex: 1,
        overflowX: 'hidden',
        padding: isMobile ? '16px' : '28px',
        paddingBottom: isMobile ? '100px' : '40px'
      }}>

        {/* Hero */}
        <div style={{
          background: 'linear-gradient(135deg, #071f12 0%, #0C3D22 50%, #1A6B3C 100%)',
          borderRadius: '20px',
          padding: isMobile ? '24px 20px' : '36px 32px',
          marginBottom: '16px',
          position: 'relative',
          overflow: 'hidden',
          boxShadow: '0 8px 32px rgba(12,61,34,0.25)'
        }}>
          <div style={{ position: 'absolute', top: '-60px', right: '-60px', width: '200px', height: '200px', background: 'rgba(37,211,102,0.07)', borderRadius: '50%', border: '1px solid rgba(37,211,102,0.1)' }}></div>
          <div style={{ position: 'absolute', bottom: '-40px', right: '15%', width: '120px', height: '120px', background: 'rgba(37,211,102,0.05)', borderRadius: '50%' }}></div>

          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.25)', borderRadius: '20px', padding: '4px 12px', marginBottom: '14px' }}>
              <div style={{ width: '5px', height: '5px', background: '#4ade80', borderRadius: '50%' }}></div>
              <span style={{ color: '#4ade80', fontSize: '11px', fontWeight: 600 }}>{getGreeting()} 👋</span>
            </div>

            <h1 style={{ color: 'white', fontSize: isMobile ? '24px' : '32px', fontWeight: 700, marginBottom: '8px', fontFamily: clash, lineHeight: 1.1 }}>
              {profile?.first_name ? `Welcome back, ${profile.first_name}!` : 'Welcome back!'}
            </h1>

            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '20px', maxWidth: '360px', lineHeight: 1.6 }}>
              {profile?.restaurant_name
                ? `Managing suppliers for ${profile.restaurant_name} 🇷🇼`
                : 'Manage your suppliers, track prices, and send orders via WhatsApp.'}
            </p>

            <Link href="/orders">
              <button style={{ background: '#25D366', color: 'white', fontWeight: 700, padding: '11px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: clash, boxShadow: '0 4px 16px rgba(37,211,102,0.35)' }}>
                📲 New WhatsApp Order
              </button>
            </Link>
          </div>
        </div>

        {/* Stat Cards — 2x2 on mobile, 4 across on desktop */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: '12px',
          marginBottom: '16px'
        }}>
          {stats.map(stat => (
            <Link href={stat.href} key={stat.label}>
              <div style={{
                background: stat.bg,
                borderRadius: '16px',
                padding: isMobile ? '16px 14px' : '18px 16px',
                cursor: 'pointer',
                transition: 'transform 0.15s, box-shadow 0.15s',
                boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                position: 'relative',
                overflow: 'hidden',
                height: isMobile ? '100px' : '110px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-3px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.2)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)' }}
              >
                <div style={{ position: 'absolute', bottom: '-12px', right: '-6px', fontSize: isMobile ? '44px' : '52px', opacity: 0.12 }}>{stat.emoji}</div>
                <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{stat.label}</p>
                <p style={{ color: 'white', fontSize: isMobile ? '24px' : '28px', fontWeight: 800, fontFamily: clash, lineHeight: 1 }}>{loading ? '—' : stat.value}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(3, 1fr)' : 'repeat(3, 1fr)',
          gap: '10px',
          marginBottom: '16px'
        }}>
          {[
            { href: '/suppliers', icon: '🏪', label: 'Suppliers', sub: 'Add or edit', color: '#f0fdf4', border: '#bbf7d0' },
            { href: '/suppliers', icon: '📦', label: 'Products', sub: 'Manage stock', color: '#eff6ff', border: '#bfdbfe' },
            { href: '/orders', icon: '📲', label: 'New Order', sub: 'Via WhatsApp', color: '#f0fdf4', border: '#bbf7d0' },
          ].map((a, i) => (
            <Link href={a.href} key={i}>
              <div style={{
                background: 'white',
                borderRadius: '16px',
                padding: isMobile ? '14px 8px' : '16px 12px',
                border: `1px solid ${a.border}`,
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.15s',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                height: isMobile ? '90px' : '100px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px'
              }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.08)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)' }}
              >
                <div style={{ width: '36px', height: '36px', background: a.color, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>{a.icon}</div>
                <p style={{ fontWeight: 700, fontSize: isMobile ? '11px' : '13px', color: '#111', fontFamily: clash }}>{a.label}</p>
                {!isMobile && <p style={{ fontSize: '11px', color: '#9ca3af' }}>{a.sub}</p>}
              </div>
            </Link>
          ))}
        </div>

        {/* Recent Orders */}
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '1px solid #f5f3f0' }}>
            <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>Recent Orders</h2>
            <Link href="/orders">
              <span style={{ fontSize: '13px', color: '#1A6B3C', fontWeight: 600, cursor: 'pointer' }}>View All →</span>
            </Link>
          </div>

          {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>Loading...</div>}

          {!loading && recentOrders.length === 0 && (
            <div style={{ padding: '48px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: '40px', marginBottom: '12px' }}>📋</p>
              <p style={{ fontWeight: 700, fontSize: '16px', color: '#111', marginBottom: '6px', fontFamily: clash }}>No orders yet</p>
              <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>Create your first order to start tracking</p>
              <Link href="/orders">
                <button style={{ background: '#25D366', color: 'white', fontWeight: 700, padding: '11px 22px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: clash }}>
                  📲 Create First Order
                </button>
              </Link>
            </div>
          )}

          {recentOrders.map((order, i) => (
            <div key={order.id} style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '14px 20px',
              borderBottom: i < recentOrders.length - 1 ? '1px solid #f9f7f5' : 'none',
              transition: 'background 0.15s'
            }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', border: '1px solid #bbf7d0', flexShrink: 0 }}>🏪</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: '#111', fontFamily: clash }}>{order.suppliers?.name}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: '13px', color: '#111', fontFamily: clash }}>RWF {Number(order.total_amount).toLocaleString()}</p>
                <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '20px', fontWeight: 600, background: order.status === 'sent' ? '#dcfce7' : '#f3f4f6', color: order.status === 'sent' ? '#16a34a' : '#6b7280' }}>
                  {order.status}
                </span>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}