 'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Navbar from '@/app/components/Navbar'

const clash = "'Clash Display', sans-serif"

const categoryConfig = {
  Meat: { bg: '#fef2f2', border: '#fecaca', icon: '🥩', badge: '#fee2e2', badgeText: '#dc2626' },
  Vegetables: { bg: '#f0fdf4', border: '#bbf7d0', icon: '🥦', badge: '#dcfce7', badgeText: '#16a34a' },
  Oil: { bg: '#fffbeb', border: '#fde68a', icon: '🛢️', badge: '#fef3c7', badgeText: '#d97706' },
  Dairy: { bg: '#eff6ff', border: '#bfdbfe', icon: '🥛', badge: '#dbeafe', badgeText: '#2563eb' },
  Beverages: { bg: '#faf5ff', border: '#e9d5ff', icon: '🍺', badge: '#ede9fe', badgeText: '#7c3aed' },
  Spices: { bg: '#fff7ed', border: '#fed7aa', icon: '🧂', badge: '#ffedd5', badgeText: '#ea580c' },
  Other: { bg: '#f9fafb', border: '#e5e7eb', icon: '📦', badge: '#f3f4f6', badgeText: '#6b7280' },
}

export default function SuppliersPage() {
  const [user, setUser] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [products, setProducts] = useState({})
  const [showAddSupplier, setShowAddSupplier] = useState(false)
  const [addProductFor, setAddProductFor] = useState(null)
  const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', category: 'Vegetables', notes: '' })
  const [newProduct, setNewProduct] = useState({ name: '', unit: 'kg', current_price: '', alert_threshold: 10 })
  const [loading, setLoading] = useState(false)
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
    if (data?.user) { setUser(data.user); fetchSuppliers() }
    else window.location.href = '/login'
  }

  async function fetchSuppliers() {
    const { data } = await supabase.from('suppliers').select('*').order('name')
    if (data) setSuppliers(data)
  }

  async function fetchProducts(supplierId) {
    if (products[supplierId]) return
    const { data } = await supabase.from('products').select('*').eq('supplier_id', supplierId).order('name')
    if (data) setProducts(p => ({ ...p, [supplierId]: data }))
  }

  function toggleExpand(supplier) {
    if (expandedId === supplier.id) { setExpandedId(null); setAddProductFor(null) }
    else { setExpandedId(supplier.id); fetchProducts(supplier.id) }
  }

  async function saveSupplier() {
    if (!newSupplier.name.trim()) return
    setLoading(true)
    const { data } = await supabase.from('suppliers').insert([{ ...newSupplier, user_id: user.id }]).select()
    if (data) { setSuppliers(s => [...s, data[0]]); setShowAddSupplier(false); setNewSupplier({ name: '', phone: '', category: 'Vegetables', notes: '' }) }
    setLoading(false)
  }

  async function deleteSupplier(id) {
    if (!confirm('Delete this supplier and all their products?')) return
    await supabase.from('suppliers').delete().eq('id', id)
    setSuppliers(s => s.filter(x => x.id !== id))
    setExpandedId(null)
  }

  async function saveProduct(supplierId) {
    if (!newProduct.name.trim() || !newProduct.current_price) return
    setLoading(true)
    const { data } = await supabase.from('products').insert([{
      ...newProduct, supplier_id: supplierId, user_id: user.id,
      current_price: parseFloat(newProduct.current_price)
    }]).select()
    if (data) {
      setProducts(p => ({ ...p, [supplierId]: [...(p[supplierId] || []), data[0]] }))
      setNewProduct({ name: '', unit: 'kg', current_price: '', alert_threshold: 10 })
      setAddProductFor(null)
    }
    setLoading(false)
  }

  async function deleteProduct(supplierId, productId) {
    await supabase.from('products').delete().eq('id', productId)
    setProducts(p => ({ ...p, [supplierId]: p[supplierId].filter(x => x.id !== productId) }))
  }

  if (!user) return null

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    background: 'white', boxSizing: 'border-box', color: '#111'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0EDE8' }}>
      <Navbar user={user} />

      <main style={{ flex: 1, overflowX: 'hidden', padding: isMobile ? '16px' : '24px', paddingBottom: isMobile ? '100px' : '40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 700, color: '#111', fontFamily: clash, marginBottom: '4px' }}>Suppliers & Products</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>Tap a supplier to manage their products</p>
          </div>
          <button
            onClick={() => setShowAddSupplier(!showAddSupplier)}
            style={{ background: showAddSupplier ? '#f3f4f6' : '#0C3D22', color: showAddSupplier ? '#374151' : 'white', border: 'none', borderRadius: '12px', padding: '11px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, whiteSpace: 'nowrap', flexShrink: 0 }}
          >
            {showAddSupplier ? '✕ Cancel' : '+ Add'}
          </button>
        </div>

        {/* Add Supplier Form */}
        {showAddSupplier && (
          <div className="slide-down" style={{ background: 'white', borderRadius: '20px', padding: '20px', marginBottom: '16px', border: '1.5px solid #1A6B3C', boxShadow: '0 4px 20px rgba(26,107,60,0.1)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '14px', color: '#111', fontFamily: clash }}>New Supplier</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>Name *</label>
                <input value={newSupplier.name} onChange={e => setNewSupplier(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Marcy James" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#1A6B3C'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>Phone</label>
                <input value={newSupplier.phone} onChange={e => setNewSupplier(p => ({ ...p, phone: e.target.value }))} placeholder="+250 7XX XXX XXX" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#1A6B3C'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>Category</label>
                <select value={newSupplier.category} onChange={e => setNewSupplier(p => ({ ...p, category: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {Object.keys(categoryConfig).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>Notes</label>
                <input value={newSupplier.notes} onChange={e => setNewSupplier(p => ({ ...p, notes: e.target.value }))} placeholder="Optional" style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#1A6B3C'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={saveSupplier} disabled={loading} style={{ background: '#0C3D22', color: 'white', border: 'none', borderRadius: '10px', padding: '11px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: clash }}>
                {loading ? 'Saving...' : '✓ Save Supplier'}
              </button>
              <button onClick={() => setShowAddSupplier(false)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', padding: '11px 16px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {suppliers.length === 0 && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '56px 24px', textAlign: 'center', border: '1px solid #ede9e4' }}>
            <p style={{ fontSize: '44px', marginBottom: '14px' }}>🏪</p>
            <p style={{ fontWeight: 700, fontSize: '18px', color: '#111', marginBottom: '8px', fontFamily: clash }}>No suppliers yet</p>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '20px' }}>Add your first supplier to get started</p>
            <button onClick={() => setShowAddSupplier(true)} style={{ background: '#0C3D22', color: 'white', border: 'none', borderRadius: '12px', padding: '12px 24px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: clash }}>
              + Add First Supplier
            </button>
          </div>
        )}

        {/* Supplier Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {suppliers.map((supplier, index) => {
            const config = categoryConfig[supplier.category] || categoryConfig.Other
            const isExpanded = expandedId === supplier.id
            const supplierProducts = products[supplier.id] || []

            return (
              <div key={supplier.id} style={{
                background: 'white', borderRadius: '18px', overflow: 'hidden',
                border: isExpanded ? '1.5px solid #1A6B3C' : '1px solid #ede9e4',
                transition: 'all 0.2s',
                boxShadow: isExpanded ? '0 8px 28px rgba(26,107,60,0.12)' : '0 2px 8px rgba(0,0,0,0.04)'
              }}>

                {/* Supplier Row */}
                <div onClick={() => toggleExpand(supplier)} style={{ display: 'flex', alignItems: 'center', padding: isMobile ? '14px 16px' : '16px 20px', cursor: 'pointer', gap: '12px' }}>
                  <div style={{ width: '44px', height: '44px', background: config.bg, borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', border: `1px solid ${config.border}`, flexShrink: 0 }}>
                    {config.icon}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <p style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>{supplier.name}</p>
                      <span style={{ background: config.badge, color: config.badgeText, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px' }}>{supplier.category}</span>
                    </div>
                    <p style={{ fontSize: '12px', color: '#9ca3af', marginTop: '2px' }}>{supplier.phone || 'No phone'}</p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                    {!isMobile && (
                      <button onClick={e => { e.stopPropagation(); deleteSupplier(supplier.id) }} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '6px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>Delete</button>
                    )}
                    <span style={{ color: '#9ca3af', fontSize: '20px', transition: 'transform 0.25s', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', display: 'inline-block' }}>⌄</span>
                  </div>
                </div>

                {/* Expanded Products */}
                {isExpanded && (
                  <div className="slide-down" style={{ borderTop: '1px solid #f0fdf4', background: '#fafff9' }}>
                    <div style={{ padding: isMobile ? '14px 16px' : '16px 20px' }}>

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#1A6B3C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                          Products ({supplierProducts.length})
                        </p>
                        {isMobile && (
                          <button onClick={e => { e.stopPropagation(); deleteSupplier(supplier.id) }} style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '5px 10px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>Delete Supplier</button>
                        )}
                      </div>

                      {supplierProducts.length === 0 && !addProductFor && (
                        <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '12px' }}>No products yet</p>
                      )}

                      {supplierProducts.map((product, pIndex) => (
                        <div key={product.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 14px', background: 'white', borderRadius: '12px', marginBottom: '8px', border: '1px solid #e9fce9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)' }}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <div style={{ width: '8px', height: '8px', background: '#25D366', borderRadius: '50%', flexShrink: 0 }}></div>
                            <div>
                              <p style={{ fontWeight: 600, fontSize: '13px', color: '#111', fontFamily: clash }}>{product.name}</p>
                              <p style={{ fontSize: '11px', color: '#9ca3af' }}>per {product.unit} · alert {product.alert_threshold}%</p>
                            </div>
                          </div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                            <p style={{ fontWeight: 700, fontSize: '13px', color: '#1A6B3C', fontFamily: clash }}>RWF {Number(product.current_price).toLocaleString()}</p>
                            <button onClick={() => deleteProduct(supplier.id, product.id)} style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '18px', padding: '0 4px' }}>×</button>
                          </div>
                        </div>
                      ))}

                      {/* Add Product Form */}
                      {addProductFor === supplier.id ? (
                        <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1.5px solid #1A6B3C', marginTop: '8px' }}>
                          <p style={{ fontSize: '12px', fontWeight: 700, color: '#1A6B3C', marginBottom: '12px', fontFamily: clash }}>New Product</p>
                          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
                            <div style={{ gridColumn: isMobile ? 'span 2' : 'span 1' }}>
                              <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px' }}>NAME *</label>
                              <input value={newProduct.name} onChange={e => setNewProduct(p => ({ ...p, name: e.target.value }))} placeholder="e.g. Tomatoes" style={{ ...inputStyle, padding: '9px 12px', fontSize: '13px' }}
                                onFocus={e => e.target.style.borderColor = '#1A6B3C'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                            </div>
                            <div>
                              <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px' }}>UNIT</label>
                              <select value={newProduct.unit} onChange={e => setNewProduct(p => ({ ...p, unit: e.target.value }))} style={{ ...inputStyle, padding: '9px 12px', fontSize: '13px', cursor: 'pointer' }}>
                                {['kg', 'g', 'L', 'ml', 'pcs', 'box', 'bag', 'crate'].map(u => <option key={u}>{u}</option>)}
                              </select>
                            </div>
                            <div>
                              <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px' }}>PRICE (RWF) *</label>
                              <input type="number" value={newProduct.current_price} onChange={e => setNewProduct(p => ({ ...p, current_price: e.target.value }))} placeholder="4000" style={{ ...inputStyle, padding: '9px 12px', fontSize: '13px' }}
                                onFocus={e => e.target.style.borderColor = '#1A6B3C'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                            </div>
                            <div>
                              <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px' }}>ALERT %</label>
                              <input type="number" value={newProduct.alert_threshold} onChange={e => setNewProduct(p => ({ ...p, alert_threshold: e.target.value }))} placeholder="10" style={{ ...inputStyle, padding: '9px 12px', fontSize: '13px' }}
                                onFocus={e => e.target.style.borderColor = '#1A6B3C'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '8px' }}>
                            <button onClick={() => saveProduct(supplier.id)} disabled={loading} style={{ background: '#1A6B3C', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: clash }}>
                              {loading ? 'Saving...' : '✓ Save'}
                            </button>
                            <button onClick={() => setAddProductFor(null)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setAddProductFor(supplier.id)} style={{ width: '100%', background: 'white', border: '1.5px dashed #bbf7d0', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: 600, color: '#1A6B3C', cursor: 'pointer', marginTop: '4px', fontFamily: clash }}>
                          + Add Product
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

      </main>
    </div>
  )
}