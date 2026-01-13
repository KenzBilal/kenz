/* =========================================
   1. VARIABLES & THEME
   ========================================= */
:root {
  --bg-1: #04060a;
  --bg-2: #07101a;
  --card: rgba(255, 255, 255, 0.04);
  --border: rgba(255, 255, 255, 0.08);
  --text: #eaf2f8;
  --muted: #90a0b0;
  
  --accent: #22c55e;       /* Vibrant Green */
  --accent-dark: #15803d;
  --cyan: #22d3ee;         /* Cyan for CTA */
  --gold: #f59e0b;         /* Premium Gold */
  
  --nav-height: 64px;
}

/* =========================================
   2. RESET & BASE
   ========================================= */
*, *::before, *::after { box-sizing: border-box; }

html, body {
  height: 100%;
  margin: 0;
  scroll-behavior: smooth;
}

body {
  font-family: 'Inter', system-ui, -apple-system, sans-serif;
  color: var(--text);
  line-height: 1.6;
  background: 
    radial-gradient(1200px 600px at 12% 12%, rgba(36, 54, 60, 0.12), transparent 60%),
    linear-gradient(180deg, var(--bg-1), var(--bg-2) 65%);
  -webkit-font-smoothing: antialiased;
}

a { text-decoration: none; color: inherit; }

/* =========================================
   3. NAVIGATION (FIXED SYNTAX)
   ========================================= */
.nav {
  position: sticky;
  top: 0;
  z-index: 2000;
  background: rgba(4, 6, 10, 0.85);
  backdrop-filter: blur(12px);
  border-bottom: 1px solid var(--border);
}

.nav-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: var(--nav-height);
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 20px;
}

.brand { display: flex; align-items: center; gap: 10px; }
.brand-logo { width: 34px; height: auto; }
.brand-text { font-size: 20px; font-weight: 800; letter-spacing: -0.5px; }
.brand-text span { color: var(--accent); }

.nav-links { display: flex; gap: 8px; }
.nav-links a {
  font-size: 14px;
  font-weight: 600;
  padding: 8px 16px;
  border-radius: 10px;
  transition: background 0.2s;
}

#menuDashboardLink {
  background: linear-gradient(180deg, var(--accent), var(--accent-dark));
  color: #022c22 !important;
}

.nav-toggle {
  display: none;
  background: none;
  border: none;
  color: #fff;
  font-size: 28px;
  cursor: pointer;
}

/* =========================================
   4. HERO SECTION
   ========================================= */
.hero { padding: 60px 0; text-align: left; }
.hero h1 {
  font-size: clamp(2.2rem, 4vw, 3rem);
  line-height: 1.15;
  margin-bottom: 16px;
  font-weight: 800;
}

.lead {
  color: var(--muted);
  max-width: 680px;
  font-size: 1.1rem;
  margin-bottom: 40px;
}

.hero-actions-equal {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
}

.hero-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: linear-gradient(180deg, #22c55e, #16a34a);
  color: #022c22;
  padding: 24px 16px;
  border-radius: 20px;
  font-weight: 800;
  box-shadow: 0 10px 40px -10px rgba(34, 197, 94, 0.5);
  transition: transform 0.2s;
}

.create-link-cta {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  width: 100%;
  max-width: 450px;
  padding: 18px 30px;
  margin-top: 30px;
  border-radius: 24px;
  background: rgba(6, 40, 40, 0.6);
  border: 1px solid rgba(34, 211, 238, 0.3);
  color: #67e8f9;
  font-weight: 700;
}

/* =========================================
   5. OFFER CARDS
   ========================================= */
.offer-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 24px;
  margin-top: 30px;
}

.offer-card {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 20px;
  padding: 26px;
  position: relative;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.premium-offer {
  border: 1px solid rgba(245, 158, 11, 0.3);
  background: linear-gradient(180deg, rgba(245, 158, 11, 0.08), rgba(4,6,10,0.5));
}

.premium-badge {
  position: absolute;
  top: 14px; right: 14px;
  background: var(--gold);
  color: #3a2200;
  font-size: 10px;
  font-weight: 800;
  padding: 4px 10px;
  border-radius: 20px;
}

.offer-points { padding-left: 20px; color: var(--muted); font-size: 0.95rem; margin: 0; }
.earn strong { color: var(--accent); font-size: 1.3rem; }

.btn.primary {
  display: flex;
  justify-content: center;
  padding: 12px;
  border-radius: 12px;
  background: linear-gradient(180deg, var(--accent), var(--accent-dark));
  color: #022c22;
  font-weight: 700;
}

/* =========================================
   7. FAQ ACCORDION
   ========================================= */
.faq-item {
  background: var(--card);
  border: 1px solid var(--border);
  border-radius: 16px;
  margin-bottom: 12px;
  overflow: hidden;
}

.faq-question {
  width: 100%;
  padding: 20px;
  background: none;
  border: none;
  color: var(--text);
  font-weight: 600;
  display: flex;
  justify-content: space-between;
  cursor: pointer;
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  padding: 0 20px;
  transition: 0.3s ease;
}

.faq-item.active .faq-answer {
  max-height: 500px;
  padding-bottom: 20px;
}

/* =========================================
   10. MOBILE RESPONSIVENESS
   ========================================= */
@media (max-width: 768px) {
  .nav-toggle { display: block; }
  
  .nav-links {
    display: none;
    flex-direction: column;
    position: absolute;
    top: var(--nav-height);
    right: 20px;
    background: #0b121a;
    border: 1px solid var(--border);
    border-radius: 12px;
    padding: 15px;
    width: 200px;
    z-index: 3000;
  }

  /* CRITICAL: Must match script.js toggle */
  .nav-links.nav-open { display: flex !important; }

  .offer-grid { grid-template-columns: 1fr; }
  
  .hero-actions-equal { 
    grid-template-columns: repeat(3, 1fr);
    gap: 8px;
  }
  
  .hero-btn { 
    padding: 12px 4px;
    font-size: 0.75rem;
    border-radius: 12px;
    min-height: 60px;
  }
     }
   
