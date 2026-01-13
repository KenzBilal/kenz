/* =========================================
   1. SQL CONNECTION (New Feature)
   ========================================= */
const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

/* =========================================
   2. CLICK SAFETY FIX (From Old Script)
   Prevents Ads/Overlays from blocking clicks
   ========================================= */
(function () {
  document.querySelectorAll("a, button").forEach(el => {
    el.style.pointerEvents = "auto";
  });
})();

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     3. MOBILE MENU (RESTORED EXACTLY FROM OLD)
     ========================================= */
  const toggle = document.getElementById("navToggle");
  const nav = document.getElementById("navLinks");

  if (toggle && nav) {
    // A. Toggle Menu on Click (Using EventListener like old script)
    toggle.addEventListener("click", (e) => {
      e.stopPropagation(); // Stop click from closing it immediately
      nav.classList.toggle("nav-open");
      
      // Update ARIA for accessibility (Old Script logic)
      toggle.setAttribute("aria-expanded", nav.classList.contains("nav-open"));
    });

    // B. Close when clicking OUTSIDE
  document.addEventListener("click", (e) => {
  if (!nav.contains(e.target) && !toggle.contains(e.target)) {
    nav.classList.remove("nav-open");
    toggle.setAttribute("aria-expanded", "false");
  }
});


    // C. Close when clicking a LINK inside (Missing in my previous version)
    nav.querySelectorAll("a").forEach(link => {
      link.addEventListener("click", () => {
        nav.classList.remove("nav-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  /* =========================================
     4. FAQ ACCORDION
     ========================================= */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.addEventListener("click", () => {
        const isActive = item.classList.contains("active");
        // Close all others
        faqItems.forEach(other => other.classList.remove("active"));
        // Toggle current
        if (!isActive) item.classList.add("active");
      });
    }
  });

  /* =========================================
     5. SMART CTA (BLUE BUTTON LOGIC)
     ========================================= */
  const mobileCta = document.getElementById("mobileCta");
  const ctaClose = document.querySelector(".cta-close");
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  function checkCtaVisibility() {
    if (!mobileCta) return;

    // A. Check Memory (Last 24h)
    const lastClosed = localStorage.getItem("ctaClosedTime");
    const now = new Date().getTime();
    if (lastClosed && (now - lastClosed < ONE_DAY_MS)) return; 

    // B. Check Scroll (50%)
    const scrollPosition = window.scrollY + window.innerHeight;
    const pageHeight = document.documentElement.scrollHeight;
    const scrollPercentage = (scrollPosition / pageHeight) * 100;

    if (scrollPercentage > 50) {
      mobileCta.classList.add("visible");
    }
  }

  window.addEventListener("scroll", checkCtaVisibility);

  if (ctaClose && mobileCta) {
    ctaClose.onclick = function() {
      mobileCta.classList.remove("visible");
      localStorage.setItem("ctaClosedTime", new Date().getTime());
    };
  }

  /* =========================================
     6. OFFER EXPIRY CHECK (From Old Script)
     ========================================= */
  const btn = document.getElementById("payBtn");
  if (btn) {
    // Update date if needed
    const offerEnd = new Date("2026-01-05T23:59:59"); 
    if (new Date() > offerEnd) {
      btn.classList.add("no-offer");
    }
  }

  /* =========================================
     7. DASHBOARD REDIRECT (HYBRID)
     ========================================= */
  const dashLink = document.getElementById("menuDashboardLink");
  const oldCode = localStorage.getItem("cashttree_referral");
  const partnerId = localStorage.getItem("p_id");

  if (dashLink) {
    if (partnerId) {
      dashLink.href = "dashboard/index.html";
    } else if (oldCode) {
      dashLink.href = "dashboard/index.html?code=" + oldCode;
    }
  }

});

