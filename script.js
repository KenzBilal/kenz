/* ======================================================
   CashTree Loot – Production Script
   Safe | Stable | No UI Breakage
====================================================== */

/* ================= NAV TOGGLE (MOBILE ONLY) ================= */
(function () {
  const navToggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (!navToggle || !navLinks) return;

  navToggle.addEventListener("click", () => {
    const isOpen = navLinks.style.display === "flex";
    navLinks.style.display = isOpen ? "none" : "flex";
    navLinks.style.flexDirection = "column";
    navLinks.style.gap = "12px";
  });
})();

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
