'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'
import Navbar from '@/app/components/Navbar'

export default function ProductsPage() {
  const [user, setUser] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState({ name: '', unit: '', current_price: '', alert_threshold: 10, supplier_id: '' })
  const [editingId, setEditingId] = useState(null)

  useEffect(() => { loadData() }, [])

  async function loadData() {
    setLoading(true)
    const { data: authData } = await supabase.auth.getUser()
    const currentUser = authData?.user
    if (!currentUser) { window.location.href = '/login'; return }
    setUser(currentUser)

    const { data: suppliersData } = await supabase.from('suppliers').select('id, name').order('name')
    const { data: productsData } = await supabase
      .from('products')
      .select('id, name, unit, current_price, alert_threshold, supplier_id, suppliers(name)')
      .order('created_at', { ascending: false })

    setSuppliers(suppliersData || [])
    setProducts(productsData || [])
    setLoading(false)
  }

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  function resetForm() {
    setForm({ name: '', unit: '', current_price: '', alert_threshold: 10, supplier_id: '' })
    setEditingId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()
    if (!form.name || !form.supplier_id || !form.current_price) return

    const payload = {
      name: form.name,
      unit: form.unit,
      current_price: Number(form.current_price),
      alert_threshold: Number(form.alert_threshold),
      supplier_id: form.supplier_id,
      user_id: user.id
    }

    if (editingId) {
      await supabase.from('products').update(payload).eq('id', editingId)
    } else {
      await supabase.from('products').insert(payload)
    }

    resetForm()
    loadData()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    loadData()
  }

  function startEdit(product) {
    setEditingId(product.id)
    setForm({
      name: product.name,
      unit: product.unit || '',
      current_price: product.current_price,
      alert_threshold: product.alert_threshold,
      supplier_id: product.supplier_id
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-[#F7F4EF]">
      <Navbar user={user} />

      <div className="max-w-6xl mx-auto px-6 py-10">

        {/* Header */}
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900">Products</h2>
          <p className="text-gray-500 mt-1">Track pricing and stay ahead of cost changes.</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          {/* Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 sticky top-24">
              <h3 className="font-bold text-gray-900 mb-5">
                {editingId ? '✏️ Edit Product' : '+ Add Product'}
              </h3>

              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <input
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product name"
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#1A6B3C] outline-none transition"
                  required
                />

                <select
                  name="supplier_id"
                  value={form.supplier_id}
                  onChange={handleChange}
                  className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#1A6B3C] outline-none transition"
                  required
                >
                  <option value="">Select supplier</option>
                  {suppliers.map(s => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>

                <div className="grid grid-cols-2 gap-3">
                  <input
                    name="unit"
                    value={form.unit}
                    onChange={handleChange}
                    placeholder="Unit (kg, L...)"
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#1A6B3C] outline-none transition"
                  />
                  <input
                    name="current_price"
                    value={form.current_price}
                    onChange={handleChange}
                    placeholder="Price (RWF)"
                    type="number"
                    className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 focus:border-[#1A6B3C] outline-none transition"
                    required
                  />
                </div>

                <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-3">
                  <span className="text-sm text-gray-500">Alert if price changes by</span>
                  <input
                    name="alert_threshold"
                    value={form.alert_threshold}
                    onChange={handleChange}
                    type="number"
                    className="w-14 text-center border border-gray-200 rounded-lg px-2 py-1 text-sm outline-none focus:border-[#1A6B3C]"
                  />
                  <span className="text-sm text-gray-500">%</span>
                </div>

                <button
                  type="submit"
                  className="bg-[#1A6B3C] text-white rounded-xl py-3 font-semibold hover:opacity-90 transition"
                >
                  {editingId ? 'Save Changes' : 'Add Product'}
                </button>

                {editingId && (
                  <button type="button" onClick={resetForm} className="text-sm text-gray-400 hover:text-gray-600 transition">
                    Cancel
                  </button>
                )}
              </form>
            </div>
          </div>

          {/* Product List */}
          <div className="lg:col-span-2">
            {loading && (
              <div className="text-center py-12 text-gray-400">Loading products...</div>
            )}

            {!loading && products.length === 0 && (
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-12 text-center">
                <p className="text-4xl mb-3">📦</p>
                <p className="font-semibold text-gray-700 mb-1">No products yet</p>
                <p className="text-gray-400 text-sm">Add your first product using the form</p>
              </div>
            )}

            <div className="flex flex-col gap-3">
              {products.map(product => (
                <div key={product.id} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 flex items-center justify-between hover:shadow-md transition">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center text-lg">📦</div>
                    <div>
                      <p className="font-semibold text-gray-900">{product.name}</p>
                      <p className="text-sm text-gray-400 mt-0.5">{product.suppliers?.name} · {product.unit}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="font-bold text-gray-900">RWF {Number(product.current_price).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">Alert at {product.alert_threshold}% change</p>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => startEdit(product)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-gray-200 hover:bg-gray-50 transition"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="px-3 py-1.5 text-xs font-semibold rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}