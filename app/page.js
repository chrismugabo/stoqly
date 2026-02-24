export default function Home() {
  return (
    <main className="relative min-h-screen bg-[#0B0F14] text-white overflow-hidden">

      {/* Gradient Mesh Background */}
      <div className="absolute -top-40 -left-40 w-[700px] h-[700px] bg-[#1A6B3C] opacity-20 blur-[160px] rounded-full"></div>
      <div className="absolute top-40 right-0 w-[600px] h-[600px] bg-[#25D366] opacity-10 blur-[150px] rounded-full"></div>

      {/* NAV */}
      <header className="relative z-10 max-w-7xl mx-auto px-8 py-8 flex justify-between items-center">
        <div className="text-2xl font-semibold tracking-tight">
          Stoqly
        </div>

        <div className="flex gap-8 items-center">
          <a href="/login" className="text-sm opacity-70 hover:opacity-100 transition">
            Login
          </a>
          <a
            href="/signup"
            className="bg-[#1A6B3C] px-6 py-2.5 rounded-full text-sm font-medium hover:scale-105 transition"
          >
            Get Started
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-28 pb-32 grid md:grid-cols-2 gap-20 items-center">

        <div>
          <p className="text-sm uppercase tracking-widest text-[#25D366] mb-6">
            Built for Kigali Restaurants
          </p>

          <h1 className="text-6xl md:text-7xl font-extrabold leading-tight mb-8">
            See Every
            <span className="block text-[#25D366]">
              Supplier Price Change.
            </span>
          </h1>

          <p className="text-lg text-gray-400 mb-10 max-w-lg">
            Stoqly tracks supplier prices, logs orders automatically,
            and alerts you before increases hurt your margins.
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
              className="border border-white/20 px-8 py-4 rounded-full font-medium hover:bg-white/10 transition"
            >
              Log In
            </a>
          </div>
        </div>

        {/* Elevated Product Mock */}
        <div className="relative">
          <div className="absolute -inset-6 bg-[#1A6B3C]/30 blur-3xl rounded-3xl"></div>

          <div className="relative bg-[#121720] border border-white/10 rounded-3xl shadow-2xl p-8">

            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-semibold">Dashboard</h3>
              <span className="text-sm text-gray-400">Live Data</span>
            </div>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-[#1A202C] p-4 rounded-xl">
                <p className="text-xs text-gray-400">Monthly Spend</p>
                <p className="text-xl font-bold text-[#25D366]">
                  RWF 1,240,000
                </p>
              </div>

              <div className="bg-[#1A202C] p-4 rounded-xl">
                <p className="text-xs text-gray-400">Active Alerts</p>
                <p className="text-xl font-bold text-red-400">
                  3
                </p>
              </div>
            </div>

            <div className="bg-[#1A202C] p-4 rounded-xl mb-4">
              <p className="text-xs text-gray-400">Cooking Oil</p>
              <p className="text-sm text-red-400 font-semibold">
                ↑ 18% since last order
              </p>
            </div>

            <button className="w-full bg-[#25D366] text-black py-3 rounded-xl font-semibold hover:scale-105 transition">
              Generate WhatsApp Order
            </button>
          </div>
        </div>

      </section>

    </main>
  )
}