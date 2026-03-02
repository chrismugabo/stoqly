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
  const [isMobile, setIsMobile] = useState(false)
  const [showSummary, setShowSummary] = useState(false)
  const [msgLang, setMsgLang] = useState('en')
  const [editedMessage, setEditedMessage] = useState('')
  const [messageEdited, setMessageEdited] = useState(false)

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  useEffect(() => { getUser() }, [])
  useEffect(() => { if (user) { fetchSuppliers(); fetchOrders() } }, [user])

  // Regenerate message when items, supplier or language changes
  // but only if user hasn't manually edited it
  useEffect(() => {
    if (!messageEdited) {
      setEditedMessage(generateBaseMessage(msgLang))
    }
  }, [orderItems, selectedSupplier, msgLang])

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
    setMessageEdited(false)
    fetchProducts(supplier.id)
  }

  function toggleProduct(product) {
    const exists = orderItems.find(i => i.product_id === product.id)
    if (exists) setOrderItems(orderItems.filter(i => i.product_id !== product.id))
    else setOrderItems([...orderItems, { product_id: product.id, name: product.name, price: product.current_price, unit: product.unit, quantity: 1 }])
    setMessageEdited(false)
  }

  function updateQuantity(productId, value) {
    setOrderItems(orderItems.map(i => i.product_id === productId ? { ...i, quantity: Number(value) } : i))
    setMessageEdited(false)
  }

  function calculateTotal() {
    return orderItems.reduce((total, item) => total + item.price * item.quantity, 0)
  }

  function generateBaseMessage(lang) {
    if (!selectedSupplier || orderItems.length === 0) return ''
    const lines = orderItems.map(i => `• ${i.name} — ${i.quantity} ${i.unit || 'pcs'}`)
    const total = orderItems.reduce((t, i) => t + i.price * i.quantity, 0)

    if (lang === 'rw') {
      return `Muraho! 👋\n\nNdashaka gutumiza:\n\n${lines.join('\n')}\n\nIgiteranyo: RWF ${total.toLocaleString()}\n\nMwemeze niba bifitwe.\n\nMurakoze! 🙏`
    }
    return `Hello! 👋\n\nI'd like to place an order:\n\n${lines.join('\n')}\n\nTotal: RWF ${total.toLocaleString()}\n\nPlease confirm availability.\n\nThank you! 🙏`
  }

  function handleMessageChange(val) {
    setEditedMessage(val)
    setMessageEdited(true)
  }

  function resetMessage() {
    setMessageEdited(false)
    setEditedMessage(generateBaseMessage(msgLang))
  }

  function switchLang(lang) {
    setMsgLang(lang)
    setMessageEdited(false)
  }

  function sendWhatsApp() {
    if (!selectedSupplier) return
    const phone = selectedSupplier.phone?.replace(/\D/g, '')
    const message = encodeURIComponent(editedMessage || generateBaseMessage(msgLang))
    window.open(`https://wa.me/${phone}?text=${message}`, '_blank')
    saveOrder('sent')
  }

  async function saveOrder(status = 'draft') {
    if (!selectedSupplier || orderItems.length === 0) return
    setLoading(true)

    const total = calculateTotal()

    const { data: orderData, error } = await supabase
      .from('orders')
      .insert([{ user_id: user.id, supplier_id: selectedSupplier.id, total_amount: total, status }])
      .select()

    if (error) { setLoading(false); return }

    const orderId = orderData[0].id

    await supabase.from('order_items').insert(
      orderItems.map(item => ({
        order_id: orderId,
        product_id: item.product_id,
        quantity: item.quantity,
        price_at_order: item.price
      }))
    )

    await supabase.from('price_history').insert(
      orderItems.map(item => ({
        user_id: user.id,
        product_id: item.product_id,
        supplier_id: selectedSupplier.id,
        price: item.price
      }))
    )

    setSaved(true)
    setTimeout(() => setSaved(false), 3000)
    setOrderItems([])
    setSelectedSupplier(null)
    setProducts([])
    setEditedMessage('')
    setMessageEdited(false)
    setShowSummary(false)
    fetchOrders()
    setLoading(false)
  }

  const total = calculateTotal()

  if (!user) return null

  const LangToggle = () => (
    <div style={{ display: 'flex', background: '#f3f4f6', borderRadius: '10px', padding: '3px', gap: '2px' }}>
      {[
        { code: 'en', label: '🇬🇧 EN' },
        { code: 'rw', label: '🇷🇼 RW' },
      ].map(l => (
        <button
          key={l.code}
          onClick={() => switchLang(l.code)}
          style={{
            padding: '6px 12px', borderRadius: '8px', border: 'none',
            background: msgLang === l.code ? 'white' : 'transparent',
            color: msgLang === l.code ? '#111' : '#9ca3af',
            fontWeight: msgLang === l.code ? 700 : 500,
            fontSize: '12px', cursor: 'pointer',
            transition: 'all 0.15s', fontFamily: clash,
            boxShadow: msgLang === l.code ? '0 1px 4px rgba(0,0,0,0.1)' : 'none'
          }}
        >
          {l.label}
        </button>
      ))}
    </div>
  )

  const SummaryPanel = () => (
    <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4', boxShadow: '0 4px 16px rgba(0,0,0,0.06)' }}>

      {/* Header */}
      <div style={{ padding: '18px 20px 14px', borderBottom: '1px solid #f5f3f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #1A6B3C, #166534)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, fontFamily: clash }}>3</div>
          <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>
            {msgLang === 'rw' ? 'Incamake' : 'Order Summary'}
          </h2>
        </div>
        <LangToggle />
      </div>

      {orderItems.length === 0 ? (
        <div style={{ padding: '40px 20px', textAlign: 'center' }}>
          <p style={{ fontSize: '36px', marginBottom: '10px' }}>📋</p>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>
            {msgLang === 'rw' ? 'Hitamo ibicuruzwa' : 'Select products to build your order'}
          </p>
        </div>
      ) : (
        <>
          {/* Items */}
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

          {/* Total + buttons */}
          <div style={{ padding: '14px 20px', background: '#fafaf9', borderTop: '1px solid #f0f0f0' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '16px' }}>
              <span style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>
                {msgLang === 'rw' ? 'Igiteranyo' : 'Total'}
              </span>
              <span style={{ fontWeight: 800, fontSize: '16px', color: '#1A6B3C', fontFamily: clash }}>RWF {total.toLocaleString()}</span>
            </div>
            <button onClick={sendWhatsApp} disabled={loading} style={{ width: '100%', background: '#25D366', color: 'white', fontWeight: 700, padding: '14px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '15px', marginBottom: '8px', fontFamily: clash, boxShadow: '0 4px 16px rgba(37,211,102,0.3)' }}>
              📲 {msgLang === 'rw' ? 'Ohereza kuri WhatsApp' : 'Send via WhatsApp'}
            </button>
            <button onClick={() => saveOrder('draft')} disabled={loading} style={{ width: '100%', background: 'white', color: '#6b7280', fontWeight: 600, padding: '11px', borderRadius: '12px', border: '1.5px solid #e5e7eb', cursor: 'pointer', fontSize: '13px', fontFamily: clash }}>
              {loading ? 'Saving...' : msgLang === 'rw' ? "Bika nk'inyandiko" : 'Save as Draft'}
            </button>
          </div>
        </>
      )}

      {/* Editable Message */}
      {editedMessage ? (
        <div style={{ margin: '0 16px 16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <p style={{ fontSize: '10px', fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                {msgLang === 'rw' ? "Hindura ubutumwa" : 'Edit Message'}
              </p>
              {messageEdited && (
                <span style={{ fontSize: '10px', background: '#fef3c7', color: '#d97706', padding: '1px 6px', borderRadius: '20px', fontWeight: 600 }}>edited</span>
              )}
            </div>
            {messageEdited && (
              <button
                onClick={resetMessage}
                style={{ fontSize: '11px', color: '#9ca3af', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}
              >
                {msgLang === 'rw' ? 'Subira ku rugero' : 'Reset to default'}
              </button>
            )}
          </div>
          <textarea
            value={editedMessage}
            onChange={e => handleMessageChange(e.target.value)}
            style={{
              width: '100%',
              minHeight: '180px',
              padding: '12px 14px',
              borderRadius: '12px',
              border: messageEdited ? '1.5px solid #f59e0b' : '1.5px solid #bbf7d0',
              background: messageEdited ? '#fffbeb' : '#f0fdf4',
              fontSize: '12px',
              color: '#166534',
              lineHeight: 1.7,
              fontFamily: 'monospace',
              resize: 'vertical',
              outline: 'none',
              boxSizing: 'border-box',
              transition: 'border-color 0.15s, background 0.15s'
            }}
            onFocus={e => e.target.style.borderColor = '#1A6B3C'}
            onBlur={e => e.target.style.borderColor = messageEdited ? '#f59e0b' : '#bbf7d0'}
          />
          <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '6px' }}>
            {msgLang === 'rw'
              ? 'Ubutumwa buzohererezwa nkuko bugaragara hano'
              : 'This exact message will be sent to your supplier'}
          </p>
        </div>
      ) : null}
    </div>
  )

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0EDE8' }}>
      <Navbar user={user} />

      <main style={{ flex: 1, overflowX: 'hidden', padding: isMobile ? '16px' : '24px', paddingBottom: isMobile ? '120px' : '40px' }}>

        <div style={{ marginBottom: '20px' }}>
          <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 700, color: '#111', fontFamily: clash, marginBottom: '4px' }}>
            {msgLang === 'rw' ? 'Itumizwa Rishya' : 'New Order'}
          </h1>
          <p style={{ color: '#9ca3af', fontSize: '13px' }}>
            {msgLang === 'rw' ? 'Hitamo umutanga, ibicuruzwa, wohereze kuri WhatsApp' : 'Select a supplier, pick products and send via WhatsApp'}
          </p>
        </div>

        {saved && (
          <div style={{ background: '#f0fdf4', border: '1.5px solid #86efac', borderRadius: '14px', padding: '14px 18px', marginBottom: '20px', color: '#16a34a', fontWeight: 600, fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            ✅ {msgLang === 'rw' ? 'Itumizwa ryabitswe!' : 'Order saved and prices recorded!'}
          </div>
        )}

        {/* Mobile floating button */}
        {isMobile && orderItems.length > 0 && (
          <button onClick={() => setShowSummary(true)} style={{ position: 'fixed', bottom: '90px', left: '50%', transform: 'translateX(-50%)', background: '#25D366', color: 'white', fontWeight: 700, padding: '14px 28px', borderRadius: '50px', border: 'none', cursor: 'pointer', fontSize: '15px', zIndex: 50, boxShadow: '0 8px 24px rgba(37,211,102,0.4)', fontFamily: clash, display: 'flex', alignItems: 'center', gap: '8px', whiteSpace: 'nowrap' }}>
            📲 {msgLang === 'rw' ? 'Ohereza' : 'Send'} · RWF {total.toLocaleString()}
          </button>
        )}

        {/* Mobile Summary Modal */}
        {isMobile && showSummary && (
          <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', zIndex: 200, display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ background: '#F0EDE8', borderRadius: '24px 24px 0 0', padding: '20px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <p style={{ fontWeight: 700, fontSize: '16px', fontFamily: clash }}>
                  {msgLang === 'rw' ? 'Incamake y\'itumizwa' : 'Order Summary'}
                </p>
                <button onClick={() => setShowSummary(false)} style={{ background: '#f3f4f6', border: 'none', borderRadius: '50%', width: '32px', height: '32px', cursor: 'pointer', fontSize: '16px' }}>×</button>
              </div>
              <SummaryPanel />
            </div>
          </div>
        )}

        {!isMobile ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) 360px', gap: '20px' }}>
            <div>
              {/* Step 1 */}
              <div style={{ background: 'white', borderRadius: '20px', padding: '22px', marginBottom: '16px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                  <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #1A6B3C, #166534)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, fontFamily: clash }}>1</div>
                  <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>
                    {msgLang === 'rw' ? 'Hitamo Umutanga' : 'Choose Supplier'}
                  </h2>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {suppliers.map(supplier => (
                    <button key={supplier.id} onClick={() => selectSupplier(supplier)} style={{ padding: '9px 16px', borderRadius: '10px', border: selectedSupplier?.id === supplier.id ? '2px solid #1A6B3C' : '1.5px solid #e5e7eb', background: selectedSupplier?.id === supplier.id ? '#f0fdf4' : 'white', color: selectedSupplier?.id === supplier.id ? '#1A6B3C' : '#374151', fontWeight: selectedSupplier?.id === supplier.id ? 700 : 500, fontSize: '13px', cursor: 'pointer', transition: 'all 0.15s', fontFamily: clash }}>
                      {supplier.name}
                    </button>
                  ))}
                  {suppliers.length === 0 && <p style={{ color: '#9ca3af', fontSize: '13px' }}>No suppliers yet</p>}
                </div>
              </div>

              {/* Step 2 */}
              {selectedSupplier && (
                <div style={{ background: 'white', borderRadius: '20px', padding: '22px', marginBottom: '16px', border: '1px solid #ede9e4', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '16px' }}>
                    <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #1A6B3C, #166534)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '13px', fontWeight: 700, fontFamily: clash }}>2</div>
                    <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>
                      {msgLang === 'rw' ? `Ibicuruzwa bya ${selectedSupplier.name}` : `Products from ${selectedSupplier.name}`}
                    </h2>
                  </div>
                  {products.length === 0 && <p style={{ color: '#9ca3af', fontSize: '13px' }}>{msgLang === 'rw' ? 'Nta bicuruzwa' : 'No products yet'}</p>}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {products.map(product => {
                      const selected = orderItems.find(i => i.product_id === product.id)
                      return (
                        <div key={product.id} onClick={() => toggleProduct(product)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 16px', borderRadius: '14px', border: selected ? '2px solid #1A6B3C' : '1.5px solid #e5e7eb', background: selected ? '#f0fdf4' : 'white', cursor: 'pointer', transition: 'all 0.15s' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <div style={{ width: '22px', height: '22px', borderRadius: '7px', border: selected ? 'none' : '2px solid #d1d5db', background: selected ? '#1A6B3C' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '11px', color: 'white', flexShrink: 0, transition: 'all 0.15s' }}>
                              {selected ? '✓' : ''}
                            </div>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: '14px', color: '#111', fontFamily: clash }}>{product.name}</p>
                              <p style={{ fontSize: '12px', color: '#9ca3af' }}>RWF {Number(product.current_price).toLocaleString()} / {product.unit}</p>
                            </div>
                          </div>
                          {selected && (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
                              <button onClick={() => updateQuantity(product.id, Math.max(1, (selected.quantity || 1) - 1))} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                              <span style={{ fontWeight: 800, fontSize: '15px', minWidth: '24px', textAlign: 'center', fontFamily: clash }}>{selected.quantity}</span>
                              <button onClick={() => updateQuantity(product.id, (selected.quantity || 1) + 1)} style={{ width: '30px', height: '30px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '16px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                            </div>
                          )}
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            <SummaryPanel />
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <LangToggle />
            </div>

            <div style={{ background: 'white', borderRadius: '18px', padding: '18px', border: '1px solid #ede9e4' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #1A6B3C, #166534)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700, fontFamily: clash }}>1</div>
                <h2 style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash }}>
                  {msgLang === 'rw' ? 'Hitamo Umutanga' : 'Choose Supplier'}
                </h2>
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {suppliers.map(supplier => (
                  <button key={supplier.id} onClick={() => selectSupplier(supplier)} style={{ padding: '10px 16px', borderRadius: '10px', border: selectedSupplier?.id === supplier.id ? '2px solid #1A6B3C' : '1.5px solid #e5e7eb', background: selectedSupplier?.id === supplier.id ? '#f0fdf4' : 'white', color: selectedSupplier?.id === supplier.id ? '#1A6B3C' : '#374151', fontWeight: selectedSupplier?.id === supplier.id ? 700 : 500, fontSize: '14px', cursor: 'pointer', fontFamily: clash }}>
                    {supplier.name}
                  </button>
                ))}
                {suppliers.length === 0 && <p style={{ color: '#9ca3af', fontSize: '13px' }}>No suppliers yet</p>}
              </div>
            </div>

            {selectedSupplier && (
              <div style={{ background: 'white', borderRadius: '18px', padding: '18px', border: '1px solid #ede9e4' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px' }}>
                  <div style={{ width: '26px', height: '26px', background: 'linear-gradient(135deg, #1A6B3C, #166534)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700, fontFamily: clash }}>2</div>
                  <h2 style={{ fontWeight: 700, fontSize: '14px', color: '#111', fontFamily: clash }}>
                    {msgLang === 'rw' ? `Ibicuruzwa bya ${selectedSupplier.name}` : `Products from ${selectedSupplier.name}`}
                  </h2>
                </div>
                {products.length === 0 && <p style={{ color: '#9ca3af', fontSize: '13px' }}>No products yet</p>}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {products.map(product => {
                    const selected = orderItems.find(i => i.product_id === product.id)
                    return (
                      <div key={product.id} onClick={() => toggleProduct(product)} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: '14px', border: selected ? '2px solid #1A6B3C' : '1.5px solid #e5e7eb', background: selected ? '#f0fdf4' : 'white', cursor: 'pointer' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '24px', height: '24px', borderRadius: '7px', border: selected ? 'none' : '2px solid #d1d5db', background: selected ? '#1A6B3C' : 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', color: 'white', flexShrink: 0 }}>
                            {selected ? '✓' : ''}
                          </div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '14px', color: '#111', fontFamily: clash }}>{product.name}</p>
                            <p style={{ fontSize: '12px', color: '#9ca3af' }}>RWF {Number(product.current_price).toLocaleString()} / {product.unit}</p>
                          </div>
                        </div>
                        {selected && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }} onClick={e => e.stopPropagation()}>
                            <button onClick={() => updateQuantity(product.id, Math.max(1, (selected.quantity || 1) - 1))} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>−</button>
                            <span style={{ fontWeight: 800, fontSize: '16px', minWidth: '28px', textAlign: 'center', fontFamily: clash }}>{selected.quantity}</span>
                            <button onClick={() => updateQuantity(product.id, (selected.quantity || 1) + 1)} style={{ width: '32px', height: '32px', borderRadius: '8px', border: '1.5px solid #e5e7eb', background: 'white', cursor: 'pointer', fontSize: '18px', fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>+</button>
                          </div>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Previous Orders */}
        <div style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: '1px solid #ede9e4', marginTop: '20px', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #f5f3f0' }}>
            <h2 style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>
              {msgLang === 'rw' ? 'Amatumizwa Ashize' : 'Previous Orders'}
            </h2>
          </div>
          {orders.length === 0 && (
            <div style={{ padding: '40px', textAlign: 'center', color: '#9ca3af', fontSize: '14px' }}>
              {msgLang === 'rw' ? 'Nta matumizwa nawe' : 'No orders yet'}
            </div>
          )}
          {orders.map((order, i) => (
            <div key={order.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 20px', borderBottom: i < orders.length - 1 ? '1px solid #fafaf9' : 'none', transition: 'background 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.background = '#fafaf9'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '38px', height: '38px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '16px', border: '1px solid #bbf7d0', flexShrink: 0 }}>🏪</div>
                <div>
                  <p style={{ fontWeight: 600, fontSize: '14px', color: '#111', fontFamily: clash }}>{order.suppliers?.name}</p>
                  <p style={{ fontSize: '12px', color: '#9ca3af' }}>{new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</p>
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