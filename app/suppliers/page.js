 'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Suppliers() {
  const [user, setUser] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [category, setCategory] = useState('')
  const [notes, setNotes] = useState('')
  const [editingId, setEditingId] = useState(null)

  useEffect(() => {
    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      setUser(user)
      fetchSuppliers(user.id)
    }

    initialize()
  }, [])

  const fetchSuppliers = async (userId) => {
    const { data, error } = await supabase
      .from('suppliers')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (!error) {
      setSuppliers(data)
    }
  }

  const resetForm = () => {
    setName('')
    setPhone('')
    setCategory('')
    setNotes('')
    setEditingId(null)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!name.trim()) return

    if (editingId) {
      await supabase
        .from('suppliers')
        .update({
          name,
          phone,
          category,
          notes,
        })
        .eq('id', editingId)
        .eq('user_id', user.id)
    } else {
      await supabase.from('suppliers').insert({
        user_id: user.id,
        name,
        phone,
        category,
        notes,
      })
    }

    resetForm()
    fetchSuppliers(user.id)
  }

  const handleEdit = (supplier) => {
    setName(supplier.name)
    setPhone(supplier.phone)
    setCategory(supplier.category)
    setNotes(supplier.notes)
    setEditingId(supplier.id)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleDelete = async (id) => {
    await supabase
      .from('suppliers')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id)

    fetchSuppliers(user.id)
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    window.location.href = '/login'
  }

  if (!user) return null

  return (
    <main className="min-h-screen bg-gray-50">

      {/* Top Navigation */}
      <nav className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
        <h1 className="text-xl font-bold text-[#1A6B3C]">Stoqly</h1>

        <div className="flex items-center gap-6">
          <Link
            href="/dashboard"
            className="text-sm font-semibold text-gray-600 hover:text-black"
          >
            Dashboard
          </Link>

          <Link
            href="/suppliers"
            className="text-sm font-semibold text-[#1A6B3C]"
          >
            Suppliers
          </Link>

          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10 grid md:grid-cols-2 gap-8">

        {/* Form */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-6">
            {editingId ? 'Edit Supplier' : 'Add Supplier'}
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">

            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Supplier Name"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:border-[#1A6B3C] outline-none"
            />

            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="Phone Number"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:border-[#1A6B3C] outline-none"
            />

            <input
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              placeholder="Category (Meat, Vegetables, Oil...)"
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:border-[#1A6B3C] outline-none"
            />

            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Notes"
              rows={3}
              className="border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-900 bg-white focus:border-[#1A6B3C] outline-none"
            />

            <button
              type="submit"
              className="bg-[#1A6B3C] text-white rounded-xl py-3 font-semibold hover:opacity-90 transition"
            >
              {editingId ? 'Save Changes' : 'Add Supplier'}
            </button>

            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="text-sm text-gray-600 mt-2"
              >
                Cancel Edit
              </button>
            )}

          </form>
        </div>

        {/* Supplier List */}
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
          <h2 className="text-lg font-bold mb-6">Your Suppliers</h2>

          {suppliers.length === 0 ? (
            <p className="text-gray-500">No suppliers yet.</p>
          ) : (
            <div className="flex flex-col gap-4">
              {suppliers.map((supplier) => (
                <div
                  key={supplier.id}
                  className="border border-gray-200 rounded-xl p-4"
                >
                  <p className="font-semibold text-gray-900">
                    {supplier.name}
                  </p>
                  <p className="text-sm text-gray-600">
                    {supplier.category} • {supplier.phone}
                  </p>

                  {supplier.notes && (
                    <p className="text-sm text-gray-500 mt-2">
                      {supplier.notes}
                    </p>
                  )}

                  <div className="flex gap-4 mt-3">
                    <button
                      onClick={() => handleEdit(supplier)}
                      className="text-sm font-semibold text-[#1A6B3C]"
                    >
                      Edit
                    </button>

                    <button
                      onClick={() => handleDelete(supplier.id)}
                      className="text-sm font-semibold text-red-600"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>

    </main>
  )
}