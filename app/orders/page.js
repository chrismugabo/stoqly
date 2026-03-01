 'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Navbar from '@/app/components/Navbar'

const clash = "'Clash Display', sans-serif"

export default function OrdersPage() {
  const [user, setUser] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState(null)
  const [orderItems, setOrderItems] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => { getUser() }, [])

  useEffect(() => { if (user) { fetchSuppliers(); fetchOrders() } }, [user])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    if (data?.user) setUser(data.user)
    else window.location.href = '/login'
  }

  async function fetchSuppliers() {
    const { data } = await supabase.from('suppliers').select('*').order('name')
    if (data) setSuppliers(data)
  }

  async function fetchProducts(supplierId) {
    const { data } = await supabase.from('products').select('*').eq('supplier_id', supplierId)
    if (data) setProducts(data)
  }

  async function fetchOrders() {
    const { data } = await supabase.from('orders').select('*, suppliers(name)').order('created_at', { ascending: false })
    if (data) setOrders(data)
  }

  function selectSupplier(supplier) {
    setSelectedSupplier(supplier)
    setOrderItems([])
    fetchProducts(supplier.id)
  }

  function toggleProduct(product) {
    const exists = orderItems.find(i => i.product_id === product.id)
    if (exists) setOrderItems(orderItems.filter(i => i.product_id !== product.id))
    else setOrderItems([...orderItems, { product_id: product.id, name: product.name, price: product.current_price, unit: product.unit, quantity: 1 }])
  }

  function updateQuantity(productId, value) {
    setOrderItems(orderItems.map(i => i.product_id === productId ? { ...i, quantity: Number(value) } : i))
  }

  function calculateTotal() {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  function generateWhatsAppMessage() {
    if (!selectedSupplier || orderItems.length === 0) return ''
    const lines = orderItems.map(i => `• ${i.name} — ${i.quantity} ${i.unit || 'pcs'}`)
    return `Hello! 👋\n\nI'd like to place an order:\n\n${lines.join('\n')}\n\nTotal: RWF ${calculateTotal().toLocaleString()}\n\nPlease confirm availability.\n\nThank you! 🙏`
  }

  function sendWhatsApp() {
    if (!selectedSupplier) return
    const phone = selectedSupplier.phone?.replace(/\D/g, '')
    const message = encodeURIComponent(generateWhatsAppMessage())
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    saveOrder('sent')
  }

  async function saveOrder(status = 'draft') {
    if (!selectedSupplier || orderItems.length === 0) return
    setLoading(true)
    const total = calculateTotal()
    const { data: orderData, error } = await supabase.from('orders').insert([{ user_id: user.id, supplier_id: selectedSupplier.id, total_amount: total, status }]).select()
    if (error) { setLoading(false); return }
    const orderId = orderData[0].id
    await supabase.from('order_items').insert(orderItems.map(item => ({ order_id: orderId, product_id: item.product_id, quantity: item.quantity, price_at_order: item.price })))
    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setOrderItems([])
    setSelectedSupplier(null)
    setProducts([])
    fetchOrders()
    setLoading(false)
  }

  const waMessage = generateWhatsAppMessage()
  const total = calculateTotal()

  if (!user) return null

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0EDE8' }}>
      <Navbar user={user} />

      <main style={{ flex: 1, overflowX: 'hidden', padding: '24px', paddingBottom: '100px' }}>

        {/* Header */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '26px', fontWeight: 700, color: '#111', fontFamily: clash, marginBottom: '4px' }}>New Order</h1>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>Select a supplier, pick products and send via WhatsApp</p>
        </div>

        {/* Toast */}
        {saved && (
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '14px 18px', marginBottom: '20px', color: '#16a34a', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px', boxShadow: '0 4px 12px rgba(37,211,102,0.1)' }}>
            ✅ Order saved successfully!
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 320px', gap: '20px' }}>

          {/* LEFT */}
          <div>

            {/* Step 1 */}
            <div style={{ background: 'white', borderRadius: '20px', padding: '22px', marginBottom: '16px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #1A6B3C, #166534)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, boxShadow: '0 2px 8px rgba(26,107,60,0.3)', fontFamily: clash }}>1</div>
                <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>Choose Supplier</h2>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {suppliers.map(supplier => (
                  <button key={supplier.id} onClick={() => selectSupplier(supplier)} style={{ padding: '9px 16px', borderRadius: '10px', border: selectedSupplier?.id === supplier.id ? '2px solid #1A6B3C' : '1.5px solid #e5e7eb', background: selectedSupplier?.id === supplier.id ? '#f0fdf4' : 'white', color: selectedSupplier?.id === supplier.id ? '#1A6B3C' : '#374151', fontWeight: selectedSupplier?.id === supplier.id ? 700 : 500, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: clash, boxShadow: selectedSupplier?.id === supplier.id ? '0 2px 8px rgba(26,107,60,0.15)' : 'none' }}>
                    {supplier.name}
                  </button>
                ))}
                {suppliers.length === 0 && <p style={{ color: '#9ca3af', fontSize: '13px' }}>No suppliers yet — add one first</p>}
              </div>
            </div>

            {/* Step 2 */}
            {selectedSupplier && (
              <div className="slide-down" style={{ background: 'white', borderRadius: '20px', padding: '22px', marginBottom: '16px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #1A6B3C, #166534)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, boxShadow: '0 2px 8px rgba(26,107,60,0.3)', fontFamily: clash }}>2</div>
                  <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>Products from {selectedSupplier.name}</h2>
                </div>

                {products.length === 0 && <p style={{ color: '#9ca3af', fontSize: '13px' }}>No products for this supplier yet</p>}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {products.map(product => {
                    const selected = orderItems.find(i => i.product_id === product.id)
                    return (
                      <div key={product.id} onClick={() => toggleProduct(product)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '14px', border: selected ? '2px solid #1A6B3C' : '1.5px solid #e5e7eb', background: selected ? '#f0fdf4' : 'white', cursor: 'pointer', transition: 'all 0.15s', boxShadow: selected ? '0 2px 8px rgba(26,107,60,0.1)' : 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '22px', height: '22px', borderRadius: '7px', border: selected ? 'none' : '2px solid #d1d5db', background: selected ? '#1A6B3C' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', flexShrink: 0, transition: 'all 0.15s', boxShadow: selected ? '0 2px 6px rgba(26,107,60,0.3)' : 'none' }}>
                            {selected ? '✓' : ''}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '14px', color: '#111', fontFamily: clash }}>{product.name}</p>
                            <p style={{ fontSize: '12px', color: '#9ca3af' }}>RWF {Number(product.current_price).toLocaleString()} / {product.unit}</p>
                          </div>
                        </div>
                        {selected && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => updateQuantity(product.id, Math.max(1, (selected.quantity || 1) - 1))} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>−</button>
                            <span style={{ fontWeight: 800, fontSize: '15px', minWidth: '24px', textAlign: 'center', fontFamily: clash }}>{selected.quantity}</span>
                            <button onClick={() => updateQuantity(product.id, (selected.quantity || 1) + 1)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 700 }}>+</button>
                            <span style={{ fontSize: '11px', color: '#9ca3af' }}>{product.unit}</span>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT — Summary */}
          <div>
            <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4', position: 'sticky', top: '24px', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>
              <div style={{ padding: '18px 20px 16px', borderBottom: '1px solid #f5f3f0', display: 'flex', alignItems: 'center', gap: '10px' }}>
                <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #1A6B3C, #166534)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, fontFamily: clash }}>3</div>
                <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>Order Summary</h2>
              </div>

              {orderItems.length === 0 ? (
                <div style={{ padding: '40px 20px', textAlign: 'center' }}>
                  <p style={{ fontSize: '36px', marginBottom: '10px' }}>📋</p>
                  <p style={{ color: '#9ca3af', fontSize: '13px' }}>Select products to build your order</p>
                </div>
              ) : (
                <>
                  <div style={{ padding: '12px 20px' }}>
                    {orderItems.map(item => (
                      <div key={item.product_id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '9px 0', borderBottom: '1px solid #f9f7f5' }}>
                        <div>
                          <p style={{ fontSize: '13px', fontWeight: 600, color: '#111', fontFamily: clash }}>{item.name}</p>
                          <p style={{ fontSize: '11px', color: '#9ca3af' }}>{item.quantity} {item.unit} × RWF {Number(item.price).toLocaleString()}</p>
                        </div>
                        <p style={{ fontSize: '13px', fontWeight: 700, color: '#1A6B3C', fontFamily: clash }}>RWF {(item.quantity * item.price).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                  <div style={{ padding: '14px 20px', background: '#fafaf9', borderTop: '1px solid #f0f0f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
                      <span style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>Total</span>
                      <span style={{ fontWeight: 800, fontSize: '16px', color: '#1A6B3C', fontFamily: clash }}>RWF {total.toLocaleString()}</span>
                    </div>
                    <button onClick={sendWhatsApp} disabled={loading} style={{ width: '100%', background: '#25D366', color: 'white', fontWeight: 700, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', marginBottom: '8px', fontFamily: clash, boxShadow: '0 4px 16px rgba(37,211,102,0.3)', transition: 'transform 0.15s' }}
                      onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
                      onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
                    >
                      📲 Send via WhatsApp
                    </button>
                    <button onClick={() => saveOrder('draft')} disabled={loading} style={{ width: '100%', background: 'white', color: '#6b7280', fontWeight: 600, padding: '11px', borderRadius: '12px', border: '1.5px solid #e5e7eb', cursor: 'pointer', fontSize: '13px', transition: 'all 0.15s', fontFamily: clash }}>
                      {loading ? 'Saving...' : 'Save as Draft'}
                    </button>
                  </div>
                </>
              )}

              {/* WhatsApp Preview */}
              {waMessage && (
                <div style={{ margin: '0 16px 16px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '12px', padding: '14px' }}>
                  <p style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a', marginBottom: '8px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Message Preview</p>
                  <p style={{ fontSize: '12px', color: '#166534', lineHeight: 1.6, whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>{waMessage}</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Previous Orders */}
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4', marginTop: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '18px 24px', borderBottom: '1px solid #f5f3f0' }}>
            <h2 style={{ fontWeight: 700, fontSize: '16px', color: '#111', fontFamily: clash }}>Previous Orders</h2>
          </div>
          {orders.length === 0 && <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>No orders yet</div>}
          {orders.map((order, i) => (
            <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 24px', borderBottom: i < orders.length - 1 ? '1px solid #fafaf9' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                <div style={{ width: '40px', height: '40px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: '1px solid #bbf7d0' }}>🏪</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: '#111', fontFamily: clash }}>{order.suppliers?.name}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
                </div>
              </div>
              <div style={{ textAlign: 'right' }}>
                <p style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash }}>RWF {Number(order.total_amount).toLocaleString()}</p>
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