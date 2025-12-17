/* ======================================================
   CashTree Loot – FULL SCRIPT (SAFE & FIXED)
   ====================================================== */

/* -------------------------
   NAV TOGGLE (MOBILE ONLY)
-------------------------- */
(function () {
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.querySelector('.nav-links');

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.contains('open');
    navLinks.classList.toggle('open', !isOpen);
  });
})();

/* -------------------------
   FOOTER YEAR
-------------------------- */
(function () {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* -------------------------
   FAQ ACCORDION
-------------------------- */
(function () {
  const items = document.querySelectorAll('.faq-item');
  if (!items.length) return;

  items.forEach(item => {
    const btn = item.querySelector('.faq-question');
    const answer = item.querySelector('.faq-answer');
    if (!btn || !answer) return;

    btn.addEventListener('click', () => {
      const isOpen = answer.style.maxHeight && answer.style.maxHeight !== '0px';

      // Close all
      document.querySelectorAll('.faq-answer').forEach(a => {
        a.style.maxHeight = null;
      });

      // Open current
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + 'px';
      }
    });
  });
})();

/* -------------------------
   SMOOTH SCROLL (SAFE)
-------------------------- */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', e => {
      const targetId = anchor.getAttribute('href');
      if (!targetId || targetId === '#') return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });
})();

/* ======================================================
   MOBILE FLOATING CTA SYSTEM (ISOLATED & SAFE)
   ====================================================== */
(function () {
  const cta = document.getElementById('mobileCta');
  if (!cta) return;

  // 🚫 Desktop must NEVER be affected
  if (window.innerWidth > 980) {
    cta.style.display = 'none';
    return;
  }

  const STORAGE_KEY = 'cashtree_mobile_cta';
  const state = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');

  // If user already clicked → never show again
  if (state.clicked) return;

  // If closed in last 24h → don’t show
  if (state.closedAt && Date.now() - state.closedAt < 86400000) return;

  let shown = false;

  // Show CTA after 40% scroll
  window.addEventListener('scroll', () => {
    if (shown) return;

    const scrollRatio =
      (window.scrollY + window.innerHeight) / document.body.scrollHeight;

    if (scrollRatio > 0.4) {
      cta.classList.add('show');
      shown = true;
    }
  });

  // CTA main click → permanent hide
  const mainBtn = cta.querySelector('.cta-main');
  if (mainBtn) {
    mainBtn.addEventListener('click', () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ clicked: true })
      );
    });
  }

  // CTA close → hide for 24h
  const closeBtn = cta.querySelector('.cta-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      cta.classList.remove('show');
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ closedAt: Date.now() })
      );
    });
  }
})();

/* ======================================================
   CLICK SAFETY FIX (ADS / OVERLAYS)
   ====================================================== */
(function () {
  // Ensure buttons are always clickable
  document.querySelectorAll('a, button, .btn').forEach(el => {
    el.style.pointerEvents = 'auto';
  });

  // Prevent injected ad layers from blocking clicks
  document.querySelectorAll('iframe, script').forEach(el => {
    el.style.pointerEvents = 'auto';
  });
})();
