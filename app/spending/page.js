'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Navbar from '@/app/components/Navbar'

const clash = "'Clash Display', sans-serif"
const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function SpendingPage() {
  const [user, setUser] = useState(null)
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth())
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear())

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { getUser() }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    if (data?.user) { setUser(data.user); fetchData() }
    else window.location.href = '/login'
  }

  async function fetchData() {
    const { data: ordersData } = await supabase
      .from('orders')
      .select('*, suppliers(name)')
      .order('created_at', { ascending: true })
    if (ordersData) setOrders(ordersData)
    setLoading(false)
  }

  if (!user) return null

  const monthOrders = orders.filter(o => {
    const d = new Date(o.created_at)
    return d.getMonth() === selectedMonth && d.getFullYear() === selectedYear
  })
  const monthTotal = monthOrders.reduce((s, o) => s + Number(o.total_amount), 0)

  const prevMonth = selectedMonth === 0 ? 11 : selectedMonth - 1
  const prevYear = selectedMonth === 0 ? selectedYear - 1 : selectedYear
  const prevMonthTotal = orders
    .filter(o => {
      const d = new Date(o.created_at)
      return d.getMonth() === prevMonth && d.getFullYear() === prevYear
    })
    .reduce((s, o) => s + Number(o.total_amount), 0)
  const monthChange = prevMonthTotal > 0 ? Math.round(((monthTotal - prevMonthTotal) / prevMonthTotal) * 100) : null

  const supplierSpend = {}
  monthOrders.forEach(o => {
    const name = o.suppliers?.name || 'Unknown'
    supplierSpend[name] = (supplierSpend[name] || 0) + Number(o.total_amount)
  })
  const supplierSpendSorted = Object.entries(supplierSpend).sort((a, b) => b[1] - a[1])

  const last6 = []
  for (let i = 5; i >= 0; i--) {
    let m = selectedMonth - i
    let y = selectedYear
    if (m < 0) { m += 12; y -= 1 }
    const total = orders
      .filter(o => {
        const d = new Date(o.created_at)
        return d.getMonth() === m && d.getFullYear() === y
      })
      .reduce((s, o) => s + Number(o.total_amount), 0)
    last6.push({ month: MONTHS[m], total, isCurrent: m === selectedMonth && y === selectedYear })
  }
  const chartMax = Math.max(...last6.map(m => m.total), 1) * 1.2

  const allTimeTotal = orders.reduce((s, o) => s + Number(o.total_amount), 0)
  const avgOrderValue = orders.length > 0 ? Math.round(allTimeTotal / orders.length) : 0

  const allSupplierSpend = {}
  orders.forEach(o => {
    const name = o.suppliers?.name || 'Unknown'
    allSupplierSpend[name] = (allSupplierSpend[name] || 0) + Number(o.total_amount)
  })
  const topSupplier = Object.entries(allSupplierSpend).sort((a, b) => b[1] - a[1])[0]
  const supplierColors = ['#1A6B3C','#2563eb','#f97316','#7c3aed','#ec4899','#0891b2','#16a34a']

  const prevMonth_btn = () => {
    if (selectedMonth === 0) { setSelectedMonth(11); setSelectedYear(y => y - 1) }
    else setSelectedMonth(m => m - 1)
  }
  const nextMonth_btn = () => {
    if (selectedMonth === 11) { setSelectedMonth(0); setSelectedYear(y => y + 1) }
    else setSelectedMonth(m => m + 1)
  }

  const StatCard = ({ label, value, emoji, bg, sub }) => (
    <div style={{
      background: bg, borderRadius: '16px',
      padding: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
      position: 'relative', overflow: 'hidden',
      height: '96px',
      display: 'flex', flexDirection: 'column', justifyContent: 'space-between'
    }}>
      <div style={{ position: 'absolute', bottom: '-8px', right: '-2px', fontSize: '44px', opacity: 0.1 }}>{emoji}</div>
      <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.8px' }}>{label}</p>
      <div>
        <p style={{ color: 'white', fontSize: isMobile ? '15px' : '18px', fontWeight: 800, fontFamily: clash, lineHeight: 1.1, marginBottom: '3px', wordBreak: 'break-word' }}>{value}</p>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '10px' }}>{sub}</p>
      </div>
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0EDE8' }}>
      <Navbar user={user} />

      <main style={{ flex: 1, overflowX: 'hidden', padding: isMobile ? '16px' : '24px', paddingBottom: isMobile ? '100px' : '40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 700, color: '#111', fontFamily: clash, marginBottom: '4px' }}>Spending Reports</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>See exactly where your money is going</p>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button onClick={prevMonth_btn} style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>‹</button>
            <div style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '12px', padding: '7px 18px', fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash, minWidth: '130px', textAlign: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>
              {MONTHS[selectedMonth]} {selectedYear}
            </div>
            <button onClick={nextMonth_btn} style={{ width: '34px', height: '34px', borderRadius: '10px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '18px', display: 'flex', alignItems: 'center', justifyContent: 'center', boxShadow: '0 1px 4px rgba(0,0,0,0.06)' }}>›</button>
          </div>
        </div>

        {loading && <div style={{ padding: '60px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>}

        {!loading && (
          <>
            {/* Stat Cards — fixed 96px height */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2,1fr)' : 'repeat(4,1fr)', gap: '12px', marginBottom: '20px' }}>
              <StatCard label="This Month" value={`RWF ${monthTotal.toLocaleString()}`} emoji="📅" bg="linear-gradient(135deg, #1A6B3C, #166534)" sub={monthChange !== null ? `${monthChange > 0 ? '+' : ''}${monthChange}% vs last month` : 'No data last month'} />
              <StatCard label="Orders" value={monthOrders.length} emoji="📋" bg="linear-gradient(135deg, #2563eb, #1d4ed8)" sub={`${orders.length} total all time`} />
              <StatCard label="Avg Order" value={`RWF ${avgOrderValue.toLocaleString()}`} emoji="📊" bg="linear-gradient(135deg, #f97316, #ea580c)" sub="All time average" />
              <StatCard label="Top Supplier" value={topSupplier ? topSupplier[0] : '—'} emoji="🏪" bg="linear-gradient(135deg, #7c3aed, #6d28d9)" sub={topSupplier ? `RWF ${topSupplier[1].toLocaleString()} total` : 'No orders yet'} />
            </div>

            {/* 6-Month Bar Chart */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '20px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash, marginBottom: '4px' }}>Monthly Spending</h2>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '28px' }}>Last 6 months · current month highlighted in green</p>

              {allTimeTotal === 0 ? (
                <div style={{ padding: '48px', textAlign: 'center' }}>
                  <p style={{ fontSize: '40px', marginBottom: '12px' }}>📊</p>
                  <p style={{ fontWeight: 600, fontSize: '15px', color: '#111', marginBottom: '6px', fontFamily: clash }}>No spending data yet</p>
                  <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px' }}>Place orders to start seeing your spending trends</p>
                  <a href="/orders">
                    <button style={{ background: '#25D366', color: 'white', fontWeight: 700, padding: '10px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: clash }}>
                      📲 Place First Order
                    </button>
                  </a>
                </div>
              ) : (
                <>
                  <div style={{ display: 'flex', alignItems: 'flex-end', gap: isMobile ? '8px' : '20px', height: '160px', marginBottom: '10px' }}>
                    {last6.map((m, i) => {
                      const barHeight = m.total > 0 ? Math.max((m.total / chartMax) * 140, 6) : 4
                      return (
                        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
                          {!isMobile && m.total > 0 && (
                            <p style={{ fontSize: '10px', color: m.isCurrent ? '#1A6B3C' : '#9ca3af', fontWeight: m.isCurrent ? 700 : 400, textAlign: 'center' }}>
                              {m.total >= 1000 ? `${Math.round(m.total / 1000)}K` : m.total}
                            </p>
                          )}
                          <div style={{ width: '100%', position: 'relative' }}>
                            {m.isCurrent && m.total > 0 && (
                              <div style={{ position: 'absolute', top: `-${barHeight + 8}px`, left: '50%', transform: 'translateX(-50%)', width: '8px', height: '8px', background: '#25D366', borderRadius: '50%', boxShadow: '0 0 8px rgba(37,211,102,0.5)' }}></div>
                            )}
                            <div style={{ width: '100%', height: `${barHeight}px`, background: m.isCurrent ? 'linear-gradient(180deg, #25D366, #1A6B3C)' : '#e9ecef', borderRadius: '8px 8px 0 0', transition: 'all 0.4s ease', boxShadow: m.isCurrent ? '0 4px 12px rgba(37,211,102,0.3)' : 'none' }}></div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                  <div style={{ display: 'flex', gap: isMobile ? '8px' : '20px' }}>
                    {last6.map((m, i) => (
                      <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                        <p style={{ fontSize: '11px', color: m.isCurrent ? '#1A6B3C' : '#9ca3af', fontWeight: m.isCurrent ? 700 : 400 }}>{m.month}</p>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>

            {/* Supplier breakdown + Order log */}
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '16px', marginBottom: '20px' }}>

              <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash, marginBottom: '4px' }}>By Supplier</h2>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>{MONTHS[selectedMonth]} {selectedYear}</p>

                {supplierSpendSorted.length === 0 ? (
                  <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                    <p style={{ fontSize: '36px', marginBottom: '10px' }}>🏪</p>
                    <p style={{ fontWeight: 600, fontSize: '14px', color: '#111', marginBottom: '6px', fontFamily: clash }}>No orders this month</p>
                    <p style={{ color: '#9ca3af', fontSize: '13px' }}>Use the arrows above to browse other months</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                    {supplierSpendSorted.map(([name, amount], i) => {
                      const pct = monthTotal > 0 ? Math.round((amount / monthTotal) * 100) : 0
                      return (
                        <div key={name}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '7px' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: supplierColors[i % supplierColors.length], flexShrink: 0 }}></div>
                              <p style={{ fontSize: '13px', fontWeight: 600, color: '#111', fontFamily: clash }}>{name}</p>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <p style={{ fontSize: '13px', fontWeight: 700, color: '#111', fontFamily: clash }}>RWF {amount.toLocaleString()}</p>
                              <p style={{ fontSize: '10px', color: '#9ca3af' }}>{pct}% of total</p>
                            </div>
                          </div>
                          <div style={{ height: '7px', background: '#f3f4f6', borderRadius: '999px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${pct}%`, background: supplierColors[i % supplierColors.length], borderRadius: '999px', transition: 'width 0.5s ease' }}></div>
                          </div>
                        </div>
                      )
                    })}
                    <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: '14px', display: 'flex', justifyContent: 'space-between' }}>
                      <p style={{ fontSize: '14px', fontWeight: 700, color: '#111', fontFamily: clash }}>Total</p>
                      <p style={{ fontSize: '15px', fontWeight: 800, color: '#1A6B3C', fontFamily: clash }}>RWF {monthTotal.toLocaleString()}</p>
                    </div>
                  </div>
                )}
              </div>

              <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid #f5f3f0' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash, marginBottom: '4px' }}>Order Log</h2>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>{MONTHS[selectedMonth]} {selectedYear} · {monthOrders.length} orders</p>
                </div>

                {monthOrders.length === 0 ? (
                  <div style={{ padding: '48px 24px', textAlign: 'center' }}>
                    <p style={{ fontSize: '36px', marginBottom: '10px' }}>📋</p>
                    <p style={{ fontWeight: 600, fontSize: '14px', color: '#111', marginBottom: '6px', fontFamily: clash }}>No orders this month</p>
                    <p style={{ color: '#9ca3af', fontSize: '13px' }}>Orders will appear here once placed</p>
                  </div>
                ) : (
                  <div style={{ maxHeight: '340px', overflowY: 'auto' }}>
                    {[...monthOrders].reverse().map((order, i) => (
                      <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < monthOrders.length - 1 ? '1px solid #fafaf9' : 'none', transition: 'background 0.15s' }}
                        onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
                        onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                          <div style={{ width: '36px', height: '36px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '15px', border: '1px solid #bbf7d0', flexShrink: 0 }}>🏪</div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '13px', color: '#111', fontFamily: clash }}>{order.suppliers?.name}</p>
                            <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                              {new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                            </p>
                          </div>
                        </div>
                        <div style={{ textAlign: 'right' }}>
                          <p style={{ fontWeight: 700, fontSize: '13px', color: '#111', fontFamily: clash }}>RWF {Number(order.total_amount).toLocaleString()}</p>
                          <span style={{ fontSize: '10px', padding: '1px 6px', borderRadius: '20px', fontWeight: 600, background: order.status === 'sent' ? '#dcfce7' : '#f3f4f6', color: order.status === 'sent' ? '#16a34a' : '#6b7280' }}>
                            {order.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* All-time by supplier */}
            {Object.keys(allSupplierSpend).length > 0 && (
              <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash, marginBottom: '4px' }}>All-Time by Supplier</h2>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '20px' }}>Total spent with each supplier since you started</p>
                <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(auto-fill, minmax(200px, 1fr))', gap: '12px' }}>
                  {Object.entries(allSupplierSpend).sort((a, b) => b[1] - a[1]).map(([name, amount], i) => (
                    <div key={name} style={{ background: '#f9fafb', borderRadius: '14px', padding: '16px', border: '1px solid #f0f0f0', display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ width: '42px', height: '42px', borderRadius: '12px', background: supplierColors[i % supplierColors.length], display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '18px', fontFamily: clash, flexShrink: 0 }}>
                        {name[0].toUpperCase()}
                      </div>
                      <div>
                        <p style={{ fontWeight: 700, fontSize: '13px', color: '#111', fontFamily: clash }}>{name}</p>
                        <p style={{ fontSize: '12px', fontWeight: 700, color: supplierColors[i % supplierColors.length], marginTop: '2px', fontFamily: clash }}>RWF {amount.toLocaleString()}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}