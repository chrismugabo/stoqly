'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

export default function ProductsPage() {
  const [user, setUser] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)

  const [form, setForm] = useState({
    name: '',
    unit: '',
    current_price: '',
    alert_threshold: 10,
    supplier_id: ''
  })

  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    loadData()
  }, [])

  async function loadData() {
    setLoading(true)

    const { data: authData } = await supabase.auth.getUser()
    const currentUser = authData?.user

    if (!currentUser) {
      window.location.href = '/login'
      return
    }

    setUser(currentUser)

    const { data: suppliersData } = await supabase
      .from('suppliers')
      .select('id, name')
      .order('name')

    const { data: productsData } = await supabase
      .from('products')
      .select(`
        id,
        name,
        unit,
        current_price,
        alert_threshold,
        supplier_id,
        suppliers ( name )
      `)
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
    setForm({
      name: '',
      unit: '',
      current_price: '',
      alert_threshold: 10,
      supplier_id: ''
    })
    setEditingId(null)
  }

  async function handleSubmit(e) {
    e.preventDefault()

    if (!form.name || !form.supplier_id || !form.current_price) {
      alert('Please fill required fields')
      return
    }

    const payload = {
      name: form.name,
      unit: form.unit,
      current_price: Number(form.current_price),
      alert_threshold: Number(form.alert_threshold),
      supplier_id: form.supplier_id,
      user_id: user.id
    }

    if (editingId) {
      await supabase
        .from('products')
        .update(payload)
        .eq('id', editingId)
    } else {
      await supabase
        .from('products')
        .insert(payload)
    }

    resetForm()
    loadData()
  }

  async function handleDelete(id) {
    if (!confirm('Delete this product?')) return

    await supabase
      .from('products')
      .delete()
      .eq('id', id)

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
  }

  return (
    <div className="min-h-screen bg-gray-100">

      {/* HEADER */}
      <div className="bg-gradient-to-r from-gray-900 via-black to-gray-800 text-white py-10">
        <div className="max-w-5xl mx-auto px-6">
          <h1 className="text-4xl font-bold tracking-tight">Products</h1>
          <p className="text-gray-400 mt-3 text-sm">
            Track pricing, manage suppliers, and stay ahead of cost changes.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-10 space-y-10">

        {/* FORM */}
        <div className="bg-white rounded-2xl shadow-lg p-8">

          <h2 className="text-xl font-semibold text-gray-900 mb-6">
            {editingId ? 'Edit Product' : 'Add New Product'}
          </h2>

          <form onSubmit={handleSubmit} className="space-y-6">

            <div className="grid md:grid-cols-2 gap-6">

              <input
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Product name"
                className="w-full border border-gray-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />

              <select
                name="supplier_id"
                value={form.supplier_id}
                onChange={handleChange}
                className="w-full border border-gray-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              >
                <option value="">Select supplier</option>
                {suppliers.map(s => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>

              <input
                name="unit"
                value={form.unit}
                onChange={handleChange}
                placeholder="Unit (kg, crate, bottle)"
                className="w-full border border-gray-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />

              <input
                name="current_price"
                value={form.current_price}
                onChange={handleChange}
                placeholder="Current price"
                className="w-full border border-gray-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />

              <input
                name="alert_threshold"
                value={form.alert_threshold}
                onChange={handleChange}
                placeholder="Alert threshold (%)"
                className="w-full border border-gray-300 rounded-xl p-3 text-black focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />

            </div>

            <div className="flex gap-4 pt-2">

              <button className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition shadow-sm">
                {editingId ? 'Update Product' : 'Add Product'}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-3 rounded-xl border border-gray-300 hover:bg-gray-100 transition"
                >
                  Cancel
                </button>
              )}

            </div>

          </form>
        </div>

        {/* PRODUCT LIST */}
        <div className="space-y-6">

          {loading && (
            <div className="text-gray-500">Loading products...</div>
          )}

          {!loading && products.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm p-6 text-gray-500">
              No products yet. Add your first one above.
            </div>
          )}

          {products.map(product => (
            <div
              key={product.id}
              className="bg-white rounded-2xl shadow-md hover:shadow-lg transition p-6 flex justify-between items-center"
            >

              <div className="space-y-2">
                <div className="text-xl font-semibold text-gray-900">
                  {product.name}
                </div>

                <div className="text-sm text-gray-500">
                  Supplier: {product.suppliers?.name}
                </div>

                <div className="text-sm text-gray-700 font-medium">
                  {product.current_price} / {product.unit}
                </div>

                <div className="text-xs text-gray-400">
                  Alert threshold: {product.alert_threshold}%
                </div>
              </div>

              <div className="flex gap-3">

                <button
                  onClick={() => startEdit(product)}
                  className="px-4 py-2 text-sm rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                >
                  Edit
                </button>

                <button
                  onClick={() => handleDelete(product.id)}
                  className="px-4 py-2 text-sm rounded-lg border border-red-300 text-red-600 hover:bg-red-50 transition"
                >
                  Delete
                </button>

              </div>

            </div>
          ))}

        </div>

      </div>
    </div>
  )
}