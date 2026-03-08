 'use client'

import { useState } from 'react'
import Link from 'next/link'

const clash = "'Clash Display', sans-serif"
const dm = "'DM Sans', sans-serif"

export default function LandingPage() {
  const [lang, setLang] = useState('en')

  const t = {
    en: {
      badge: 'Built for Kigali Restaurants 🇷🇼',
      hero1: 'Your supplier',
      hero2: 'raised prices.',
      hero3: 'Did you notice?',
      sub1: 'Most Kigali restaurants lose money on supplier price increases they never saw coming.',
      sub2: 'Stoqly tracks what you pay, alerts you the moment prices change, and sends orders via WhatsApp in one tap.',
      cta: 'Start Free',
      login: 'Log In',
      trusted: 'Trusted by restaurants in Kigali',
      featuresTitle: 'Everything you need to manage suppliers',
      featuresSub: 'Built specifically for how Kigali restaurants actually work',
      features: [
        { icon: '⚠️', title: 'Price Alerts', desc: 'Get notified the moment a supplier raises prices above your threshold. Never get caught off guard again.' },
        { icon: '📲', title: 'WhatsApp Orders', desc: 'Build your order in seconds and send it directly to your supplier via WhatsApp — in English or Kinyarwanda.' },
        { icon: '📊', title: 'Spending Reports', desc: 'See exactly how much you spend per supplier each month. Identify where your money is going.' },
      ],
      howTitle: 'Up and running in 3 steps',
      howSub: 'No training needed. If you can use WhatsApp, you can use Stoqly.',
      steps: [
        { num: '01', title: 'Add your suppliers', desc: 'Add the suppliers you already work with. Add their products and current prices.' },
        { num: '02', title: 'Place orders via WhatsApp', desc: 'Select products, set quantities, and send a professional order message directly to your supplier.' },
        { num: '03', title: 'Track price changes', desc: 'Every order records the price. Stoqly alerts you whenever prices spike above your limit.' },
      ],
      pricingTitle: 'Simple, honest pricing',
      pricingSub: 'Start free. Upgrade when you\'re ready.',
      free: 'Free',
      pro: 'Pro',
      freePrice: 'RWF 0',
      proPrice: 'RWF 8,000',
      perMonth: '/month',
      freeFeatures: ['2 suppliers', '5 products', '10 orders/month', 'WhatsApp ordering', 'Basic price tracking'],
      proFeatures: ['Unlimited suppliers', 'Unlimited products', 'Unlimited orders', 'Kinyarwanda messages', 'Price alerts engine', 'Spending reports', 'Priority support'],
      getStartedFree: 'Get Started Free',
      upgradePro: 'Start Pro',
      ctaTitle: 'Stop losing money to price increases you didn\'t see',
      ctaSub: 'Join restaurants in Kigali already using Stoqly to stay in control of their supplier costs.',
      ctaBtn: 'Start Free Today →',
      footerTagline: 'Built for Kigali restaurants. 🇷🇼',
    },
    fr: {
      badge: 'Conçu pour les restaurants de Kigali 🇷🇼',
      hero1: 'Votre fournisseur',
      hero2: 'a augmenté les prix.',
      hero3: 'L\'avez-vous remarqué?',
      sub1: 'La plupart des restaurants de Kigali perdent de l\'argent sur des hausses de prix qu\'ils n\'ont jamais vues venir.',
      sub2: 'Stoqly suit vos prix, vous alerte dès qu\'ils changent, et envoie vos commandes via WhatsApp en un tap.',
      cta: 'Commencer Gratuit',
      login: 'Connexion',
      trusted: 'Utilisé par des restaurants à Kigali',
      featuresTitle: 'Tout ce qu\'il faut pour gérer vos fournisseurs',
      featuresSub: 'Conçu pour la façon dont les restaurants de Kigali fonctionnent vraiment',
      features: [
        { icon: '⚠️', title: 'Alertes de Prix', desc: 'Soyez notifié dès qu\'un fournisseur augmente ses prix au-delà de votre seuil.' },
        { icon: '📲', title: 'Commandes WhatsApp', desc: 'Construisez votre commande en secondes et envoyez-la directement via WhatsApp.' },
        { icon: '📊', title: 'Rapports de Dépenses', desc: 'Voyez exactement combien vous dépensez par fournisseur chaque mois.' },
      ],
      howTitle: 'Opérationnel en 3 étapes',
      howSub: 'Pas de formation nécessaire. Si vous utilisez WhatsApp, vous pouvez utiliser Stoqly.',
      steps: [
        { num: '01', title: 'Ajoutez vos fournisseurs', desc: 'Ajoutez les fournisseurs avec qui vous travaillez déjà. Ajoutez leurs produits et prix actuels.' },
        { num: '02', title: 'Commandez via WhatsApp', desc: 'Sélectionnez des produits, définissez les quantités, envoyez un message professionnel.' },
        { num: '03', title: 'Suivez les changements de prix', desc: 'Chaque commande enregistre le prix. Stoqly vous alerte si les prix dépassent votre limite.' },
      ],
      pricingTitle: 'Tarification simple et honnête',
      pricingSub: 'Commencez gratuitement. Mettez à niveau quand vous êtes prêt.',
      free: 'Gratuit',
      pro: 'Pro',
      freePrice: 'RWF 0',
      proPrice: 'RWF 8,000',
      perMonth: '/mois',
      freeFeatures: ['2 fournisseurs', '5 produits', '10 commandes/mois', 'Commandes WhatsApp', 'Suivi des prix de base'],
      proFeatures: ['Fournisseurs illimités', 'Produits illimités', 'Commandes illimitées', 'Messages en Kinyarwanda', 'Moteur d\'alertes de prix', 'Rapports de dépenses', 'Support prioritaire'],
      getStartedFree: 'Commencer Gratuitement',
      upgradePro: 'Démarrer Pro',
      ctaTitle: 'Arrêtez de perdre de l\'argent sur des hausses de prix imprévues',
      ctaSub: 'Rejoignez les restaurants de Kigali qui utilisent déjà Stoqly.',
      ctaBtn: 'Commencer Gratuitement →',
      footerTagline: 'Conçu pour les restaurants de Kigali. 🇷🇼',
    }
  }

  const c = t[lang]

  return (
    <div style={{ fontFamily: dm, background: '#0C3D22', minHeight: '100vh' }}>

      {/* Navbar */}
      <nav style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100, background: 'rgba(12,61,34,0.85)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)', padding: '0 24px', height: '60px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: 'linear-gradient(135deg, #1A6B3C, #25D366)', borderRadius: '9px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '16px', fontFamily: clash }}>S</div>
          <span style={{ color: 'white', fontWeight: 800, fontSize: '18px', fontFamily: clash, letterSpacing: '-0.3px' }}>Stoqly</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* Language toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: '8px', padding: '3px', gap: '2px', marginRight: '8px' }}>
            {['en', 'fr'].map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: '4px 10px', borderRadius: '6px', border: 'none', background: lang === l ? 'white' : 'transparent', color: lang === l ? '#111' : 'rgba(255,255,255,0.5)', fontWeight: lang === l ? 700 : 500, fontSize: '12px', cursor: 'pointer', fontFamily: clash }}>
                {l === 'en' ? '🇬🇧 EN' : '🇫🇷 FR'}
              </button>
            ))}
          </div>
          <Link href="/login">
            <button style={{ background: 'transparent', color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '8px 16px', fontSize: '13px', fontWeight: 600, cursor: 'pointer', fontFamily: clash, transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)'}
              onMouseLeave={e => e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)'}
            >{c.login}</button>
          </Link>
          <Link href="/signup">
            <button style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: '10px', padding: '8px 18px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, boxShadow: '0 4px 12px rgba(37,211,102,0.35)', transition: 'all 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-1px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
            >{c.cta} →</button>
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', padding: '80px 24px 60px', maxWidth: '1200px', margin: '0 auto', gap: '60px', flexWrap: 'wrap' }}>
        <div style={{ flex: '1', minWidth: '300px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,211,102,0.12)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '20px', padding: '6px 14px', marginBottom: '24px' }}>
            <div style={{ width: '6px', height: '6px', background: '#4ade80', borderRadius: '50%', boxShadow: '0 0 8px rgba(74,222,128,0.6)' }}></div>
            <span style={{ color: '#4ade80', fontSize: '13px', fontWeight: 600 }}>{c.badge}</span>
          </div>

          <h1 style={{ color: 'white', fontSize: 'clamp(36px, 5vw, 64px)', fontWeight: 800, fontFamily: clash, lineHeight: 1.05, marginBottom: '20px' }}>
            {c.hero1}<br />
            <span style={{ color: '#25D366' }}>{c.hero2}</span><br />
            {c.hero3}
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '16px', lineHeight: 1.7, marginBottom: '12px', maxWidth: '420px' }}>{c.sub1}</p>
          <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '15px', lineHeight: 1.7, marginBottom: '36px', maxWidth: '420px' }}>{c.sub2}</p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', marginBottom: '32px' }}>
            <Link href="/signup">
              <button style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: '14px', padding: '15px 28px', fontSize: '16px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, boxShadow: '0 6px 24px rgba(37,211,102,0.4)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 10px 32px rgba(37,211,102,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 6px 24px rgba(37,211,102,0.4)' }}
              >{c.cta} →</button>
            </Link>
            <Link href="/login">
              <button style={{ background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.8)', border: '1px solid rgba(255,255,255,0.12)', borderRadius: '14px', padding: '15px 28px', fontSize: '16px', fontWeight: 600, cursor: 'pointer', fontFamily: clash, transition: 'all 0.15s' }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
              >{c.login}</button>
            </Link>
          </div>

          {/* Social proof */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ display: 'flex' }}>
              {['C','M','A','J'].map((letter, i) => (
                <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: `hsl(${i * 40 + 140}, 60%, 35%)`, border: '2px solid #0C3D22', marginLeft: i > 0 ? '-10px' : '0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '12px', fontWeight: 700 }}>{letter}</div>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px' }}>{c.trusted}</p>
          </div>
        </div>

        {/* Hero mockup */}
        <div style={{ flex: '1', minWidth: '320px', position: 'relative' }}>
          {/* Price alert floating badge */}
          <div style={{ position: 'absolute', top: '-16px', right: '0', background: '#dc2626', color: 'white', borderRadius: '14px', padding: '10px 16px', fontSize: '13px', fontWeight: 700, fontFamily: clash, boxShadow: '0 8px 24px rgba(220,38,38,0.4)', zIndex: 2, display: 'flex', alignItems: 'center', gap: '8px', animation: 'none' }}>
            <span>⚠️</span>
            <div>
              <p style={{ fontSize: '11px', opacity: 0.8, marginBottom: '1px' }}>Price Alert</p>
              <p>Cooking Oil +18%</p>
            </div>
          </div>

          {/* App mockup */}
          <div style={{ background: '#F7F4EF', borderRadius: '20px', padding: '20px', boxShadow: '0 32px 80px rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)', position: 'relative', zIndex: 1 }}>
            {/* Browser bar */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px', padding: '8px 12px', background: 'white', borderRadius: '10px' }}>
              <div style={{ display: 'flex', gap: '5px' }}>
                {['#ef4444','#f59e0b','#22c55e'].map(c => <div key={c} style={{ width: '9px', height: '9px', borderRadius: '50%', background: c }}></div>)}
              </div>
              <div style={{ flex: 1, background: '#f3f4f6', borderRadius: '6px', padding: '4px 10px', fontSize: '11px', color: '#9ca3af' }}>stoqly.app/dashboard</div>
            </div>

            <p style={{ fontSize: '12px', color: '#9ca3af', marginBottom: '12px' }}>Good morning 👋</p>
            <p style={{ fontWeight: 700, fontSize: '16px', color: '#111', fontFamily: clash, marginBottom: '16px' }}>Business Overview</p>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '14px' }}>
              {[
                { label: 'SUPPLIERS', value: '8', bg: 'linear-gradient(135deg, #1A6B3C, #166534)' },
                { label: 'PRODUCTS', value: '34', bg: 'linear-gradient(135deg, #2563eb, #1d4ed8)' },
                { label: 'ORDERS', value: '12', bg: 'linear-gradient(135deg, #f97316, #ea580c)' },
                { label: 'SPEND', value: '847K', bg: 'linear-gradient(135deg, #7c3aed, #6d28d9)' },
              ].map((s, i) => (
                <div key={i} style={{ background: s.bg, borderRadius: '12px', padding: '12px 14px', height: '64px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                  <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: '9px', fontWeight: 700, letterSpacing: '0.5px' }}>{s.label}</p>
                  <p style={{ color: 'white', fontSize: '20px', fontWeight: 800, fontFamily: clash }}>{s.value}</p>
                </div>
              ))}
            </div>

            {/* Price alert row */}
            <div style={{ background: '#fff8f0', border: '1.5px solid #fed7aa', borderRadius: '12px', padding: '12px 14px', marginBottom: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <p style={{ fontWeight: 700, fontSize: '13px', color: '#111', fontFamily: clash }}>⚠️ Tomatoes — Fresh Greens</p>
                <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>RWF 800 → RWF 1,100/kg</p>
              </div>
              <span style={{ color: '#dc2626', fontWeight: 800, fontSize: '14px', fontFamily: clash }}>+37%</span>
            </div>

            <button style={{ width: '100%', background: '#25D366', color: 'white', border: 'none', borderRadius: '12px', padding: '13px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', fontFamily: clash }}>
              📲 Send WhatsApp Order
            </button>
          </div>

          {/* WhatsApp message floating */}
          <div style={{ position: 'absolute', bottom: '-20px', left: '-20px', background: 'white', borderRadius: '14px', padding: '12px 16px', boxShadow: '0 12px 32px rgba(0,0,0,0.15)', zIndex: 2, maxWidth: '200px' }}>
            <p style={{ fontSize: '10px', color: '#9ca3af', marginBottom: '4px' }}>WhatsApp sent ✓</p>
            <p style={{ fontSize: '12px', fontWeight: 600, color: '#111', lineHeight: 1.4 }}>Hello! I'd like to place an order: Tomatoes — 5 kg...</p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ background: '#F7F4EF', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', padding: '5px 14px', marginBottom: '16px' }}>
              <span style={{ color: '#1A6B3C', fontSize: '12px', fontWeight: 700 }}>✦ Features</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#111', fontFamily: clash, marginBottom: '12px', lineHeight: 1.1 }}>{c.featuresTitle}</h2>
            <p style={{ color: '#9ca3af', fontSize: '16px', maxWidth: '480px', margin: '0 auto', lineHeight: 1.6 }}>{c.featuresSub}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {c.features.map((f, i) => (
              <div key={i} style={{ background: 'white', borderRadius: '24px', padding: '32px', border: '1px solid #ede9e4', boxShadow: '0 2px 12px rgba(0,0,0,0.05)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 16px 40px rgba(0,0,0,0.1)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 2px 12px rgba(0,0,0,0.05)' }}
              >
                <div style={{ width: '52px', height: '52px', background: 'linear-gradient(135deg, #f0fdf4, #dcfce7)', borderRadius: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '24px', marginBottom: '20px', border: '1px solid #bbf7d0' }}>{f.icon}</div>
                <h3 style={{ fontWeight: 700, fontSize: '20px', color: '#111', fontFamily: clash, marginBottom: '10px' }}>{f.title}</h3>
                <p style={{ color: '#6b7280', fontSize: '15px', lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ background: '#0C3D22', padding: '80px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: 'rgba(37,211,102,0.1)', border: '1px solid rgba(37,211,102,0.2)', borderRadius: '20px', padding: '5px 14px', marginBottom: '16px' }}>
              <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 700 }}>✦ How it works</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: 'white', fontFamily: clash, marginBottom: '12px', lineHeight: 1.1 }}>{c.howTitle}</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', maxWidth: '440px', margin: '0 auto', lineHeight: 1.6 }}>{c.howSub}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
            {c.steps.map((s, i) => (
              <div key={i} style={{ position: 'relative' }}>
                <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '24px', padding: '32px', height: '100%', transition: 'all 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.07)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                >
                  <p style={{ fontSize: '48px', fontWeight: 800, color: 'rgba(37,211,102,0.15)', fontFamily: clash, lineHeight: 1, marginBottom: '16px' }}>{s.num}</p>
                  <h3 style={{ fontWeight: 700, fontSize: '20px', color: 'white', fontFamily: clash, marginBottom: '10px' }}>{s.title}</h3>
                  <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '15px', lineHeight: 1.7 }}>{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ background: '#F7F4EF', padding: '80px 24px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#f0fdf4', border: '1px solid #bbf7d0', borderRadius: '20px', padding: '5px 14px', marginBottom: '16px' }}>
              <span style={{ color: '#1A6B3C', fontSize: '12px', fontWeight: 700 }}>✦ Pricing</span>
            </div>
            <h2 style={{ fontSize: 'clamp(28px, 4vw, 44px)', fontWeight: 800, color: '#111', fontFamily: clash, marginBottom: '12px' }}>{c.pricingTitle}</h2>
            <p style={{ color: '#9ca3af', fontSize: '16px' }}>{c.pricingSub}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
            {/* Free */}
            <div style={{ background: 'white', borderRadius: '24px', padding: '36px', border: '1px solid #ede9e4', boxShadow: '0 2px 12px rgba(0,0,0,0.05)' }}>
              <p style={{ fontWeight: 700, fontSize: '14px', color: '#6b7280', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px', fontFamily: clash }}>{c.free}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '8px' }}>
                <p style={{ fontSize: '40px', fontWeight: 800, color: '#111', fontFamily: clash, lineHeight: 1 }}>{c.freePrice}</p>
              </div>
              <p style={{ color: '#9ca3af', fontSize: '13px', marginBottom: '28px' }}>Forever free</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {c.freeFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '18px', height: '18px', background: '#f0fdf4', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0, border: '1px solid #bbf7d0' }}>✓</div>
                    <p style={{ fontSize: '14px', color: '#374151' }}>{f}</p>
                  </div>
                ))}
              </div>
              <Link href="/signup">
                <button style={{ width: '100%', background: '#f3f4f6', color: '#111', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, transition: 'all 0.15s' }}
                  onMouseEnter={e => e.currentTarget.style.background = '#e5e7eb'}
                  onMouseLeave={e => e.currentTarget.style.background = '#f3f4f6'}
                >{c.getStartedFree}</button>
              </Link>
            </div>

            {/* Pro */}
            <div style={{ background: 'linear-gradient(135deg, #071f12, #0C3D22)', borderRadius: '24px', padding: '36px', border: '1px solid rgba(37,211,102,0.2)', boxShadow: '0 16px 48px rgba(12,61,34,0.25)', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '-40px', right: '-40px', width: '160px', height: '160px', background: 'rgba(37,211,102,0.06)', borderRadius: '50%' }}></div>
              <div style={{ position: 'absolute', top: '16px', right: '16px', background: '#25D366', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', fontFamily: clash }}>POPULAR</div>
              <p style={{ fontWeight: 700, fontSize: '14px', color: '#4ade80', textTransform: 'uppercase', letterSpacing: '0.8px', marginBottom: '12px', fontFamily: clash }}>{c.pro}</p>
              <div style={{ display: 'flex', alignItems: 'baseline', gap: '4px', marginBottom: '4px' }}>
                <p style={{ fontSize: '40px', fontWeight: 800, color: 'white', fontFamily: clash, lineHeight: 1 }}>{c.proPrice}</p>
                <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '14px' }}>{c.perMonth}</p>
              </div>
              <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', marginBottom: '28px' }}>~RWF 267/day</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '32px' }}>
                {c.proFeatures.map((f, i) => (
                  <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div style={{ width: '18px', height: '18px', background: 'rgba(37,211,102,0.15)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', flexShrink: 0, border: '1px solid rgba(37,211,102,0.3)', color: '#4ade80' }}>✓</div>
                    <p style={{ fontSize: '14px', color: 'rgba(255,255,255,0.75)' }}>{f}</p>
                  </div>
                ))}
              </div>
              <Link href="/signup">
                <button style={{ width: '100%', background: '#25D366', color: 'white', border: 'none', borderRadius: '14px', padding: '14px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, boxShadow: '0 4px 16px rgba(37,211,102,0.35)', transition: 'all 0.15s' }}
                  onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(37,211,102,0.45)' }}
                  onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(37,211,102,0.35)' }}
                >{c.upgradePro}</button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ background: '#0C3D22', padding: '80px 24px' }}>
        <div style={{ maxWidth: '700px', margin: '0 auto', textAlign: 'center' }}>
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '32px', padding: '56px 40px' }}>
            <p style={{ fontSize: '48px', marginBottom: '20px' }}>🇷🇼</p>
            <h2 style={{ fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 800, color: 'white', fontFamily: clash, marginBottom: '16px', lineHeight: 1.15 }}>{c.ctaTitle}</h2>
            <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '16px', lineHeight: 1.7, marginBottom: '36px', maxWidth: '480px', margin: '0 auto 36px' }}>{c.ctaSub}</p>
            <Link href="/signup">
              <button style={{ background: '#25D366', color: 'white', border: 'none', borderRadius: '16px', padding: '16px 36px', fontSize: '17px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, boxShadow: '0 8px 28px rgba(37,211,102,0.4)', transition: 'all 0.2s' }}
                onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 12px 36px rgba(37,211,102,0.5)' }}
                onMouseLeave={e => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 8px 28px rgba(37,211,102,0.4)' }}
              >{c.ctaBtn}</button>
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#071f12', borderTop: '1px solid rgba(255,255,255,0.06)', padding: '32px 24px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <div style={{ width: '28px', height: '28px', background: 'linear-gradient(135deg, #1A6B3C, #25D366)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontWeight: 800, fontSize: '14px', fontFamily: clash }}>S</div>
            <div>
              <p style={{ color: 'white', fontWeight: 700, fontSize: '14px', fontFamily: clash }}>Stoqly</p>
              <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '11px', marginTop: '1px' }}>{c.footerTagline}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '24px', alignItems: 'center' }}>
            <Link href="/login"><span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >{c.login}</span></Link>
            <Link href="/signup"><span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '13px', cursor: 'pointer', transition: 'color 0.15s' }}
              onMouseEnter={e => e.currentTarget.style.color = 'rgba(255,255,255,0.7)'}
              onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.35)'}
            >{c.cta}</span></Link>
            <p style={{ color: 'rgba(255,255,255,0.2)', fontSize: '12px' }}>© 2026 Stoqly</p>
          </div>
        </div>
      </footer>

    </div>
  )
}