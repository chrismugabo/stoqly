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
  const [alerts, setAlerts] = useState([])
  const [dismissedKeys, setDismissedKeys] = useState([])
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

    const [profileRes, supplierRes, productRes, ordersRes, recentRes, dismissedRes] = await Promise.all([
      supabase.from('profiles').select('*').eq('id', user.id).single(),
      supabase.from('suppliers').select('*', { count: 'exact', head: true }),
      supabase.from('products').select('*', { count: 'exact', head: true }),
      supabase.from('orders').select('total_amount').gte('created_at', (() => { const d = new Date(); d.setDate(1); d.setHours(0,0,0,0); return d.toISOString() })()),
      supabase.from('orders').select('id, total_amount, status, created_at, suppliers(name)').order('created_at', { ascending: false }).limit(5),
      supabase.from('dismissed_alerts').select('alert_key').eq('user_id', user.id)
    ])

    setProfile(profileRes.data)
    setSupplierCount(supplierRes.count || 0)
    setProductCount(productRes.count || 0)
    setOrdersCount(ordersRes.data?.length || 0)
    setMonthlySpend(ordersRes.data?.reduce((s, o) => s + Number(o.total_amount), 0) || 0)
    setRecentOrders(recentRes.data || [])
    setDismissedKeys(dismissedRes.data?.map(d => d.alert_key) || [])

    await detectAlerts()
    setLoading(false)
  }

  const detectAlerts = async () => {
    const { data: products } = await supabase
      .from('products').select('id, name, current_price, alert_threshold, suppliers(name)')
    if (!products || products.length === 0) return
    const detectedAlerts = []
    for (const product of products) {
      const { data: history } = await supabase
        .from('price_history').select('price, recorded_at')
        .eq('product_id', product.id).order('recorded_at', { ascending: false }).limit(2)
      if (!history || history.length < 2) continue
      const latestPrice = Number(history[0].price)
      const previousPrice = Number(history[1].price)
      if (previousPrice === 0) continue
      const changePercent = ((latestPrice - previousPrice) / previousPrice) * 100
      if (changePercent >= Number(product.alert_threshold)) {
        detectedAlerts.push({
          key: `${product.id}_${latestPrice}_${previousPrice}`,
          productName: product.name,
          supplierName: product.suppliers?.name,
          previousPrice, latestPrice,
          changePercent: Math.round(changePercent),
          threshold: product.alert_threshold
        })
      }
    }
    setAlerts(detectedAlerts)
  }

  async function dismissAlert(alertKey) {
    setDismissedKeys(prev => [...prev, alertKey])
    await supabase.from('dismissed_alerts').upsert(
      { user_id: user.id, alert_key: alertKey },
      { onConflict: 'user_id,alert_key' }
    )
  }

  const visibleAlerts = alerts.filter(a => !dismissedKeys.includes(a.key))

  const getGreeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Good morning'
    if (h < 17) return 'Good afternoon'
    return 'Good evening'
  }

  const getTimeOfDay = () => {
    const h = new Date().getHours()
    if (h < 12) return '🌅'
    if (h < 17) return '☀️'
    return '🌙'
  }

  if (!user) return null

  const stats = [
    { label: 'Suppliers', value: supplierCount, emoji: '🏪', bg: 'linear-gradient(135deg, #1A6B3C, #166534)', href: '/suppliers', sub: 'active' },
    { label: 'Products', value: productCount, emoji: '📦', bg: 'linear-gradient(135deg, #2563eb, #1d4ed8)', href: '/suppliers', sub: 'tracked' },
    { label: 'Orders', value: ordersCount, emoji: '📋', bg: 'linear-gradient(135deg, #f97316, #ea580c)', href: '/orders', sub: 'this month' },
    { label: 'Spend', value: `${monthlySpend >= 1000 ? Math.round(monthlySpend/1000) + 'K' : monthlySpend}`, emoji: '💰', bg: 'linear-gradient(135deg, #7c3aed, #6d28d9)', href: '/spending', sub: 'RWF this month' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0EDE8' }}>
      <Navbar user={user} />

      <main style={{ flex: 1, overflowX: 'hidden', padding: isMobile ? '16px' : '28px', paddingBottom: isMobile ? '100px' : '40px' }}>

        {/* Hero — redesigned with right-side stats preview */}
        <div style={{ background: 'linear-gradient(135deg, #071f12 0%, #0C3D22 60%, #1a5c30 100%)', borderRadius: '24px', padding: isMobile ? '28px 20px' : '40px 40px', marginBottom: '20px', position: 'relative', overflow: 'hidden', boxShadow: '0 12px 40px rgba(12,61,34,0.3)' }}>
          {/* Decorative circles */}
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '260px', height: '260px', background: 'rgba(37,211,102,0.06)', borderRadius: '50%', border: '1px solid rgba(37,211,102,0.08)' }}></div>
          <div style={{ position: 'absolute', bottom: '-60px', right: '20%', width: '160px', height: '160px', background: 'rgba(37,211,102,0.04)', borderRadius: '50%' }}></div>
          <div style={{ position: 'absolute', top: '30%', right: '5%', width: '80px', height: '80px', background: 'rgba(37,211,102,0.05)', borderRadius: '50%' }}></div>

          <div style={{ position: 'relative', zIndex: 1, display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr auto', gap: '32px', alignItems: 'center' }}>
            {/* Left — greeting */}
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '20px', padding: '5px 14px', marginBottom: '16px' }}>
                <div style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 6px rgba(74,222,128,0.6)' }}></div>
                <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 600, fontFamily: clash }}>{getGreeting()} {getTimeOfDay()}</span>
              </div>

              <h1 style={{ color: 'white', fontSize: isMobile ? '26px' : '36px', fontWeight: 800, marginBottom: '10px', fontFamily: clash, lineHeight: 1.1 }}>
                {profile?.first_name ? `Welcome back,\n${profile.first_name}!` : 'Welcome back!'}
              </h1>

              <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', marginBottom: '24px', lineHeight: 1.6, maxWidth: '340px' }}>
                {profile?.restaurant_name
                  ? `Managing suppliers for ${profile.restaurant_name} 🇷🇼`
                  : 'Track prices, manage suppliers and order via WhatsApp.'}
              </p>

              <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
                <Link href="/orders">
                  <button style={{ background: '#25D366', color: 'white', fontWeight: 700, padding: '12px 22px', borderRadius: '14px', border: 'none', cursor: 'pointer', fontSize: '14px', display: 'inline-flex', alignItems: 'center', gap: '8px', fontFamily: clash, boxShadow: '0 4px 20px rgba(37,211,102,0.4)', transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
                    onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                  >
                    📲 New WhatsApp Order
                  </button>
                </Link>
                <Link href="/suppliers">
                  <button style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.8)', fontWeight: 600, padding: '12px 22px', borderRadius: '14px', border: '1px solid rgba(255,255,255,0.12)', cursor: 'pointer', fontSize: '14px', fontFamily: clash, transition: 'all 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.14)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.08)'}
                  >
                    + Add Supplier
                  </button>
                </Link>
              </div>
            </div>

            {/* Right — mini stats (desktop only) */}
            {!isMobile && (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', minWidth: '240px' }}>
                {stats.map((s, i) => (
                  <Link href={s.href} key={i}>
                    <div style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', padding: '14px 16px', cursor: 'pointer', transition: 'all 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
                    >
                      <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '6px' }}>{s.label}</p>
                      <p style={{ color: 'white', fontSize: '22px', fontWeight: 800, fontFamily: clash, lineHeight: 1 }}>{loading ? '—' : s.value}</p>
                      <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '10px', marginTop: '3px' }}>{s.sub}</p>
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Price Alerts */}
        {visibleAlerts.length > 0 && (
          <div style={{ marginBottom: '20px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
              <span style={{ fontSize: '16px' }}>🔔</span>
              <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>Price Alerts</h2>
              <div style={{ background: '#dc2626', color: 'white', fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', fontFamily: clash }}>{visibleAlerts.length}</div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              {visibleAlerts.map((alert) => (
                <div key={alert.key} style={{ background: 'white', borderRadius: '16px', padding: '14px 18px', border: '1.5px solid #fecaca', boxShadow: '0 2px 12px rgba(220,38,38,0.07)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1, minWidth: 0 }}>
                    <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #fef2f2, #fee2e2)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '1px solid #fecaca', flexShrink: 0 }}>⚠️</div>
                    <div style={{ minWidth: 0 }}>
                      <p style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash }}>{alert.productName}</p>
                      <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                        {alert.supplierName} · RWF {alert.previousPrice.toLocaleString()} → RWF {alert.latestPrice.toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexShrink: 0 }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ background: '#fef2f2', color: '#dc2626', fontSize: '14px', fontWeight: 800, padding: '5px 10px', borderRadius: '10px', fontFamily: clash }}>
                        +{alert.changePercent}%
                      </div>
                      <p style={{ fontSize: '10px', color: '#9ca3af', marginTop: '3px' }}>above {alert.threshold}% threshold</p>
                    </div>
                    <button onClick={() => dismissAlert(alert.key)}
                      style={{ width: '28px', height: '28px', borderRadius: '50%', background: '#f3f4f6', border: 'none', cursor: 'pointer', fontSize: '14px', color: '#9ca3af', display: 'flex', alignItems: 'center', justifyContent: 'center', transition: 'all 0.15s' }}
                      onMouseEnter={e => { e.currentTarget.style.background = '#fee2e2'; e.currentTarget.style.color = '#dc2626' }}
                      onMouseLeave={e => { e.currentTarget.style.background = '#f3f4f6'; e.currentTarget.style.color = '#9ca3af' }}
                    >×</button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stats row — mobile only (desktop shows in hero) */}
        {isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '16px' }}>
            {stats.map(stat => (
              <Link href={stat.href} key={stat.label}>
                <div style={{ background: stat.bg, borderRadius: '16px', padding: '16px', cursor: 'pointer', transition: 'transform 0.15s', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', position: 'relative', overflow: 'hidden', height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <div style={{ position: 'absolute', bottom: '-8px', right: '-2px', fontSize: '40px', opacity: 0.1 }}>{stat.emoji}</div>
                  <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{stat.label}</p>
                  <p style={{ color: 'white', fontSize: '24px', fontWeight: 800, fontFamily: clash, lineHeight: 1 }}>{loading ? '—' : stat.value}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {/* Quick Actions — redesigned */}
        <div style={{ marginBottom: '20px' }}>
          <h2 style={{ fontWeight: 700, fontSize: '14px', color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px', fontFamily: clash }}>Quick Actions</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)', gap: '10px' }}>
            {[
              { href: '/orders', icon: '📲', label: 'New Order', sub: 'Send via WhatsApp', bg: 'linear-gradient(135deg, #0C3D22, #1A6B3C)', color: 'white', iconBg: 'rgba(255,255,255,0.15)' },
              { href: '/suppliers', icon: '🏪', label: 'Add Supplier', sub: 'Manage your network', bg: 'white', color: '#111', iconBg: '#f0fdf4', border: '1px solid #e5e7eb' },
              { href: '/prices', icon: '📈', label: 'Price History', sub: 'Track changes', bg: 'white', color: '#111', iconBg: '#eff6ff', border: '1px solid #e5e7eb' },
              { href: '/spending', icon: '💰', label: 'Spending', sub: 'Monthly reports', bg: 'white', color: '#111', iconBg: '#faf5ff', border: '1px solid #e5e7eb' },
            ].map((a, i) => (
              <Link href={a.href} key={i}>
                <div style={{ background: a.bg, borderRadius: '18px', padding: '18px 16px', border: a.border || 'none', cursor: 'pointer', transition: 'all 0.15s', boxShadow: a.bg === 'white' ? '0 2px 8px rgba(0,0,0,0.05)' : '0 6px 20px rgba(12,61,34,0.25)', height: isMobile ? '90px' : '100px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = a.bg === 'white' ? '0 8px 20px rgba(0,0,0,0.1)' : '0 10px 28px rgba(12,61,34,0.35)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = a.bg === 'white' ? '0 2px 8px rgba(0,0,0,0.05)' : '0 6px 20px rgba(12,61,34,0.25)' }}
                >
                  <div style={{ width: '34px', height: '34px', background: a.iconBg, borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px' }}>{a.icon}</div>
                  <div>
                    <p style={{ fontWeight: 700, fontSize: '13px', color: a.color, fontFamily: clash }}>{a.label}</p>
                    {!isMobile && <p style={{ fontSize: '11px', color: a.bg === 'white' ? '#9ca3af' : 'rgba(255,255,255,0.5)', marginTop: '2px' }}>{a.sub}</p>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '18px 20px', borderBottom: '1px solid #f5f3f0' }}>
            <div>
              <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>Recent Orders</h2>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Your latest supplier orders</p>
            </div>
            <Link href="/orders">
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '7px 12px', cursor: 'pointer', transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#dcfce7'}
                onMouseLeave={e => e.currentTarget.style.background = '#f0fdf4'}
              >
                <span style={{ fontSize: '12px', color: '#1A6B3C', fontWeight: 700, fontFamily: clash }}>View All</span>
                <span style={{ fontSize: '12px', color: '#1A6B3C' }}>→</span>
              </div>
            </Link>
          </div>

          {loading && (
            <div style={{ padding: '40px', textAlign: 'center' }}>
              <div style={{ display: 'inline-block', width: '24px', height: '24px', border: '3px solid #f3f4f6', borderTop: '3px solid #1A6B3C', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }}></div>
            </div>
          )}

          {!loading && recentOrders.length === 0 && (
            <div style={{ padding: '56px 24px', textAlign: 'center' }}>
              <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', border: '1px solid #bbf7d0' }}>📋</div>
              <p style={{ fontWeight: 700, fontSize: '16px', color: '#111', marginBottom: '6px', fontFamily: clash }}>No orders yet</p>
              <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px', maxWidth: '260px', margin: '0 auto 20px', lineHeight: 1.6 }}>
                Place your first order to start tracking your spending
              </p>
              <Link href="/orders">
                <button style={{ background: '#25D366', color: 'white', fontWeight: 700, padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', fontFamily: clash, boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}>
                  📲 Place First Order
                </button>
              </Link>
            </div>
          )}

          {recentOrders.map((order, i) => (
            <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < recentOrders.length - 1 ? '1px solid #f9f7f5' : 'none', transition: 'background 0.15s', cursor: 'pointer' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '1px solid #bbf7d0', flexShrink: 0 }}>🏪</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: '#111', fontFamily: clash }}>{order.suppliers?.name}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span style={{ fontSize: '11px', padding: '3px 10px', borderRadius: '20px', fontWeight: 600, background: order.status === 'sent' ? '#dcfce7' : '#f3f4f6', color: order.status === 'sent' ? '#16a34a' : '#6b7280' }}>
                  {order.status}
                </span>
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash }}>RWF {Number(order.total_amount).toLocaleString()}</p>
              </div>
            </div>
          ))}
        </div>

      </main>
    </div>
  )
}