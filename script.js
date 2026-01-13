/* ======================================================
   CLICK SAFETY FIX
   Prevent ads / overlays blocking buttons & links
====================================================== */
(function () {
  document.querySelectorAll("a, button").forEach(el => {
    el.style.pointerEvents = "auto";
  });
})();

/* ======================================================
   FAQ ACCORDION
====================================================== */
document.querySelectorAll(".faq-question").forEach(q => {
  q.addEventListener("click", () => {
    const item = q.closest(".faq-item");
    if (!item) return;

    item.classList.toggle("open");
  });
});

/* ======================================================
   TELEGRAM CTA (SAFE)
====================================================== */
document.querySelectorAll(".telegram-cta").forEach(btn => {
  btn.addEventListener("click", () => {
    window.open("https://t.me/CashTreeee", "_blank");
  });
});

/* ======================================================
   OFFER EXPIRY CHECK (IF EXISTS)
====================================================== */
(function(){
  const btn = document.getElementById("payBtn");
  if (!btn) return;

  const offerEnd = new Date("2025-01-05T23:59:59");
  if (new Date() > offerEnd) {
    btn.classList.add("no-offer");
  }
})();

/* ======================================================
   NAVIGATION + DASHBOARD (DESKTOP + MOBILE)
====================================================== */
document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("navLinks");
  const dashLink = document.getElementById("menuDashboardLink");

  if (!toggle || !nav) return;

  /* ---- MOBILE MENU TOGGLE ---- */
  toggle.addEventListener("click", (e) => {
    e.stopPropagation();
    nav.classList.toggle("nav-open");

    toggle.setAttribute(
      "aria-expanded",
      nav.classList.contains("nav-open")
    );
  });

  /* ---- CLOSE MENU ON OUTSIDE CLICK ---- */
  document.addEventListener("click", () => {
    nav.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  });

  /* ---- CLOSE MENU ON LINK CLICK ---- */
  nav.querySelectorAll("a").forEach(link => {
    link.addEventListener("click", () => {
      nav.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });

  /* ---- SMART DASHBOARD LINK ---- */
  const code = localStorage.getItem("cashttree_referral");
  if (code && dashLink) {
    dashLink.href = "/dashboard/?code=" + code;
  }
});

/* ======================================================
   OPTIONAL: SMOOTH SCROLL (SAFE)
====================================================== */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener("click", function (e) {
    const target = document.querySelector(this.getAttribute("href"));
    if (!target) return;

    e.preventDefault();
    target.scrollIntoView({ behavior: "smooth" });
  });
});
