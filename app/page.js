import Link from 'next/link'

export default function Home() {
  return (
    <main style={{ minHeight: '100vh', background: '#0C3D22', color: 'white', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' }}>

      {/* NAV */}
      <header style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#1A6B3C', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px' }}>S</div>
          <span style={{ fontWeight: 800, fontSize: '20px', letterSpacing: '-0.5px' }}>Stoqly</span>
        </div>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <Link href="/login"><span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer' }}>Login</span></Link>
          <Link href="/signup"><span style={{ background: '#25D366', color: 'white', padding: '10px 20px', borderRadius: '10px', fontSize: '14px', fontWeight: 700, cursor: 'pointer' }}>Get Started →</span></Link>
        </div>
      </header>

      {/* HERO */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '80px 32px 100px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '80px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '20px', padding: '6px 14px', marginBottom: '28px' }}>
            <div style={{ width: '6px', height: '6px', background: '#25D366', borderRadius: '50%' }}></div>
            <span style={{ color: '#25D366', fontSize: '12px', fontWeight: 600 }}>Built for Kigali Restaurants 🇷🇼</span>
          </div>

          <h1 style={{ fontSize: '52px', fontWeight: 800, lineHeight: 1.1, marginBottom: '24px', letterSpacing: '-1px' }}>
            Know when your<br />
            <span style={{ color: '#25D366' }}>supplier prices</span><br />
            change.
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '17px', lineHeight: 1.7, marginBottom: '40px', maxWidth: '420px' }}>
            Stoqly tracks what you pay, alerts you when prices rise, and sends orders to suppliers via WhatsApp in one tap.
          </p>

          <div style={{ display: 'flex', gap: '12px' }}>
            <Link href="/signup">
              <span style={{ background: '#25D366', color: 'white', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'inline-block' }}>Start Free</span>
            </Link>
            <Link href="/login">
              <span style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'inline-block', border: '1px solid rgba(255,255,255,0.12)' }}>Log In</span>
            </Link>
          </div>

          <div style={{ marginTop: '48px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex' }}>
              {['C','M','A','J'].map((letter, i) => (
                <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: ['#1A6B3C','#25D366','#0d5c33','#1e8449'][i], border: '2px solid #0C3D22', marginLeft: i > 0 ? '-8px' : '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{letter}</div>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>Trusted by restaurants in Kigali</p>
          </div>
        </div>

        {/* Product Mockup */}
        <div style={{ position: 'relative' }}>
          <div style={{ background: '#F7F4EF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
            <div style={{ background: '#0C3D22', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
              <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>
              <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginLeft: '8px' }}>stoqly.app/dashboard</span>
            </div>
            <div style={{ padding: '24px' }}>
              <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>Good morning 👋</p>
              <p style={{ fontSize: '20px', fontWeight: 800, color: '#111', marginBottom: '20px' }}>Business Overview</p>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                {[
                  { label: 'SUPPLIERS', value: '8', bg: '#1A6B3C' },
                  { label: 'PRODUCTS', value: '34', bg: '#2563eb' },
                  { label: 'ORDERS', value: '12', bg: '#f97316' },
                  { label: 'SPEND', value: '847K', bg: '#7c3aed' },
                ].map((s, i) => (
                  <div key={i} style={{ background: s.bg, borderRadius: '12px', padding: '14px' }}>
                    <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '10px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{s.label}</p>
                    <p style={{ color: 'white', fontSize: '26px', fontWeight: 800 }}>{s.value}</p>
                  </div>
                ))}
              </div>
              <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '12px 14px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <p style={{ fontSize: '12px', fontWeight: 700, color: '#c2410c' }}>⚠️ Tomatoes — Fresh Greens</p>
                  <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>RWF 800 → RWF 1,100/kg</p>
                </div>
                <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>+37%</span>
              </div>
              <button style={{ width: '100%', background: '#25D366', color: 'white', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer' }}>
                📲 Send WhatsApp Order
              </button>
            </div>
          </div>
          <div style={{ position: 'absolute', top: '-16px', right: '-16px', background: '#25D366', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(37,211,102,0.4)' }}>
            <p style={{ color: 'white', fontSize: '11px', fontWeight: 700 }}>🔔 Price Alert</p>
            <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>Cooking Oil +18%</p>
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: 'rgba(0,0,0,0.15)', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>How It Works</p>
          <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>Up and running in 3 steps</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '16px', marginBottom: '64px' }}>No training needed. No complex setup. Just add your suppliers and go.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px', position: 'relative' }}>
            {/* Connector line */}
            <div style={{ position: 'absolute', top: '40px', left: '20%', right: '20%', height: '2px', background: 'linear-gradient(90deg, rgba(37,211,102,0.3), rgba(37,211,102,0.6), rgba(37,211,102,0.3))', zIndex: 0 }}></div>

            {[
              { step: '01', icon: '🏪', title: 'Add your suppliers', desc: 'Add the people you buy from — name, phone, category. Add the products you buy and their current prices.' },
              { step: '02', icon: '📲', title: 'Place orders via WhatsApp', desc: 'Select a supplier, pick what you need, set quantities. Stoqly writes the WhatsApp message for you. One tap to send.' },
              { step: '03', icon: '🔔', title: 'Get price alerts', desc: 'Every order logs the prices. When a supplier charges more than your threshold, you get an instant alert.' },
            ].map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '32px 28px', position: 'relative', zIndex: 1 }}>
                <div style={{ width: '48px', height: '48px', background: '#1A6B3C', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '20px' }}>{s.icon}</div>
                <p style={{ color: '#25D366', fontSize: '12px', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>STEP {s.step}</p>
                <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '12px' }}>{s.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: '100px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Features</p>
          <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 800, marginBottom: '60px', letterSpacing: '-0.5px' }}>Everything you need. Nothing you don't.</h2>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
            {[
              { icon: '📲', title: 'WhatsApp Orders', desc: 'Generate a formatted order message and send it to your supplier in one tap. No typing, no mistakes.' },
              { icon: '📈', title: 'Price Tracking', desc: 'Every order automatically logs current prices. See the full history of what you paid over time.' },
              { icon: '🔔', title: 'Price Alerts', desc: 'Set a threshold per product. Get alerted the moment a supplier raises their prices above it.' },
              { icon: '🏪', title: 'Supplier Management', desc: 'All your suppliers in one place. Phone numbers, categories, products, order history.' },
              { icon: '📊', title: 'Spending Reports', desc: 'See exactly how much you spend per supplier per month. Spot where your money is going.' },
              { icon: '🔒', title: 'Your data only', desc: 'Full data isolation. Nobody else can see your suppliers, prices, or orders. Ever.' },
            ].map((f, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '28px', marginBottom: '14px' }}>{f.icon}</div>
                <p style={{ fontWeight: 700, fontSize: '15px', marginBottom: '8px' }}>{f.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ background: 'rgba(0,0,0,0.15)', padding: '100px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Pricing</p>
          <h2 style={{ textAlign: 'center', fontSize: '36px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>Simple, honest pricing</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '16px', marginBottom: '60px' }}>Start free. Upgrade when you're ready.</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', maxWidth: '700px', margin: '0 auto' }}>

            {/* Free */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '32px' }}>
              <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Free</p>
              <p style={{ fontSize: '40px', fontWeight: 800, marginBottom: '4px' }}>RWF 0</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '28px' }}>Forever free</p>
              {['Up to 3 suppliers', 'Up to 10 products', 'WhatsApp ordering', 'Basic price tracking'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ color: '#25D366', fontSize: '14px' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{f}</span>
                </div>
              ))}
              <Link href="/signup">
                <div style={{ marginTop: '28px', width: '100%', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', textAlign: 'center' }}>
                  Get Started Free
                </div>
              </Link>
            </div>

            {/* Pro */}
            <div style={{ background: '#1A6B3C', border: '2px solid #25D366', borderRadius: '20px', padding: '32px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#25D366', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px' }}>MOST POPULAR</div>
              <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px' }}>Pro</p>
              <p style={{ fontSize: '40px', fontWeight: 800, marginBottom: '4px' }}>RWF 8,000</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '28px' }}>per month</p>
              {['Unlimited suppliers', 'Unlimited products', 'WhatsApp ordering', 'Full price history', 'Price alerts engine', 'Spending reports'].map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                  <span style={{ color: '#25D366', fontSize: '14px' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{f}</span>
                </div>
              ))}
              <Link href="/signup">
                <div style={{ marginTop: '28px', width: '100%', background: '#25D366', color: 'white', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', textAlign: 'center', border: 'none' }}>
                  Start Pro Free →
                </div>
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: '100px 32px', textAlign: 'center' }}>
        <div style={{ background: '#1A6B3C', borderRadius: '24px', padding: '64px 32px' }}>
          <p style={{ color: '#25D366', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '16px' }}>Get Started Today</p>
          <h2 style={{ fontSize: '40px', fontWeight: 800, marginBottom: '16px', letterSpacing: '-0.5px' }}>Ready to take control of your costs?</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', marginBottom: '40px' }}>Join restaurants in Kigali already using Stoqly 🇷🇼</p>
          <Link href="/signup">
            <span style={{ background: '#25D366', color: 'white', padding: '16px 40px', borderRadius: '14px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', display: 'inline-block' }}>
              Start Free Today →
            </span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: '32px', textAlign: 'center' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <div style={{ width: '24px', height: '24px', background: '#1A6B3C', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800 }}>S</div>
            <span style={{ fontWeight: 700, fontSize: '14px' }}>Stoqly</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>© 2026 Stoqly · Built for Kigali 🇷🇼</p>
          <div style={{ display: 'flex', gap: '20px' }}>
            <Link href="/login"><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', cursor: 'pointer' }}>Login</span></Link>
            <Link href="/signup"><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', cursor: 'pointer' }}>Sign Up</span></Link>
          </div>
        </div>
      </footer>

    </main>
  )
}