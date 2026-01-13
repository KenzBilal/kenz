/* =========================================
   1. SQL CONNECTION
   ========================================= */
const supabaseUrl = 'https://qzjvratinjirrcmgzjlx.supabase.co';
const supabaseKey = 'sb_publishable_AB7iUKxOU50vnoqllSfAnQ_Wdji8gEc';
const supabase = supabase.createClient(supabaseUrl, supabaseKey);

document.addEventListener("DOMContentLoaded", () => {

  /* =========================================
     2. MOBILE MENU
     ========================================= */
  const toggle = document.getElementById("navToggle");
  const navLinks = document.getElementById("navLinks");

  if (toggle && navLinks) {
    toggle.onclick = function(e) {
      e.preventDefault();
      e.stopPropagation();
      navLinks.classList.toggle("nav-open");
      const isOpen = navLinks.classList.contains("nav-open");
      toggle.innerHTML = isOpen ? "✕" : "☰"; 
      toggle.setAttribute("aria-expanded", isOpen);
    };

    document.addEventListener("click", (e) => {
      if (!navLinks.contains(e.target) && !toggle.contains(e.target)) {
        navLinks.classList.remove("nav-open");
        toggle.innerHTML = "☰";
      }
    });
  }

  /* =========================================
     3. FAQ ACCORDION (Smart Close)
     ========================================= */
  const faqItems = document.querySelectorAll(".faq-item");
  faqItems.forEach(item => {
    const question = item.querySelector(".faq-question");
    if (question) {
      question.onclick = function() {
        const isActive = item.classList.contains("active");
        faqItems.forEach(other => other.classList.remove("active"));
        if (!isActive) item.classList.add("active");
      };
    }
  });

  /* =========================================
     4. SMART CTA (50% SCROLL + 24H MEMORY)
     ========================================= */
  const mobileCta = document.getElementById("mobileCta");
  // This selects the button from your HTML snippet
  const ctaClose = document.querySelector(".cta-close");
  const ONE_DAY_MS = 24 * 60 * 60 * 1000;

  function checkCtaVisibility() {
    if (!mobileCta) return;

    // A. Check Memory (Last 24h)
    const lastClosed = localStorage.getItem("ctaClosedTime");
    const now = new Date().getTime();
    if (lastClosed && (now - lastClosed < ONE_DAY_MS)) {
      return; 
    }

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
      // Save 24h Memory
      localStorage.setItem("ctaClosedTime", new Date().getTime());
    };
  }

  /* =========================================
     5. DASHBOARD REDIRECT
     ========================================= */
  const dashLink = document.getElementById("menuDashboardLink");
  const partnerId = localStorage.getItem("p_id");
  if (dashLink && partnerId) {
    dashLink.href = "dashboard/index.html";
  }

});
