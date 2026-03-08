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
  const [historyLoading, setHistoryLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [showMobileDetail, setShowMobileDetail] = useState(false)

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
      if (data.length > 0) selectProduct(data[0])
    }
    setLoading(false)
  }

  async function selectProduct(product) {
    setSelectedProduct(product)
    setHistoryLoading(true)
    if (isMobile) setShowMobileDetail(true)
    const { data } = await supabase
      .from('price_history')
      .select('price, recorded_at')
      .eq('product_id', product.id)
      .order('recorded_at', { ascending: true })
    setHistory(data || [])
    setHistoryLoading(false)
  }

  if (!user) return null

  // Calculations
  const prices = history.map(h => Number(h.price))
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 0
  const latestPrice = prices.length > 0 ? prices[prices.length - 1] : 0
  const firstPrice = prices.length > 0 ? prices[0] : 0
  const totalChange = firstPrice > 0 ? ((latestPrice - firstPrice) / firstPrice) * 100 : 0
  const chartMax = maxPrice * 1.25 || 1

  const categoryIcons = { Meat: '🥩', Vegetables: '🥦', Oil: '🛢️', Dairy: '🥛', Beverages: '🍺', Spices: '🧂', Other: '📦' }

  const DetailPanel = () => (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '16px', minWidth: 0 }}>

      {/* Product header */}
      <div style={{ background: 'linear-gradient(135deg, #071f12, #0C3D22)', borderRadius: '20px', padding: '24px 28px', position: 'relative', overflow: 'hidden', boxShadow: '0 8px 28px rgba(12,61,34,0.2)' }}>
        <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '140px', height: '140px', background: 'rgba(37,211,102,0.06)', borderRadius: '50%' }}></div>
        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px' }}>
              <span style={{ fontSize: '20px' }}>{categoryIcons[selectedProduct?.suppliers?.category] || '📦'}</span>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '12px' }}>{selectedProduct?.suppliers?.name} · per {selectedProduct?.unit}</p>
            </div>
            <h2 style={{ color: 'white', fontSize: '28px', fontWeight: 800, fontFamily: clash, lineHeight: 1 }}>{selectedProduct?.name}</h2>
          </div>
          <div style={{ textAlign: 'right' }}>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '11px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.6px', marginBottom: '4px' }}>Current Price</p>
            <p style={{ color: 'white', fontSize: '32px', fontWeight: 800, fontFamily: clash, lineHeight: 1 }}>
              RWF {Number(selectedProduct?.current_price || 0).toLocaleString()}
            </p>
            {prices.length > 1 && (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '4px', background: totalChange > 0 ? 'rgba(220,38,38,0.2)' : 'rgba(37,211,102,0.2)', border: `1px solid ${totalChange > 0 ? 'rgba(220,38,38,0.3)' : 'rgba(37,211,102,0.3)'}`, borderRadius: '20px', padding: '3px 10px', marginTop: '6px' }}>
                <span style={{ color: totalChange > 0 ? '#f87171' : '#4ade80', fontSize: '12px', fontWeight: 700 }}>
                  {totalChange > 0 ? '↑' : '↓'} {Math.abs(Math.round(totalChange))}% overall
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Stat cards */}
      {prices.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px' }}>
          {[
            { label: 'Lowest Price', value: `RWF ${minPrice.toLocaleString()}`, bg: 'linear-gradient(135deg, #1A6B3C, #166534)', icon: '📉', sub: 'best price seen' },
            { label: 'Highest Price', value: `RWF ${maxPrice.toLocaleString()}`, bg: 'linear-gradient(135deg, #dc2626, #b91c1c)', icon: '📈', sub: 'peak price seen' },
            { label: 'Total Change', value: `${totalChange > 0 ? '+' : ''}${Math.round(totalChange)}%`, bg: totalChange > 0 ? 'linear-gradient(135deg, #ea580c, #c2410c)' : 'linear-gradient(135deg, #1A6B3C, #166534)', icon: totalChange > 0 ? '⚠️' : '✅', sub: `${prices.length} data points` },
          ].map((s, i) => (
            <div key={i} style={{ background: s.bg, borderRadius: '16px', padding: '16px', boxShadow: '0 4px 16px rgba(0,0,0,0.12)', position: 'relative', overflow: 'hidden', height: '90px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{ position: 'absolute', bottom: '-8px', right: '-4px', fontSize: '40px', opacity: 0.1 }}>{s.icon}</div>
              <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.6px' }}>{s.label}</p>
              <div>
                <p style={{ color: 'white', fontSize: '18px', fontWeight: 800, fontFamily: clash, lineHeight: 1, marginBottom: '2px' }}>{s.value}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '10px' }}>{s.sub}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bar Chart */}
      <div style={{ background: 'white', borderRadius: '20px', padding: '24px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
          <div>
            <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash, marginBottom: '2px' }}>Price Over Time</h3>
            <p style={{ fontSize: '12px', color: '#9ca3af' }}>Recorded on each order · <span style={{ color: '#dc2626' }}>■</span> increase · <span style={{ color: '#1A6B3C' }}>■</span> decrease · <span style={{ color: '#9ca3af' }}>■</span> first</p>
          </div>
          {prices.length > 0 && (
            <div style={{ background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '10px', padding: '5px 12px' }}>
              <p style={{ fontSize: '12px', fontWeight: 700, color: '#1A6B3C', fontFamily: clash }}>{prices.length} records</p>
            </div>
          )}
        </div>

        {historyLoading && (
          <div style={{ padding: '48px', textAlign: 'center' }}>
            <div style={{ width: '28px', height: '28px', border: '3px solid #f3f4f6', borderTop: '3px solid #1A6B3C', borderRadius: '50%', margin: '0 auto' }}></div>
          </div>
        )}

        {!historyLoading && prices.length === 0 && (
          <div style={{ padding: '48px 24px', textAlign: 'center' }}>
            <div style={{ width: '64px', height: '64px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', margin: '0 auto 16px', border: '1px solid #bbf7d0' }}>📦</div>
            <p style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash, marginBottom: '6px' }}>No price history yet</p>
            <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '20px', maxWidth: '260px', margin: '0 auto 20px', lineHeight: 1.6 }}>
              Place an order with {selectedProduct?.name} to start tracking price changes
            </p>
            <a href="/orders">
              <button style={{ background: '#25D366', color: 'white', fontWeight: 700, padding: '11px 22px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '13px', fontFamily: clash, boxShadow: '0 4px 12px rgba(37,211,102,0.3)' }}>
                📲 Place an Order
              </button>
            </a>
          </div>
        )}

        {!historyLoading && prices.length === 1 && (
          <div style={{ padding: '32px 24px', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-end', gap: '12px', marginBottom: '16px' }}>
              <div style={{ width: '48px', height: '80px', background: '#9ca3af', borderRadius: '8px 8px 0 0', display: 'flex', alignItems: 'flex-start', justifyContent: 'center', paddingTop: '8px' }}>
                <p style={{ color: 'white', fontSize: '11px', fontWeight: 700 }}>RWF {prices[0].toLocaleString()}</p>
              </div>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>Place one more order to see price changes</p>
          </div>
        )}

        {!historyLoading && prices.length > 1 && (
          <>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: isMobile ? '6px' : '10px', height: '160px', marginBottom: '10px', paddingBottom: '2px' }}>
              {history.map((h, i) => {
                const price = Number(h.price)
                const prevPrice = i > 0 ? Number(history[i - 1].price) : null
                const barHeight = Math.max((price / chartMax) * 140, 6)
                const isLatest = i === history.length - 1
                let color = '#9ca3af'
                if (prevPrice !== null) {
                  if (price > prevPrice) color = '#dc2626'
                  else if (price < prevPrice) color = '#1A6B3C'
                }
                return (
                  <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', minWidth: 0 }}>
                    {isLatest && (
                      <p style={{ fontSize: '9px', fontWeight: 700, color: '#1A6B3C', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        RWF {price.toLocaleString()}
                      </p>
                    )}
                    <div style={{ position: 'relative', width: '100%' }}>
                      <div
                        style={{ width: '100%', height: `${barHeight}px`, background: isLatest ? `linear-gradient(180deg, ${color}ee, ${color})` : color, borderRadius: '6px 6px 0 0', transition: 'all 0.3s ease', border: isLatest ? `2px solid ${color}` : 'none', boxShadow: isLatest ? `0 4px 12px ${color}44` : 'none', cursor: 'pointer', opacity: isLatest ? 1 : 0.7 }}
                        title={`RWF ${price.toLocaleString()} · ${new Date(h.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}`}
                        onMouseEnter={e => { e.currentTarget.style.opacity = '1'; e.currentTarget.style.transform = 'scaleX(1.05)' }}
                        onMouseLeave={e => { e.currentTarget.style.opacity = isLatest ? '1' : '0.7'; e.currentTarget.style.transform = 'scaleX(1)' }}
                      ></div>
                    </div>
                  </div>
                )
              })}
            </div>
            <div style={{ display: 'flex', gap: isMobile ? '6px' : '10px' }}>
              {history.map((h, i) => (
                <div key={i} style={{ flex: 1, textAlign: 'center', minWidth: 0 }}>
                  <p style={{ fontSize: '9px', color: i === history.length - 1 ? '#1A6B3C' : '#9ca3af', fontWeight: i === history.length - 1 ? 700 : 400, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {new Date(h.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Price Log */}
      {prices.length > 0 && (
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '18px 20px', borderBottom: '1px solid #f5f3f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h3 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>Full Price Log</h3>
              <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>Newest first · {prices.length} records</p>
            </div>
          </div>
          {[...history].reverse().map((h, i) => {
            const price = Number(h.price)
            const origIndex = history.length - 1 - i
            const prevPrice = origIndex > 0 ? Number(history[origIndex - 1].price) : null
            const change = prevPrice ? ((price - prevPrice) / prevPrice) * 100 : null
            let dotColor = '#9ca3af'
            if (prevPrice !== null) {
              if (price > prevPrice) dotColor = '#dc2626'
              else if (price < prevPrice) dotColor = '#1A6B3C'
            }
            return (
              <div key={i} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 20px', borderBottom: i < history.length - 1 ? '1px solid #fafaf9' : 'none', transition: 'background 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: dotColor, flexShrink: 0, boxShadow: `0 0 6px ${dotColor}66` }}></div>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '13px', color: '#111', fontFamily: clash }}>
                      RWF {price.toLocaleString()}
                    </p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>
                      {new Date(h.recorded_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })} · {new Date(h.recorded_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                {change !== null && (
                  <div style={{ background: change > 0 ? '#fef2f2' : '#f0fdf4', color: change > 0 ? '#dc2626' : '#1A6B3C', fontSize: '12px', fontWeight: 700, padding: '4px 10px', borderRadius: '20px', fontFamily: clash }}>
                    {change > 0 ? '+' : ''}{Math.round(change)}%
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0EDE8' }}>
      <Navbar user={user} />

      <main style={{ flex: 1, overflowX: 'hidden', padding: isMobile ? '16px' : '28px', paddingBottom: isMobile ? '100px' : '40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 800, color: '#111', fontFamily: clash, marginBottom: '4px' }}>Price History</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>Track how your supplier prices change over time</p>
          </div>
          {isMobile && selectedProduct && showMobileDetail && (
            <button onClick={() => setShowMobileDetail(false)} style={{ background: 'white', border: '1px solid #e5e7eb', borderRadius: '10px', padding: '8px 14px', fontSize: '13px', fontWeight: 600, color: '#374151', cursor: 'pointer', fontFamily: clash }}>
              ← Products
            </button>
          )}
        </div>

        {loading && (
          <div style={{ padding: '80px', textAlign: 'center' }}>
            <div style={{ width: '32px', height: '32px', border: '3px solid #f3f4f6', borderTop: '3px solid #1A6B3C', borderRadius: '50%', margin: '0 auto' }}></div>
          </div>
        )}

        {!loading && products.length === 0 && (
          <div style={{ background: 'white', borderRadius: '24px', padding: '72px 24px', textAlign: 'center', border: '1px solid #ede9e4', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 20px', border: '1px solid #bbf7d0' }}>📈</div>
            <p style={{ fontWeight: 800, fontSize: '20px', color: '#111', marginBottom: '8px', fontFamily: clash }}>No products yet</p>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px', maxWidth: '280px', margin: '0 auto 24px', lineHeight: 1.6 }}>
              Add suppliers and products first, then place orders to start tracking prices
            </p>
            <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', flexWrap: 'wrap' }}>
              <a href="/suppliers">
                <button style={{ background: '#0C3D22', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, boxShadow: '0 4px 12px rgba(12,61,34,0.2)' }}>
                  + Add Supplier
                </button>
              </a>
              <a href="/orders">
                <button style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 22px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, boxShadow: '0 4px 12px rgba(37,211,102,0.2)' }}>
                  📲 Place Order
                </button>
              </a>
            </div>
          </div>
        )}

        {!loading && products.length > 0 && (
          !isMobile ? (
            /* Desktop — sidebar + detail */
            <div style={{ display: 'grid', gridTemplateColumns: '280px 1fr', gap: '20px', alignItems: 'start' }}>

              {/* Product list sidebar */}
              <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)', position: 'sticky', top: '24px' }}>
                <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f3f0' }}>
                  <h2 style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash }}>Products</h2>
                  <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{products.length} tracked</p>
                </div>
                {products.map(product => {
                  const isSelected = selectedProduct?.id === product.id
                  return (
                    <div key={product.id} onClick={() => selectProduct(product)} style={{ padding: '14px 20px', cursor: 'pointer', background: isSelected ? '#f0fdf4' : 'white', borderLeft: isSelected ? '3px solid #1A6B3C' : '3px solid transparent', borderBottom: '1px solid #f9f7f5', transition: 'all 0.15s' }}
                      onMouseEnter={e => { if (!isSelected) e.currentTarget.style.background = '#fafaf9' }}
                      onMouseLeave={e => { if (!isSelected) e.currentTarget.style.background = 'white' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div>
                          <p style={{ fontWeight: isSelected ? 700 : 600, fontSize: '14px', color: isSelected ? '#1A6B3C' : '#111', fontFamily: clash }}>{product.name}</p>
                          <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{product.suppliers?.name} · per {product.unit}</p>
                        </div>
                        <p style={{ fontWeight: 700, fontSize: '13px', color: isSelected ? '#1A6B3C' : '#111', fontFamily: clash }}>
                          RWF {Number(product.current_price).toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )
                })}
              </div>

              {/* Detail panel */}
              {selectedProduct && <DetailPanel />}
            </div>
          ) : (
            /* Mobile */
            <div>
              {!showMobileDetail ? (
                /* Product list */
                <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4' }}>
                  <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f3f0' }}>
                    <h2 style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash }}>Products</h2>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{products.length} tracked · tap to view history</p>
                  </div>
                  {products.map(product => (
                    <div key={product.id} onClick={() => selectProduct(product)} style={{ padding: '16px 20px', cursor: 'pointer', borderBottom: '1px solid #f9f7f5', display: 'flex', alignItems: 'center', justifyContent: 'space-between', transition: 'background 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
                      onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ width: '40px', height: '40px', background: '#f0fdf4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', border: '1px solid #bbf7d0' }}>
                          {categoryIcons[product.suppliers?.category] || '📦'}
                        </div>
                        <div>
                          <p style={{ fontWeight: 600, fontSize: '14px', color: '#111', fontFamily: clash }}>{product.name}</p>
                          <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{product.suppliers?.name} · per {product.unit}</p>
                        </div>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <p style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash }}>RWF {Number(product.current_price).toLocaleString()}</p>
                        <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>View →</p>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                selectedProduct && <DetailPanel />
              )}
            </div>
          )
        )}
      </main>
    </div>
  )
}