 'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Navbar from '../components/Navbar'

export default function Suppliers() {
  const [user, setUser] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [expandedSupplier, setExpandedSupplier] = useState(null)
  const [products, setProducts] = useState({})
  const [showAddSupplier, setShowAddSupplier] = useState(false)
  const [showAddProduct, setShowAddProduct] = useState(null)
  const [editingSupplier, setEditingSupplier] = useState(null)

  const [supplierForm, setSupplierForm] = useState({ name: '', phone: '', category: '', notes: '' })
  const [productForm, setProductForm] = useState({ name: '', unit: '', current_price: '', alert_threshold: 10 })

  useEffect(() => { initialize() }, [])

  async function initialize() {
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { window.location.href = '/login'; return }
    setUser(user)
    fetchSuppliers()
  }

  async function fetchSuppliers() {
    const { data } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false })
    setSuppliers(data || [])
  }

  async function fetchProducts(supplierId) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('supplier_id', supplierId)
      .order('name')
    setProducts(prev => ({ ...prev, [supplierId]: data || [] }))
  }

  async function handleSupplierSubmit(e) {
    e.preventDefault()
    if (!supplierForm.name.trim()) return
    if (editingSupplier) {
      await supabase.from('suppliers').update(supplierForm).eq('id', editingSupplier)
    } else {
      await supabase.from('suppliers').insert({ ...supplierForm, user_id: user.id })
    }
    setSupplierForm({ name: '', phone: '', category: '', notes: '' })
    setShowAddSupplier(false)
    setEditingSupplier(null)
    fetchSuppliers()
  }

  async function handleDeleteSupplier(id) {
    if (!confirm('Delete this supplier and all their products?')) return
    await supabase.from('suppliers').delete().eq('id', id)
    fetchSuppliers()
  }

  async function handleProductSubmit(e, supplierId) {
    e.preventDefault()
    await supabase.from('products').insert({
      ...productForm,
      current_price: Number(productForm.current_price),
      alert_threshold: Number(productForm.alert_threshold),
      supplier_id: supplierId,
      user_id: user.id
    })
    setProductForm({ name: '', unit: '', current_price: '', alert_threshold: 10 })
    setShowAddProduct(null)
    fetchProducts(supplierId)
  }

  async function handleDeleteProduct(productId, supplierId) {
    await supabase.from('products').delete().eq('id', productId)
    fetchProducts(supplierId)
  }

  function toggleSupplier(supplierId) {
    if (expandedSupplier === supplierId) {
      setExpandedSupplier(null)
    } else {
      setExpandedSupplier(supplierId)
      fetchProducts(supplierId)
    }
  }

  const categoryColors = {
    'Meat': '#fef2f2', 'Vegetables': '#f0fdf4',
    'Oil': '#fffbeb', 'Dairy': '#eff6ff',
    'Beverages': '#faf5ff', 'Spices': '#fff7ed',
  }

  const categoryEmojis = {
    'Meat': '🥩', 'Vegetables': '🥦', 'Oil': '🛢️',
    'Dairy': '🥛', 'Beverages': '🍺', 'Spices': '🧂',
  }

  if (!user) return null

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }} className="bg-[#F7F4EF]">
      <Navbar user={user} />

      <main style={{ flex: 1, overflowX: 'hidden', padding: '32px' }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '32px' }}>
          <div>
            <h1 style={{ fontSize: '28px', fontWeight: 800, color: '#111' }}>Suppliers & Products</h1>
            <p style={{ color: '#9ca3af', fontSize: '14px', marginTop: '4px' }}>Click a supplier to see and manage their products</p>
          </div>
          <button
            onClick={() => { setShowAddSupplier(true); setEditingSupplier(null); setSupplierForm({ name: '', phone: '', category: '', notes: '' }) }}
            style={{ background: '#1A6B3C', color: 'white', fontWeight: 700, padding: '12px 20px', borderRadius: '12px', border: 'none', cursor: 'pointer', fontSize: '14px', transition: 'opacity 0.15s' }}
            onMouseEnter={e => e.target.style.opacity = '0.85'}
            onMouseLeave={e => e.target.style.opacity = '1'}
          >
            + Add Supplier
          </button>
        </div>

        {/* Add Supplier Form */}
        {showAddSupplier && (
          <div className="slide-down" style={{ background: 'white', borderRadius: '16px', padding: '24px', marginBottom: '24px', border: '2px solid #1A6B3C' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '16px', fontSize: '16px' }}>
              {editingSupplier ? '✏️ Edit Supplier' : '+ New Supplier'}
            </h3>
            <form onSubmit={handleSupplierSubmit}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '16px' }}>
                <input value={supplierForm.name} onChange={e => setSupplierForm(p => ({ ...p, name: e.target.value }))} placeholder="Supplier name *" style={{ padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none', transition: 'border 0.15s' }} required />
                <input value={supplierForm.phone} onChange={e => setSupplierForm(p => ({ ...p, phone: e.target.value }))} placeholder="Phone (+250...)" style={{ padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                <input value={supplierForm.category} onChange={e => setSupplierForm(p => ({ ...p, category: e.target.value }))} placeholder="Category (Meat, Vegetables...)" style={{ padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
                <input value={supplierForm.notes} onChange={e => setSupplierForm(p => ({ ...p, notes: e.target.value }))} placeholder="Notes (optional)" style={{ padding: '10px 14px', border: '1.5px solid #e5e7eb', borderRadius: '10px', fontSize: '14px', outline: 'none' }} />
              </div>
              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" style={{ background: '#1A6B3C', color: 'white', fontWeight: 700, padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Save Supplier</button>
                <button type="button" onClick={() => setShowAddSupplier(false)} style={{ background: '#f3f4f6', color: '#6b7280', fontWeight: 600, padding: '10px 20px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '14px' }}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* Empty state */}
        {suppliers.length === 0 && (
          <div style={{ background: 'white', borderRadius: '16px', padding: '64px', textAlign: 'center' }}>
            <p style={{ fontSize: '48px', marginBottom: '16px' }}>🏪</p>
            <p style={{ fontWeight: 700, fontSize: '18px', color: '#111', marginBottom: '8px' }}>No suppliers yet</p>
            <p style={{ color: '#9ca3af', fontSize: '14px' }}>Add your first supplier to get started</p>
          </div>
        )}

        {/* Supplier Cards */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {suppliers.map((supplier, index) => {
            const isExpanded = expandedSupplier === supplier.id
            const emoji = categoryEmojis[supplier.category] || '🏪'
            const bg = categoryColors[supplier.category] || '#f9fafb'
            const supplierProducts = products[supplier.id] || []

            return (
              <div
                key={supplier.id}
                className="fade-in-row"
                style={{
                  background: 'white',
                  borderRadius: '16px',
                  overflow: 'hidden',
                  border: isExpanded ? '1.5px solid #1A6B3C' : '1px solid #f0f0f0',
                  boxShadow: isExpanded ? '0 4px 24px rgba(26,107,60,0.1)' : '0 1px 4px rgba(0,0,0,0.04)',
                  transition: 'all 0.25s ease',
                  animationDelay: `${index * 0.05}s`,
                  animationFillMode: 'both'
                }}
              >
                {/* Supplier Row */}
                <div
                  onClick={() => toggleSupplier(supplier.id)}
                  style={{ display: 'flex', alignItems: 'center', padding: '16px 20px', cursor: 'pointer', gap: '16px' }}
                >
                  <div style={{ width: '44px', height: '44px', background: bg, borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', flexShrink: 0 }}>
                    {emoji}
                  </div>
                  <div style={{ flex: 1 }}>
                    <p style={{ fontWeight: 700, fontSize: '15px', color: '#111' }}>{supplier.name}</p>
                    <p style={{ fontSize: '13px', color: '#9ca3af', marginTop: '2px' }}>
                      {supplier.category && `${supplier.category} · `}{supplier.phone}
                    </p>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <button
                      onClick={e => { e.stopPropagation(); setEditingSupplier(supplier.id); setSupplierForm({ name: supplier.name, phone: supplier.phone, category: supplier.category, notes: supplier.notes }); setShowAddSupplier(true) }}
                      style={{ fontSize: '12px', padding: '5px 10px', borderRadius: '8px', border: '1px solid #e5e7eb', background: 'white', cursor: 'pointer', color: '#6b7280', transition: 'all 0.15s' }}
                    >Edit</button>
                    <button
                      onClick={e => { e.stopPropagation(); handleDeleteSupplier(supplier.id) }}
                      style={{ fontSize: '12px', padding: '5px 10px', borderRadius: '8px', border: '1px solid #fecaca', background: 'white', cursor: 'pointer', color: '#ef4444', transition: 'all 0.15s' }}
                    >Delete</button>
                    <span style={{
                      fontSize: '12px',
                      color: '#9ca3af',
                      marginLeft: '4px',
                      display: 'inline-block',
                      transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                      transition: 'transform 0.25s ease'
                    }}>▼</span>
                  </div>
                </div>

                {/* Products — animated expand */}
                {isExpanded && (
                  <div className="slide-down" style={{ borderTop: '1px solid #f3f4f6', background: '#fafafa' }}>

                    {supplierProducts.length === 0 && showAddProduct !== supplier.id && (
                      <div style={{ padding: '20px 24px', textAlign: 'center' }}>
                        <p style={{ color: '#9ca3af', fontSize: '13px' }}>No products yet — add one below</p>
                      </div>
                    )}

                    {supplierProducts.map((product, pIndex) => (
                      <div
                        key={product.id}
                        className="fade-in-row"
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                          padding: '12px 20px', borderBottom: '1px solid #f0f0f0',
                          animationDelay: `${pIndex * 0.06}s`,
                          animationFillMode: 'both'
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <div style={{ width: '8px', height: '8px', background: '#1A6B3C', borderRadius: '50%', flexShrink: 0 }}></div>
                          <div>
                            <p style={{ fontWeight: 600, fontSize: '14px', color: '#111' }}>{product.name}</p>
                            <p style={{ fontSize: '12px', color: '#9ca3af' }}>{product.unit} · Alert at {product.alert_threshold}%</p>
                          </div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <p style={{ fontWeight: 700, fontSize: '14px', color: '#1A6B3C' }}>RWF {Number(product.current_price).toLocaleString()}</p>
                          <button
                            onClick={() => handleDeleteProduct(product.id, supplier.id)}
                            style={{ fontSize: '11px', padding: '4px 8px', borderRadius: '6px', border: '1px solid #fecaca', background: 'white', cursor: 'pointer', color: '#ef4444' }}
                          >✕</button>
                        </div>
                      </div>
                    ))}

                    {/* Add Product */}
                    {showAddProduct === supplier.id ? (
                      <form onSubmit={e => handleProductSubmit(e, supplier.id)} className="slide-down" style={{ padding: '16px 20px', display: 'flex', gap: '10px', flexWrap: 'wrap', alignItems: 'center', background: '#f0fdf4' }}>
                        <input value={productForm.name} onChange={e => setProductForm(p => ({ ...p, name: e.target.value }))} placeholder="Product name *" style={{ padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', flex: 1, minWidth: '140px' }} required />
                        <input value={productForm.unit} onChange={e => setProductForm(p => ({ ...p, unit: e.target.value }))} placeholder="Unit (kg, L...)" style={{ padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', width: '100px' }} />
                        <input value={productForm.current_price} onChange={e => setProductForm(p => ({ ...p, current_price: e.target.value }))} placeholder="Price (RWF) *" type="number" style={{ padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', width: '120px' }} required />
                        <input value={productForm.alert_threshold} onChange={e => setProductForm(p => ({ ...p, alert_threshold: e.target.value }))} placeholder="Alert %" type="number" style={{ padding: '8px 12px', border: '1.5px solid #e5e7eb', borderRadius: '8px', fontSize: '13px', outline: 'none', width: '80px' }} />
                        <button type="submit" style={{ background: '#1A6B3C', color: 'white', fontWeight: 700, padding: '8px 16px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Add</button>
                        <button type="button" onClick={() => setShowAddProduct(null)} style={{ background: '#f3f4f6', color: '#6b7280', fontWeight: 600, padding: '8px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', fontSize: '13px' }}>Cancel</button>
                      </form>
                    ) : (
                      <div style={{ padding: '14px 20px' }}>
                        <button
                          onClick={() => setShowAddProduct(supplier.id)}
                          style={{ fontSize: '13px', color: '#1A6B3C', fontWeight: 700, background: 'none', border: 'none', cursor: 'pointer' }}
                        >+ Add Product</button>
                      </div>
                    )}
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