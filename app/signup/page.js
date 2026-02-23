'use client'

import { useState } from 'react'
import { supabase } from '../lib/supabase'

export default function Signup() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const handleSignup = async (e) => {
    e.preventDefault()
    setLoading(true)
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) {
      setMessage(error.message)
    } else {
      setMessage('Check your email to confirm your account!')
    }
    setLoading(false)
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50">
      <div className="bg-white p-8 rounded-2xl shadow-sm w-full max-w-md">
        <h1 className="text-3xl font-bold text-green-800 mb-2">Stoqly</h1>
        <p className="text-gray-500 mb-6">Create your account</p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-600"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="border border-gray-200 rounded-xl px-4 py-3 text-sm outline-none focus:border-green-600"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="bg-green-800 text-white rounded-xl py-3 font-semibold hover:bg-green-700 transition"
          >
            {loading ? 'Creating account...' : 'Sign Up'}
          </button>
        </form>

        {message && <p className="mt-4 text-sm text-center text-gray-600">{message}</p>}

        <p className="mt-6 text-center text-sm text-gray-500">
          Already have an account? <a href="/login" className="text-green-700 font-semibold">Log in</a>
        </p>
      </div>
    </main>
  )
}