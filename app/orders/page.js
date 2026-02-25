 'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/app/lib/supabase'

export default function OrdersPage() {
  const [user, setUser] = useState(null)
  const [suppliers, setSuppliers] = useState([])
  const [products, setProducts] = useState([])
  const [selectedSupplier, setSelectedSupplier] = useState('')
  const [orderItems, setOrderItems] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    getUser()
  }, [])

  useEffect(() => {
    if (user) {
      fetchSuppliers()
      fetchOrders()
    }
  }, [user])

  async function getUser() {
    const { data } = await supabase.auth.getUser()
    if (data?.user) setUser(data.user)
  }

  async function fetchSuppliers() {
    const { data } = await supabase
      .from('suppliers')
      .select('*')
      .order('created_at', { ascending: false })

    if (data) setSuppliers(data)
  }

  async function fetchProducts(supplierId) {
    const { data } = await supabase
      .from('products')
      .select('*')
      .eq('supplier_id', supplierId)

    if (data) setProducts(data)
  }

  async function fetchOrders() {
    const { data } = await supabase
      .from('orders')
      .select('*, suppliers(name)')
      .order('created_at', { ascending: false })

    if (data) setOrders(data)
  }

  function addProductToOrder(product) {
    const exists = orderItems.find(i => i.product_id === product.id)
    if (exists) return

    setOrderItems([
      ...orderItems,
      {
        product_id: product.id,
        name: product.name,
        price: product.current_price,
        quantity: 1
      }
    ])
  }

  function updateQuantity(index, value) {
    const updated = [...orderItems]
    updated[index].quantity = Number(value)
    setOrderItems(updated)
  }

  function calculateTotal() {
    return orderItems.reduce(
      (total, item) => total + item.price * item.quantity,
      0
    )
  }

  async function saveOrder() {
    if (!selectedSupplier || orderItems.length === 0) return

    setLoading(true)

    const total = calculateTotal()

    const { data: orderData, error } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          supplier_id: selectedSupplier,
          total_amount: total,
          status: 'draft'
        }
      ])
      .select()

    if (error) {
      console.error(error)
      setLoading(false)
      return
    }

    const orderId = orderData[0].id

    const itemsToInsert = orderItems.map(item => ({
      order_id: orderId,
      product_id: item.product_id,
      quantity: item.quantity,
      price_at_order: item.price
    }))

    await supabase.from('order_items').insert(itemsToInsert)

    setOrderItems([])
    setSelectedSupplier('')
    fetchOrders()
    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gray-100 p-8 text-gray-900">

      <h1 className="text-3xl font-bold mb-8">Orders</h1>

      {/* CREATE ORDER CARD */}
      <div className="bg-white p-6 rounded-xl shadow-md border mb-10">

        <h2 className="text-xl font-semibold mb-4">Create Order</h2>

        <select
          value={selectedSupplier}
          onChange={(e) => {
            setSelectedSupplier(e.target.value)
            fetchProducts(e.target.value)
            setOrderItems([])
          }}
          className="w-full p-3 border rounded mb-6"
        >
          <option value="">Select Supplier</option>
          {suppliers.map(s => (
            <option key={s.id} value={s.id}>
              {s.name}
            </option>
          ))}
        </select>

        {products.length > 0 && (
          <>
            <h3 className="font-semibold mb-3">Products</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {products.map(p => (
                <button
                  key={p.id}
                  onClick={() => addProductToOrder(p)}
                  className="p-3 border rounded hover:bg-gray-50 text-left"
                >
                  {p.name} — {p.current_price}
                </button>
              ))}
            </div>
          </>
        )}

        {orderItems.length > 0 && (
          <>
            <h3 className="font-semibold mb-3">Order Items</h3>
            {orderItems.map((item, index) => (
              <div key={index} className="flex justify-between items-center mb-3">
                <span>{item.name}</span>
                <input
                  type="number"
                  value={item.quantity}
                  min="1"
                  onChange={(e) => updateQuantity(index, e.target.value)}
                  className="w-20 p-1 border rounded"
                />
              </div>
            ))}

            <div className="font-bold mt-4">
              Total: {calculateTotal()}
            </div>
          </>
        )}

        <button
          onClick={saveOrder}
          disabled={loading}
          className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-gray-800"
        >
          {loading ? 'Saving...' : 'Save Order'}
        </button>
      </div>

      {/* PREVIOUS ORDERS */}
      <div className="bg-white p-6 rounded-xl shadow-md border">
        <h2 className="text-xl font-semibold mb-4">Previous Orders</h2>

        {orders.map(order => (
          <div key={order.id} className="border p-4 rounded mb-3">
            <div className="font-semibold">
              {order.suppliers?.name}
            </div>
            <div>Total: {order.total_amount}</div>
            <div>Status: {order.status}</div>
          </div>
        ))}
      </div>

    </div>
  )
}