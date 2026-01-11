/* ================= FAQ ACCORDION ================= */
(function () {
  const faqItems = document.querySelectorAll(".faq-item");

  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const btn = item.querySelector(".faq-question");
    const answer = item.querySelector(".faq-answer");

    if (!btn || !answer) return;

    btn.addEventListener("click", () => {
      const isOpen = answer.style.maxHeight;

      // Close all
      document.querySelectorAll(".faq-answer").forEach(a => {
        a.style.maxHeight = null;
      });

      // Open selected
      if (!isOpen) {
        answer.style.maxHeight = answer.scrollHeight + "px";
      }
    });
  });
})();


/* ================= SMOOTH SCROLL (SAFE) ================= */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (!targetId || targetId === "#") return;

      const target = document.querySelector(targetId);
      if (!target) return;

      e.preventDefault();
      target.scrollIntoView({
        behavior: "smooth",
        block: "start"
      });
    });
  });
})();


/* ================= MOBILE FLOATING CTA ================= */
(function () {
  const cta = document.getElementById("mobileCta");
  if (!cta) return;

  // Disable on desktop
  if (window.innerWidth >= 981) return;

  const STORAGE_KEY = "cashtree_mobile_cta";
  const stored = JSON.parse(localStorage.getItem(STORAGE_KEY) || "{}");

  if (stored.clicked) return;
  if (stored.closedAt && Date.now() - stored.closedAt < 24 * 60 * 60 * 1000) {
    return;
  }

  let shown = false;

  window.addEventListener("scroll", () => {
    if (shown) return;

    const scrollRatio =
      (window.scrollY + window.innerHeight) / document.body.scrollHeight;

    if (scrollRatio > 0.45) {
      cta.classList.add("show");
      shown = true;
    }
  });

  const mainBtn = cta.querySelector(".cta-main");
  const closeBtn = cta.querySelector(".cta-close");

  if (mainBtn) {
    mainBtn.addEventListener("click", () => {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ clicked: true })
      );
    });
  }

  if (closeBtn) {
    closeBtn.addEventListener("click", () => {
      cta.style.display = "none";
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify({ closedAt: Date.now() })
      );
    });
  }
})();


/* ================= CLICK SAFETY FIX ================= */
/* Ensures ads or overlays never block buttons */
(function () {
  document.querySelectorAll("a, button").forEach(el => {
    el.style.pointerEvents = "auto";
  });
})();

/* ================= OFFER EXPIRY CHECK ================= */
(function(){
  const btn = document.getElementById("payBtn");
  if(!btn) return;

  // 🔴 Offer ends Jan 5 (local time)
  const offerEnd = new Date("2025-01-05T23:59:59");
  const now = new Date();

  if(now > offerEnd){
    btn.classList.add("no-offer");
  }
})();

/* ================= NAV MENU + DASHBOARD (FINAL) ================= */

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("navLinks");
  const dashLink = document.getElementById("menuDashboardLink");

  if (!toggle || !nav) return;

  /* Toggle mobile menu */
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("nav-open");

    toggle.setAttribute(
      "aria-expanded",
      nav.classList.contains("nav-open")
    );
  });

  /* Smart dashboard link */
  const code = localStorage.getItem("cashttree_referral");
  if (code && dashLink) {
    dashLink.href = "/dashboard/?code=" + code;
  }

  /* Close menu when clicking outside */
  document.addEventListener("click", () => {
    nav.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  });
});

