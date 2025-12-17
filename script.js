// Small, clear interactions: nav toggle, FAQ accordion, footer year, smooth scroll

// NAV TOGGLE (mobile)
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isVisible = getComputedStyle(navLinks).display === 'flex';
    navLinks.style.display = isVisible ? 'none' : 'flex';
  });
}

// FOOTER YEAR
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// FAQ accordion
document.querySelectorAll('.faq-item').forEach(item => {
  const btn = item.querySelector('.faq-question');
  const answer = item.querySelector('.faq-answer');
  btn && btn.addEventListener('click', () => {
    const open = answer.style.maxHeight && answer.style.maxHeight !== '0px';
    // close all
    document.querySelectorAll('.faq-answer').forEach(a => a.style.maxHeight = null);
    if (!open) {
      answer.style.maxHeight = answer.scrollHeight + 'px';
    }
  });
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (href && href.startsWith('#')) {
      e.preventDefault();
      const target = document.querySelector(href);
      if (target) target.scrollIntoView({behavior: 'smooth', block: 'start'});
    }
  });

});
// ===============================
// SMART MOBILE CTA SYSTEM
// ===============================
(function () {
  const cta = document.getElementById("mobileCta");
  if (!cta) return;

  const STORAGE_KEY = "cashtree_cta_state";
  const state = JSON.parse(localStorage.getItem(STORAGE_KEY)) || {};

  // If CTA was clicked, never show again
  if (state.clicked) return;

  // If CTA was closed less than 24h ago, don't show
  if (state.closedAt && Date.now() - state.closedAt < 24 * 60 * 60 * 1000) {
    return;
  }

  let shown = false;

  // Show after 40% scroll
  window.addEventListener("scroll", () => {
    if (shown) return;

    const scrollPercent =
      (window.scrollY + window.innerHeight) / document.body.scrollHeight;

    if (scrollPercent > 0.4) {
      cta.classList.add("show");
      shown = true;
    }
  });

  // CTA click → permanent hide
  cta.querySelector(".cta-main").addEventListener("click", () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ clicked: true })
    );
  });

  // CTA close → hide for 24 hours
  cta.querySelector(".cta-close").addEventListener("click", () => {
    cta.style.display = "none";
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({ closedAt: Date.now() })
    );
  });
})();
