 'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [supplierCount, setSupplierCount] = useState(0)
  const [productCount, setProductCount] = useState(0)
  const [ordersCount, setOrdersCount] = useState(0)
  const [monthlySpend, setMonthlySpend] = useState(0)
  const [recentOrders, setRecentOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => { initialize() }, [])

  const initialize = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    setUser(user)
    await fetchMetrics()
    setLoading(false)
  }

  const fetchMetrics = async () => {
    const { count: supplierTotal } = await supabase
      .from('suppliers').select('*', { count: 'exact', head: true })
    setSupplierCount(supplierTotal || 0)

    const { count: productTotal } = await supabase
      .from('products').select('*', { count: 'exact', head: true })
    setProductCount(productTotal || 0)

    const firstDayOfMonth = new Date()
    firstDayOfMonth.setDate(1)
    firstDayOfMonth.setHours(0, 0, 0, 0)

    const { data: ordersThisMonth } = await supabase
      .from('orders').select('total_amount')
      .gte('created_at', firstDayOfMonth.toISOString())

    setOrdersCount(ordersThisMonth?.length || 0)
    setMonthlySpend(ordersThisMonth?.reduce((sum, o) => sum + Number(o.total_amount), 0) || 0)

    const { data: recent } = await supabase
      .from('orders')
      .select('id, total_amount, status, created_at, suppliers(name)')
      .order('created_at', { ascending: false })
      .limit(5)

    setRecentOrders(recent || [])
  }

  if (!user) return null

  const stats = [
    { label: 'Suppliers', value: supplierCount, icon: '🏪', color: 'bg-[#1A6B3C]', href: '/suppliers' },
    { label: 'Products', value: productCount, icon: '📦', color: 'bg-blue-600', href: '/suppliers' },
    { label: 'Orders This Month', value: ordersCount, icon: '📋', color: 'bg-orange-500', href: '/orders' },
    { label: 'Monthly Spend (RWF)', value: monthlySpend.toLocaleString(), icon: '💰', color: 'bg-purple-600', href: '/orders' },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }} className="bg-[#F7F4EF]">
      <Navbar user={user} />

      <main style={{ flex: 1, overflowX: 'hidden', padding: '32px' }}>

        {/* Hero */}
        <div style={{ background: '#0C3D22', borderRadius: '24px', padding: '40px', marginBottom: '32px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: '-80px', right: '-80px', width: '250px', height: '250px', background: '#1A6B3C', borderRadius: '50%', opacity: 0.3 }}></div>
          <div style={{ position: 'absolute', bottom: '-60px', left: '35%', width: '150px', height: '150px', background: '#1A6B3C', borderRadius: '50%', opacity: 0.2 }}></div>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <p style={{ color: '#6ee7b7', fontSize: '14px', marginBottom: '8px' }}>Welcome back 👋</p>
            <h1 style={{ color: 'white', fontSize: '36px', fontWeight: 800, marginBottom: '12px' }}>
              {user.email.split('@')[0]}'s Dashboard
            </h1>
            <p style={{ color: '#a7f3d0', fontSize: '14px', marginBottom: '24px', maxWidth: '400px' }}>
              Manage your suppliers, track prices, and send orders via WhatsApp in one tap.
            </p>
            <Link href="/orders">
              <button style={{ background: '#25D366', color: 'white', fontWeight: 700, padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                📲 New WhatsApp Order
              </button>
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px', marginBottom: '32px' }}>
          {stats.map((stat) => (
            <Link href={stat.href} key={stat.label}>
              <div className={`${stat.color}`} style={{ borderRadius: '16px', padding: '20px', cursor: 'pointer', transition: 'opacity 0.2s' }}>
                <div style={{ fontSize: '24px', marginBottom: '12px' }}>{stat.icon}</div>
                <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '4px' }}>{stat.label}</p>
                <p style={{ color: 'white', fontSize: '32px', fontWeight: 800 }}>{loading ? '—' : stat.value}</p>
              </div>
            </Link>
          ))}
        </div>

        {/* Quick Actions */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '32px' }}>
          <Link href="/suppliers">
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f0f0f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🏪</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>Manage Suppliers</p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>Add or edit suppliers</p>
              </div>
            </div>
          </Link>
          <Link href="/suppliers">
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f0f0f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: '#eff6ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📦</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>Manage Products</p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>Track prices per supplier</p>
              </div>
            </div>
          </Link>
          <Link href="/orders">
            <div style={{ background: 'white', borderRadius: '16px', padding: '20px', border: '1px solid #f0f0f0', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '16px' }}>
              <div style={{ width: '40px', height: '40px', background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📲</div>
              <div>
                <p style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>New Order</p>
                <p style={{ fontSize: '12px', color: '#9ca3af' }}>Send via WhatsApp</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Recent Orders */}
        <div style={{ background: 'white', borderRadius: '16px', overflow: 'hidden', border: '1px solid #f0f0f0' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px', borderBottom: '1px solid #f9f9f9' }}>
            <h2 style={{ fontWeight: 700, fontSize: '16px', color: '#111' }}>Recent Orders</h2>
            <Link href="/orders">
              <span style={{ fontSize: '13px', color: '#1A6B3C', fontWeight: 600 }}>View All →</span>
            </Link>
          </div>

          {loading && (
            <div style={{ padding: '48px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>Loading...</div>
          )}

          {!loading && recentOrders.length === 0 && (
            <div style={{ padding: '64px 24px', textAlign: 'center' }}>
              <p style={{ fontSize: '48px', marginBottom: '16px' }}>📋</p>
              <p style={{ fontWeight: 700, fontSize: '18px', color: '#111', marginBottom: '8px' }}>No orders yet</p>
              <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px' }}>Create your first order to start tracking</p>
              <Link href="/orders">
                <button style={{ background: '#25D366', color: 'white', fontWeight: 700, padding: '12px 24px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>
                  📲 Create First Order
                </button>
              </Link>
            </div>
          )}

          {recentOrders.map(order => (
            <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 24px', borderBottom: '1px solid #fafafa' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                <div style={{ width: '40px', height: '40px', background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🏪</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>{order.suppliers?.name}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>
                    {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                  </p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#111' }}>RWF {Number(order.total_amount).toLocaleString()}</p>
                <span style={{
                  fontSize: '11px',
                  padding: '2px 8px',
                  borderRadius: '20px',
                  fontWeight: 500,
                  background: order.status === 'sent' ? '#dcfce7' : '#f3f4f6',
                  color: order.status === 'sent' ? '#16a34a' : '#6b7280'
                }}>
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