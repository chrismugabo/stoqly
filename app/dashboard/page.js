 'use client'

import { useEffect, useState } from 'react'
import { supabase } from '../lib/supabase'
import Link from 'next/link'

export default function Dashboard() {
  const [user, setUser] = useState(null)
  const [supplierCount, setSupplierCount] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initialize = async () => {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        window.location.href = '/login'
        return
      }

      setUser(user)

      // Count suppliers (RLS automatically filters per user)
      const { count, error } = await supabase
        .from('suppliers')
        .select('*', { count: 'exact', head: true })

      if (!error) {
        setSupplierCount(count || 0)
      }

      setLoading(false)
    }

    initialize()
  }, [])

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
            className="text-sm font-semibold text-[#1A6B3C]"
          >
            Dashboard
          </Link>

          <Link
            href="/suppliers"
            className="text-sm font-semibold text-gray-600 hover:text-black"
          >
            Suppliers
          </Link>

          <span className="text-sm text-gray-500">
            {user.email}
          </span>

          <button
            onClick={handleLogout}
            className="text-sm font-semibold text-red-600 hover:text-red-700"
          >
            Logout
          </button>
        </div>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Welcome back 👋
        </h2>

        <p className="text-gray-600 mb-8">
          Here's an overview of your supplier activity.
        </p>

        <div className="grid grid-cols-3 gap-6">

          <Link href="/suppliers">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition cursor-pointer">
              <p className="text-sm text-gray-500">
                Total Suppliers
              </p>

              <p className="text-3xl font-bold text-gray-900 mt-2">
                {loading ? '...' : supplierCount}
              </p>
            </div>
          </Link>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">
              Orders This Month
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              0
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
            <p className="text-sm text-gray-500">
              Price Alerts
            </p>

            <p className="text-3xl font-bold text-gray-900 mt-2">
              0
            </p>
          </div>

        </div>

      </div>
    </main>
  )
}