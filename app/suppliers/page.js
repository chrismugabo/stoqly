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
  const [editingProduct, setEditingProduct] = useState(null)
  const [editingSupplier, setEditingSupplier] = useState(null)
  const [newSupplier, setNewSupplier] = useState({ name: '', phone: '', category: 'Vegetables', notes: '' })
  const [newProduct, setNewProduct] = useState({ name: '', unit: 'kg', current_price: '', alert_threshold: 10 })
  const [loading, setLoading] = useState(false)
  const [isMobile, setIsMobile] = useState(false)
  const [productCounts, setProductCounts] = useState({})

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
    if (data) {
      setSuppliers(data)
      // Fetch product counts for all suppliers
      const counts = {}
      await Promise.all(data.map(async (s) => {
        const { count } = await supabase.from('products').select('*', { count: 'exact', head: true }).eq('supplier_id', s.id)
        counts[s.id] = count || 0
      }))
      setProductCounts(counts)
    }
  }

  async function fetchProducts(supplierId) {
    const { data } = await supabase.from('products').select('*').eq('supplier_id', supplierId).order('name')
    if (data) setProducts(p => ({ ...p, [supplierId]: data }))
  }

  function toggleExpand(supplier) {
    if (expandedId === supplier.id) {
      setExpandedId(null)
      setAddProductFor(null)
      setEditingProduct(null)
    } else {
      setExpandedId(supplier.id)
      fetchProducts(supplier.id)
    }
  }

  async function saveSupplier() {
    if (!newSupplier.name.trim()) return
    setLoading(true)
    const { data } = await supabase.from('suppliers').insert([{ ...newSupplier, user_id: user.id }]).select()
    if (data) {
      setSuppliers(s => [...s, data[0]])
      setProductCounts(c => ({ ...c, [data[0].id]: 0 }))
      setShowAddSupplier(false)
      setNewSupplier({ name: '', phone: '', category: 'Vegetables', notes: '' })
    }
    setLoading(false)
  }

  async function updateSupplier() {
    if (!editingSupplier.name.trim()) return
    setLoading(true)
    const { data } = await supabase.from('suppliers')
      .update({ name: editingSupplier.name, phone: editingSupplier.phone, category: editingSupplier.category, notes: editingSupplier.notes })
      .eq('id', editingSupplier.id).select()
    if (data) {
      setSuppliers(s => s.map(x => x.id === editingSupplier.id ? data[0] : x))
      setEditingSupplier(null)
    }
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
      setProductCounts(c => ({ ...c, [supplierId]: (c[supplierId] || 0) + 1 }))
      setNewProduct({ name: '', unit: 'kg', current_price: '', alert_threshold: 10 })
      setAddProductFor(null)
    }
    setLoading(false)
  }

  async function updateProduct() {
    if (!editingProduct.name.trim() || !editingProduct.current_price) return
    setLoading(true)
    const { data } = await supabase.from('products')
      .update({ name: editingProduct.name, unit: editingProduct.unit, current_price: parseFloat(editingProduct.current_price), alert_threshold: parseFloat(editingProduct.alert_threshold) })
      .eq('id', editingProduct.id).select()
    if (data) {
      const supplierId = editingProduct.supplier_id
      setProducts(p => ({ ...p, [supplierId]: p[supplierId].map(x => x.id === editingProduct.id ? data[0] : x) }))
      setEditingProduct(null)
    }
    setLoading(false)
  }

  async function deleteProduct(supplierId, productId) {
    await supabase.from('products').delete().eq('id', productId)
    setProducts(p => ({ ...p, [supplierId]: p[supplierId].filter(x => x.id !== productId) }))
    setProductCounts(c => ({ ...c, [supplierId]: Math.max((c[supplierId] || 1) - 1, 0) }))
  }

  if (!user) return null

  const totalProducts = Object.values(productCounts).reduce((a, b) => a + b, 0)

  const inputStyle = {
    width: '100%', padding: '10px 14px', border: '1.5px solid #e5e7eb',
    borderRadius: '10px', fontSize: '14px', outline: 'none',
    background: 'white', boxSizing: 'border-box', color: '#111',
    transition: 'border-color 0.15s'
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F0EDE8' }}>
      <Navbar user={user} />

      <main style={{ flex: 1, overflowX: 'hidden', padding: isMobile ? '16px' : '24px', paddingBottom: isMobile ? '100px' : '40px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '24px', gap: '12px' }}>
          <div>
            <h1 style={{ fontSize: isMobile ? '22px' : '26px', fontWeight: 800, color: '#111', fontFamily: clash, marginBottom: '4px' }}>Suppliers</h1>
            <p style={{ color: '#9ca3af', fontSize: '13px' }}>
              {suppliers.length} suppliers · {totalProducts} products tracked
            </p>
          </div>
          <button
            onClick={() => { setShowAddSupplier(!showAddSupplier); setEditingSupplier(null) }}
            style={{ background: showAddSupplier ? '#f3f4f6' : '#0C3D22', color: showAddSupplier ? '#374151' : 'white', border: 'none', borderRadius: '12px', padding: '11px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, whiteSpace: 'nowrap', flexShrink: 0, transition: 'all 0.15s', boxShadow: showAddSupplier ? 'none' : '0 4px 12px rgba(12,61,34,0.25)' }}
          >
            {showAddSupplier ? '✕ Cancel' : '+ Add Supplier'}
          </button>
        </div>

        {/* Stats bar */}
        {suppliers.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', marginBottom: '20px' }}>
            {[
              { label: 'Suppliers', value: suppliers.length, icon: '🏪', color: '#1A6B3C', bg: '#f0fdf4', border: '#bbf7d0' },
              { label: 'Products', value: totalProducts, icon: '📦', color: '#2563eb', bg: '#eff6ff', border: '#bfdbfe' },
              { label: 'Categories', value: [...new Set(suppliers.map(s => s.category))].length, icon: '🏷️', color: '#7c3aed', bg: '#faf5ff', border: '#e9d5ff' },
            ].map((s, i) => (
              <div key={i} style={{ background: s.bg, border: `1px solid ${s.border}`, borderRadius: '14px', padding: '14px 16px', display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{ width: '36px', height: '36px', background: 'white', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', border: `1px solid ${s.border}`, flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <p style={{ fontSize: '20px', fontWeight: 800, color: s.color, fontFamily: clash, lineHeight: 1 }}>{s.value}</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{s.label}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Supplier Form */}
        {showAddSupplier && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '22px', marginBottom: '16px', border: '1.5px solid #1A6B3C', boxShadow: '0 4px 20px rgba(26,107,60,0.1)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px', color: '#111', fontFamily: clash }}>New Supplier</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px', marginBottom: '14px' }}>
              {[
                { label: 'Name *', key: 'name', placeholder: 'e.g. Fresh Greens Market' },
                { label: 'Phone', key: 'phone', placeholder: '+250 7XX XXX XXX' },
                { label: 'Notes', key: 'notes', placeholder: 'Optional notes' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>{f.label}</label>
                  <input value={newSupplier[f.key]} onChange={e => setNewSupplier(p => ({ ...p, [f.key]: e.target.value }))} placeholder={f.placeholder} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#1A6B3C'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>Category</label>
                <select value={newSupplier.category} onChange={e => setNewSupplier(p => ({ ...p, category: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {Object.keys(categoryConfig).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={saveSupplier} disabled={loading} style={{ background: '#0C3D22', color: 'white', border: 'none', borderRadius: '10px', padding: '11px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, boxShadow: '0 4px 12px rgba(12,61,34,0.2)' }}>
                {loading ? 'Saving...' : '✓ Save Supplier'}
              </button>
              <button onClick={() => setShowAddSupplier(false)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', padding: '11px 16px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Edit Supplier Form */}
        {editingSupplier && (
          <div style={{ background: 'white', borderRadius: '20px', padding: '22px', marginBottom: '16px', border: '1.5px solid #2563eb', boxShadow: '0 4px 20px rgba(37,99,235,0.1)' }}>
            <h3 style={{ fontWeight: 700, fontSize: '15px', marginBottom: '16px', color: '#111', fontFamily: clash }}>Edit Supplier</h3>
            <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(2, 1fr)', gap: '12px', marginBottom: '14px' }}>
              {[
                { label: 'Name *', key: 'name' },
                { label: 'Phone', key: 'phone' },
                { label: 'Notes', key: 'notes' },
              ].map(f => (
                <div key={f.key}>
                  <label style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>{f.label}</label>
                  <input value={editingSupplier[f.key] || ''} onChange={e => setEditingSupplier(p => ({ ...p, [f.key]: e.target.value }))} style={inputStyle}
                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                </div>
              ))}
              <div>
                <label style={{ fontSize: '11px', fontWeight: 600, color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'block', marginBottom: '5px' }}>Category</label>
                <select value={editingSupplier.category} onChange={e => setEditingSupplier(p => ({ ...p, category: e.target.value }))} style={{ ...inputStyle, cursor: 'pointer' }}>
                  {Object.keys(categoryConfig).map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={updateSupplier} disabled={loading} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', padding: '11px 20px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: clash }}>
                {loading ? 'Saving...' : '✓ Save Changes'}
              </button>
              <button onClick={() => setEditingSupplier(null)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', padding: '11px 16px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
            </div>
          </div>
        )}

        {/* Empty state */}
        {suppliers.length === 0 && !showAddSupplier && (
          <div style={{ background: 'white', borderRadius: '24px', padding: '64px 24px', textAlign: 'center', border: '1px solid #ede9e4', boxShadow: '0 2px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ width: '72px', height: '72px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '24px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '32px', margin: '0 auto 20px', border: '1px solid #bbf7d0' }}>🏪</div>
            <p style={{ fontWeight: 800, fontSize: '20px', color: '#111', marginBottom: '8px', fontFamily: clash }}>No suppliers yet</p>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginBottom: '24px', maxWidth: '280px', margin: '0 auto 24px', lineHeight: 1.6 }}>Add your first supplier to start tracking prices and placing orders</p>
            <button onClick={() => setShowAddSupplier(true)} style={{ background: '#0C3D22', color: 'white', border: 'none', borderRadius: '14px', padding: '13px 28px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, boxShadow: '0 4px 16px rgba(12,61,34,0.25)' }}>
              + Add First Supplier
            </button>
          </div>
        )}

        {/* Supplier Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {suppliers.map((supplier) => {
            const config = categoryConfig[supplier.category] || categoryConfig.Other
            const isExpanded = expandedId === supplier.id
            const supplierProducts = products[supplier.id] || []
            const count = productCounts[supplier.id] || 0

            return (
              <div key={supplier.id} style={{ background: 'white', borderRadius: '20px', overflow: 'hidden', border: isExpanded ? '1.5px solid #1A6B3C' : '1px solid #ede9e4', transition: 'all 0.2s', boxShadow: isExpanded ? '0 8px 28px rgba(26,107,60,0.1)' : '0 2px 8px rgba(0,0,0,0.04)' }}>

                {/* Supplier Row */}
                <div style={{ display: 'flex', alignItems: 'center', padding: isMobile ? '14px 16px' : '16px 20px', gap: '12px' }}>
                  <div onClick={() => toggleExpand(supplier)} style={{ display: 'flex', alignItems: 'center', gap: '14px', flex: 1, cursor: 'pointer', minWidth: 0 }}>
                    <div style={{ width: '48px', height: '48px', background: config.bg, borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', border: `1px solid ${config.border}`, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                      {config.icon}
                    </div>
                    <div style={{ minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                        <p style={{ fontWeight: 700, fontSize: '15px', color: '#111', fontFamily: clash }}>{supplier.name}</p>
                        <span style={{ background: config.badge, color: config.badgeText, fontSize: '10px', fontWeight: 700, padding: '2px 8px', borderRadius: '20px', flexShrink: 0 }}>{supplier.category}</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginTop: '3px' }}>
                        <p style={{ fontSize: '12px', color: '#9ca3af' }}>{supplier.phone || 'No phone'}</p>
                        <span style={{ fontSize: '11px', color: '#9ca3af' }}>·</span>
                        <p style={{ fontSize: '12px', color: '#9ca3af' }}>{count} product{count !== 1 ? 's' : ''}</p>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexShrink: 0 }}>
                    {!isMobile && (
                      <>
                        <button onClick={e => { e.stopPropagation(); setEditingSupplier(supplier); setShowAddSupplier(false) }}
                          style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#dbeafe'}
                          onMouseLeave={e => e.currentTarget.style.background = '#eff6ff'}
                        >Edit</button>
                        <button onClick={e => { e.stopPropagation(); deleteSupplier(supplier.id) }}
                          style={{ background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '8px', padding: '6px 12px', fontSize: '12px', cursor: 'pointer', fontWeight: 600, transition: 'all 0.15s' }}
                          onMouseEnter={e => e.currentTarget.style.background = '#fee2e2'}
                          onMouseLeave={e => e.currentTarget.style.background = '#fef2f2'}
                        >Delete</button>
                      </>
                    )}
                    <div onClick={() => toggleExpand(supplier)} style={{ width: '32px', height: '32px', borderRadius: '10px', background: isExpanded ? '#f0fdf4' : '#f9fafb', border: `1px solid ${isExpanded ? '#bbf7d0' : '#e5e7eb'}`, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', transition: 'all 0.2s' }}>
                      <span style={{ display: 'inline-block', transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.25s', fontSize: '14px', color: isExpanded ? '#1A6B3C' : '#6b7280' }}>⌄</span>
                    </div>
                  </div>
                </div>

                {/* Expanded Products */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid #f0fdf4', background: '#fafff9' }}>
                    <div style={{ padding: isMobile ? '16px' : '18px 20px' }}>

                      {/* Mobile edit/delete */}
                      {isMobile && (
                        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                          <button onClick={() => { setEditingSupplier(supplier); setShowAddSupplier(false) }}
                            style={{ flex: 1, background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '10px', padding: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                            Edit Supplier
                          </button>
                          <button onClick={() => deleteSupplier(supplier.id)}
                            style={{ flex: 1, background: '#fef2f2', border: '1px solid #fecaca', color: '#dc2626', borderRadius: '10px', padding: '10px', fontSize: '13px', cursor: 'pointer', fontWeight: 600 }}>
                            Delete
                          </button>
                        </div>
                      )}

                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
                        <p style={{ fontSize: '11px', fontWeight: 700, color: '#1A6B3C', textTransform: 'uppercase', letterSpacing: '0.8px' }}>
                          Products ({supplierProducts.length})
                        </p>
                      </div>

                      {supplierProducts.length === 0 && !addProductFor && (
                        <div style={{ padding: '20px', textAlign: 'center', background: 'white', borderRadius: '14px', border: '1px dashed #bbf7d0', marginBottom: '12px' }}>
                          <p style={{ color: '#9ca3af', fontSize: '13px' }}>No products yet — add one below</p>
                        </div>
                      )}

                      {supplierProducts.map((product) => (
                        <div key={product.id}>
                          {editingProduct?.id === product.id ? (
                            <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1.5px solid #2563eb', marginBottom: '8px', boxShadow: '0 2px 8px rgba(37,99,235,0.08)' }}>
                              <p style={{ fontSize: '12px', fontWeight: 700, color: '#2563eb', marginBottom: '12px', fontFamily: clash }}>Edit Product</p>
                              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr 1fr' : 'repeat(4, 1fr)', gap: '10px', marginBottom: '12px' }}>
                                <div style={{ gridColumn: isMobile ? 'span 2' : 'span 1' }}>
                                  <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px' }}>NAME *</label>
                                  <input value={editingProduct.name} onChange={e => setEditingProduct(p => ({ ...p, name: e.target.value }))} style={{ ...inputStyle, padding: '9px 12px', fontSize: '13px' }}
                                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                                </div>
                                <div>
                                  <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px' }}>UNIT</label>
                                  <select value={editingProduct.unit} onChange={e => setEditingProduct(p => ({ ...p, unit: e.target.value }))} style={{ ...inputStyle, padding: '9px 12px', fontSize: '13px', cursor: 'pointer' }}>
                                    {['kg', 'g', 'L', 'ml', 'pcs', 'box', 'bag', 'crate'].map(u => <option key={u}>{u}</option>)}
                                  </select>
                                </div>
                                <div>
                                  <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px' }}>PRICE (RWF) *</label>
                                  <input type="number" value={editingProduct.current_price} onChange={e => setEditingProduct(p => ({ ...p, current_price: e.target.value }))} style={{ ...inputStyle, padding: '9px 12px', fontSize: '13px' }}
                                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                                </div>
                                <div>
                                  <label style={{ fontSize: '10px', fontWeight: 600, color: '#6b7280', display: 'block', marginBottom: '4px' }}>ALERT %</label>
                                  <input type="number" value={editingProduct.alert_threshold} onChange={e => setEditingProduct(p => ({ ...p, alert_threshold: e.target.value }))} style={{ ...inputStyle, padding: '9px 12px', fontSize: '13px' }}
                                    onFocus={e => e.target.style.borderColor = '#2563eb'} onBlur={e => e.target.style.borderColor = '#e5e7eb'} />
                                </div>
                              </div>
                              <div style={{ background: '#eff6ff', borderRadius: '8px', padding: '10px 12px', marginBottom: '12px', display: 'flex', gap: '8px' }}>
                                <span>💡</span>
                                <p style={{ fontSize: '12px', color: '#2563eb', lineHeight: 1.5 }}>Update the price then place a new order to trigger price history tracking and alerts.</p>
                              </div>
                              <div style={{ display: 'flex', gap: '8px' }}>
                                <button onClick={updateProduct} disabled={loading} style={{ background: '#2563eb', color: 'white', border: 'none', borderRadius: '10px', padding: '10px 16px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: clash }}>
                                  {loading ? 'Saving...' : '✓ Save Changes'}
                                </button>
                                <button onClick={() => setEditingProduct(null)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                              </div>
                            </div>
                          ) : (
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '11px 14px', background: 'white', borderRadius: '12px', marginBottom: '8px', border: '1px solid #e9fce9', boxShadow: '0 1px 4px rgba(0,0,0,0.04)', transition: 'all 0.15s' }}
                              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'}
                              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 1px 4px rgba(0,0,0,0.04)'}
                            >
                              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '8px', height: '8px', background: '#25D366', borderRadius: '50%', flexShrink: 0 }}></div>
                                <div>
                                  <p style={{ fontWeight: 600, fontSize: '13px', color: '#111', fontFamily: clash }}>{product.name}</p>
                                  <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '1px' }}>per {product.unit} · alert at {product.alert_threshold}%</p>
                                </div>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <p style={{ fontWeight: 700, fontSize: '13px', color: '#1A6B3C', fontFamily: clash }}>RWF {Number(product.current_price).toLocaleString()}</p>
                                <button onClick={() => setEditingProduct({ ...product })}
                                  style={{ background: '#eff6ff', border: '1px solid #bfdbfe', color: '#2563eb', borderRadius: '7px', padding: '4px 9px', fontSize: '11px', cursor: 'pointer', fontWeight: 600 }}>
                                  Edit
                                </button>
                                <button onClick={() => deleteProduct(supplier.id, product.id)}
                                  style={{ background: 'none', border: 'none', color: '#d1d5db', cursor: 'pointer', fontSize: '18px', padding: '0 2px', transition: 'color 0.15s', lineHeight: 1 }}
                                  onMouseEnter={e => e.currentTarget.style.color = '#ef4444'}
                                  onMouseLeave={e => e.currentTarget.style.color = '#d1d5db'}
                                >×</button>
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add Product Form */}
                      {addProductFor === supplier.id ? (
                        <div style={{ background: 'white', borderRadius: '14px', padding: '16px', border: '1.5px solid #1A6B3C', marginTop: '8px', boxShadow: '0 2px 8px rgba(26,107,60,0.08)' }}>
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
                              {loading ? 'Saving...' : '✓ Save Product'}
                            </button>
                            <button onClick={() => setAddProductFor(null)} style={{ background: '#f3f4f6', color: '#374151', border: 'none', borderRadius: '10px', padding: '10px 14px', fontSize: '13px', cursor: 'pointer' }}>Cancel</button>
                          </div>
                        </div>
                      ) : (
                        <button onClick={() => setAddProductFor(supplier.id)}
                          style={{ width: '100%', background: 'white', border: '1.5px dashed #bbf7d0', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: 600, color: '#1A6B3C', cursor: 'pointer', marginTop: '4px', fontFamily: clash, transition: 'all 0.15s' }}
                          onMouseEnter={e => { e.currentTarget.style.background = '#f0fdf4'; e.currentTarget.style.borderColor = '#1A6B3C' }}
                          onMouseLeave={e => { e.currentTarget.style.background = 'white'; e.currentTarget.style.borderColor = '#bbf7d0' }}
                        >
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