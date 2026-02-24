export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">

      {/* Gradient Glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#1A6B3C]/40 via-black to-black opacity-60 pointer-events-none"></div>

      {/* NAV */}
      <header className="relative z-10 flex justify-between items-center px-8 py-6">
        <div className="text-2xl font-bold tracking-tight">
          Stoqly
        </div>

        <div className="flex gap-6 items-center">
          <a href="/login" className="text-sm opacity-80 hover:opacity-100 transition">
            Login
          </a>
          <a
            href="/signup"
            className="bg-[#1A6B3C] px-5 py-2 rounded-full text-sm font-semibold hover:scale-105 transition"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-28 pb-40 grid md:grid-cols-2 gap-20 items-center">

        <div>
          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-8">
            Your Suppliers
            <span className="block text-[#25D366]">
              Shouldn’t Surprise You.
            </span>
          </h1>

          <p className="text-lg opacity-80 mb-10 max-w-lg">
            Track every supplier price change. Log every order. Send WhatsApp messages in one tap.
            Built for restaurant owners in Kigali.
          </p>

          <div className="flex gap-6">
            <a
              href="/signup"
              className="bg-[#25D366] text-black px-8 py-4 rounded-full font-bold hover:scale-105 transition"
            >
              Start Free
            </a>

            <a
              href="/login"
              className="border border-white/30 px-8 py-4 rounded-full font-semibold hover:bg-white/10 transition"
            >
              Log In
            </a>
          </div>
        </div>

        {/* Floating Card */}
        <div className="relative">
          <div className="absolute -inset-8 bg-[#1A6B3C]/30 blur-3xl rounded-3xl"></div>

          <div className="relative bg-white text-black rounded-3xl shadow-2xl p-8 transform hover:rotate-1 hover:-translate-y-2 transition duration-500">
            <h3 className="text-xl font-semibold mb-6">Live Example</h3>

            <div className="mb-4">
              <p className="text-sm text-gray-500">Price Alert</p>
              <p className="text-lg font-bold text-red-500">
                Cooking Oil ↑ 18%
              </p>
            </div>

            <div className="mb-6">
              <p className="text-sm text-gray-500">Monthly Spend</p>
              <p className="text-2xl font-bold text-[#1A6B3C]">
                RWF 1,240,000
              </p>
            </div>

            <button className="w-full bg-[#25D366] text-white py-3 rounded-xl font-semibold hover:scale-105 transition">
              Send via WhatsApp
            </button>
          </div>
        </div>

      </section>

      {/* FOOTER */}
      <footer className="relative z-10 text-center py-8 text-sm opacity-50">
        © {new Date().getFullYear()} Stoqly · Kigali 🇷🇼
      </footer>

    </main>
  )
}