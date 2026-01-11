/* =====================================================
   CASHTREE LOOT - OPTIMIZED PROJECT SCRIPT
   Handles: Navigation, Dashboard, Expiry, & Smooth Scroll
===================================================== */

document.addEventListener("DOMContentLoaded", () => {
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("navLinks");
  const dashLink = document.getElementById("menuDashboardLink");
  const payBtn = document.getElementById("payBtn");

  /* 1. MOBILE NAV LOGIC */
  if (toggle && nav) {
    toggle.addEventListener("click", (e) => {
      e.stopPropagation();
      nav.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", nav.classList.contains("nav-open"));
    });

    // Close menu when a link is clicked (Fixes mobile overlay issue)
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });

    // Close menu when clicking anywhere else on the screen
    document.addEventListener("click", (e) => {
      if (!nav.contains(e.target) && !toggle.contains(e.target)) {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* 2. SMART DASHBOARD LINK */
  const code = localStorage.getItem("cashttree_referral");
  if (code && dashLink) {
    dashLink.href = "/dashboard/?code=" + code;
  }

  /* 3. CHRISTMAS OFFER EXPIRY LOGIC */
  if (payBtn) {
    // Current date logic for Jan 2026
    const expiryDate = new Date("2026-01-31T23:59:59"); 
    if (new Date() > expiryDate) {
      payBtn.classList.add("no-offer");
    }
  }

  /* 4. SMOOTH SCROLLING FOR ALL ANCHORS */
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener("click", function (e) {
      const targetId = this.getAttribute("href");
      if (targetId === "#") return;
      
      const targetElement = document.querySelector(targetId);
      if (targetElement) {
        e.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth",
          block: "start"
        });
      }
    });
  });
});
