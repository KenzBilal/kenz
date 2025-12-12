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