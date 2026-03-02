 'use client'

import Link from 'next/link'
import { useState, useEffect } from 'react'

const clash = "'Clash Display', sans-serif"

const content = {
  en: {
    flag: '🇬🇧', lang: 'EN',
    nav: { login: 'Login', cta: 'Get Started →' },
    badge: 'Built for Kigali Restaurants 🇷🇼',
    h1a: 'Your supplier', h1b: 'raised prices.', h1c: 'Did you notice?',
    sub1: 'Most Kigali restaurants lose money on supplier price increases they never saw coming.',
    sub2: 'Stoqly tracks what you pay, alerts you the moment prices change, and sends orders via WhatsApp in one tap.',
    cta1: 'Start Free', cta2: 'Log In',
    trust: 'Trusted by restaurants in Kigali',
    mockup: { greeting: 'Good morning 👋', title: 'Business Overview', alert: 'Tomatoes — Fresh Greens', price: 'RWF 800 → RWF 1,100/kg', btn: '📲 Send WhatsApp Order', alertBadge: '🔔 Price Alert', alertSub: 'Cooking Oil +18%' },
    stats: [{ label: 'SUPPLIERS', value: '8' }, { label: 'PRODUCTS', value: '34' }, { label: 'ORDERS', value: '12' }, { label: 'SPEND', value: '847K' }],
    howLabel: 'How It Works',
    howTitle: 'Up and running in 3 steps',
    howSub: 'No training needed. No complex setup. Just add your suppliers and go.',
    stepLabel: 'STEP',
    steps: [
      { step: '01', icon: '🏪', title: 'Add your suppliers', desc: 'Add the people you buy from — name, phone, category. Add the products you buy and their current prices.' },
      { step: '02', icon: '📲', title: 'Order via WhatsApp', desc: 'Select a supplier, pick what you need, set quantities. Stoqly writes the WhatsApp message. One tap to send.' },
      { step: '03', icon: '🔔', title: 'Get price alerts', desc: 'Every order logs the prices. When a supplier charges more than your threshold, you get an instant alert.' },
    ],
    featLabel: 'Features',
    featTitle: "Everything you need. Nothing you don't.",
    features: [
      { icon: '📲', title: 'WhatsApp Orders', desc: 'Generate a formatted order message and send it to your supplier in one tap. No typing, no mistakes.' },
      { icon: '📈', title: 'Price Tracking', desc: 'Every order automatically logs current prices. See the full history of what you paid over time.' },
      { icon: '🔔', title: 'Price Alerts', desc: 'Set a threshold per product. Get alerted the moment a supplier raises their prices above it.' },
      { icon: '🏪', title: 'Supplier Management', desc: 'All your suppliers in one place. Phone numbers, categories, products, order history.' },
      { icon: '📊', title: 'Spending Reports', desc: 'See exactly how much you spend per supplier per month. Spot where your money is going.' },
      { icon: '🔒', title: 'Your data only', desc: 'Full data isolation. Nobody else can see your suppliers, prices, or orders. Ever.' },
    ],
    pricingLabel: 'Pricing',
    pricingTitle: 'Simple, honest pricing',
    pricingSub: "Start free. Upgrade when you're ready.",
    free: { name: 'Free', price: 'RWF 0', period: 'Forever free', features: ['Up to 3 suppliers', 'Up to 10 products', 'WhatsApp ordering', 'Basic price tracking'], cta: 'Get Started Free' },
    pro: { name: 'Pro', price: 'RWF 8,000', period: 'per month', badge: 'MOST POPULAR', features: ['Unlimited suppliers', 'Unlimited products', 'WhatsApp ordering', 'Full price history', 'Price alerts engine', 'Spending reports'], cta: 'Start Pro Free →' },
    ctaLabel: 'Get Started Today',
    ctaTitle: 'Stop finding out about price increases the hard way.',
    ctaSub: 'Join restaurants in Kigali already using Stoqly 🇷🇼',
    ctaBtn: 'Start Free Today →',
    footer: '© 2026 Stoqly · Built for Kigali 🇷🇼',
    footerLogin: 'Login', footerSignup: 'Sign Up',
  },
  fr: {
    flag: '🇫🇷', lang: 'FR',
    nav: { login: 'Connexion', cta: 'Commencer →' },
    badge: 'Conçu pour les restaurants de Kigali 🇷🇼',
    h1a: 'Votre fournisseur', h1b: 'a augmenté ses prix.', h1c: 'Vous le saviez?',
    sub1: "La plupart des restaurants de Kigali perdent de l'argent sur des hausses de prix qu'ils n'ont pas vues venir.",
    sub2: "Stoqly suit vos prix, vous alerte dès qu'ils changent, et envoie vos commandes via WhatsApp en un clic.",
    cta1: 'Commencer Gratuitement', cta2: 'Se Connecter',
    trust: 'Utilisé par des restaurants à Kigali',
    mockup: { greeting: 'Bonjour 👋', title: "Vue d'ensemble", alert: 'Tomates — Fresh Greens', price: 'RWF 800 → RWF 1,100/kg', btn: '📲 Envoyer via WhatsApp', alertBadge: '🔔 Alerte Prix', alertSub: 'Huile de cuisson +18%' },
    stats: [{ label: 'FOURNISSEURS', value: '8' }, { label: 'PRODUITS', value: '34' }, { label: 'COMMANDES', value: '12' }, { label: 'DÉPENSES', value: '847K' }],
    howLabel: 'Comment ça marche',
    howTitle: 'Opérationnel en 3 étapes',
    howSub: 'Pas de formation. Pas de configuration complexe. Ajoutez vos fournisseurs et démarrez.',
    stepLabel: 'ÉTAPE',
    steps: [
      { step: '01', icon: '🏪', title: 'Ajoutez vos fournisseurs', desc: 'Ajoutez vos fournisseurs — nom, téléphone, catégorie. Ajoutez les produits que vous achetez et leurs prix actuels.' },
      { step: '02', icon: '📲', title: 'Commandez via WhatsApp', desc: "Choisissez un fournisseur, sélectionnez les produits, définissez les quantités. Stoqly rédige le message WhatsApp. Un clic pour envoyer." },
      { step: '03', icon: '🔔', title: 'Recevez des alertes de prix', desc: "Chaque commande enregistre les prix. Quand un fournisseur dépasse votre seuil, vous êtes alerté instantanément." },
    ],
    featLabel: 'Fonctionnalités',
    featTitle: "Tout ce dont vous avez besoin. Rien de plus.",
    features: [
      { icon: '📲', title: 'Commandes WhatsApp', desc: 'Générez un message de commande formaté et envoyez-le à votre fournisseur en un clic.' },
      { icon: '📈', title: 'Suivi des Prix', desc: "Chaque commande enregistre automatiquement les prix actuels. Consultez l'historique complet." },
      { icon: '🔔', title: 'Alertes de Prix', desc: "Définissez un seuil par produit. Soyez alerté dès qu'un fournisseur dépasse ce seuil." },
      { icon: '🏪', title: 'Gestion Fournisseurs', desc: 'Tous vos fournisseurs au même endroit. Téléphones, catégories, produits, historique.' },
      { icon: '📊', title: 'Rapports de Dépenses', desc: 'Voyez exactement combien vous dépensez par fournisseur chaque mois.' },
      { icon: '🔒', title: 'Vos données uniquement', desc: "Isolation complète des données. Personne d'autre ne peut voir vos informations." },
    ],
    pricingLabel: 'Tarification',
    pricingTitle: 'Tarification simple et honnête',
    pricingSub: 'Commencez gratuitement. Passez au niveau supérieur quand vous êtes prêt.',
    free: { name: 'Gratuit', price: 'RWF 0', period: 'Toujours gratuit', features: ["Jusqu'à 3 fournisseurs", "Jusqu'à 10 produits", 'Commandes WhatsApp', 'Suivi des prix de base'], cta: 'Commencer Gratuitement' },
    pro: { name: 'Pro', price: 'RWF 8,000', period: 'par mois', badge: 'PLUS POPULAIRE', features: ['Fournisseurs illimités', 'Produits illimités', 'Commandes WhatsApp', "Historique complet des prix", "Moteur d'alertes de prix", 'Rapports de dépenses'], cta: 'Démarrer Pro Gratuitement →' },
    ctaLabel: "Commencer Aujourd'hui",
    ctaTitle: 'Arrêtez de découvrir les hausses de prix à la dure.',
    ctaSub: 'Rejoignez les restaurants de Kigali qui utilisent déjà Stoqly 🇷🇼',
    ctaBtn: 'Commencer Gratuitement →',
    footer: '© 2026 Stoqly · Conçu pour Kigali 🇷🇼',
    footerLogin: 'Connexion', footerSignup: "S'inscrire",
  }
}

const statColors = ['#1A6B3C', '#2563eb', '#f97316', '#7c3aed']

export default function Home() {
  const [lang, setLang] = useState('en')
  const [isMobile, setIsMobile] = useState(false)
  const t = content[lang]

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768)
    check()
    window.addEventListener('resize', check)
    return () => window.removeEventListener('resize', check)
  }, [])

  return (
    <main style={{ minHeight: '100vh', background: '#0C3D22', color: 'white', fontFamily: 'DM Sans, sans-serif', overflowX: 'hidden' }}>

      {/* NAV */}
      <header style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '16px 20px' : '24px 32px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div style={{ width: '32px', height: '32px', background: '#1A6B3C', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 800, fontSize: '16px', fontFamily: clash }}>S</div>
          <span style={{ fontWeight: 700, fontSize: '20px', letterSpacing: '-0.5px', fontFamily: clash }}>Stoqly</span>
        </div>
        <div style={{ display: 'flex', gap: isMobile ? '8px' : '16px', alignItems: 'center' }}>
          {/* Language Toggle */}
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.08)', borderRadius: '10px', padding: '3px', gap: '2px' }}>
            {(['en', 'fr']).map(l => (
              <button key={l} onClick={() => setLang(l)} style={{ padding: isMobile ? '4px 8px' : '5px 12px', borderRadius: '7px', border: 'none', background: lang === l ? '#1A6B3C' : 'transparent', color: lang === l ? 'white' : 'rgba(255,255,255,0.5)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', transition: 'all 0.15s', fontFamily: clash }}>
                {content[l].flag} {content[l].lang}
              </button>
            ))}
          </div>
          {!isMobile && <Link href="/login"><span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px', cursor: 'pointer' }}>{t.nav.login}</span></Link>}
          <Link href="/signup"><span style={{ background: '#25D366', color: 'white', padding: isMobile ? '8px 14px' : '10px 20px', borderRadius: '10px', fontSize: isMobile ? '12px' : '14px', fontWeight: 700, cursor: 'pointer', fontFamily: clash, whiteSpace: 'nowrap' }}>{isMobile ? 'Start Free' : t.nav.cta}</span></Link>
        </div>
      </header>

      {/* HERO */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '40px 20px 60px' : '80px 32px 100px', display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: isMobile ? '40px' : '80px', alignItems: 'center' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: 'rgba(37,211,102,0.15)', border: '1px solid rgba(37,211,102,0.3)', borderRadius: '20px', padding: '6px 14px', marginBottom: '24px' }}>
            <div style={{ width: '6px', height: '6px', background: '#25D366', borderRadius: '50%' }}></div>
            <span style={{ color: '#25D366', fontSize: '12px', fontWeight: 600 }}>{t.badge}</span>
          </div>

          <h1 style={{ fontSize: isMobile ? '40px' : '52px', fontWeight: 700, lineHeight: 1.05, marginBottom: '20px', letterSpacing: '-1.5px', fontFamily: clash }}>
            {t.h1a}<br />
            <span style={{ color: '#25D366' }}>{t.h1b}</span><br />
            {t.h1c}
          </h1>

          <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: isMobile ? '15px' : '16px', lineHeight: 1.7, marginBottom: '10px', maxWidth: '420px' }}>{t.sub1}</p>
          <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: isMobile ? '14px' : '15px', lineHeight: 1.7, marginBottom: '32px', maxWidth: '420px' }}>{t.sub2}</p>

          <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
            <Link href="/signup">
              <span style={{ background: '#25D366', color: 'white', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 700, cursor: 'pointer', display: 'inline-block', fontFamily: clash }}>{t.cta1}</span>
            </Link>
            <Link href="/login">
              <span style={{ background: 'rgba(255,255,255,0.08)', color: 'white', padding: '14px 28px', borderRadius: '12px', fontSize: '15px', fontWeight: 600, cursor: 'pointer', display: 'inline-block', border: '1px solid rgba(255,255,255,0.12)' }}>{t.cta2}</span>
            </Link>
          </div>

          <div style={{ marginTop: '40px', display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{ display: 'flex' }}>
              {['C','M','A','J'].map((letter, i) => (
                <div key={i} style={{ width: '32px', height: '32px', borderRadius: '50%', background: ['#1A6B3C','#25D366','#0d5c33','#1e8449'][i], border: '2px solid #0C3D22', marginLeft: i > 0 ? '-8px' : '0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 700 }}>{letter}</div>
              ))}
            </div>
            <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px' }}>{t.trust}</p>
          </div>
        </div>

        {/* Mockup — hidden on small mobile, shown on tablet+ */}
        {!isMobile && (
          <div style={{ position: 'relative' }}>
            <div style={{ background: '#F7F4EF', borderRadius: '20px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.4)' }}>
              <div style={{ background: '#0C3D22', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                {[0,1,2].map(i => <div key={i} style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'rgba(255,255,255,0.2)' }}></div>)}
                <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '12px', marginLeft: '8px' }}>stoqly.app/dashboard</span>
              </div>
              <div style={{ padding: '24px' }}>
                <p style={{ fontSize: '13px', color: '#9ca3af', marginBottom: '4px' }}>{t.mockup.greeting}</p>
                <p style={{ fontSize: '20px', fontWeight: 800, color: '#111', marginBottom: '20px', fontFamily: clash }}>{t.mockup.title}</p>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', marginBottom: '16px' }}>
                  {t.stats.map((s, i) => (
                    <div key={i} style={{ background: statColors[i], borderRadius: '12px', padding: '14px' }}>
                      <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{s.label}</p>
                      <p style={{ color: 'white', fontSize: '26px', fontWeight: 800, fontFamily: clash }}>{s.value}</p>
                    </div>
                  ))}
                </div>
                <div style={{ background: '#fff7ed', border: '1px solid #fed7aa', borderRadius: '12px', padding: '12px 14px', marginBottom: '12px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: 700, color: '#c2410c' }}>⚠️ {t.mockup.alert}</p>
                    <p style={{ fontSize: '11px', color: '#9ca3af', marginTop: '2px' }}>{t.mockup.price}</p>
                  </div>
                  <span style={{ background: '#fef2f2', color: '#dc2626', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '6px' }}>+37%</span>
                </div>
                <button style={{ width: '100%', background: '#25D366', color: 'white', border: 'none', borderRadius: '12px', padding: '12px', fontSize: '13px', fontWeight: 700, cursor: 'pointer', fontFamily: clash }}>{t.mockup.btn}</button>
              </div>
            </div>
            <div style={{ position: 'absolute', top: '-16px', right: '-16px', background: '#25D366', borderRadius: '12px', padding: '10px 14px', boxShadow: '0 8px 24px rgba(37,211,102,0.4)' }}>
              <p style={{ color: 'white', fontSize: '11px', fontWeight: 700, fontFamily: clash }}>{t.mockup.alertBadge}</p>
              <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '10px' }}>{t.mockup.alertSub}</p>
            </div>
          </div>
        )}

        {/* Mobile — show a simplified stat strip instead of full mockup */}
        {isMobile && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            {t.stats.map((s, i) => (
              <div key={i} style={{ background: statColors[i], borderRadius: '14px', padding: '16px' }}>
                <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: '9px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '6px' }}>{s.label}</p>
                <p style={{ color: 'white', fontSize: '28px', fontWeight: 800, fontFamily: clash }}>{s.value}</p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* HOW IT WORKS */}
      <section style={{ background: 'rgba(0,0,0,0.15)', padding: isMobile ? '60px 20px' : '100px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>{t.howLabel}</p>
          <h2 style={{ textAlign: 'center', fontSize: isMobile ? '28px' : '38px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-1px', fontFamily: clash }}>{t.howTitle}</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '15px', marginBottom: '48px' }}>{t.howSub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : 'repeat(3, 1fr)', gap: '16px' }}>
            {t.steps.map((s, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '20px', padding: '28px 24px' }}>
                <div style={{ width: '48px', height: '48px', background: '#1A6B3C', borderRadius: '14px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '22px', marginBottom: '16px' }}>{s.icon}</div>
                <p style={{ color: '#25D366', fontSize: '11px', fontWeight: 700, marginBottom: '8px', letterSpacing: '1px' }}>{t.stepLabel} {s.step}</p>
                <p style={{ fontWeight: 700, fontSize: '17px', marginBottom: '10px', fontFamily: clash }}>{s.title}</p>
                <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '14px', lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section style={{ padding: isMobile ? '60px 20px' : '100px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>{t.featLabel}</p>
          <h2 style={{ textAlign: 'center', fontSize: isMobile ? '28px' : '38px', fontWeight: 700, marginBottom: '48px', letterSpacing: '-1px', fontFamily: clash }}>{t.featTitle}</h2>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)', gap: '14px' }}>
            {t.features.map((f, i) => (
              <div key={i} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '16px', padding: isMobile ? '18px 16px' : '24px' }}>
                <div style={{ fontSize: isMobile ? '24px' : '28px', marginBottom: '12px' }}>{f.icon}</div>
                <p style={{ fontWeight: 700, fontSize: isMobile ? '13px' : '15px', marginBottom: '8px', fontFamily: clash }}>{f.title}</p>
                {!isMobile && <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', lineHeight: 1.6 }}>{f.desc}</p>}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section style={{ background: 'rgba(0,0,0,0.15)', padding: isMobile ? '60px 20px' : '100px 32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto' }}>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '12px' }}>{t.pricingLabel}</p>
          <h2 style={{ textAlign: 'center', fontSize: isMobile ? '28px' : '38px', fontWeight: 700, marginBottom: '12px', letterSpacing: '-1px', fontFamily: clash }}>{t.pricingTitle}</h2>
          <p style={{ textAlign: 'center', color: 'rgba(255,255,255,0.4)', fontSize: '15px', marginBottom: '40px' }}>{t.pricingSub}</p>
          <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '20px', maxWidth: '700px', margin: '0 auto' }}>

            {/* Free */}
            <div style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '20px', padding: '28px' }}>
              <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px', fontFamily: clash }}>{t.free.name}</p>
              <p style={{ fontSize: '36px', fontWeight: 700, marginBottom: '4px', fontFamily: clash }}>{t.free.price}</p>
              <p style={{ color: 'rgba(255,255,255,0.4)', fontSize: '13px', marginBottom: '24px' }}>{t.free.period}</p>
              {t.free.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: '#25D366' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.6)', fontSize: '14px' }}>{f}</span>
                </div>
              ))}
              <Link href="/signup">
                <div style={{ marginTop: '24px', width: '100%', background: 'rgba(255,255,255,0.08)', color: 'white', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', textAlign: 'center', fontFamily: clash }}>{t.free.cta}</div>
              </Link>
            </div>

            {/* Pro */}
            <div style={{ background: '#1A6B3C', border: '2px solid #25D366', borderRadius: '20px', padding: '28px', position: 'relative' }}>
              <div style={{ position: 'absolute', top: '-12px', left: '50%', transform: 'translateX(-50%)', background: '#25D366', color: 'white', fontSize: '11px', fontWeight: 700, padding: '4px 12px', borderRadius: '20px', fontFamily: clash, whiteSpace: 'nowrap' }}>{t.pro.badge}</div>
              <p style={{ fontWeight: 700, fontSize: '18px', marginBottom: '8px', fontFamily: clash }}>{t.pro.name}</p>
              <p style={{ fontSize: '36px', fontWeight: 700, marginBottom: '4px', fontFamily: clash }}>{t.pro.price}</p>
              <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '13px', marginBottom: '24px' }}>{t.pro.period}</p>
              {t.pro.features.map((f, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
                  <span style={{ color: '#25D366' }}>✓</span>
                  <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '14px' }}>{f}</span>
                </div>
              ))}
              <Link href="/signup">
                <div style={{ marginTop: '24px', width: '100%', background: '#25D366', color: 'white', borderRadius: '10px', padding: '12px', fontSize: '14px', fontWeight: 700, cursor: 'pointer', textAlign: 'center', fontFamily: clash }}>{t.pro.cta}</div>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: '1100px', margin: '0 auto', padding: isMobile ? '60px 20px' : '100px 32px', textAlign: 'center' }}>
        <div style={{ background: '#1A6B3C', borderRadius: '24px', padding: isMobile ? '40px 24px' : '64px 32px' }}>
          <p style={{ color: '#25D366', fontSize: '12px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '14px' }}>{t.ctaLabel}</p>
          <h2 style={{ fontSize: isMobile ? '26px' : '40px', fontWeight: 700, marginBottom: '14px', letterSpacing: '-0.5px', fontFamily: clash }}>{t.ctaTitle}</h2>
          <p style={{ color: 'rgba(255,255,255,0.55)', fontSize: isMobile ? '14px' : '16px', marginBottom: '32px' }}>{t.ctaSub}</p>
          <Link href="/signup">
            <span style={{ background: '#25D366', color: 'white', padding: isMobile ? '14px 28px' : '16px 40px', borderRadius: '14px', fontSize: isMobile ? '15px' : '16px', fontWeight: 700, cursor: 'pointer', display: 'inline-block', fontFamily: clash }}>{t.ctaBtn}</span>
          </Link>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{ borderTop: '1px solid rgba(255,255,255,0.08)', padding: isMobile ? '24px 20px' : '32px' }}>
        <div style={{ maxWidth: '1100px', margin: '0 auto', display: 'flex', flexDirection: isMobile ? 'column' : 'row', justifyContent: 'space-between', alignItems: 'center', gap: '16px', textAlign: isMobile ? 'center' : 'left' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', justifyContent: isMobile ? 'center' : 'flex-start' }}>
            <div style={{ width: '24px', height: '24px', background: '#1A6B3C', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: 800, fontFamily: clash }}>S</div>
            <span style={{ fontWeight: 700, fontSize: '14px', fontFamily: clash }}>Stoqly</span>
          </div>
          <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px' }}>{t.footer}</p>
          <div style={{ display: 'flex', gap: '20px', justifyContent: isMobile ? 'center' : 'flex-end' }}>
            <Link href="/login"><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', cursor: 'pointer' }}>{t.footerLogin}</span></Link>
            <Link href="/signup"><span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '13px', cursor: 'pointer' }}>{t.footerSignup}</span></Link>
          </div>
        </div>
      </footer>

    </main>
  )
}