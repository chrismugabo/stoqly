 'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Navbar from '@/app/components/Navbar'

const clash = "'Clash Display', sans-serif"

export default function PricesPage() {
  const [user, setUser] = useState(null)
  const [products, setProducts] = useState([])
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [history, setHistory] = useState([])
  const [loading, setLoading] = useState(true)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { getUser() }, [])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    if (data?.user) { setUser(data.user); fetchProducts() }
    else window.location.href = '/login'
  }

  async function fetchProducts() {
    const { data } = await supabase
      .from('products')
      .select('*, suppliers(name)')
      .order('name')
    if (data) {
      setProducts(data)
      if (data.length > 0) await selectProduct(data[0])
    }
    setLoading(false)
  }

  async function selectProduct(product) {
    setSelectedProduct(product)
    const { data } = await supabase
      .from('price_history')
      .select('price, recorded_at')
      .eq('product_id', product.id)
      .order('recorded_at', { ascending: true })
    setHistory(data || [])
  }

  if (!user) return null

  const prices = history.map(h => Number(h.price))
  const minPrice = prices.length ? Math.min(...prices) : 0
  const maxPrice = prices.length ? Math.max(...prices) : 0
  const latestPrice = prices.length ? prices[prices.length - 1] : 0
  const firstPrice = prices.length ? prices[0] : 0
  const totalChange = firstPrice ? Math.round(((latestPrice - firstPrice) / firstPrice) * 100) : 0
  const chartMax = maxPrice * 1.2 || 100

  const barColors = prices.map((p, i) => {
    if (i === 0) return '#9ca3af'
    return p > prices[i - 1] ? '#ef4444' : p < prices[i - 1] ? '#22c55e' : '#9ca3af'
  })

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0EDE8' }}>
      <Navbar user={user} />

      <main style={{ flex: 1, overflowX: 'hidden', padding: isMobile ? '16px' : '24px', paddingBottom: isMobile ? '100px' : '40px' }}>

        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 700, color: '#111', fontFamily: clash, marginBottom: '4px' }}>Price History</h1>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>Track how your supplier prices change over time</p>
        </div>

        {loading && <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af' }}>Loading...</div>}

        {!loading && products.length === 0 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '64px 24px', textAlign: 'center', border: '1px solid #ede9e4' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>📈</p>
            <p style={{ fontWeight: 700, fontSize: '18px', color: '#111', marginBottom: '8px', fontFamily: clash }}>No price history yet</p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Place orders to start tracking prices automatically</p>
          </div>
        )}

        {!loading && products.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '260px 1fr', gap: '20px' }}>

            {/* Product List */}
            <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', height: 'fit-content' }}>
              <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f3f0' }}>
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash }}>Products</p>
                <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{products.length} tracked</p>
              </div>
              {products.map(product => {
                const isSelected = selectedProduct?.id === product.id
                return (
                  <div
                    key={product.id}
                    onClick={() => selectProduct(product)}
                    style={{ padding: '14px 20px', cursor: 'pointer', borderBottom: '1px solid #fafaf9', background: isSelected ? '#f0fdf4' : 'white', borderLeft: isSelected ? '3px solid #1A6B3C' : '3px solid transparent', transition: 'all 0.15s' }}
                    onMouseEnter={e => !isSelected && (e.currentTarget.style.background = '#fafaf9')}
                    onMouseLeave={e => !isSelected && (e.currentTarget.style.background = 'white')}
                  >
                    <p style={{ fontWeight: isSelected ? 700 : 600, fontSize: '13px', color: '#111', fontFamily: clash }}>{product.name}</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{product.suppliers?.name} · per {product.unit}</p>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: isSelected ? '#1A6B3C' : '#374151', marginTop: '4px', fontFamily: clash }}>
                      RWF {Number(product.current_price).toLocaleString()}
                    </p>
                  </div>
                )
              })}
            </div>

            {/* Right Panel */}
            <div>
              {selectedProduct && (
                <>
                  {/* Stats */}
                  <div style={{ background: 'white', borderRadius: '20px', padding: '24px', marginBottom: '16px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
                      <div>
                        <h2 style={{ fontWeight: 700, fontSize: '20px', color: '#111', fontFamily: clash, marginBottom: '4px' }}>{selectedProduct.name}</h2>
                        <p style={{ fontSize: '13px', color: '#9ca3af' }}>{selectedProduct.suppliers?.name} · per {selectedProduct.unit}</p>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontSize: '28px', fontWeight: 800, color: '#111', fontFamily: clash }}>{latestPrice ? `RWF ${latestPrice.toLocaleString()}` : `RWF ${Number(selectedProduct.current_price).toLocaleString()}`}</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af' }}>current price</p>
                      </div>
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
                      {[
                        { label: 'Lowest Price', value: minPrice ? `RWF ${minPrice.toLocaleString()}` : '—', color: '#16a34a', bg: '#f0fdf4', border: '#bbf7d0' },
                        { label: 'Highest Price', value: maxPrice ? `RWF ${maxPrice.toLocaleString()}` : '—', color: '#dc2626', bg: '#fef2f2', border: '#fecaca' },
                        { label: 'Total Change', value: prices.length >= 2 ? `${totalChange > 0 ? '+' : ''}${totalChange}%` : '—', color: totalChange > 0 ? '#dc2626' : totalChange < 0 ? '#16a34a' : '#6b7280', bg: totalChange > 0 ? '#fef2f2' : totalChange < 0 ? '#f0fdf4' : '#f9fafb', border: totalChange > 0 ? '#fecaca' : totalChange < 0 ? '#bbf7d0' : '#e5e7eb' },
                      ].map((s, i) => (
                        <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '14px', padding: '14px' }}>
                          <p style={{ fontSize: '11px', color: '#9ca3af', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '6px' }}>{s.label}</p>
                          <p style={{ fontSize: isMobile ? '16px' : '18px', fontWeight: 800, color: s.color, fontFamily: clash }}>{s.value}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Chart */}
                  <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', marginBottom: '16px' }}>
                    <p style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash, marginBottom: '4px' }}>Price Over Time</p>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '24px' }}>Red = increase · Green = decrease · recorded on each order</p>

                    {history.length === 0 && (
                      <div style={{ padding: '40px', textAlign: 'center' }}>
                        <p style={{ fontSize: '32px', marginBottom: '10px' }}>📦</p>
                        <p style={{ color: '#9ca3af', fontSize: '13px' }}>No orders placed for this product yet</p>
                      </div>
                    )}

                    {history.length === 1 && (
                      <div style={{ padding: '20px', textAlign: 'center', background: '#f9fafb', borderRadius: '12px' }}>
                        <p style={{ color: '#6b7280', fontSize: '13px' }}>Only 1 order recorded — place another order to see price changes</p>
                        <p style={{ fontWeight: 700, fontSize: '18px', color: '#111', fontFamily: clash, marginTop: '8px' }}>RWF {prices[0].toLocaleString()}</p>
                      </div>
                    )}

                    {history.length >= 2 && (
                      <>
                        <div style={{ display: 'flex', alignItems: 'flex-end', gap: '6px', height: '180px', marginBottom: '8px', padding: '0 4px', overflowX: 'auto' }}>
                          {history.map((entry, i) => {
                            const price = Number(entry.price)
                            const barHeight = Math.max((price / chartMax) * 160, 8)
                            const color = barColors[i]
                            const isLatest = i === history.length - 1
                            return (
                              <div key={i} style={{ minWidth: '32px', flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', position: 'relative' }}>
                                <div style={{ position: 'absolute', bottom: `${barHeight + 6}px`, background: '#111', color: 'white', fontSize: '9px', fontWeight: 700, padding: '2px 5px', borderRadius: '5px', whiteSpace: 'nowrap', fontFamily: clash, opacity: isLatest ? 1 : 0, transition: 'opacity 0.15s', pointerEvents: 'none', zIndex: 10 }}>
                                  RWF {price.toLocaleString()}
                                </div>
                                <div
                                  style={{ width: '100%', height: `${barHeight}px`, background: color, borderRadius: '6px 6px 0 0', transition: 'all 0.2s', cursor: 'pointer', border: isLatest ? '2px solid rgba(0,0,0,0.2)' : 'none', opacity: isLatest ? 1 : 0.7 }}
                                  onMouseEnter={e => {
                                    e.currentTarget.style.opacity = '1'
                                    e.currentTarget.style.transform = 'scaleY(1.05)'
                                    const label = e.currentTarget.parentElement.querySelector('div')
                                    if (label) label.style.opacity = '1'
                                  }}
                                  onMouseLeave={e => {
                                    e.currentTarget.style.opacity = isLatest ? '1' : '0.7'
                                    e.currentTarget.style.transform = 'scaleY(1)'
                                    if (!isLatest) {
                                      const label = e.currentTarget.parentElement.querySelector('div')
                                      if (label) label.style.opacity = '0'
                                    }
                                  }}
                                ></div>
                              </div>
                            )
                          })}
                        </div>

                        <div style={{ display: 'flex', gap: '6px', padding: '0 4px' }}>
                          {history.map((entry, i) => (
                            <div key={i} style={{ minWidth: '32px', flex: 1, textAlign: 'center' }}>
                              <p style={{ fontSize: '9px', color: '#9ca3af' }}>
                                {new Date(entry.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                              </p>
                            </div>
                          ))}
                        </div>

                        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', padding: '10px 14px', background: '#f9fafb', borderRadius: '10px', flexWrap: 'wrap' }}>
                          {[
                            { color: '#ef4444', label: 'Price increase' },
                            { color: '#22c55e', label: 'Price decrease' },
                            { color: '#9ca3af', label: 'No change / first record' },
                          ].map((l, i) => (
                            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                              <div style={{ width: '10px', height: '10px', background: l.color, borderRadius: '3px' }}></div>
                              <span style={{ fontSize: '11px', color: '#6b7280' }}>{l.label}</span>
                            </div>
                          ))}
                        </div>
                      </>
                    )}
                  </div>

                  {/* History Log */}
                  {history.length > 0 && (
                    <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                      <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f3f0' }}>
                        <p style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash }}>Full Price Log</p>
                        <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{history.length} records</p>
                      </div>
                      {[...history].reverse().map((entry, i) => {
                        const price = Number(entry.price)
                        const originalIndex = history.length - 1 - i
                        const prevPrice = originalIndex > 0 ? Number(history[originalIndex - 1].price) : null
                        const change = prevPrice ? Math.round(((price - prevPrice) / prevPrice) * 100) : null
                        return (
                          <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < history.length - 1 ? '1px solid #fafaf9' : 'none', transition: 'background 0.15s' }}
                            onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
                            onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: change === null ? '#9ca3af' : change > 0 ? '#ef4444' : change < 0 ? '#22c55e' : '#9ca3af', flexShrink: 0 }}></div>
                              <div>
                                <p style={{ fontSize: '13px', color: '#374151', fontWeight: 500 }}>
                                  {new Date(entry.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                                </p>
                                <p style={{ fontSize: '11px', color: '#9ca3af' }}>
                                  {new Date(entry.recorded_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                              {change !== null && (
                                <span style={{ fontSize: '11px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', background: change > 0 ? '#fef2f2' : change < 0 ? '#f0fdf4' : '#f3f4f6', color: change > 0 ? '#dc2626' : change < 0 ? '#16a34a' : '#6b7280' }}>
                                  {change > 0 ? '+' : ''}{change}%
                                </span>
                              )}
                              <p style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash }}>RWF {price.toLocaleString()}</p>
                            </div>
                          </div>
                        )
                      })}
                    </div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}